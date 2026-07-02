import { useState } from 'react';
import './Caregiver.css';

const CAREGIVERS = [
    { avatar: '김민', name: '김민지', count: 14, rate: 86,  alarm: 2, years: 3 },
    { avatar: '이성', name: '이성희', count: 13, rate: 85,  alarm: 1, years: 4 },
    { avatar: '박지', name: '박지수', count: 15, rate: 100, alarm: 0, years: 2 },
    { avatar: '최수', name: '최수진', count: 12, rate: 92,  alarm: 0, years: 5 },
    { avatar: '한미', name: '한미래', count: 14, rate: 93,  alarm: 1, years: 3 },
    { avatar: '정하', name: '정하늘', count: 11, rate: 100, alarm: 0, years: 6 },
    { avatar: '오은', name: '오은지', count: 13, rate: 92,  alarm: 0, years: 4 },
    { avatar: '강다', name: '강다은', count: 14, rate: 100, alarm: 0, years: 7 },
    { avatar: '윤하', name: '윤하준', count: 12, rate: 83,  alarm: 1, years: 2 },
    { avatar: '임수', name: '임수진', count: 13, rate: 92,  alarm: 0, years: 3 },
    { avatar: '백지', name: '백지훈', count: 11, rate: 100, alarm: 0, years: 5 },
];

const DETAIL_PATIENTS = [
    { avatar: '박영', name: '박영희 (77세)', date: '05.26 완료', type: '특이' },
    { avatar: '이손', name: '이순자 (83세)', date: '05.26 완료', type: '특이' },
    { avatar: '김성', name: '김성호 (81세)', date: '05.25 완료', type: '완료' },
    { avatar: '최화', name: '최화자 (79세)', date: '05.25 완료', type: '완료' },
    { avatar: '오달', name: '오달수 (77세)', date: '오늘 예정',  type: '예정' },
    { avatar: '장춘', name: '장춘자 (82세)', date: '오늘 예정',  type: '예정' },
];

function patientBadgeClass(type) {
    if (type === '특이') return 'cg-patient-badge--alert';
    if (type === '완료') return 'cg-patient-badge--done';
    return 'cg-patient-badge--plan';
}

function Caregiver() {
    const [selected, setSelected] = useState(CAREGIVERS[0]);
    const visited = Math.round(selected.count * selected.rate / 100);

    return (
        <div className="cg-page">

            <div className="cg-stats">
                <div className="cg-stat-card">
                    <p className="cg-stat-label">총 생활지원사</p>
                    <p className="cg-stat-value cg-stat-value--primary">11명</p>
                </div>
                <div className="cg-stat-card">
                    <p className="cg-stat-label">평균 담당 대상자</p>
                    <p className="cg-stat-value cg-stat-value--primary">14명</p>
                </div>
                <div className="cg-stat-card">
                    <p className="cg-stat-label">방문 완료율</p>
                    <p className="cg-stat-value cg-stat-value--primary">88%</p>
                </div>
                <div className="cg-stat-card">
                    <p className="cg-stat-label">알림 발생</p>
                    <p className="cg-stat-value cg-stat-value--alert">3명</p>
                </div>
            </div>

            <div className="cg-main">
                <div className="cg-card">
                    <p className="cg-card-title">생활지원사 목록</p>
                    <div className="cg-list">
                        {CAREGIVERS.map((cg, i) => (
                            <div
                                key={i}
                                className={`cg-row${cg.name === selected.name ? ' cg-row--active' : ''}`}
                                onClick={() => setSelected(cg)}
                            >
                                <div className="cg-person">
                                    <span className="cg-avatar">{cg.avatar}</span>
                                    <div className="cg-name-group">
                                        <span className="cg-name">{cg.name}</span>
                                        <span className="cg-sub">담당 {cg.count}명</span>
                                    </div>
                                </div>
                                <div className="cg-bar-group">
                                    <div className="cg-bar-track">
                                        <div className="cg-bar-fill" style={{ width: `${cg.rate}%` }} />
                                    </div>
                                    <span className="cg-rate">{cg.rate}%</span>
                                </div>
                                {cg.alarm > 0
                                    ? <span className="cg-badge cg-badge--alarm">알림 {cg.alarm}</span>
                                    : <span className="cg-badge cg-badge--ok">정상</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-card">
                    <p className="cg-card-title">생활지원사 상세</p>

                    <div className="cg-profile">
                        <span className="cg-avatar cg-avatar--lg">{selected.avatar}</span>
                        <div>
                            <p className="cg-profile-name">{selected.name} 생활지원사</p>
                            <p className="cg-profile-sub">
                                담당 {selected.count}명 · 근무 {selected.years}년차 · {selected.alarm > 0 ? `알림 ${selected.alarm}건` : '알림 없음'}
                            </p>
                        </div>
                    </div>

                    <div className="cg-mini-stats">
                        <div className="cg-mini-stat">
                            <p className="cg-mini-label">이번 주 방문</p>
                            <p className="cg-mini-value cg-mini-value--primary">{visited}/{selected.count}</p>
                        </div>
                        <div className="cg-mini-stat">
                            <p className="cg-mini-label">상담일지</p>
                            <p className="cg-mini-value cg-mini-value--dark">{visited}건</p>
                        </div>
                        <div className="cg-mini-stat">
                            <p className="cg-mini-label">미해결 알림</p>
                            <p className={`cg-mini-value ${selected.alarm > 0 ? 'cg-mini-value--alert' : 'cg-mini-value--primary'}`}>
                                {selected.alarm}건
                            </p>
                        </div>
                    </div>

                    <p className="cg-section-sub">이번 주 담당 대상자 현황</p>
                    <div className="cg-patient-list">
                        {DETAIL_PATIENTS.map((p, i) => (
                            <div key={i} className="cg-patient-row">
                                <div className="cg-person">
                                    <span className="cg-avatar">{p.avatar}</span>
                                    <div className="cg-name-group">
                                        <span className="cg-name">{p.name}</span>
                                        <span className="cg-sub">{p.date}</span>
                                    </div>
                                </div>
                                <span className={`cg-patient-badge ${patientBadgeClass(p.type)}`}>
                                    {p.type === '특이' && <i className="bi bi-exclamation-triangle-fill" />}
                                    {p.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Caregiver;
