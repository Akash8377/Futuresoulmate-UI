import React, { useState } from "react";
import { Tab, Tabs, Carousel, Nav } from "react-bootstrap";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import verifiedBadge from "../../../assets/verified-badge.png";
import requestedPhoto from "../../../assets/request-photo.jpg";
import config from "../../../../config";
import { calculateAge } from "../../../../utils/helpers";
import { timeAgo, formatLastSeen } from "../../../../utils/timeAgo";
import { Link } from "react-router-dom";
import AstroModal from "./AstroModal" 

// const ProfileCard = ({
//   profile,
//   handleConnectClick,
//   activeIndex,
//   setActiveIndex,chatBoxOpen,
// dnaMatches=false,user={}
// }) => {
//   const handleSelect = (selectedIndex) => {
//     setActiveIndex(selectedIndex);
//   };
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   const getShortDescription = (text) => {
//     const words = text?.split(" ");
//     if (!words || words.length <= 40) return text;
//     return words.slice(0, 40).join(" ") + "...";
//   };

//   const handleToggleDescription = (e) => {
//     e.preventDefault();
//     setShowFullDescription((prev) => !prev);
//   };

//   // Parse gallery images and include profile image as first item
//   const profile_gallery_images = profile?.profile_gallery_images 
//     ? JSON.parse(profile.profile_gallery_images)
//     : [];
  
//   // Create combined images array with profile image first
//   let allImages=[]
//   if(profile_gallery_images.length>0){
//     allImages = [
//       {
//         id: 'profile-main',
//         filename: profile.profile_image
//       },
//       ...profile_gallery_images
//     ];
//   }

//   return (
//     <div className="profile-part">
//       <div className="row g-0">
//         <div className="col-md-4 position-relative">
//           {allImages.length > 0 ? (
//             <>
//               <Carousel
//                 activeIndex={activeIndex}
//                 onSelect={handleSelect}
//                 interval={null}
//               >
//                 {allImages.map((img, idx) => (
//                   <Carousel.Item key={img.id || idx}>
//                     <img
//                       src={`${config.baseURL}/uploads/profiles/${img.filename}`}
//                       className="d-block w-100"
//                       alt={`Profile ${idx + 1}`}
//                       style={{ height: "330px", objectFit: "cover" }}
//                     />
//                   </Carousel.Item>
//                 ))}
//               </Carousel>
//               <div
//                 className="position-absolute bottom-0 start-0 px-2 py-1 text-white small"
//                 style={{ background: "rgba(0,0,0,0.6)" }}
//               >
//                 {`${activeIndex + 1} of ${allImages.length}`}
//               </div>
//             </>
//           ) : (
//             // fallback to single profile image view
//             <div className="position-relative">
//               {profile.isProtected ? (
//                 // protected view
//                 <div className="profile-img">
//                   <div className="lock-img">
//                     <img
//                       src={profile.profile_image ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
//                       alt="Protected Profile"
//                       style={{ height: "330px", objectFit: "cover" }}
//                     />
//                     <div className="lock-img-text text-white">
//                       <i className="fa fa-lock me-1" aria-hidden="true"></i>
//                       Visible to Premium Members
//                       <a href="#" className="text-white ms-2">
//                         View Plans
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 // standard image
//                 <div className="profile-img-wrapper">
//                   <img
//                     src={profile.profile_image ?`${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
//                     alt="Profile"
//                     style={{ height: "330px", objectFit: "cover" }}
//                   />
//                   {profile.isNew && (
//                     <div className="new-photo position-absolute top-0 start-0 bg-warning text-white px-2 py-1 small">
//                       New
//                     </div>
//                   )}
//                   {profile.image === requestedPhoto && (
//                     <div
//                       className="request-photonew position-absolute bottom-0 start-0 w-100 text-center py-2"
//                       style={{
//                         backgroundColor: "#b10f62",
//                         color: "white",
//                         fontWeight: "600",
//                       }}
//                     >
//                       Request Photo
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="col-md-6">
//           <div className="p-3">
//             <h5 className="mb-1 d-flex justify-content-between align-items-center">
//               <span>
//               {profile.first_name} {profile.last_name}
//               {profile.isVerified && (
//                 <img
//                   src={verifiedBadge}
//                   alt="Verified"
//                   className="ms-2"
//                   style={{ width: "20px", height: "20px" }}
//                 />
//               )}</span>
//               {dnaMatches && (
//                 <span className={`hla-score ${
//                   profile.hla_compatibility === "Excellent" ? "text-success" :
//                   profile.hla_compatibility === "Good" ? "text-warning" :
//                   "text-danger"
//                 }`} title={`${profile.hla_compatibility}`}>{`HLA ${profile.hla_percentage}%`}
//                 </span>
//               )}
//             </h5>
//             <div className="d-flex gap-3 mb-2 small">
//               {profile.online ? (
//                 <span className="text-success">
//                   <i className="fa fa-phone me-1" aria-hidden="true"></i>
//                   Online now
//                 </span>
//               ) : (
//                 <span className="text-muted">
//                   {profile.online_status === "online"? (<span className="text-success" >Online now</span>):(<><i className="fa fa-clock-o me-1" aria-hidden="true"></i>{`Last seen ${formatLastSeen(profile.online_status)}`}</>)}
//                 </span>
//               )}
//               <span className="text-muted">
//                 <i className="fa fa-users me-1" aria-hidden="true"></i> You &
//                 Her
//               </span>
//               <span className="text-warning">
//                 <i className="fa fa-globe me-1" aria-hidden="true"></i> Astro
//               </span>
//             </div>
//             <hr />
//             <div className="profile-detail">
//               <div className="row text-dark mb-2">
//                 <div className="col-6">
//                   <div>
//                     <div>
//                       {calculateAge(
//                         profile.birth_year,
//                         profile.birth_month,
//                         profile.birth_day
//                       )}{" "}
//                       yrs, {profile.height}
//                     </div>
//                   </div>
//                   <div>
//                     {profile.religion}
//                   </div>
//                   <div>{profile.language}</div>
//                 </div>
//                 <div className="col-6">
//                   <div>{profile.maritalStatus}</div>
//                   <div>{profile.location}</div>
//                   <div>{profile.profession}</div>
//                 </div>
//               </div>
//             </div>
//                       {!dnaMatches ? (<p className="mb-0 text-dark fs-6">
//             {showFullDescription || profile.profile_description?.split(" ").length <= 40
//               ? profile.profile_description
//               : getShortDescription(profile.profile_description)}
//             {profile.profile_description?.split(" ").length > 40 && (
//               <a href="#" className="text-primary ms-1" onClick={handleToggleDescription}>
//                 {showFullDescription ? "Less" : "More"}
//               </a>
//             )}
//           </p>):(<div className="personality-data">
//               <Link to="/gentics-biological-attraction" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
//               <div className="pill personality-pill">
//                 <span className="color-primary text-uppercase">GENETICS : Biological Attraction</span>
//               </div>
//               </Link>
//               <Link to="/gentics-psychological-compatibility" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
//               <div className="pill personality-pill">
//                 <span className="color-primary text-uppercase">GENETICS : Psychological Compatibility</span>
//               </div>
//               </Link>
//               <Link  to="/gentics-birth-defect-risk" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
//               <div className="pill personality-pill">
//                 <span className="color-primary text-uppercase">GENETICS : Birth Defects &amp; Health Risks</span>
//               </div>
//               </Link></div>)}
//           </div>
//         </div>
//         <div className="col-md-2 d-flex align-items-center justify-content-center connect-now p-2">
//           {profile.connectionRequest ? (
//             <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen}/>
//           ) : (
//             <ConnectBox
//               handleConnectClick={() => handleConnectClick(profile.user_id, profile.profileId)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// Updated ProfileCard component

const ProfileCard = ({
  profile,
  handleConnectClick,
  activeIndex,
  setActiveIndex,
  chatBoxOpen,
  dnaMatches = false,
  user = {}
}) => {
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAstroModal, setShowAstroModal] = useState(false);

  const getShortDescription = (text) => {
    const words = text?.split(" ");
    if (!words || words.length <= 40) return text;
    return words.slice(0, 40).join(" ") + "...";
  };

  const handleToggleDescription = (e) => {
    e.preventDefault();
    setShowFullDescription((prev) => !prev);
  };

  // Parse gallery images and include profile image as first item
  const profile_gallery_images = profile?.profile_gallery_images 
    ? JSON.parse(profile.profile_gallery_images)
    : [];
  
  // Create combined images array with profile image first
  let allImages = [];
  if (profile_gallery_images.length > 0) {
    allImages = [
      {
        id: 'profile-main',
        filename: profile.profile_image
      },
      ...profile_gallery_images
    ];
  }

  return (
    <>
      <div className="profile-part">
        <div className="row g-0">
          <div className="col-md-4 position-relative">
            {allImages.length > 0 ? (
              <>
                <Carousel
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                  interval={null}
                >
                  {allImages.map((img, idx) => (
                    <Carousel.Item key={img.id || idx}>
                      <img
                        src={`${config.baseURL}/uploads/profiles/${img.filename}`}
                        className="d-block w-100"
                        alt={`Profile ${idx + 1}`}
                        style={{ height: "330px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <div
                  className="position-absolute bottom-0 start-0 px-2 py-1 text-white small"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  {`${activeIndex + 1} of ${allImages.length}`}
                </div>
              </>
            ) : (
              // fallback to single profile image view
              <div className="position-relative">
                {profile.isProtected ? (
                  // protected view
                  <div className="profile-img">
                    <div className="lock-img">
                      <img
                        src={profile.profile_image ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
                        alt="Protected Profile"
                        style={{ height: "330px", objectFit: "cover" }}
                      />
                      <div className="lock-img-text text-white">
                        <i className="fa fa-lock me-1" aria-hidden="true"></i>
                        Visible to Premium Members
                        <a href="#" className="text-white ms-2">
                          View Plans
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  // standard image
                  <div className="profile-img-wrapper">
                    <img
                      src={profile.profile_image ?`${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
                      alt="Profile"
                      style={{ height: "330px", objectFit: "cover" }}
                    />
                    {profile.isNew && (
                      <div className="new-photo position-absolute top-0 start-0 bg-warning text-white px-2 py-1 small">
                        New
                      </div>
                    )}
                    {profile.image === requestedPhoto && (
                      <div
                        className="request-photonew position-absolute bottom-0 start-0 w-100 text-center py-2"
                        style={{
                          backgroundColor: "#b10f62",
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        Request Photo
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="p-3">
              <h5 className="mb-1 d-flex justify-content-between align-items-center">
                <span>
                {profile.first_name} {profile.last_name}
                {profile.isVerified && (
                  <img
                    src={verifiedBadge}
                    alt="Verified"
                    className="ms-2"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}</span>
                {dnaMatches && (
                  <span className={`hla-score ${
                    profile.hla_compatibility === "Excellent" ? "text-success" :
                    profile.hla_compatibility === "Good" ? "text-warning" :
                    "text-danger"
                  }`} title={`${profile.hla_compatibility}`}>{`HLA ${profile.hla_percentage}%`}
                  </span>
                )}
              </h5>
              <div className="d-flex gap-3 mb-2 small">
                {profile.online ? (
                  <span className="text-success">
                    <i className="fa fa-phone me-1" aria-hidden="true"></i>
                    Online now
                  </span>
                ) : (
                  <span className="text-muted">
                    {profile.online_status === "online"? (<span className="text-success" >Online now</span>):(<><i className="fa fa-clock-o me-1" aria-hidden="true"></i>{`${formatLastSeen(profile.online_status)}`}</>)}
                  </span>
                )}
                <span className="text-muted">
                  <i className="fa fa-users me-1" aria-hidden="true"></i> You &
                  Her
                </span>
                <span 
                  className="text-warning cursor-pointer"
                  onClick={() => setShowAstroModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-globe me-1" aria-hidden="true"></i> Astro
                </span>
              </div>
              <hr />
              <div className="profile-detail">
                <div className="row text-dark mb-2">
                  <div className="col-6">
                    <div>
                      <div>
                        {calculateAge(
                          profile.birth_year,
                          profile.birth_month,
                          profile.birth_day
                        )}{" "}
                        yrs, {profile.height}
                      </div>
                    </div>
                    <div>
                      {profile.religion}
                    </div>
                    <div>{profile.language}</div>
                  </div>
                  <div className="col-6">
                    <div>{profile.maritalStatus}</div>
                    <div>{profile.location}</div>
                    <div>{profile.profession}</div>
                  </div>
                </div>
              </div>
                        {!dnaMatches ? (<p className="mb-0 text-dark fs-6">
              {showFullDescription || profile.profile_description?.split(" ").length <= 40
                ? profile.profile_description
                : getShortDescription(profile.profile_description)}
              {profile.profile_description?.split(" ").length > 40 && (
                <a href="#" className="text-primary ms-1" onClick={handleToggleDescription}>
                  {showFullDescription ? "Less" : "More"}
                </a>
              )}
            </p>):(<div className="personality-data">
                <Link to="/gentics-biological-attraction" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
                <div className="pill personality-pill">
                  <span className="color-primary text-uppercase">GENETICS : Biological Attraction</span>
                </div>
                </Link>
                <Link to="/gentics-psychological-compatibility" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
                <div className="pill personality-pill">
                  <span className="color-primary text-uppercase">GENETICS : Psychological Compatibility</span>
                </div>
                </Link>
                <Link  to="/gentics-birth-defect-risk" state={{ userProfile: user, selectedProfile: profile }} data-discover="true">
                <div className="pill personality-pill">
                  <span className="color-primary text-uppercase">GENETICS : Birth Defects &amp; Health Risks</span>
                </div>
                </Link></div>)}
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-center justify-content-center connect-now p-2">
            {profile.connectionRequest ? (
              <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen}/>
            ) : (
              <ConnectBox
                handleConnectClick={() => handleConnectClick(profile.user_id, profile.profileId)}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Astro Modal */}
      <AstroModal 
        show={showAstroModal} 
        onHide={() => setShowAstroModal(false)} 
        profile={profile}
        currentUser={user}
        handleConnectClick={handleConnectClick}
        chatBoxOpen={chatBoxOpen}
      />
    </>
  );
};

export default ProfileCard;