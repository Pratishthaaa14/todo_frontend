import React from "react";
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
import { Typography, Avatar, Box } from "@mui/material";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ").filter(Boolean); // Filter out empty strings
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Sidebar = ({ user, logout, location, sidebarNavItems }) => {
  const mainNavItems = [
    {
      path: "/dashboard",
      icon: <DashboardIcon sx={{ fontSize: 28 }} />,
      text: "Dashboard",
    },
    {
      path: "/vital-task",
      icon: <VitalTaskIcon sx={{ fontSize: 28 }} />,
      text: "Vital Task",
    },
    {
      path: "/my-task",
      icon: <MyTaskIcon sx={{ fontSize: 28 }} />,
      text: "My Task",
    },
    {
      path: "/task-categories",
      icon: <TaskCategoriesIcon sx={{ fontSize: 28 }} />,
      text: "Task Categories",
    },
    {
      path: "/settings",
      icon: <SettingsIcon sx={{ fontSize: 28 }} />,
      text: "Settings",
    },
    { path: "/help", icon: <HelpIcon sx={{ fontSize: 28 }} />, text: "Help" },
  ];

  return (
    <aside className="w-96 bg-[#FF6767] text-white flex flex-col justify-start shadow-lg relative z-20 rounded-tr-lg">
      {/* Avatar and User Info Section - positioned for overlap */}
      <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-full px-5">
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!user?.avatar && user?.email ? user.email[0].toUpperCase() : ""}
        </Avatar>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#FFF",
            textAlign: "center",
            mt: 4,
          }}
        >
          {user?.name || ''}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: '#FFF',
            textAlign: "center",
            mb: 4,
          }}
        >
          {user?.email || "user@example.com"}
        </Typography>
      </div>

      {/* Spacer to push content below the floating avatar section and its text */}
      <div className="pt-28">
        <div className="w-full border-b border-red-400 mb-4 px-5"></div>

        <nav className="flex-grow px-5">
          <ul className="space-y-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const itemClasses = `flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#EF4444] shadow-md"
                  : "hover:bg-red-500 text-white"
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
          </ul>
        </nav>
      </div>

      {/* Logout button at the bottom as per the new image */}
      <Box sx={{ mt: "auto", pb: 2, px: 5 }}>
        <Link
          to="/login"
          onClick={logout}
          className={`flex items-center p-2 rounded-lg text-lg font-semibold transition-all duration-200 hover:bg-red-500 text-white`}
        >
          <LogoutIcon sx={{ fontSize: 28 }} />
          <span className="ml-3">Logout</span>
        </Link>
      </Box>
    </aside>
  );
};

export default Sidebar;
