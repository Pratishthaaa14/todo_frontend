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
} from '@mui/icons-material';
import { format } from 'date-fns';
import { updateTask, deleteTask } from '../../services/api';
import { toast } from 'react-toastify';

const priorityColors = {
  high: {
    bg: '#FEE2E2', // Light red
    border: '#FCA5A5', // Medium red
    text: '#991B1B' // Dark red
  },
  medium: {
    bg: '#FEF3C7', // Light yellow
    border: '#FCD34D', // Medium yellow
    text: '#92400E' // Dark yellow
  },
  low: {
    bg: '#DCFCE7', // Light green
    border: '#86EFAC', // Medium green
    text: '#166534' // Dark green
  }
};

const statusColors = {
  "pending": "default",
  "in-progress": "info",
  "completed": "success",
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
          backgroundColor: priorityColors[task.priority].bg,
          border: `1px solid ${priorityColors[task.priority].border}`,
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '150px',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
            <Checkbox
              checked={task.status === "completed"}
              onChange={handleStatusToggle}
              color="primary"
              sx={{
                p: 0, 
                mr: 1,
                color: priorityColors[task.priority].text,
                '&.Mui-checked': {
                  color: priorityColors[task.priority].text,
                }
              }}
            />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: "600",
                    color: priorityColors[task.priority].text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                    pr: 1,
                  }}
                >
              {task.title}
            </Typography>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ color: priorityColors[task.priority].text, flexShrink: 0 }}
                >
                  <MoreIcon />
                </IconButton>
              </Box>
              {task.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: priorityColors[task.priority].text,
                    opacity: 0.8,
                    lineHeight: "1.4",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '1',
                    WebkitBoxOrient: 'vertical',
                    mt: 0.2,
                  }}
                >
              {task.description}
            </Typography>
              )}
            </Box>
          </Box>

          <Box className="flex flex-wrap gap-1 mt-auto">
            <Chip
              size="small"
              icon={<FlagIcon fontSize="small" />}
              label={task.priority.toUpperCase()}
              sx={{ 
                borderRadius: '8px',
                backgroundColor: priorityColors[task.priority].border,
                color: priorityColors[task.priority].text,
                '& .MuiChip-icon': {
                  color: priorityColors[task.priority].text,
                }
              }}
            />
              <Chip
                size="small"
              label={task.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              color={statusColors[task.status]}
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                borderColor: priorityColors[task.priority].border,
                color: priorityColors[task.priority].text,
              }}
              />
            {task.dueDate && (
              <Chip
                size="small"
                icon={<ScheduleIcon fontSize="small" />}
                label={format(new Date(task.dueDate), "MMM d, yyyy")}
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: priorityColors[task.priority].border,
                  color: priorityColors[task.priority].text,
                  '& .MuiChip-icon': {
                    color: priorityColors[task.priority].text,
                  }
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Task Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        PaperProps={{
          elevation: 2,
          className: "mt-1",
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit(task);
          }}
        >
          <EditIcon fontSize="small" className="mr-2" />
            Edit
          </MenuItem>
        <MenuItem onClick={handleDelete} className="text-red-600">
          <DeleteIcon fontSize="small" className="mr-2" />
            Delete
          </MenuItem>
        </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
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