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
  Menu,
  Grow,
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
  ListAlt as ListAltIcon,
  DonutLarge as DonutLargeIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getNotifications,
  markAllNotificationsAsRead,
  getTasks,
  sendInvitation,
} from "../services/api";
import CompletedTasks from "../components/CompletedTasks";
import TaskStatusSection from "../components/tasks/TaskStatusSection";

// Custom hook for dropdown logic
const useDropdown = (initialState) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return { open, anchorEl, handleClick, handleClose };
};

export const Dashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const { searchQuery, setSearchQuery, searchCriteria, setSearchCriteria } =
    useOutletContext();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const queryClient = useQueryClient();

  // Dropdown hooks
  const statusDropdown = useDropdown();
  const sortDropdown = useDropdown();
  const orderDropdown = useDropdown();
  
  // Fetch all tasks to pass to TaskStatusSection
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks({ status: "all" }), // Fetch all tasks, regardless of status
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
    const handleClickOutside = (event) => {};

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

  const renderFilterButton = (label, dropdown) => (
      <Button
          variant="contained"
          onClick={dropdown.handleClick}
          sx={{
              bgcolor: 'white',
              color: '#5b21b6',
              border: '1px solid #ddd6fe',
              boxShadow: 'none',
              '&:hover': {
                  bgcolor: '#f5f3ff',
                  boxShadow: 'none',
              },
          }}
      >
          {label}
      </Button>
  );

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      {/* Welcome Banner */}
      <div className="bg-white py-8 sm:py-12 px-6 border-b border-gray-200 text-center rounded-none shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <Typography
            variant="h4"
            sx={{
                fontWeight: 700,
                color: '#374151',
                fontFamily: 'Roboto, sans-serif',
            }}
          >
            Let's make today productive,
            <span
                style={{
                    fontWeight: 700,
                    fontSize: '1.1em',
                    marginLeft: '8px',
                    background: 'linear-gradient(45deg, #7c3aed, #5b21b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {user?.name || user?.email || "User"}!
            </span>
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: To-Do and Task Form */}
        <div>
          <div className="bg-white shadow-lg rounded-none p-6 border border-gray-200">
            {/* Header: Filters + Add */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Box sx={{ position: "relative", display: "inline-flex", mr: 1 }}>
                        <ListAltIcon sx={{ color: "#a78bfa", fontSize: 28 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#5b21b6' }}>
                        To-Do
                    </Typography>
                </div>
                <button
                    onClick={() => setOpenForm(!openForm)}
                    className="flex items-center text-white font-semibold px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-200 shadow-md"
                >
                    <AddIcon fontSize="small" sx={{ mr: 1 }} /> Add Task
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-4 p-4 bg-gray-50 rounded-xl">
                {renderFilterButton(`Status: ${statusFilter}`, statusDropdown)}
                <Menu anchorEl={statusDropdown.anchorEl} open={statusDropdown.open} onClose={statusDropdown.handleClose}>
                    <MenuItem onClick={() => { setStatusFilter('all'); statusDropdown.handleClose(); }}>All</MenuItem>
                    <MenuItem onClick={() => { setStatusFilter('pending'); statusDropdown.handleClose(); }}>Pending</MenuItem>
                    <MenuItem onClick={() => { setStatusFilter('in-progress'); statusDropdown.handleClose(); }}>In Progress</MenuItem>
                    <MenuItem onClick={() => { setStatusFilter('completed'); statusDropdown.handleClose(); }}>Completed</MenuItem>
                </Menu>

                {renderFilterButton(`Sort: ${sortBy}`, sortDropdown)}
                <Menu anchorEl={sortDropdown.anchorEl} open={sortDropdown.open} onClose={sortDropdown.handleClose}>
                    <MenuItem onClick={() => { setSortBy('createdAt'); sortDropdown.handleClose(); }}>Creation Date</MenuItem>
                    <MenuItem onClick={() => { setSortBy('dueDate'); sortDropdown.handleClose(); }}>Due Date</MenuItem>
                    <MenuItem onClick={() => { setSortBy('priority'); sortDropdown.handleClose(); }}>Priority</MenuItem>
                    <MenuItem onClick={() => { setSortBy('title'); sortDropdown.handleClose(); }}>Title</MenuItem>
                </Menu>

                {renderFilterButton(`Order: ${sortDirection}`, orderDropdown)}
                <Menu anchorEl={orderDropdown.anchorEl} open={orderDropdown.open} onClose={orderDropdown.handleClose}>
                    <MenuItem onClick={() => { setSortDirection('asc'); orderDropdown.handleClose(); }}>Ascending</MenuItem>
                    <MenuItem onClick={() => { setSortDirection('desc'); orderDropdown.handleClose(); }}>Descending</MenuItem>
                </Menu>
            </div>
            
            {/* Task List */}
            <TaskList
              onEditTask={handleEditTask}
              searchQuery={searchQuery}
              searchCriteria={searchCriteria}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              sortDirection={sortDirection}
              singleColumn={true} // Display as 1 column for To-Do section
            />
          </div>
        </div>

        {/* Right Column: Task Status and Completed Tasks */}
        <div>
          {/* Task Status Section */}
          <div className="bg-white shadow-lg rounded-none p-6 border-2 border-gray-200">
            <TaskStatusSection
              tasks={tasks}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white shadow-lg rounded-none p-6 border border-gray-200">
            <CompletedTasks
              onEditTask={handleEditTask}
              searchQuery={searchQuery}
              searchCriteria={searchCriteria}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
          </div>
        </div>
      </div>

      {/* Task Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Grow}
        transitionDuration={500}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{fontWeight: 700, color: '#5b21b6'}}>
            {editingTask ? "Edit Task" : "Add New Task"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenForm(false);
              setEditingTask(null);
            }}
            sx={{
              position: "absolute",
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
