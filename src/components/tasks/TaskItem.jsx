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
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const priorityColors = {
  high: { text: '#EF4444' },
  medium: { text: '#F59E0B' },
  low: { text: '#10B981' },
};

const statusColors = {
  pending: { text: '#EF4444' },
  'in-progress': { text: '#3B82F6' },
  completed: { text: '#22C55E' },
};

const TaskItem = ({ task, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: (updatedData) => updateTask(task._id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully');
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
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

  return (
    <>
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Checkbox
              checked={task.status === 'completed'}
              onChange={handleStatusToggle}
              icon={<RadioButtonUncheckedIcon sx={{ color: '#3B82F6' }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: '#22C55E' }} />}
              sx={{ p: 0 }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#000',
                fontSize: { xs: '1rem', sm: '1.05rem' },
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>
          </Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreIcon sx={{ color: '#9CA3AF' }} />
          </IconButton>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#4B5563',
              fontSize: { xs: '0.88rem', sm: '0.95rem' },
              whiteSpace: 'pre-wrap',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            mt: 1,
            gap: { xs: 0.5, sm: 1.5 },
            borderTop: { xs: '1px solid #E5E7EB', sm: 'none' },
            pt: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              color: '#000',
              fontWeight: 500,
            }}
          >
            Priority:{' '}
            <span style={{ color: priorityColors[task.priority]?.text }}>
              {task.priority}
            </span>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              color: '#000',
              fontWeight: 500,
            }}
          >
            Status:{' '}
            <span style={{ color: statusColors[task.status]?.text }}>
              {task.status}
            </span>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#6B7280', fontSize: { xs: '0.68rem', sm: '0.75rem' },fontWeight: 'bold' }}
          >
            Created: {format(new Date(task.createdAt), 'dd/MM/yyyy')}
            {task.dueDate && (
              <>
                <br />
                Due: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
              </>
            )}
          </Typography>
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onEdit(task);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this task?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};

export default TaskItem;
