import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskContext } from '../../context/TaskContext';
import './Task.scss';
import userImage from '../../images.jpg';

const Task = ({ task, columnId }) => {
  const { deleteTask } = useTaskContext();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      columnId,
      type: 'task'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDueTime = (dueTime) => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      const yesterday = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      yesterday.setDate(today.getDate() - 1);

      const dueDate = new Date(dueTime);
      if (dueDate.toDateString() === today.toDateString()) {
        return { text: 'Today', className: '' };
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        return { text: 'Tomorrow', className: 'tomorrow' };
      } else if (dueDate.toDateString() === yesterday.toDateString()) {
        return { text: 'Yesterday', className: 'yesterday' };
      } else {
        return { text: dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), className: '' };
      }
    } catch (error) {
      console.error('Error formatting due time:', error);
      return { text: 'Invalid date', className: 'error' };
    }
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dueTime = formatDueTime(task.dueTime);

  return (
    <div
      className={`task ${isDragging ? 'dragging' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {isDragging ? (
        <div className="task-placeholder" />
      ) : (
        <>
          <div className="task-header">
            <h3>{task.title}</h3>
            {columnId > 2 && (
              <div className="task-options" ref={optionsRef}>
                <span className="material-symbols-outlined" onClick={() => deleteTask(columnId, task.id)}>
                  more_horiz
                </span>
                {showOptions && (
                  <div className="task-options-menu">
                    <button className="kanban-button" onClick={() => deleteTask(columnId, task.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="task-details">
            <img src={userImage} alt="User" className="user-image" />
            <p className={dueTime.className}>{dueTime.text}</p>
            <span className='TaskType'>{task.type}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
