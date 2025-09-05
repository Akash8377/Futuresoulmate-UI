import axios from "axios";
import { setUser } from "./userSlice";
import config from "../../config"; // adjust path if needed
import { toast } from "../../components/Common/Toast";

export const boostProfile = async (token, userInfo, dispatch) => {
  try {
    const response = await axios.post(
      `${config.baseURL}/api/profile/boost`,
      {}, // no body needed
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
    // ✅ return the API response so handleBoost can log/use it
    return response.data;
  } catch (error) {
    console.error("Boost error:", error);
    toast.error(
      error.response?.data?.message ||
        "Failed to boost profile. Please try again."
    );
  }
};
