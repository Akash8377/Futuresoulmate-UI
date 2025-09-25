import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RefineSearchSidebar from "./components/RefineSearchSidebar";
import ProfileCard from "./components/ProfileCard";
import Pagination from "./components/Pagination";
import axios from "axios";
import config from "../../../config";
import { toast } from "../../Common/Toast";

const PROFILES_PER_PAGE = 5;

const MyMatches = ({chatBoxOpen}) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const user = useSelector((state) => state.user.userInfo);
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === "Bride" ? "Groom" : "Bride";
  const partnerPreference = user?.partner_preference || {};

  const fetchFilteredProfiles = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/matches/my-matches`,
        {
          params: {
            user_id: user.id,
            looking_for: searchFor,
            partner_preference: JSON.stringify(user?.partner_preference),
            ...filters,
          },
        }
      );
      console.log("response.data.users", response.data.users)
      setProfiles(response.data.users || []);
      setCurrentPage(1); // Reset to page 1 on new search
    } catch (error) {
      console.error("Error fetching profiles", error);
    }
  };

  const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refetch
  };

  useEffect(() => {
    if (searchFor) fetchFilteredProfiles();
  }, [filters, searchFor, refreshTrigger]);

  const handleConnectClick = async (id, profileId) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.user_id === id ? { ...profile, connectionRequest: true } : profile
      )
    );
    try {
      await axios.post(`${config.baseURL}/api/notifications/send`, {
        receiver_user_id: id,
        receiver_profile_id:profileId,
        sender_user_id: user?.user_id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      toast.success("Request sent successfully")
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };

  // Slice the profiles for current page
  const indexOfLastProfile = currentPage * PROFILES_PER_PAGE;
  const indexOfFirstProfile = indexOfLastProfile - PROFILES_PER_PAGE;
  const currentProfiles = profiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  return (
    <div className="p-4">
      <div className="row">
        <div className="col-md-3">
          <RefineSearchSidebar setFilters={setFilters} />
        </div>
        <div className="col-md-9">
          <h4>New Members Who Match Your Preferences</h4>
          <div className="card border-0 shadow-sm mb-3">
            {currentProfiles.length > 0 ? (
              currentProfiles.map((profile) => (
                 <ProfileCard
                  key={profile.id}
                  profile={profile}
                  handleConnectClick={handleConnectClick}
                  activeIndex={activeCarouselIndex}
                  setActiveIndex={setActiveCarouselIndex}
                  chatBoxOpen={chatBoxOpen}
                  user={user}
                  onProfileUpdate={handleProfileUpdate} // Pass the callback
                />
              ))
            ) : (
              <div className="p-4 text-muted">No new matches found.</div>
            )}
          </div>

          {/* Show pagination if more than one page */}
          {profiles.length > PROFILES_PER_PAGE && (
            <Pagination
              totalProfiles={profiles.length}
              profilesPerPage={PROFILES_PER_PAGE}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;
