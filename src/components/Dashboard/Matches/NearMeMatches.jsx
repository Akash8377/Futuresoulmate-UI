import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RefineSearchSidebar from './components/RefineSearchSidebar';
import ProfileCard from './components/ProfileCard';
import Pagination from './components/Pagination';
import axios from 'axios';
import config from '../../../config';
import { toast } from "../../Common/Toast";


const NearMeMatches = ({chatBoxOpen}) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const PROFILES_PER_PAGE = 5;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = useSelector((state) => state.user.userInfo);
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === 'Bride' ? 'Groom' : 'Bride';

  const fetchFilteredProfiles = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/matches/new-matches-near-me`, {
        params: {
          user_id:user.id,
          looking_for: searchFor,
          nearMe:user.city,
          ...filters,
        },
      });
      setProfiles(response.data.users || []);
    } catch (error) {
      console.error("Error fetching profiles", error);
    }
  };

   const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refetch
  };
  useEffect(() => {
    if (searchFor) fetchFilteredProfiles();
  }, [filters, searchFor,refreshTrigger]);

  // const handleConnectClick = async (id, profileId) => {
  //   setProfiles((prev) =>
  //     prev.map((profile) =>
  //       profile.user_id === id ? { ...profile, connectionRequest: true } : profile
  //     )
  //   );
  //   try {
  //     await axios.post(`${config.baseURL}/api/notifications/send`, {
  //       receiver_user_id: id,
  //       receiver_profile_id:profileId,
  //       sender_user_id: user?.user_id,
  //       sender_profile_id: user?.profileId,
  //       type: "connect",
  //       message: `${user?.first_name} wants to connect with you`,
  //     });
  //     toast.success("Request sent successfully")
  //   } catch (error) {
  //     console.error("Error sending notification", error);
  //   }
  // };
  const handleConnectClick = (id) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.user_id === id ? { ...profile, connectionRequest: true } : profile
      )
    );
  };

  const indexOfLastProfile = currentPage * PROFILES_PER_PAGE;
  const indexOfFirstProfile = indexOfLastProfile - PROFILES_PER_PAGE;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

  return (
    <div className="p-4">
      <div className="row">
        <div className="col-md-3">
          <RefineSearchSidebar setFilters={setFilters} />
        </div>
        <div className="col-md-9">
          <h4>Members Who Match Your location "{user.city}"</h4>
          <div className="card border-0 shadow-sm mb-3">
            {currentProfiles.length > 0 ? (
              currentProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  handleConnectClick={handleConnectClick}
                  activeIndex={activeCarouselIndex}
                  setActiveIndex={setActiveCarouselIndex}
                  chatBoxOpen={chatBoxOpen}
                  user={user}
                  onProfileUpdate={handleProfileUpdate}
                />
              ))
            ) : (
              <div className="p-4 text-muted">No new matches found.</div>
            )}
          </div>
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

export default NearMeMatches;




// import React from 'react';

// const NearMeMatches = () => (
//   <div className="p-4">
//     <h4>Near Me</h4>
//     <p>Content coming soon...</p>
//   </div>
// );

// export default NearMeMatches;
