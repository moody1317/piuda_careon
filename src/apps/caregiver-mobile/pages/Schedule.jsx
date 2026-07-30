import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import { getConsultations } from '../../../api/consultations';
import { getUsers } from '../../../api/users';
import './Schedule.css';

const FILTERS = [
    { key: 'all', label: '전체' },
    { key: 'done', label: '작성완료' },
    { key: 'pending', label: '미작성' },
];

const STATUS_LABEL = {
    done: '작성완료',
    pending: '미작성',
};

function formatDatetime(isoString) {
    return isoString.slice(0, 16).replace('T', ' ').replace(/-/g, '.');
}

function Schedule() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // TODO: 로그인/세션 연동 후 실제 로그인한 생활지원사 이름으로 교체
        getUsers()
            .then((users) => users.find((u) => u.name === '김민지'))
            .then((caregiver) => caregiver ? getConsultations() : [])
            .then((list) => {
                const mine = list.filter((c) => c.caregiverName === '김민지');
                setLogs(mine.map((c) => ({
                    id: c.id,
                    initials: c.recipientName.slice(0, 2),
                    name: c.recipientName,
                    age: c.recipientAge,
                    datetime: formatDatetime(c.consultedAt),
                    manager: '김민지',
                    tags: c.aiTags,
                    // ConsultationResponse(목록)에는 workerFinalNote가 없어 작성완료 여부를
                    // 판단할 수 없음. 백엔드에 필드 추가되면 여기서 반영.
                    status: 'pending',
                })));
            })
            .catch(() => {});
    }, []);

    const filteredLogs = logs.filter((log) => activeFilter === 'all' || log.status === activeFilter);

    return (
        <div className="cg-schedule">
            <StatusBar />

            <PageHeader title="상담일지 열람" subtitle="담당 구역 상담일지 검토" />

            <div className="cg-schedule-body">
                <div className="cg-log-filters">
                    {FILTERS.map((filter) => (
                        <span
                            key={filter.key}
                            className={`cg-log-filter${filter.key === activeFilter ? ' active' : ''}`}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label}
                        </span>
                    ))}
                </div>

                <div className="cg-log-list">
                    {filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className="cg-log-item"
                            onClick={() => navigate('/ai-draft-review', { state: { log, source: 'schedule' } })}
                        >
                            <span className="cg-log-item-avatar">{log.initials}</span>
                            <div className="cg-log-item-body">
                                <div className="cg-log-item-top">
                                    <div>
                                        <p className="cg-log-item-name">{log.name}</p>
                                        <p className="cg-log-item-meta">{log.datetime} · {log.manager}</p>
                                    </div>
                                    <span className={`cg-log-item-badge ${log.status}`}>
                                        {STATUS_LABEL[log.status]}
                                    </span>
                                </div>
                                <div className="cg-log-item-tags">
                                    {log.tags.length === 0
                                        ? <span className="cg-log-tag normal">위험 요인 없음</span>
                                        : log.tags.map((tag) => (
                                            <span key={tag} className="cg-log-tag warn">
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomMenu />
        </div>
    );
}

export default Schedule;