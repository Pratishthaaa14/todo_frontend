import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  ErrorOutline as VitalTaskIcon,
  Checklist as MyTaskIcon,
  Category as TaskCategoriesIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import {
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Sidebar = ({ user, logout, location }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const mainNavItems = [
    { path: "/dashboard", icon: <DashboardIcon sx={{ fontSize: 28 }} />, text: "Dashboard" },
    { path: "/profile", icon: <SettingsIcon sx={{ fontSize: 28 }} />, text: "Profile" },
    { path: "/vital-task", icon: <VitalTaskIcon sx={{ fontSize: 28 }} />, text: "Vital Task" },
    { path: "/my-task", icon: <MyTaskIcon sx={{ fontSize: 28 }} />, text: "My Task" },
    
  ];

  const additionalNavItems = [
    { path: "/task-categories", icon: <TaskCategoriesIcon sx={{ fontSize: 28 }} />, text: "Task Categories" },
    { path: "/settings", icon: <SettingsIcon sx={{ fontSize: 28 }} />, text: "Settings" },
    { path: "/help", icon: <HelpIcon sx={{ fontSize: 28 }} />, text: "Help" },
  ];

  const renderSidebarContent = (
    <div className="w-80 bg-[#FF6767] text-white h-screen flex flex-col rounded-tr-lg">
      <div className="flex flex-col items-center mt-10 px-5">
        <Avatar
          alt={user?.name || "User"}
          src={user?.avatar || ""}
          sx={{
            width: 90,
            height: 90,
            bgcolor: user?.avatar ? "transparent" : "#fff",
            color: "#EF4444",
            fontSize: "3rem",
            fontWeight: "bold",
            border: "3px solid white",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          {!user?.avatar && user?.email ? user.email[0].toUpperCase() : ""}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
          {user?.name || ""}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 3 }}>
          {user?.email || "user@example.com"}
        </Typography>
      </div>

      <div className="px-5">
        <ul className="space-y-2 mt-2">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const itemClasses = `flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
              isActive ? "bg-white text-[#EF4444] shadow-md" : "hover:bg-red-500 text-white"
            }`;
            return (
              <li key={item.path}>
                <Link to={item.path} className={itemClasses} onClick={() => isMobile && setDrawerOpen(false)}>
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </Link>
              </li>
            );
          })}

          {/* Additional navigation items - only visible on large screens */}
          {!isMobile && additionalNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const itemClasses = `flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
              isActive ? "bg-white text-[#EF4444] shadow-md" : "hover:bg-red-500 text-white"
            }`;
            return (
              <li key={item.path}>
                <Link to={item.path} className={itemClasses}>
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </Link>
              </li>
            );
          })}

          {/* Logout button */}
          <li className="mt-4">
            <Link
              to="/login"
              onClick={() => {
                logout();
                isMobile && setDrawerOpen(false);
              }}
              className="flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 hover:bg-red-500 text-white"
            >
              <LogoutIcon sx={{ fontSize: 28 }} />
              <span className="ml-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Static sidebar for larger screens */}
      {!isMobile && (
        <aside className="w-80 bg-[#FF6767] min-h-screen text-white flex flex-col shadow-lg rounded-tr-lg">
          {renderSidebarContent}
        </aside>
      )}
    </>
  );
};

export default Sidebar;
