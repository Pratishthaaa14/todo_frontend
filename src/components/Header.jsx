import { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAllNotificationsAsRead } from '../api/notifications';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const unreadNotifications = notifications.filter(notif => !notif.read);
  const unreadCount = unreadNotifications.length;

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
    // Refresh notifications every 30 seconds
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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <MenuIcon />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }} className="text-lg sm:text-xl">
              Dashboard
            </Typography>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
            <div className="relative flex items-center bg-gray-50 rounded-full px-4 py-2 shadow-inner border border-gray-200 w-full">
              <input
                type="text"
                placeholder="Search your task here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-grow text-gray-700 placeholder-gray-400 pr-2"
              />
              <button className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-200">
                <SearchIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>

          {/* Right side icons and user info */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search button */}
            <button className="md:hidden p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200">
              <SearchIcon />
            </button>

            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors relative"
              >
                <NotificationsIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-md rounded-xl overflow-hidden z-20">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-purple-600 hover:text-purple-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 border-b border-gray-200 hover:bg-gray-50 flex items-start gap-3 ${
                            !notif.read ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <NotificationsIcon sx={{ color: '#7E22CE' }} />
                          </div>
                          <div className="flex-1">
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: notif.read ? 400 : 600 }}
                            >
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(notif.createdAt).toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Calendar - hidden on mobile */}
            <button className="hidden sm:block p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200">
              <CalendarMonthIcon />
            </button>

            {/* Date - hidden on mobile */}
            <div className="hidden sm:flex text-sm text-gray-600 flex-col items-end">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ color: '#3B82F6' }}>
                {new Date().toLocaleDateString()}
              </Typography>
            </div>

            {/* User avatar */}
            <Avatar sx={{ bgcolor: '#EDE9FE', color: '#7E22CE', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="px-2 space-y-3">
              {/* Mobile search bar */}
              <div className="relative flex items-center bg-gray-50 rounded-full px-4 py-2 shadow-inner border border-gray-200">
                <input
                  type="text"
                  placeholder="Search your task here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none flex-grow text-gray-700 placeholder-gray-400 pr-2"
                />
                <button className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-200">
                  <SearchIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              {/* Mobile date display */}
              <div className="flex items-center justify-between px-2">
                <div className="text-sm text-gray-600">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ color: '#3B82F6' }}>
                    {new Date().toLocaleDateString()}
                  </Typography>
                </div>
                <button className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200">
                  <CalendarMonthIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 