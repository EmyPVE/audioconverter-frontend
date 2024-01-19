import React, { useState } from 'react';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [file, setFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('audio_file', file);
    formData.append('conversion_format', selectedFormat);
  
    try {
      setLoading(true);
  
      const csrftoken = Cookies.get('csrftoken');
      const response = await fetch('http://localhost:8000/convert_upload/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json();
      setFileName(responseData.converted_file);
    } catch (error) {
      console.error('Error during conversion:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAudioFile = (filePath, fileName) => {
    fetch(`http://localhost:8000/media/${filePath}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'audio/*',
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
  
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
  
        document.body.appendChild(link);
  
        link.click();
  
        link.parentNode.removeChild(link);
      });
  };
  
  const handleDownload = () => {
    downloadAudioFile(fileName, fileName);
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Audio Converter</h1>
      <div className="mb-3">
        <label htmlFor="audioFile" className="form-label">Selectează fișierul:</label>
        <input type="file" className="form-control" id="audioFile" accept=".mp3,.wav,.aiff,.wma" onChange={handleFileChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="conversionFormat" className="form-label">Selectează formatul de conversie:</label>
        <select className="form-select" id="conversionFormat" value={selectedFormat} onChange={handleFormatChange}>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
          <option value="aiff">AIFF</option>
          <option value="wma">WMA</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
        {loading ? 'Converting...' : 'Convert'}
      </button>
      {fileName && (
        <div className="mt-3">
          <button className="btn btn-success" onClick={handleDownload}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
