import React from 'react';

const PreviewImages = ({ files, setSelectedFiles, setPreviewImage }) => {
  const handleRemoveFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    if (index === 0 && updated.length > 0) {
      setPreviewImage(URL.createObjectURL(updated[0]));
    } else if (updated.length === 0) {
      setPreviewImage(null);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="preview-row mt-4 d-flex flex-wrap">
      {files.map((file, idx) => (
        <div className="preview-item position-relative me-2 mb-2" key={idx}>
          <img src={URL.createObjectURL(file)} alt={`preview ${idx}`} className="preview-image" />
          <button className="delete-btn" onClick={() => handleRemoveFile(idx)} title="Remove image">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default PreviewImages;
