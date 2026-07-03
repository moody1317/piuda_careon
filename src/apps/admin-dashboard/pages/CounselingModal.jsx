import './CounselingModal.css';
import useLockBodyScroll from '../hooks/useLockBodyScroll';

const STATIC_STT = `어르신 요즘 밥은 좀 드세요? 밥이 영 입에 안 맞아요. 어제도 조금밖에 못 먹었어요. 왜 그리세요? 그냥 입맛이 없고 혼자 먹으니까 재미없어요. 자식들이 바쁘니까요. 혈압은 재봤어요? 오늘 아침 120에 80이었어요. 약은 잘 챙기고 있죠? 네 약은 잘 챙겨요.`;

const STATIC_AI_SUMMARY = `박영희 어르신은 최근 식욕 저하로 식사를 거의 못 하고 있으며 혼자 식사하는 것에 대한 외로움을 표현하셨음. 자녀들과의 연락 부족으로 정서적 고립감 증가. 혈압 120/80 정상 범위. 약 복용 정상 이행 중.`;

const STATIC_AI_TAGS = ['식사 거부', '우울감 표현', '사회적 고립', '활력징후 정상'];

const STATIC_REVIEW = `어르신 식사 문제 지속. AI 요약 내용 확인하고 외로움 표현 부분 추가 기재함. 가족 연계 필요성 체크. 혈압 정상, 약 복용 이상 없음 확인.`;

const CHANGES = [
    { label: '식사 거부',   detail: '3주 연속 지속 → 악화', type: 'alert' },
    { label: '우울감 표현', detail: '지난주 대비 증가',      type: 'alert' },
    { label: '혈압',        detail: '정상 유지',             type: 'primary' },
    { label: '약 복용',     detail: '정상 이행',             type: 'primary' },
];

const STATIC_OPINION = `식사 거부와 외로움 표현 동시 증가. 가족 연락 및 지역사회 연계 프로그램 참여 검토 권고.`;

function CounselingModal({ record, onClose }) {
    useLockBodyScroll();

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
                            <blockquote className="cm-quote">{STATIC_STT}</blockquote>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">AI 상담 요약</p>
                            <div className="cm-ai-box">{STATIC_AI_SUMMARY}</div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">AI 자동 태그</p>
                            <div className="cm-tag-list">
                                {STATIC_AI_TAGS.map((tag, i) => (
                                    <span key={i} className={`cm-tag cm-tag--${tag === '활력징후 정상' ? 'ok' : 'warn'}`}>
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
                                <span className="cm-saved-badge">최종 저장 완료</span>
                            </div>
                            <div className="cm-text-box">{STATIC_REVIEW}</div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">이전 상담 대비 변화</p>
                            <div className="cm-changes">
                                {CHANGES.map((c, i) => (
                                    <div key={i} className={`cm-change cm-change--${c.type}`}>
                                        <p className="cm-change-label">{c.label}</p>
                                        <p className="cm-change-detail">{c.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cm-section">
                            <p className="cm-section-label">사회복지사 소견 작성</p>
                            <div className="cm-text-box">{STATIC_OPINION}</div>
                        </div>

                        <div className="cm-action-row">
                            <button className="cm-btn cm-btn--primary">소견 저장</button>
                            <button className="cm-btn cm-btn--primary">피드백 전송</button>
                        </div>
                    </div>
                </div>

                <div className="cm-footer">
                    <p className="cm-footer-meta">
                        작성자: {record.manager} · 작성일: 2026.05.26 11:02 · AI 요약 생성: 2026.05.26 11:00
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
