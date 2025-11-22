import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RefineSearchSidebar from "./components/RefineSearchSidebar";
import ProfileCard from "./components/ProfileCard";
import Pagination from "./components/Pagination";
import axios from "axios";
import config from "../../../config";
import { toast } from "../../Common/Toast";
import { setUser } from "../../../features/user/userSlice";

const DNAMatches = ({chatBoxOpen, key=null}) => {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dnaMatches, setDnaMatches] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasGeneticData, setHasGeneticData] = useState(false);
  const profilesPerPage = 5;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === "Bride" ? "Groom" : "Bride";

  const fetchDNAMatches = async () => {
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.baseURL}/api/genetic-markers/get-matches-by-genetic-markers`,
        {
          params: {
            user_id: user.user_id,
            looking_for: searchFor,
            ...filters,
          },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Process the response to include genetic compatibility data
        const processedProfiles = response.data.users.map(profile => ({
          ...profile,
          // Ensure genetic_compatibility is properly structured
          genetic_compatibility: profile.genetic_compatibility || {
            overall_score: profile.compatibilityScore || 0,
            category_scores: profile.dnaCompatibility?.categoryScores || {},
            risk_flags: profile.dnaCompatibility?.riskFlags || []
          }
        }));
        
        setProfiles(processedProfiles);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching DNA matches:", error);
      if (error.response?.status === 404) {
        setHasGeneticData(false);
        toast.info('Process your DNA file to see genetic compatibility matches');
      } else {
        toast.error('Failed to load DNA matches');
      }
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

 const fetchUserGeneticData = async () => {
  try {
    if (!token) {
      console.error("No token found");
      return false;
    }

    // Check if user already has genetic data
    const response = await axios.get(
      `${config.baseURL}/api/genetic-markers/genetic-data`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    
    if (data.success && data.hasGeneticData && data.data) {
      // Update user info with genetic data
      const updatedUserInfo = {
        ...user, 
        genetic_data: data.data
      };
      dispatch(setUser({
        userInfo: updatedUserInfo,
        token: token,
      }));
      return true;
    } else {
      // If no genetic data found, show message
      console.log('No genetic data found:', data.message);
      return false;
    }
  } catch (error) {
    console.error("Error fetching genetic data:", error);
    if (error.response?.status === 404) {
      console.log('Genetic data endpoint not found');
    }
    return false;
  }
};

  const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleConnectClick = (id) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.user_id === id ? { ...profile, connectionRequest: true } : profile
      )
    );
  };

  useEffect(() => {
    fetchUserGeneticData();
  }, []);

  useEffect(() => {
    if (searchFor && user?.user_id) {
      fetchDNAMatches();
    }
  }, [filters, searchFor, key, refreshTrigger, user?.user_id]);

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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">🧬 DNA Compatibility Matches</h4>
              <p className="text-muted mb-0">
                Members with high genetic compatibility based on your DNA analysis
              </p>
            </div>
           
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading DNA matches...</span>
              </div>
              <p className="mt-2 text-muted">Analyzing genetic compatibility...</p>
            </div>
          ) : (
            <div className="dan-card card border-0 shadow-sm mb-3">
              {currentProfiles.length > 0 ? (
                currentProfiles.map((profile, index) => (
                  <ProfileCard
                    key={profile.user_id || index}
                    profile={profile}
                    handleConnectClick={handleConnectClick}
                    activeIndex={activeCarouselIndex}
                    setActiveIndex={setActiveCarouselIndex}
                    chatBoxOpen={chatBoxOpen}
                    dnaMatches={dnaMatches}
                    user={user}
                    onProfileUpdate={handleProfileUpdate}
                  />
                ))
              ) : (
                <div className="text-center p-5">
                  <div className="mb-3">
                    <i className="fas fa-dna fa-3x text-muted"></i>
                  </div>
                  <h5 className="text-muted">
                    {hasGeneticData ? "No DNA Matches Found" : "DNA Analysis Required"}
                  </h5>
                  <p className="text-muted mb-3">
                    {hasGeneticData 
                      ? "No genetically compatible matches found with current filters. Try adjusting your search criteria."
                      : "Process your DNA file to discover genetically compatible matches based on your genetic profile."
                    }
                  </p>
                  {!hasGeneticData && (
                    <div className="alert alert-info">
                      <small>
                        <strong>How to get started:</strong> Upload and process your DNA file in your profile settings to enable genetic compatibility matching.
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {profiles.length > profilesPerPage && (
            <Pagination
              totalProfiles={profiles.length}
              profilesPerPage={profilesPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}

          {/* Information Section */}
          <div className="mt-4 p-4 border rounded bg-light">
            <h6>🧬 About DNA Compatibility Matching</h6>
            <p className="small mb-2">
              Our genetic compatibility analysis evaluates multiple factors to help you find the best matches:
            </p>
            <ul className="small mb-0">
              <li><strong>Emotional Chemistry:</strong> Genetic factors influencing bonding and attachment</li>
              <li><strong>Health Harmony:</strong> Shared health risks and reproductive compatibility</li>
              <li><strong>Personality Match:</strong> Genetic traits affecting behavior and stress response</li>
              <li><strong>Immune Attraction:</strong> Immune system compatibility for healthier offspring</li>
              <li><strong>Birth Defect Risk:</strong> Carrier status analysis for genetic conditions</li>
            </ul>
            <div className="mt-3 p-3 bg-white rounded border">
              <small className="text-muted">
                <strong>Note:</strong> Genetic compatibility is one factor in relationship success. 
                Always consult healthcare professionals for medical advice.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAMatches;