import { useState, useRef, useEffect } from 'react';
import { Typography, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markAllNotificationsAsRead } from '../api/notifications';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#4A0E70' }}>ToDo App</Typography>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5B0E9D]" />
          </div>
          <div className="flex items-center gap-2">
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <NotificationsIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 