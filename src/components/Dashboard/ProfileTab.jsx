import React, { useState } from "react";
import Profile from "./phototabcomponents/Profile";
import PartnerPrefer from "./phototabcomponents/PartnerPrefer";
import AboutMyself from "./phototabcomponents/AboutMyself";
import ContactDetails from "./phototabcomponents/ContactDetails";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import config from "../../config";
import { toast } from "../Common/Toast";
import { setUser } from "../../features/user/userSlice";

const ProfileTab = ({onChangeTab}) => {
  const { userInfo, token } = useSelector(state => state.user);
  const [editingSection, setEditingSection] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const dispatch = useDispatch()
  

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

const handleSaveClick = async () => {
  try {
    // 1. Create a clean copy of userInfo with properly parsed nested objects
    const updatedUserInfo = {
      ...userInfo,
      hobbies: typeof userInfo.hobbies === 'string' ? 
        safeJsonParse(userInfo.hobbies) : userInfo.hobbies,
      family_details: parseFamilyDetails(userInfo.family_details),
      verificationData: typeof userInfo.verificationData === 'string' ? 
        safeJsonParse(userInfo.verificationData) : userInfo.verificationData
    };

    // 2. Apply all non-family updates first
    Object.keys(updatedData).forEach(key => {
      if (key !== 'family_details') {
        updatedUserInfo[key] = updatedData[key];
      }
    });

    // 3. Apply family details updates if they exist
    if (updatedData.family_details) {
      updatedUserInfo.family_details = {
        ...(updatedUserInfo.family_details || {}), // Preserve existing family details
        ...updatedData.family_details             // Apply new updates
      };
    }

    // 4. Prepare data for API (ensure no stringified objects)
    const dataToSend = {
      ...updatedUserInfo,
      family_details: updatedUserInfo.family_details || {} // Ensure never null
    };
    console.log("Data to send",dataToSend)
    // 5. API call
    const response = await axios.put(`${config.baseURL}/api/profile/update`, dataToSend, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // 6. Update state
    dispatch(setUser({
      userInfo: updatedUserInfo,
      token: token,
    }));
    
    setEditingSection(null);
    setUpdatedData({});
    toast.success('Profile updated successfully!');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error(`Error updating profile: ${error.response?.data?.message || error.message}`);
  }
};

// Helper functions remain the same
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

const parseFamilyDetails = (familyData) => {
  if (!familyData) return {};
  if (typeof familyData === 'object') return familyData;
  
  try {
    const parsed = JSON.parse(familyData);
    return typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const handleDataChange = (section, field, value) => {
  // Special handling for family fields
  const familyFields = ['mother', 'father', 'sisters', 'brothers'];
  
  if (familyFields.includes(field)) {
    setUpdatedData(prev => ({
      ...prev,
      family_details: {
        ...(prev.family_details || {}),
        [field]: value
      }
    }));
  } else {
    setUpdatedData(prev => ({
      ...prev,
      [field]: value
    }));
  }
};

  const handleCancel = ()=>{
    setEditingSection(null);
  }

  return (
    <div>
      <Profile onChangeTab={onChangeTab}/>
      <div className="mt-4">
        <div className="d-flex about-mysleft" style={{ gap: "16px" }}>
          <h5>About Myself</h5>
          <h5 style={{ backgroundColor: "#f7f7f7" }}>
            <a
              href="#partnerPref"
              className=""
              style={{ color: "#000", textDecoration: "none" }}
            >
              Partner Preferences{" "}
              <i className="fa fa-chevron-circle-down" aria-hidden="true"></i>
            </a>
          </h5>
        </div>
        <div className="d-flex justify-content-between align-items-center border-top career-top1">
          <h6 className="mini-section-title ">
            Personality,Family Details, Career,Partner Expectations etc.
          </h6>
          {editingSection === 'description' ? (
            <div>
              <a  href="#" 
                onClick={() => handleSaveClick('description')}
                className="mini-edit-link text-primary pe-2"
              >
                Save
              </a>
              <a 
               href="#" 
                onClick={handleCancel}
                className="mini-edit-link text-primary"
              >
                Cancel
              </a>
            </div>
          ) : (
            <a 
              href="#" 
              className="mini-edit-link text-primary"
              onClick={(e) => {
                e.preventDefault();
                setEditingSection('description');
                // Initialize with current description if not already in updatedData
                if (!updatedData.profile_description) {
                  handleDataChange('description', 'profile_description', userInfo?.profile_description || "");
                }
              }}
            >
              Edit&nbsp;<i className="bi bi-caret-right-fill"></i>
            </a>
          )}
        </div>
        {editingSection === 'description' ? (
          <textarea
            className="form-control mt-2"
            value={updatedData.profile_description || userInfo?.profile_description || ""}
            onChange={(e) => handleDataChange('description', 'profile_description', e.target.value)}
            rows="4"
          />
        ) : (
          <p className="mt-2">
            {userInfo?.profile_description || "Thanks for visiting my profile. I put relationships above all. I seek a compatible life partner, someone who is understanding and has good values. Thank you for your valuable time!"}
          </p>
        )}
      </div>
      <AboutMyself 
        isEditing={editingSection === 'about'} 
        onEditClick={() => handleEditClick('about')}
        onSaveClick={() => handleSaveClick('about')}
        onCancelClick={()=> handleCancel()}
        onDataChange={(field, value) => handleDataChange('about', field, value)}
        updatedData={updatedData}
      />
      <PartnerPrefer
        onEditClick={() =>onChangeTab("partner")} 
        isEditing={editingSection === 'partner'} 
        // onEditClick={() => handleEditClick('partner')}
        onSaveClick={() => handleSaveClick('partner')}
        onCancelClick={()=> handleCancel()}
        onDataChange={(field, value) => handleDataChange('partner', field, value)}
        updatedData={updatedData}
      />
      <ContactDetails 
        isEditing={editingSection === 'contact'} 
        onEditClick={() => handleEditClick('contact')}
        onSaveClick={() => handleSaveClick('contact')}
        onCancelClick={()=> handleCancel()}
        onDataChange={(field, value) => handleDataChange('contact', field, value)}
        updatedData={updatedData}
      />
    </div>
  );
};

export default ProfileTab;