import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import './Schedule.css';

const FILTERS = [
    { key: 'all', label: '전체' },
    { key: 'done', label: '작성완료' },
    { key: 'pending', label: '미작성' },
];

const LOGS = [
    { id: 1, initials: '박영', name: '박영희', age: 77, gender: '여', datetime: '2026.05.26 10:45', manager: '김민지', tags: ['식사거부', '우울감'], status: 'done' },
    { id: 2, initials: '이순', name: '이순자', age: 83, gender: '여', datetime: '2026.05.26 09:12', manager: '김민지', tags: ['반복발화'], status: 'done' },
    { id: 3, initials: '정대', name: '정대호', age: 79, gender: '남', datetime: '2026.05.25 14:00', manager: '김민지', tags: ['낙상위험'], status: 'pending' },
    { id: 4, initials: '최옥', name: '최옥순', age: 75, gender: '여', datetime: '2026.05.25 11:30', manager: '김민지', tags: ['약 복용'], status: 'pending' },
    { id: 5, initials: '강순', name: '강순희', age: 81, gender: '여', datetime: '2026.05.24 14:10', manager: '김민지', tags: ['우울감'], status: 'pending' },
    { id: 6, initials: '김성', name: '김성호', age: 81, gender: '남', datetime: '2026.05.24 11:00', manager: '김민지', tags: ['정상'], status: 'done' },
    { id: 7, initials: '최화', name: '최화자', age: 79, gender: '여', datetime: '2026.05.23 10:30', manager: '김민지', tags: ['정상'], status: 'done' },
];

const STATUS_LABEL = {
    done: '작성완료',
    pending: '미작성',
};

function Schedule() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredLogs = LOGS.filter((log) => activeFilter === 'all' || log.status === activeFilter);

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
                                    {log.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`cg-log-tag ${tag === '정상' ? 'normal' : 'warn'}`}
                                        >
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
