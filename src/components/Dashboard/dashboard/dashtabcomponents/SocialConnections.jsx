import React, { useState } from 'react';
import axios from 'axios';
import config from '../../../../config';
import { toast } from '../../../Common/Toast';
import Swal from 'sweetalert2';

const SocialConnections = ({ socialAccounts, token, fetchSocialAccounts }) => {
  const [linkingPlatform, setLinkingPlatform] = useState(null);
  const [disconnecting, setDisconnecting] = useState(null);

  const isSocialVerified = Object.values(socialAccounts).some(account => account.connected);
  
  const handleSocialConnect = async (platform) => {
    setLinkingPlatform(platform);
    try {
      const response = await axios.post(
        `${config.baseURL}/api/social-profile/generate-auth-url`,
        { platform },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        console.log('Opening popup for platform:', platform);
        
        // Calculate center position for the popup
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        // Open popup window centered on screen
        const popup = window.open(
          response.data.authUrl,
          `${platform}-connect`,
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        console.log('Popup opened:', popup);

        if (!popup || popup.closed) {
          toast.error('Popup was blocked! Please allow popups for this site and try again.');
          setLinkingPlatform(null);
          return;
        }

        // Listen for message from popup
        const messageHandler = (event) => {
          console.log('Message received from popup:', event.data);
          
          // Only process messages from our own origin
          if (event.origin !== window.location.origin) {
            console.log('Ignoring message from different origin:', event.origin);
            return;
          }
          
          if (event.data.type === 'SOCIAL_CONNECTION_SUCCESS') {
            console.log('Social connection successful for:', event.data.platform);
            window.removeEventListener('message', messageHandler);
            clearInterval(timer);
            fetchSocialAccounts();
            toast.success(`${event.data.platform} connected successfully!`);
            setLinkingPlatform(null);
          } else if (event.data.type === 'SOCIAL_CONNECTION_ERROR') {
            console.log('Social connection error:', event.data.error);
            window.removeEventListener('message', messageHandler);
            clearInterval(timer);
            toast.error(`Failed to connect ${platform}: ${event.data.error}`);
            setLinkingPlatform(null);
          }
        };

        window.addEventListener('message', messageHandler);
        console.log('Message listener added');

        // Simple polling to check if popup was closed
        const timer = setInterval(() => {
          try {
            if (popup.closed) {
              console.log('Popup was closed by user');
              window.removeEventListener('message', messageHandler);
              clearInterval(timer);
              fetchSocialAccounts(); // Refresh to check if connection worked
              setLinkingPlatform(null);
            }
          } catch (error) {
            // Cross-origin error - popup navigated away, assume it's closed
            console.log('Popup likely closed due to cross-origin error');
            window.removeEventListener('message', messageHandler);
            clearInterval(timer);
            fetchSocialAccounts();
            setLinkingPlatform(null);
          }
        }, 1000);

      } else {
        toast.error('Failed to initiate social connection');
        setLinkingPlatform(null);
      }
    } catch (error) {
      console.error(`Error initiating ${platform} connection`, error);
      toast.error(error.response?.data?.message || `Failed to connect ${platform}`);
      setLinkingPlatform(null);
    }
  };

  const handleSocialDisconnect = async (platform) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to disconnect your ${platform} account?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disconnect!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

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

  return (
    <div className="section">
      <div className="title mb-2" style={{ fontSize: '14px' }}>Connect Social Accounts</div>
      <div className="social-connections">
        {['linkedin', 'facebook'].map(platform => (
          <SocialConnectionItem
            key={platform}
            platform={platform}
            account={socialAccounts[platform]}
            isLinking={linkingPlatform === platform}
            disconnecting={disconnecting === platform}
            onConnect={handleSocialConnect}
            onDisconnect={handleSocialDisconnect}
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

const SocialConnectionItem = ({ platform, account, isLinking, disconnecting, onConnect, onDisconnect }) => (
  <div className="social-connection-item d-flex justify-content-between align-items-center mb-2">
    <div className="d-flex align-items-center flex-grow-1 w-50">
      <i 
        className={`fa fa-${platform}`} 
        style={{ fontSize: '16px', width: '20px', color:"#0977af" }} 
        aria-hidden="true"
      ></i>
      <span className="small text-capitalize ms-1" style={{ fontSize: '14px', fontWeight:"500" }}>{platform}</span>
    </div>
    
    <div className="d-flex align-items-center gap-2">
      {account.connected === 1 ? (
        <span 
          className="badge small" 
          style={{
            color: 'var(--color-secondary)', 
            fontSize: '11px',
            padding: '2px 0px'
          }}
        >
          Connected
        </span>
      ) : ""}
      
      {account.connected ? (
        <button 
          className="btn p-0 border-0 bg-transparent"
          onClick={() => onDisconnect(platform)}
          disabled={disconnecting}
          title='Disconnect Account'
          style={{ 
            fontSize: '14px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '24px'
          }}
        >
          {disconnecting ? (
            <span style={{ fontSize: '12px' }}>...</span>
          ) : (
            <span className="text-danger fw-bold">✕</span>
          )}
        </button>
      ) : (
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={() => onConnect(platform)}
          disabled={isLinking || disconnecting}
          style={{ 
            fontSize: '12px',
            padding: '2px 8px',
            minWidth: '70px'
          }}
        >
          {isLinking ? '...' : 'Connect'}
        </button>
      )}
    </div>
  </div>
);

export default SocialConnections;