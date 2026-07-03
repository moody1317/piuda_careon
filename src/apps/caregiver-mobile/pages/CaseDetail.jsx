import { useLocation, useNavigate } from 'react-router-dom';
import StatusBar from '../ui/StatusBar';
import PageHeader from '../ui/PageHeader';
import './CaseDetail.css';

const DEFAULT_CLIENT = { name: '박영희', age: 77 };

const SYMPTOMS = [
    { id: 1, title: '식사 거부', meta: '3주 연속 · 주 4회', tone: 'alert' },
    { id: 2, title: '우울감 표현', meta: '5회 중 4회 언급', tone: 'alert' },
    { id: 3, title: '반복 발화', meta: '2주간 증가 추이', tone: 'warn' },
];

const TIMELINE = [
    { id: 1, date: '05.26', text: '식사거부, 기분 처짐, 외롭다 반복', tone: 'alert' },
    { id: 2, date: '05.19', text: '식욕없음, 우울감 증가', tone: 'alert' },
    { id: 3, date: '05.12', text: '수면 불편, 혈압 정상', tone: 'warn' },
    { id: 4, date: '05.05', text: '전반적 양호', tone: 'primary' },
    { id: 5, date: '04.28', text: '가끔 식욕 없음', tone: 'info' },
    { id: 6, date: '04.21', text: '건강 양호', tone: 'primary' },
];

function CaseDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const client = location.state?.client ?? DEFAULT_CLIENT;

    return (
        <div className="cg-case">
            <StatusBar />

            <PageHeader title="상세 내역" subtitle={`${client.name} (${client.age}세) · 이상징후 집중 관리`} />

            <div className="cg-case-body">
                <div className="cg-case-card">
                    <p className="cg-case-card-title">이상징후 요약</p>
                    <div className="cg-case-symptoms">
                        {SYMPTOMS.map((symptom) => (
                            <div key={symptom.id} className={`cg-case-symptom ${symptom.tone}`}>
                                <p className="cg-case-symptom-title">{symptom.title}</p>
                                <p className="cg-case-symptom-meta">{symptom.meta}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cg-case-card">
                    <div className="cg-case-card-header">
                        <p className="cg-case-card-title">사회복지사 소견</p>
                        <span className="cg-case-saved-badge">저장됨</span>
                    </div>
                    <textarea className="cg-case-note" placeholder='식사 문제와 우울감이 동시에 증가. 가족 연락 및 복지관 연계 서비스 검토 필요.'/>
                    <button className="cg-case-save-button" type="button">소견 저장</button>
                </div>

                <div className="cg-case-card">
                    <div className="cg-case-card-header">
                        <p className="cg-case-card-title">상담 이력 타임라인</p>
                        <span className="cg-case-timeline-count">최근 6회</span>
                    </div>
                    <div className="cg-case-timeline">
                        {TIMELINE.map((item, index) => (
                            <div key={item.id} className="cg-case-timeline-item">
                                <div className="cg-case-timeline-marker">
                                    <span className={`cg-case-timeline-dot ${item.tone}`} />
                                    {index < TIMELINE.length - 1 && <span className="cg-case-timeline-line" />}
                                </div>
                                <div className="cg-case-timeline-content">
                                    <p className={`cg-case-timeline-date ${item.tone}`}>{item.date}</p>
                                    <p className="cg-case-timeline-text">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="cg-case-back-button" type="button" onClick={() => navigate(-1)}>
                    돌아가기
                </button>
            </div>
        </div>
    );
}

export default CaseDetail;
