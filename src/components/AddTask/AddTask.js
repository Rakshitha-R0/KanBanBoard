import React, { useState, useEffect } from 'react';
import './AddTask.scss';

const AddTask = ({ columnId, addTask, modifyTask, closePopup, taskToModify }) => {
  const [taskDetails, setTaskDetails] = useState({ title: '', dueTime: '', type: '' });

  useEffect(() => {
    if (taskToModify) {
      setTaskDetails(taskToModify);
    }
  }, [taskToModify]);

  const handleSaveTask = () => {
    if (taskDetails.title.trim() === '' || taskDetails.type === '') return;
    if (taskToModify) {
      modifyTask(columnId, taskDetails);
    } else {
      const newTask = { id: Date.now(), ...taskDetails };
      addTask(columnId, newTask);
    }
    closePopup();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="add-task-popup">
      <div className="add-task-content">
        <h3>{taskToModify ? 'Modify Task' : 'Add Task'}</h3>
        <input
          type="text"
          placeholder="Task title"
          value={taskDetails.title}
          onChange={(e) => setTaskDetails({ ...taskDetails, title: e.target.value })}
        />
        <input
          type="date"
          placeholder="Due date"
          value={taskDetails.dueTime}
          min={getMinDate()}
          onChange={(e) => setTaskDetails({ ...taskDetails, dueTime: e.target.value })}
        />
        <select value={taskDetails.type} onChange={(e) => setTaskDetails({ ...taskDetails, type: e.target.value })}>
          <option value="" disabled>Type</option>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
        </select>
        <div className="add-task-buttons">
          <button className="kanban-button" onClick={handleSaveTask}>{taskToModify ? 'Save' : 'Add'}</button>
          <button className="kanban-button" onClick={closePopup}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
