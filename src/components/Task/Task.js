import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskContext } from '../../context/Context';
import './Task.scss';
import userImage from '../../images.jpg';
import AddTask from '../AddTask/AddTask';

const Task = ({ task, columnId }) => {
  const { deleteTask, modifyTask } = useTaskContext();
  const [showOptions, setShowOptions] = useState(false);
  const [showModifyTaskPopup, setShowModifyTaskPopup] = useState(false);
  const optionsRef = useRef(null);

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id: task.id,
    data: { columnId, type: 'task' }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
    backgroundColor: isDragging ? '#d3d3d3' : 'white', 
    width: '90%',
    height: 'auto'
  };

  const formatDueTime = (dueTime) => {
    const today = new Date();
    const dueDate = new Date(dueTime);
    const timeDiff = dueDate - today;
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Today' };
    if (diffDays === 1) return { text: 'Tomorrow', className: 'tomorrow' };
    if (diffDays === -1) return { text: 'Yesterday', className: 'yesterday' };
    
    return {
      text: dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      className: ''
    };
  };

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dueTime = formatDueTime(task.dueTime);

  return (
    <div
      className={`task ${isDragging ? 'dragging' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="task-content">
        <div className="task-header">
          <h3>{task.title}</h3>
          {columnId > 2 && (
            <div className="task-options" ref={optionsRef}>
                <span className="material-symbols-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}>more_horiz</span>
              {showOptions && (
                <div className="options-menu">
                  <button className='kanban-button' onClick={() => setShowModifyTaskPopup(true)}>
                    Modify Task
                  </button>
                  <button className='kanban-button' onClick={() => deleteTask(columnId, task.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="task-details"  {...listeners}>
          <img src={userImage} alt="User" className="user-image" />
          <p className={dueTime.className}>{dueTime.text}</p>
          <span className={`TaskType ${task.type.toLowerCase()}`}>
            {task.type}
          </span>
        </div>
      </div>
      {showModifyTaskPopup && (
        <AddTask 
          columnId={columnId} 
          addTask={null} 
          modifyTask={modifyTask} 
          closePopup={() => setShowModifyTaskPopup(false)} 
          taskToModify={task}
        />
      )}
    </div>
  );
};

export default Task;
