import React from 'react';
import './DragImage.scss';
import userImage from '../../images.jpg';

const DragImage = React.forwardRef(({ task, formatDueTime }, ref) => {
  console.log(task);

  const dueTime = formatDueTime(task.dueTime);

  return (
    <div className="drag-image" ref={ref}>
      <div className="drag-image-header">
        <h3>{task.title}</h3>
      </div>
      <div className="drag-image-details">
        <img src={userImage} alt="User" className="user-image" />
        <p className={dueTime.className}>{dueTime.text}</p>
        <span >{task.type}</span>
      </div>
    </div>
  );
});

export default DragImage;
