import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { toast } from '../../components/Common/Toast';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUser} from "../../features/user/userSlice";

const ProfileUpload = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Get user info directly from Redux store
  const { userInfo, token  } = useSelector(state => state.user);
  console.log(userInfo)
  const isLoggedIn = !!userInfo; // Simplified login check

  useEffect(()=>{
  if(isLoggedIn && userInfo?.profile_image){
    setPreviewImage(`${config.baseURL}/uploads/profiles/${userInfo?.profile_image}`)
  }
  },[setPreviewImage])


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (15MB)
      if (file.size > 15 * 1024 * 1024) {
        setUploadError('File size should be less than 15MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only JPG, PNG, or GIF files are allowed');
        return;
      }

      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload the file immediately after selection
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('profile', file);

    try {
      setUploadProgress(0);
      setUploadSuccess(false)

      const response = await axios.post(`${config.baseURL}/api/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadSuccess(true);
      toast.success("Upload successful")
      // console.log('Upload successful:', response.data);
       const updatedUser = {
      ...userInfo,
      profile_image: response.data.imageUrl,
    };

    dispatch(setUser({
      userInfo: updatedUser,
      token: token, // ← do NOT change token
    }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error.response?.data?.message ||
        'Failed to upload image. Please try again.'
      );
    }
  };

  return (
    <>
      <section className="profileupload">
        <div className="container mt-5 mb-5">
          {/* <div className="text-center mb-4">
            <h5>Congrats! Your Profile has been created.</h5>
            <p>Upload Photo and get better Matches</p>
          </div> */}

          <div className="row mb-4">
            <div className="col-md-6 photo-box text-center">
              <div className="upload-box1">
                <img
                  src={previewImage || "images/Userprofile.png"}
                  className="preview-img"
                  id="preview"
                  alt="Profile Preview"
                />

                <form ref={formRef}>
                  <label className="upload-btn">
                    <i className="fa fa-camera" aria-hidden="true"></i>
                    <input
                      type="file"
                      name="profile"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                  </label>
                </form>
              </div>
              <div className='privacy-control'>
                <small><i className="fa fa-lock"></i> 100% Privacy controls available</small>
              </div>
            </div>
            <div className="col-md-6 text-center upload-buttons d-flex flex-column justify-content-center align-items-center">
              <button
                className="btn btn-primary mt-3"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fa fa-desktop" aria-hidden="true"></i> Upload From Computer
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/hobbies")}
              >
                  {/* <i className="fa fa-envelope-o" aria-hidden="true"></i> */}
               Continue
              </button>

            </div>
          </div>

          {/* Upload progress indicator */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          {/* Upload status messages */}
          {uploadError && (
            <div className="alert alert-danger">{uploadError}</div>
          )}
          {uploadSuccess && (
            <div className="alert alert-success">Image uploaded successfully!</div>
          )}

          <div className="guideline">
            <h6 className="mb-3"><strong>Photo guidelines</strong></h6>
            <div className="row photo-guideline text-center mb-4">
              <div className="col">
                <img src="images/closeup.png" alt="" />
                <div className="tick">✔ Close up</div>
              </div>
              <div className="col">
                <img src="images/halfview.png" alt="" />
                <div className="tick">✔ Half view</div>
              </div>
              <div className="col">
                <img src="images/fullview.png" alt="" />
                <div className="tick">✔ Full view</div>
              </div>
              <div className="col">
                <img src="images/sideface.png" alt="" />
                <div className="cross">✖ Side face</div>
              </div>
              <div className="col">
                <img src="images/group.png" alt="" />
                <div className="cross">✖ Group</div>
              </div>
              <div className="col">
                <img src="images/blur.png" alt="" />
                <div className="cross">✖ Unclear</div>
              </div>
            </div>
          </div>

          <div className="row guidelines mt-5">
            <div className="col-md-6">
              <h6 className="text-success">✔ Do's</h6>
              <ul>
                <li>Your Photo should be front facing and your entire face should be visible.</li>
                <li>Ensure that your Photo is recent and not with a group.</li>
                <li>You can upload up to 20 Photos to your Profile.</li>
                <li>Each Photo must be less than 15 MB and in jpg, gif, png, bmp or tiff format.</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-danger">✖ Don'ts</h6>
              <ul>
                <li>Watermarked, digitally enhanced or morphed photos will be rejected.</li>
                <li>Photos with personal information will be rejected.</li>
                <li>Irrelevant photos may lead to profile deactivation.</li>
              </ul>
            </div>
          </div>

          <div className="note-box">
            <strong>Note:</strong> Photos will be screened, optimized and added to your Profile within few hours.
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileUpload;