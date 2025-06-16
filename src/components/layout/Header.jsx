import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/api";
import {
  Typography,
  InputBase,
  IconButton,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

const Header = ({ searchQuery, setSearchQuery, searchCriteria, setSearchCriteria }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const calendarRef = useRef(null);
  const queryClient = useQueryClient();

  const currentDate = new Date();
  const options = { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-GB", options);
  const [dayOfWeek, dateOnly] = formattedDate.split(", ");

  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 0,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    onError: (error) => {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  });

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (notificationsData && Array.isArray(notificationsData.data)) {
      console.log('Updating notifications:', notificationsData.data);
      setNotifications(notificationsData.data);
    }
  }, [notificationsData]);

  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read!");
    },
    onError: (err) => {
      console.error('Error marking notifications as read:', err);
      toast.error(err.message || "Failed to mark notifications as read.");
    },
  });

  const markSingleReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification marked as read!");
    },
    onError: (err) => {
      console.error('Error marking notification as read:', err);
      toast.error(err.message || "Failed to mark notification as read.");
    },
  });

  const handleMarkAsRead = (notificationId) => {
    markSingleReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markReadMutation.mutate();
  };

  const unreadNotifications = notifications.filter((notif) => !notif.read);
  const unreadCount = unreadNotifications.length;

  useEffect(() => {
    if (!user && !["/login", "/register", "/forgot-password"].includes(location.pathname)) {
      navigate("/login");
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Notification Icon */}
      {user && (
        <div
          className="sm:hidden fixed top-3 right-3 z-50"
          ref={notificationRef}
        >
          <button
            onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
            className="relative bg-[#EF4444] text-white rounded-lg h-10 w-10 flex items-center justify-center hover:bg-[#DC2626]"
          >
            <NotificationsIcon sx={{ fontSize: 20 }} />
            {unreadCount > 0 && (
              <span className="absolute top-[-5px] right-[-5px] bg-white text-[#EF4444] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsDropdownOpen && (
            <Paper className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 p-4">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                Notifications
              </Typography>
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <Typography sx={{ textAlign: "center", py: 2 }}>Loading...</Typography>
                ) : error ? (
                  <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
                    Error loading notifications.
                  </Typography>
                ) : notifications.length === 0 ? (
                  <Typography sx={{ textAlign: "center", py: 2 }}>No new notifications.</Typography>
                ) : (
                  <ul className="space-y-2">
                    {notifications.map((notif) => (
                      <li
                        key={notif._id}
                        className={`p-3 rounded-lg ${
                          notif.read
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-50 text-[#EF4444] font-medium hover:bg-red-100"
                        } transition-colors duration-200`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="body2">
                              <strong>{notif.title}: </strong>
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 2, 
                    bgcolor: "#FF6767", 
                    "&:hover": { bgcolor: "#DC2626" },
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  Mark All as Read
                </Button>
              )}
            </Paper>
          )}
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40">
        <div className="bg-[#F8F8F8] shadow-lg flex items-center justify-between flex-wrap px-4 sm:px-10 h-20">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/login"} className="flex items-center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#FF6767", mr: 1 }}>
              ToDo
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#000000" }}>
              App
            </Typography>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow flex justify-center w-full sm:w-auto pt-6 sm:pt-0">
            <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 w-full max-w-xl shadow border border-gray-200 focus-within:ring-2 focus-within:ring-[#FF6767] transition-all">
              <InputBase
                placeholder="Search your task here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  ml: 1,
                  flex: 1,
                  color: "#333",
                  fontSize: "0.9rem",
                  "&::placeholder": {
                    color: "#9CA3AF",
                    opacity: 1,
                  },
                }}
              />
              <FormControl variant="standard" sx={{ minWidth: 100, ml: 2 }}>
                <Select
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Search criteria' }}
                  sx={{
                    height: '36px',
                    fontSize: '0.875rem',
                    color: '#333',
                    border: 'none',
                    '&:before': { borderBottom: 'none !important' },
                    '&:after': { borderBottom: 'none !important' },
                    '.MuiSelect-select': { paddingRight: '24px !important' },
                    '.MuiSvgIcon-root': { color: '#333' },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                </Select>
              </FormControl>
              <IconButton
                type="submit"
                className="bg-[#EF4444] text-white rounded-lg w-9 h-9 flex items-center justify-center ml-2"
                sx={{
                  transition: "transform 0.2s, background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#DC2626",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <SearchIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </div>

          {/* Right Controls */}
          {user && (
            <div className="hidden sm:flex items-center gap-4 ml-4">
              {/* Notifications Icon + Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                  className="relative bg-[#EF4444] text-white rounded-lg h-10 w-10 flex items-center justify-center hover:bg-[#DC2626]"
                >
                  <NotificationsIcon sx={{ fontSize: 20 }} />
                  {unreadCount > 0 && (
                    <span className="absolute top-[-5px] right-[-5px] bg-white text-[#EF4444] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsDropdownOpen && (
                  <Paper className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-10 p-4">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                      Notifications
                    </Typography>
                    <div className="max-h-60 overflow-y-auto">
                      {isLoading ? (
                        <Typography sx={{ textAlign: "center", py: 2 }}>Loading...</Typography>
                      ) : error ? (
                        <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
                          Error loading notifications.
                        </Typography>
                      ) : notifications.length === 0 ? (
                        <Typography sx={{ textAlign: "center", py: 2 }}>No new notifications.</Typography>
                      ) : (
                        <ul className="space-y-2">
                          {notifications.map((notif) => (
                            <li
                              key={notif._id}
                              className={`p-3 rounded-lg ${
                                notif.read
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-red-50 text-[#EF4444] font-medium hover:bg-red-100"
                              } transition-colors duration-200`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <Typography variant="body2">
                                    <strong>{notif.title}: </strong>
                                    {notif.message}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {new Date(notif.createdAt).toLocaleString()}
                                  </Typography>
                                </div>
                                
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        onClick={handleMarkAllAsRead}
                        variant="contained"
                        fullWidth
                        sx={{ 
                          mt: 2, 
                          bgcolor: "#FF6767", 
                          "&:hover": { bgcolor: "#DC2626" },
                          textTransform: "none",
                          fontWeight: 600
                        }}
                      >
                        Mark All as Read
                      </Button>
                    )}
                  </Paper>
                )}
              </div>

              {/* Calendar Icon + Dropdown */}
              <div className="relative flex items-center gap-4" ref={calendarRef}>
                <button
                  onClick={() => setCalendarDropdownOpen(!calendarDropdownOpen)}
                  className="bg-[#EF4444] text-white rounded-lg h-10 w-10 flex items-center justify-center hover:bg-[#DC2626]"
                >
                  <CalendarTodayIcon sx={{ fontSize: 20 }} />
                </button>
                {calendarDropdownOpen && (
                  <Paper className="absolute right-0 top-16 w-80 bg-white rounded-xl shadow-xl z-10 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                        Calendar
                      </Typography>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-center font-semibold text-sm mb-2">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {(() => {
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth();
                          const firstDay = new Date(year, month, 1);
                          const lastDay = new Date(year, month + 1, 0);
                          const firstDayOfWeek = firstDay.getDay();
                          const prevMonthLastDay = new Date(year, month, 0).getDate();
                          const prevMonthDays = Array.from(
                            { length: firstDayOfWeek },
                            (_, i) => prevMonthLastDay - firstDayOfWeek + i + 1
                          );
                          const currentMonthDays = Array.from(
                            { length: lastDay.getDate() },
                            (_, i) => i + 1
                          );
                          const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
                          const nextMonthDays = Array.from(
                            { length: remainingDays },
                            (_, i) => i + 1
                          );
                          const allDays = [
                            ...prevMonthDays.map(day => ({ day, isCurrentMonth: false })),
                            ...currentMonthDays.map(day => ({ day, isCurrentMonth: true })),
                            ...nextMonthDays.map(day => ({ day, isCurrentMonth: false }))
                          ];
                          return allDays.map(({ day, isCurrentMonth }, index) => (
                            <span
                              key={index}
                              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                                isCurrentMonth
                                  ? day === currentDate.getDate()
                                    ? 'bg-[#EF4444] text-white'
                                    : 'hover:bg-gray-100'
                                  : 'text-gray-400'
                              }`}
                            >
                              {day}
                            </span>
                          ));
                        })()}
                      </div>
                    </div>
                  </Paper>
                )}
              </div>
              {/* Day and Date Display */}
              <div className="flex flex-col items-start ml-4">
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>{dayOfWeek}</span>
                <span style={{ color: '#2196f3', fontWeight: 500, fontSize: '1rem' }}>{dateOnly}</span>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
