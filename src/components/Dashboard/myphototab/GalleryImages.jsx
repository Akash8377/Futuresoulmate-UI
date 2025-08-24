import React from 'react';
import axios from 'axios';
import config from '../../../config';

const GalleryImages = ({ images = [], onDelete }) => {
  const baseImageUrl = `${config.baseURL}/uploads/profiles/`;

  const handleDelete = async (imageId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${config.baseURL}/api/profile/gallery/image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        // Call parent handler to refresh the image list
        if (typeof onDelete === 'function') {
          onDelete(imageId);
        }
      } else {
        console.error('Delete failed:', result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (!images.length) {
    return <p className="text-muted mt-4">No uploaded photos yet.</p>;
  }

  return (
    <>
  <div className="note-box mt-4">
      <strong>Note:</strong> You can upload 20 photos to your profile. Each photos must be less than 15 MB and in jpg, jpeg, png or webp format All photos uploaded are screened as per Photo Guidelines and 98% of those get activated within 2 hours.
    </div>
    
    <div className="gallery-images mt-4 d-flex flex-wrap">
      {images.map((img, idx) => (
        <div key={img.id || idx} className="gallery-image-wrapper me-2 mb-2 position-relative">
          <img
            src={`${baseImageUrl}${img.filename}`}
            alt={`Gallery ${idx}`}
            className="gallery-image"
          />
          <button
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
            onClick={() => handleDelete(img.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
    </>
  );
};

export default GalleryImages;
