import React, { useState } from 'react';

interface UploadPfpProps {
  onFileChange: (file: File | null) => void;
  IMAGE_URL?: string;
  viewingOwn: boolean;
}

const DEFAULT_IMAGE_URL = "https://clubstop.s3.us-east-2.amazonaws.com/Screenshot+2025-08-04+at+2.01.53%E2%80%AFPM.png";

function UploadPfp({ onFileChange, IMAGE_URL = DEFAULT_IMAGE_URL, viewingOwn }: UploadPfpProps) {
  const [preview, setPreview] = useState<string | null>(IMAGE_URL);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file); 
    } else {
      onFileChange(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (viewingOwn) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (viewingOwn) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleClick = () => {
    if (viewingOwn) {
      document.getElementById('profile-upload')?.click();
    }
  };

  return (
    <div className="upload-pfp-container">
      <div 
        className={`profile-image-wrapper ${isDragging ? 'dragging' : ''} ${viewingOwn ? 'interactive' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        <div className="profile-image-container">
          <img 
            src={preview || DEFAULT_IMAGE_URL} 
            alt="Profile Preview" 
            className="profile-image"
          />
          
          {viewingOwn && (
            <div className={`image-overlay ${isHovering || isDragging ? 'visible' : ''}`}>
              <div className="overlay-content">
                <svg className="camera-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="overlay-text">
                  {isDragging ? 'Drop to Upload' : 'Change Photo'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {viewingOwn && (
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="file-input"
            id="profile-upload"
          />
        )}
      </div>
      
      {viewingOwn && (
        <div className="upload-instructions">
          <p>Click, drag & drop to upload</p>
          <span>JPG, PNG, or GIF (Max 5MB)</span>
        </div>
      )}
    </div>
  );
}

export default UploadPfp;