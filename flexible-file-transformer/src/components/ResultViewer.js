import React from 'react';

const ResultViewer = ({ result }) => {
  if (!result) return null;

  return (
    <div className="result-viewer">
      <h2>Result</h2>
      {result.downloadUrl ? (
        <a href={result.downloadUrl} download>
          Download Processed File
        </a>
      ) : (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default ResultViewer;
