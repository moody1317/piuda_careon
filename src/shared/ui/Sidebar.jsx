import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({menus = []}) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className='sidebar'>
            <div className='sidebar-header'>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-inner" />
                </div>
                <div className='sidebar-header-text'>
                    <p className="sidebar-title">돌봄ON</p>
                    <p className="sidebar-comment">관리자</p>
                </div>
            </div>
            <nav className='sidebar-body'>
                {menus.map((menu, i) => {
                    const isActive = location.pathname === menu.path;
                    return (
                        <div
                            key={i}
                            className={`sidebar-menu-item${isActive ? ' active' : ''}`}
                            onClick={() => navigate(menu.path)}
                        >
                            <span>{menu.label}</span>
                        </div>
                    );
                })}
            </nav>

            <div className='sidebar-info'>
                <div className='sidebar-line' />
                <div className='sidebar-user'>
                    <div className='sidebar-user-img'>
                        '김'
                    </div>
                    <div className='sidebar-user-profile'>
                        <p className='sidebar-user-name'>김관리자</p>
                        <p className='sidebar-user-company'>청주 복지관</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
