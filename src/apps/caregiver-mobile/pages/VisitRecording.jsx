import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Toast from '../ui/Toast';
import './VisitRecording.css';

const DEFAULT_CLIENT = { name: '박영희' };
const WAVEFORM_BARS = Array.from({ length: 28 }, (_, i) => i);

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function VisitRecording() {
    const navigate = useNavigate();
    const location = useLocation();
    const client = location.state?.client ?? DEFAULT_CLIENT;

    const [isRecording, setIsRecording] = useState(true);
    const [elapsedSeconds, setElapsedSeconds] = useState(154);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!isRecording) return undefined;
        const timer = setInterval(() => {
            setElapsedSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [isRecording]);

    const handleComplete = () => {
        setIsRecording(false);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate('/ai-draft-review', { state: { client } });
        }, 5000);
    };

    return (
        <div className="cg-rec">
            <StatusBar />

            <PageHeader title="방문 상담 중" subtitle={`${client.name} · 2026.05.26 10:32`} />

            <div className="cg-rec-body">
                <p className="cg-rec-timer">{formatTime(elapsedSeconds)}</p>

                <div className="cg-rec-status">
                    <span className={`cg-rec-status-dot${isRecording ? ' active' : ''}`} />
                    <span className={`cg-rec-status-text${isRecording ? ' active' : ''}`}>
                        {isRecording ? '녹음 중' : '일시정지'}
                    </span>
                </div>

                <div className="cg-rec-control">
                    <button
                        type="button"
                        className="cg-rec-circle-button"
                        onClick={() => setIsRecording((prev) => !prev)}
                    >
                        <span className="cg-rec-circle-inner">
                            <i className={`bi ${isRecording ? 'bi-stop-fill' : 'bi-mic-fill'}`} />
                        </span>
                    </button>
                    <p className="cg-rec-control-caption">
                        {isRecording ? '탭하여 녹음 종료' : '탭하여 녹음 시작'}
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

                <div className={`cg-rec-waveform${isRecording ? ' active' : ''}`}>
                    {WAVEFORM_BARS.map((bar) => (
                        <span
                            key={bar}
                            className="cg-rec-waveform-bar"
                            style={{ animationDelay: `${(bar % 7) * 0.08}s` }}
                        />
                    ))}
                </div>

                <button className="cg-rec-complete-button" type="button" onClick={handleComplete}>
                    녹음 완료
                </button>
                <button className="cg-rec-cancel-button" type="button" onClick={() => navigate(-1)}>
                    취소
                </button>
            </div>

            <BottomMenu />
            <Toast message="저장되었습니다" visible={showToast} />
        </div>
    );
}

export default VisitRecording;
