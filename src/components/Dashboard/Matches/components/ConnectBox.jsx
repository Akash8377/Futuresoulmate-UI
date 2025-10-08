import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import check from "../../../assets/checked.png";
import { useService } from "../../../../context/ServiceContext";
import config from "../../../../config";

const ConnectBox = ({ id, profileId, onConnectionSent }) => {
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { serviceData, updateServiceUsage } = useService(); // Use the context
  const [isSending, setIsSending] = useState(false);

  const handleConnectClick = async () => {
    if (!serviceData.plan_name || !serviceData.service_found) {
      toast.info("Please upgrade your plan to use the connect feature.");
      navigate("/upgrade-profile");
      return;
    }

    if (serviceData.uses_left <= 0) {
      toast.info("No connection requests left in your current plan.");
      navigate("/upgrade-profile");
      return;
    }

    setIsSending(true);

    try {
      const serviceResponse = await fetch(`${config.baseURL}/api/profile/service/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceName: 'Shortlist' })
      });

      const serviceResult = await serviceResponse.json();
      
      if (!serviceResult.success) {
        throw new Error(serviceResult.message || 'Failed to use connection service');
      }

      await axios.post(`${config.baseURL}/api/notifications/send`, {
        receiver_user_id: id,
        receiver_profile_id: profileId,
        sender_user_id: user?.user_id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      
      toast.success("Connection request sent successfully!");
      
      // Update the shared service context
      updateServiceUsage(
        serviceResult.service_used || (serviceData.used + 1),
        serviceResult.uses_left || Math.max(0, serviceData.max_uses - (serviceData.used + 1))
      );

      if (onConnectionSent) {
        onConnectionSent(id);
      }
      
    } catch (error) {
      console.error("Error sending connection request", error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setIsSending(false);
    }
  };

  const isConnectDisabled = isSending || serviceData.loading || serviceData.uses_left <= 0 || !serviceData.service_found;

  // if (serviceData.loading) {
  //   return (
  //     <div className="text-center" id="connectBox">
  //       <div className="small text-muted mb-2">Like this profile?</div>
  //       <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
  //       <div>
  //         <button className="btn btn-outline-secondary btn-sm" disabled>
  //           Loading...
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="text-center" id="connectBox">
      <div className="small text-muted mb-2">Like this profile?</div>
      <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
      
      {/* Show remaining connections - reduced size */}
      {serviceData.service_found && (
        <div className="small mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
          <strong>{serviceData.used}/{serviceData.max_uses}</strong> connects
        </div>
      )}
      
      <div>
        <button 
          className="btn btn-outline-success btn-sm" 
          id="connectBtn" 
          onClick={handleConnectClick}
          // disabled={isConnectDisabled}
          style={{cursor: isConnectDisabled ? "not-allowed" : "pointer"}}
          title={
            !serviceData.service_found
              ? "Connect feature not available in your plan"
              : serviceData.uses_left <= 0
              ? "No connection requests left, upgrade your plan!"
              : "Send connection request"
          }
        >
          {isSending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Sending...
            </>
          ) : (
            "Connect Now"
          )}
        </button>
      </div>

      {/* Show upgrade prompt if no service available */}
      {serviceData.plan_name && !serviceData.service_found && (
        <div className="small text-warning mt-1" style={{ fontSize: '0.7rem' }}>
          Upgrade to connect
        </div>
      )}
    </div>
  );
};

export default ConnectBox;



// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import check from "../../../assets/checked.png";
// import config from "../../../../config";

// const ConnectBox = ({ id, profileId, onConnectionSent }) => {
//   const user = useSelector((state) => state.user.userInfo);
//   const token = useSelector((state) => state.user.token);
//   const navigate = useNavigate();

//   const [serviceData, setServiceData] = useState({
//     used: 0,
//     uses_left: 0,
//     max_uses: 0,
//     plan_name: null,
//     loading: true,
//     service_found: false
//   });

//   const [isSending, setIsSending] = useState(false);

//   // Fetch Shortlist service status on component mount
//   useEffect(() => {
//     fetchServiceStatus();
//   }, []);

//   const fetchServiceStatus = async () => {
//     try {
//       setServiceData(prev => ({ ...prev, loading: true }));
      
//       const response = await fetch(`${config.baseURL}/api/profile/service/status?service_name=Shortlist`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       const data = await response.json();
//       console.log("Shortlist service data:", data);
      
//       if (data.success) {
//         const serviceInfo = data.services?.Shortlist || data.services;
        
//         if (serviceInfo) {
//           setServiceData({
//             used: serviceInfo.used || 0,
//             uses_left: serviceInfo.uses_left || 0,
//             max_uses: serviceInfo.max_uses || 0,
//             plan_name: data.plan_name,
//             loading: false,
//             service_found: true
//           });
//         } else {
//           setServiceData({
//             used: 0,
//             uses_left: 0,
//             max_uses: 0,
//             plan_name: data.plan_name,
//             loading: false,
//             service_found: false
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching Shortlist service status:', error);
//       setServiceData(prev => ({ ...prev, loading: false }));
//     }
//   };

//   const handleConnectClick = async () => {
//     // If user has no subscription or Shortlist service not available
//     if (!serviceData.plan_name || !serviceData.service_found) {
//       toast.info("Please upgrade your plan to use the connect feature.");
//       navigate("/upgrade-profile");
//       return;
//     }

//     // If no uses left
//     if (serviceData.uses_left <= 0) {
//       toast.info("No connection requests left in your current plan.");
//       return;
//     }

//     setIsSending(true);

//     try {
//       // First, use the Shortlist service
//       const serviceResponse = await fetch(`${config.baseURL}/api/profile/service/use`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ serviceName: 'Shortlist' })
//       });

//       const serviceResult = await serviceResponse.json(); // Changed variable name
      
//       if (!serviceResult.success) {
//         throw new Error(serviceResult.message || 'Failed to use connection service');
//       }

//       // Then send the connection notification
//       await axios.post(`${config.baseURL}/api/notifications/send`, {
//         receiver_user_id: id,
//         receiver_profile_id: profileId,
//         sender_user_id: user?.user_id,
//         sender_profile_id: user?.profileId,
//         type: "connect",
//         message: `${user?.first_name} wants to connect with you`,
//       });
      
//       toast.success("Connection request sent successfully!");
      
//       // Update service data with the new usage count from response
//       setServiceData(prev => ({
//         ...prev,
//         used: serviceResult.service_used || (prev.used + 1),
//         uses_left: serviceResult.uses_left || Math.max(0, (serviceResult.max_uses || prev.max_uses) - (serviceResult.service_used || prev.used + 1)),
//         max_uses: serviceResult.max_uses || prev.max_uses,
//         loading: false
//       }));

//       // Call the callback to update parent state
//       if (onConnectionSent) {
//         onConnectionSent(id);
//       }
      
//     } catch (error) {
//       console.error("Error sending connection request", error);
      
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else if (error.message) {
//         toast.error(error.message);
//       } else {
//         toast.error("Failed to send connection request");
//       }
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const isConnectDisabled = isSending || serviceData.loading || serviceData.uses_left <= 0 || !serviceData.service_found;

//   if (serviceData.loading) {
//     return (
//       <div className="text-center" id="connectBox">
//         <div className="small text-muted mb-2">Like this profile?</div>
//         <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
//         <div>
//           <button className="btn btn-outline-secondary btn-sm" disabled>
//             Loading...
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="text-center" id="connectBox">
//       <div className="small text-muted mb-2">Like this profile?</div>
//       <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
      
//       {/* Show remaining connections - reduced size */}
//       {serviceData.service_found && (
//         <div className="small text-info mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
//           <strong>{serviceData.used}/{serviceData.max_uses}</strong> connects
//         </div>
//       )}
      
//       <div>
//         <button 
//           className="btn btn-outline-success btn-sm" 
//           id="connectBtn" 
//           onClick={handleConnectClick}
//           disabled={isConnectDisabled}
//           title={
//             !serviceData.service_found
//               ? "Connect feature not available in your plan"
//               : serviceData.uses_left <= 0
//               ? "No connection requests left, upgrade your plan!"
//               : "Send connection request"
//           }
//         >
//           {isSending ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//               Sending...
//             </>
//           ) : (
//             "Connect Now"
//           )}
//         </button>
//       </div>

//       {/* Show upgrade prompt if no service available */}
//       {serviceData.plan_name && !serviceData.service_found && (
//         <div className="small text-warning mt-1" style={{ fontSize: '0.7rem' }}>
//           Upgrade to connect
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConnectBox;

// ///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
// ///////////////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import check from "../../../assets/checked.png";
// import config from "../../../../config"; // Adjust path as needed

// const ConnectBox = ({ id, profileId, onConnectionSent }) => {
//   const user = useSelector((state) => state.user.userInfo);
//   const navigate = useNavigate();

//   const handleConnectClick = async () => {
//     if (!user?.plan_name) {
//       toast.info("Please upgrade your plan to use the connect feature.");
//       navigate("/upgrade-profile");
//       return;
//     }

//     try {
//       await axios.post(`${config.baseURL}/api/notifications/send`, {
//         receiver_user_id: id,
//         receiver_profile_id: profileId,
//         sender_user_id: user?.user_id,
//         sender_profile_id: user?.profileId,
//         type: "connect",
//         message: `${user?.first_name} wants to connect with you`,
//       });
      
//       toast.success("Request sent successfully");
      
//       // Call the callback to update parent state
//       if (onConnectionSent) {
//         onConnectionSent(id);
//       }
      
//     } catch (error) {
//       console.error("Error sending notification", error);
//       toast.error("Failed to send connection request");
//     }
//   };

//   return (
//     <div className="text-center" id="connectBox">
//       <div className="small text-muted mb-2">Like this profile?</div>
//       <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
//       <div>
//         <button 
//           className="btn btn-outline-success btn-sm" 
//           id="connectBtn" 
//           onClick={handleConnectClick}
//         >
//           Connect Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnectBox;

// ///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
//                                                                                              //
// ///////////////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import check from "../../../assets/checked.png";

// const ConnectBox = ({ handleConnectClick }) => (
//   <div className="text-center" id="connectBox">
//     <div className="small text-muted mb-2">Like this profile?</div>
//     <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
//     <div>
//       <button className="btn btn-outline-success btn-sm" id="connectBtn" onClick={handleConnectClick}>
//         Connect Now
//       </button>
//     </div>
//   </div>
// );

// export default ConnectBox;
