import React, { forwardRef } from 'react';
import './DragImage.scss';

const DragImage = forwardRef(({ task, formatDueTime }, ref) => {
  const dueTime = formatDueTime(task.dueTime);

  return (
    <div className="drag-image" ref={ref}>
      <div className="task-header">
        <h3>{task.title}</h3>
      </div>
      <div className="task-details">
        <p className={dueTime.className}>{dueTime.text}</p>
        <span className='TaskType'>{task.type}</span>
      </div>
    </div>
  );
});

export default DragImage;
