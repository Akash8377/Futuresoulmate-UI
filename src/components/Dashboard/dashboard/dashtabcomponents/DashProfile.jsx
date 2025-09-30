import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../config';
import { setUser } from '../../../../features/user/userSlice';
import { toast } from '../../../Common/Toast';
import axios from 'axios';
import ProfileImageWithProgress from './ProfileImageWithProgress';
import SocialConnections from './SocialConnections';
import ActivitySummary from './ActivitySummary';
import DashProfileCard from './DashProfileCard'

const DashProfile = ({ onEditClick, notifications }) => {
  const { userInfo, token } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [completion, setCompletion] = useState(0);
  const [socialAccounts, setSocialAccounts] = useState({
    linkedin: { connected: false, username: '' },
    instagram: { connected: false, username: '' },
    facebook: { connected: false, username: '' }
  });
  const [isLinking, setIsLinking] = useState(false);

  // Fetch profile completion percentage
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const res = await axios.get(`${config.baseURL}/api/profile/completion`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletion(res.data.completion.percent || 20);
      } catch (error) {
        console.error("Error fetching profile completion", error);
      }
    };
    fetchCompletion();
  }, [token]);

  // Fetch social accounts data
  const fetchSocialAccounts = async () => {
    try {
      const res = await axios.get(`${config.baseURL}/api/social-profile/social-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success && res.data.socialAccounts) {
        setSocialAccounts(res.data.socialAccounts);
      }
    } catch (error) {
      console.error("Error fetching social accounts", error);
      toast.error(error.response?.data?.message || 'Failed to load social accounts');
    }
  };

  useEffect(() => {
    fetchSocialAccounts();
  }, [token]);

  // Handle OAuth callback results
  useEffect(() => {
    const checkOAuthResult = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const socialConnected = urlParams.get('social_connected');
      const error = urlParams.get('error');

      if (socialConnected) {
        toast.success(`${socialConnected.charAt(0).toUpperCase() + socialConnected.slice(1)} connected successfully!`);
        fetchSocialAccounts();
        window.history.replaceState({}, '', window.location.pathname);
      }

      if (error) {
        toast.error(`Social connection failed: ${error}`);
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    checkOAuthResult();
  }, []);

  return (
    <div>
      <div className="row g-4">
        {/* Profile Section */}
        <div className="col-lg-3">
          <DashProfileCard 
            userInfo={userInfo}
            completion={completion}
            socialAccounts={socialAccounts}
            onEditClick={onEditClick}
            token={token}
            dispatch={dispatch}
            fetchSocialAccounts={fetchSocialAccounts}
            isLinking={isLinking}
            setIsLinking={setIsLinking}
          />
        </div>

        {/* Activity Summary */}
        <div className="col-lg-6">
          <ActivitySummary 
            notifications={notifications}
            onEditClick={onEditClick}
            userInfo={userInfo}
          />
        </div>

        {/* Ad Banner */}
        <div className="col-lg-3">
          <div className="card-lite p-0 overflow-hidden">
            <img src="images/addbanner.jpg" className="w-100" alt="Ad Banner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashProfile;



// import React, { useRef, useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import config from '../../../../config';
// import ProfileTab from '../ProfileTab';
// import { Link } from 'react-router-dom';
// import { setUser } from '../../../../features/user/userSlice';
// import { toast } from '../../../Common/Toast';
// import axios from 'axios';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import BoostButton from '../../../Common/BoostButton';

// const DashProfile = ({onEditClick, notifications}) => {
//   const { userInfo, token } = useSelector(state => state.user);
//   const dispatch = useDispatch()
//   const [pending, setPending] = useState([])
//   const [accepted, setAccepted] = useState([])
//   const [completion, setCompletion] = useState(0);
//   const [socialAccounts, setSocialAccounts] = useState({
//     linkedin: { connected: false, username: '' },
//     instagram: { connected: false, username: '' },
//     facebook: { connected: false, username: '' }
//   });
//   const [isLinking, setIsLinking] = useState(false);

//   const tabComponents = {
//     profile: ProfileTab,
//   };

//   // Fetch profile completion percentage from API
//   useEffect(() => {
//     const fetchCompletion = async () => {
//       try {
//         const res = await axios.get(`${config.baseURL}/api/profile/completion`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log("res.data",res.data)
//         setCompletion(res.data.completion.percent || 20);
//       } catch (error) {
//         console.error("Error fetching profile completion", error);
//       }
//     };

//     fetchCompletion();
//   }, [token]);

//   // Fetch social accounts data
//   const fetchSocialAccounts = async () => {
//     try {
//       const res = await axios.get(`${config.baseURL}/api/social-profile/social-accounts`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (res.data.success && res.data.socialAccounts) {
//         setSocialAccounts(res.data.socialAccounts);
//       }
//     } catch (error) {
//       console.error("Error fetching social accounts", error);
//       toast.error(error.response?.data?.message || 'Failed to load social accounts');
//     }
//   };

// useEffect(() => {
//   fetchSocialAccounts();
// }, [token]);

//   // Check if user has at least one social account connected
//   const isSocialVerified = Object.values(socialAccounts).some(account => account.connected);

//   // Get progress color
//   const getColor = (percent) => {
//     if (percent < 40) return "#e74c3c"; // Red
//     if (percent < 80) return "#f1c40f"; // Yellow
//     return "#2ecc71"; // Green
//   };

//   const fileInputRef = useRef(null);
//   const handleUploadClick  =() =>{
//     if(fileInputRef.current){
//       fileInputRef.current.click();
//     }
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 15 * 1024 * 1024) {
//         toast.error('File size should be less than 15MB');
//         return;
//       }

//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
//       if (!validTypes.includes(file.type)) {
//         toast.error('Only JPG, PNG, or GIF files are allowed');
//         return;
//       }

//       toast.error(null);
//       const reader = new FileReader();
//       reader.readAsDataURL(file);

//       uploadProfileImage(file);
//     }
//   };

//   const uploadProfileImage = async (file) => {
//     const formData = new FormData();
//     formData.append('profile', file);

//     try {
//       const response = await axios.post(`${config.baseURL}/api/profile/upload-image`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//         }
//       });

//       toast.success("Upload successful")
//        const updatedUser = {
//       ...userInfo,
//       profile_image: response.data.imageUrl,
//     };

//     dispatch(setUser({
//       userInfo: updatedUser,
//       token: token,
//     }));
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(
//         error.response?.data?.message ||
//         'Failed to upload image. Please try again.'
//       );
//     }
//   };

//   // Handle social account connection
// const handleSocialConnect = async (platform) => {
//   setIsLinking(true);
//   try {
//     // Step 1: Get OAuth URL from backend
//     const response = await axios.post(
//       `${config.baseURL}/api/social-profile/generate-auth-url`,
//       { platform },
//       { headers: { Authorization: `Bearer ${token}` }}
//     );

//     if (response.data.success) {
//       // Step 2: Redirect user to social platform's OAuth page
//       window.location.href = response.data.authUrl;
//     } else {
//       toast.error('Failed to initiate social connection');
//     }
    
//   } catch (error) {
//     console.error(`Error initiating ${platform} connection`, error);
//     toast.error(error.response?.data?.message || `Failed to connect ${platform}`);
//     setIsLinking(false);
//   }
// };

// // Add useEffect to handle OAuth callback results
// useEffect(() => {
//   const checkOAuthResult = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const socialConnected = urlParams.get('social_connected');
//     const error = urlParams.get('error');

//     if (socialConnected) {
//       toast.success(`${socialConnected.charAt(0).toUpperCase() + socialConnected.slice(1)} connected successfully!`);
      
//       // Refresh social accounts data
//       fetchSocialAccounts();
      
//       // Clean URL
//       window.history.replaceState({}, '', window.location.pathname);
//     }

//     if (error) {
//       toast.error(`Social connection failed: ${error}`);
//       window.history.replaceState({}, '', window.location.pathname);
//     }
//   };

//   checkOAuthResult();
// }, []);

//   // Handle social account disconnection
// const handleSocialDisconnect = async (platform) => {
//   try {
//     const response = await axios.post(
//       `${config.baseURL}/api/social-profile/disconnect-social`,
//       { platform },
//       { headers: { Authorization: `Bearer ${token}` }}
//     );

//     if (response.data.success) {
//       setSocialAccounts(prev => ({
//         ...prev,
//         [platform]: { connected: false, username: '' }
//       }));
//       toast.success(response.data.message);
//     } else {
//       toast.error(response.data.message || 'Failed to disconnect account');
//     }
    
//   } catch (error) {
//     console.error(`Error disconnecting ${platform}`, error);
//     toast.error(error.response?.data?.message || `Failed to disconnect ${platform}`);
//   }
// };

//   useEffect(() => {
//     // Filter searches based on isAdvanced prop
//     if (notifications.length) {
//       const pending = notifications.filter(n => 
//         n.status === 'pending' || n.status === 'sent'
//       );
//       setPending(pending);
//       const accepted = notifications.filter(n => 
//         n.status === 'accepted'
//       );
//       setAccepted(accepted);
//     }
//   }, [notifications]);

//   return (
//     <div>
//       <div className="row g-4">
//           {/* Profile */}
//           <div className="col-lg-3">
//             <div className="prof-card">
//               <input type="file" 
//               accept="image/*" 
//               id="photoInput"
//               onChange={handleImageChange} 
//               ref={fileInputRef}
//               className="d-none" />

//                 {/* Avatar with circular progress */}
//             <div className="avatar-wrap text-center" style={{ width: "120px", margin: "auto" }} >
//               <div style={{ position: "relative", width: "120px", height: "120px" }}>
//                 <div style={{ transform: "rotate(180deg)" }}>
//                   <CircularProgressbar
//                     value={completion}
//                     strokeWidth={3}
//                     styles={buildStyles({
//                       pathColor: getColor(completion),
//                       trailColor: "#ccc9c9ff",
//                     })}
//                   />
//                 </div>

//                 {/* Profile Image inside circle */}
//                 <img
//                   src={userInfo?.profile_image ? `${config.baseURL}/uploads/profiles/${userInfo?.profile_image}` : "images/userprofile.png"}
//                   className="rounded-circle cursor-pointer"
//                   style={{
//                     width: "110px",
//                     height: "110px",
//                     objectFit: "cover",
//                     objectPosition: "top",
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     zIndex: "50"
//                   }}
//                   alt="avatar"
//                   id="uploadTrigger"
//                   onClick={handleUploadClick}
//                   title='Change profile picture'
//                 />

//                 {/* Upload Button */}
//                 <span className="avatar-plus">
//                   <div style={{fontSize:"12px",fontWeight: "600", color: getColor(completion) }} title={`Profile ${completion}% complete`}>
//                     {completion}%
//                   </div>
//                 </span>
//               </div>
//             </div>

//               <div className="section d-flex justify-content-between align-items-center">
//                 <div>
//                   <div className="title">{userInfo?.first_name} {userInfo?.last_name}</div>
//                   <div className="small text-muted">{userInfo.profileId}</div>
//                 </div>
//                 <Link href="#" onClick={onEditClick} className="small fw-semibold text-decoration-none" style={{ color: '#df8525' }}>Edit</Link>
//               </div>

//               {/* Social Verification Badge */}
//               {isSocialVerified && (
//                 <div className="section">
//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                       <i className="fa fa-shield me-2" style={{ color: '#2ecc71' }} aria-hidden="true"></i>
//                       <div>
//                         <div className="title" style={{ fontSize: '14px' }}>Social Verified</div>
//                         <div className="small text-muted">Trust score increased</div>
//                       </div>
//                     </div>
//                     <div className="check-badge text-success">
//                       <i className="fa fa-check-circle" aria-hidden="true"></i>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="section d-flex justify-content-between align-items-center">
//                 <div>
//                   <div className="small text-muted mb-1">Account Type</div>
//                   <div className="fw-semibold" style={{ fontSize: '14px' }}>{userInfo.plan_status === "active" ? userInfo.plan_name : "Free Membership"}</div>
//                 </div>
//               </div>

//               <div className="section">
//                 <div className='d-flex justify-content-between'>
//                   <div>
//                     <div className="title" style={{ fontSize: '14px' }}>Blue Tick Verified</div>
//                     <div className="small text-muted">Valid till 4 July 2026</div>
//                   </div>
//                   <div className="check-badge">
//                     <i className="fa fa-check-square-o" aria-hidden="true"></i>
//                   </div>
//                 </div>
//                 <BoostButton/>
//               </div>

//               {/* Social Media Connections */}
//               <div className="section">
//                 <div className="title mb-2" style={{ fontSize: '14px' }}>Connect Social Accounts</div>
//                 <div className="social-connections">
//   {['linkedin', 'instagram', 'facebook'].map(platform => (
//     <div key={platform} className="d-flex justify-content-between align-items-center mb-2">
//       <div className="d-flex align-items-center">
//         <i className={`fa fa-${platform} me-2`} style={{ 
//           color: platform === 'linkedin' ? '#0077b5' : 
//                  platform === 'instagram' ? '#E4405F' : '#1877F2',
//           width: '16px'
//         }} aria-hidden="true"></i>
//         <span className="small text-capitalize">{platform}</span>
//         {socialAccounts[platform].connected && (
//           <span className="badge bg-success ms-2 small">Connected</span>
//         )}
//       </div>
//       {socialAccounts[platform].connected ? (
//         <button 
//           className="btn btn-outline-danger btn-sm"
//           onClick={() => handleSocialDisconnect(platform)}
//           disabled={isLinking}
//         >
//           Disconnect
//         </button>
//       ) : (
//         <button 
//           className="btn btn-outline-primary btn-sm"
//           onClick={() => handleSocialConnect(platform)}
//           disabled={isLinking}
//         >
//           {isLinking ? 'Connecting...' : 'Connect'}
//         </button>
//       )}
//     </div>
//   ))}
// </div>
//                 {!isSocialVerified && (
//                   <div className="small text-muted mt-2">
//                     Connect at least 1 account to get Social Verified badge
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Activity summary */}
//           <div className="col-lg-6">
//             <div className="card-lite p-3">
//               <h6>Your Activity Summary</h6>
//               <table className="w-100 text-center act-table mb-2">
//                 <tbody>
//                   <tr className="head">
//                     <td style={{ width: '33.33%' }}>
//                       {pending?.length || 0}<br />
//                       <span className="fw-normal text-muted small">Pending Invitations</span>
//                     </td>
//                     <td style={{ width: '33.33%' }}>
//                       {accepted?.length || 0}<br />
//                       <span className="fw-normal text-muted small">Accepted Invitations</span>
//                     </td>
//                     <td style={{ width: '33.33%' }}>
//                       0 <span className="badge align-top small" style={{ backgroundColor: '#cef8e5' }}>NEW</span><br />
//                       <span className="fw-normal text-muted small">Recent Visitors</span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>

//               <table className="w-100 text-center act-table mb-2">
//                 <tbody>
//                   <tr className="head">
//                     <td style={{ width: '33.33%' }}>
//                       0<br />
//                       <span className="fw-normal text-muted small">Contacts Viewed</span>
//                     </td>
//                     <td style={{ width: '33.33%' }}>
//                       0<br />
//                       <span className="fw-normal text-muted small">Chats initiated</span>
//                     </td>
//                     <td style={{ width: '33.33%' }}>{userInfo.plan_status === "active" ? null :(
//                       <><span className="text-primary fw-semibold">Only Premium Members</span> can avail these benefits <i className="fa fa-lock" aria-hidden="true" style={{ color: '#d61962' }}></i></>
//                     )}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <hr />
//               <p className="small mb-0 cursor-pointer" onClick={onEditClick}><strong>Complete Profile</strong></p>
//             </div>
//           </div>

//           {/* Ad */}
//           <div className="col-lg-3">
//             <div className="card-lite p-0 overflow-hidden">
//               <img src="images/addbanner.jpg" className="w-100" alt="Ad Banner" />
//             </div>
//           </div>
//         </div>
//     </div>
//   )
// }

// export default DashProfile