import './AuthLayout.css';

function AuthLayout({ children }) {
    return (
        <div className="auth-layout">
            <div className="ellipse" />
            <div className="ellipse-1" />
            <div className="ellipse-2" />
            <div className="ellipse-3" />
            <div className="ellipse-4" />
            <div className="auth-card">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
