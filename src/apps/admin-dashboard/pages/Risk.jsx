import { useState } from 'react';
import './Risk.css';
import RiskModal from './RiskModal';

const RISK_ROWS = [
    { recipientId: '1', avatar: '박영', name: '박영희', age: 77, symptom: '식사거부 3주·우울감 표현 증가', manager: '김민지', date: '05.26', status: '긴급', score: 92 },
    { recipientId: '2', avatar: '이순', name: '이순자', age: 83, symptom: '반복 발화·기억 혼동 표현↑',     manager: '김민지', date: '05.26', status: '긴급', score: 88 },
    { recipientId: '3', avatar: '정대', name: '정대호', age: 79, symptom: '낙상 위험·수면장애 지속',        manager: '이성희', date: '05.25', status: '긴급', score: 84 },
    { recipientId: '4', avatar: '최옥', name: '최옥순', age: 75, symptom: '약 복용 불규칙 2회 연속',        manager: '이성희', date: '05.25', status: '주의', score: 62 },
    { recipientId: '5', avatar: '강순', name: '강순희', age: 81, symptom: '우울감 표현 증가 추이',          manager: '박지수', date: '05.24', status: '주의', score: 58 },
    { recipientId: '6', avatar: '윤기', name: '윤기철', age: 85, symptom: '식욕 감소·체중 변화',           manager: '박지수', date: '05.24', status: '주의', score: 54 },
    { recipientId: null, consultationId: '10', avatar: '한복', name: '한복순', age: 80, symptom: '수면 불규칙 패턴', manager: '한미래', date: '05.23', status: '주의', score: 50 },
    { recipientId: null, consultationId: null, avatar: '오철', name: '오철수', age: 76, symptom: '반복 발화 시작 단계', manager: '오은지', date: '05.22', status: '주의', score: 45 },
];

function scoreType(score) {
    if (score >= 80) return 'alert';
    if (score >= 60) return 'warn';
    return 'primary';
}

function Risk() {
    const [modalRecord, setModalRecord] = useState(null);

    return (
        <>
        <div className="risk-page">

            <div className="risk-stats">
                <div className="r-stat-card">
                    <p className="r-stat-label">이번 주 위험군</p>
                    <p className="r-stat-value r-stat-value--alert">8</p>
                    <p className="r-stat-sub">즉시 확인 필요</p>
                </div>
                <div className="r-stat-card">
                    <p className="r-stat-label">긴급</p>
                    <p className="r-stat-value r-stat-value--alert">3</p>
                    <p className="r-stat-sub">당일 개입 권고</p>
                </div>
                <div className="r-stat-card">
                    <p className="r-stat-label">주의</p>
                    <p className="r-stat-value r-stat-value--warn">5</p>
                    <p className="r-stat-sub">정기 모니터링</p>
                </div>
                <div className="r-stat-card">
                    <p className="r-stat-label">해제 예정</p>
                    <p className="r-stat-value r-stat-value--primary">2</p>
                    <p className="r-stat-sub">상태 개선 확인</p>
                </div>
            </div>

            <div className="r-card">
                <div className="r-table-top">
                    <span className="r-table-title">위험군 대상자 전체 목록</span>
                    <button className="btn-csv">
                        <i className="bi bi-download" />
                        CSV 내보내기
                    </button>
                </div>
                <table className="r-table">
                    <thead>
                        <tr>
                            <th>대상자</th>
                            <th>주요 이상징후</th>
                            <th>담당 생활지원사</th>
                            <th>최근 상담</th>
                            <th>상태</th>
                            <th>AI 위험도</th>
                            <th>조치</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RISK_ROWS.map((row, i) => {
                            const type = scoreType(row.score);
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="r-person">
                                            <span className="r-avatar">{row.avatar}</span>
                                            <div className="r-name-group">
                                                <span className="r-name">{row.name}</span>
                                                <span className="r-age">{row.age}세</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="r-symptom">{row.symptom}</td>
                                    <td className="r-manager">{row.manager}</td>
                                    <td className="r-date">{row.date}</td>
                                    <td>
                                        <span className={`r-status r-status--${row.status === '긴급' ? 'alert' : 'warn'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="r-score">
                                            <div className="r-score-track">
                                                <div className={`r-score-bar r-score-bar--${type}`}
                                                    style={{ width: `${row.score}%` }} />
                                            </div>
                                            <span className={`r-score-num r-score-num--${type}`}>{row.score}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn-case" onClick={() => setModalRecord(row)}>케이스 보기</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {modalRecord && (
            <RiskModal
                record={modalRecord}
                onClose={() => setModalRecord(null)}
            />
        )}
        </>
    );
}

export default Risk;
