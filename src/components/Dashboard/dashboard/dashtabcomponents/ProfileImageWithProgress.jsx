import React, { useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import config from '../../../../config';
import { setUser } from '../../../../features/user/userSlice';
import { toast } from '../../../Common/Toast';

const ProfileImageWithProgress = ({ userInfo, completion, token, dispatch }) => {
  const fileInputRef = useRef(null);

  const getColor = (percent) => {
    if (percent < 40) return "#e74c3c";
    if (percent < 80) return "#f1c40f";
    return "#2ecc71";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or GIF files are allowed');
      return;
    }

    uploadProfileImage(file);
  };

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('profile', file);

    try {
      const response = await axios.post(`${config.baseURL}/api/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("Upload successful");
      const updatedUser = {
        ...userInfo,
        profile_image: response.data.imageUrl,
      };

      dispatch(setUser({
        userInfo: updatedUser,
        token: token,
      }));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to upload image. Please try again.'
      );
    }
  };

  return (
    <div className="avatar-wrap text-center" style={{ width: "120px", margin: "auto" }}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        ref={fileInputRef}
        className="d-none" 
      />
      
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

        <img
          src={userInfo?.profile_image 
            ? `${config.baseURL}/uploads/profiles/${userInfo?.profile_image}` 
            : "images/userprofile.png"
          }
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
          onClick={handleUploadClick}
          title='Change profile picture'
        />

        <span className="avatar-plus">
          <div style={{fontSize:"12px",fontWeight: "600", color: getColor(completion) }} 
                title={`Profile ${completion}% complete`}>
            {completion}%
          </div>
        </span>
      </div>
    </div>
  );
};

export default ProfileImageWithProgress;