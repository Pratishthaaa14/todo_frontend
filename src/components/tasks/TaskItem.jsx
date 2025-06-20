import React, { useState } from 'react';
import {
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircle as CheckCircleIcon,
  SignalCellularAlt as PriorityIcon,
  FiberManualRecord as StatusIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const priorityConfig = {
  high: { label: 'High', color: '#ef4444', iconColor: '#f87171' },
  medium: { label: 'Medium', color: '#f97316', iconColor: '#fb923c' },
  low: { label: 'Low', color: '#22c55e', iconColor: '#4ade80' },
};

const statusConfig = {
  pending: { label: 'Pending', color: '#64748b' },
  'in-progress': { label: 'In Progress', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#16a34a' },
};

const TaskItem = ({ task, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (updatedData) => updateTask(task._id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not update the task.');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task has been deleted.');
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete the task.');
    },
  });

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTaskMutation.mutate({ status: newStatus });
  };
  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };
  const confirmDelete = () => deleteTaskMutation.mutate();

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <>
      <Card
        sx={{
          p: 2.5,
          borderRadius: 0,
          boxShadow: 'none',
          border: '2px solid black',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          backgroundColor: '#fafafa',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Checkbox
              checked={task.status === 'completed'}
              onChange={handleStatusToggle}
              icon={<RadioButtonUncheckedIcon sx={{ color: '#94a3b8' }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: '#16a34a' }} />}
              sx={{ p: 0 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1f2937',
                fontSize: '1.1rem',
              }}
            >
              {task.title}
            </Typography>
          </Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreIcon sx={{ color: '#6b7280' }} />
          </IconButton>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#4b5563',
              fontSize: '0.95rem',
              pl: '42px', 
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            pt: 1.5,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<PriorityIcon />}
              label={priority.label}
              size="small"
              sx={{
                bgcolor: priority.color,
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: priority.iconColor,
                }
              }}
            />
            <Chip
              icon={<StatusIcon />}
              label={status.label}
              size="small"
              sx={{
                bgcolor: status.color,
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  fontSize: '1rem',
                  color: 'white'
                }
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ color: '#6b7280', fontWeight: 'medium' }}
          >
            {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </Typography>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onEdit(task);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: '1.25rem' }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: '1.25rem' }} /> Delete
          </MenuItem>
        </Menu>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to permanently delete this task?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete Task
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};

export default TaskItem;
