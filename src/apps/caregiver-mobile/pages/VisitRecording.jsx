import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import CryptoJS from 'crypto-js';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Toast from '../ui/Toast';
import { processConsultation } from '../../../api/consultations';
import { getCurrentUser } from '../../../api/users';
import './VisitRecording.css';

const DEFAULT_CLIENT = { name: '박영희' };
const WAVEFORM_BARS = Array.from({ length: 28 }, (_, i) => i);

// 서버 업로드에 실패한 녹음을 기기에 암호화 보관할 때 쓰는 저장 키.
// 앱이 종료되었다 다시 켜져도 이 값으로 복호화 키/파일 경로를 복원해 재시도할 수 있다.
// 한 번에 하나의 미전송 녹음만 보관한다고 가정한다 (MVP 범위).
const PENDING_RECORDING_KEY = 'careon_pending_recording';

const MIME_EXTENSIONS = {
    'audio/aac': 'aac',
    'audio/mp4': 'm4a',
    'audio/webm': 'webm',
};

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function extensionFor(mimeType) {
    const key = Object.keys(MIME_EXTENSIONS).find((prefix) => mimeType?.startsWith(prefix));
    return key ? MIME_EXTENSIONS[key] : 'audio';
}

function base64ToFile(base64, mimeType, filename) {
    const bytes = atob(base64);
    const buffer = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) {
        buffer[i] = bytes.charCodeAt(i);
    }
    return new File([buffer], filename, { type: mimeType });
}

function VisitRecording() {
    const navigate = useNavigate();
    const location = useLocation();
    const client = location.state?.client ?? DEFAULT_CLIENT;

    // phase: starting | recording | paused | uploading | failed
    const [phase, setPhase] = useState('starting');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const consultedAtRef = useRef(null);
    const encryptionKeyRef = useRef(null);
    const localPathRef = useRef(null);
    const pendingAudioRef = useRef(null);
    const recipientIdRef = useRef(client.clientId ?? null);

    useEffect(() => {
        let cancelled = false;

        async function begin() {
            // 기기에 아직 서버로 못 보낸 암호화 녹음이 있으면(앱 종료/크래시 등으로 중단된 경우),
            // 새 녹음을 시작하지 않고 그 녹음의 재시도 화면부터 보여준다.
            const { value } = await Preferences.get({ key: PENDING_RECORDING_KEY });
            if (value) {
                if (cancelled) return;
                const pending = JSON.parse(value);
                localPathRef.current = pending.localPath;
                encryptionKeyRef.current = pending.encryptionKey;
                pendingAudioRef.current = pending.mimeType;
                consultedAtRef.current = pending.consultedAt;
                recipientIdRef.current = pending.recipientId;
                setUploadError('이전에 저장하지 못한 녹음이 있습니다. 다시 업로드해 주세요.');
                setPhase('failed');
                return;
            }

            const permission = await VoiceRecorder.hasAudioRecordingPermission();
            if (!permission.value) {
                const requested = await VoiceRecorder.requestAudioRecordingPermission();
                if (!requested.value) {
                    if (!cancelled) {
                        setUploadError('마이크 권한이 필요합니다.');
                        setPhase('failed');
                    }
                    return;
                }
            }
            await VoiceRecorder.startRecording();
            if (cancelled) return;
            consultedAtRef.current = new Date().toISOString();
            setPhase('recording');
        }

        begin();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (phase !== 'recording') return undefined;
        const timer = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [phase]);

    const handleTogglePause = async () => {
        if (phase === 'recording') {
            await VoiceRecorder.pauseRecording();
            setPhase('paused');
        } else if (phase === 'paused') {
            await VoiceRecorder.resumeRecording();
            setPhase('recording');
        }
    };

    const handleCancel = async () => {
        if (phase === 'recording' || phase === 'paused') {
            await VoiceRecorder.stopRecording();
        }
        navigate(-1);
    };

    // 로컬에 AES로 암호화 저장된 파일을 서버로 업로드 시도.
    // 성공 시 로컬 파일 + 영속 저장된 재시도 정보를 모두 삭제, 실패 시 그대로 보관해 재시도할 수 있게 한다.
    const attemptUpload = async (base64Audio, mimeType) => {
        setPhase('uploading');
        setUploadError('');
        try {
            const file = base64ToFile(base64Audio, mimeType, `visit-${Date.now()}.${extensionFor(mimeType)}`);
            const caregiver = await getCurrentUser();
            const result = await processConsultation({
                caregiverId: caregiver.id,
                recipientId: recipientIdRef.current,
                consultedAt: consultedAtRef.current,
                file,
            });

            await Filesystem.deleteFile({ path: localPathRef.current, directory: Directory.Data });
            await Preferences.remove({ key: PENDING_RECORDING_KEY });
            pendingAudioRef.current = null;
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/ai-draft-review', { state: { log: result } });
            }, 1500);
        } catch (error) {
            setUploadError(error.message);
            setPhase('failed');
        }
    };

    const handleComplete = async () => {
        if (phase !== 'recording' && phase !== 'paused') return;

        const { value } = await VoiceRecorder.stopRecording();
        const { recordDataBase64, mimeType } = value;

        const key = CryptoJS.lib.WordArray.random(256 / 8).toString();
        const encrypted = CryptoJS.AES.encrypt(recordDataBase64, key).toString();
        const localPath = `recordings/${Date.now()}.enc`;

        await Filesystem.writeFile({
            path: localPath,
            data: encrypted,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            recursive: true,
        });

        encryptionKeyRef.current = key;
        localPathRef.current = localPath;
        pendingAudioRef.current = mimeType;

        await Preferences.set({
            key: PENDING_RECORDING_KEY,
            value: JSON.stringify({
                localPath,
                encryptionKey: key,
                mimeType,
                recipientId: recipientIdRef.current,
                consultedAt: consultedAtRef.current,
            }),
        });

        await attemptUpload(recordDataBase64, mimeType);
    };

    // 재시도: 로컬에 암호화 보관된 파일을 다시 읽어 복호화한 뒤 업로드를 다시 시도한다.
    const handleRetry = async () => {
        const { value } = await Filesystem.readFile({
            path: localPathRef.current,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
        const decrypted = CryptoJS.AES.decrypt(value, encryptionKeyRef.current).toString(CryptoJS.enc.Utf8);
        await attemptUpload(decrypted, pendingAudioRef.current);
    };

    const isActive = phase === 'recording' || phase === 'paused';

    return (
        <div className="cg-rec">
            <StatusBar />

            <PageHeader title="방문 상담 중" subtitle={`${client.name} · 2026.05.26 10:32`} />

            <div className="cg-rec-body">
                <p className="cg-rec-timer">{formatTime(elapsedSeconds)}</p>

                <div className="cg-rec-status">
                    <span className={`cg-rec-status-dot${phase === 'recording' ? ' active' : ''}`} />
                    <span className={`cg-rec-status-text${phase === 'recording' ? ' active' : ''}`}>
                        {phase === 'paused' ? '일시정지' : '녹음 중'}
                    </span>
                </div>

                <div className="cg-rec-control">
                    <button
                        type="button"
                        className="cg-rec-circle-button"
                        onClick={handleTogglePause}
                        disabled={!isActive}
                    >
                        <span className="cg-rec-circle-inner">
                            <i className={`bi ${phase === 'recording' ? 'bi-pause-fill' : 'bi-mic-fill'}`} />
                        </span>
                    </button>
                    <p className="cg-rec-control-caption">
                        {phase === 'recording' ? '탭하여 일시정지' : '탭하여 재개'}
                    </p>
                </div>

                <div className="cg-rec-notice">
                    <p className="cg-rec-notice-title">
                        <i className="bi bi-broadcast" /> 실시간 음성 감지 중
                    </p>
                    <p className="cg-rec-notice-text">
                        방문 상담 내용을 자유롭게 말씀해 주세요.<br />
                        STT 변환 후 원본 음성은 즉시 폐기됩니다.
                    </p>
                </div>

                {phase === 'failed' && (
                    <div className="cg-rec-notice">
                        <p className="cg-rec-notice-title">
                            <i className="bi bi-exclamation-triangle" /> 업로드 실패
                        </p>
                        <p className="cg-rec-notice-text">
                            {uploadError || '서버 업로드에 실패했습니다.'} 녹음 파일은 기기에 암호화되어 보관 중입니다.
                        </p>
                    </div>
                )}

                <div className={`cg-rec-waveform${phase === 'recording' ? ' active' : ''}`}>
                    {WAVEFORM_BARS.map((bar) => (
                        <span
                            key={bar}
                            className="cg-rec-waveform-bar"
                            style={{ animationDelay: `${(bar % 7) * 0.08}s` }}
                        />
                    ))}
                </div>

                {phase === 'failed' ? (
                    <button className="cg-rec-complete-button" type="button" onClick={handleRetry}>
                        다시 시도
                    </button>
                ) : (
                    <button
                        className="cg-rec-complete-button"
                        type="button"
                        onClick={handleComplete}
                        disabled={!isActive}
                    >
                        {phase === 'uploading' ? '처리 중...' : '녹음 완료'}
                    </button>
                )}
                <button className="cg-rec-cancel-button" type="button" onClick={handleCancel}>
                    취소
                </button>
            </div>

            <BottomMenu />
            <Toast message="저장되었습니다" visible={showToast} />
        </div>
    );
}

export default VisitRecording;