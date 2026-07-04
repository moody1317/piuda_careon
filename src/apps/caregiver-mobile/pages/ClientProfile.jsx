import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import './ClientProfile.css';

const FILTERS = [
    { key: 'all', label: '전체' },
    { key: 'urgent', label: '긴급' },
    { key: 'caution', label: '주의' },
    { key: 'normal', label: '정상' },
];

const CLIENTS = [
    { id: 1, initials: '박영', name: '박영희', age: 77, manager: '김민지', tags: '식사거부·우울감', status: 'urgent' },
    { id: 2, initials: '이순', name: '이순자', age: 83, manager: '김민지', tags: '반복발화·기억혼돈', status: 'urgent' },
    { id: 3, initials: '정대', name: '정대호', age: 79, manager: '김민지', tags: '낙상위험·수면장애', status: 'urgent' },
    { id: 4, initials: '최옥', name: '최옥순', age: 75, manager: '김민지', tags: '약 복용 불규칙', status: 'caution' },
    { id: 5, initials: '강순', name: '강순희', age: 81, manager: '김민지', tags: '우울감 표현 증가', status: 'caution' },
    { id: 6, initials: '윤기', name: '윤기철', age: 85, manager: '김민지', tags: '식욕 감소 지속', status: 'caution' },
    { id: 7, initials: '김성', name: '김성호', age: 81, manager: '김민지', tags: '정상', status: 'normal' },
    { id: 8, initials: '최화', name: '최화자', age: 79, manager: '김민지', tags: '정상', status: 'normal' },
    { id: 9, initials: '오달', name: '오달수', age: 77, manager: '김민지', tags: '정상', status: 'normal' },
];

const FILTER_COUNTS = {
    all: CLIENTS.length,
    urgent: CLIENTS.filter((client) => client.status === 'urgent').length,
    caution: CLIENTS.filter((client) => client.status === 'caution').length,
    normal: CLIENTS.filter((client) => client.status === 'normal').length,
};

const STATUS_LABEL = {
    urgent: '긴급',
    caution: '주의',
    normal: '정상',
};

function ClientProfile() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filteredClients = CLIENTS.filter(
        (client) =>
            (activeFilter === 'all' || client.status === activeFilter) &&
            client.name.includes(search.trim())
    );

    return (
        <div className="cg-client">
            <StatusBar />

            <PageHeader title="담당 대상자" subtitle="총 32명 · 3개 생활지원사 구역" />

            <div className="cg-client-body">
                <div className="cg-client-search">
                    <i className="bi bi-search" />
                    <input
                        type="text"
                        placeholder="대상자 이름 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="cg-client-filters">
                    {FILTERS.map((filter) => (
                        <span
                            key={filter.key}
                            className={`cg-client-filter${filter.key === activeFilter ? ' active' : ''}`}
                            onClick={() => setActiveFilter(filter.key)}
                        >
                            {filter.label} {FILTER_COUNTS[filter.key]}
                        </span>
                    ))}
                </div>

                <div className="cg-client-list">
                    {filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="cg-client-item"
                            onClick={() => navigate('/clients/case-detail', { state: { client } })}
                        >
                            <span className="cg-client-item-avatar">{client.initials}</span>
                            <div className="cg-client-item-info">
                                <p className="cg-client-item-name">
                                    {client.name} <span>({client.age}세)</span>
                                </p>
                                <p className="cg-client-item-meta">담당: {client.manager} · {client.tags}</p>
                            </div>
                            <span className={`cg-client-item-badge ${client.status}`}>
                                {STATUS_LABEL[client.status]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <BottomMenu />
        </div>
    );
}

export default ClientProfile;
