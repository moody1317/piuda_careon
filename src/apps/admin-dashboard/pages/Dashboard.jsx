import './Dashboard.css';

const RISK_ROWS = [
    { avatar: '박영', name: '박영희 (77세)', symptom: '식사거부 3주·우울감↑',   manager: '김민지', status: '긴급' },
    { avatar: '이손', name: '이순자 (83세)', symptom: '반복발화 증가·혼동표현', manager: '김민지', status: '긴급' },
    { avatar: '정대', name: '정대호 (79세)', symptom: '수면장애·낙상 위험',     manager: '이성희', status: '긴급' },
    { avatar: '최옥', name: '최옥순 (75세)', symptom: '약 복용 불규칙',         manager: '이성희', status: '주의' },
    { avatar: '강순', name: '강순희 (81세)', symptom: '우울감 표현 증가',       manager: '박지수', status: '주의' },
    { avatar: '윤기', name: '윤기철 (85세)', symptom: '식욕 감소',              manager: '박지수', status: '주의' },
];

const TAG_ROWS = [
    { label: '식사 거부',      count: 4, percent: 75, type: 'alert' },
    { label: '수면 문제',      count: 3, percent: 58, type: 'warn'  },
    { label: '우울감 표현',    count: 3, percent: 58, type: 'alert' },
    { label: '반복 발화 증가', count: 2, percent: 38, type: 'alert' },
    { label: '낙상 위험',      count: 1, percent: 20, type: 'warn'  },
    { label: '약 복용 문제',   count: 1, percent: 20, type: 'warn'  },
];

const WEEKS  = ['3/31', '4/7', '4/14', '4/21', '4/28', '5/5', '5/12', '5/19'];
const SERIES = [
    { label: '식사 거부',   color: '#D85A30', values: [3, 4, 4, 5, 6, 7, 6, 8] },
    { label: '우울감 표현', color: '#BB7517', values: [2, 3, 3, 3, 4, 5, 5, 6] },
    { label: '반복 발화',   color: '#185FA5', values: [1, 1, 3, 3, 3, 3, 4, 5] },
];

const SVG_W = 960, SVG_H = 200;
const PAD   = { l: 32, r: 20, t: 24, b: 40 };
const CW    = SVG_W - PAD.l - PAD.r;
const CH    = SVG_H - PAD.t - PAD.b;
const GRID_Y = [0, 2, 4, 6, 8, 10];

const toX = (i) => PAD.l + (i / (WEEKS.length - 1)) * CW;
const toY = (v) => PAD.t + ((10 - v) / 10) * CH;
const pts  = (values) => values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

function LineChart() {
    const calloutX = toX(5) + 14;
    const calloutY = toY(9.5);

    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
            {GRID_Y.map(v => (
                <g key={v}>
                    <line x1={PAD.l} y1={toY(v)} x2={SVG_W - PAD.r} y2={toY(v)}
                        stroke="#E0E1E7" strokeWidth={1} />
                    <text x={PAD.l - 6} y={toY(v)} textAnchor="end"
                        dominantBaseline="middle" fontSize={10} fill="#A5A6B1">{v}</text>
                </g>
            ))}

            {SERIES.map(s => (
                <polyline key={s.label} points={pts(s.values)}
                    fill="none" stroke={s.color} strokeWidth={2.5}
                    strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {SERIES.map(s => s.values.map((v, i) => (
                <g key={`${s.label}-${i}`}>
                    <circle cx={toX(i)} cy={toY(v)} r={4} fill={s.color} />
                    <text x={toX(i)} y={toY(v) - 9} textAnchor="middle"
                        fontSize={10} fontWeight="600" fill={s.color}>{v}</text>
                </g>
            )))}

            {WEEKS.map((w, i) => (
                <text key={w} x={toX(i)} y={SVG_H - 8} textAnchor="middle"
                    fontSize={10} fill="#A5A6B1">{w}</text>
            ))}

            <rect x={calloutX} y={calloutY} width={170} height={50}
                rx={6} fill="#FAECE7" stroke="#D85A30" strokeWidth={1} />
            <text x={calloutX + 10} y={calloutY + 19}
                fontSize={11} fontWeight="700" fill="#712B13">최근 3주 연속 증가 추이</text>
            <text x={calloutX + 10} y={calloutY + 37}
                fontSize={10} fill="#993C1D">사회복지사 개입 검토 권고</text>
        </svg>
    );
}

function Dashboard() {
    return (
        <div className="dashboard">

            <div className="dashboard-stats">
                <div className="stat-card">
                    <p className="stat-label">총 대상자</p>
                    <p className="stat-value stat-value--primary">142</p>
                    <p className="stat-sub">전월 대비 +3명</p>
                </div>
                <div className="stat-card stat-card--alert">
                    <p className="stat-label">이번 주 위험군</p>
                    <p className="stat-value stat-value--alert">8</p>
                    <p className="stat-sub">즉시 확인 필요</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">이번 주 방문 완료</p>
                    <p className="stat-value stat-value--primary">86%</p>
                    <p className="stat-sub">122 / 142명</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">신규 특이사항 태그</p>
                    <p className="stat-value stat-value--warn">14</p>
                    <p className="stat-sub">오늘 기준</p>
                </div>
            </div>

            <div className="dashboard-mid">
                <div className="db-card">
                    <div className="card-header">
                        <span className="section-title">위험군 우선 확인</span>
                        <span className="badge badge--alert">긴급 3</span>
                        <span className="badge badge--warn">주의 5</span>
                    </div>
                    <table className="risk-table">
                        <thead>
                            <tr>
                                <th>대상자</th>
                                <th>최근 이상징후</th>
                                <th>담당</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RISK_ROWS.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="risk-person">
                                            <span className="risk-avatar">{row.avatar}</span>
                                            <span className="risk-name">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="risk-symptom">{row.symptom}</td>
                                    <td className="risk-manager">{row.manager}</td>
                                    <td>
                                        <span className={`status-badge status-badge--${row.status === '긴급' ? 'alert' : 'warn'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="db-card">
                    <div className="card-header card-header--between">
                        <span className="section-title">오늘의 특이사항 태그</span>
                        <span className="muted-text">전체 14건</span>
                    </div>
                    <div className="tag-list">
                        {TAG_ROWS.map((row, i) => (
                            <div key={i} className="tag-row">
                                <span className="tag-label">{row.label}</span>
                                <span className={`tag-count tag-count--${row.type}`}>{row.count}건</span>
                                <div className="tag-bar-bg">
                                    <div className={`tag-bar tag-bar--${row.type}`}
                                        style={{ width: `${row.percent}%` }} />
                                </div>
                                <span className="tag-percent">{row.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="db-card">
                <div className="card-header card-header--between">
                    <div>
                        <p className="section-title">이상징후 추이 시각화</p>
                        <p className="chart-sub">최근 8주 · 전체 대상자 기준</p>
                    </div>
                    <div className="chart-legend">
                        {SERIES.map(s => (
                            <span key={s.label} className="legend-item">
                                <span className="legend-dot" style={{ background: s.color }} />
                                {s.label}
                            </span>
                        ))}
                    </div>
                </div>
                <LineChart />
            </div>
        </div>
    );
}

export default Dashboard;
