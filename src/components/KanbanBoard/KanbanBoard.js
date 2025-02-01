import React, { useState } from 'react';
import Column from '../Column/Column';
import './KanbanBoard.scss';

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
  ]);

  const addColumn = () => {
    const newColumn = { id: Date.now(), title: 'Review', tasks: [] };
    setColumns([...columns, newColumn]);
  };

  const addTask = (columnId, task) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: [...column.tasks, task] } : column
    ));
  };

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    const sourceColumn = columns.find(column => column.id === sourceColumnId);
    const targetColumn = columns.find(column => column.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const task = sourceColumn.tasks.find(task => task.id === taskId);

    setColumns(columns.map(column => {
      if (column.id === sourceColumnId) {
        return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
      }
      if (column.id === targetColumnId) {
        return { ...column, tasks: [...column.tasks, task] };
      }
      return column;
    }));
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) } : column
    ));
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <Column
          key={column.id}
          column={column}
          addTask={addTask}
          moveTask={moveTask}
          deleteTask={deleteTask}
          deleteColumn={deleteColumn}
        />
      ))}
      <button className="kanban-button" onClick={addColumn}>+ Add Section</button>
    </div>
  );
};

export default KanbanBoard;