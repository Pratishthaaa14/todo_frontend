import { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Box,
  Alert,
  Typography,
  Grid,
} from '@mui/material';
import { createTask, updateTask } from '../../services/api';
import { toast } from 'react-toastify';

const TaskForm = ({ open, onClose, onTaskCreated, editingTask, setEditingTask }) => {
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
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        status: editingTask.status || 'pending',
        dueDate: editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ''
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
  }, [editingTask, open]);

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

      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        toast.success('Task saved!');
      } else {
        await createTask(taskData);
        toast.success('A new task has been created!');
      }

      onTaskCreated();
      handleClose();

    } catch (err) {
      const errorMessage = err.message || (editingTask ? 'Could not save your changes.' : 'Failed to create the task.');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
      setError(null);
      setEditingTask(null);
      onClose();
    }
  };

  const commonInputStyles = {
      bgcolor: '#f3e8ff',
      border: '1px solid #ddd6fe',
      borderRadius: '8px',
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '& .MuiInputBase-input': {
          color: '#5b21b6',
          fontWeight: 500
      },
      '& .MuiInputLabel-root': {
          color: '#7c3aed',
      },
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent sx={{ bgcolor: '#fafafa', p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && (
            <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
        required
            fullWidth
        disabled={loading}
            variant="outlined"
            sx={commonInputStyles}
      />

      <TextField
        label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
        multiline
            rows={4}
            fullWidth
            disabled={loading}
            variant="outlined"
            sx={commonInputStyles}
          />
          
          <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            fullWidth
        disabled={loading}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={commonInputStyles}
                  />
              </Grid>
              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={loading} variant="outlined" sx={commonInputStyles}>
                    <Select name="priority" value={formData.priority} onChange={handleChange} displayEmpty>
                      <MenuItem value="" disabled>Priority</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
              </Grid>
          </Grid>

          <FormControl fullWidth disabled={loading} variant="outlined" sx={commonInputStyles}>
            <Select name="status" value={formData.status} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
        <Button onClick={handleClose} disabled={loading} sx={{ color: '#7c3aed', fontWeight: 600 }}>
          Cancel
        </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
          sx={{
              bgcolor: '#5b21b6',
              '&:hover': { bgcolor: '#4c1d95' },
              borderRadius: '8px',
              px: 4,
              py: 1,
              fontWeight: 600
          }}
        >
          {editingTask ? 'Save Changes' : 'Create Task'}
      </Button>
      </DialogActions>
    </form>
  );
};

export default TaskForm;
