import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './apps/auth/pages/Login';
import FindPW from './apps/auth/pages/Findpw';
import JoinUs from './apps/auth/pages/Joinus';
import AdminLayout from './apps/admin-dashboard/AdminLayout';
import Dashboard from './apps/admin-dashboard/pages/Dashboard';
import Risk from './apps/admin-dashboard/pages/Risk';
import Caregiver from './apps/admin-dashboard/pages/Caregiver';
import Counseling from './apps/admin-dashboard/pages/Counseling';
import Statistics from './apps/admin-dashboard/pages/Statistics';
import Settings from './apps/admin-dashboard/pages/Settings';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './shared/style/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/find-password" element={<FindPW />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="risk" element={<Risk />} />
          <Route path="counseling" element={<Counseling />} />
          <Route path="caregiver" element={<Caregiver />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
