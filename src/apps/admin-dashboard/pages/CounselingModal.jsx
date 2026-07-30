import { useState, useEffect } from 'react';
import './CounselingModal.css';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
import { getConsultation, updateConsultation } from '../../../api/consultations';

function CounselingModal({ record, onClose }) {
    useLockBodyScroll();

    const [detail, setDetail] = useState(null);
    const [tags, setTags] = useState([]);
    const [changes, setChanges] = useState([]);
    const [opinion, setOpinion] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getConsultation(record.id).then((c) => {
            setDetail(c);
            setTags(c.aiTags ?? []);
            setChanges(c.changes ?? []);
            setOpinion(c.socialWorkerOpinion ?? '');
        }).catch(() => {});
    }, [record.id]);

    const handleSaveOpinion = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const updated = await updateConsultation(record.id, { socialWorkerOpinion: opinion });
            setDetail(updated);
        } catch {
            // 저장 실패 시 기존 값 유지
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="cm-overlay" onClick={onClose}>
            <div className="cm-modal" onClick={e => e.stopPropagation()}>

                <div className="cm-header">
                    <div>
                        <h2 className="cm-header-title">상담일지 상세 보기</h2>
                        <p className="cm-header-sub">
                            {record.name} ({record.age}세) · {record.datetime} · 담당: {record.manager} 생활지원사
                        </p>
                    </div>
                    <button className="cm-close" onClick={onClose}>
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                <div className="cm-body">
                    <div className="cm-col">
                        <div className="cm-profile-card">
                            <div className="cm-profile-row">
                                <span className="cm-avatar">{record.avatar}</span>
                                <div>
                                    <p className="cm-profile-name">{record.name} ({record.age}세 · 여)</p>
                                    <p className="cm-profile-info">청주시 흥덕구 사직동 · 돌봄 2등급</p>
                                </div>
                            </div>
                            <span className="cm-urgent-badge">긴급 관리 대상</span>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">STT 변환 원문</p>
                            <blockquote className="cm-quote">{detail?.sttText ?? '-'}</blockquote>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">AI 상담 요약</p>
                            <div className="cm-ai-box">{detail?.aiSummary ?? '-'}</div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">AI 자동 태그</p>
                            <div className="cm-tag-list">
                                {tags.length === 0
                                    ? <span className="cm-tag cm-tag--ok">위험 요인 없음</span>
                                    : tags.map((tag, i) => (
                                        <span key={i} className="cm-tag cm-tag--warn">
                                            {tag}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="cm-col">
                        <div className="cm-section">
                            <div className="cm-review-top">
                                <p className="cm-section-label">생활지원사 최종 검토 내용</p>
                                {detail?.workerFinalNote && <span className="cm-saved-badge">최종 저장 완료</span>}
                            </div>
                            <div className="cm-text-box">{detail?.workerFinalNote ?? '아직 작성되지 않았습니다.'}</div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">이전 상담 대비 변화</p>
                            <div className="cm-changes">
                                {changes.map((c, i) => (
                                    <div key={i} className={`cm-change cm-change--${c.type === 'normal' ? 'primary' : 'alert'}`}>
                                        <p className="cm-change-label">{c.title}</p>
                                        <p className="cm-change-detail">{c.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">사회복지사 소견 작성</p>
                            <textarea
                                className="cm-text-box cm-opinion-input"
                                value={opinion}
                                onChange={(e) => setOpinion(e.target.value)}
                                placeholder="사회복지사 소견을 입력하세요..."
                            />
                        </div>

                        <div className="cm-action-row">
                            <button className="cm-btn cm-btn--primary" onClick={handleSaveOpinion} disabled={saving}>
                                {saving ? '저장 중...' : '소견 저장'}
                            </button>
                            <button className="cm-btn cm-btn--primary">피드백 전송</button>
                        </div>
                    </div>
                </div>

                <div className="cm-footer">
                    <p className="cm-footer-meta">
                        작성자: {record.manager} · 상담일시: {record.datetime}
                    </p>
                    <div className="cm-footer-btns">
                        <button className="cm-btn cm-btn--outline">인쇄 / 내보내기</button>
                        <button className="cm-btn cm-btn--primary" onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CounselingModal;