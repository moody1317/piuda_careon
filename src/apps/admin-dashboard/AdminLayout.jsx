import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';
import './AdminLayout.css';

const ADMIN_MENUS = [
    { label: '대시보드 홈',    path: '/dashboard' },
    { label: '위험군 관리',    path: '/dashboard/risk' },
    { label: '상담일지 목록',  path: '/dashboard/counseling' },
    { label: '생활지원사 관리', path: '/dashboard/caregiver' },
    { label: '통계 및 리포트', path: '/dashboard/statistics' },
    { label: '설정',           path: '/dashboard/settings' },
];

function getTodayString() {
    return new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });
}

function AdminLayout() {
    const location = useLocation();
    const currentMenu = ADMIN_MENUS.find(m => m.path === location.pathname);
    const pageTitle = currentMenu?.label ?? '대시보드';

    return (
        <div className="admin-layout">
            <Sidebar menus={ADMIN_MENUS} />
            <div className="admin-main">
                <Header
                    title={pageTitle}
                    subtitle={getTodayString()}
                    notificationCount={3}
                />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
