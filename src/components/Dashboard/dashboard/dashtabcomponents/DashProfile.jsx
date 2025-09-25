import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../config';
import ProfileTab from '../ProfileTab';
import { Link } from 'react-router-dom';
import { setUser } from '../../../../features/user/userSlice';
import { toast } from '../../../Common/Toast';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import BoostButton from '../../../Common/BoostButton';

const DashProfile = ({onEditClick, notifications}) => {
  const { userInfo, token } = useSelector(state => state.user);
  const dispatch =useDispatch()
  const [pending, setPending] = useState([])
  const [accepted, setAccepted] = useState([])
  const [completion, setCompletion] = useState(0); // Default until API loads
  const tabComponents = {
    profile: ProfileTab,
  };
  // Fetch profile completion percentage from API
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await axios.get(`${config.baseURL}/api/profile/completion`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("res.data",res.data)
        setCompletion(res.data.completion.percent || 20); // Example: { percentage: 65 }
      } catch (error) {
        console.error("Error fetching profile completion", error);
      }
    };

    fetchCompletion();
  }, [token]);

  // Get progress color
  const getColor = (percent) => {
    if (percent < 40) return "#e74c3c"; // Red
    if (percent < 80) return "#f1c40f"; // Yellow
    return "#2ecc71"; // Green
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
      reader.readAsDataURL(file);

      uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('profile', file);

    try {
      const response = await axios.post(`${config.baseURL}/api/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      });

      toast.success("Upload successful")
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

                {/* Avatar with circular progress */}
            <div className="avatar-wrap text-center" style={{ width: "120px", margin: "auto" }} >
              <div style={{ position: "relative", width: "120px", height: "120px" }}>
                <div style={{ transform: "rotate(180deg)" }}>
                  <CircularProgressbar
                    value={completion}
                    strokeWidth={3}
                    styles={buildStyles({
                      pathColor: getColor(completion),
                      trailColor: "#ccc9c9ff",
                    })}
                  />
                </div>

                {/* Profile Image inside circle */}
                <img
                  // id="avatarPreview"
                  src={userInfo?.profile_image ? `${config.baseURL}/uploads/profiles/${userInfo?.profile_image}` : "images/userprofile.png"}
                  className="rounded-circle cursor-pointer"
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                    objectPosition: "top",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: "50"
                  }}
                  alt="avatar"
                  id="uploadTrigger"
                  onClick={handleUploadClick}
                  title='Change profile picture'
                />

                {/* Upload Button */}
                <span
                  className="avatar-plus"
                >
                  <div style={{fontSize:"12px",fontWeight: "600", color: getColor(completion) }} title={`Profile ${completion}% complete`}>
                    {completion}%
                  </div>
                </span>
              </div>

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
                  <div className="fw-semibold" style={{ fontSize: '14px' }}>{userInfo.plan_status === "active" ? userInfo.plan_name : "Free Membership"}</div>
                </div>
                {/* <Link href="#" className="small fw-semibold text-decoration-none" style={{ color: '#d61962' }}>Upgrade</Link> */}
              </div>
              <div className="section">
              <div className='d-flex justify-content-between'>
                <div>
                  <div className="title" style={{ fontSize: '14px' }}>Blue Tick Verified</div>
                  <div className="small text-muted">Valid till 4 July 2026</div>
                </div>
                <div className="check-badge">
                  <i className="fa fa-check-square-o" aria-hidden="true"></i>
                </div>
              </div>
              {/* <button class="boost-btn" onClick={() => boostProfile(token, userInfo, dispatch)}>🚀 Boost Profile</button> */}
              <BoostButton/>
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
                      0<br />
                      <span className="fw-normal text-muted small">Contacts Viewed</span>
                    </td>
                    <td style={{ width: '33.33%' }}>
                      0<br />
                      <span className="fw-normal text-muted small">Chats initiated</span>
                    </td>
                    <td style={{ width: '33.33%' }}>{userInfo.plan_status === "active" ? null :(
                      <><span className="text-primary fw-semibold">Only Premium Members</span> can avail these benefits <i className="fa fa-lock" aria-hidden="true" style={{ color: '#d61962' }}></i></>
                    )}</td>
                  </tr>
                </tbody>
              </table>

              <hr />
              <p className="small mb-0 cursor-pointer" onClick={onEditClick}><strong>Complete Profile</strong></p>
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
