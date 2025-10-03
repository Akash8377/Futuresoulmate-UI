import { useState, useEffect } from "react";
import { boostProfile } from "../../features/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";

export default function BoostButton() {
  const { userInfo, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [boosting, setBoosting] = useState(
    userInfo?.boosted_until && new Date(userInfo.boosted_until) > new Date()
  );

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!userInfo?.boosted_until) return 0;
    const diff = Math.floor(
      (new Date(userInfo.boosted_until).getTime() - Date.now()) / 1000
    );
    return diff > 0 ? diff : 0;
  });

  const [boostData, setBoostData] = useState({
    boosts_used: 0,
    boosts_left: 0,
    max_boosts: 0,
    plan_name: null,
    loading: true
  });

  // Fetch boost status on component mount
  useEffect(() => {
    fetchBoostStatus();
  }, []);

  const fetchBoostStatus = async () => {
    try {
      setBoostData(prev => ({ ...prev, loading: true }));
      const response = await fetch(`${config.baseURL}/api/profile/boost/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("boost status: ", data);
      
      if (data.success) {
        // Calculate boosts_left if it's null
        const boostsUsed = data.subscription?.boosts_used || 0;
        const maxBoosts = data.max_boosts || 0;
        const boostsLeft = data.boosts_left !== null ? data.boosts_left : Math.max(0, maxBoosts - boostsUsed);
        
        setBoostData({
          boosts_used: boostsUsed,
          boosts_left: boostsLeft,
          max_boosts: maxBoosts,
          plan_name: data.subscription?.plan_name || 'No active plan',
          loading: false
        });

        // Also update boosting state based on current boost status
        if (data.boosted_until && new Date(data.boosted_until) > new Date()) {
          setBoosting(true);
          const diff = Math.floor(
            (new Date(data.boosted_until).getTime() - Date.now()) / 1000
          );
          setTimeLeft(diff > 0 ? diff : 0);
        }
      }
    } catch (error) {
      console.error('Error fetching boost status:', error);
      setBoostData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleBoost = async () => {
    try {
      const res = await boostProfile(token, userInfo, dispatch);
      console.log("Boost response:", res);
      
      if (res?.boosted_until) {
        const endTime = new Date(res.boosted_until).getTime();
        const now = Date.now();
        const seconds = Math.max(0, Math.floor((endTime - now) / 1000));

        setTimeLeft(seconds);
        setBoosting(true);

        // Update boost data with response data
        const boostsUsed = res.boost_used || (boostData.boosts_used + 1);
        const maxBoosts = res.max_boosts || boostData.max_boosts;
        const boostsLeft = res.boosts_left !== undefined ? res.boosts_left : Math.max(0, maxBoosts - boostsUsed);

        setBoostData({
          boosts_used: boostsUsed,
          boosts_left: boostsLeft,
          max_boosts: maxBoosts,
          plan_name: res.plan_name || boostData.plan_name,
          loading: false
        });

        // Update userInfo in Redux
        dispatch({
          type: "user/updateBoostTime",
          payload: res.boosted_until,
        });
      }
      
      // Refresh boost status after successful boost
      await fetchBoostStatus();
      
    } catch (err) {
      console.error("Boost error:", err);
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

  const isBoostDisabled = boosting || boostData.boosts_left <= 0 || boostData.loading;

  if (boostData.loading) {
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
      <div className="boost-info">
        <span>
          Boost Details: <strong>{boostData.boosts_used}/{boostData.max_boosts}</strong> 
          {/* Left: <strong>{boostData.boosts_left}</strong> */}
        </span>
      </div>
      
      <button
        className="boost-btn"
        onClick={handleBoost}
        disabled={isBoostDisabled}
        title={
          boosting
            ? `Boost active until ${new Date(
                userInfo?.boosted_until
              ).toLocaleString()}`
            : boostData.boosts_left <= 0
            ? "No boosts left for your current plan"
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
// import { boostProfile } from "../../features/user/userApi";
// import { useDispatch, useSelector } from "react-redux";

// export default function BoostButton() {
//   const { userInfo, token } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

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

//   const handleBoost = async () => {
//     try {
//       const res = await boostProfile(token, userInfo, dispatch);
//         console.log("Boost response:", res);
//       if (res?.boosted_until) {
//         const endTime = new Date(res.boosted_until).getTime();
//         const now = Date.now();
//         const seconds = Math.max(0, Math.floor((endTime - now) / 1000));

//         setTimeLeft(seconds);
//         setBoosting(true);

//         // ✅ also update userInfo in Redux so reload not needed
//         dispatch({
//           type: "user/updateBoostTime",
//           payload: res.boosted_until,
//         });
//       }
//     } catch (err) {
//       console.error("Boost error:", err);
//     }
//   };

//   // Countdown effect
//   useEffect(() => {
//     if (!boosting || timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setBoosting(false);
//           return 0; // ✅ keep 0 instead of null
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

//   return (
//     <button
//       className="boost-btn"
//       onClick={handleBoost}
//       disabled={boosting}
//       title={
//         boosting
//           ? `Boost active until ${new Date(
//               userInfo?.boosted_until
//             ).toLocaleString()}`
//           : "Boost your profile to get more visibility!"
//       }
//     >
//       {boosting && timeLeft > 0
//         ? `⏳ ${formatTime(timeLeft)}`
//         : "🚀 Boost Profile"}
//     </button>
//   );
// }