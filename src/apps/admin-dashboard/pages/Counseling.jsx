import { useState, useEffect } from 'react';
import './Counseling.css';
import CounselingModal from './CounselingModal';
import { getConsultations } from '../../../api/consultations';
import { STATUS_LABELS } from '../../../api/status';

function formatDatetime(isoString) {
    return isoString.slice(0, 16).replace('T', ' ').replace(/-/g, '.');
}

const FILTERS = [
    { key: 'all', label: '전체' },
    ...Object.entries(STATUS_LABELS).map(([key, label]) => ({ key, label })),
];

function statusMod(status) {
    if (status === 'SPECIAL_NOTE') return 'alert';
    if (status === 'NEED_REVIEW') return 'warn';
    return 'primary';
}

function Counseling() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalRecord, setModalRecord] = useState(null);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        getConsultations()
            .then((list) => {
                setRecords(list.map((c) => ({
                    id: c.id,
                    avatar: c.recipientName.slice(0, 2),
                    name: c.recipientName,
                    age: c.recipientAge,
                    datetime: formatDatetime(c.consultedAt),
                    manager: c.caregiverName,
                    tags: c.aiTags,
                    summary: c.aiSummaryPreview,
                    status: c.status,
                })));
            })
            .catch(() => {});
    }, []);

    let filtered = statusFilter === 'all'
        ? records
        : records.filter(r => r.status === statusFilter);

    if (query.trim()) {
        const q = query.trim().toLowerCase();
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(q) ||
            r.tags.some(tag => tag.toLowerCase().includes(q))
        );
    }

    return (
        <>
        <div className="cl-page">

            <div className="cl-filter-bar">
                <div className="cl-filter-btns">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            className={`cl-filter-btn${f.key === statusFilter ? ' cl-filter-btn--active' : ''}`}
                            onClick={() => setStatusFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="cl-search">
                    <i className="bi bi-search cl-search-icon" />
                    <input
                        type="text"
                        className="cl-search-input"
                        placeholder="대상자명 또는 태그 검색..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="cl-card">
                <table className="cl-table">
                    <thead>
                        <tr>
                            <th>대상자</th>
                            <th>날짜/시간</th>
                            <th>담당 생활지원사</th>
                            <th>AI 특이사항 태그</th>
                            <th>AI 요약 미리보기</th>
                            <th>상태</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="cl-empty">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        ) : filtered.map((r) => {
                            const mod = statusMod(r.status);
                            return (
                                <tr key={r.id}>
                                    <td>
                                        <div className="cl-person">
                                            <span className="cl-avatar">{r.avatar}</span>
                                            <div className="cl-name-group">
                                                <span className="cl-name">{r.name}</span>
                                                <span className="cl-age">{r.age}세</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="cl-datetime">{r.datetime}</td>
                                    <td className="cl-manager">{r.manager}</td>
                                    <td>
                                        <div className="cl-tags">
                                            {r.tags.length === 0
                                                ? <span className="cl-tag cl-tag--ok">위험 요인 없음</span>
                                                : r.tags.map((tag, j) => (
                                                    <span key={j} className="cl-tag cl-tag--abnormal">
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                    </td>
                                    <td className="cl-summary">{r.summary}</td>
                                    <td>
                                        <span className={`cl-status cl-status--${mod}`}>{STATUS_LABELS[r.status]}</span>
                                    </td>
                                    <td>
                                        <button className={`cl-btn-view cl-btn-view--${mod}`} onClick={() => setModalRecord(r)}>보기</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {modalRecord && (
            <CounselingModal
                record={modalRecord}
                onClose={() => setModalRecord(null)}
            />
        )}
        </>
    );
}

export default Counseling;