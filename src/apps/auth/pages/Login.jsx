import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [alwaysLogin, setAlwaysLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthLayout>
            <div className="login-top">
                <div className="logo">
                    <div className="logo-inner" />
                </div>
                <div className='logo-text'>
                    <p className="logo-title">돌봄ON</p>
                    <p className="logo-comment">AI 기반 재가 노인 돌봄 지원 시스템</p>
                </div>
            </div>
            <div className='login-input-form'>
                <p className="login-sub">로그인</p>
                <p className='input-comment'>기관 계정으로 로그인하세요.</p>
                <div className="login-input-field">
                    <p>기관 코드</p>
                    <input className='login-input' placeholder='기관 코드를 입력하세요.' />
                </div>
                <div className="login-input-field">
                    <p>이메일</p>
                    <input className='login-input' placeholder='이메일 주소를 입력하세요.' />
                </div>
                <div className="login-input-field">
                    <div>비밀번호</div>
                    <div className="password-wrapper">
                        <input
                            className='login-input'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='비밀번호를 입력하세요.'
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className={`bi bi-eye${showPassword ? '' : '-slash'}-fill`} />
                        </button>
                    </div>
                </div>
                <div className='login-bottom'>
                    <div className="always-login" onClick={() => setAlwaysLogin(!alwaysLogin)}>
                        <i className={`bi bi-check-square${alwaysLogin ? '-fill' : ''}`} style={{color: `${alwaysLogin ? 'var(--primaryMid)' : 'var(--textSecondary)'}`, fontSize: 'var(--font-size-lg)'}}></i>
                        <p>로그인 상태 유지</p>
                    </div>
                    <p className="find-pw" onClick={() => navigate('/find-password')}>비밀번호 찾기</p>
                </div>
                <button className="login-button">로그인</button>
                <div className='or'>
                    <div className="or-line-left" />
                    <p className="or-text">또는</p>
                    <div className="or-line-right" />
                </div>
                <button className='joinus-button'>계정이 없으신가요?&nbsp;&nbsp;회원가입</button>
                <div className="login-notice">
                    <p>기관 코드는 소속 기관 관리자에게 문의하세요.</p>
                </div>
            </div>
        </AuthLayout>
    );
}

export default Login;
