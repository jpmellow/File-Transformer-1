import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    onFileUpload(selectedFile);
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
