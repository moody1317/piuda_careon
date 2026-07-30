import { useState } from 'react';
import './ChangePasswordModal.css';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { changePassword } from '../../../api/users';

function ChangePasswordModal({ userId, onClose }) {
    useLockBodyScroll();

    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const conditions = [
        { label: '8자 이상',            met: newPw.length >= 8 },
        { label: '대문자 포함 (A-Z)',   met: /[A-Z]/.test(newPw) },
        { label: '소문자 포함 (a-z)',   met: /[a-z]/.test(newPw) },
        { label: '숫자 포함 (0-9)',     met: /[0-9]/.test(newPw) },
        { label: '특수문자 포함 (!@#$%)', met: /[!@#$%^&*]/.test(newPw) },
    ];

    const canSubmit = currentPw.trim() !== ''
        && conditions.every(c => c.met)
        && newPw === confirmPw
        && confirmPw.trim() !== ''
        && !submitting;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setSubmitting(true);
        setError('');
        try {
            await changePassword(userId, { currentPassword: currentPw, newPassword: newPw });
            onClose();
        } catch {
            setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cp-overlay" onClick={onClose}>
            <div className="cp-modal" onClick={e => e.stopPropagation()}>

                <div className="cp-header">
                    <div>
                        <h2 className="cp-header-title">내 계정 — 비밀번호 변경</h2>
                        <p className="cp-header-sub">보안을 위해 비밀번호를 주기적으로 변경하세요.</p>
                    </div>
                    <button className="cp-close" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                <div className="cp-body">
                    <div className="cp-field">
                        <label className="cp-label">현재 비밀번호</label>
                        <input
                            type="password"
                            className="cp-input"
                            placeholder="현재 비밀번호를 입력하세요"
                            value={currentPw}
                            onChange={e => setCurrentPw(e.target.value)}
                        />
                    </div>

                    <div className="cp-field">
                        <label className="cp-label">새 비밀번호</label>
                        <input
                            type="password"
                            className="cp-input"
                            placeholder="새 비밀번호를 입력하세요"
                            value={newPw}
                            onChange={e => setNewPw(e.target.value)}
                        />
                    </div>

                    <div className="cp-field">
                        <label className="cp-label">새 비밀번호 확인</label>
                        <input
                            type="password"
                            className="cp-input"
                            placeholder="새 비밀번호를 다시 입력하세요"
                            value={confirmPw}
                            onChange={e => setConfirmPw(e.target.value)}
                        />
                    </div>

                    <div className="cp-condition-box">
                        <p className="cp-condition-caption">비밀번호 조건</p>
                        <div className="cp-condition-grid">
                            {conditions.map(c => (
                                <div key={c.label} className="cp-condition-item">
                                    <i className={`bi bi-dash-circle-fill cp-condition-icon${c.met ? ' cp-condition-icon--met' : ''}`} />
                                    {c.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className="cp-error">{error}</p>}

                    <button
                        className="cp-submit-btn"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {submitting ? '변경 중...' : '비밀번호 변경'}
                    </button>

                    <div className="cp-notice">
                        <i className="bi bi-exclamation-triangle-fill" />
                        비밀번호 변경 시 다른 기기에서 로그아웃됩니다.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
