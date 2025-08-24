
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import Sidebar from './Sidebar';
import UploadSection from './UploadSection';
import GalleryImages from './GalleryImages';
import Guidelines from './Guidelines';
import './myphoto.css';

const Myphoto = ({onChangeTab}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchGalleryImages = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${config.baseURL}/api/profile/gallery`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setGalleryImages(result.images || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleImageDelete = async () =>{
    await fetchGalleryImages();
  }

  useEffect(() => {
    fetchGalleryImages();
  }, [uploadSuccess]);

  return (
    <div className="photos-tab-container">
      <Sidebar onChangeTab={onChangeTab}/>
      <div className="main-content">
        <h5>My Photos</h5>
        <UploadSection
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          uploadSuccess={uploadSuccess}
          setUploadSuccess={setUploadSuccess}
          uploadError={uploadError}
          setUploadError={setUploadError}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          fileInputRef={fileInputRef}
          navigate={navigate}
        />
        <GalleryImages images={galleryImages} 
        onDelete={handleImageDelete}
        />
        <Guidelines />
      </div>
    </div>
  );
};

export default Myphoto;
