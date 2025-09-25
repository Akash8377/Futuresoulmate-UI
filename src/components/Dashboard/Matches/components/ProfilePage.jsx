import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import config from "../../../../config";
import ProfileDetails from "./ProfileDetails";
import PartnerPreferences from "./PartnerPreferences";
import { formatLastSeen } from "../../../../utils/timeAgo";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import { toast } from "../../../Common/Toast";
import AstroModal from "./AstroModal";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ChatBox from "../../inbox/components/ChatBox";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("detailed");
  const [showAstroModal, setShowAstroModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  const { profileId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const [showChatBox, setShowChatBox] = useState(false)
  const chatBoxOpen = () =>{
    setShowChatBox(true)
  }

  // Check if profile data is available in state first
  useEffect(() => {
    if (location.state?.profile) {
      // Use the profile data from navigation state
      setProfile(location.state.profile);
    } else {
      // Fallback: fetch from API if no state data
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const { data } = await axios.get(`${config.baseURL}/api/profiles/${profileId}`);
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile", error);
          toast.error("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [profileId, location.state]);
    // Record profile visit when component mounts
  useEffect(() => {
    const recordProfileVisit = async () => {
      // Don't record if:
      // 1. User is not logged in
      // 2. User is viewing their own profile
      // 3. Profile data is not loaded yet
      if (!user || !profile || user.user_id === profile.user_id) {
        return;
      }

      try {
        await axios.post(`${config.baseURL}/api/profile-visits/visit`, {
          visitor_user_id: user.user_id,
          visited_user_id: profile.user_id,
          visitor_profile_id: user.profileId,
          visited_profile_id: profile.profileId,
        });
        
        // console.log('Profile visit recorded successfully');
      } catch (error) {
        console.error('Error recording profile visit:', error);
        // Don't show error to user - fail silently
      }
    };

    if (profile && user) {
      recordProfileVisit();
    }
  }, [profile, user]);
  
  const calculateAge = (dob) => Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
  
  const matchingRatio = useMemo(() => {
    if (!profile?.partner_preference || !user) return 0;
    
    try {
      const pref = JSON.parse(profile.partner_preference);
      const criteria = [
        { 
          check: () => {
            const [min, max] = pref.basic?.ageRange?.split("–").map(Number) || [];
            const age = calculateAge(user.dob);
            return min && max && age >= min && age <= max;
          }
        },
        { check: () => pref.basic?.maritalStatus === user.marital_status },
        { check: () => pref.community?.religion === user.religion },
        { check: () => pref.community?.motherTongue === user.mother_tongue },
        { check: () => pref.location?.country?.includes(user.country) },
        { check: () => pref.education?.qualification === user.qualification }
      ];
      return Math.round((criteria.filter(c => c.check()).length / criteria.length) * 100);
    } catch (error) {
      console.error("Error calculating matching ratio", error);
      return 0;
    }
  }, [profile, user]);

  const handleConnect = async (id, profileId) => {
    try {
      await axios.post(`${config.baseURL}/api/notifications/send`, {
        receiver_user_id: id,
        receiver_profile_id: profileId,
        sender_user_id: user?.user_id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      toast.success("Connection request sent successfully");
      
      // Update local state to show contact options
      setProfile(prev => ({ ...prev, connectionRequest: true }));
    } catch (error) {
      console.error("Error sending connection request", error);
      toast.error("Failed to send connection request");
    }
  };

  // Combine profile image with gallery images
  const getProfileImages = () => {
    if (!profile) return [];
    
    try {
      const profile_gallery_images = profile.profile_gallery_images 
        ? JSON.parse(profile.profile_gallery_images)
        : [];
      
      return [
        { id: 'profile-main', filename: profile.profile_image },
        ...profile_gallery_images
      ].filter(img => img && img.filename);
    } catch (error) {
      console.error("Error parsing gallery images", error);
      return [{ id: 'profile-main', filename: profile.profile_image }].filter(img => img.filename);
    }
  };

  const allImages = getProfileImages();

  const handleImageError = () => {
    setImageLoadError(true);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <h4>Profile Not Found</h4>
        <p>The profile you're looking for doesn't exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="profile-page">
      <div className="top-match">
        <div className="row g-0">
          {/* Left Column - Images */}
          <div className="col-md-4">
            {allImages.length > 1 ? (
              <Carousel 
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                interval={null}
                indicators={true}
              >
                {allImages.map((img, idx) => (
                  <Carousel.Item key={img.id || idx}>
                    <img
                      src={`${config.baseURL}/uploads/profiles/${img.filename}`}
                      className="d-block w-100"
                      alt={`${profile.first_name}'s profile ${idx + 1}`}
                      style={{ height: "400px", objectFit: "cover" }}
                      onError={handleImageError}
                    />
                    <div className="position-absolute bottom-0 start-0 px-2 py-1 text-white small bg-dark bg-opacity-75">
                      {`${idx + 1} of ${allImages.length}`}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="profile-img">
                <img 
                  src={profile.profile_image && !imageLoadError
                    ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
                    : "/images/no-image-found.webp"} 
                  alt={profile.first_name} 
                  className="w-100"
                  style={{ height: "400px", objectFit: "cover", objectPosition: "top" }}
                  onError={handleImageError}
                />
              </div>
            )}
            
            {/* Verified Profile Section */}
            <div className="verified-profile mt-3 p-3 bg-light rounded">
              <h4 className="h6">
                <i className="fa fa-certificate text-warning me-2" aria-hidden="true"></i> 
                Verified Profile
              </h4>
              <div className="sub-partverified">
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-1">
                    <i className="fa fa-check text-success me-2" aria-hidden="true"></i>
                    Name verified against <Link to="#" className="text-decoration-none">Govt ID</Link>
                  </li>
                  <li className="mb-0">
                    <i className="fa fa-times text-danger me-2" aria-hidden="true"></i>
                    Mobile Number Is Not Verified
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="col-md-8">
            {/* Header Bar */}
            <div className="header-bar d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
              <div className="d-flex align-items-center">
                <span className="time-label fw-bold">Profile Details</span>
              </div>
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={() => navigate(-1)}
              >
                <i className="fa fa-arrow-left me-1" aria-hidden="true"></i>
                Back
              </button>
            </div>

            {/* Profile Basic Info */}
            <div className="profile-newmatch bg-white">
              <div className="row g-0">
                <div className="col-md-9">
                  <div className="p-4">
                    <h4 className="mb-2">
                      {profile.first_name} {profile.last_name}
                      {profile.isVerified && (
                        <img 
                          src="/images/verified-badge.png" 
                          alt="Verified" 
                          className="ms-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                      )}
                    </h4>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3 small">
                      <span className={profile.online_status === "online" ? "text-success fw-bold" : "text-muted"}>
                        <i className={`fa ${profile.online_status === "online" ? "fa-circle" : "fa-clock-o"} me-1`}></i>
                        {profile.online_status === "online" 
                          ? "Online now" 
                          : `Last seen ${formatLastSeen(profile.online_status)}`}
                      </span>
                      
                      <span className="text-muted">
                        <i className="fa fa-users me-1"></i> 
                        You & {user?.looking_for === "Bride" ? "Bride" : "Groom"}
                      </span>
                      
                      <span 
                        className="text-warning cursor-pointer fw-bold"
                        onClick={() => setShowAstroModal(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa fa-globe me-1" aria-hidden="true"></i> 
                        Astro
                      </span>
                    </div>
                    
                    <hr className="my-3" />
                    
                    {/* Basic Profile Details */}
                    <div className="match-detail">
                      <div className="row text-dark">
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Age:</strong> {calculateAge(profile.dob)} years
                          </div>
                          <div className="mb-2">
                            <strong>Height:</strong> {profile.height}
                          </div>
                          <div className="mb-2">
                            <strong>Religion:</strong> {profile.religion}
                          </div>
                          <div className="mb-2">
                            <strong>Language:</strong> {profile.language || profile.mother_tongue}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2">
                            <strong>Marital Status:</strong> {profile.maritalStatus || profile.marital_status}
                          </div>
                          <div className="mb-2">
                            <strong>Location:</strong> {profile.city}, {profile.country}
                          </div>
                          <div className="mb-2">
                            <strong>Profession:</strong> {profile.profession}
                          </div>
                          <div className="mb-2">
                            <strong>Education:</strong> {profile.qualification}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Description */}
                    {profile.profile_description && (
                      <div className="mt-4">
                        <h6 className="text-muted mb-2">About Me</h6>
                        <p className="text-dark fs-6 lh-base">
                          {profile.profile_description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connect/Contact Section */}
                <div className="col-md-3 d-flex align-items-center justify-content-center connect-now p-4 bg-light">
                  {profile.connectionRequest ? (
                    <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen}/>
                  ) : (
                    <ConnectBox 
                      handleConnectClick={() => handleConnect(profile.user_id, profile.profileId)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="match-tab bg-white mt-3">
              <div className="tab-container d-flex justify-content-between align-items-center p-3 border-bottom">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === "detailed" ? "active" : ""}`}
                      onClick={() => setActiveTab("detailed")}
                    >
                      <i className="fa fa-user me-2" aria-hidden="true"></i>
                      Detailed Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === "partner" ? "active" : ""}`}
                      onClick={() => setActiveTab("partner")}
                    >
                      <i className="fa fa-heart me-2" aria-hidden="true"></i>
                      Partner Preferences
                    </button>
                  </li>
                </ul>
                
                {/* <div className="tab-icons">
                  <button className="btn btn-outline-secondary btn-sm me-2">
                    <i className="fa fa-share-alt" aria-hidden="true"></i> Share
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fa fa-print" aria-hidden="true"></i> Print
                  </button>
                </div> */}
              </div>

              <div className="tab-content p-4">
                {activeTab === "detailed" && (
                  <ProfileDetails 
                    currentProfile={profile} 
                    matchingRatio={matchingRatio} 
                  />
                )}
                {activeTab === "partner" && (
                  <PartnerPreferences 
                    currentProfile={profile} 
                    matchingRatio={matchingRatio} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Astro Modal */}
      <AstroModal 
        show={showAstroModal} 
        onHide={() => setShowAstroModal(false)} 
        profile={profile}
        handleConnectClick={() => handleConnect(profile.user_id, profile.profileId)}
        chatBoxOpen={chatBoxOpen}
      />
    </div>
    <ChatBox showChatBox={showChatBox} setShowChatBox={()=>setShowChatBox(false)}/>
    </>
  );
};

export default ProfilePage;