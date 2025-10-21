import React, {useState} from "react";
import AccountSetting from "../settingtabcomponents/AccountSetting";
import MyContactSetting from "../settingtabcomponents/MyContactSetting";
import ContactFilter from "../settingtabcomponents/ContactFilter";
import AstroDetails from "../settingtabcomponents/AstroDetails";
import EmailSmsAlert from "../settingtabcomponents/EmailSmsAlert";
import PrivacyOptions from "../settingtabcomponents/PrivacyOptions";
import ShadiLive from "../settingtabcomponents/ShadiLive";
import HideAndDeleteProfile from "../settingtabcomponents/HideAndDeleteProfile";
import Messages from "../settingtabcomponents/Messages";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import config from "../../../config";
import { toast } from "../../Common/Toast";
import { setUser } from "../../../features/user/userSlice";

const SettingsTab = ({onChangeTab}) => {
  const {userInfo, token} = useSelector(state=> state.user);
  const dispatch = useDispatch();
  const [editingSection, setEditingSection] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  // console.log("User Info", userInfo)

  const handleSaveClick = async (section) => {
    try {
      // Create a deep copy of the original userInfo
      const updatedUserInfo = userInfo;
      
      // Merge the updatedData with the userInfo copy
      Object.keys(updatedData).forEach(key => {
        if (section === 'about' || section === 'contact' || section === 'description') {
          // For simple fields (AboutMyself, ContactDetails and description)
          updatedUserInfo[key] = updatedData[key];
        } else if (section === 'partner') {
          // For partner preferences which is stored as JSON string
          const partnerPref = JSON.parse(updatedUserInfo.partner_preference || '{}');
          updatedUserInfo.partner_preference = JSON.stringify({
            ...partnerPref,
            ...updatedData
          });
        }
      });

      // console.log("Complete updated userInfo:", updatedUserInfo);
      
      // Prepare the data to send to the server
      const dataToSend = {
        ...updatedUserInfo,
        hobbies: updatedUserInfo.hobbies ? 
          JSON.parse(updatedUserInfo.hobbies) : null,
        family_details: updatedUserInfo.family_details ? 
          JSON.parse(updatedUserInfo.family_details) : null,
        verificationData: updatedUserInfo.verificationData ? 
          JSON.parse(updatedUserInfo.verificationData) : null
      };

      // console.log("dataToSend", dataToSend)

      // Make API call to update profile using Axios
      const response = await axios.put(`${config.baseURL}/api/profile/update`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Axios response data is in response.data - no need for .json()
      const result = response.data;

      // Handle successful update
      // console.log('Profile updated successfully:', result);
      dispatch(setUser({
        userInfo: updatedUserInfo,
        token: token, // ← do NOT change token
      }));
      
      // Update local state if needed
      setEditingSection(null);
      setUpdatedData({});

      // Show success message
      toast.success('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (show error message to user)
      toast.error(`Error updating profile: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDataChange = (field, value) => {
    // console.log(value)
    setUpdatedData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
    <div id="settings" role="tabpanel" aria-labelledby="settings-tab">
      <div className="setting-part">
        <div className="accordian-setting">
          <div className="mt-4">
            <div className="accordion" id="settingsAccordion">
              <AccountSetting userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('account_setting')} onDataChange={(field, value) => handleDataChange('account_setting', field, value)}/>
              <MyContactSetting userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('contact_settings')} onDataChange={(field, value) => handleDataChange('contact_settings', field, value)}/>
              <ContactFilter userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('contact_filter')} onDataChange={(field, value) => handleDataChange('contact_filter', field, value)}/>
              <AstroDetails userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('astro')} onDataChange={(field, value) => handleDataChange('astro', field, value)}/>
              <EmailSmsAlert userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('email_sms_alert')} onDataChange={(field, value) => handleDataChange('email_sms_alert', field, value)}/>
              <PrivacyOptions onChangeTab={onChangeTab} userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('privacy')} onDataChange={(field, value) => handleDataChange('privacy', field, value)}/>    
              <ShadiLive userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('shadi_live')} onDataChange={(field, value) => handleDataChange('shadi_live', field, value)}/>
              <HideAndDeleteProfile userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('hide_delete')} onDataChange={(field, value) => handleDataChange('hide_delete', field, value)}/>
              {/* <Messages userInfo={userInfo} token={token}  onSaveClick={() => handleSaveClick('messages')} onDataChange={(field, value) => handleDataChange('messages', field, value)}/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
