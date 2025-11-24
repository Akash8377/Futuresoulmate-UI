import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert, Card } from "react-bootstrap";
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
  const [userGeneticData, setUserGeneticData] = useState(null);
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
        const processedProfiles = response.data.users.map(profile => {
          // Calculate overall compatibility score
          const compatibilityScore = calculateOverallCompatibility(profile);
          
          return {
            ...profile,
            // Ensure genetic_compatibility is properly structured
            genetic_compatibility: profile.genetic_compatibility || {
              overall_score: compatibilityScore,
              compatibility_level: getCompatibilityLevel(compatibilityScore),
              category_scores: profile.dnaCompatibility?.categoryScores || {},
              risk_flags: profile.dnaCompatibility?.riskFlags || []
            },
            dna_compatibility: profile.dna_compatibility || null,
            dna_compatibility_score: compatibilityScore
          };
        });
        
        // Sort by compatibility score (highest first)
        const sortedProfiles = processedProfiles.sort((a, b) => 
          (b.dna_compatibility_score || 0) - (a.dna_compatibility_score || 0)
        );
        
        setProfiles(sortedProfiles);
        setCurrentPage(1);
        setHasGeneticData(true);
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

  // Calculate overall compatibility score from available data
  const calculateOverallCompatibility = (profile) => {
    // Priority 1: Use DNA compatibility overall score
    if (profile.dna_compatibility?.overall_score) {
      return profile.dna_compatibility.overall_score;
    }
    
    // Priority 2: Use compatibilityScore
    if (profile.compatibilityScore) {
      return profile.compatibilityScore;
    }
    
    // Priority 3: Calculate from DNA compatibility category scores
    if (profile.dnaCompatibility?.categoryScores) {
      const scores = Object.values(profile.dnaCompatibility.categoryScores);
      if (scores.length > 0) {
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    }
    
    // Priority 4: Use HLA percentage
    if (profile.hla_percentage) {
      return profile.hla_percentage;
    }
    
    return 0;
  };

  const getCompatibilityLevel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Poor";
  };

  const fetchUserGeneticData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return false;
      }

      // Check if user has genetic data
      const response = await axios.get(
        `${config.baseURL}/api/dna/parsed-data`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserGeneticData(response.data.data);
        
        // Update user info with genetic data
        const updatedUserInfo = {
          ...user, 
          genetic_data: response.data.data
        };
        dispatch(setUser({
          userInfo: updatedUserInfo,
          token: token,
        }));
        return true;
      } else {
        console.log('No genetic data found');
        return false;
      }
    } catch (error) {
      console.error("Error fetching genetic data:", error);
      if (error.response?.status === 404) {
        console.log('No genetic data available');
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

  const handleUploadDNA = () => {
    // Navigate to DNA upload page or open upload modal
    toast.info('Please upload your DNA file in your profile settings');
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

  // Calculate statistics
  const totalMatches = profiles.length;
  const excellentMatches = profiles.filter(p => (p.dna_compatibility_score || 0) >= 80).length;
  const goodMatches = profiles.filter(p => {
    const score = p.dna_compatibility_score || 0;
    return score >= 60 && score < 80;
  }).length;

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
            <div className="d-flex gap-2">
              {userGeneticData && (
                <Button variant="outline-success" size="sm">
                  🧬 DNA Data Loaded
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={handleUploadDNA}>
                📁 Upload DNA
              </Button>
            </div>
          </div>

          {/* Statistics Card */}
          {profiles.length > 0 && (
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="py-3">
                <div className="row text-center">
                  <div className="col-4">
                    <h4 className="text-primary mb-1">{totalMatches}</h4>
                    <small className="text-muted">Total Matches</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-success mb-1">{excellentMatches}</h4>
                    <small className="text-muted">Excellent Matches</small>
                  </div>
                  <div className="col-4">
                    <h4 className="text-warning mb-1">{goodMatches}</h4>
                    <small className="text-muted">Good Matches</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

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
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                          <strong>How to get started with DNA Matching:</strong>
                          <ul className="mb-0 mt-2">
                            <li>Upload your DNA report (PDF/CSV format)</li>
                            <li>Process the file with our AI analysis</li>
                            <li>View genetic compatibility with potential matches</li>
                            <li>Get detailed insights into health and reproductive compatibility</li>
                          </ul>
                        </div>
                      </div>
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
              Our advanced genetic compatibility analysis evaluates multiple factors to help you find the best matches:
            </p>
            <div className="row">
              <div className="col-md-6">
                <ul className="small">
                  <li><strong>💖 Emotional Chemistry:</strong> OXTR, COMT genes influencing bonding</li>
                  <li><strong>❤️ Health Harmony:</strong> Shared health risks and compatibility</li>
                  <li><strong>🧠 Personality Match:</strong> Genetic traits affecting behavior</li>
                  <li><strong>🛡️ Immune Attraction:</strong> HLA compatibility for healthier offspring</li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="small">
                  <li><strong>👶 Reproductive Health:</strong> Carrier status analysis</li>
                  <li><strong>⚠️ Birth Defect Risk:</strong> Genetic condition screening</li>
                  <li><strong>⚡ Lifestyle Balance:</strong> Metabolic and activity compatibility</li>
                  <li><strong>🧬 Polygenic Health:</strong> Overall genetic health profile</li>
                </ul>
              </div>
            </div>
            
            {/* Compatibility Score Guide */}
            <div className="mt-3 p-3 bg-white rounded border">
              <h6 className="mb-3">🎯 Compatibility Score Guide</h6>
              <div className="row text-center">
                <div className="col-3">
                  <div className="p-2 border rounded bg-success text-white">
                    <strong>80-100%</strong>
                    <br />
                    <small>Excellent</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 border rounded bg-warning">
                    <strong>60-79%</strong>
                    <br />
                    <small>Good</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 border rounded bg-danger text-white">
                    <strong>40-59%</strong>
                    <br />
                    <small>Moderate</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-2 border rounded bg-secondary text-white">
                    <strong>0-39%</strong>
                    <br />
                    <small>Poor</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded border">
              <small className="text-muted">
                <strong>Note:</strong> Genetic compatibility is one factor in relationship success. 
                Always consult healthcare professionals for medical advice. Our analysis provides 
                insights based on current genetic research but should not replace professional 
                genetic counseling.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAMatches;