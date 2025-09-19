import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import ResourceManagement from './pages/ResourceManagement';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes ko PrivateRoute se wrap karein */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/report-incident" element={<PrivateRoute><Layout><ReportIncident /></Layout></PrivateRoute>} />
        <Route path="/resources" element={<PrivateRoute><Layout><ResourceManagement /></Layout></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Layout><UserManagement /></Layout></PrivateRoute>} />

        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
export default App;