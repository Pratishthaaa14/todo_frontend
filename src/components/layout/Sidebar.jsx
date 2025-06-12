import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Typography, Avatar } from '@mui/material';

const Sidebar = ({ user, logout, location, sidebarNavItems }) => {
  const allNavItems = [
    ...sidebarNavItems,
    { path: '#', icon: <LogoutIcon sx={{ fontSize: 28 }} />, text: 'Logout', onClick: logout },
  ];

  return (
    <aside className="w-60 bg-purple-800 text-white p-5 flex flex-col justify-start shadow-lg relative z-20">
      <div className="flex flex-col items-center mb-6">
        <Avatar
          alt={user?.email ? user.email[0].toUpperCase() : 'U'}
          src="/path/to/user-image.jpg"
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#ffff99',
            color: '#000000',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            border: '4px solid #8B5CF6',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            mb: 2,
          }}
        >
          {user?.email ? user.email[0].toUpperCase() : 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFF', textAlign: 'center' }}>
          {user?.email.split('@')[0]}
        </Typography>
        <Typography variant="body2" sx={{ color: '#C4B5FD', textAlign: 'center' }}>
          {user?.email}
        </Typography>
      </div>

      <nav className="">
        <ul className="space-y-2">
          {allNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={item.onClick || (() => {})}
                className={`flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${location.pathname === item.path ? 'bg-purple-700 text-white shadow-md' : 'hover:bg-purple-700 text-purple-100'}`}
              >
                {item.icon}
                <span className="ml-3">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 