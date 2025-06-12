import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../../services/api";
import { Typography, InputBase, IconButton, Paper } from "@mui/material";

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
    useState(false);
  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Get current date and day
  const currentDate = new Date();
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-GB", options);
  const [dayOfWeek, dateOnly] = formattedDate.split(", ");

  // Fetch notifications using react-query
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    refetchOnWindowFocus: true, // Re-fetch when window regains focus
  });

  // State to hold notifications, always an array
  const [notifications, setNotifications] = useState([]);

  // Update notifications state when notificationsData changes and is an array
  useEffect(() => {
    if (Array.isArray(notificationsData)) {
      setNotifications(notificationsData);
    }
  }, [notificationsData]);

  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notifications marked as read!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to mark notifications as read.");
    },
  });

  const unreadNotifications = notifications.filter((notif) => !notif.read);
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    if (
      !user &&
      !["/login", "/register", "/forgot-password"].includes(location.pathname)
    ) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, userDropdownRef]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUserDropdownOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markReadMutation.mutate();
  };

  const menuItems = user
    ? [] // No menu items for logged-in user in header (removed Dashboard)
    : [
        { text: "Login", path: "/login", icon: <LoginIcon /> },
        { text: "Register", path: "/register", icon: <RegisterIcon /> },
      ];

  return (
    <header className="sticky top-0 z-50 py-0">
      <div className="bg-blue-100 shadow-lg flex items-center justify-between h-20 px-8">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className="flex items-center flex-shrink-0"
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mr: 1,
              color: "#7E22CE", // Deep purple for 'Dash'
            }}
          >
            ToDo
        </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#5B21B6", // Indigo for 'board'
            }}
          >
            App
              </Typography>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 ml-auto flex-shrink-0">
          {/* Search Bar */}
          <div className="flex items-center bg-purple-50 rounded-2xl px-4 py-2 w-120 shadow-inner border border-purple-200 transition-all focus-within:ring-2 focus-within:ring-purple-300">
            <InputBase
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                color: "#4A0E70",
                fontSize: "1rem",
                "&::placeholder": {
                  opacity: 0.8,
                  color: "#7E22CE",
                },
              }}
            />
              <IconButton
              type="submit"
              sx={{
                p: "10px",
                color: "#7E22CE",
                transition: "transform 0.2s, color 0.2s",
                "&:hover": {
                  color: "#5B0E9D",
                  transform: "scale(1.1)",
                },
              }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              {/* Notification Button */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() =>
                    setNotificationsDropdownOpen(!notificationsDropdownOpen)
                  }
                  className="relative bg-purple-600 text-white rounded-lg h-12 w-12 flex items-center justify-center transition-all duration-200 hover:bg-purple-700 shadow-md"
                >
                  <NotificationsIcon sx={{ fontSize: 24 }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-6 w-6 text-xs bg-purple-600 text-white rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-indigo-900 shadow-lg rounded-lg text-violet-100 border border-indigo-600 z-50 overflow-hidden">
                    <div className="p-4 border-b border-indigo-700 font-semibold text-lg">
                      Notifications
                    </div>
                    {isLoading ? (
                      <div className="p-4 text-center text-sm">
                        Loading notifications...
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center text-sm text-red-300">
                        Failed to load notifications.
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-purple-200">
                        No new notifications.
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id || notif._id}
                            className={`px-4 py-3 border-b border-indigo-700 last:border-b-0 text-sm ${
                              notif.read
                                ? "bg-indigo-800 opacity-75"
                                : "bg-indigo-700 hover:bg-indigo-600"
                            }`}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: notif.read ? "#a78bfa" : "white" }}
                            >
                              {notif.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#c4b5fd", fontSize: "0.75rem" }}
                            >
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full text-center py-2 px-4 bg-indigo-800 hover:bg-indigo-700 text-purple-200 text-sm font-semibold flex items-center justify-center gap-2 border-t border-indigo-700"
                      >
                        <CheckCircleOutlineIcon fontSize="small" /> Mark all as
                        read
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Date Display */}
              <div className="text-gray-700 text-right">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#7E22CE" }}
                >
                  {" "}
                  {/* Purple color */}
                  {dayOfWeek}
                </Typography>
                <Typography variant="body2" sx={{ color: "#5B21B6" }}>
                  {" "}
                  {/* Darker purple color */}
                  {dateOnly}
                </Typography>
              </div>

              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-12 h-12 rounded-full bg-purple-200 text-purple-900 font-bold flex items-center justify-center border-2 border-purple-600 hover:bg-purple-300 flex-shrink-0"
                >
                  {user.email?.[0]?.toUpperCase()}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-indigo-900 shadow-lg rounded-lg text-violet-100 border border-indigo-600 z-50">
                    <div className="px-4 py-2 text-sm truncate border-b border-indigo-700">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-800 flex items-center"
                    >
                      <LogoutIcon className="mr-2" fontSize="small" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800"
          >
            {menuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-4 space-y-3 border-t border-gray-200 text-gray-800">
          {menuItems.map((item) => (
            <Link
              key={item.text}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded-md ${
                location.pathname === item.path
                  ? "bg-gray-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                {item.text}
              </div>
            </Link>
          ))}
          {user && (
            <>
              {/* Notifications for Mobile */}
              <div className="relative w-full">
                <button
                  onClick={() =>
                    setNotificationsDropdownOpen(!notificationsDropdownOpen)
                  }
                  className="flex items-center w-full py-2 px-3 rounded-md hover:bg-gray-100 relative transition"
                >
                  <NotificationsIcon className="mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsDropdownOpen && (
                  <div className="mt-2 bg-indigo-900 shadow-lg rounded-lg text-violet-100 border border-indigo-600 z-50 overflow-hidden">
                    {isLoading ? (
                      <div className="p-3 text-center text-sm">
                        Loading notifications...
                      </div>
                    ) : error ? (
                      <div className="p-3 text-center text-sm text-red-300">
                        Failed to load notifications.
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-3 text-center text-sm text-purple-200">
                        No new notifications.
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id || notif._id}
                            className={`px-3 py-2 border-b border-indigo-700 last:border-b-0 text-xs ${
                              notif.read
                                ? "bg-indigo-700 opacity-75"
                                : "hover:bg-indigo-600"
                            }`}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: notif.read ? "#a78bfa" : "white" }}
                            >
                              {notif.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#c4b5fd", fontSize: "0.65rem" }}
                            >
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="w-full text-center py-2 px-3 bg-indigo-700 hover:bg-indigo-600 text-purple-200 text-xs font-semibold flex items-center justify-center gap-2 border-t border-indigo-700"
                      >
                        <CheckCircleOutlineIcon fontSize="small" /> Mark all as
                        read
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-700">{user.email}</div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 px-3 rounded-md hover:bg-gray-100"
              >
                <LogoutIcon className="mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
