import './Header.css';

function Header({ title, subtitle, notificationCount = 0 }) {
    return (
        <div className="header">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
            <div className="header-right">
                <button className="header-bell">
                    <i className="bi bi-bell-fill" />
                    {notificationCount > 0 && (
                        <span className="header-bell-badge">{notificationCount}</span>
                    )}
                </button>
                <button className="header-admin">관리</button>
            </div>
        </div>
    );
}

export default Header;
