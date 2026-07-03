import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Toggle from '../ui/Toggle';
import Toast from '../ui/Toast';
import './NotificationSettings.css';

const VISIT_TOGGLES = [
    { id: 'before30', title: '방문 30분 전 알림', desc: '예정된 방문 30분 전에 알림을 보냅니다.' },
    { id: 'morning', title: '당일 방문 일정 아침 알림', desc: '매일 아침 오늘의 방문 일정을 알려드립니다.' },
];

const ALERT_TOGGLES = [
    { id: 'aiAlert', title: 'AI 이상징후 감지 알림', desc: 'AI가 이상징후를 감지하면 즉시 알려드립니다.' },
];

const STORAGE_KEY = 'cg-notification-settings';

const DEFAULT_TOGGLES = {
    before30: true,
    morning: true,
    aiAlert: true,
};

function loadToggles() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return saved ? { ...DEFAULT_TOGGLES, ...saved } : DEFAULT_TOGGLES;
    } catch {
        return DEFAULT_TOGGLES;
    }
}

function NotificationSettings() {
    const navigate = useNavigate();
    const [toggles, setToggles] = useState(loadToggles);
    const [showToast, setShowToast] = useState(false);

    const handleToggle = (id) => {
        setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles));
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate(-1);
        }, 2000);
    };

    return (
        <div className="cg-notif">
            <StatusBar />

            <PageHeader title="알림 설정" subtitle="방문 및 상담 관련 알림을 설정합니다." />

            <div className="cg-notif-body">
                <div className="cg-notif-card">
                    <p className="cg-notif-card-title">방문 알림</p>
                    {VISIT_TOGGLES.map((item, index) => (
                        <div key={item.id} className={`cg-notif-row${index > 0 ? ' divider' : ''}`}>
                            <div className="cg-notif-row-text">
                                <p className="cg-notif-row-title">{item.title}</p>
                                <p className="cg-notif-row-desc">{item.desc}</p>
                            </div>
                            <Toggle checked={toggles[item.id]} onChange={() => handleToggle(item.id)} />
                        </div>
                    ))}
                </div>

                <div className="cg-notif-card">
                    <p className="cg-notif-card-title">특이사항 알림</p>
                    {ALERT_TOGGLES.map((item) => (
                        <div key={item.id} className="cg-notif-row">
                            <div className="cg-notif-row-text">
                                <p className="cg-notif-row-title">{item.title}</p>
                                <p className="cg-notif-row-desc">{item.desc}</p>
                            </div>
                            <Toggle checked={toggles[item.id]} onChange={() => handleToggle(item.id)} />
                        </div>
                    ))}
                </div>

                <div className="cg-notif-card">
                    <p className="cg-notif-card-title">알림 수신 시간대</p>
                    <p className="cg-notif-time-desc">해당 시간 외에는 알림이 오지 않습니다.</p>

                    <div className="cg-notif-time-fields">
                        <div className="cg-notif-time-field">
                            <label>시작 시간</label>
                            <div className="cg-notif-time-value">
                                <span>오전 08:00</span>
                                <i className="bi bi-clock" />
                            </div>
                        </div>
                        <div className="cg-notif-time-field">
                            <label>종료 시간</label>
                            <div className="cg-notif-time-value">
                                <span>오후 09:00</span>
                                <i className="bi bi-clock" />
                            </div>
                        </div>
                    </div>

                    <p className="cg-notif-time-current">현재 설정: 오전 8:00 ~ 오후 9:00</p>
                </div>

                <button className="cg-notif-save-button" type="button" onClick={handleSave}>
                    알림 설정 저장
                </button>
            </div>

            <BottomMenu />
            <Toast message="저장되었습니다" visible={showToast} />
        </div>
    );
}

export default NotificationSettings;
