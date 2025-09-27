import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import config from "../../../../config";
import { useSelector, useDispatch } from "react-redux";
import AstroDetailsModal from "./AstroDetailsModal";

const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
  const currentUser = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  
  // State for Edit Astro Detail modal
  const [showEditModal, setShowEditModal] = useState(false);
  // State for tooltips
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Parse birth details
  const birthDate = profile.dob ? new Date(profile.dob) : null;
  const formattedDob = birthDate
    ? `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
    : "**/**/****";

  // Compatibility details (from backend)
  const compatibilityDetails = profile.compatibilityDetails || {};

  // Handle both old and new compatibility data structures
  const isNewStructure = compatibilityDetails.modern && compatibilityDetails.traditional;
  
  // For new structure: Get overall score
  const horoscopeScore = isNewStructure ? (compatibilityDetails.overall || 0) : 0;
  
  // For modern factors (both structures)
  const modernDetails = isNewStructure ? compatibilityDetails.modern : compatibilityDetails;
  
  // Calculate modern score
  const modernTotalScore = Object.values(modernDetails || {}).reduce(
    (acc, val) => acc + (val?.score || 0),
    0
  );
  const modernMaxScore = Object.values(modernDetails || {}).reduce(
    (acc, val) => acc + (val?.max || 0),
    0
  );
  const modernPercentage = modernMaxScore > 0 ? Math.round((modernTotalScore / modernMaxScore) * 100) : 0;

  // For display - use horoscope score if available, otherwise modern score
  const displayScore = isNewStructure ? horoscopeScore : modernPercentage;
  const isCompatible = compatibilityDetails.isCompatible !== undefined 
    ? compatibilityDetails.isCompatible 
    : displayScore >= 60;

  // Icons mapping
  const icons = {
    Work: "/images/workCompatibility.png",
    Influence: "/images/influenceCompatibility.png",
    Destiny: "/images/destinyCompatibility.png",
    Mentality: "/images/mentalyCompatibility.png",
    Compatibility: "/images/CompatibilityCompatibility.png",
    Temperament: "/images/TemperamentCompatibility.png",
    Love: "/images/loveCompatibility.png",
    Health: "/images/healthCompatibility.png"
  };

  // Tooltip content for astrological terms
  const tooltips = {
    rashi: "Rashi (Zodiac Sign) is the sign in which the Moon was placed at the time of your birth. It represents your mind, emotions, and inner self.",
    nakshatra: "Nakshatra (Lunar Mansion) is the constellation or star cluster that the Moon was in at your birth. It influences your personality, tendencies, and life path.",
    manglik: "Manglik Dosha is an astrological condition where Mars is placed in certain positions in the birth chart. It's believed to affect marriage compatibility."
  };

  const handleTooltipToggle = (term) => {
    if (activeTooltip === term) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(term);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        dialogClassName="astro-modal-width"
      >
        <Modal.Header closeButton>
          <Modal.Title>Astro Compatibility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="compatibility-page">
            <div className="compat-card">
              {/* Top section with avatars */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                <div className="gap-3">
                  <div className="avatars d-flex">
                    <div className="avatar">
                      <img
                        src={
                          currentUser.profile_image
                            ? `${config.baseURL}/uploads/profiles/${currentUser.profile_image}`
                            : "/images/no-image-found.webp"
                        }
                        alt={currentUser.first_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="avatar" style={{ transform: "translateX(-20px)" }}>
                      <img
                        src={
                          profile.profile_image
                            ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
                            : "/images/no-image-found.webp"
                        }
                        alt={profile.first_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="small-muted">
                      Your Compatibility with{" "}
                      <strong>
                        {profile.first_name} {profile.last_name}
                      </strong>
                    </div>
                    {/* <div className="score">
                      {displayScore}%
                      {isNewStructure && (
                        <span style={{ fontSize: "25px", color: "#6b6b6b", marginLeft: "10px" }}>
                          (Modern: {modernPercentage}%)
                        </span>
                      )}modernTotalScore / modernMaxScore
                    </div> */}
                    <div className="score d-flex justify-content-between align-items-center">
                      <span>
                       {modernTotalScore}
                       <span style={{ fontSize: "25px", color: "#6b6b6b" }}>
                         /{modernMaxScore}
                       </span>
                      </span>
                       <span style={{ fontSize: "16px", color: "#6b6b6b", paddingLeft:"10px" }}>Horoscope: {displayScore}%</span>
                     </div>
                    {/* <div className={`compatibility-status ${isCompatible ? 'text-success' : 'text-danger'}`}>
                      <strong>{isCompatible ? '✅ Compatible' : '❌ Not Compatible'}</strong>
                    </div> */}
                    {/* {compatibilityDetails.interpretation && (
                      <div className="interpretation small text-muted">
                        {compatibilityDetails.interpretation}
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-center connect-now p-2">
                  {profile.connectionRequest ? (
                    <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen} />
                  ) : (
                    <ConnectBox
                      handleConnectClick={() =>
                        handleConnectClick(profile.user_id, profile.profileId)
                      }
                    />
                  )}
                </div>
              </div>

              {/* User birth info */}
              <div className="bg-white p-3 rounded mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Predictions are based on your details. </strong>
                    <button
                      className="btn btn-link btn-sm"
                      style={{
                        border: "1px solid #d61962",
                        color: "#d61962",
                        padding: "0px 5px",
                        textDecoration: "none",
                        fontWeight: "600",
                        marginLeft: "10px"
                      }}
                      onClick={() => setShowEditModal(true)}
                    >
                      EDIT <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div className="mt-3 row">
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted">
                      Time of Birth<br />
                      <strong>{currentUser.birth_time || "**:** **"}</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted">
                      Place of Birth<br />
                      <strong>{currentUser.birth_city || ""}</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted position-relative">
                     <span className="me-4">Manglik</span>
                      <button 
                        className="btn p-0 border-0 bg-transparent position-absolute"
                        style={{ top: "0", right: "0" }}
                        onClick={() => handleTooltipToggle("manglik")}
                        onMouseEnter={() => setActiveTooltip("manglik")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
                      </button>
                      <br />
                      <strong>{currentUser.manglik || "Don't Know"}</strong>
                      {activeTooltip === "manglik" && (
                        <div className="tooltip-box show">
                          {tooltips.manglik}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted position-relative">
                      <span className="me-3">Rashi</span>
                      <button 
                        className="btn p-0 border-0 bg-transparent position-absolute"
                        style={{ top: "0", right: "0" }}
                        onClick={() => handleTooltipToggle("rashi")}
                        onMouseEnter={() => setActiveTooltip("rashi")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
                      </button>
                      <br />
                      <strong>{currentUser.rashi || ""}</strong>
                      {activeTooltip === "rashi" && (
                        <div className="tooltip-box show">
                          {tooltips.rashi}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted position-relative">
                      <span className="me-4">Nakshatra</span>
                      <button 
                        className="btn p-0 border-0 bg-transparent position-absolute"
                        style={{ top: "0", right: "0" }}
                        onClick={() => handleTooltipToggle("nakshatra")}
                        onMouseEnter={() => setActiveTooltip("nakshatra")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
                      </button>
                      <br />
                      <strong>{currentUser.nakshatra || ""}</strong>
                      {activeTooltip === "nakshatra" && (
                        <div className="tooltip-box show">
                          {tooltips.nakshatra}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility details section */}
              <div className="row g-4">
                <div className="col-md-8">
                  <h4 className="AstroCompatibility">Astro Compatibility</h4>
                  <div className="row">
                    <div className="col-12 d-flex align-items-start gap-3">
                      <div className="left-panel flex-grow-1 p-3 bg-white rounded">
                        <div className="row gx-3 gy-4">
                          {Object.entries(modernDetails || {}).map(([key, value], idx) => {
                            const percent = value.max > 0 ? (value.score / value.max) * 100 : 0;
                            return (
                              <div className="col-3 text-center mt-3" key={idx}>
                                <div
                                  className={`progress-circle ${key.toLowerCase()} mx-auto`}
                                  style={{ "--value": percent }}
                                >
                                  <span>
                                    {icons[key] ? (
                                      <img src={icons[key]} alt={key} />
                                    ) : (
                                      <strong>{value.score}</strong>
                                    )}
                                  </span>
                                </div>
                                <div className="metric">{key}</div>
                                <span>
                                  {value.score}/{value.max}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile birth details card */}
                <div className="col-md-4">
                  <div className="birth-card">
                    <div className="d-flex align-items-center mb-2">
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginRight: "10px"
                        }}
                      >
                        <img
                          src={
                            profile.profile_image
                              ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
                              : "/images/no-image-found.webp"
                          }
                          alt={profile.first_name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div>
                          <strong>{profile.first_name}'s Birth Chart</strong>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div className="persondob">
                      <div className="datebirh">
                        <div className="small-muted">
                          <strong>Date of Birth</strong>
                        </div>
                        <div>
                          {formattedDob}
                          <span className="text-danger">
                            <i className="fa fa-certificate" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                      <div className="datebirh">
                        <div className="mt-2 small-muted">
                          <strong>Time of Birth</strong>
                        </div>
                        <div>
                          {profile.birth_time || "**:** **"}
                          <span className="text-danger">
                            <i className="fa fa-certificate" aria-hidden="true"></i>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 small-muted">
                      <strong>Place of Birth</strong>
                    </div>
                    <div>{profile.birth_city || ""}</div>
                    <div className="mt-2 small-muted">
                      <strong>Nakshatra</strong>
                    </div>
                    <div>{profile.nakshatra || ""}</div>
                    <div className="mt-2 small-muted">
                      <strong>Manglik Dosha</strong>
                    </div>
                    <div>{profile.manglik || "—"}</div>
                    <div className="mt-2 small-muted">
                      <strong>Rashi</strong>
                    </div>
                    <div>{profile.rashi || ""}</div>
                    {currentUser.plan_status === 'active'?"":(<div className="small-muted">
                      <i className="fa fa-certificate" aria-hidden="true"></i>
                      These are visible only to Premium users.{" "}
                      <a href="#">Upgrade Now</a>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Astro Details Edit Modal */}
      <AstroDetailsModal 
        show={showEditModal} 
        onHide={() => setActiveTooltip(null) || setShowEditModal(false)} 
        currentUser={currentUser}
      />
    </>
  );
};

export default AstroModal;



// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import ConnectBox from "./ConnectBox";
// import ContactOptions from "./ContactOptions";
// import config from "../../../../config";
// import { useSelector, useDispatch } from "react-redux";
// import AstroDetailsModal from "./AstroDetailsModal";

// const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
//   const currentUser = useSelector((state) => state.user.userInfo);
//   const dispatch = useDispatch();
  
//   // State for Edit Astro Detail modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   // State for tooltips
//   const [activeTooltip, setActiveTooltip] = useState(null);

//   // Parse birth details
//   const birthDate = profile.dob ? new Date(profile.dob) : null;
//   const formattedDob = birthDate
//     ? `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
//     : "**/**/****";

//   // Compatibility details (from backend)
//   const compatibilityDetails = profile.compatibilityDetails || {};

//   // Calculate total score and max
//   const totalScore = Object.values(compatibilityDetails).reduce(
//     (acc, val) => acc + (val?.score || 0),
//     0
//   );
//   const maxScore = Object.values(compatibilityDetails).reduce(
//     (acc, val) => acc + (val?.max || 0),
//     0
//   );

//   const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

//   // Icons mapping
//   const icons = {
//     Work: "/images/workCompatibility.png",
//     Influence: "/images/influenceCompatibility.png",
//     Destiny: "/images/destinyCompatibility.png",
//     Mentality: "/images/mentalyCompatibility.png",
//     Compatibility: "/images/CompatibilityCompatibility.png",
//     Temperament: "/images/TemperamentCompatibility.png",
//     Love: "/images/loveCompatibility.png",
//     Health: "/images/healthCompatibility.png"
//   };

//   // Tooltip content for astrological terms
//   const tooltips = {
//     rashi: "Rashi (Zodiac Sign) is the sign in which the Moon was placed at the time of your birth. It represents your mind, emotions, and inner self.",
//     nakshatra: "Nakshatra (Lunar Mansion) is the constellation or star cluster that the Moon was in at your birth. It influences your personality, tendencies, and life path.",
//     manglik: "Manglik Dosha is an astrological condition where Mars is placed in certain positions in the birth chart. It's believed to affect marriage compatibility."
//   };

//   const handleTooltipToggle = (term) => {
//     if (activeTooltip === term) {
//       setActiveTooltip(null);
//     } else {
//       setActiveTooltip(term);
//     }
//   };

//   return (
//     <>
//       <Modal
//         show={show}
//         onHide={onHide}
//         size="xl"
//         centered
//         dialogClassName="astro-modal-width"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Astro Compatibility</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="compatibility-page">
//             <div className="compat-card">
//               {/* Top section with avatars */}
//               <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
//                 <div className="gap-3">
//                   <div className="avatars d-flex">
//                     <div className="avatar">
//                       <img
//                         src={
//                           currentUser.profile_image
//                             ? `${config.baseURL}/uploads/profiles/${currentUser.profile_image}`
//                             : "/images/no-image-found.webp"
//                         }
//                         alt={currentUser.first_name}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     </div>
//                     <div className="avatar" style={{ transform: "translateX(-20px)" }}>
//                       <img
//                         src={
//                           profile.profile_image
//                             ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
//                             : "/images/no-image-found.webp"
//                         }
//                         alt={profile.first_name}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-2">
//                     <div className="small-muted">
//                       Your Compatibility with{" "}
//                       <strong>
//                         {profile.first_name} {profile.last_name}
//                       </strong>
//                     </div>
//                     <div className="score">
//                       {totalScore}
//                       <span style={{ fontSize: "25px", color: "#6b6b6b" }}>
//                         /{maxScore} ({percentage}%)
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6 d-flex align-items-center justify-content-center connect-now p-2">
//                   {profile.connectionRequest ? (
//                     <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen} />
//                   ) : (
//                     <ConnectBox
//                       handleConnectClick={() =>
//                         handleConnectClick(profile.user_id, profile.profileId)
//                       }
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* User birth info */}
//               <div className="bg-white p-3 rounded mb-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Predictions are based on your details. </strong>
//                     <button
//                       className="btn btn-link btn-sm"
//                       style={{
//                         border: "1px solid #d61962",
//                         color: "#d61962",
//                         padding: "0px 5px",
//                         textDecoration: "none",
//                         fontWeight: "600",
//                         marginLeft: "10px"
//                       }}
//                       onClick={() => setShowEditModal(true)}
//                     >
//                       EDIT <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-3 row">
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted">
//                       Time of Birth<br />
//                       <strong>{currentUser.birth_time || "**:** **"}</strong>
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted">
//                       Place of Birth<br />
//                       <strong>{currentUser.birth_city || ""}</strong>
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted position-relative">
//                      <span className="me-4">Manglik</span>
//                       <button 
//                         className="btn p-0 border-0 bg-transparent position-absolute"
//                         style={{ top: "0", right: "0" }}
//                         onClick={() => handleTooltipToggle("manglik")}
//                         onMouseEnter={() => setActiveTooltip("manglik")}
//                         onMouseLeave={() => setActiveTooltip(null)}
//                       >
//                         <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
//                       </button>
//                       <br />
//                       <strong>{currentUser.manglik || "Don't Know"}</strong>
//                       {activeTooltip === "manglik" && (
//                         <div className="tooltip-box show">
//                           {tooltips.manglik}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted position-relative">
//                       <span className="me-3">Rashi</span>
//                       <button 
//                         className="btn p-0 border-0 bg-transparent position-absolute"
//                         style={{ top: "0", right: "0" }}
//                         onClick={() => handleTooltipToggle("rashi")}
//                         onMouseEnter={() => setActiveTooltip("rashi")}
//                         onMouseLeave={() => setActiveTooltip(null)}
//                       >
//                         <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
//                       </button>
//                       <br />
//                       <strong>{currentUser.rashi || ""}</strong>
//                       {activeTooltip === "rashi" && (
//                         <div className="tooltip-box show">
//                           {tooltips.rashi}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted position-relative">
//                       <span className="me-4">Nakshatra</span>
//                       <button 
//                         className="btn p-0 border-0 bg-transparent position-absolute"
//                         style={{ top: "0", right: "0" }}
//                         onClick={() => handleTooltipToggle("nakshatra")}
//                         onMouseEnter={() => setActiveTooltip("nakshatra")}
//                         onMouseLeave={() => setActiveTooltip(null)}
//                       >
//                         <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
//                       </button>
//                       <br />
//                       <strong>{currentUser.nakshatra || ""}</strong>
//                       {activeTooltip === "nakshatra" && (
//                         <div className="tooltip-box show">
//                           {tooltips.nakshatra}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Rest of the component remains the same */}
//               {/* Compatibility details section */}
//               <div className="row g-4">
//                 <div className="col-md-8">
//                   <h4 className="AstroCompatibility">Astro Compatibility</h4>
//                   <div className="row">
//                     <div className="col-12 d-flex align-items-start gap-3">
//                       <div className="left-panel flex-grow-1 p-3 bg-white rounded">
//                         <div className="row gx-3 gy-4">
//                           {Object.entries(compatibilityDetails).map(([key, value], idx) => {
//                             const percent = (value.score / value.max) * 100;
//                             return (
//                               <div className="col-3 text-center mt-3" key={idx}>
//                                 <div
//                                   className={`progress-circle ${key.toLowerCase()} mx-auto`}
//                                   style={{ "--value": percent }}
//                                 >
//                                   <span>
//                                     {icons[key] ? (
//                                       <img src={icons[key]} alt={key} />
//                                     ) : (
//                                       <strong>{value.score}</strong>
//                                     )}
//                                   </span>
//                                 </div>
//                                 <div className="metric">{key}</div>
//                                 <span>
//                                   {value.score}/{value.max}
//                                 </span>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Profile birth details card */}
//                 <div className="col-md-4">
//                   <div className="birth-card">
//                     <div className="d-flex align-items-center mb-2">
//                       <div
//                         style={{
//                           width: "46px",
//                           height: "46px",
//                           borderRadius: "50%",
//                           overflow: "hidden",
//                           marginRight: "10px"
//                         }}
//                       >
//                         <img
//                           src={
//                             profile.profile_image
//                               ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
//                               : "/images/no-image-found.webp"
//                           }
//                           alt={profile.first_name}
//                           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                         />
//                       </div>
//                       <div>
//                         <div>
//                           <strong>{profile.first_name}'s Birth Chart</strong>
//                         </div>
//                       </div>
//                     </div>

//                     <hr />
//                     <div className="persondob">
//                       <div className="datebirh">
//                         <div className="small-muted">
//                           <strong>Date of Birth</strong>
//                         </div>
//                         <div>
//                           {formattedDob}
//                           <span className="text-danger">
//                             <i className="fa fa-certificate" aria-hidden="true"></i>
//                           </span>
//                         </div>
//                       </div>
//                       <div className="datebirh">
//                         <div className="mt-2 small-muted">
//                           <strong>Time of Birth</strong>
//                         </div>
//                         <div>
//                           {profile.birth_time || "**:** **"}
//                           <span className="text-danger">
//                             <i className="fa fa-certificate" aria-hidden="true"></i>
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 small-muted">
//                       <strong>Place of Birth</strong>
//                     </div>
//                     <div>{profile.birth_city || ""}</div>
//                     <div className="mt-2 small-muted">
//                       <strong>Nakshatra</strong>
//                     </div>
//                     <div>{profile.nakshatra || ""}</div>
//                     <div className="mt-2 small-muted">
//                       <strong>Manglik Dosha</strong>
//                     </div>
//                     <div>{profile.manglik || "—"}</div>
//                     <div className="mt-2 small-muted">
//                       <strong>Rashi</strong>
//                     </div>
//                     <div>{profile.rashi || ""}</div>
//                     {currentUser.plan_status === 'active'?"":(<div className="small-muted">
//                       <i className="fa fa-certificate" aria-hidden="true"></i>
//                       These are visible only to Premium users.{" "}
//                       <a href="#">Upgrade Now</a>
//                     </div>)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* Astro Details Edit Modal */}
//       <AstroDetailsModal 
//         show={showEditModal} 
//         onHide={() => setActiveTooltip(null) || setShowEditModal(false)} 
//         currentUser={currentUser}
//       />
//     </>
//   );
// };

// export default AstroModal;
