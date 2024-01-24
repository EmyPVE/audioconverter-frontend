import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LimitReachedModal from '../components/LimitReachedModal';
import { useAuth } from '../components/AuthContext';

function HomePage() {
    const { isAuthenticated } = useAuth();
    const [file, setFile] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState('mp3');
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const conversionCount = parseInt(localStorage.getItem('conversionCount') || '0');
    const lastConversionDate = localStorage.getItem('lastConversionDate');
    const [showDownloadButton, setShowDownloadButton] = useState(false);

    useEffect(() => {
      const lastConversionDate = localStorage.getItem('lastConversionDate');
      if (new Date().toISOString().slice(0, 10) !== lastConversionDate) {
        localStorage.setItem('conversionCount', '0');
      }
    }, []);
    
    useEffect(() => {
      let timer;
      if (showDownloadButton) {
        timer = setTimeout(() => {
          setShowDownloadButton(false);
        }, 2000);
      }
      return () => clearTimeout(timer);
    }, [showDownloadButton]);
    
    useEffect(() => {
      if (!isAuthenticated && conversionCount >= 3) {
        setShowLimitModal(true);
      }
      else{
        setShowLimitModal(false);
      }
    }, [isAuthenticated, conversionCount]);

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
    
      if (new Date().toISOString().slice(0, 10) !== lastConversionDate) {
        localStorage.setItem('conversionCount', '0');
      }
    
      const formData = new FormData();
      formData.append('audio_file', file);
      formData.append('conversion_format', selectedFormat);
    
      try {
        if (isAuthenticated || conversionCount < 3) {
          setLoading(true);
        }

        if (!isAuthenticated && conversionCount >= 3) {
          setShowLimitModal(true);
        }

        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:8000/convert_upload/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
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
      const conversionCount = parseInt(localStorage.getItem('conversionCount') || '0');

      fetch(`https://localhost:8000/media/${filePath}`, {
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
          localStorage.setItem('conversionCount', conversionCount + 1);
          localStorage.setItem('lastConversionDate', new Date().toISOString().slice(0, 10));
    
          link.parentNode.removeChild(link);
        });
    };
    
    const handleDownload = () => {
      downloadAudioFile(fileName, fileName);
      setShowDownloadButton(true);
    };
    
  
    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Audio Converter</h1>
        <div className="mb-3">
          <label htmlFor="audioFile" className="form-label">Select your audio file:</label>
          <input type="file" className="form-control" id="audioFile" accept=".mp3,.wav,.aiff,.wma" onChange={handleFileChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="conversionFormat" className="form-label">Select the conversion:</label>
          <select className="form-select" id="conversionFormat" value={selectedFormat} onChange={handleFormatChange}>
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="aiff">AIFF</option>
            <option value="wma">WMA</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
        {fileName && !showLimitModal &&(
      <div className="mt-3">
        {showDownloadButton ? (
          <button className="btn btn-success" onClick={handleDownload} disabled>
            Downloading...
          </button>
        ) : (
          <button className="btn btn-success" onClick={handleDownload}>
            Download
          </button>
        )}
      </div>
    )}
    <LimitReachedModal show={showLimitModal} onClose={() => setShowLimitModal(false)} />
</div>
    );
}

export default HomePage;
