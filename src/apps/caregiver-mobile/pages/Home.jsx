import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import './Home.css';

const VISITS = [
    { id: 1, initials: '이순', name: '이순자', age: 83, time: '09:00', address: '서운동 123', status: 'done' },
    { id: 2, initials: '박영', name: '박영희', age: 77, time: '10:30', address: '사직동 45', status: 'alert' },
    { id: 3, initials: '김성', name: '김성호', age: 81, time: '13:00', address: '복대동 67', status: 'scheduled' },
    { id: 4, initials: '최옥', name: '최옥순', age: 75, time: '14:30', address: '가경동 89', status: 'scheduled' },
];

const STATUS_LABEL = {
    done: '완료',
    alert: '특이사항',
    scheduled: '예정',
};

function Home() {
    const navigate = useNavigate();
    const totalVisits = VISITS.length;
    const alertVisits = VISITS.filter((visit) => visit.status === 'alert').length;

    return (
        <div className="cg-visit">
            <StatusBar />

            <PageHeader title="오늘의 방문 일정" subtitle="2026년 5월 26일 화요일 · 김민지 생활지원사">
                <div className="cg-visit-stats">
                    <div className="cg-visit-stat">
                        <p className="cg-visit-stat-value">{totalVisits}</p>
                        <p className="cg-visit-stat-label">오늘 방문 예정</p>
                    </div>
                    <div className="cg-visit-stat">
                        <p className="cg-visit-stat-value">{alertVisits}</p>
                        <p className="cg-visit-stat-label">특이사항 알림</p>
                    </div>
                </div>
            </PageHeader>

            <div className="cg-visit-body">
                <p className="cg-visit-list-title">방문 목록</p>
                <div className="cg-visit-list">
                    {VISITS.map((visit) => (
                        <div
                            key={visit.id}
                            className="cg-visit-item"
                            onClick={() => navigate('/schedule/client-detail', { state: { log: visit, source: 'home' } })}
                        >
                            <span className="cg-visit-item-avatar">{visit.initials}</span>
                            <div className="cg-visit-item-info">
                                <p className="cg-visit-item-name">
                                    {visit.name} <span>({visit.age}세)</span>
                                </p>
                                <p className="cg-visit-item-meta">{visit.time} {visit.address}</p>
                            </div>
                            <span className={`cg-visit-item-badge ${visit.status}`}>
                                {visit.status === 'alert' && <i className="bi bi-exclamation-triangle-fill" />}
                                {STATUS_LABEL[visit.status]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <BottomMenu />
        </div>
    );
}

export default Home;
