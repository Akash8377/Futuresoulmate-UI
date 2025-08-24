import React from 'react';
import config from '../../../config';

const UploadButtons = ({
  selectedFiles,
  setSelectedFiles,
  setUploadProgress,
  setUploadSuccess,
  setUploadError,
  previewImage,
  setPreviewImage,
  fileInputRef,
  navigate,
}) => {
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const uniqueFiles = newFiles.filter(file => !selectedFiles.map(f => f.name).includes(file.name));
    setSelectedFiles(prev => [...prev, ...uniqueFiles]);
    if (uniqueFiles.length > 0 && !previewImage) {
      setPreviewImage(URL.createObjectURL(uniqueFiles[0]));
    }
    setUploadError('');
    event.target.value = null;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one photo to upload.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('gallery', file));
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setUploadError('Authentication token missing. Please log in again.');
      return;
    }

    setUploadProgress(0);
    setUploadSuccess(false);
    setUploadError('');

    try {
      const response = await fetch(`${config.baseURL}/api/profile/upload-gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadProgress(100);
        setUploadSuccess(true);
        setSelectedFiles([]);
        setPreviewImage(null);
      } else {
        setUploadError(result.message || 'Upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Something went wrong during upload.');
    }
  };

  return (
    <div className=" text-center upload-buttons d-flex flex-column justify-content-center align-items-center">
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button className="btn btn-primary mt-3" onClick={() => fileInputRef.current.click()}>
        <i className="fa fa-desktop" aria-hidden="true"></i> Upload From Computer
      </button>
      <button className="btn btn-outline-primary mt-3" onClick={handleUpload}>
        Upload Selected Photos
      </button>
    </div>
  );
};

export default UploadButtons;
