import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Spinner } from "react-bootstrap";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import config from "../../../../config";
import { useSelector } from "react-redux";
import AstroDetailsModal from "./AstroDetailsModal";
import axios from "axios";

const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
  const currentUser = useSelector((state) => state.user.userInfo);
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Memoized fetch function
  const fetchCompatibilityData = useCallback(async () => {
    if (!currentUser || !profile) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${config.baseURL}/api/astro/compatibility`,
        {
          currentUserId: currentUser.user_id || currentUser.id,
          profileUserId: profile.user_id
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setCompatibilityData(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching compatibility:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, profile]);

  useEffect(() => {
    if (show) fetchCompatibilityData();
  }, [show, fetchCompatibilityData]);

  // Memoized computed values
  const { compatibilityDetails, modernDetails, displayScore, modernTotalScore, modernMaxScore } = useMemo(() => {
    const details = compatibilityData?.compatibility?.details || {};
    const isNewStructure = details.modern && details.traditional;
    
    const modern = isNewStructure ? details.modern : details;
    const totalScore = Object.values(modern || {}).reduce((acc, val) => acc + (val?.score || 0), 0);
    const maxScore = Object.values(modern || {}).reduce((acc, val) => acc + (val?.max || 0), 0);
    const modernPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const score = isNewStructure ? (details.overall || 0) : modernPercentage;

    return {
      compatibilityDetails: details,
      modernDetails: modern,
      displayScore: score,
      modernTotalScore: totalScore,
      modernMaxScore: maxScore
    };
  }, [compatibilityData]);

  const formattedDob = useMemo(() => {
    if (!profile.dob) return "**/**/****";
    const birthDate = new Date(profile.dob);
    return `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`;
  }, [profile.dob]);

  const isCompatible = compatibilityDetails.isCompatible !== undefined 
    ? compatibilityDetails.isCompatible 
    : displayScore >= 60;

  // Constants
  const ICONS = {
    Work: "/images/workCompatibility.png",
    Influence: "/images/influenceCompatibility.png",
    Destiny: "/images/destinyCompatibility.png",
    Mentality: "/images/mentalyCompatibility.png",
    Compatibility: "/images/CompatibilityCompatibility.png",
    Temperament: "/images/TemperamentCompatibility.png",
    Love: "/images/loveCompatibility.png",
    Health: "/images/healthCompatibility.png"
  };

  const TOOLTIPS = {
    rashi: "Rashi (Zodiac Sign) is the sign in which the Moon was placed at the time of your birth. It represents your mind, emotions, and inner self.",
    nakshatra: "Nakshatra (Lunar Mansion) is the constellation or star cluster that the Moon was in at your birth. It influences your personality, tendencies, and life path.",
    manglik: "Manglik Dosha is an astrological condition where Mars is placed in certain positions in the birth chart. It's believed to affect marriage compatibility.",
    horoscope: "Analyzes core astrological factors between two people to determine relationship potential. Key factors include Sun (personality), Moon (emotions), Venus (love style), and Mars (passion)"
  };

  const handleTooltipToggle = useCallback((term) => {
    setActiveTooltip(prev => prev === term ? null : term);
  }, []);

  const InfoButton = ({ term }) => (
    <div className="position-relative">
    <button 
      className="btn p-0 border-0 bg-transparent"
      onClick={() => handleTooltipToggle(term)}
      onMouseEnter={() => setActiveTooltip(term)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
    </button>
    {activeTooltip === term && (
        <div className="tooltip-box">{TOOLTIPS[term]}</div>
      )}
    </div>
  );

const Chip = ({ label, value, term, className = "" }) => (
  <div className={`chip small-muted position-relative ${className}`}>
    <div className="d-flex align-items-center">
      <span className="me-2">{label}</span> 
      <InfoButton term={term} />
    </div>
    <strong>{value || "—"}</strong>
  </div>
);

  if (!show) return null;

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="astro-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>Astro Compatibility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <div className="mt-2">Calculating compatibility...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-4 text-danger">
              Error loading compatibility: {error}
            </div>
          )}
          
          {compatibilityData && !loading && !error && (
            <div className="compatibility-page">
              <div className="compat-card">
                {/* Top section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                  <div className="gap-3">
                    <div className="avatars d-flex">
                      {[currentUser, profile].map((user, index) => (
                        <div key={user.user_id} className="avatar" style={index > 0 ? { transform: "translateX(-20px)" } : {}}>
                          <img
                            src={user.profile_image ? `${config.baseURL}/uploads/profiles/${user.profile_image}` : "/images/no-image-found.webp"}
                            alt={user.first_name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="small-muted">
                        Your Compatibility with <strong>{profile.first_name} {profile.last_name}</strong>
                      </div>
                      <div className="score d-flex justify-content-between align-items-center">
                        <span>{modernTotalScore}<span style={{ fontSize: "25px", color: "#6b6b6b" }}>/{modernMaxScore}</span></span>
                        <span className="position-relative" style={{ fontSize: "16px", paddingLeft: "10px" }}>
                          <span style={{ color: "black", display: "inline-flex", alignItems: "center" }}>
                            <span className="me-1">Horoscope</span><InfoButton term="horoscope" /> <span className="ms-1">:</span>
                          </span>
                          <span style={{ color: "#6b6b6b" }}> {displayScore}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 d-flex align-items-center justify-content-center connect-now p-2">
                    {profile.connectionRequest ? (
                      <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen} />
                    ) : (
                      <ConnectBox handleConnectClick={() => handleConnectClick(profile.user_id, profile.profileId)} />
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
                    {[
                      { label: "Time of Birth", value: currentUser.birth_time || "**:** **", col: 2 },
                      { label: "Place of Birth", value: currentUser.birth_city || "", col: 2 },
                      { label: "Manglik", value: currentUser.manglik || "Don't Know", term: "manglik", col: 2 },
                      { label: "Rashi", value: currentUser.rashi || "", term: "rashi", col: 2 },
                      { label: "Nakshatra", value: currentUser.nakshatra || "", term: "nakshatra", col: 2 }
                    ].map((item, index) => (
                      <div key={index} className={`col-6 col-md-${item.col}`}>
                        {item.term ? (
                          <Chip label={item.label} value={item.value} term={item.term} />
                        ) : (
                          <div className="chip small-muted">
                            {item.label}<br /><strong>{item.value}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compatibility details */}
                <div className="row g-4">
                  <div className="col-md-8">
                    <h4 className="AstroCompatibility">Astro Compatibility</h4>
                    <div className="left-panel flex-grow-1 p-3 bg-white rounded">
                      <div className="row gx-3 gy-4">
                        {Object.entries(modernDetails || {}).map(([key, value], idx) => {
                          const percent = value.max > 0 ? (value.score / value.max) * 100 : 0;
                          return (
                            <div className="col-3 text-center mt-3" key={idx}>
                              <div className={`progress-circle ${key.toLowerCase()} mx-auto`} style={{ "--value": percent }}>
                                <span>
                                  {ICONS[key] ? <img src={ICONS[key]} alt={key} /> : <strong>{value.score}</strong>}
                                </span>
                              </div>
                              <div className="metric">{key}</div>
                              <span>{value.score}/{value.max}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Profile birth details */}
                  <div className="col-md-4">
                    <div className="birth-card">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={profile.profile_image ? `${config.baseURL}/uploads/profiles/${profile.profile_image}` : "/images/no-image-found.webp"}
                          alt={profile.first_name}
                          style={{ width: "46px", height: "46px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
                        />
                        <div><strong>{profile.first_name}'s Birth Chart</strong></div>
                      </div>

                      <hr />
                      <div className="persondob">
                        {[
                          { label: "Date of Birth", value: formattedDob },
                          { label: "Time of Birth", value: profile.birth_time || "**:** **" }
                        ].map((item, index) => (
                          <div key={index} className="datebirh">
                            <div className={`small-muted ${index > 0 ? 'mt-2' : ''}`}><strong>{item.label}</strong></div>
                            <div>{item.value}<i className="fa fa-certificate text-danger" aria-hidden="true"></i></div>
                          </div>
                        ))}
                      </div>

                      {[
                        { label: "Place of Birth", value: profile.birth_city || "" },
                        { label: "Nakshatra", value: profile.nakshatra || "" },
                        { label: "Manglik Dosha", value: profile.manglik || "—" },
                        { label: "Rashi", value: profile.rashi || "" }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="mt-2 small-muted"><strong>{item.label}</strong></div>
                          <div>{item.value}</div>
                        </div>
                      ))}
                      
                      {currentUser.plan_status !== 'active' && (
                        <div className="small-muted mt-2">
                          <i className="fa fa-certificate" aria-hidden="true"></i>
                          These are visible only to Premium users. <a href="#">Upgrade Now</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <AstroDetailsModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        currentUser={currentUser}
      />
    </>
  );
};

export default AstroModal;



// import React, { useState, useEffect } from "react";
// import { Modal, Spinner } from "react-bootstrap";
// import ConnectBox from "./ConnectBox";
// import ContactOptions from "./ContactOptions";
// import config from "../../../../config";
// import { useSelector, useDispatch } from "react-redux";
// import AstroDetailsModal from "./AstroDetailsModal";
// import axios from "axios";

// const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
//   const currentUser = useSelector((state) => state.user.userInfo);
//   const dispatch = useDispatch();
//   const [compatibilityData, setCompatibilityData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (show && currentUser && profile) {
//       fetchCompatibilityData();
//     }
//   }, [show, currentUser, profile]);

// const fetchCompatibilityData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(`${config.baseURL}/api/astro/compatibility`, {
//         currentUserId: currentUser.user_id || currentUser.id,
//         profileUserId: profile.user_id
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (response.data.success) {
//         setCompatibilityData(response.data.data);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (err) {
//       console.error('Error fetching compatibility:', err);
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Use the fetched compatibility data instead of profile.compatibilityDetails
//   const compatibilityDetails = compatibilityData?.compatibility?.details || {};
  
//   // State for Edit Astro Detail modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   // State for tooltips
//   const [activeTooltip, setActiveTooltip] = useState(null);

//   // Parse birth details
//   const birthDate = profile.dob ? new Date(profile.dob) : null;
//   const formattedDob = birthDate
//     ? `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
//     : "**/**/****";

//   // Handle both old and new compatibility data structures
//   const isNewStructure = compatibilityDetails.modern && compatibilityDetails.traditional;
  
//   // For new structure: Get overall score
//   const horoscopeScore = isNewStructure ? (compatibilityDetails.overall || 0) : 0;
  
//   // For modern factors (both structures)
//   const modernDetails = isNewStructure ? compatibilityDetails.modern : compatibilityDetails;
  
//   // Calculate modern score
//   const modernTotalScore = Object.values(modernDetails || {}).reduce(
//     (acc, val) => acc + (val?.score || 0),
//     0
//   );
//   const modernMaxScore = Object.values(modernDetails || {}).reduce(
//     (acc, val) => acc + (val?.max || 0),
//     0
//   );
//   const modernPercentage = modernMaxScore > 0 ? Math.round((modernTotalScore / modernMaxScore) * 100) : 0;

//   // For display - use horoscope score if available, otherwise modern score
//   const displayScore = isNewStructure ? horoscopeScore : modernPercentage;
//   const isCompatible = compatibilityDetails.isCompatible !== undefined 
//     ? compatibilityDetails.isCompatible 
//     : displayScore >= 60;

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
//     manglik: "Manglik Dosha is an astrological condition where Mars is placed in certain positions in the birth chart. It's believed to affect marriage compatibility.",
//     horoscope: "Manglik Dosha is an astrological condition where Mars is placed in certain positions in the birth chart. It's believed to affect marriage compatibility."
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
//            {loading ? (
//           <div className="text-center py-4">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading compatibility...</span>
//             </Spinner>
//             <div className="mt-2">Calculating compatibility...</div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-4 text-danger">
//             Error loading compatibility: {error}
//           </div>
//         ) : compatibilityData ? (
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
//                     <div className="score d-flex justify-content-between align-items-center">
//                       <span>
//                        {modernTotalScore}
//                        <span style={{ fontSize: "25px", color: "#6b6b6b" }}>
//                          /{modernMaxScore}
//                        </span>
//                       </span>
//                        <span className="position-relative" style={{ fontSize: "16px", paddingLeft:"10px" }}><span style={{ color: "black" }}>Horoscope:</span> <span  style={{ color:"#6b6b6b" }}>{displayScore}%</span> <button 
//                         className="btn p-0 border-0 bg-transparent position-absolute"
//                         style={{ top: "0", right: "0" }}
//                         onClick={() => handleTooltipToggle("horoscope")}
//                         onMouseEnter={() => setActiveTooltip("horoscope")}
//                         onMouseLeave={() => setActiveTooltip(null)}
//                       >
//                         <i className="fa fa-info-circle text-muted" aria-hidden="true"></i>
//                       </button></span>
//                      </div>
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

//               {/* Compatibility details section */}
//               <div className="row g-4">
//                 <div className="col-md-8">
//                   <h4 className="AstroCompatibility">Astro Compatibility</h4>
//                   <div className="row">
//                     <div className="col-12 d-flex align-items-start gap-3">
//                       <div className="left-panel flex-grow-1 p-3 bg-white rounded">
//                         <div className="row gx-3 gy-4">
//                           {Object.entries(modernDetails || {}).map(([key, value], idx) => {
//                             const percent = value.max > 0 ? (value.score / value.max) * 100 : 0;
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
//           </div>) : null}
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