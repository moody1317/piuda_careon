import { useState, useRef, useEffect } from 'react';
import './Header.css';

const NOTIFICATIONS = [
    { title: '박영희님 식사 거부 3주 연속 감지',   desc: 'AI 이상징후 탐지 · 긴급 확인 필요',   time: '10분 전',  type: 'alert'   },
    { title: '이순자님 반복 발화 증가 추이',       desc: '이상징후 타임라인 업데이트',         time: '32분 전',  type: 'warn'    },
    { title: '정대호님 위험군 전환',               desc: 'AI 위험도 84점 · 즉각 개입 권고',     time: '1시간 전', type: 'alert'   },
    { title: '김민지 생활지원사 상담일지 등록',     desc: '박영희님 상담일지 1건 작성 완료',     time: '2시간 전', type: 'primary' },
    { title: '최옥순님 약 복용 알림 임계값 초과',   desc: '2회 연속 불규칙 · 확인 필요',         time: '3시간 전', type: 'warn'    },
    { title: '주간 리포트 생성 완료',               desc: '이번 주 통계 리포트 다운로드 가능',   time: '어제',     type: 'primary' },
];

function Header({ title, subtitle, notificationCount = 0 }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="header">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
            <div className="header-right">
                <div className="header-notif" ref={wrapRef}>
                    <button className="header-notif-btn" onClick={() => setOpen(o => !o)}>
                        <i className="bi bi-bell" />
                        {notificationCount > 0 && (
                            <span className="header-notif-badge">{notificationCount}</span>
                        )}
                    </button>

                    {open && (
                        <div className="header-notif-panel">
                            <div className="header-notif-panel-top">
                                <span className="header-notif-panel-title">알림</span>
                                <span className="header-notif-panel-count">새 알림 {notificationCount}건</span>
                            </div>
                            <div className="header-notif-list">
                                {NOTIFICATIONS.map((n, i) => (
                                    <div key={i} className="header-notif-item">
                                        <span className={`header-notif-dot header-notif-dot--${n.type}`} />
                                        <div className="header-notif-body">
                                            <p className="header-notif-item-title">{n.title}</p>
                                            <p className="header-notif-item-desc">{n.desc}</p>
                                            <p className="header-notif-item-time">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/*<button className="header-admin">관리</button>*/}
            </div>
        </div>
    );
}

export default Header;
