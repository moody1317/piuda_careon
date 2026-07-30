import { useState, useEffect } from 'react';
import './RiskModal.css';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { getRiskHistories } from '../../../api/riskHistories';
import { STATUS_LABELS } from '../../../api/status';

const SUBSCORES = [
    { label: '식사 거부',   score: 38, max: 40 },
    { label: '우울감 표현', score: 26, max: 30 },
    { label: '반복 발화',   score: 16, max: 20 },
    { label: '수면 문제',   score: 8,  max: 10 },
    { label: '낙상 위험',   score: 4,  max: 10 },
];

// 위험 이력 조회에 실패하거나 연결된 대상자/상담일지가 없을 때만 사용하는 예시 데이터
const FALLBACK_TIMELINE = [
    { date: '05.22', desc: '반복 발화 시작 단계.', status: 'NEED_REVIEW' },
];

const AI_SUMMARIES = [
    { date: '05.26', text: '식사 거부+우울감 동시 증가. 외로움 반복 표현.' },
    { date: '05.19', text: '식욕 저하. 전주 대비 우울감 표현 증가 추이.' },
    { date: '05.12', text: '수면 불편+반복발화 시작. 혈압 정상.' },
];

function timelineType(status) {
    if (status === 'SPECIAL_NOTE') return 'alert';
    if (status === 'NEED_REVIEW') return 'warn';
    return 'primary';
}

function formatDate(isoString) {
    return isoString.slice(5, 10).replace('-', '.');
}

function severityType(score) {
    if (score >= 80) return 'alert';
    if (score >= 60) return 'warn';
    return 'primary';
}

function severityLabel(score) {
    if (score >= 80) return '최고 위험 단계';
    if (score >= 60) return '주의 관찰 단계';
    return '안정 단계';
}

function RiskModal({ record, onClose }) {
    useLockBodyScroll();

    const type = severityType(record.score);
    const [timeline, setTimeline] = useState(FALLBACK_TIMELINE);

    useEffect(() => {
        if (!record.recipientId && !record.consultationId) return;
        getRiskHistories({ recipientId: record.recipientId, consultationId: record.consultationId })
            .then((list) => {
                if (list.length === 0) return;
                setTimeline(list.map((h) => ({
                    date: formatDate(h.created_at),
                    desc: h.reason ?? '-',
                    status: h.new_status,
                })));
            })
            .catch(() => {});
    }, [record.recipientId, record.consultationId]);

    return (
        <div className="rm-overlay" onClick={onClose}>
            <div className="rm-modal" onClick={e => e.stopPropagation()}>

                <div className="rm-header">
                    <div>
                        <h2 className="rm-header-title">케이스 상세</h2>
                        <p className="rm-header-sub">
                            {record.name} ({record.age}세) · {record.status === '긴급' ? '긴급 관리 대상' : '주의 관찰 대상'} · AI 위험도 {record.score}점
                        </p>
                    </div>
                    <button className="rm-close" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                <div className="rm-profile-card">
                    <div className="rm-profile-row">
                        <span className="rm-avatar">{record.avatar}</span>
                        <div>
                            <p className="rm-profile-name">{record.name} ({record.age}세 · 여)</p>
                            <p className="rm-profile-info">청주시 흥덕구 사직동 45 · 돌봄 2등급 · 생활지원사: {record.manager}</p>
                        </div>
                    </div>
                    <div className="rm-profile-badges">
                        <span className={`rm-badge rm-badge--${record.status === '긴급' ? 'alert' : 'warn'}`}>{record.status}</span>
                        <span className={`rm-badge rm-badge--${type}`}>AI 위험도 {record.score}점</span>
                    </div>
                </div>

                <div className="rm-body">
                    <div className="rm-col">
                        <p className="rm-section-label">AI 위험도 분석</p>

                        <div className="rm-score-block">
                            <p className="rm-score-caption">종합 점수</p>
                            <div className="rm-score-row">
                                <span className={`rm-score-num rm-score-num--${type}`}>{record.score}</span>
                                <span className="rm-score-max">/ 100</span>
                                <span className={`rm-badge rm-badge--${type}`}>{severityLabel(record.score)}</span>
                            </div>
                        </div>

                        <div className="rm-subscore-list">
                            <p className="rm-subscore-caption">세부 항목별 점수</p>
                            {SUBSCORES.map((s, i) => (
                                <div key={i} className="rm-subscore-row">
                                    <div className="rm-subscore-top">
                                        <span className="rm-subscore-label">{s.label}</span>
                                        <span className="rm-subscore-value">{s.score}/{s.max}점</span>
                                    </div>
                                    <div className="rm-subscore-track">
                                        <div className="rm-subscore-bar" style={{ width: `${(s.score / s.max) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rm-meta">
                            <p className="rm-meta-label">분석 기간</p>
                            <p className="rm-meta-value">최근 8주 (2026.03.31 ~ 05.26)</p>
                        </div>
                        <div className="rm-meta">
                            <p className="rm-meta-label">분석 기반</p>
                            <p className="rm-meta-value">상담일지 32건 · STT 텍스트 데이터</p>
                        </div>

                        <div className="rm-disclaimer">
                            <i className="bi bi-exclamation-triangle-fill" />
                            AI 판단은 보조 지표입니다. 최종 판단은 사회복지사·기관이 수행합니다.
                        </div>
                    </div>

                    <div className="rm-col">
                        <p className="rm-section-label">이상징후 타임라인</p>
                        <p className="rm-section-sub">최근 6주 변화 추이</p>

                        <div className="rm-timeline">
                            {timeline.map((t, i) => {
                                const tType = timelineType(t.status);
                                return (
                                    <div key={i} className="rm-timeline-item">
                                        <div className="rm-timeline-rail">
                                            <span className={`rm-timeline-dot rm-timeline-dot--${tType}`} />
                                            {i !== timeline.length - 1 && <span className="rm-timeline-line" />}
                                        </div>
                                        <div className="rm-timeline-content">
                                            <div className="rm-timeline-top">
                                                <span className="rm-timeline-date">{t.date}</span>
                                                <span className={`rm-badge rm-badge--${tType}`}>{STATUS_LABELS[t.status] ?? t.status}</span>
                                            </div>
                                            <p className="rm-timeline-desc">{t.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rm-col">
                        <p className="rm-section-label">담당자 정보</p>
                        <div className="rm-manager-card">
                            <span className="rm-avatar">{record.avatar}</span>
                            <div>
                                <p className="rm-manager-role">생활지원사</p>
                                <p className="rm-manager-name">{record.manager}</p>
                                <p className="rm-manager-sub">담당 14명 · 3년차</p>
                            </div>
                        </div>

                        <p className="rm-section-label">최근 상담일지 AI 요약</p>
                        <div className="rm-summary-list">
                            {AI_SUMMARIES.map((s, i) => (
                                <div key={i} className="rm-summary-item">
                                    <p className="rm-summary-date">{s.date}</p>
                                    <p className="rm-summary-text">{s.text}</p>
                                </div>
                            ))}
                        </div>

                        <p className="rm-section-label">기관 조치 메모</p>
                        <textarea className="rm-memo" placeholder="기관 내부 메모를 입력하세요..." />
                    </div>
                </div>

                <div className="rm-footer">
                    <p className="rm-footer-meta">
                        마지막 상담: 2026.05.26 · 등록일: 2023.03.15 · 총 상담 횟수: 68회
                    </p>
                    <div className="rm-footer-btns">
                        <button className="rm-btn rm-btn--outline" onClick={onClose}>닫기</button>
                        <button className="rm-btn rm-btn--primary">사회복지사에게 개입 지시</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RiskModal;
