import React from "react";
import { Link } from "react-router-dom";
import {
  GridView as DashboardIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import {
  Typography,
  Avatar,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Sidebar = ({ user, logout, location }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    { path: "/dashboard", icon: <DashboardIcon />, text: "Dashboard" },
    { path: "/login", icon: <LogoutIcon />, text: "Logout" },
  ];

  const renderSidebarContent = (
    <Box
      sx={{
        width: 320,
        bgcolor: '#4c1d95',
        color: '#e0e0e0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto, sans-serif',
        borderRadius: 0, 
      }}
    >
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #5b21b6' }}>
        <Avatar
          alt={user?.name || "User"}
          src={user?.avatar || ""}
          sx={{
            width: 100,
            height: 100,
            bgcolor: '#7c3aed',
            color: '#fff',
            fontSize: '3rem',
            fontWeight: 'bold',
            border: '2px solid #a78bfa',
          }}
        >
          {!user?.avatar && user?.email ? user.email[0].toUpperCase() : ""}
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, color: '#fff' }}>
          {user?.name || "User Name"}
        </Typography>
        <Typography variant="body2" sx={{ color: '#d1d5db' }}>
          {user?.email || "user@example.com"}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isLogout = item.text === 'Logout';
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 text-base font-normal transition-all duration-200 ${
                    isActive && !isLogout
                      ? "bg-purple-800 text-white shadow-inner"
                      : "hover:bg-purple-700 text-purple-200 hover:text-white"
                  }`}
                  style={{ borderRadius: 0 }}
                  onClick={() => {
                    if (isLogout) logout();
                    if (isMobile) setDrawerOpen(false);
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 24, color: isActive && !isLogout ? '#fff' : '#a78bfa' }})}
                  <span className="ml-4">{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Static sidebar for larger screens */}
      {!isMobile && (
        <aside className="h-screen shadow-lg sticky top-0">
          {renderSidebarContent}
        </aside>
      )}
    </>
  );
};

export default Sidebar;