const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  filepath TEXT,
  task TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res) => {
    console.log('Received request for /upload');
    const form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }
  
      console.log('Parsed form fields:', fields);
      console.log('Parsed form files:', files);
  
      const file = files.file;
      const task = fields.task;
  
      // Insert file metadata into database
      db.run(`INSERT INTO uploads (filename, filepath, task) VALUES (?, ?, ?)`, [file.newFilename, file.filepath, task], function(err) {
        if (err) {
          console.error('Error inserting into database:', err.message);
          return;
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
  
      switch (task) {
        case 'resizeImage':
          processImage(file, res);
          break;
        case 'ocrPdf':
          processPdf(file, res);
          break;
        case 'convertPpt':
          processPpt(file, res);
          break;
        default:
          res.status(400).json({ error: 'Invalid task' });
      }
    });
  });
  

const processImage = (file, res) => {
  const outputFilePath = path.join('public', 'processed', `${file.newFilename}.png`);
  sharp(file.filepath)
    .resize({ width: 1000 })
    .toFormat('png')
    .toFile(outputFilePath, (err, info) => {
      if (err) {
        res.status(500).json({ error: 'Error processing image' });
        return;
      }
      res.json({ downloadUrl: `/processed/${file.newFilename}.png` });
    });
};

const processPdf = (file, res) => {
  const worker = createWorker();
  (async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(file.filepath);
    await worker.terminate();
    res.json(data);
  })();
};

const processPpt = (file, res) => {
  // Add logic to convert PPT to web copy
  res.json({ message: 'PPT processing not implemented yet' });
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
