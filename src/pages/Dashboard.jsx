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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CalendarToday as CalendarTodayIcon,
  PersonAdd as PersonAddIcon,
  WatchLater as WatchLaterIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { getNotifications, markAllNotificationsAsRead, getTasks, sendInvitation } from "../services/api";
import CompletedTasks from "../components/CompletedTasks";
import TaskStatusSection from '../components/TaskStatusSection';

export const Dashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const { searchQuery, setSearchQuery, searchCriteria, setSearchCriteria } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const queryClient = useQueryClient();

  // Fetch all tasks to pass to TaskStatusSection
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks({ status: 'all' }), // Fetch all tasks, regardless of status
  });

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
    console.log("Editing task:", task);
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
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Welcome Banner */}
      <div className="bg-white py-8 px-6 border-b border-gray-200 text-center">
        <div className="max-w-7xl mx-auto ">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>
            Welcome back, <span style={{ color: '#000000', fontSize: '1.1em' }}>{user?.email || 'User'}</span> 👋
          </Typography>
          {/* <div className="flex items-center space-x-2">
            {mockAvatars.map((src, index) => (
              <Avatar key={index} src={src} sx={{ width: 32, height: 32, border: '2px solid white' }} />
            ))}
            <button
              onClick={() => setInviteDialogOpen(true)} // Open invite dialog
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-200">
              <PersonAddIcon fontSize="small" sx={{ mr: 1 }} /> Invite
            </button>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: To-Do and Task Form */}
        <div>
          <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
            {/* Header: Filters + Add */}
            <div className="flex items-center gap-2 mb-4">
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                <AssignmentTurnedInIcon sx={{ color: '#90A4AE', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>
                To-Do
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
              </Typography>
              <Typography variant="body2" sx={{ color: '#3B82F6' }}>
                • Today
      </Typography>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex flex-wrap gap-4 items-center ">
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
                      color: '#EF4444',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' },
                      '.MuiSvgIcon-root': { color: '#EF4444' },
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
                      color: '#EF4444',
                      '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' },
                      '.MuiSvgIcon-root': { color: '#EF4444' },
                    }}
                  >
                    <MenuItem value="createdAt">Newest</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="dueDate">Due Date</MenuItem>
                    <MenuItem value="priority">Priority</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* The add task button from the image */}
              <div>
                <button
                  onClick={() => setOpenForm(!openForm)}
                  className="flex items-center text-red-500 font-semibold px-4 py-2 rounded-lg hover:text-white hover:bg-red-500 transition-colors duration-200"
                >
                  <AddIcon fontSize="small" sx={{ mr: 1, color: 'inherit' }} /> Add task
                </button>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              onEditTask={handleEditTask}
              searchQuery={searchQuery}
              searchCriteria={searchCriteria}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              singleColumn={true} // Display as 1 column for To-Do section
            />
          </div>
        </div>

        {/* Right Column: Task Status and Completed Tasks */}
        <div>
          {/* Task Status Section */}
          <div className="bg-white shadow rounded-xl p-4 mb-6 border-2 border-gray-200">
            <TaskStatusSection tasks={tasks} isLoading={isLoading} error={error} />
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white shadow rounded-xl p-4 border border-gray-200 mt-6">
            <CompletedTasks
              onEditTask={handleEditTask}
              searchQuery={searchQuery}
              searchCriteria={searchCriteria}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>

      {/* Task Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? "Edit Task" : "Add New Task"}
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenForm(false);
              setEditingTask(null);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TaskForm
            onClose={() => setOpenForm(false)}
            onTaskCreated={handleTaskCreated}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            open={openForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};