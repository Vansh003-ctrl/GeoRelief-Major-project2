import React from 'react';
import Sidebar from './SideBar'; // Sidebar component ko import karein
import Footer from './Footer';   // Footer component ko import karein

const Layout = ({ children }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar ko yahan use karein */}
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        <div className="p-4 flex-grow-1">
          {children} {/* Yahan par har page ka content aayega */}
        </div>
        
        {/* Footer ko yahan use karein */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;