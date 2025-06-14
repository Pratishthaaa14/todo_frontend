import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, searchTasks, getTasksByStatus } from '../../services/api';
import TaskItem from './TaskItem';
import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from "@tanstack/react-query";
import {
  CircularProgress,
  Typography,
} from "@mui/material";

const TaskList = ({ onEditTask, searchQuery, searchCriteria, statusFilter, priorityFilter, sortBy, singleColumn }) => {
  const { user } = useAuth();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const filteredTasks = tasks?.filter((task) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    let matchesSearch = false;

    if (searchCriteria === "title") {
      matchesSearch = task.title.toLowerCase().includes(lowerCaseSearchQuery);
    } else if (searchCriteria === "description") {
      matchesSearch = (task.description || '').toLowerCase().includes(lowerCaseSearchQuery);
    } else {
      // Default to searching in both title and description if criteria is 'all' or undefined
      matchesSearch = 
        task.title.toLowerCase().includes(lowerCaseSearchQuery) ||
        (task.description || '').toLowerCase().includes(lowerCaseSearchQuery);
    }

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = [...(filteredTasks || [])].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "priority":
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading tasks: {error.message}
      </div>
    );
  }

  return (
    <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'} gap-4`}>
      {sortedTasks?.length === 0 ? (
        <div className="p-8 text-center text-gray-500 col-span-full">
          <Typography variant="h6" color="textSecondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters"
              : "Create a new task to get started"}
      </Typography>
        </div>
            ) : (
        sortedTasks?.map((task) => (
          <TaskItem key={task._id} task={task} onEdit={onEditTask} />
        ))
            )}
    </div>
  );
};

export default TaskList;