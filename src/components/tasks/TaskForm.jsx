import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import { createTask, updateTask } from '../../services/api';
import { toast } from 'react-toastify';

const TaskForm = ({ open, onClose, onTaskCreated, taskToEdit, setTaskToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        priority: taskToEdit.priority || 'medium',
        status: taskToEdit.status || 'pending',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });
    }
  }, [taskToEdit, open]); // Include open as a dependency to reset form when it opens for a new task

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.dueDate) throw new Error('Due date is required');

      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      let resultTask;
      if (taskToEdit) {
        resultTask = await updateTask(taskToEdit._id, taskData);
        toast.success('Task updated successfully');
      } else {
        resultTask = await createTask(taskData);
        toast.success('Task created successfully');
      }

      onTaskCreated(resultTask);
      onClose();
      setTaskToEdit(null); // Clear editing task after creation/update

    } catch (err) {
      console.error(taskToEdit ? 'Error updating task:' : 'Error creating task:', err);
      setError(err.message || (taskToEdit ? 'Failed to update task' : 'Failed to create task'));
      toast.error(err.message || (taskToEdit ? 'Failed to update task' : 'Failed to create task'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: ''
      });
      setError(null);
      setTaskToEdit(null); // Clear editing task on close
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disablePortal={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'white', // White background
          color: '#333', // Darker text color
          border: '1px solid #e0e0e0', // Light grey border
          zIndex: 1301,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)' // Subtle shadow
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      {error && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: '#ffeded', color: '#d32f2f', border: '1px solid #d32f2f' }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
        required
              fullWidth
        disabled={loading}
              error={error && !formData.title.trim()}
              helperText={error && !formData.title.trim() ? 'Title is required' : ''}
              InputLabelProps={{ sx: { color: '#555' } }}
              InputProps={{
                sx: {
                  color: '#333',
                  '& fieldset': { borderColor: '#bbb' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' }, // Purple focus
                }
              }}
      />

      <TextField
        label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
        multiline
        rows={3}
              fullWidth
              disabled={loading}
              InputLabelProps={{ sx: { color: '#555' } }}
              InputProps={{
                sx: {
                  color: '#333',
                  '& fieldset': { borderColor: '#bbb' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                }
              }}
            />

            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              fullWidth
        disabled={loading}
              error={error && !formData.dueDate}
              helperText={error && !formData.dueDate ? 'Due date is required' : ''}
              InputLabelProps={{ 
                shrink: true, 
                sx: { color: '#555' } 
              }}
              InputProps={{
                sx: {
                  color: '#333',
                  '& fieldset': { borderColor: '#bbb' },
                  '&:hover fieldset': { borderColor: '#999' },
                  '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                }
              }}
      />

            <FormControl fullWidth disabled={loading}>
              <InputLabel sx={{ color: '#555' }}>Priority</InputLabel>
        <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
          label="Priority"
                sx={{
                  color: '#333',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bbb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#673ab7',
                  },
                }}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
      </FormControl>

            <FormControl fullWidth disabled={loading}>
              <InputLabel sx={{ color: '#555' }}>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                sx={{
                  color: '#333',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bbb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#999',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#673ab7',
                  },
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleClose} 
        disabled={loading}
            sx={{ color: '#555', '&:hover': { backgroundColor: '#e0e0e0' } }}
          >
            Cancel
          </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
            sx={{ 
              bgcolor: '#673ab7', // Purple background for Create Task button
              color: 'white',
              '&:hover': {
                bgcolor: '#5e35b1', // Darker purple on hover
              }
            }}
      >
            {loading ? 'Creating...' : 'Create Task'}
      </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
