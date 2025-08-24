import React from 'react';
import UploadButtons from './UploadButtons';
import UploadProgress from './UploadProgress';
import UploadMessages from './UploadMessages';
import PreviewImages from './PreviewImages';
import Guidelines from './Guidelines';

const UploadSection = ({
  selectedFiles,
  setSelectedFiles,
  uploadProgress,
  setUploadProgress,
  uploadSuccess,
  setUploadSuccess,
  uploadError,
  setUploadError,
  previewImage,
  setPreviewImage,
  fileInputRef,
  navigate,
}) => {
  return (
    <section className="profileupload">
      <div className="container mt-5 mb-5">
        <UploadButtons
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setUploadProgress={setUploadProgress}
          setUploadSuccess={setUploadSuccess}
          setUploadError={setUploadError}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          fileInputRef={fileInputRef}
          navigate={navigate}
        />

        <UploadProgress progress={uploadProgress} />
        <UploadMessages error={uploadError} success={uploadSuccess} />
        <PreviewImages files={selectedFiles} setSelectedFiles={setSelectedFiles} setPreviewImage={setPreviewImage} />
        
      </div>
    </section>
  );
};

export default UploadSection;
