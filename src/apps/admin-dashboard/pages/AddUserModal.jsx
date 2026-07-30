import { useState } from 'react';
import './AddUserModal.css';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { createUser } from '../../../api/users';

const INITIAL_PASSWORD = '1234';

function AddUserModal({ institutionId, onCreated, onClose }) {
    useLockBodyScroll();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role] = useState('CARE_WORKER');
    const [sendEmail, setSendEmail] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const previewEmail = email.trim() || 'example@cj.welfare.kr';

    const handleCreate = async () => {
        if (!name.trim() || !email.trim() || creating) return;
        setCreating(true);
        setError('');
        try {
            const user = await createUser({
                institutionId,
                name,
                phone,
                email,
                role,
                password: INITIAL_PASSWORD,
            });
            onCreated?.(user);
            onClose();
        } catch {
            setError('계정 생성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="au-overlay" onClick={onClose}>
            <div className="au-modal" onClick={e => e.stopPropagation()}>

                <div className="au-header">
                    <div>
                        <h2 className="au-header-title">사용자 추가</h2>
                        <p className="au-header-sub">신규 계정을 생성하고 초기 비밀번호를 발급합니다.</p>
                    </div>
                    <button className="au-close" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                <div className="au-body">
                    <div className="au-row">
                        <div className="au-field">
                            <label className="au-label">이름</label>
                            <input className="au-input" placeholder="홍길동"
                                value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="au-field">
                            <label className="au-label">연락처</label>
                            <input className="au-input" placeholder="010-0000-0000"
                                value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>

                    <div className="au-field">
                        <label className="au-label">이메일</label>
                        <input className="au-input" placeholder="example@cj.welfare.kr"
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="au-notice">
                        <p className="au-notice-title">초기 비밀번호 자동 발급</p>
                        <p className="au-notice-text">계정 생성 시 초기 비밀번호는 1234로 설정됩니다.</p>
                        <p className="au-notice-text">사용자는 최초 로그인 후 마이페이지에서 비밀번호를 반드시 변경해야 합니다.</p>
                    </div>

                    <div className="au-preview">
                        <p className="au-preview-title">계정 정보 미리보기</p>
                        <div className="au-preview-row">
                            <span className="au-preview-label">아이디:</span>
                            <span className="au-preview-value">{previewEmail}</span>
                        </div>
                        <div className="au-preview-row">
                            <span className="au-preview-label">초기 비밀번호:</span>
                            <span className="au-preview-value au-preview-value--strong">1234</span>
                        </div>
                    </div>

                    <label className="au-checkbox-row">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={e => setSendEmail(e.target.checked)}
                        />
                        계정 정보(아이디·초기 비밀번호)를 이메일로 발송합니다.
                    </label>

                    {error && <p className="au-error">{error}</p>}
                </div>

                <div className="au-footer">
                    <button className="au-btn au-btn--outline" onClick={onClose}>취소</button>
                    <button className="au-btn au-btn--primary" onClick={handleCreate} disabled={creating}>
                        {creating ? '생성 중...' : '계정 생성'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddUserModal;
