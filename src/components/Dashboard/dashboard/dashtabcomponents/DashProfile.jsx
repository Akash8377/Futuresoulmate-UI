import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../../config';
import { toast } from '../../../Common/Toast';
import axios from 'axios';
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