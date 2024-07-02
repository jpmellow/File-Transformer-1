import React from 'react';

const TaskSelector = ({ onTaskChange }) => {
  const handleTaskChange = (event) => {
    onTaskChange(event.target.value);
  };

  return (
    <div className="task-selector">
      <label htmlFor="task">Select Task:</label>
      <select id="task" onChange={handleTaskChange}>
        <option value="">--Choose a task--</option>
        <option value="resizeImage">Resize Image</option>
        <option value="ocrPdf">OCR PDF</option>
        <option value="convertPpt">Convert PPT to Web Copy</option>
      </select>
    </div>
  );
};

export default TaskSelector;
