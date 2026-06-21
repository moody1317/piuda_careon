import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './Findpw.css';

function FindPWHeader() {
    return (
        <div className="findpw-header">
            <div className="findpw-logo">
                <div className="findpw-logo-inner" />
            </div>
            <div className="findpw-logo-text">
                <p className="findpw-logo-title">돌봄ON</p>
                <p className="findpw-logo-comment">기관 관리자 포털</p>
            </div>
        </div>
    );
}

function CheckItem({ ok, label }) {
    return (
        <div className="pw-check-item">
            <i className={`bi bi-dash-circle-fill${ok ? ' pw-check--ok' : ''}`} />
            <span>{label}</span>
        </div>
    );
}

function FindPW() {
    const navigate = useNavigate();
    const [step, setStep] = useState('email');
    const [institutionCode, setInstitutionCode] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(300);
    const [resendCount, setResendCount] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const otpRefs = useRef([]);

    useEffect(() => {
        if (step !== 'code') return;
        setTimeLeft(300);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [step, resendCount]);

    const formatTime = (s) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleOtpChange = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
    };

    const handleOtpKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0)
            otpRefs.current[i - 1]?.focus();
    };

    const handleResend = () => {
        setOtp(['', '', '', '', '', '']);
        setResendCount(c => c + 1);
        setTimeout(() => otpRefs.current[0]?.focus(), 0);
    };

    const maskedEmail = email
        ? email.replace(/^(.{1,3}).*?(@.+)$/, '$1***$2')
        : 'kim***@cj.welfare.kr';

    const pwCheck = {
        length: password.length >= 8,
        english: /[a-zA-Z]/.test(password),
        number: /\d/.test(password),
        special: /[^a-zA-Z0-9]/.test(password),
    };

    return (
        <AuthLayout>
            <FindPWHeader />

            {step === 'email' && (
                <div className="findpw-body">
                    <p className="findpw-title">비밀번호 찾기</p>
                    <p className="findpw-subtitle">가입 시 등록한 이메일과 기관 코드를 입력하세요.</p>
                    <div className="findpw-field">
                        <label className="findpw-label">기관 코드</label>
                        <input
                            className="findpw-input"
                            placeholder="기관 코드를 입력하세요"
                            value={institutionCode}
                            onChange={e => setInstitutionCode(e.target.value)}
                        />
                    </div>
                    <div className="findpw-field">
                        <label className="findpw-label">이메일</label>
                        <input
                            className="findpw-input"
                            placeholder="가입 시 등록한 이메일 주소"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button className="findpw-btn-primary" onClick={() => setStep('code')}>
                        인증 코드 받기
                    </button>
                    <div className="findpw-notice">
                        <p>인증 코드는 등록된 이메일로 전송됩니다.</p>
                        <p>이메일이 변경되었다면 기관 관리자에게 문의하세요.</p>
                    </div>
                    <p className="findpw-link" onClick={() => navigate('/')}>로그인으로 돌아가기</p>
                </div>
            )}

            {step === 'code' && (
                <div className="findpw-body">
                    <p className="findpw-title">인증 코드 입력</p>
                    <p className="findpw-subtitle">
                        {maskedEmail} 로 전송된<br />
                        6자리 인증 코드를 입력하세요.
                    </p>
                    <div className="otp-wrapper">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => (otpRefs.current[i] = el)}
                                className={`otp-box${digit ? ' otp-box--filled' : ''}`}
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleOtpKeyDown(i, e)}
                            />
                        ))}
                    </div>
                    <p className="otp-timer">남은 시간 {formatTime(timeLeft)}</p>
                    <button className="findpw-btn-primary" onClick={() => setStep('password')}>
                        인증 확인
                    </button>
                    <button className="findpw-btn-secondary" onClick={handleResend}>
                        인증 코드 재전송
                    </button>
                    <p className="findpw-link" onClick={() => setStep('email')}>
                        이메일/기관코드 다시 입력하기
                    </p>
                </div>
            )}

            {step === 'password' && (
                <div className="findpw-body">
                    <p className="findpw-title">새 비밀번호 설정</p>
                    <p className="findpw-subtitle">인증이 완료되었습니다. 새 비밀번호를 설정하세요.</p>
                    <div className="findpw-field">
                        <label className="findpw-label">새 비밀번호</label>
                        <input
                            className="findpw-input"
                            type="password"
                            placeholder="영문+숫자+특수문자 8자 이상"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="findpw-field">
                        <label className="findpw-label">새 비밀번호 확인</label>
                        <input
                            className="findpw-input"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        {confirmPassword && (
                            <p className={`pw-match-msg${password === confirmPassword ? ' pw-match--ok' : ' pw-match--fail'}`}>
                                {password === confirmPassword ? '비밀번호가 일치합니다.' : '비밀번호가 다릅니다.'}
                            </p>
                        )}
                    </div>
                    <div className="pw-checks">
                        <div className="pw-check-row">
                            <CheckItem ok={pwCheck.length} label="8자 이상" />
                            <CheckItem ok={pwCheck.english} label="영문 포함" />
                        </div>
                        <div className="pw-check-row">
                            <CheckItem ok={pwCheck.number} label="숫자 포함" />
                            <CheckItem ok={pwCheck.special} label="특수문자 포함" />
                        </div>
                    </div>
                    <button
                        className="findpw-btn-primary"
                        onClick={() => {
                            if (password === confirmPassword) {
                                alert('비밀번호가 변경되었습니다.');
                                navigate('/');
                            }
                        }}
                    >비밀번호 변경 완료</button>
                    <p className="findpw-link" onClick={() => navigate('/')}>로그인으로 돌아가기</p>
                </div>
            )}
        </AuthLayout>
    );
}

export default FindPW;
