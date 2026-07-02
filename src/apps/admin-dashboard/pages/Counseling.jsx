import { useState } from 'react';
import './Counseling.css';
import CounselingModal from './CounselingModal';

const RECORDS = [
    {
        avatar: '박영', name: '박영희', age: 77,
        datetime: '2026.05.26 10:45', manager: '김민지',
        tags: ['식사 거부', '우울감'],
        summary: '식사 못 드신다 하셨으며 기분이 많이 처지고...',
        status: '특이사항',
    },
    {
        avatar: '이순', name: '이순자', age: 83,
        datetime: '2026.05.26 09:12', manager: '김민지',
        tags: ['반복 발화'],
        summary: '오늘도 예전 이야기 반복하셨으며 이름을...',
        status: '특이사항',
    },
    {
        avatar: '정대', name: '정대호', age: 79,
        datetime: '2026.05.25 14:00', manager: '이성희',
        tags: ['낙상 위험', '수면'],
        summary: '어제 화장실 가다 넘어질 뻔 했다고 하심...',
        status: '특이사항',
    },
    {
        avatar: '최옥', name: '최옥순', age: 75,
        datetime: '2026.05.25 11:30', manager: '이성희',
        tags: ['약 복용'],
        summary: '약을 어제 저녁에 깜빡하셨다고 하심...',
        status: '검토 필요',
    },
    {
        avatar: '강순', name: '강순희', age: 81,
        datetime: '2026.05.24 14:10', manager: '박지수',
        tags: ['우울감'],
        summary: '요즘 들어 기분이 처진다고 하셨으며...',
        status: '검토 필요',
    },
    {
        avatar: '김성', name: '김성호', age: 81,
        datetime: '2026.05.24 11:00', manager: '김민지',
        tags: ['정상'],
        summary: '건강 상태 양호. 혈압 정상 범위 확인...',
        status: '정상',
    },
    {
        avatar: '최화', name: '최화자', age: 79,
        datetime: '2026.05.23 10:30', manager: '김민지',
        tags: ['정상'],
        summary: '전반적으로 양호. 이웃과 잘 지낸다고 하심...',
        status: '정상',
    },
    {
        avatar: '윤기', name: '윤기철', age: 85,
        datetime: '2026.05.23 09:00', manager: '박지수',
        tags: ['식욕 감소'],
        summary: '식욕이 없다고 하셨으며 점심을 조금...',
        status: '검토 필요',
    },
    {
        avatar: '오달', name: '오달수', age: 77,
        datetime: '2026.05.22 15:20', manager: '오은지',
        tags: ['정상'],
        summary: '활력징후 모두 정상. 기분 좋다고 하심...',
        status: '정상',
    },
    {
        avatar: '한복', name: '한복순', age: 80,
        datetime: '2026.05.22 13:00', manager: '한미래',
        tags: ['수면 문제'],
        summary: '밤에 잠을 잘 못 잔다고 하셨으며...',
        status: '검토 필요',
    },
];

const FILTERS = ['전체', '특이사항', '검토 필요', '정상'];

function statusMod(status) {
    if (status === '특이사항') return 'alert';
    if (status === '검토 필요') return 'warn';
    return 'primary';
}

function Counseling() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('전체');
    const [modalRecord, setModalRecord] = useState(null);

    let filtered = statusFilter === '전체'
        ? RECORDS
        : RECORDS.filter(r => r.status === statusFilter);

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
                            key={f}
                            className={`cl-filter-btn${f === statusFilter ? ' cl-filter-btn--active' : ''}`}
                            onClick={() => setStatusFilter(f)}
                        >
                            {f}
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
                        ) : filtered.map((r, i) => {
                            const mod = statusMod(r.status);
                            return (
                                <tr key={i}>
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
                                            {r.tags.map((tag, j) => (
                                                <span key={j} className={`cl-tag cl-tag--${tag === '정상' ? 'ok' : 'abnormal'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="cl-summary">{r.summary}</td>
                                    <td>
                                        <span className={`cl-status cl-status--${mod}`}>{r.status}</span>
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
