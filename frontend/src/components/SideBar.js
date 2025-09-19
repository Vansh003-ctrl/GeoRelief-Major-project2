import React, { useState, useEffect } from 'react'; // ✅ useState aur useEffect import karein
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Login status ke liye state

  // ✅ Component load hone par aur token change hone par status check karein
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Agar token hai to true, nahi to false
  }, []);

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "nav-link text-white active-link bg-primary rounded"
      : "nav-link text-white";
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ Token hatayein
    setIsLoggedIn(false); // State update karein
    navigate('/login'); // ✅ Login page par wapas bhej dein
  };

  return (
    <div className="bg-dark text-white p-3 shadow-lg" 
         style={{ width: '250px', position: 'sticky', top: 0, height: '100vh' }}>
      
      <h4 className="text-center mb-4 border-bottom pb-2">GeoRelief Hub</h4>
      <ul className="nav flex-column">
        {/* Navigation links */}
        <li className="nav-item mb-2">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/report-incident" className={getNavLinkClass}>
            <i className="bi bi-file-earmark-plus me-2"></i> Report Incident
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/resources" className={getNavLinkClass}>
            <i className="bi bi-boxes me-2"></i> Manage Resources
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/users" className={getNavLinkClass}>
            <i className="bi bi-people me-2"></i> User Management
          </NavLink>
        </li>

        {/* ✅ Login/Logout button ko conditional render karein */}
        <li className="nav-item mt-4 pt-3 border-top">
          {isLoggedIn ? (
            <button className="nav-link text-white btn btn-link w-100 text-start" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          ) : (
            <NavLink className="nav-link text-white btn btn-link w-100 text-start" to="/login">
              <i className="bi bi-box-arrow-in-right me-2"></i> Login
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;