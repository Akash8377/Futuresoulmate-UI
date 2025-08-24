const UploadMessages = ({ error, success }) => (
  <>
    {error && <div className="alert alert-danger">{error}</div>}
    {success && <div className="alert alert-success">Images uploaded successfully!</div>}
  </>
);

export default UploadMessages;
