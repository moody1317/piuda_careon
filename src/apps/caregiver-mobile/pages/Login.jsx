import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import StatusBar from '../ui/StatusBar';
import { login } from '../../../api/auth';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [orgCode, setOrgCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        if (submitting) return;
        setSubmitting(true);
        setError('');
        try {
            await login({ institutionCode: orgCode, email, password });
            navigate('/home');
        } catch (err) {
            setError(err.message ?? '로그인에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <StatusBar />
            <div className="cg-login">
                <div className="cg-login-brand">
                    <img src={logo} alt="돌봄ON" className="cg-login-logo" />
                    <p className="cg-login-title">돌봄ON</p>
                    <p className="cg-login-subtitle">AI 기반 재가 노인 돌봄 지원 시스템</p>
                </div>

                <div className="cg-login-form">
                    <div className="cg-login-field">
                        <label htmlFor="orgCode">기관 코드</label>
                        <input
                            id="orgCode"
                            className="cg-login-input"
                            placeholder="기관에서 발급된 코드 입력"
                            value={orgCode}
                            onChange={(e) => setOrgCode(e.target.value)}
                        />
                    </div>
                    <div className="cg-login-field">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            className="cg-login-input"
                            placeholder="이메일 주소 입력"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="cg-login-field">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            id="password"
                            type="password"
                            className="cg-login-input"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="cg-login-error">{error}</p>}

                    <button className="cg-login-button" onClick={handleLogin} disabled={submitting}>
                        {submitting ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="cg-login-notice">
                        <p className="cg-login-notice-title">
                            <i className="bi bi-shield-check" /> 개인정보 보호 안내
                        </p>
                        <p className="cg-login-notice-text">
                            음성 데이터는 STT 변환 후 즉시 폐기되며<br />
                            최소한의 데이터만 저장됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;