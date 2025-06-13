import React, { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { updateTask, deleteTask } from '../../services/api';
import { toast } from 'react-toastify';

const priorityColors = {
  high: {
    bg: '#FEE2E2', // Light red
    border: '#FEE2E2', // Same as background for filled look
    text: '#EF4444' // Red
  },
  medium: {
    bg: '#FFFBEB', // Light yellow
    border: '#FFFBEB', // Same as background
    text: '#F59E0B' // Yellow
  },
  low: {
    bg: '#ECFDF5', // Light green
    border: '#ECFDF5', // Same as background
    text: '#10B981' // Green
  }
};

const statusColors = {
  "pending": { text: '#EF4444' }, // Red
  "in-progress": { text: '#3B82F6' }, // Blue
  "completed": { text: '#22C55E' }, // Green
};

const TaskItem = ({ task, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (updatedData) => updateTask(task._id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully");
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateTaskMutation.mutate({ status: newStatus });
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteTaskMutation.mutate();
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '120px', // Adjusted height to be more compact
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          },
          p: 2, // Padding for the card content
          border: '1px solid #E5E7EB',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          {/* Left part: Checkbox, Title, Description, and Tags */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, pr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Checkbox
                checked={task.status === "completed"}
                onChange={handleStatusToggle}
                icon={<RadioButtonUncheckedIcon sx={{ color: '#3B82F6' }} />}
                checkedIcon={<CheckCircleIcon sx={{ color: '#22C55E' }} />}
                sx={{
                  p: 0,
                  mr: 1,
                }}
              />
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  fontWeight: "600",
                  color: '#000000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.title}
              </Typography>
            </Box>
            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#4B5563',
                  lineHeight: "1.4",
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  mb: 1,
                }}
              >
                {task.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 'auto', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500, mr: 0.5 }}>
                  Priority:
                </Typography>
                <Typography variant="body2" sx={{ color: priorityColors[task.priority].text, fontWeight: 500, mr: 2 }}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500, mr: 0.5 }}>
                  Status:
                </Typography>
                <Typography variant="body2" sx={{ color: statusColors[task.status].text, fontWeight: 500 }}>
                  {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.replace('-', ' ').slice(1)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', color: '#6B7280', fontWeight: 'bold' }}>
                Created on: {format(new Date(task.createdAt), 'dd/MM/yyyy')}
              </Typography>
            </Box>
          </Box>

          {/* Right part: More Icon (No Image) */}
          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ color: '#6B7280' }}
            >
              <MoreIcon />
          </IconButton>
          </Box>
        </Box>
      </Card>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onEdit(task); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;