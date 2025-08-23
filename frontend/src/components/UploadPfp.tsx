import React, { useState } from 'react';

interface UploadPfpProps {
  onFileChange: (file: File | null) => void;
}

const DEFAULT_IMAGE_URL = "https://clubstop.s3.us-east-2.amazonaws.com/Screenshot+2025-08-04+at+2.01.53%E2%80%AFPM.png";

function UploadPfp({ onFileChange }: UploadPfpProps) {
  const [preview, setPreview] = useState<string | null>(DEFAULT_IMAGE_URL);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file); 
    } else {
      onFileChange(null);
    }
  };

  return (
    <div>
      {preview ? (
        <img src={preview} alt="Preview" style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 150, height: 150, backgroundColor: '#ccc', borderRadius: '50%' }} />
      )}
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}

export default UploadPfp;
