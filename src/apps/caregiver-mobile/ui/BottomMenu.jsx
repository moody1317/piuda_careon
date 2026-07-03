import { useNavigate, useLocation } from 'react-router-dom';
import './BottomMenu.css';

const MENUS = [
    { path: '/home', label: '홈', icon: 'bi-house-door' },
    { path: '/schedule', label: '일지', icon: 'bi-calendar3' },
    { path: '/clients', label: '대상자', icon: 'bi-person-plus' },
    { path: '/alerts', label: '알림', icon: 'bi-bell' },
    { path: '/my', label: '내정보', icon: 'bi-person' },
];

function BottomMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="cg-bottom-menu">
            {MENUS.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                    <div
                        key={menu.path}
                        className={`cg-bottom-menu-item${isActive ? ' active' : ''}`}
                        onClick={() => navigate(menu.path)}
                    >
                        <span className="cg-bottom-menu-icon">
                            <i className={`bi ${menu.icon}${isActive ? '-fill' : ''}`} />
                        </span>
                        <span className="cg-bottom-menu-label">{menu.label}</span>
                    </div>
                );
            })}
        </nav>
    );
}

export default BottomMenu;
