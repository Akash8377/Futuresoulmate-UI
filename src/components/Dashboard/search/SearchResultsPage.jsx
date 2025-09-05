import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RefineSearchSidebar from './RefineSearchSidebar';
import ProfileCard from '../Matches/components/ProfileCard';
import Pagination from '../Matches/components/Pagination';
import axios from 'axios';
import config from '../../../config';
import { toast } from "../../Common/Toast";

const SearchResultsPage = ({chatBoxOpen}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const profilesPerPage = 7;
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === 'Bride' ? 'Groom' : 'Bride';

  // Initialize filters from location state
  useEffect(() => {
    if (location.state?.searchData) {
      setFilters(location.state.searchData);
    }
    if (location.state?.initialResults && location.state?.initialResults?.length > 0) {
      setProfiles(location.state?.initialResults);
      console.log("Profiles Data",location.state?.initialResults)
    }
  }, [location.state]);

  const fetchSearchResults = async (searchParams) => {
    console.log("Search Params", searchParams);
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.baseURL}/api/search/search-profiles-filter`,
        { ...searchParams },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfiles(response.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch results when filters change
  useEffect(() => {
    if (!isInitialMount) {
      if (filters && Object.keys(filters).length > 0) {
        fetchSearchResults(filters);
      }
    }
  }, [filters]);

  const handleRefineSearch = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if(isInitialMount){
      setIsInitialMount(false)
    }
  };

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
        sender_user_id: user?.id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      toast.success("Request sent successfully")
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles?.slice(indexOfFirstProfile, indexOfLastProfile);
  
  return (
    <>
      <div className="container mt-3 p-4">
        <div className="row">
          <div className="col-md-3">
            <RefineSearchSidebar 
              initialFilters={filters}
              onFilterChange={handleRefineSearch}
              searchType={filters?.searchType || 'Basic'}
            />
          </div>
          <div className="col-md-9">
            <h4>Search Results</h4>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <>
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
                      />
                    ))
                  ) : (
                    <div className="p-4 text-muted">No profiles found matching your criteria.</div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;