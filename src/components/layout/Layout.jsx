import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  Logout as LogoutIcon,
  Warning as VitalTaskIcon,
} from '@mui/icons-material';
import { Typography, Avatar, Box } from '@mui/material';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('all');

  const isDashboard = location.pathname === '/dashboard';

  const sidebarNavItems = [
    { path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 28 }} />, text: 'Dashboard' },
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-white font-poppins">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchCriteria={searchCriteria} setSearchCriteria={setSearchCriteria} />
      <div className="flex flex-grow">
        <Sidebar user={user} logout={logout} location={location} sidebarNavItems={sidebarNavItems} />

        {/* Main Content */}
        <main className="flex-grow flex flex-col overflow-auto">
          <Outlet context={{ searchQuery, setSearchQuery, searchCriteria, setSearchCriteria }} />
      </main>
      </div>
    </div>
  );
};

export default Layout;
