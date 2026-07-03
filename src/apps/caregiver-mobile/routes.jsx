import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import ClientProfile from './pages/ClientProfile';
import ClientDetail from './pages/ClientDetail';
import CaseDetail from './pages/CaseDetail';
import Alert from './pages/Alert';
import Mypage from './pages/Mypage';
import ChangePassword from './pages/ChangePassword';
import PrivacyNotice from './pages/PrivacyNotice';
import NotificationSettings from './pages/NotificationSettings';
import VisitRecording from './pages/VisitRecording';
import AiDraftReview from './pages/AiDraftReview';

function CaregiverMobileRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/client-detail" element={<ClientDetail />} />
            <Route path="/clients" element={<ClientProfile />} />
            <Route path="/clients/case-detail" element={<CaseDetail />} />
            <Route path="/alerts" element={<Alert />} />
            <Route path="/my" element={<Mypage />} />
            <Route path="/my/change-password" element={<ChangePassword />} />
            <Route path="/my/privacy" element={<PrivacyNotice />} />
            <Route path="/my/notifications" element={<NotificationSettings />} />
            <Route path="/visit-recording" element={<VisitRecording />} />
            <Route path="/ai-draft-review" element={<AiDraftReview />} />
        </Routes>
    );
}

export default CaregiverMobileRoutes;
