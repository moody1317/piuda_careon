import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Toast from '../ui/Toast';
import { getCurrentUser, changePassword, ROLE_LABELS } from '../../../api/users';
import { getInstitution } from '../../../api/institutions';
import './Mypage.css';
import './ChangePassword.css';

const STATS = [
    { id: 1, value: '32명', label: '담당 인원' },
    { id: 2, value: '3명', label: '생활지원사' },
    { id: 3, value: '5년차', label: '근무 연차' },
];

const REQUIREMENTS = [
    { key: 'length', label: '8자 이상', test: (v) => v.length >= 8 },
    { key: 'upper', label: '대문자 포함', test: (v) => /[A-Z]/.test(v) },
    { key: 'lower', label: '소문자 포함', test: (v) => /[a-z]/.test(v) },
    { key: 'digit', label: '숫자 포함', test: (v) => /\d/.test(v) },
    { key: 'special', label: '특수문자 포함 (!@#$ 등)', test: (v) => /[!@#$%^&*]/.test(v) },
];

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [institution, setInstitution] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                setUser(u);
                return getInstitution(u.institutionId);
            })
            .then(setInstitution)
            .catch(() => {});
    }, []);

    const accountInfo = [
        { label: '이메일', value: user?.email ?? '-' },
        { label: '연락처', value: user?.phone ?? '-' },
        { label: '소속 기관', value: institution?.name ?? '-' },
        { label: '사번', value: 'SW-2021-014' },
    ];

    const checks = useMemo(
        () => REQUIREMENTS.map((req) => ({ ...req, met: req.test(newPassword) })),
        [newPassword]
    );

    const canSubmit =
        currentPassword.length > 0 &&
        newPassword.length > 0 &&
        newPassword === confirmPassword &&
        checks.every((c) => c.met) &&
        !submitting;

    const handleSubmit = async () => {
        if (!canSubmit || !user) return;
        setSubmitting(true);
        setError('');
        try {
            await changePassword(user.id, { currentPassword, newPassword });
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate(-1);
            }, 2000);
        } catch (err) {
            setError(err.message ?? '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cg-my">
            <StatusBar />

            <PageHeader title="내 정보" />

            <div className="cg-my-body">
                <div className="cg-my-profile">
                    <span className="cg-my-avatar">{user?.name?.slice(0, 1) ?? ''}</span>
                    <p className="cg-my-name">{user ? `${user.name} ${ROLE_LABELS[user.role] ?? ''}` : ''}</p>
                    <p className="cg-my-role">{institution?.name ?? ''} · {ROLE_LABELS[user?.role] ?? ''}</p>

                    <div className="cg-my-stats">
                        {STATS.map((stat, index) => (
                            <div key={stat.id} className={`cg-my-stat${index > 0 ? ' divider' : ''}`}>
                                <p className="cg-my-stat-value">{stat.value}</p>
                                <p className="cg-my-stat-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-my-card">
                    <p className="cg-my-card-title">계정 정보</p>
                    <div className="cg-my-account">
                        {accountInfo.map((info) => (
                            <div key={info.label} className="cg-my-account-row">
                                <span className="cg-my-account-label">{info.label}</span>
                                <span className="cg-my-account-value">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-my-card">
                    <div className="cg-pw-header">
                        <p className="cg-my-card-title">비밀번호 변경</p>
                        <span className="cg-pw-badge">초기 비밀번호 변경 필요</span>
                    </div>

                    <div className="cg-pw-field">
                        <label htmlFor="currentPassword">현재 비밀번호</label>
                        <input
                            id="currentPassword"
                            type="password"
                            className="cg-pw-input"
                            placeholder="현재 비밀번호 입력"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="cg-pw-field">
                        <label htmlFor="newPassword">새 비밀번호</label>
                        <input
                            id="newPassword"
                            type="password"
                            className="cg-pw-input"
                            placeholder="새 비밀번호 입력"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="cg-pw-field">
                        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="cg-pw-input"
                            placeholder="새 비밀번호 다시 입력"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="cg-pw-checklist">
                        {checks.map((check) => (
                            <div key={check.key} className={`cg-pw-check${check.met ? ' met' : ''}`}>
                                <i className={`bi ${check.met ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                                <span>{check.label}</span>
                            </div>
                        ))}
                    </div>

                    {error && <p className="cg-pw-error">{error}</p>}

                    <button
                        className="cg-pw-submit-button"
                        type="button"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        {submitting ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </div>
            </div>

            <BottomMenu />
            <Toast message="비밀번호가 변경되었습니다" visible={showToast} />
        </div>
    );
}

export default ChangePassword;