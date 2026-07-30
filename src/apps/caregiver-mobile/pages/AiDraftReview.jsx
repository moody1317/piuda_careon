import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import BottomMenu from '../ui/BottomMenu';
import Toast from '../ui/Toast';
import { getConsultation, updateConsultation } from '../../../api/consultations';
import './AiDraftReview.css';

const DEFAULT_SUMMARY =
    '대상자 박영희 어르신 방문 상담 진행. 최근 식욕이 줄어 식사를 잘 못 하고 있다고 하셨으며, 기분이 처지고 외롭다는 표현을 하셨음. 혈압 측정 결과 120/80으로 정상 범위. 약 복용은 정상.';

function AiDraftReview() {
    const navigate = useNavigate();
    const location = useLocation();
    const consultationId = location.state?.log?.id;
    const [isEditing, setIsEditing] = useState(false);
    const [summary, setSummary] = useState(DEFAULT_SUMMARY);
    const [tags, setTags] = useState([]);
    const [changes, setChanges] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!consultationId) return;
        getConsultation(consultationId)
            .then((c) => {
                setSummary(c.workerFinalNote ?? c.aiSummary ?? DEFAULT_SUMMARY);
                setTags(c.aiTags ?? []);
                setChanges(c.changes ?? []);
            })
            .catch(() => {});
    }, [consultationId]);

    const concerningChanges = changes.filter((c) => c.type !== 'normal');

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            if (consultationId) {
                await updateConsultation(consultationId, { workerFinalNote: summary });
            }
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/schedule');
            }, 5000);
        } catch {
            // 저장 실패 시 화면에 그대로 머무름
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="cg-draft">
            <StatusBar />

            <PageHeader title="AI 상담일지 초안 검토" subtitle="반드시 내용을 확인 후 저장해 주세요" />

            <div className="cg-draft-body">
                <div className="cg-draft-notice">
                    <p className="cg-draft-notice-title">
                        <i className="bi bi-check-circle-fill" /> AI 자동 요약 완료
                    </p>
                    <p className="cg-draft-notice-text">
                        내용을 검토 후 수정하거나 그대로 저장할 수 있습니다.
                    </p>
                </div>

                <div className="cg-draft-card">
                    <p className="cg-draft-card-title">AI 자동 태그</p>
                    <div className="cg-draft-tags">
                        {tags.length === 0
                            ? <span className="cg-draft-tag normal">위험 요인 없음</span>
                            : tags.map((tag) => (
                                <span key={tag} className="cg-draft-tag warn">{tag}</span>
                            ))}
                    </div>
                </div>

                <div className="cg-draft-card">
                    <div className="cg-draft-card-header">
                        <p className="cg-draft-card-title">상담 요약 (수정 가능)</p>
                    </div>
                    {isEditing ? (
                        <textarea
                            className="cg-draft-summary-input"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    ) : (
                        <p className="cg-draft-summary">{summary}</p>
                    )}
                </div>

                {concerningChanges.length > 0 && (
                    <div className="cg-draft-alert">
                        <p className="cg-draft-alert-title">
                            <i className="bi bi-exclamation-triangle-fill" /> AI 이상징후 감지
                        </p>
                        <p className="cg-draft-alert-text">
                            {concerningChanges.map((c) => `${c.title} (${c.description})`).join(' · ')}<br />
                            → 사회복지사 검토 권고
                        </p>
                    </div>
                )}

                <button className="cg-draft-save-button" type="button" onClick={handleSave} disabled={saving}>
                    {saving ? '저장 중...' : '최종 검토 완료 · 저장'}
                </button>
                <button
                    className="cg-draft-modify-button"
                    type="button"
                    onClick={() => setIsEditing(true)}
                >
                    내용 수정하기
                </button>
            </div>

            <BottomMenu />
            <Toast message="저장되었습니다" visible={showToast} />
        </div>
    );
}

export default AiDraftReview;