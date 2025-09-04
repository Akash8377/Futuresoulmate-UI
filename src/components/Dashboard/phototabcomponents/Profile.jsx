import React from 'react'
import config from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { calculateAge, scrollToBottom, scrollToPercent } from '../../../utils/helpers';
import { setUser } from '../../../features/user/userSlice';
import { toast } from '../../Common/Toast';
import axios from 'axios';

const Profile = ({onChangeTab}) => {
  const { userInfo, token } = useSelector(state => state.user);
  const dispatch =useDispatch()
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (15MB)
      if (file.size > 15 * 1024 * 1024) {
        toast.error('File size should be less than 15MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, or GIF files are allowed');
        return;
      }

      toast.error(null);
      const reader = new FileReader();
      // reader.onloadend = () => {
      //   setPreviewImage(reader.result);
      // };
      reader.readAsDataURL(file);

      // Upload the file immediately after selection
      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('profile', file);

    try {
      // setUploadProgress(0);
      // setUploadSuccess(false)

      const response = await axios.post(`${config.baseURL}/api/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // setUploadProgress(percentCompleted);
        }
      });

      // setUploadSuccess(true);
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
      toast.error(
        error.response?.data?.message ||
        'Failed to upload image. Please try again.'
      );
    }
  };

  return (
    <div>
      <div className="profile-name">
        <h4>
          {userInfo?.first_name} {userInfo?.last_name} <small className="text-muted">({userInfo.profileId})</small>
        </h4>
      </div>
      <div className="border p-4 bg-white mt-3">
        <div className="row g-4">
          <div className="col-md-4 col-lg-3">
            <div className="upload-box text-center d-flex flex-column justify-content-center align-items-center rounded">
              {userInfo?.profile_image ? (<label
                htmlFor="fileUpload"
                className="d-flex flex-column justify-content-center align-items-center overflow-hidden"
              >
                <img className="object-fit-cover" src={userInfo?.profile_image ?`${config.baseURL}/uploads/profiles/${userInfo?.profile_image}`:"images/camera.png"}  />
              </label>):(<label
                htmlFor="fileUpload"
                className="d-flex flex-column justify-content-center align-items-center overflow-hidden"
              >
                <p>
                  <span className="click-here">Click here</span>
                  <br />
                  to upload
                </p>
                <img src={"images/camera.png"}  />
                <strong className="d-block mt-2">Photo</strong>
              </label>)}
              <input type="file" id="fileUpload" className="d-none" onChange={handleImageChange} accept="image/*"/>
            </div>
          </div>
          <div className="col-md-8 col-lg-9">
            <div className="row py-3">
              <div className="col-md-6 pe-md-4">
                <table className="table table-borderless table-sm mini-data mb-0 ">
                  <tbody>
                    <tr>
                      <td>Age/Height:</td>
                      <td>{calculateAge(userInfo?.birth_year, userInfo?.birth_month, userInfo?.birth_day)}/{userInfo?.height}</td>
                    </tr>
                    <tr>
                      <td>Marital Status:</td>
                      <td>{userInfo?.marital_status}</td>
                    </tr>
                    <tr>
                      <td>Posted By:</td>
                      <td>{userInfo?.person}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
                <table className="table table-borderless table-sm mini-data mb-0">
                  <tbody>
                    <tr>
                      <td>Religion Community:</td>
                      <td>{userInfo?.religion}</td>
                    </tr>
                    <tr>
                      <td>Location:</td>
                      <td>{userInfo?.city}</td>
                    </tr>
                    <tr>
                      <td>Language:</td>
                      <td>{userInfo?.mother_tongue} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-light p-3 rounded small">
              <div className="profile-management">
                <h4>
                  <strong>Manage your Profile</strong>
                </h4>
                <div className="profile-edit-list">
                  <div className="row mt-2">
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=> scrollToPercent(22)}>Edit Personal Profile</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#">View Profile Stats</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=>onChangeTab("settings")}>Set Contact Filters</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=>onChangeTab("partner")}>Edit Partner Profile</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=>onChangeTab("photos")}>Add Photos</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=>onChangeTab("settings")}>Hide / Delete Profile</a>
                    </div>
                    <div className="col-6 col-md-4">
                      <a href="#" onClick={()=> scrollToBottom()}>Edit Contact Details</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
