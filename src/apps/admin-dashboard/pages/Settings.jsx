import { useState, useEffect } from 'react';
import './Settings.css';
import Toggle from '../components/Toggle';
import AddUserModal from './AddUserModal';
import ChangePasswordModal from '../ui/ChangePasswordModal';

function usePersistedState(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

const ACCOUNTS = [
    { avatar: '김관', name: '김관리자', role: '기관 관리자', email: 'kim@cj.welfare.kr',  lastLogin: '2026.05.26' },
    { avatar: '이담', name: '이담당',   role: '사회복지사',  email: 'lee@cj.welfare.kr',  lastLogin: '2026.05.26' },
    { avatar: '박복', name: '박복지',   role: '사회복지사',  email: 'park@cj.welfare.kr', lastLogin: '2026.05.26' },
    { avatar: '김민', name: '김민지',   role: '생활지원사',  email: 'mj@cj.welfare.kr',   lastLogin: '2026.05.26' },
];

const ALERT_ROWS = [
    { key: 'mealRefusal', title: '식사 거부 알림 임계값', sub: '연속 발생 횟수 기준', value: '2주 연속' },
    { key: 'depression',  title: '우울감 표현 알림 임계값', sub: '상담 빈도 기준',     value: '3회 이상 / 4회 상담' },
    { key: 'repeat',      title: '반복 발화 알림 임계값', sub: '증가율 기준',         value: '30% 이상 증가' },
];

const AI_ROWS = [
    { key: 'autoAnalysis', title: '이상징후 자동 분석', sub: 'AI가 상담 데이터 자동 분석' },
    { key: 'autoTag',      title: '특이사항 자동 태그', sub: 'AI가 핵심 키워드 자동 태그 부착' },
    { key: 'riskScore',    title: '위험도 점수 표시',   sub: '대상자별 위험도 수치 표시' },
    { key: 'patternAlert', title: '패턴 분석 알림',     sub: '장기 데이터 기반 패턴 변화 알림' },
];

const PRIVACY_ROWS = [
    { key: 'voiceDelete',  title: '원본 음성 즉시 폐기',   sub: 'STT 완료 후 음성 파일 자동 삭제' },
    { key: 'maskKeyword',  title: '민감 키워드 자동 마스킹', sub: '이름·주소 등 민감 정보 마스킹' },
    { key: 'encryptText',  title: '상담 텍스트 암호화 저장', sub: '저장 시 AES-256 암호화 적용' },
    { key: 'accessLog',    title: '접근 로그 자동 기록',   sub: '모든 데이터 접근 이력 저장' },
];

const INTEGRATIONS = [
    { name: 'STT API (음성 인식)', desc: 'Google Speech-to-Text v2' },
    { name: 'LLM 요약 API',       desc: 'Anthropic Claude API' },
    { name: '기관 행정 시스템',    desc: '노인맞춤돌봄서비스 플랫폼' },
    { name: '백업 스토리지',       desc: 'AWS S3 (암호화 버킷)' },
];

const ORG_INITIAL = {
    name: '청주 복지관',
    code: 'CJ-2024-0011',
    address: '충청북도 청주시 흥덕구 복지로 123',
    phone: '043-000-0000',
};

function Settings() {
    const [org, setOrg] = useState(ORG_INITIAL);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [alertOn, setAlertOn] = usePersistedState('settings.alertOn', { mealRefusal: true, depression: true, repeat: true });
    const [aiOn, setAiOn] = usePersistedState('settings.aiOn', { autoAnalysis: true, autoTag: true, riskScore: true, patternAlert: false });
    const [sensitivity, setSensitivity] = usePersistedState('settings.sensitivity', 60);
    const [privacyOn, setPrivacyOn] = usePersistedState('settings.privacyOn', { voiceDelete: true, maskKeyword: true, encryptText: true, accessLog: true });

    return (
        <>
        <div className="se-page">

            <div className="se-card">
                <div className="se-card-header">
                    <div>
                        <p className="se-card-title">기관 기본 정보</p>
                        <p className="se-card-sub">기관 식별 및 연락처 정보를 관리합니다.</p>
                    </div>
                </div>
                <div className="se-form-grid">
                    <div className="se-field">
                        <label className="se-label">기관명</label>
                        <input className="se-input" value={org.name}
                            onChange={e => setOrg({ ...org, name: e.target.value })} />
                    </div>
                    <div className="se-field">
                        <label className="se-label">기관 코드</label>
                        <input className="se-input" value={org.code}
                            onChange={e => setOrg({ ...org, code: e.target.value })} />
                    </div>
                    <div className="se-field">
                        <label className="se-label">대표 주소</label>
                        <input className="se-input" value={org.address}
                            onChange={e => setOrg({ ...org, address: e.target.value })} />
                    </div>
                    <div className="se-field">
                        <label className="se-label">대표 연락처</label>
                        <input className="se-input" value={org.phone}
                            onChange={e => setOrg({ ...org, phone: e.target.value })} />
                    </div>
                </div>
                <div className="se-form-actions">
                    <button className="se-btn se-btn--outline" onClick={() => setOrg(ORG_INITIAL)}>취소</button>
                    <button className="se-btn se-btn--primary">변경사항 저장</button>
                </div>
            </div>

            <div className="se-card">
                <div className="se-card-header">
                    <div>
                        <p className="se-card-title">계정 및 사용자 관리</p>
                        <p className="se-card-sub">등록된 사용자 계정을 관리합니다.</p>
                    </div>
                    <button className="se-btn se-btn--primary" onClick={() => setShowAddUser(true)}>
                        <i className="bi bi-plus-lg" /> 사용자 추가
                    </button>
                </div>
                <table className="se-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>역할</th>
                            <th>이메일</th>
                            <th>상태</th>
                            <th>최근 접속</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ACCOUNTS.map((a, i) => (
                            <tr key={i}>
                                <td>
                                    <div className="se-person">
                                        <span className="se-avatar">{a.avatar}</span>
                                        <span className="se-name">{a.name}</span>
                                    </div>
                                </td>
                                <td><span className="se-role-badge">{a.role}</span></td>
                                <td className="se-email">{a.email}</td>
                                <td><span className="se-status-badge">활성</span></td>
                                <td className="se-last-login">{a.lastLogin}</td>
                                <td><button className="se-btn se-btn--outline se-btn--sm" onClick={() => setShowPasswordModal(true)}>비밀번호 변경</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="se-card">
                <div className="se-card-header">
                    <div>
                        <p className="se-card-title">알림 설정</p>
                        <p className="se-card-sub">이상징후 감지 기준 및 알림 방식을 설정합니다.</p>
                    </div>
                </div>
                <div className="se-toggle-list">
                    {ALERT_ROWS.map(row => (
                        <div key={row.key} className="se-toggle-row">
                            <div className="se-toggle-info">
                                <span className="se-toggle-title">{row.title}</span>
                                <span className="se-toggle-sub">{row.sub}</span>
                            </div>
                            <div className="se-toggle-right">
                                <div className="se-select-box">
                                    <span>{row.value}</span>
                                    <i className="bi bi-chevron-down" />
                                </div>
                                <Toggle
                                    checked={alertOn[row.key]}
                                    onChange={v => setAlertOn({ ...alertOn, [row.key]: v })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="se-form-actions">
                    <button className="se-btn se-btn--primary">알림 설정 저장</button>
                </div>
            </div>

            <div className="se-mid">
                <div className="se-card">
                    <div className="se-card-header">
                        <div>
                            <p className="se-card-title">AI 분석 설정</p>
                            <p className="se-card-sub">이상징후 분석 민감도와 태그 기준을 조정합니다.</p>
                        </div>
                    </div>
                    <div className="se-toggle-list">
                        {AI_ROWS.map(row => (
                            <div key={row.key} className="se-toggle-row">
                                <div className="se-toggle-info">
                                    <span className="se-toggle-title">{row.title}</span>
                                    <span className="se-toggle-sub">{row.sub}</span>
                                </div>
                                <Toggle
                                    checked={aiOn[row.key]}
                                    onChange={v => setAiOn({ ...aiOn, [row.key]: v })}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="se-slider-row">
                        <span className="se-toggle-title">AI 분석 민감도</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="se-slider"
                            value={sensitivity}
                            onChange={e => setSensitivity(Number(e.target.value))}
                            style={{ '--val': `${sensitivity}%` }}
                        />
                        <div className="se-slider-marks">
                            <span>낮음</span>
                            <span>중간</span>
                            <span>높음</span>
                        </div>
                    </div>
                </div>

                <div className="se-card">
                    <div className="se-card-header">
                        <div>
                            <p className="se-card-title">개인정보 보호</p>
                            <p className="se-card-sub">데이터 보존 정책 및 마스킹 기준을 설정합니다.</p>
                        </div>
                    </div>
                    <div className="se-toggle-list">
                        {PRIVACY_ROWS.map(row => (
                            <div key={row.key} className="se-toggle-row">
                                <div className="se-toggle-info">
                                    <span className="se-toggle-title">{row.title}</span>
                                    <span className="se-toggle-sub">{row.sub}</span>
                                </div>
                                <Toggle
                                    checked={privacyOn[row.key]}
                                    onChange={v => setPrivacyOn({ ...privacyOn, [row.key]: v })}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="se-field se-retention-field">
                        <label className="se-label">상담 데이터 보존 기간</label>
                        <div className="se-select-box se-select-box--wide">
                            <span>3년 (법적 최소 기준)</span>
                            <i className="bi bi-chevron-down" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="se-card">
                <div className="se-card-header">
                    <div>
                        <p className="se-card-title">시스템 연동</p>
                        <p className="se-card-sub">외부 서비스 연동 현황 및 API 설정을 관리합니다.</p>
                    </div>
                </div>
                <div className="se-integ-list">
                    {INTEGRATIONS.map((it, i) => (
                        <div key={i} className="se-integ-row">
                            <div className="se-integ-name">
                                <span className="se-integ-dot" />
                                {it.name}
                            </div>
                            <div className="se-integ-desc">{it.desc}</div>
                            <span className="se-status-badge">연동됨</span>
                            <button className="se-btn se-btn--outline se-btn--sm">설정 변경</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {showAddUser && (
            <AddUserModal onClose={() => setShowAddUser(false)} />
        )}

        {showPasswordModal && (
            <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
        )}
        </>
    );
}

export default Settings;
