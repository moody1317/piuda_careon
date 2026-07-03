import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import StatusBar from '../ui/StatusBar';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [orgCode, setOrgCode] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigate('/home');
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
                        <label htmlFor="userId">아이디</label>
                        <input
                            id="userId"
                            className="cg-login-input"
                            placeholder="아이디"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
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

                    <button className="cg-login-button" onClick={handleLogin}>로그인</button>

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
