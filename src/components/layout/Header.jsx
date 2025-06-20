import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
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
  Badge,
  Box,
  Avatar,
} from "@mui/material";
import { format } from "date-fns";

const Header = ({
  searchQuery,
  setSearchQuery,
  logout,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
    useState(false);
  const notificationRef = useRef(null);
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const formattedDate = format(new Date(), "EEEE, MMM d");

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 60000,
    refetchInterval: 60000,
  });

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (notificationsData && Array.isArray(notificationsData.data)) {
      setNotifications(notificationsData.data);
    }
  }, [notificationsData]);

  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All caught up! Notifications cleared.");
    },
    onError: (err) => {
      toast.error(err.message || "Couldn't mark notifications as read.");
    },
  });

  const markSingleReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update notification.");
    },
  });

  const handleMarkAsRead = (notificationId) => {
    markSingleReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markReadMutation.mutate();
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  if (!user) {
    return null; 
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#5b21b6' }} className="text-xl sm:text-2xl">
                ToDo Flow
              </Typography>
            </div>

            <div className="flex-1 mx-4 sm:mx-6 lg:mx-8">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f3e8ff',
                  borderRadius: '9999px',
                  p: '4px 8px',
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                <InputBase
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    color: '#5b21b6',
                    flex: 1,
                    ml: 1,
                    '& .MuiInputBase-input::placeholder': {
                      color: '#9333ea',
                      opacity: 1,
                    },
                  }}
                />
                <IconButton sx={{ p: '10px', color: '#5b21b6' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Box>
            </div>

            <div className="flex items-center gap-4">
              <Typography sx={{ display: { xs: 'none', md: 'block' }, color: '#5b21b6' }}>
                {formattedDate}
              </Typography>

              <div ref={notificationRef} className="relative">
                <IconButton
                  onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                  sx={{
                    backgroundColor: '#f3e8ff',
                    color: '#5b21b6',
                    width: 48,
                    height: 48,
                    '&:hover': { backgroundColor: '#e9d5ff' },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                {notificationsDropdownOpen && (
                  <Paper
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 p-0 notification-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-purple-100 flex justify-between items-center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5b21b6' }}>Notifications</Typography>
                      {unreadCount > 0 && (
                        <Button
                          onClick={handleMarkAllAsRead}
                          size="small"
                          sx={{ color: '#5b21b6', textTransform: 'none' }}
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {isLoading ? (
                        <Typography sx={{ textAlign: 'center', py: 2, color: '#6b7280' }}>Loading...</Typography>
                      ) : error ? (
                        <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
                          Error loading notifications.
                        </Typography>
                      ) : notifications.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 2, color: '#6b7280' }}>
                          No new notifications.
                        </Typography>
                      ) : (
                        <ul className="divide-y divide-purple-50">
                          {notifications.map((notif) => (
                            <li
                              key={notif._id}
                              className={`p-3 transition-colors duration-200 ${!notif.read ? 'bg-purple-50 hover:bg-purple-100 cursor-pointer' : ''}`}
                              onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                            >
                              <div className="flex items-start gap-3">
                                {!notif.read && (
                                   <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                )}
                                <div className="flex-1">
                                  <Typography variant="body2" sx={{ color: '#333' }}>
                                    <strong>{notif.title}: </strong>
                                    {notif.message}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {format(new Date(notif.createdAt), "PPpp")}
                                  </Typography>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Paper>
                )}
              </div>

              <Avatar sx={{ bgcolor: '#7c3aed', color: '#ffffff', fontWeight: 'bold' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>

              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{ display: { lg: 'none' }, color: '#5b21b6' }}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[9999] flex">
          <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="self-end text-2xl text-[#5b21b6] mb-4"
              aria-label="Close menu"
            >
              &times;
            </button>
            <Link to="/dashboard" className="mb-4 text-lg font-semibold text-[#5b21b6]" onClick={() => setSidebarOpen(false)}>
              Dashboard
            </Link>
            <Link to="/tasks" className="mb-4 text-lg font-semibold text-[#5b21b6]" onClick={() => setSidebarOpen(false)}>
              Tasks
            </Link>
            <Link to="/profile" className="mb-4 text-lg font-semibold text-[#5b21b6]" onClick={() => setSidebarOpen(false)}>
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="mt-auto text-lg font-semibold text-[#5b21b6] hover:text-purple-800 transition-colors"
            >
              Logout
            </button>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Header;