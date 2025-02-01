import React, { useState, useEffect, useRef } from 'react';
import './Task.scss';
import DragImage from '../DragImage/DragImage';
import userImage from '../../images.jpg';

const Task = ({ task, columnId, deleteTask }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const dragImageRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('sourceColumnId', columnId);
    e.target.classList.add('dragging');
    
    const dragImage = e.target.cloneNode(true);
    dragImage.style.display = 'none';
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    setTimeout(() => {
      if (e.target) {
        e.target.style.visibility = 'hidden';
      }
    }, 0);
  };

  const handleDrag = (e) => {
    console.log('Drag');
    const dragImage = document.querySelector('.drag-image');
    if (dragImage) {
      dragImage.style.top = `${e.clientY}px`;
      dragImage.style.left = `${e.clientX}px`;
    }
  };

  const handleDragEnd = (e) => {
    console.log('Drag end');
    if (e.target) {
      e.target.classList.remove('dragging');
      e.target.style.visibility = 'visible';
      e.target.style.display = 'block';
    }
    const dragImages = document.querySelectorAll('.drag-image');
    dragImages.forEach(dragImage => {
      if (dragImage && dragImage.parentNode) {
        dragImage.parentNode.removeChild(dragImage);
      }
    });
  };

  const formatDueTime = (dueTime) => {
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
    <>
      <div className="task" draggable onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={handleDragEnd}>
        <div className="task-header">
          <h3>{task.title}</h3>
          {columnId > 2 && (
            <div className="task-options" ref={optionsRef}>
              <span className="material-symbols-outlined" onClick={() => setShowOptions(!showOptions)}>
                more_horiz
              </span>
              {showOptions && (
                <div className="task-options-menu">
                  <button className="kanban-button" onClick={() => deleteTask(task.id)}>Delete</button>
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
      </div>
      <DragImage ref={dragImageRef} task={task} formatDueTime={formatDueTime} />
    </>
  );
};

export default Task;
