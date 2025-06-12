import { useState, useEffect, useRef } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import { useAuth } from "../context/AuthContext";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CalendarToday as CalendarTodayIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getNotifications, markAllNotificationsAsRead } from "../services/api";
import CompletedTasks from "../components/CompletedTasks";

export const Dashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const { searchQuery, setSearchQuery } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const queryClient = useQueryClient();

  // Header related states and functions (moved from Header.jsx)
  // const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  // const notificationRef = useRef(null);
  // const userDropdownRef = useRef(null); // Keep for potential user dropdown if needed elsewhere

  // // Get current date and day
  // const currentDate = new Date();
  // const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
  // const formattedDate = currentDate.toLocaleDateString('en-GB', options);
  // const [dayOfWeek, dateOnly] = formattedDate.split(', ');

  // // Fetch notifications using react-query
  // const { data: notificationsData, isLoading, error } = useQuery({
  //   queryKey: ["notifications"],
  //   queryFn: getNotifications,
  //   staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  //   refetchOnWindowFocus: true, // Re-fetch when window regains focus
  // });

  // // State to hold notifications, always an array
  // const [notifications, setNotifications] = useState([]);

  // // Update notifications state when notificationsData changes and is an array
  // useEffect(() => {
  //   if (Array.isArray(notificationsData)) {
  //     setNotifications(notificationsData);
  //   }
  // }, [notificationsData]);

  // const markReadMutation = useMutation({
  //   mutationFn: markAllNotificationsAsRead,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["notifications"]);
  //     toast.success("Notifications marked as read!");
  //   },
  //   onError: (err) => {
  //     toast.error(err.message || "Failed to mark notifications as read.");
  //   },
  // });

  // const unreadNotifications = notifications.filter(notif => !notif.read);
  // const unreadCount = unreadNotifications.length;

  // End Header related states and functions

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      //   setNotificationsDropdownOpen(false);
      // }
      // We will remove userDropdownRef if no longer needed in Dashboard
      // if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      //   setUserDropdownOpen(false);
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTaskCreated = () => {
    setOpenForm(false);
    setEditingTask(null); // Clear editing task after creation/update
    queryClient.invalidateQueries(["tasks"]); // Invalidate tasks query to re-fetch list
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpenForm(true);
  };

  const handleMarkAllAsRead = () => {
    // markReadMutation.mutate();
  };

  const mockAvatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/50.jpg",
    "https://randomuser.me/api/portraits/women/60.jpg",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-purple-700 text-white py-12 px-6 flex items-center justify-center">
        <div className="max-w-4xl text-center">
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
            Welcome back,{" "}
            <span style={{ color: "#FFE500" }}>
              {user?.email.split("@")[0]}
            </span>{" "}
            👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 400,
            }}
          >
            Here's what's happening with your tasks today.
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* To-Do Column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-4">
            {/* Header: Filters + Add */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex flex-wrap gap-4 items-center">
                <FormControl
                  variant="outlined"
                  size="medium"
                  sx={{ minWidth: 120 }}
                >
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      color: "#4A0E70",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7E22CE",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5B21B6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5B21B6",
                      },
                      ".MuiSvgIcon-root": { color: "#7E22CE" },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  variant="outlined"
                  size="medium"
                  sx={{ minWidth: 120 }}
                >
                  <InputLabel id="sort-by-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-by-label"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    sx={{
                      color: "#5B0E9D",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7E22CE",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5B21B6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5B21B6",
                      },
                      ".MuiSvgIcon-root": { color: "#7E22CE" },
                    }}
                  >
                    <MenuItem value="createdAt">Newest</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <button
                onClick={() => setOpenForm(!openForm)}
                className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg shadow hover:bg-purple-800 transition"
              >
                <AddIcon fontSize="small" /> Add Task
              </button>
            </div>

            {/* Task Form */}
            {openForm && (
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                }}
              >
                <TaskForm
                  open={openForm}
                  onClose={() => setOpenForm(false)}
                  onTaskCreated={handleTaskCreated}
                  taskToEdit={editingTask}
                  setTaskToEdit={setEditingTask}
                />
              </Box>
            )}

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
              <TaskList
                onEditTask={handleEditTask}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                sortBy={sortBy}
              />
            </div>
          </div>
        </div>

        {/* Completed Column */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <CompletedTasks
            onEditTask={handleEditTask}
            searchQuery={searchQuery}
            priorityFilter={priorityFilter}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
};
