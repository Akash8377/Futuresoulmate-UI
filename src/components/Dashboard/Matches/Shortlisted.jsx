import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RefineSearchSidebar from './components/RefineSearchSidebar';
import ProfileCard from './components/ProfileCard';
import Pagination from './components/Pagination';
import axios from 'axios';
import config from '../../../config';
import { toast } from "../../Common/Toast";
 
const Shortlisted = ({chatBoxOpen}) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 5;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = useSelector((state) => state.user.userInfo);
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === 'Bride' ? 'Groom' : 'Bride';
 
  const fetchFilteredProfiles = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/matches/shortlisted`, {
        params: {
          user_id:user.id,
          looking_for: searchFor,
          ...filters,
        },
      });
      setProfiles(response.data.users || []);
      setCurrentPage(1); // Reset to page 1 on new filter
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
 
  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
 
  return (
    <div className="p-4">
      <div className="row">
        <div className="col-md-3">
          <RefineSearchSidebar setFilters={setFilters} />
        </div>
        <div className="col-md-9">
          <h4>Shortlisted Profiles</h4>
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
              <div className="p-4 text-muted">No profiles have been shortlisted. Start connecting with other profiles.</div>
            )}
          </div>
          {profiles.length > profilesPerPage && (
            <Pagination
              totalProfiles={profiles.length}
              profilesPerPage={profilesPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Shortlisted;