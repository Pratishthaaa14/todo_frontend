import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Typography,
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
                        <Typography sx={{ textAlign: "center", py: 2, color: "#6b7280" }}>
                          You have no notifications yet.
                        </Typography>
                      ) : (
                        <div>
                          {notifications.map((notif) => (
                            <Accordion
                              key={notif._id}
                              sx={{
                                boxShadow: "none",
                                borderBottom: "1px solid #e9d5ff",
                                "&:before": { display: "none" },
                                "&.Mui-expanded": { margin: 0 },
                              }}
                              onClick={() =>
                                !notif.read && handleMarkAsRead(notif._id)
                              }
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${notif._id}-content`}
                                id={`panel-${notif._id}-header`}
                                sx={{
                                  padding: "0 16px",
                                  minHeight: "auto",
                                  "& .MuiAccordionSummary-content": {
                                    margin: "12px 0",
                                  },
                                  backgroundColor: !notif.read
                                    ? "#f3e8ff"
                                    : "transparent",
                                }}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  {!notif.read && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0"></div>
                                  )}
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: "600",
                                      color: "#5b21b6",
                                      flexGrow: 1,
                                    }}
                                  >
                                    {notif.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{ flexShrink: 0 }}
                                  >
                                    {format(new Date(notif.createdAt), "MMM d")}
                                  </Typography>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails
                                sx={{ padding: "0 16px 16px" }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#374151" }}
                                >
                                  {notif.message}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </div>
                      )}
                    </div>
                  </Paper>
                )}
              </div>

              {/* <Avatar
                sx={{
                  bgcolor: '#5b21b6',
                  color: 'white',
                  width: 48,
                  height: 48,
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                }}
                onClick={() => navigate("/profile")}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </Avatar> */}

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
        <div
          className="fixed inset-0 z-50 flex"
              onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-800 to-purple-900 shadow-xl p-6 transition-transform transform translate-x-0 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                ToDo Flow
              </Typography>
              <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </div>
            <nav className="flex-grow">
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ease-in-out ${
                  location.pathname.includes("/dashboard")
                    ? "bg-white/20 text-white"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                }`}
            >
                <DashboardIcon />
                <Typography variant="body1" sx={{ fontWeight: "600" }}>Dashboard</Typography>
            </Link>
            </nav>
            <div>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
                className="flex items-center gap-4 p-3 w-full rounded-lg text-purple-200 hover:bg-white/10 hover:text-white transition-all duration-200 ease-in-out"
            >
                <LogoutIcon />
                <Typography variant="body1" sx={{ fontWeight: "600" }}>Logout</Typography>
            </button>
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;