import axios from "axios";
import { setUser } from "./userSlice";
import config from "../../config"; // adjust path if needed
import { toast } from "../../components/Common/Toast";

// export const boostProfile = async (token, userInfo, dispatch) => {
//   try {
//     const response = await axios.post(
//       `${config.baseURL}/api/profile/boost`,
//       {}, // no body needed
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.data.success) {
//       toast.success(response.data.message || "Profile boosted 🚀");
//       if (response.data.boosted_until) {
//         const updatedUser = {
//           ...userInfo,
//           boosted_until: response.data.boosted_until,
//         };
//         dispatch(
//           setUser({
//             userInfo: updatedUser,
//             token: token,
//           })
//         );
//       }
//     }
//     // ✅ return the API response so handleBoost can log/use it
//     return response.data;
//   } catch (error) {
//     console.error("Boost error:", error);
//     toast.error(
//       error.response?.data?.message ||
//         "Failed to boost profile. Please try again."
//     );
//   }
// };

export const boostProfile = async (token, userInfo, dispatch) => {
  try {
    const response = await axios.post(
      `${config.baseURL}/api/profile/boost`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message || "Profile boosted 🚀");
      if (response.data.boosted_until) {
        const updatedUser = {
          ...userInfo,
          boosted_until: response.data.boosted_until,
        };
        dispatch(
          setUser({
            userInfo: updatedUser,
            token: token,
          })
        );
      }
    }
    return response.data;
  } catch (error) {
    console.error("Boost error:", error);
    toast.error(
      error.response?.data?.message ||
        "Failed to boost profile. Please try again."
    );
    throw error; // Important: re-throw to handle in component
  }
};

export const blockUser = async (userId, blockedUserId) => {
  try {
    console.log("Blocking user:", userId, blockedUserId);
    const response = await fetch(`${config.baseURL}/api/block-report/block-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, blockedUserId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

export const unblockUser = async (userId, blockedUserId) => {
  try {
    const response = await fetch(`${config.baseURL}/api/block-report/unblock-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, blockedUserId })
    });
    return await response.json();
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

export const reportUser = async (reporterId, reportedUserId, reason) => {
  try {
    const response = await fetch(`${config.baseURL}/api/block-report/report-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reporterId, reportedUserId, reason })
    });
    return await response.json();
  } catch (error) {
    console.error('Error reporting user:', error);
    throw error;
  }
};

export const getBlockedUsers = async (userId) => {
  try {
    const response = await fetch(`${config.baseURL}/api/block-report/blocked-users/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    throw error;
  }
};

export const checkIfBlocked = async (userId, targetUserId) => {
  try {
    const response = await fetch(`${config.baseURL}/api/block-report/check-blocked/${userId}/${targetUserId}`);
    return await response.json();
  } catch (error) {
    console.error('Error checking block status:', error);
    throw error;
  }
};
