import { useState, useEffect } from 'react';
import {
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
  }, [editingTask]);

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
      if (editingTask) {
        resultTask = await updateTask(editingTask._id, taskData);
        toast.success('Task updated successfully');
      } else {
        resultTask = await createTask(taskData);
        toast.success('Task created successfully');
      }

      onTaskCreated(resultTask);
      onClose();
      setEditingTask(null);

    } catch (err) {
      console.error(editingTask ? 'Error updating task:' : 'Error creating task:', err);
      setError(err.message || (editingTask ? 'Failed to update task' : 'Failed to create task'));
      toast.error(err.message || (editingTask ? 'Failed to update task' : 'Failed to create task'));
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
      setEditingTask(null);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
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
                '&.Mui-focused fieldset': { borderColor: '#673ab7' },
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

          <FormControl fullWidth disabled={loading} sx={{ '& .MuiInputLabel-root': { color: '#555' } }}>
        <InputLabel>Priority</InputLabel>
        <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
          label="Priority"
              sx={{
                color: '#333',
                '& fieldset': { borderColor: '#bbb' },
                '&:hover fieldset': { borderColor: '#999' },
                '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                '& .MuiSvgIcon-root': { color: '#555' }
              }}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

          <FormControl fullWidth disabled={loading} sx={{ '& .MuiInputLabel-root': { color: '#555' } }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
              sx={{
                color: '#333',
                '& fieldset': { borderColor: '#bbb' },
                '&:hover fieldset': { borderColor: '#999' },
                '&.Mui-focused fieldset': { borderColor: '#673ab7' },
                '& .MuiSvgIcon-root': { color: '#555' }
              }}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={handleClose}
        disabled={loading}
          sx={{
            color: '#673ab7',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#f5f5f5',
            }
          }}
        >
          Cancel
        </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
          sx={{
            bgcolor: '#673ab7',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#5e35b1',
            }
          }}
        >
          {editingTask ? 'Save Changes' : 'Create Task'}
      </Button>
      </DialogActions>
    </form>
  );
};

export default TaskForm;
