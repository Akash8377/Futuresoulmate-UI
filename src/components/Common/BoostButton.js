import { useState, useEffect } from "react";
import { boostProfile } from "../../features/user/userApi";
import { useDispatch, useSelector } from "react-redux";

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

        // ✅ also update userInfo in Redux so reload not needed
        dispatch({
          type: "user/updateBoostTime",
          payload: res.boosted_until,
        });
      }
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
          return 0; // ✅ keep 0 instead of null
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

  return (
    <button
      className="boost-btn"
      onClick={handleBoost}
      disabled={boosting}
      title={
        boosting
          ? `Boost active until ${new Date(
              userInfo?.boosted_until
            ).toLocaleString()}`
          : "Boost your profile to get more visibility!"
      }
    >
      {boosting && timeLeft > 0
        ? `⏳ ${formatTime(timeLeft)}`
        : "🚀 Boost Profile"}
    </button>
  );
}




// import { useState, useEffect } from "react";
// import { boostProfile } from "../../features/user/userApi";
// import { useDispatch, useSelector } from 'react-redux';


// export default function BoostButton() {
//   const { userInfo, token } = useSelector(state => state.user);
//   const dispatch = useDispatch();
//   const [boosting, setBoosting] = useState(userInfo?.boosted_until ? true : false);
//   const [timeLeft, setTimeLeft] = useState(Math.max(0, Math.floor((new Date(userInfo?.boosted_until).getTime() - Date.now()) / 1000) || null));
//   const handleBoost = async () => {
//     try {
//       const res = await boostProfile(token, userInfo, dispatch);

//       if (res?.boosted_until) {
//         const endTime = new Date(res.boosted_until).getTime();
//         const now = Date.now();
//         setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
//         setBoosting(true);
//       }
//     } catch (err) {
//       console.error("Boost error:", err);
//     }
//   };

//   // Countdown effect
//   useEffect(() => {
//     if (!timeLeft) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setBoosting(false);
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

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
//       title={boosting ? `Boost active until ${new Date(userInfo?.boosted_until).toLocaleString()}` : "Boost your profile to get more visibility!"}
//     >
//       {boosting && timeLeft !== null
//         ? `⏳ ${formatTime(timeLeft)}`
//         : "🚀 Boost Profile"}
//     </button>
//   );
// }
