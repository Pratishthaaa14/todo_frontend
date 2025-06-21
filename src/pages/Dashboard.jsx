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
  ToggleButton,
  ToggleButtonGroup,
  Grid,
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
  FilterList as FilterListIcon,
  LowPriority as LowPriorityIcon,
  Sort as SortIcon,
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

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
    }
  };
  
  const handlePriorityFilterChange = (event, newPriority) => {
    if (newPriority !== null) {
      setPriorityFilter(newPriority);
    }
  };

  const handleSortByChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  const handleSortDirectionChange = (event, newSortDirection) => {
    if (newSortDirection !== null) {
      setSortDirection(newSortDirection);
    }
  };

  const handleMarkAllAsRead = () => {
    // markReadMutation.mutate();
  };

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
                        Tasks
              </Typography>
            </div>
                <Button
                    variant="contained"
                    onClick={() => setOpenForm(true)}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderRadius: '9999px',
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                        '&:hover': {
                            backgroundColor: '#6d28d9',
                    },
                  }}
                >
                    Add Task
                </Button>
            </div>

            <Box sx={{ p: 2, bgcolor: '#f3e8ff', borderRadius: 2, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Status Filter */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <FilterListIcon sx={{ color: '#5b21b6' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5b21b6' }}>
                                Status
                            </Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={statusFilter}
                            exclusive
                            onChange={handleStatusFilterChange}
                            aria-label="status filter"
                            fullWidth
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="pending">Pending</ToggleButton>
                            <ToggleButton value="in-progress">In Progress</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    {/* Priority Filter */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LowPriorityIcon sx={{ color: '#5b21b6' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5b21b6' }}>
                                Priority
                            </Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={priorityFilter}
                            exclusive
                            onChange={handlePriorityFilterChange}
                            aria-label="priority filter"
                            fullWidth
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="low">Low</ToggleButton>
                            <ToggleButton value="medium">Medium</ToggleButton>
                            <ToggleButton value="high">High</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    {/* Sort By Filter */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SortIcon sx={{ color: '#5b21b6' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5b21b6' }}>
                                Sort By
                            </Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={sortBy}
                            exclusive
                            onChange={handleSortByChange}
                            aria-label="sort by filter"
                            fullWidth
                        >
                            <ToggleButton value="createdAt">Date</ToggleButton>
                            <ToggleButton value="priority">Priority</ToggleButton>
                            <ToggleButton value="title">Title</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    {/* Sort Direction Filter */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SortIcon sx={{ color: '#5b21b6', transform: 'scaleY(-1)' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#5b21b6' }}>
                                Order
                            </Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={sortDirection}
                            exclusive
                            onChange={handleSortDirectionChange}
                            aria-label="sort direction filter"
                            fullWidth
                        >
                            <ToggleButton value="asc">Ascending</ToggleButton>
                            <ToggleButton value="desc">Descending</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Box>

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
