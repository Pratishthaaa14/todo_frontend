import { useState, useRef, useEffect } from 'react';
import { Typography, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markAllNotificationsAsRead } from '../api/notifications';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const unreadNotifications = notifications.filter(notif => !notif.read);
  const unreadCount = unreadNotifications.length;
  const queryClient = useQueryClient();
  const markReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notifications marked as read!");
    },
    onError (err) { toast.error(err.message || "Failed to mark notifications as read."); }
  });
  const { data: notificationsData } = useQuery(["notifications"], fetchNotifications, { refetchInterval: 30000 });
  useEffect(() => { if (Array.isArray(notificationsData)) { setNotifications(notificationsData); } }, [notificationsData]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) { setNotificationsDropdownOpen(false); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);
  const handleMarkAllAsRead = () => { markReadMutation.mutate(); };
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>Dashboard</Typography>
        </div>
        <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-2">
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
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (notifications.map((notif) => (
                      <div key={notif._id} className="p-4 border-b border-gray-200 hover:bg-gray-50 flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <NotificationsIcon sx={{ color: '#7E22CE' }} />
                        </div>
                        <div className="flex-1">
                          <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>{notif.message}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(notif.createdAt).toLocaleString()}</Typography>
                        </div>
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>
            <button className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200">
              <CalendarMonthIcon />
            </button>
            <div className="text-sm text-gray-600 flex flex-col items-end">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Tuesday</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ color: '#3B82F6' }}>20/06/2023</Typography>
            </div>
            <Avatar sx={{ bgcolor: '#EDE9FE', color: '#7E22CE', fontWeight: 'bold' }}>V</Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 