import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkInstitution, signup } from '../../../../api/auth';
import { ROLE_LABELS } from '../../../../api/users';
import './Joinus.css';

const STEPS = [
  { num: 1, label: '기관 확인' },
  { num: 2, label: '기본 정보' },
  { num: 3, label: '역할 설정' },
  { num: 4, label: '완료' },
];

const ROLES = Object.entries(ROLE_LABELS).map(([key, label]) => ({ key, label }));

function StepIndicator({ step, completed }) {
  return (
    <div className="jn-stepper">
      {STEPS.map((s, i) => {
        const isDone = completed.includes(s.num);
        const isActive = step === s.num;
        return (
          <Fragment key={s.num}>
            {i > 0 && (
              <div className={`jn-step-line${completed.includes(s.num - 1) ? ' filled' : ''}`} />
            )}
            <div className="jn-step-item">
              <div className={`jn-step-circle${isDone ? ' done' : isActive ? ' active' : ''}`}>
                {isDone ? <i className="bi bi-check-lg" /> : s.num}
              </div>
              <span className={`jn-step-label${isDone ? ' done' : isActive ? ' active' : ''}`}>
                {s.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

function PwCheckItem({ ok, label }) {
  return (
    <div className="jn-pw-check">
      <i className={`bi bi-dash-circle-fill${ok ? ' ok' : ''}`} />
      <span>{label}</span>
    </div>
  );
}

function JoinUs() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);

  const [instCode, setInstCode] = useState('');
  const [instVerified, setInstVerified] = useState(false);
  const [instName, setInstName] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [role, setRole] = useState(null);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const pwCheck = {
    length: pw.length >= 8,
    english: /[a-zA-Z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^a-zA-Z0-9]/.test(pw),
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.startsWith('02')) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const goNext = (from) => {
    setCompleted(prev => [...new Set([...prev, from])]);
    setStep(from + 1);
  };

  const handleVerify = async () => {
    const code = instCode.trim().toUpperCase();
    if (!code || verifying) return;

    setVerifying(true);
    try {
      const institution = await checkInstitution(code);
      setInstVerified(true);
      setInstName(institution.institutionName);
      setCodeError('');
    } catch {
      setInstVerified(false);
      setInstName('');
      setCodeError('등록되지 않은 기관 코드입니다.');
    } finally {
      setVerifying(false);
    }
  };

  const canGoStep3 = name && phone && email &&
    Object.values(pwCheck).every(Boolean) &&
    pw === pwConfirm;

  const handleSignup = async () => {
    if (!role || !agreedPrivacy || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await signup({
        institutionCode: instCode.trim().toUpperCase(),
        name,
        phone,
        email,
        password: pw,
        role,
        agreedTerms: agreedPrivacy,
      });
      goNext(3);
    } catch (err) {
      setSubmitError(err.message ?? '회원가입에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="jn-layout">
      <div className="jn-info-panel">
        <div className="jn-ellipse jn-ellipse-1" />
        <div className="jn-ellipse jn-ellipse-2" />
        <div className="jn-ellipse jn-ellipse-3" />
        <div className="jn-info-content">
          <div className="jn-brand">
            <div className="jn-brand-logo">
              <div className="jn-brand-logo-inner" />
            </div>
            <span className="jn-brand-name">돌봄ON</span>
          </div>
          <h1 className="jn-headline">
            돌봄ON과 함께<br />더 나은 돌봄을<br />시작하세요.
          </h1>
          <p className="jn-desc">
            기관 코드만 있으면 바로 가입할 수 있어요.<br />
            소속 기관 관리자에게 코드를 받아 시작하세요.
          </p>
          <ul className="jn-features">
            <li>
              <span className="jn-feature-dot" />
              <div>
                <strong>음성 기록 자동화</strong>
                <p>방문 상담을 음성으로 기록하면 AI가 자동 요약</p>
              </div>
            </li>
            <li>
              <span className="jn-feature-dot" />
              <div>
                <strong>이상징후 조기 탐지</strong>
                <p>장기 데이터 분석으로 변화를 미리 감지</p>
              </div>
            </li>
            <li>
              <span className="jn-feature-dot" />
              <div>
                <strong>개인정보 완벽 보호</strong>
                <p>음성 즉시 폐기 · 최소 데이터 저장 원칙</p>
              </div>
            </li>
          </ul>
        </div>
        <p className="jn-panel-footer">AI 기반 재가 노인 돌봄 지원 시스템</p>
      </div>

      <div className="jn-form-side">
        <div className="jn-card">
          <div className="jn-card-header">
            <p className="jn-card-title">회원가입</p>
            <p className="jn-card-sub">기관 코드를 입력하고 계정을 생성하세요.</p>
          </div>

          <div className="jn-card-body">
            <StepIndicator step={step} completed={completed} />

            {step === 1 && (
              <div className="jn-step-body">
                <div className="jn-field">
                  <label className="jn-label">기관 코드</label>
                  <div className="jn-code-row">
                    <input
                      className="jn-input"
                      placeholder="기관 코드를 입력하세요 (예: CJ-2024-0011)"
                      value={instCode}
                      onChange={e => {
                        setInstCode(e.target.value);
                        setInstVerified(false);
                        setInstName('');
                        setCodeError('');
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                    />
                    <button className="jn-verify-btn" onClick={handleVerify} disabled={verifying}>
                      {verifying ? '확인 중...' : '확인'}
                    </button>
                  </div>
                  {codeError && <p className="jn-error">{codeError}</p>}
                </div>
                {instVerified && (
                  <div className="jn-success-banner">
                    <i className="bi bi-check-circle-fill" />
                    <span>기관 코드 확인 완료 — {instCode.toUpperCase()} | {instName}</span>
                  </div>
                )}
                <button
                  className={`jn-btn-primary${!instVerified ? ' disabled' : ''}`}
                  disabled={!instVerified}
                  onClick={() => goNext(1)}
                >
                  다음
                </button>
                <p className="jn-link center" onClick={() => navigate('/')}>로그인으로 돌아가기</p>
                <div className="jn-notice">
                  <p>기관 코드는 소속 기관 관리자에게 문의하세요.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="jn-step-body">
                <p className="jn-inst-label verified">소속 기관: {instName}</p>
                <div className="jn-row">
                  <div className="jn-field">
                    <label className="jn-label">이름</label>
                    <input
                      className="jn-input"
                      placeholder="홍길동"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="jn-field">
                    <label className="jn-label">연락처</label>
                    <input
                      className="jn-input"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={e => setPhone(formatPhone(e.target.value))}
                    />
                  </div>
                </div>
                <div className="jn-field">
                  <label className="jn-label">이메일</label>
                  <input
                    className="jn-input"
                    placeholder="example@welfare.kr"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="jn-field">
                  <label className="jn-label">비밀번호</label>
                  <div className="jn-pw-wrapper">
                    <input
                      className="jn-input"
                      type={showPw ? 'text' : 'password'}
                      placeholder="영문+숫자+특수문자 8자 이상"
                      value={pw}
                      onChange={e => setPw(e.target.value)}
                    />
                    <button type="button" className="jn-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      <i className={`bi bi-eye${showPw ? '' : '-slash'}-fill`} />
                    </button>
                  </div>
                  {pw && (
                    <div className="jn-pw-checks">
                      <div className="jn-pw-check-row">
                        <PwCheckItem ok={pwCheck.length} label="8자 이상" />
                        <PwCheckItem ok={pwCheck.english} label="영문 포함" />
                      </div>
                      <div className="jn-pw-check-row">
                        <PwCheckItem ok={pwCheck.number} label="숫자 포함" />
                        <PwCheckItem ok={pwCheck.special} label="특수문자 포함" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="jn-field">
                  <label className="jn-label">비밀번호 확인</label>
                  <div className="jn-pw-wrapper">
                    <input
                      className="jn-input"
                      type={showPwConfirm ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={pwConfirm}
                      onChange={e => setPwConfirm(e.target.value)}
                    />
                    <button type="button" className="jn-pw-toggle" onClick={() => setShowPwConfirm(!showPwConfirm)}>
                      <i className={`bi bi-eye${showPwConfirm ? '' : '-slash'}-fill`} />
                    </button>
                  </div>
                  {pwConfirm && (
                    <p className={`jn-pw-match${pw === pwConfirm ? ' ok' : ' fail'}`}>
                      {pw === pwConfirm ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.'}
                    </p>
                  )}
                </div>
                <button
                  className={`jn-btn-primary${!canGoStep3 ? ' disabled' : ''}`}
                  disabled={!canGoStep3}
                  onClick={() => canGoStep3 && goNext(2)}
                >
                  다음
                </button>
                <p className="jn-link center" onClick={() => setStep(1)}>이전으로</p>
              </div>
            )}

            {step === 3 && (
              <div className="jn-step-body">
                <p className="jn-inst-label verified">소속 기관: {instName}</p>
                <div className="jn-field">
                  <label className="jn-label">역할 선택</label>
                  <div className="jn-roles">
                    {ROLES.map(r => (
                      <button
                        key={r.key}
                        className={`jn-role-btn${role === r.key ? ' selected' : ''}`}
                        onClick={() => setRole(r.key)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="jn-privacy-row" onClick={() => setAgreedPrivacy(!agreedPrivacy)}>
                  <i
                    className={`bi bi-check-square${agreedPrivacy ? '-fill' : ''}`}
                    style={{
                      color: agreedPrivacy ? 'var(--primaryMid)' : 'var(--textSecondary)',
                      fontSize: 'var(--font-size-lg)',
                    }}
                  />
                  <p>개인정보 처리방침 및 이용약관에 동의합니다.</p>
                  <span className="jn-privacy-link">내용 보기</span>
                </div>
                <div className="jn-submit-row">
                  <p className="jn-already-member" onClick={() => navigate('/')}>
                    이미 계정이 있으신가요?
                  </p>
                  <button
                    className={`jn-btn-primary flex-1${!role || !agreedPrivacy ? ' disabled' : ''}`}
                    disabled={!role || !agreedPrivacy || submitting}
                    onClick={handleSignup}
                  >
                    {submitting ? '가입 처리 중...' : '가입 완료 및 로그인'}
                  </button>
                </div>
                {submitError && <p className="jn-error">{submitError}</p>}
              </div>
            )}

            {step === 4 && (
              <div className="jn-step-body jn-complete">
                <div className="jn-complete-icon">
                  <i className="bi bi-check-lg" />
                </div>
                <p className="jn-complete-title">회원가입이 완료되었습니다!</p>
                <p className="jn-complete-sub">
                  {instName}의&nbsp;
                  {ROLES.find(r => r.key === role)?.label}로 등록되었습니다.
                </p>
                <button className="jn-btn-primary" onClick={() => navigate('/')}>
                  로그인하러 가기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinUs;