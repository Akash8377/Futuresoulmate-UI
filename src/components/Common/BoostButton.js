import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";
import { toast } from "./Toast";

export default function BoostButton() {
  const { userInfo, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [boosting, setBoosting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBoostUntil, setCurrentBoostUntil] = useState(null);

  const [serviceData, setServiceData] = useState({
    used: 0,
    uses_left: 0,
    max_uses: 0,
    plan_name: null,
    loading: true,
    service_found: false
  });

  // Initialize boost state from userInfo and service data
  useEffect(() => {
    if (userInfo?.boosted_until) {
      const boostTime = new Date(userInfo.boosted_until);
      const now = new Date();
      
      if (boostTime > now) {
        setBoosting(true);
        setCurrentBoostUntil(userInfo.boosted_until);
        const diff = Math.floor((boostTime.getTime() - now.getTime()) / 1000);
        setTimeLeft(diff > 0 ? diff : 0);
      } else {
        setBoosting(false);
        setCurrentBoostUntil(null);
        setTimeLeft(0);
      }
    }
  }, [userInfo]);

  // Fetch service status on component mount
  useEffect(() => {
    fetchServiceStatus();
  }, []);

  const fetchServiceStatus = async () => {
    try {
      setServiceData(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`${config.baseURL}/api/profile/service/status?service_name=Boosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log("Boost service data:", data);
      
      if (data.success) {
        const serviceInfo = data.services?.Boosts || data.services;
        
        if (serviceInfo) {
          setServiceData({
            used: serviceInfo.used || 0,
            uses_left: serviceInfo.uses_left || 0,
            max_uses: serviceInfo.max_uses || 0,
            plan_name: data.plan_name,
            loading: false,
            service_found: true
          });

          // Update boost state from API response (most current data)
          if (data.user?.boosted_until && new Date(data.user.boosted_until) > new Date()) {
            setBoosting(true);
            setCurrentBoostUntil(data.user.boosted_until);
            const diff = Math.floor(
              (new Date(data.user.boosted_until).getTime() - Date.now()) / 1000
            );
            setTimeLeft(diff > 0 ? diff : 0);
          } else {
            setBoosting(false);
            setCurrentBoostUntil(null);
            setTimeLeft(0);
          }
        } else {
          setServiceData({
            used: 0,
            uses_left: 0,
            max_uses: 0,
            plan_name: data.plan_name,
            loading: false,
            service_found: false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching service status:', error);
      setServiceData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleBoost = async () => {
    if (!serviceData.plan_name || !serviceData.service_found) {
      toast.info("Please upgrade your plan to use the boost feature.");
      navigate("/upgrade-profile");
      return;
    }

    if (serviceData.uses_left <= 0) {
      toast.info("No boosts available in your current plan.");
      return;
    }

    try {
      const response = await fetch(`${config.baseURL}/api/profile/service/use`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceName: 'Boosts' })
      });

      const data = await response.json();
      console.log("Boost response:", data);
      
      if (data.success) {
        // Use the boosted_until from the API response
        if (data.boosted_until) {
          const endTime = new Date(data.boosted_until);
          const now = new Date();
          const seconds = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));

          setTimeLeft(seconds);
          setBoosting(true);
          setCurrentBoostUntil(data.boosted_until);

          // Update userInfo in Redux with the new boost time
          dispatch({  
            type: "user/updateBoostTime",
            payload: data.boosted_until,
          });
        }

        // Update service data
        setServiceData(prev => ({
          ...prev,
          used: data.service_used || (prev.used + 1),
          uses_left: data.uses_left || Math.max(0, prev.max_uses - (prev.used + 1)),
          loading: false
        }));

        toast.success(data.message || "Profile boosted successfully! 🚀");
      } else {
        toast.error(data.message || "Failed to boost profile");
      }
      
    } catch (err) {
      console.error("Boost error:", err);
      toast.error("Failed to boost profile");
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!boosting || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBoosting(false);
          setCurrentBoostUntil(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [boosting, timeLeft]);

  // Format time as MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format date for display
  const formatBoostEndTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(); // This will format according to user's locale
  };

  const isBoostDisabled = boosting || serviceData.loading || serviceData.uses_left <= 0 || !serviceData.service_found;

  if (serviceData.loading) {
    return (
      <div className="boost-container">
        <button className="boost-btn" disabled>
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="boost-container">
      {serviceData.plan_name && serviceData.service_found ? (
        <div className="boost-info">
          <span>
            Total Boosts: <strong>{serviceData.used}/{serviceData.max_uses}</strong> 
            {/* {serviceData.uses_left > 0 && ` (${serviceData.uses_left} left)`} */}
          </span>
        </div>
      ) : serviceData.plan_name && !serviceData.service_found ? (
        <div className="boost-info">
          <span style={{color: 'orange'}}>
            Boost not available in your plan
          </span>
        </div>
      ) : null}
      
      <button
        className="boost-btn"
        onClick={handleBoost}
        // disabled={isBoostDisabled}
        // style={{cursor: isBoostDisabled ? "not-allowed" : "pointer"}}
        title={
          boosting && currentBoostUntil
            ? `Boost active until ${formatBoostEndTime(currentBoostUntil)}`
            : !serviceData.service_found
            ? "Boost service not available in your plan"
            : serviceData.uses_left <= 0
            ? "No boosts available, Upgrade now!"
            : "Boost your profile to get more visibility!"
        }
      >
        {boosting && timeLeft > 0
          ? `⏳ ${formatTime(timeLeft)}`
          : `🚀 Boost Profile`}
      </button>
    </div>
  );
}



// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import config from "../../config";
// import { toast } from "./Toast";

// export default function BoostButton() {
//   const { userInfo, token } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [boosting, setBoosting] = useState(
//     userInfo?.boosted_until && new Date(userInfo.boosted_until) > new Date()
//   );

//   const [timeLeft, setTimeLeft] = useState(() => {
//     if (!userInfo?.boosted_until) return 0;
//     const diff = Math.floor(
//       (new Date(userInfo.boosted_until).getTime() - Date.now()) / 1000
//     );
//     return diff > 0 ? diff : 0;
//   });

//   const [serviceData, setServiceData] = useState({
//     used: 0,
//     uses_left: 0,
//     max_uses: 0,
//     plan_name: null,
//     loading: true,
//     service_found: false
//   });

//   // Fetch service status on component mount
//   useEffect(() => {
//     fetchServiceStatus();
//   }, []);

//   const fetchServiceStatus = async () => {
//     try {
//       setServiceData(prev => ({ ...prev, loading: true }));
      
//       // Use the exact service name from your response - "Boosts"
//       const response = await fetch(`${config.baseURL}/api/profile/service/status?service_name=Boosts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       const data = await response.json();
//       console.log("Boost service data:", data); // Debug log
      
//       if (data.success) {
//         // Check if we found the Boost service
//         const serviceInfo = data.services?.Boosts || data.services;
//         console.log("Service info:", serviceInfo); // Debug log
        
//         if (serviceInfo) {
//           setServiceData({
//             used: serviceInfo.used || 0,
//             uses_left: serviceInfo.uses_left || 0,
//             max_uses: serviceInfo.max_uses || 0,
//             plan_name: data.plan_name,
//             loading: false,
//             service_found: true
//           });

//           // Update boosting state based on current boost status
//           if (data.user?.boosted_until && new Date(data.user.boosted_until) > new Date()) {
//             setBoosting(true);
//             const diff = Math.floor(
//               (new Date(data.user.boosted_until).getTime() - Date.now()) / 1000
//             );
//             setTimeLeft(diff > 0 ? diff : 0);
//           }
//         } else {
//           // Boost service not found in plan
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
//       console.error('Error fetching service status:', error);
//       setServiceData(prev => ({ ...prev, loading: false }));
//     }
//   };

// const handleBoost = async () => {
//   // If user has no subscription or boost service not available
//   if (!serviceData.plan_name || !serviceData.service_found) {
//     toast.info("Please upgrade your plan to use the boost feature.");
//     navigate("/upgrade-profile");
//     return;
//   }

//   // If no uses left
//   if (serviceData.uses_left <= 0) {
//     toast.info("No boosts available in your current plan.");
//     return;
//   }

//   try {
//     const response = await fetch(`${config.baseURL}/api/profile/service/use`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ serviceName: 'Boosts' }) // Use exact service name
//     });

//     const data = await response.json();
//     console.log("Boost response:", data); // Debug log
    
//     if (data.success) {
//       // Check if boosted_until is returned and valid
//       if (data.boosted_until && new Date(data.boosted_until) > new Date()) {
//         const endTime = new Date(data.boosted_until).getTime();
//         const now = Date.now();
//         const seconds = Math.max(0, Math.floor((endTime - now) / 1000));

//         setTimeLeft(seconds);
//         setBoosting(true);

//         // Update userInfo in Redux
//         dispatch({  
//           type: "user/updateBoostTime",
//           payload: data.boosted_until,
//         });
//       }

//       // Update service data with response data
//       setServiceData(prev => ({
//         ...prev,
//         used: data.service_used || (prev.used + 1),
//         uses_left: data.uses_left || Math.max(0, prev.max_uses - (prev.used + 1)),
//         loading: false
//       }));

//       toast.success(data.message || "Profile boosted successfully! 🚀");
//     } else {
//       toast.error(data.message || "Failed to boost profile");
//     }
    
//   } catch (err) {
//     console.error("Boost error:", err);
//     toast.error("Failed to boost profile");
//   }
// };

//   // Countdown effect
//   useEffect(() => {
//     if (!boosting || timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setBoosting(false);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [boosting, timeLeft]);

//   // Format time as MM:SS
//   const formatTime = (secs) => {
//     const minutes = Math.floor(secs / 60);
//     const seconds = secs % 60;
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const isBoostDisabled = boosting || serviceData.loading || serviceData.uses_left <= 0 || !serviceData.service_found;

//   if (serviceData.loading) {
//     return (
//       <div className="boost-container">
//         <button className="boost-btn" disabled>
//           Loading...
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="boost-container">
//       {serviceData.plan_name && serviceData.service_found ? (
//         <div className="boost-info">
//           <span>
//             Boost: <strong>{serviceData.used}/{serviceData.max_uses}</strong> 
//             {serviceData.uses_left > 0 && ` (${serviceData.uses_left} left)`}
//           </span>
//         </div>
//       ) : serviceData.plan_name && !serviceData.service_found ? (
//         <div className="boost-info">
//           <span style={{color: 'orange'}}>
//             Boost not available in your plan
//           </span>
//         </div>
//       ) : null}
      
//       <button
//         className="boost-btn"
//         onClick={handleBoost}
//         disabled={isBoostDisabled}
//         title={
//           boosting
//             ? `Boost active until ${new Date(userInfo?.boosted_until).toLocaleString()}`
//             : !serviceData.service_found
//             ? "Boost service not available in your plan"
//             : serviceData.uses_left <= 0
//             ? "No boosts available, Upgrade now!"
//             : "Boost your profile to get more visibility!"
//         }
//       >
//         {boosting && timeLeft > 0
//           ? `⏳ ${formatTime(timeLeft)}`
//           : `🚀 Boost Profile`}
//       </button>
//     </div>
//   );
// }