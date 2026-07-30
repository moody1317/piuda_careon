import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import { getRecipientsByCaregiver, STATUS_META } from '../../../api/clients';
import { getConsultations } from '../../../api/consultations';
import { getCurrentUser } from '../../../api/users';
import './ClientProfile.css';

const FILTERS = [
    { key: 'all', label: '전체' },
    ...Object.values(STATUS_META).map((meta) => ({ key: meta.key, label: meta.label })),
];

// 태그(특이사항 요약)는 아직 백엔드 필드가 없어 이름으로 임시 매핑
const TAGS_BY_NAME = {
    박영희: '식사거부·우울감',
    이순자: '반복발화·기억혼돈',
    정대호: '낙상위험·수면장애',
    최옥순: '약 복용 불규칙',
    강순희: '우울감 표현 증가',
    윤기철: '식욕 감소 지속',
};

function ClientProfile() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [clients, setClients] = useState([]);

    useEffect(() => {
        getCurrentUser()
            .then((caregiver) => Promise.all([getRecipientsByCaregiver(caregiver.id), getConsultations()]))
            .then(([clientList, consultations]) => {
                // 대상자 상태는 care-recipient가 아닌 consultation.status 기준.
                // recipientId 연결고리가 없어 이름 + 최신 상담일시로 매칭.
                const latestByName = {};
                for (const c of consultations) {
                    const prev = latestByName[c.recipientName];
                    if (!prev || new Date(c.consultedAt) > new Date(prev.consultedAt)) {
                        latestByName[c.recipientName] = c;
                    }
                }
                setClients(clientList.map((c) => ({
                    id: c.id,
                    initials: c.name.slice(0, 2),
                    name: c.name,
                    age: c.age,
                    manager: c.caregiverName,
                    tags: TAGS_BY_NAME[c.name] ?? '정상',
                    status: STATUS_META[latestByName[c.name]?.status]?.key ?? 'normal',
                })));
            })
            .catch(() => {});
    }, []);

    const filterCounts = {
        all: clients.length,
        urgent: clients.filter((client) => client.status === 'urgent').length,
        caution: clients.filter((client) => client.status === 'caution').length,
        normal: clients.filter((client) => client.status === 'normal').length,
    };

    const statusLabel = Object.fromEntries(
        Object.values(STATUS_META).map((meta) => [meta.key, meta.label])
    );

    const filteredClients = clients.filter(
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
                            {filter.label} {filterCounts[filter.key]}
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
                                {statusLabel[client.status]}
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