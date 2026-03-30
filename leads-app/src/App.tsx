import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PreAuditFunnel from './components/preaudit/PreAuditFunnel';
import NotEligible from './components/preaudit/NotEligible';
import Login from './components/auth/Login';
import ClientDashboard from './components/client/ClientDashboard';
import ConsultantDashboard from './components/consultant/ConsultantDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PreAuditFunnel />} />
        <Route path="/not-eligible" element={<NotEligible />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/consultant" element={<ConsultantDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
