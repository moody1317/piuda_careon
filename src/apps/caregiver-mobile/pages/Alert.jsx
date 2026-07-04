import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import './Alert.css';

const COMPLETED_VISITS = 28;

const ALERTS = [
    { id: 1, name: '박영희', age: 77, manager: '김민지', desc: '식사거부 3주 · 우울감↑', level: 'urgent' },
    { id: 2, name: '이순자', age: 83, manager: '김민지', desc: '반복발화·기억혼동', level: 'urgent' },
    { id: 3, name: '정대호', age: 79, manager: '김민지', desc: '낙상위험·수면장애', level: 'urgent' },
    { id: 4, name: '최옥순', age: 75, manager: '김민지', desc: '약 복용 불규칙', level: 'caution' },
    { id: 5, name: '강순희', age: 81, manager: '김민지', desc: '우울감 표현 증가', level: 'caution' },
    { id: 6, name: '윤기철', age: 85, manager: '김민지', desc: '식욕 감소 지속', level: 'caution' },
];

function Alert() {
    const urgentAlerts = ALERTS.filter((alert) => alert.level === 'urgent');
    const cautionAlerts = ALERTS.filter((alert) => alert.level === 'caution');

    return (
        <div className="cg-alert">
            <StatusBar />

            <PageHeader title="알림 홈" subtitle="2026.05.26 화 · 이담당 사회복지사">
                <div className="cg-alert-stats">
                    <div className="cg-alert-stat">
                        <p className="cg-alert-stat-value">{urgentAlerts.length}</p>
                        <p className="cg-alert-stat-label">긴급</p>
                    </div>
                    <div className="cg-alert-stat">
                        <p className="cg-alert-stat-value">{cautionAlerts.length}</p>
                        <p className="cg-alert-stat-label">주의</p>
                    </div>
                    <div className="cg-alert-stat">
                        <p className="cg-alert-stat-value">{COMPLETED_VISITS}명</p>
                        <p className="cg-alert-stat-label">방문완료</p>
                    </div>
                </div>
            </PageHeader>

            <div className="cg-alert-body">
                <div className="cg-alert-card">
                    <div className="cg-alert-card-header">
                        <p className="cg-alert-card-title">긴급 이상징후 알림</p>
                        <span className="cg-alert-card-badge urgent">{urgentAlerts.length}건</span>
                    </div>
                    <div className="cg-alert-list">
                        {urgentAlerts.map((alert) => (
                            <div key={alert.id} className="cg-alert-row">
                                <p className="cg-alert-row-name">
                                    {alert.name} <span>({alert.age}세)</span>
                                </p>
                                <p className="cg-alert-row-manager">담당: {alert.manager}</p>
                                <p className="cg-alert-row-desc urgent">{alert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-alert-card">
                    <div className="cg-alert-card-header">
                        <p className="cg-alert-card-title">주의 알림</p>
                        <span className="cg-alert-card-badge caution">{cautionAlerts.length}건</span>
                    </div>
                    <div className="cg-alert-list">
                        {cautionAlerts.map((alert) => (
                            <div key={alert.id} className="cg-alert-row">
                                <p className="cg-alert-row-name">
                                    {alert.name} <span>({alert.age}세)</span>
                                </p>
                                <p className="cg-alert-row-manager">담당: {alert.manager}</p>
                                <p className="cg-alert-row-desc caution">{alert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomMenu />
        </div>
    );
}

export default Alert;
