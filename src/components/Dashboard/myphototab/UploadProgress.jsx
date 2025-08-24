const UploadProgress = ({ progress }) => {
  if (progress <= 0 || progress >= 100) return null;
  return (
    <div className="progress mb-3">
      <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};

export default UploadProgress;
