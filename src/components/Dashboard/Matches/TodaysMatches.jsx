import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import config from "../../../config";
import ProfileDetails from "./components/ProfileDetails";
import PartnerPreferences from "./components/PartnerPreferences";
import { formatLastSeen } from "../../../utils/timeAgo";
import ConnectBox from "./components/ConnectBox";
import ContactOptions from "./components/ContactOptions";
import { toast } from "../../Common/Toast";
import AstroModal from "./components/AstroModal";
import { Link } from "react-router-dom";

const TodaysMatches = ({chatBoxOpen}) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("detailed");
  const [countdown, setCountdown] = useState({ h: 8, m: 18, s: 37 });
  const user = useSelector((state) => state.user.userInfo);
  const searchFor = user?.looking_for === "Bride" ? "Groom" : "Bride";
  const [showAstroModal, setShowAstroModal] = useState(false);

  const fetchProfiles = async () => {
    try {
      const { data } = await axios.get(`${config.baseURL}/api/matches/new-matches`, {
        params: { user_id: user.id, looking_for: searchFor }
      });
      setProfiles(data.users || []);
    } catch (error) {
      console.error("Error fetching profiles", error);
      setProfiles([]);
    }
  };

  useEffect(() => {
    if (searchFor) fetchProfiles();
    
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      
      setCountdown({
        h: Math.floor(diff / 3.6e6),
        m: Math.floor((diff % 3.6e6) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchFor]);

  const currentProfile = profiles[currentIndex] || {};
  const nextProfile = profiles[currentIndex + 1] || {};
  const isLastProfile = currentIndex === profiles.length - 1;

  const calculateAge = (dob) => 
    Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);

  const matchingRatio = useMemo(() => {
    if (!currentProfile.partner_preference || !user) return 0;
    const pref = JSON.parse(currentProfile.partner_preference);
    const criteria = [
      { check: () => {
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
  }, [currentProfile, user]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev < profiles.length - 1 ? prev + 1 : 0));
    setActiveTab("detailed");
  };

  const handleConnect = async (id, profileId) => {
    setProfiles(prev => prev.map(p => 
      p.user_id === id ? { ...p, connectionRequest: true } : p
    ));
    try {
      await axios.post(`${config.baseURL}/api/notifications/send`, {
        receiver_user_id: id,
        receiver_profile_id: profileId,
        sender_user_id: user?.user_id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      toast.success("Request sent successfully");
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };

  if (!profiles.length) return (
    <div className="p-4">
      <h4>Today's Matches</h4>
      <p>No matches found today. Please check back later.</p>
    </div>
  );

  // Combine profile image with gallery images
  let allImages = []
  if(currentProfile.profile_gallery_images){
    allImages = [
      { id: 'main', filename: currentProfile.profile_image },
      ...(currentProfile.profile_gallery_images 
        ? JSON.parse(currentProfile.profile_gallery_images) 
        : [])
    ];
  }

  return (
    <div className="todaysmatch">
      <h2>Here are Today's Top Matches for you. Connect With Them Now!</h2>
      <div className="top-match">
        <div className="row g-0">
          <div className="col-md-4">
            {allImages.length > 0 ? (
              <Carousel interval={null}>
                {allImages.map((img, idx) => (
                  <Carousel.Item key={img.id || idx}>
                    <img
                      src={`${config.baseURL}/uploads/profiles/${img.filename}`}
                      className="d-block "
                      alt="Profile"
                      style={{width:"100%", objectFit: "cover" }}
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
                  src={currentProfile.profile_image 
                    ? `${config.baseURL}/uploads/profiles/${currentProfile.profile_image}` 
                    : "images/no-image-found.webp"} 
                  alt="Profile" 
                  className="w-100"
                  style={{ height: "300px", objectFit: "cover", objectPosition: "top", }}
                />
              </div>
            )}
            
            <div className="verified-profile mt-3">
              <h4><i className="fa fa-certificate" aria-hidden="true"></i> Verified Profile</h4>
              <div className="sub-partverified">
                <ul>
                  <li>Name verified against <Link href="">Govt ID</Link></li>
                  <li>Mobile Number Is Not Verified</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="header-bar d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="time-label">Time left to Connect</span>
                <span className="question-icon" title="Remaining time to connect">&#x3f;</span>
                <span className="countdown ms-2">
                  {String(countdown.h).padStart(2, "0")}h : {String(countdown.m).padStart(2, "0")}m : {String(countdown.s).padStart(2, "0")}s
                </span>
              </div>
              {!isLastProfile && (
                <div className="d-flex align-items-center">
                  <img
                    src={nextProfile.profile_image
                      ? `${config.baseURL}/uploads/profiles/${nextProfile.profile_image}`
                      : "images/matchesprofile.jpg"}
                    alt="Next Profile"
                    className="profile-circle"
                  />
                  <button className="next-link" onClick={handleNext}>Next &gt;</button>
                </div>
              )}
            </div>

            <div className="profile-newmatch">
              <div className="row g-0">
                <div className="col-md-9">
                  <div className="p-3">
                    <h5 className="mb-1">
                      {currentProfile.first_name} {currentProfile.last_name?.charAt(0)}.
                      <img src="images/verified-badge.png" alt="Verified" />
                    </h5>
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className={currentProfile.online_status === "online" ? "text-success" : "text-muted"}>
                        {currentProfile.online_status === "online" 
                          ? "Online now" 
                          : <><i className="fa fa-clock-o me-1"></i>{`Last seen ${formatLastSeen(currentProfile.online_status)}`}</>}
                      </span>
                      <span className="text-muted"><i className="fa fa-users"></i> You &amp; Her</span>
                      <span 
                        className="text-warning cursor-pointer"
                        onClick={() => setShowAstroModal(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa fa-globe me-1" aria-hidden="true"></i> Astro
                      </span>
                    </div>
                    <hr />
                    <div className="match-detail">
                      <div className="row text-dark mb-2">
                        <div className="col-6">
                          <div>{calculateAge(currentProfile.dob)} yrs, {currentProfile.height}</div>
                          <div>{currentProfile.religion}</div>
                        </div>
                        <div className="col-6">
                          <div>{currentProfile.marital_status}</div>
                          <div>{currentProfile.city}, {currentProfile.country}</div>
                          <div>{currentProfile.profession}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 d-flex align-items-center justify-content-center connect-now p-2">
                  {currentProfile.connectionRequest ? (
                    <ContactOptions profile={currentProfile} chatBoxOpen={chatBoxOpen}/>
                  ) : (
                    <ConnectBox handleConnectClick={() => handleConnect(currentProfile.user_id, currentProfile.profileId)} />
                  )}
                </div>
              </div>
            </div>

            <div className="match-tab">
              <div className="tab-container">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "detailed" ? "active" : ""}`}
                      onClick={() => setActiveTab("detailed")}>
                      Detailed Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === "partner" ? "active" : ""}`}
                      onClick={() => setActiveTab("partner")}>
                      Partner Preferences
                    </button>
                  </li>
                </ul>
                <div className="tab-icons px-2">
                  <i className="fa fa-share-square-o" aria-hidden="true"></i>
                  <i className="fa fa-print" aria-hidden="true"></i>
                </div>
              </div>

              <div className="tab-content pt-3">
                {activeTab === "detailed" && <ProfileDetails {...{ currentProfile, matchingRatio }} />}
                {activeTab === "partner" && <PartnerPreferences {...{ currentProfile, matchingRatio }} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Astro Modal */}
        <AstroModal 
          show={showAstroModal} 
          onHide={() => setShowAstroModal(false)} 
          profile={currentProfile}
          handleConnectClick={() => handleConnect(currentProfile.user_id, currentProfile.profileId)}
          chatBoxOpen={chatBoxOpen}
        />
    </div>
  );
};

export default TodaysMatches;