import { useState, useRef, useEffect } from 'react';
import { Typography, InputBase, Badge, Avatar, Box, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAllNotificationsAsRead } from '../api/notifications';
import { format } from 'date-fns';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const unreadCount = notifications.filter(notif => !notif.read).length;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast.success("All notifications marked as read!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
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
                  '&:hover': { backgroundColor: '#e9d5ff' },
                }}
              >
                <Badge badgeContent={unreadCount} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl overflow-hidden z-20 border border-purple-100">
                  <div className="p-4 border-b border-purple-100 flex justify-between items-center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5b21b6' }}>Notifications</Typography>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 border-b border-purple-50 flex items-start gap-3 transition-colors ${
                            !notif.read ? 'bg-purple-50' : 'hover:bg-purple-100'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 ${!notif.read ? 'bg-purple-500' : 'bg-transparent'}`}></div>
                          <div className="flex-1">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: notif.read ? 400 : 600, color: '#374151' }}
                            >
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(notif.createdAt), "PPpp")}
                            </Typography>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Avatar sx={{ bgcolor: '#7c3aed', color: '#ffffff', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>

            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none lg:hidden"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
             <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f3e8ff',
                borderRadius: '9999px',
                p: '4px 8px',
                mb: 2,
              }}
            >
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ color: '#5b21b6', flex: 1, ml: 1 }}
              />
              <IconButton sx={{ p: '10px', color: '#5b21b6' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Box>
            <Typography sx={{ color: '#5b21b6', textAlign: 'center' }}>
              {formattedDate}
            </Typography>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 