import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import config from "../../../../config";
import { useSelector, useDispatch } from "react-redux";
import AstroDetailsModal from "./AstroDetailsModal"; // New component for editing

const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
  const currentUser = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  
  // State for Edit Astro Detail modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Parse birth details
  const birthDate = profile.dob ? new Date(profile.dob) : null;
  const formattedDob = birthDate
    ? `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
    : "**/**/****";

  // Compatibility details (from backend)
  const compatibilityDetails = profile.compatibilityDetails || {};

  // Calculate total score and max
  const totalScore = Object.values(compatibilityDetails).reduce(
    (acc, val) => acc + (val?.score || 0),
    0
  );
  const maxScore = Object.values(compatibilityDetails).reduce(
    (acc, val) => acc + (val?.max || 0),
    0
  );

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

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
                    <div className="score">
                      {totalScore}
                      <span style={{ fontSize: "25px", color: "#6b6b6b" }}>
                        /{maxScore} ({percentage}%)
                      </span>
                    </div>
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
                      <strong>{currentUser.birth_city || "Unknown"}</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted">
                      Manglik<br />
                      <strong>{currentUser.manglik || "Don't Know"}</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted">
                      Rashi<br />
                      <strong>{currentUser.rashi || "Unknown"}</strong>
                    </div>
                  </div>
                  <div className="col-6 col-md-2">
                    <div className="chip small-muted">
                      Nakshatra<br />
                      <strong>{currentUser.nakshatra || "Unknown"}</strong>
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
                          {Object.entries(compatibilityDetails).map(([key, value], idx) => {
                            const percent = (value.score / value.max) * 100;
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
                    <div>{profile.birth_city || "Unknown"}</div>
                    <div className="mt-2 small-muted">
                      <strong>Nakshatra</strong>
                    </div>
                    <div>{profile.nakshatra || "Unknown"}</div>
                    <div className="mt-2 small-muted">
                      <strong>Manglik Dosha</strong>
                    </div>
                    <div>{profile.manglik || "—"}</div>
                    <div className="mt-2 small-muted">
                      <strong>Rashi</strong>
                    </div>
                    <div>{profile.rashi || "Unknown"}</div>
                    <div className="small-muted">
                      <i className="fa fa-certificate" aria-hidden="true"></i>
                      These are visible only to Premium users.{" "}
                      <a href="#">Upgrade Now</a>
                    </div>
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
        onHide={() => setShowEditModal(false)} 
        currentUser={currentUser}
      />
    </>
  );
};

export default AstroModal;



// import React from "react";
// import { Modal } from "react-bootstrap";
// import ConnectBox from "./ConnectBox";
// import ContactOptions from "./ContactOptions";
// import config from "../../../../config";
// import { useSelector } from "react-redux";

// const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
//   const currentUser = useSelector((state) => state.user.userInfo);

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

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="xl"
//       centered
//       dialogClassName="astro-modal-width"
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>Astro Compatibility</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="compatibility-page">
//           <div className="compat-card">
//             {/* Top section with avatars */}
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
//               <div className="gap-3">
//                 <div className="avatars d-flex">
//                   <div className="avatar">
//                     <img
//                       src={
//                         currentUser.profile_image
//                           ? `${config.baseURL}/uploads/profiles/${currentUser.profile_image}`
//                           : "/images/no-image-found.webp"
//                       }
//                       alt={currentUser.first_name}
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   </div>
//                   <div className="avatar" style={{ transform: "translateX(-20px)" }}>
//                     <img
//                       src={
//                         profile.profile_image
//                           ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
//                           : "/images/no-image-found.webp"
//                       }
//                       alt={profile.first_name}
//                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <div className="small-muted">
//                     Your Compatibility with{" "}
//                     <strong>
//                       {profile.first_name} {profile.last_name}
//                     </strong>
//                   </div>
//                   <div className="score">
//                     {totalScore}
//                     <span style={{ fontSize: "25px", color: "#6b6b6b" }}>
//                       /{maxScore} ({percentage}%)
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-6 d-flex align-items-center justify-content-center connect-now p-2">
//                 {profile.connectionRequest ? (
//                   <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen} />
//                 ) : (
//                   <ConnectBox
//                     handleConnectClick={() =>
//                       handleConnectClick(profile.user_id, profile.profileId)
//                     }
//                   />
//                 )}
//               </div>
//             </div>

//             {/* User birth info */}
//             <div className="bg-white p-3 rounded mb-3">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>Predictions are based on your details. </strong>
//                   <button
//                     className="btn btn-link btn-sm"
//                     style={{
//                       border: "1px solid #d61962",
//                       color: "#d61962",
//                       padding: "0px 5px",
//                       textDecoration: "none",
//                       fontWeight: "600",
//                       marginLeft: "10px"
//                     }}
//                   >
//                     EDIT <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-3 row">
//                 <div className="col-6 col-md-2">
//                   <div className="chip small-muted">
//                     Time of Birth<br />
//                     <strong>{currentUser.birth_time || "**:** **"}</strong>
//                   </div>
//                 </div>
//                 <div className="col-6 col-md-2">
//                   <div className="chip small-muted">
//                     Place of Birth<br />
//                     <strong>{currentUser.birth_city || "Unknown"}</strong>
//                   </div>
//                 </div>
//                 <div className="col-6 col-md-2">
//                   <div className="chip small-muted">
//                     Manglik<br />
//                     <strong>{currentUser.manglik || "Don't Know"}</strong>
//                   </div>
//                 </div>
//                 <div className="col-6 col-md-2">
//                   <div className="chip small-muted">
//                     Rashi<br />
//                     <strong>{currentUser.rashi || "Unknown"}</strong>
//                   </div>
//                 </div>
//                 <div className="col-6 col-md-2">
//                   <div className="chip small-muted">
//                     Nakshatra<br />
//                     <strong>{currentUser.nakshatra || "Unknown"}</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Compatibility details section */}
//             <div className="row g-4">
//               <div className="col-md-8">
//                 <h4 className="AstroCompatibility">Astro Compatibility</h4>
//                 <div className="row">
//                   <div className="col-12 d-flex align-items-start gap-3">
//                     <div className="left-panel flex-grow-1 p-3 bg-white rounded">
//                       <div className="row gx-3 gy-4">
//                         {Object.entries(compatibilityDetails).map(([key, value], idx) => {
//                           const percent = (value.score / value.max) * 100;
//                           return (
//                             <div className="col-3 text-center mt-3" key={idx}>
//                               <div
//                                 className={`progress-circle ${key.toLowerCase()} mx-auto`}
//                                 style={{ "--value": percent }}
//                               >
//                                 <span>
//                                   {icons[key] ? (
//                                     <img src={icons[key]} alt={key} />
//                                   ) : (
//                                     <strong>{value.score}</strong>
//                                   )}
//                                 </span>
//                               </div>
//                               <div className="metric">{key}</div>
//                               <span>
//                                 {value.score}/{value.max}
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile birth details card */}
//               <div className="col-md-4">
//                 <div className="birth-card">
//                   <div className="d-flex align-items-center mb-2">
//                     <div
//                       style={{
//                         width: "46px",
//                         height: "46px",
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                         marginRight: "10px"
//                       }}
//                     >
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
//                     <div>
//                       <div>
//                         <strong>{profile.first_name}'s Birth Chart</strong>
//                       </div>
//                     </div>
//                   </div>

//                   <hr />
//                   <div className="persondob">
//                     <div className="datebirh">
//                       <div className="small-muted">
//                         <strong>Date of Birth</strong>
//                       </div>
//                       <div>
//                         {formattedDob}
//                         <span className="text-danger">
//                           <i className="fa fa-certificate" aria-hidden="true"></i>
//                         </span>
//                       </div>
//                     </div>
//                     <div className="datebirh">
//                       <div className="mt-2 small-muted">
//                         <strong>Time of Birth</strong>
//                       </div>
//                       <div>
//                         {profile.birth_time || "**:** **"}
//                         <span className="text-danger">
//                           <i className="fa fa-certificate" aria-hidden="true"></i>
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-3 small-muted">
//                     <strong>Place of Birth</strong>
//                   </div>
//                   <div>{profile.birth_city || "Unknown"}</div>
//                   <div className="mt-2 small-muted">
//                     <strong>Nakshatra</strong>
//                   </div>
//                   <div>{profile.nakshatra || "Unknown"}</div>
//                   <div className="mt-2 small-muted">
//                     <strong>Manglik Dosha</strong>
//                   </div>
//                   <div>{profile.manglik || "—"}</div>
//                   <div className="mt-2 small-muted">
//                     <strong>Rashi</strong>
//                   </div>
//                   <div>{profile.rashi || "Unknown"}</div>
//                   <div className="small-muted">
//                     <i className="fa fa-certificate" aria-hidden="true"></i>
//                     These are visible only to Premium users.{" "}
//                     <a href="#">Upgrade Now</a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AstroModal;




// import React, { useState, useEffect } from "react";
// import { Tab, Tabs, Carousel, Nav, Modal } from "react-bootstrap";
// import ConnectBox from "./ConnectBox";
// import ContactOptions from "./ContactOptions";
// import verifiedBadge from "../../../assets/verified-badge.png";
// import requestedPhoto from "../../../assets/request-photo.jpg";
// import config from "../../../../config";
// import { calculateAge } from "../../../../utils/helpers";
// import { timeAgo, formatLastSeen } from "../../../../utils/timeAgo";
// import { Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import axios from 'axios';
// import { RASHI_OPTIONS, NAKSHATRA_OPTIONS, MANGLIK_OPTIONS } from '../../../../constants/formData';
// import { setUser } from '../../../../features/user/userSlice';
// import { toast } from "../../../Common/Toast";

// // New AstroModal component
// const AstroModal = ({ show, onHide, profile, handleConnectClick, chatBoxOpen }) => {
//   const currentUser = useSelector(state => state.user.userInfo);
//   const token = useSelector(state => state.user.token);
//   const dispatch = useDispatch();
  
//   // State for Edit Astro Detail modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [formData, setFormData] = useState({
//     birth_time: currentUser?.birth_time || "08:00",
//     birth_city: currentUser?.birth_city || "",
//     manglik: currentUser?.manglik || "DontKnow",
//     nakshatra: currentUser?.nakshatra || NAKSHATRA_OPTIONS[1].key,
//     rashi: currentUser?.rashi || RASHI_OPTIONS[0].key
//   });

//   // Calculate compatibility score (this would ideally come from your API)
//   const compatibilityScore = profile.compatibilityScore || 0;
//   const maxScore = 100;
  
//   // Parse birth details
//   const birthDate = profile.dob ? new Date(profile.dob) : null;
//   const formattedDob = birthDate 
//     ? `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
//     : "**/**/****";

//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         birth_time: currentUser?.birth_time || "08:00",
//         birth_city: currentUser?.birth_city || "",
//         manglik: currentUser?.manglik || "DontKnow",
//         nakshatra: currentUser?.nakshatra || NAKSHATRA_OPTIONS[1].key,
//         rashi: currentUser?.rashi || RASHI_OPTIONS[0].key
//       });
//     }
//   }, [currentUser]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRadioChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (type, data) => {
//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");
      
//       await axios.put(`${config.baseURL}/api/profile/astro-details`, data, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const updatedUser = { ...currentUser, ...data };
//       dispatch(setUser({ userInfo: updatedUser, token }));
//       setShowEditModal(false);
      
//       setSuccess("Astro details updated successfully!");
//       setTimeout(() => setSuccess(""), 2000);
//       toast.success("Astro details updated successfully!")
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update astro details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderRadioGroup = (name, options) => (
//     <div className="toggle-group">
//       {options.map((option) => (
//         <label key={option.key} className="custom-radio">
//           <input
//             type="radio"
//             name={name}
//             checked={formData[name] === option.key}
//             onChange={() => handleRadioChange(name, option.key)}
//           />
//           <span className="switch-label">{option.label}</span>
//         </label>
//       ))}
//     </div>
//   );

//   return (
//     <>
//       <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="astro-modal-width" >
//         <Modal.Header closeButton>
//           <Modal.Title>Astro Compatibility</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="compatibility-page">
//             <div className="compat-card">
//               <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
//                 <div className="d-flex align-items-center gap-3">
//                   <div className="avatars">
//                     <div className="avatar">
//                       <img 
//                         src={currentUser.profile_image 
//                           ? `${config.baseURL}/uploads/profiles/${currentUser.profile_image}`
//                           : "/images/no-image-found.webp"} 
//                         alt={currentUser.first_name}
//                         style={{width: "100%", height: "100%", objectFit: "cover"}}
//                       />
//                     </div>
//                     <div className="avatar" style={{transform: "translateX(-20px)"}}>
//                       <img 
//                         src={profile.profile_image 
//                           ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
//                           : "/images/no-image-found.webp"} 
//                         alt={profile.first_name}
//                         style={{width: "100%", height: "100%", objectFit: "cover"}}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="small-muted">
//                       Your Compatibility with <strong>{profile.first_name} {profile.last_name}</strong>
//                     </div>
//                     <div className="score">
//                       {compatibilityScore}<span style={{fontSize: "18px", color: "#6b6b6b"}}>/{maxScore}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-3 d-flex align-items-center justify-content-center connect-now p-2">
//                     {profile.connectionRequest ? (
//                     <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen}/>
//                     ) : (
//                     <ConnectBox
//                         handleConnectClick={() => handleConnectClick(profile.user_id, profile.profileId)}
//                     />
//                     )}
//                 </div>
//               </div>

//               <div className="bg-white p-3 rounded mb-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <strong>Predictions are based on your details.</strong>
//                     <button 
//                       className="btn btn-link btn-sm" 
//                       style={{border: "1px solid #d61962", color: "#d61962", padding: "0px 5px 0px 5px", textDecoration: "none", fontWeight: "600"}}
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
//                       <strong>{currentUser.birth_city || "Unknown"}</strong>
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted">
//                       Manglik<br />
//                       <strong>{currentUser.manglik || "Don't Know"}</strong>
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted">
//                       Rashi<br />
//                       <strong>{currentUser.rashi || "Unknown"}</strong>
//                     </div>
//                   </div>
//                   <div className="col-6 col-md-2">
//                     <div className="chip small-muted">
//                       Nakshatra<br />
//                       <strong>{currentUser.nakshatra || "Unknown"}</strong>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="row g-4">
//                 <div className="col-md-8">
//                   <div className="row">
//                     <div className="col-12 d-flex align-items-start gap-3">
//                       <div className="left-panel flex-grow-1 p-3 bg-white rounded">
//                         <div className="row gx-3 gy-4">
//                           {/* Circular metrics - these would ideally come from API */}
//                           <div className="col-3 text-center">
//                             <div className="progress-circle work mx-auto" style={{"--value": 100}}>
//                               <span><img src="/images/workCompatibility.png" alt="Work" /></span>
//                             </div>
//                             <div className="metric">Work</div>
//                             <span>1/1</span>
//                           </div>

//                           <div className="col-3 text-center">
//                             <div className="progress-circle influence mx-auto" style={{"--value": 25}}>
//                               <span><img src="/images/influenceCompatibility.png" alt="Influence" /></span>
//                             </div>
//                             <div className="metric">Influence</div>
//                             <span>0.5/2</span>
//                           </div>

//                           <div className="col-3 text-center">
//                             <div className="progress-circle destiny mx-auto" style={{"--value": 100}}>
//                               <span><img src="/images/destinyCompatibility.png" alt="Destiny" /></span>
//                             </div>
//                             <div className="metric">Destiny</div>
//                             <span>3/3</span>
//                           </div>

//                           <div className="col-3 text-center">
//                             <div className="progress-circle mentality mx-auto" style={{"--value": 25}}>
//                               <span><img src="/images/mentalyCompatibility.png" alt="Mentality" /></span>
//                             </div>
//                             <div className="metric">Mentality</div>
//                             <span>1/4</span>
//                           </div>

//                           <div className="col-3 text-center mt-3">
//                             <div className="progress-circle compat mx-auto" style={{"--value": 100}}>
//                               <span><img src="/images/CompatibilityCompatibility.png" alt="Compatibility" /></span>
//                             </div>
//                             <div className="metric">Compatibility</div>
//                             <span>5/5</span>
//                           </div>

//                           <div className="col-3 text-center mt-3">
//                             <div className="progress-circle temper mx-auto" style={{"--value": 0}}>
//                               <span><img src="/images/TemperamentCompatibility.png" alt="Temperament" /></span>
//                             </div>
//                             <div className="metric">Temperament</div>
//                             <span>0/6</span>
//                           </div>

//                           <div className="col-3 text-center mt-3">
//                             <div className="progress-circle love mx-auto" style={{"--value": 100}}>
//                               <span><img src="/images/loveCompatibility.png" alt="Love" /></span>
//                             </div>
//                             <div className="metric">Love</div>
//                             <span>7/7</span>
//                           </div>

//                           <div className="col-3 text-center mt-3">
//                             <div className="progress-circle health mx-auto" style={{"--value": 100}}>
//                               <span>8/8</span>
//                             </div>
//                             <div className="metric">Health</div>
//                             <span>8/8</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-4">
//                   <div className="birth-card">
//                     <div className="d-flex align-items-center mb-2">
//                       <div style={{width: "46px", height: "46px", borderRadius: "50%", overflow: "hidden", marginRight: "10px"}}>
//                         <img 
//                           src={profile.profile_image 
//                             ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`
//                             : "/images/no-image-found.webp"} 
//                           alt={profile.first_name}
//                           style={{width: "100%", height: "100%", objectFit: "cover"}}
//                         />
//                       </div>
//                       <div>
//                         <div><strong>{profile.first_name}'s Birth Chart</strong></div>
//                       </div>
//                     </div>

//                     <hr />
//                     <div className="persondob">
//                       <div className="datebirh"> 
//                         <div className="small-muted"><strong>Date of Birth</strong></div>
//                         <div>
//                           {formattedDob} 
//                           <span className="text-danger">
//                             <i className="fa fa-certificate" aria-hidden="true"></i>
//                           </span>
//                         </div>
//                       </div>
//                       <div className="datebirh">
//                         <div className="mt-2 small-muted"><strong>Time of Birth</strong></div>
//                         <div>
//                           {profile.birth_time || "**:** **"} 
//                           <span className="text-danger">
//                             <i className="fa fa-certificate" aria-hidden="true"></i>
//                           </span>
//                         </div>
//                       </div>
//                     </div> 

//                     <div className="mt-3 small-muted"><strong>Place of Birth</strong></div>
//                     <div>{profile.birth_city || "Unknown"}</div>
//                     <div className="mt-2 small-muted"><strong>Nakshatra</strong></div>
//                     <div>{profile.nakshatra || "Unknown"}</div>
//                     <div className="mt-2 small-muted"><strong>Manglik Dosha</strong></div>
//                     <div>{profile.manglik || "—"}</div>
//                     <div className="mt-2 small-muted"><strong>Rashi</strong></div>
//                     <div>{profile.rashi || "Unknown"}</div>
//                     <div className="small-muted">
//                       <i className="fa fa-certificate" aria-hidden="true"></i>
//                       These are visible only to Premium users. <a href="#">Upgrade Now</a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Astro Detail Modal */}
//       <Modal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         backdrop="static"
//         keyboard={false}
//         centered
//         size="lg"
//         className="letsbeginmodal"
//         style={{ zIndex: 9999 }}
//       >
//         <Modal.Header>
//           <h5 className="modal-title" id="editModalLabel">
//             Edit Astro Details
//           </h5>
//           <button
//             type="button"
//             onClick={() => setShowEditModal(false)}
//             className="btn-close"
//             aria-label="Close"
//           ></button>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="astro-detail-form p-2" style={{maxHeight:"60vh"}}>
//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}
            
//             <div className="row mb-3">
//               <div className="col">
//                 <label htmlFor="timeOfBirth" className="form-label">
//                   Time of Birth
//                 </label>
//                 <input
//                   type="time"
//                   className="form-control"
//                   id="timeOfBirth"
//                   name="birth_time"
//                   value={formData.birth_time}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="col">
//                 <label htmlFor="placeOfBirth" className="form-label">
//                   Place of Birth
//                 </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="placeOfBirth"
//                     name="birth_city"
//                     value={formData.birth_city}
//                     onChange={handleInputChange}
//                   />
//               </div>
//             </div>

//             <div className="mb-3">
//               <div className="">
//                 <h5 className="modal-title">Manglik Dosh</h5>
//                 {renderRadioGroup("manglik", MANGLIK_OPTIONS)}
//               </div>
//             </div>

//             <div className="mb-3">
//               <label htmlFor="raashi" className="form-label">
//                 Zodiac Sign(Raashi)
//               </label>
//               <small className="d-block text-muted">
//                 This is based on lunar star sign.
//               </small>
//               <select
//                 className="form-select"
//                 id="raashi"
//                 name="rashi"
//                 value={formData.rashi}
//                 onChange={handleInputChange}
//               >
//                 {RASHI_OPTIONS.map(rashi => (
//                   <option key={rashi.key} value={rashi.key}>{rashi.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-3">
//               <div className="">
//                 <h5 className="modal-title">Nakshtra</h5>
//                 {renderRadioGroup("nakshatra", NAKSHATRA_OPTIONS)}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <button
//             type="button"
//             className="btn w-100 py-2 btn-filled"
//             onClick={() => handleSubmit('astro', formData)}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default AstroModal;