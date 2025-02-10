import React, { useEffect, useState } from 'react';
import './AddColumn.scss';

const AddColumn = ({ closePopup, handleAddColumn, referenceColumnId, setFromWhichColumn }) => {
  const [customColumnTitle, setCustomColumnTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleCustomColumnSubmit = () => {
    if (customColumnTitle.trim() !== '') {
      if(referenceColumnId){
          handleAddColumn(customColumnTitle, 'next', referenceColumnId);
        } else {
          console.log("RL's :", referenceColumnId)
        handleAddColumn(customColumnTitle, 'end');
      }
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value !== 'Custom') {
        if(referenceColumnId){
        handleAddColumn(value, 'next', referenceColumnId);
        } else {
        console.log("RL's :", referenceColumnId)
        handleAddColumn(value, 'end');
        }
    }
  };

  const handleBack = () => {
    setSelectedOption('');
    setCustomColumnTitle('');
  };

  return (
    <div className="add-column-popup">
      <div className="popup-header">
        <h3>Add Column</h3>
        <button className="close-button" onClick={closePopup}>×</button>
      </div>
      <div className="popup-content">
        {selectedOption !== 'Custom' ? (
          <>
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className="kanban-input"
            >
              <option value="" disabled>
                Select Column
              </option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Custom">+ Custom</option>
            </select>
          </>
        ) : (
          <div className="custom-column">
            <input
              type="text"
              placeholder="Custom column title"
              value={customColumnTitle}
              onChange={(e) => setCustomColumnTitle(e.target.value)}
            />
            <button className="kanban-button" onClick={handleCustomColumnSubmit}>
              Confirm
            </button>
          </div>
        )}
        {selectedOption === 'Custom' && (
          <button className="kanban-button" onClick={handleBack}>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default AddColumn;
