import React, { createContext, useState, useContext } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [columns, setColumns] = useState([
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
  ]);

  const addColumn = (title) => {
    const newColumn = { id: Date.now(), title, tasks: [] };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  const addTask = (columnId, task) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: [...column.tasks, task] } : column
    ));
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) } : column
    ));
  };

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    setColumns(prevColumns => {
      const sourceColumn = prevColumns.find(col => col.id === sourceColumnId);
      const targetColumn = prevColumns.find(col => col.id === targetColumnId);
      
      if (!sourceColumn || !targetColumn) return prevColumns;

      const task = sourceColumn.tasks.find(t => t.id === taskId);
      if (!task) return prevColumns;

      return prevColumns.map(column => {
        if (column.id === sourceColumnId) {
          return { ...column, tasks: column.tasks.filter(t => t.id !== taskId) };
        }
        if (column.id === targetColumnId) {
          return { ...column, tasks: [...column.tasks, task] };
        }
        return column;
      });
    });
  };

  return (
    <TaskContext.Provider value={{ columns, addColumn, deleteColumn, addTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
