import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Modal from '../ui/Modal';
import './Mypage.css';

const STATS = [
    { id: 1, value: '32명', label: '담당 인원' },
    { id: 2, value: '3명', label: '생활지원사' },
    { id: 3, value: '5년차', label: '근무 연차' },
];

const ACCOUNT_INFO = [
    { label: '이메일', value: 'lee@cj.welfare.kr' },
    { label: '연락처', value: '010-XXXX-XXXX' },
    { label: '소속 기관', value: '청주 복지관' },
    { label: '사번', value: 'SW-2021-014' },
];

const MENU_ITEMS = [
    { id: 'notification', label: '알림 설정' },
    { id: 'password', label: '비밀번호 변경' },
    { id: 'privacy', label: '개인정보 보호 안내' },
    { id: 'support', label: '고객센터 문의' },
];

function Mypage() {
    const navigate = useNavigate();
    const [showSupport, setShowSupport] = useState(false);

    const handleMenuClick = (id) => {
        if (id === 'password') {
            navigate('/my/change-password');
        } else if (id === 'privacy') {
            navigate('/my/privacy');
        } else if (id === 'notification') {
            navigate('/my/notifications');
        } else if (id === 'support') {
            setShowSupport(true);
        }
    };

    return (
        <div className="cg-my">
            <StatusBar />

            <PageHeader title="내 정보" />

            <div className="cg-my-body">
                <div className="cg-my-profile">
                    <span className="cg-my-avatar">이담</span>
                    <p className="cg-my-name">이담당 사회복지사</p>
                    <p className="cg-my-role">청주 복지관 · 전담사회복지사</p>

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
                        {ACCOUNT_INFO.map((info) => (
                            <div key={info.label} className="cg-my-account-row">
                                <span className="cg-my-account-label">{info.label}</span>
                                <span className="cg-my-account-value">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-my-menu">
                    {MENU_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className="cg-my-menu-item"
                            onClick={() => handleMenuClick(item.id)}
                        >
                            <span>{item.label}</span>
                            <i className="bi bi-chevron-right" />
                        </div>
                    ))}
                </div>

                <button className="cg-my-logout-button" type="button" onClick={() => navigate('/login')}>
                    로그아웃
                </button>
            </div>

            <BottomMenu />

            {showSupport && (
                <Modal title="고객센터 문의" onClose={() => setShowSupport(false)}>
                    <div className="cg-my-support-row">
                        <i className="bi bi-envelope-fill" />
                        <span>support@piuda.co.kr</span>
                    </div>
                    <div className="cg-my-support-row">
                        <i className="bi bi-telephone-fill" />
                        <span>1588-1234</span>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Mypage;
