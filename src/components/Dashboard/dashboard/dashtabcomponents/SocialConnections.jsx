import React, { useState } from 'react';
import axios from 'axios';
import config from '../../../../config';
import { toast } from '../../../Common/Toast';

const SocialConnections = ({ socialAccounts, token, fetchSocialAccounts, isLinking, setIsLinking }) => {
  const [disconnecting, setDisconnecting] = useState(null);

  const isSocialVerified = Object.values(socialAccounts).some(account => account.connected);

  const handleSocialConnect = async (platform) => {
    setIsLinking(true);
    try {
      const response = await axios.post(
        `${config.baseURL}/api/social-profile/generate-auth-url`,
        { platform },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        window.location.href = response.data.authUrl;
      } else {
        toast.error('Failed to initiate social connection');
      }
    } catch (error) {
      console.error(`Error initiating ${platform} connection`, error);
      toast.error(error.response?.data?.message || `Failed to connect ${platform}`);
      setIsLinking(false);
    }
  };

  const handleSocialDisconnect = async (platform) => {
    setDisconnecting(platform);
    try {
      const response = await axios.post(
        `${config.baseURL}/api/social-profile/disconnect-social`,
        { platform },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        fetchSocialAccounts();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || 'Failed to disconnect account');
      }
    } catch (error) {
      console.error(`Error disconnecting ${platform}`, error);
      toast.error(error.response?.data?.message || `Failed to disconnect ${platform}`);
    } finally {
      setDisconnecting(null);
    }
  };

  const getPlatformIcon = (platform) => {
    const styles = {
      linkedin: { color: '#0077b5' },
      instagram: { color: '#E4405F' },
      facebook: { color: '#1877F2' }
    };
    return styles[platform] || {};
  };

  return (
    <div className="section">
      <div className="title mb-2" style={{ fontSize: '14px' }}>Connect Social Accounts</div>
      <div className="social-connections">
        {['linkedin', 'instagram', 'facebook'].map(platform => (
          <SocialConnectionItem
            key={platform}
            platform={platform}
            account={socialAccounts[platform]}
            isLinking={isLinking}
            disconnecting={disconnecting === platform}
            onConnect={handleSocialConnect}
            onDisconnect={handleSocialDisconnect}
            getPlatformIcon={getPlatformIcon}
          />
        ))}
      </div>
      {!isSocialVerified && (
        <div className="small text-muted mt-2">
          Connect at least 1 account to get Social Verified badge
        </div>
      )}
    </div>
  );
};

const SocialConnectionItem = ({ platform, account, isLinking, disconnecting, onConnect, onDisconnect, getPlatformIcon }) => (
  <div className="d-flex justify-content-between align-items-center mb-2">
    <div className="d-flex align-items-center">
      <i className={`fa fa-${platform} me-2`} style={getPlatformIcon(platform)} aria-hidden="true"></i>
      <span className="small text-capitalize">{platform}</span>
      {account.connected && (
        <span className="badge ms-2 small" style={{color:'var(--color-secondary)'}}>Connected</span>
      )}
    </div>
    {account.connected ? (
      <button 
        className="btn fw-bold text-danger btn-sm"
        onClick={() => onDisconnect(platform)}
        disabled={disconnecting}
        title='Disconnect Account'
      >
        ✕
      </button>
    ) : (
      <button 
        className="btn btn-outline-primary btn-sm"
        onClick={() => onConnect(platform)}
        disabled={isLinking}
      >
        {isLinking ? 'Connecting...' : 'Connect'}
      </button>
    )}
  </div>
);

export default SocialConnections;