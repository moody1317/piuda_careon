import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './apps/auth/pages/Login';
import FindPW from './apps/auth/pages/Findpw';
import JoinUs from './apps/auth/pages/Joinus';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './shared/style/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/find-password" element={<FindPW />} />
        <Route path="/joinus" element={<JoinUs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
