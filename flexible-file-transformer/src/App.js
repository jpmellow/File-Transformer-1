import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import TaskSelector from './components/TaskSelector';
import ResultViewer from './components/ResultViewer';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [task, setTask] = useState('');
  const [result, setResult] = useState(null);

  const handleFileUpload = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleTaskChange = (selectedTask) => {
    setTask(selectedTask);
  };

  const handleSubmit = async () => {
    if (file && task) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', task);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const resultData = await response.json();
      setResult(resultData);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Flexible File Transformer</h1>
      </header>
      <main>
        <FileUpload onFileUpload={handleFileUpload} />
        <TaskSelector onTaskChange={handleTaskChange} />
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
        <ResultViewer result={result} />
      </main>
    </div>
  );
}

export default App;
