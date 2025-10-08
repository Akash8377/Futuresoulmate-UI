import React from 'react';
import { Link } from 'react-router-dom';
import ProfileImageWithProgress from './ProfileImageWithProgress';
import SocialConnections from './SocialConnections';
import BoostButton from '../../../Common/BoostButton';

const ProfileCard = ({ 
  userInfo, 
  completion, 
  socialAccounts, 
  onEditClick, 
  token, 
  dispatch,
  fetchSocialAccounts,
  isLinking,
  setIsLinking
}) => {
  const isSocialVerified = Object.values(socialAccounts).some(account => account.connected);

  return (
    <div className="prof-card">
      <ProfileImageWithProgress 
        userInfo={userInfo}
        completion={completion}
        token={token}
        dispatch={dispatch}
      />

      {/* User Info Section */}
      <UserInfoSection userInfo={userInfo} onEditClick={onEditClick} />

      {/* Social Verification Badge */}
      {isSocialVerified && <SocialVerificationBadge />}

      {/* Account Type */}
      <AccountTypeSection userInfo={userInfo} />

      {/* Blue Tick Verification */}
      <BlueTickSection />

      {/* Social Connections */}
      <SocialConnections 
        socialAccounts={socialAccounts}
        token={token}
        fetchSocialAccounts={fetchSocialAccounts}
        isLinking={isLinking}
        setIsLinking={setIsLinking}
      />
    </div>
  );
};

const UserInfoSection = ({ userInfo, onEditClick }) => (
  <div className="section d-flex justify-content-between align-items-center">
    <div>
      <div className="title">{userInfo?.first_name} {userInfo?.last_name}</div>
      <div className="small text-muted">{userInfo.profileId}</div>
    </div>
    <Link href="#" onClick={onEditClick} className="small fw-semibold text-decoration-none" style={{ color: '#df8525' }}>
      Edit
    </Link>
  </div>
);

const SocialVerificationBadge = () => (
  <div className="section">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex flex-column align-items-start">
        <div className='d-flex align-items-center'>
          <i className="fa fa-shield me-2" style={{ color: '#2ecc71' }} aria-hidden="true"></i>
          <div className="title" style={{ fontSize: '14px' }}>Social Verified</div>
        </div>
        <div>
          <div className="small text-muted">Trust score increased</div>
        </div>
      </div>
      <div className="check-badge">
        <i className="fa fa-check-square-o" aria-hidden="true"></i>
      </div>
    </div>
  </div>
);

const AccountTypeSection = ({ userInfo }) => (
  <div className="section">
    <div className='d-flex justify-content-between align-items-center '>
      <div className="small text-muted mb-1">Account Type:</div>
      <div className="fw-semibold" style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
        {userInfo.plan_status === "active" ? userInfo.plan_name : "Free"}
      </div>
    </div>
  </div>
);

const BlueTickSection = () => (
  <div className="section">
    <BoostButton/>
  </div>
);

export default ProfileCard;