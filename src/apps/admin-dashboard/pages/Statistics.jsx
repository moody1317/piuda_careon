import { useState } from 'react';
import './Statistics.css';

const PERIODS = ['이번 주', '이번 달', '3개월', '6개월'];

const STATS = [
    { label: '총 방문 완료',   value: '522회', sub: '이번 달',           mod: 'primary' },
    { label: '상담일지 작성',  value: '518건', sub: '완료율 99%',        mod: 'primary' },
    { label: '이상징후 탐지',  value: '47건',  sub: '전월 대비 +8건',    mod: 'alert'   },
    { label: '위험군 전환',    value: '5명',   sub: '즉각 개입 완료',    mod: 'alert'   },
];

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const SERIES = [
    { label: '식사 거부',   color: '#D85A30', values: [2, 3, 3, 4, 5, 6, 7, 9] },
    { label: '우울감 표현', color: '#BB7517', values: [1, 2, 3, 3, 4, 5, 6, 8] },
    { label: '반복 발화',   color: '#185FA5', values: [0, 1, 1, 2, 3, 4, 5, 6] },
];

const TAGS = [
    { label: '식사 거부',   count: 18, percent: 75, type: 'alert' },
    { label: '우울감 표현', count: 14, percent: 58, type: 'alert' },
    { label: '수면 문제',   count: 11, percent: 46, type: 'warn'  },
    { label: '반복 발화',   count: 8,  percent: 33, type: 'alert' },
    { label: '낙상 위험',   count: 5,  percent: 21, type: 'warn'  },
    { label: '약 복용 문제', count: 5,  percent: 21, type: 'warn'  },
];

const SVG_W = 640, SVG_H = 220;
const PAD      = { l: 28, r: 16, t: 16, b: 32 };
const CW       = SVG_W - PAD.l - PAD.r;
const CH       = SVG_H - PAD.t - PAD.b;
const MAX_V    = 10;
const GRID_STEP = 2;

const toX = (i) => PAD.l + (i / (MONTHS.length - 1)) * CW;
const toY = (v) => PAD.t + ((MAX_V - v) / MAX_V) * CH;
const pts  = (values) => values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');

const GRID_VALUES = Array.from(
    { length: MAX_V / GRID_STEP + 1 },
    (_, i) => i * GRID_STEP
);

function TrendChart() {
    return (
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" preserveAspectRatio="none"
            style={{ display: 'block', overflow: 'visible' }}>
            {GRID_VALUES.map(gv => (
                <g key={gv}>
                    <line x1={PAD.l} x2={PAD.l + CW} y1={toY(gv)} y2={toY(gv)}
                        stroke="#EDEDF2" strokeWidth={1} />
                    <text x={PAD.l - 8} y={toY(gv)} dy={3} textAnchor="end"
                        fontSize={10} fill="#A5A6B1">{gv}</text>
                </g>
            ))}

            {SERIES.map(s => (
                <polyline key={s.label} points={pts(s.values)}
                    fill="none" stroke={s.color} strokeWidth={2.5}
                    strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {SERIES.map(s => s.values.map((v, i) => (
                <circle key={`${s.label}-${i}`} cx={toX(i)} cy={toY(v)} r={4} fill={s.color} />
            )))}

            {MONTHS.map((m, i) => (
                <text key={m} x={toX(i)} y={SVG_H - 10} textAnchor="middle"
                    fontSize={11} fill="#A5A6B1">{m}</text>
            ))}
        </svg>
    );
}

function Statistics() {
    const [period, setPeriod] = useState('이번 달');

    return (
        <div className="st-page">

            <div className="st-toolbar">
                <div className="st-period-btns">
                    {PERIODS.map(p => (
                        <button
                            key={p}
                            className={`st-period-btn${p === period ? ' st-period-btn--active' : ''}`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <div className="st-actions">
                    <button className="st-btn st-btn--primary">PDF 리포트 생성</button>
                    <button className="st-btn st-btn--outline">Excel 내보내기</button>
                </div>
            </div>

            <div className="st-stats">
                {STATS.map((s, i) => (
                    <div key={i} className="st-stat-card">
                        <p className="st-stat-label">{s.label}</p>
                        <p className={`st-stat-value st-stat-value--${s.mod}`}>{s.value}</p>
                        <p className="st-stat-sub">{s.sub}</p>
                    </div>
                ))}
            </div>

            <div className="st-card">
                <div className="st-card-header">
                    <span className="st-section-title">{period} 특이사항 태그 분포</span>
                </div>
                <div className="st-tag-grid">
                    {TAGS.map((t, i) => (
                        <div key={i} className="st-tag-col">
                            <span className={`st-tag-pill st-tag-pill--${t.type}`}>{t.label}</span>
                            <span className={`st-tag-num st-tag-num--${t.type}`}>{t.count}건</span>
                            <div className="st-tag-bar-bg">
                                <div className={`st-tag-bar st-tag-bar--${t.type}`}
                                    style={{ width: `${t.percent}%` }} />
                            </div>
                            <span className="st-tag-percent">{t.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="st-card">
                <div className="st-card-header st-card-header--between">
                    <span className="st-section-title">이상징후 월별 추이</span>
                    <div className="st-chart-legend">
                        {SERIES.map(s => (
                            <span key={s.label} className="st-legend-item">
                                <span className="st-legend-dot" style={{ background: s.color }} />
                                {s.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="st-chart-wrap">
                    <TrendChart />
                </div>
            </div>
        </div>
    );
}

export default Statistics;
