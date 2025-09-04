import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config';
import ProfileTab from '../ProfileTab';
import { Link } from 'react-router-dom';
import { setUser } from '../../../features/user/userSlice';
import { toast } from '../../Common/Toast';
import axios from 'axios';

const DashProfile = ({onEditClick, notifications}) => {
  const { userInfo, token } = useSelector(state => state.user);
  const dispatch =useDispatch()
  const [pending, setPending] = useState([])
  const [accepted, setAccepted] = useState([])
  const tabComponents = {
    profile: ProfileTab,
  };

  const fileInputRef = useRef(null);
  const handleUploadClick  =() =>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

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

    useEffect(() => {
      // Filter searches based on isAdvanced prop
      if (notifications.length) {
        const pending = notifications.filter(n => 
          n.status === 'pending' || n.status === 'sent'
        );
        setPending(pending);
        const accepted = notifications.filter(n => 
          n.status === 'accepted'
        );
        setAccepted(accepted);
      }
    }, [notifications]);

  return (
    <div>
      <div className="row g-4">
          {/* Profile */}
          <div className="col-lg-3">
            <div className="prof-card">
              <input type="file" 
              accept="image/*" 
              id="photoInput"
              onChange={handleImageChange} 
              ref={fileInputRef}
              className="d-none" />
              <div className="avatar-wrap">
                <img id="avatarPreview" src={userInfo?.profile_image ?`${config.baseURL}/uploads/profiles/${userInfo?.profile_image}`:"images/userprofile.png"} className="avatar-img img-fluid object-fit-cover" style={{objectPosition: "top" /* This ensures the top of the image is shown */}} alt="avatar" />
                <span className="avatar-plus" id="uploadTrigger" onClick={handleUploadClick}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </span>
              </div>
              <div className="section d-flex justify-content-between align-items-center">
                <div>
                  <div className="title">{userInfo?.first_name} {userInfo?.last_name}</div>
                  <div className="small text-muted">{userInfo.profileId}</div>
                </div>
                <Link href="#" onClick={onEditClick} className="small fw-semibold text-decoration-none" style={{ color: '#df8525' }}>Edit</Link>
              </div>
              <div className="section d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-muted mb-1">Account Type</div>
                  <div className="fw-semibold" style={{ fontSize: '14px' }}>Free Membership</div>
                </div>
                {/* <Link href="#" className="small fw-semibold text-decoration-none" style={{ color: '#d61962' }}>Upgrade</Link> */}
              </div>
              <div className="section d-flex justify-content-between">
                <div>
                  <div className="title" style={{ fontSize: '14px' }}>Blue Tick Verified</div>
                  <div className="small text-muted">Valid till 4 July 2026</div>
                </div>
                <div className="check-badge">
                  <i className="fa fa-check-square-o" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Activity summary */}
          <div className="col-lg-6">
            <div className="card-lite p-3">
              <h6>Your Activity Summary</h6>
              <table className="w-100 text-center act-table mb-2">
                <tbody>
                  <tr className="head">
                    <td style={{ width: '33.33%' }}>
                      {pending?.length || 0}<br />
                      <span className="fw-normal text-muted small">Pending Invitations</span>
                    </td>
                    <td style={{ width: '33.33%' }}>
                      {accepted?.length || 0}<br />
                      <span className="fw-normal text-muted small">Accepted Invitations</span>
                    </td>
                    <td style={{ width: '33.33%' }}>
                      0 <span className="badge align-top small" style={{ backgroundColor: '#cef8e5' }}>NEW</span><br />
                      <span className="fw-normal text-muted small">Recent Visitors</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-100 text-center act-table mb-2">
                <tbody>
                  <tr className="head">
                    <td style={{ width: '33.33%' }}>
                      <span className="text-primary fw-semibold">Only Premium Members</span> can avail these benefits <i className="fa fa-lock" aria-hidden="true" style={{ color: '#d61962' }}></i>
                    </td>
                    <td style={{ width: '33.33%' }}>
                      0<br />
                      <span className="fw-normal text-muted small">Contacts Viewed</span>
                    </td>
                    <td style={{ width: '33.33%' }}>
                      0<br />
                      <span className="fw-normal text-muted small">Chats initiated</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr />
              <p className="small mb-0 cursor-pointer" onClick={onEditClick}><strong>Improve your Profile</strong></p>
            </div>
          </div>

          {/* Ad */}
          <div className="col-lg-3">
            <div className="card-lite p-0 overflow-hidden">
              <img src="images/addbanner.jpg" className="w-100" alt="Ad Banner" />
            </div>
          </div>
        </div>
    </div>
  )
}

export default DashProfile
