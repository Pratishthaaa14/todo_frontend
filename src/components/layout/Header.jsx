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
import { Typography, InputBase, IconButton, Paper, Button } from "@mui/material";

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
    useState(false);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const calendarRef = useRef(null);
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
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setCalendarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, calendarRef]);

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
    <header className="sticky top-0 z-50 py-0 pb-20">
      <div className="bg-[#F8F8F8] shadow-lg flex items-center justify-start h-20 px-8">
        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className="flex items-center flex-shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mr: 1,
              color: "#FF6767", // Red for 'ToDo'
            }}
          >
            ToDo
        </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#000000", // Black for 'App'
            }}
          >
            App
              </Typography>
        </Link>

        {/* Search Bar - Centered */}
        <div className="flex-grow flex justify-center px-4">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 w-full max-w-xl shadow-lg border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-[#FF6767]">
            <InputBase
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                color: "#333",
                fontSize: "1rem",
                "&::placeholder": {
                  opacity: 1,
                  color: "#9CA3AF",
                },
              }}
            />
              <IconButton
              type="submit"
              className="bg-[#EF4444] text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0"
              sx={{
                transition: "transform 0.2s, background-color 0.2s",
                "&:hover": {
                  backgroundColor: "#DC2626",
                  transform: "scale(1.05)",
                },
              }}
              aria-label="search"
            >
              <SearchIcon sx={{ color: 'inherit' }} />
            </IconButton>
          </div>
        </div>

        {/* Right-aligned elements */}
        {user && (
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Notification Button */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() =>
                  setNotificationsDropdownOpen(!notificationsDropdownOpen)
                }
                className="relative bg-[#EF4444] text-white rounded-lg h-12 w-12 flex items-center justify-center transition-all duration-200 hover:bg-[#DC2626]"
              >
                <NotificationsIcon sx={{ fontSize: 24 }} />
                {unreadCount > 0 && (
                  <span className="absolute top-[-5px] right-[-5px] bg-[#EF4444] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsDropdownOpen && (
                <Paper
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-10 p-4 transform transition-all duration-300 ease-out origin-top-right"
                  style={{ opacity: notificationsDropdownOpen ? 1 : 0, transform: notificationsDropdownOpen ? 'scale(1)' : 'scale(0.95)' }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
                  >
                    Notifications
                  </Typography>
                  {isLoading ? (
                    <Typography sx={{ textAlign: "center", py: 2 }}>
                      Loading notifications...
                    </Typography>
                  ) : error ? (
                    <Typography
                      color="error"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      Error loading notifications.
                    </Typography>
                  ) : notifications.length === 0 ? (
                    <Typography sx={{ textAlign: "center", py: 2 }}>
                      No new notifications.
                    </Typography>
                  ) : (
                    <>
                      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {notifications.map((notif) => (
                          <li
                            key={notif._id}
                            className={`p-3 rounded-lg ${notif.read ? "bg-gray-100 text-gray-600" : "bg-red-50 text-[#EF4444] font-medium"}
                            ${notif.read ? "" : "hover:bg-red-100"}
                            transition-colors duration-200 cursor-pointer
                          `}
                          // Add onClick to mark as read if needed
                          // onClick={() => handleMarkAsRead(notif._id)}
                          >
                            <Typography variant="body2">
                              <span className="font-bold">{notif.title}: </span>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                      {unreadCount > 0 && (
                        <Button
                          onClick={handleMarkAllAsRead}
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2, bgcolor: "#FF6767", "&:hover": { bgcolor: "#DC2626" } }}
                        >
                          Mark All as Read
                        </Button>
                      )}
                    </>
                  )}
                </Paper>
              )}
            </div>

            {/* Calendar Button */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setCalendarDropdownOpen(!calendarDropdownOpen)}
                className="bg-[#EF4444] text-white rounded-lg h-12 w-12 flex items-center justify-center transition-all duration-200 hover:bg-[#DC2626]"
              >
                <CalendarTodayIcon sx={{ fontSize: 24 }} />
              </button>

              {calendarDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-md rounded-lg text-gray-800  z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 font-semibold text-lg text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="grid grid-cols-7 gap-1 p-2 text-center text-sm font-medium text-gray-500">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 p-2 text-center text-sm">
                    {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => (
                      <span
                        key={day}
                        className={`flex items-center justify-center h-8 w-8 rounded-full ${
                          day === currentDate.getDate() ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Display */}
            <div className="text-gray-700">
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#000000", textAlign: 'left' }}>
                {dayOfWeek}
              </Typography>
              <Typography variant="body2" sx={{ color: "#3B82F6", textAlign: 'left' }}>
                {dateOnly}
              </Typography>
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
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
