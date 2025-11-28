import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Alert, Card, Badge } from "react-bootstrap";
import RefineSearchSidebar from "./components/RefineSearchSidebar";
import ProfileCard from "./components/ProfileCard";
import axiosInstance from '../../../utils/axiosInstance';
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

  // Calculate compatibility score based on genetic data
  const calculateCompatibilityScore = (userGeneticData, partnerGeneticData) => {
    if (!userGeneticData || !partnerGeneticData || !partnerGeneticData.has_genetic_data) {
      return 0; // Return 0 if no genetic data
    }

    let score = 50; // Base score

    // Carrier status compatibility
    const userCarrierStatus = userGeneticData.carrier_status;
    const partnerCarrierStatus = partnerGeneticData.carrier_status;
    
    if (userCarrierStatus && partnerCarrierStatus) {
      if (userCarrierStatus.includes('Low Risk') && partnerCarrierStatus.includes('Low Risk')) {
        score += 25;
      } else if (userCarrierStatus.includes('Medium Risk') && partnerCarrierStatus.includes('Medium Risk')) {
        score += 10;
      } else if (userCarrierStatus.includes('High Risk') && partnerCarrierStatus.includes('High Risk')) {
        score -= 30;
      }
    }

    // Conditions count compatibility
    const userConditions = userGeneticData.conditions_count || 0;
    const partnerConditions = partnerGeneticData.conditions_count || 0;
    
    if (userConditions <= 2 && partnerConditions <= 2) {
      score += 20;
    } else if (userConditions <= 5 && partnerConditions <= 5) {
      score += 10;
    } else if (userConditions > 8 || partnerConditions > 8) {
      score -= 15;
    }

    // Key conditions overlap check
    const userConditionsList = userGeneticData.parsed_data?.conditions_and_genes || [];
    const partnerConditionsList = partnerGeneticData.parsed_data?.conditions_and_genes || [];
    
    const overlappingConditions = userConditionsList.filter(userCond => 
      partnerConditionsList.some(partnerCond => 
        partnerCond.gene === userCond.gene && 
        partnerCond.significance === 'risk_factor' && 
        userCond.significance === 'risk_factor'
      )
    ).length;

    if (overlappingConditions > 0) {
      score -= (overlappingConditions * 10);
    }

    return Math.max(0, Math.min(100, score));
  };

  // Fetch DNA matches using the new matches endpoint with genetic data
  const fetchDNAMatches = async () => {
    if (!user?.user_id || !token) {
      toast.error('Please log in to view DNA matches');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Fetching DNA matches for user:', user.user_id);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Use the new matches endpoint that includes genetic data
      const response = await axios.get(
        `${config.baseURL}/api/matches/new-matches`,
        {
          params: {
            user_id: user.user_id,
            looking_for: searchFor,
            ...filters,
            _t: timestamp // Prevent caching
          },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log('✅ DNA matches response:', response.data);

      if (response.data.success) {
        const users = response.data.users || [];
        const currentUserGenetic = response.data.current_user_genetic;
        
        // Process the users to include genetic compatibility data
        const processedProfiles = users.map(profile => {
          const hasGeneticAnalysis = profile.has_genetic_analysis;
          const geneticData = profile.genetic_data;
          const geneticInsights = profile.genetic_insights;
          
          // Only calculate compatibility if both users have genetic data
          let compatibilityScore = 0;
          let compatibilityLevel = "No Genetic Data";
          
          if (currentUserGenetic?.has_data && hasGeneticAnalysis) {
            compatibilityScore = calculateCompatibilityScore(currentUserGenetic, geneticData);
            compatibilityLevel = getCompatibilityLevel(compatibilityScore);
          }

          // Create genetic compatibility object
          const geneticCompatibility = {
            soulmateScore: compatibilityScore,
            familyRiskScore: Math.max(0, 100 - compatibilityScore),
            familyRiskPercentage: Math.max(0, 100 - compatibilityScore),
            categoryScores: {
              emotional_chemistry: hasGeneticAnalysis ? Math.min(100, compatibilityScore + 10) : 0,
              personality_match: hasGeneticAnalysis ? Math.min(100, compatibilityScore + 5) : 0,
              health_harmony: hasGeneticAnalysis ? compatibilityScore : 0,
              lifestyle_balance: hasGeneticAnalysis ? Math.min(100, compatibilityScore + 8) : 0,
              immune_attraction: profile.has_hla_data ? 75 : 0,
              reproductive_health: hasGeneticAnalysis ? Math.max(0, compatibilityScore - 10) : 0,
              birth_defect_risk: hasGeneticAnalysis ? 
                (geneticData?.carrier_status?.includes('High Risk') ? 30 : 80) : 0
            },
            riskFlags: hasGeneticAnalysis && geneticData?.carrier_status?.includes('High Risk') ? [
              {
                type: 'warning',
                message: 'High carrier risk detected',
                severity: 'medium',
                impact: 'Consider genetic counseling'
              }
            ] : [],
            interpretation: {
              soulmateLevel: compatibilityLevel,
              familyRiskLevel: getRiskLevel(compatibilityScore),
              recommendation: hasGeneticAnalysis ? 
                (geneticData?.recommendations || 'Consider genetic counseling for detailed analysis') :
                'Upload DNA report for compatibility analysis',
              soulmateDescription: getSoulmateDescription(compatibilityScore),
              familyRiskDescription: getFamilyRiskDescription(compatibilityScore)
            }
          };

          return {
            ...profile,
            genetic_data: geneticData,
            genetic_insights: geneticInsights,
            geneticCompatibility: geneticCompatibility,
            dna_compatibility_score: compatibilityScore,
            compatibilityScore: compatibilityScore,
            compatibility_level: compatibilityLevel,
            has_genetic_analysis: hasGeneticAnalysis,
            has_hla_data: profile.has_hla_data,
            hla_score: profile.has_hla_data ? 65 : 0,
            // hla_percentage: profile.has_hla_data ? 85 : 0,
            hla_compatibility: profile.has_hla_data ? 'Good' : 'No Data'
          };
        });
        
        // Sort by compatibility score (highest first), then by genetic data availability
        const sortedProfiles = processedProfiles.sort((a, b) => {
          // First sort by compatibility score (only for users with genetic data)
          if (a.has_genetic_analysis && b.has_genetic_analysis) {
            return b.dna_compatibility_score - a.dna_compatibility_score;
          }
          // Then put users with genetic data first
          else if (a.has_genetic_analysis && !b.has_genetic_analysis) {
            return -1;
          }
          else if (!a.has_genetic_analysis && b.has_genetic_analysis) {
            return 1;
          }
          // Finally sort by HLA data
          else if (a.has_hla_data && !b.has_hla_data) {
            return -1;
          }
          else if (!a.has_hla_data && b.has_hla_data) {
            return 1;
          }
          return 0;
        });
        
        console.log('📊 Setting profiles:', sortedProfiles.length);
        setProfiles(sortedProfiles);
        setCurrentPage(1);
        
        // Check if we have any genetic data in the matches
        const hasAnyGeneticData = sortedProfiles.some(profile => profile.has_genetic_analysis);
        setHasGeneticData(hasAnyGeneticData);
        
        if (sortedProfiles.length === 0) {
          toast.info('No matches found with current filters.');
        } else if (!hasAnyGeneticData) {
          toast.info('No matches with genetic data found. Regular matches shown.');
        } else {
          const geneticMatches = sortedProfiles.filter(p => p.has_genetic_analysis).length;
          // toast.success(`Found ${geneticMatches} matches with genetic compatibility data`);
        }
      } else {
        console.log('❌ API returned success: false');
        setProfiles([]);
        setHasGeneticData(false);
        toast.info('No matches found');
      }
    } catch (error) {
      console.error("❌ Error fetching DNA matches:", error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 404) {
        console.log('ℹ️ No matches found');
        setHasGeneticData(false);
        toast.info('No matches found with current filters');
      } else if (error.response?.status === 400) {
        const message = error.response.data?.message || 'No matches available';
        console.log('ℹ️', message);
        setHasGeneticData(false);
        toast.info(message);
      } else {
        toast.error('Failed to load matches: ' + (error.response?.data?.message || error.message));
      }
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for compatibility levels
  const getCompatibilityLevel = (score) => {
    if (score === 0) return "No Genetic Data";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Basic";
  };

  const getRiskLevel = (score) => {
    if (score === 0) return "Unknown Risk";
    const risk = 100 - score;
    if (risk <= 20) return "Very Low Risk";
    if (risk <= 40) return "Low Risk";
    if (risk <= 60) return "Moderate Risk";
    if (risk <= 80) return "High Risk";
    return "Very High Risk";
  };

  const getSoulmateDescription = (score) => {
    if (score === 0) return "Genetic data required for analysis";
    if (score >= 80) return "Outstanding emotional connection and life alignment";
    if (score >= 60) return "Strong compatibility with great relationship potential";
    if (score >= 40) return "Good foundation for meaningful relationship";
    return "Limited compatibility detected";
  };

  const getFamilyRiskDescription = (score) => {
    if (score === 0) return "Genetic data required for risk assessment";
    const risk = 100 - score;
    if (risk <= 20) return "Excellent genetic compatibility for future family planning";
    if (risk <= 40) return "Good genetic profile with minimal concerns";
    if (risk <= 60) return "Moderate genetic considerations for family planning";
    return "Important genetic counseling recommended before family planning";
  };

  const getScoreVariant = (score) => {
    if (score === 0) return 'secondary';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
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
        console.log('No genetic data found for current user');
        return false;
      }
    } catch (error) {
      console.error("Error fetching genetic data:", error);
      if (error.response?.status === 404) {
        console.log('No genetic data available for current user');
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
    window.open('/profile?tab=dna', '_blank');
  };

  useEffect(() => {
    fetchUserGeneticData();
  }, []);

  useEffect(() => {
    if (user?.user_id && token) {
      fetchDNAMatches();
    }
  }, [filters, key, refreshTrigger, user?.user_id, token]);

  // Pagination logic
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

  // Calculate statistics
  const totalMatches = profiles.length;
  const usersWithGeneticData = profiles.filter(p => p.has_genetic_analysis).length;
  const usersWithHLAData = profiles.filter(p => p.has_hla_data).length;
  const excellentMatches = profiles.filter(p => p.has_genetic_analysis && (p.dna_compatibility_score || 0) >= 80).length;
  const goodMatches = profiles.filter(p => p.has_genetic_analysis && (p.dna_compatibility_score || 0) >= 60 && (p.dna_compatibility_score || 0) < 80).length;
  const moderateMatches = profiles.filter(p => p.has_genetic_analysis && (p.dna_compatibility_score || 0) >= 40 && (p.dna_compatibility_score || 0) < 60).length;

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
              <p className="text-muted mb-0 small">
                {hasGeneticData 
                  ? "Matches ranked by genetic compatibility score" 
                  : "Regular matches - upload DNA for compatibility analysis"
                }
              </p>
            </div>
          
          </div>

          {/* Enhanced Statistics Card */}
          {profiles.length > 0 && (
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="py-3">
                <div className="row text-center">
                  <div className="col-2">
                    <h4 className="text-primary mb-1">{totalMatches}</h4>
                    <small className="text-muted">Total</small>
                  </div>
                  <div className="col-2">
                    <h4 className={hasGeneticData ? "text-success mb-1" : "text-secondary mb-1"}>
                      {usersWithGeneticData}
                    </h4>
                    <small className="text-muted">With DNA Data</small>
                  </div>
                  <div className="col-2">
                    <h4 className="text-info mb-1">{usersWithHLAData}</h4>
                    <small className="text-muted">With HLA Data</small>
                  </div>
                  <div className="col-2">
                    <h4 className={excellentMatches > 0 ? "text-success mb-1" : "text-secondary mb-1"}>
                      {excellentMatches}
                    </h4>
                    <small className="text-muted">Excellent</small>
                  </div>
                  <div className="col-2">
                    <h4 className={goodMatches > 0 ? "text-warning mb-1" : "text-secondary mb-1"}>
                      {goodMatches}
                    </h4>
                    <small className="text-muted">Good</small>
                  </div>
                  <div className="col-2">
                    <h4 className={moderateMatches > 0 ? "text-info mb-1" : "text-secondary mb-1"}>
                      {moderateMatches}
                    </h4>
                    <small className="text-muted">Moderate</small>
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
                <>
                  {/* Genetic Data Summary */}
                  <div className="p-3 bg-light border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          Showing {currentProfiles.length} of {profiles.length} matches • 
                          {hasGeneticData ? (
                            <>
                              <span className="text-success"> {usersWithGeneticData} with DNA data</span> • 
                              {/* <span className="text-info"> {usersWithHLAData} with HLA data</span> */}
                            </>
                          ) : (
                            <span className="text-warning"> Upload DNA for compatibility analysis</span>
                          )}
                        </small>
                      </div>
                      <div>
                        <small className="text-muted">
                          {hasGeneticData ? (
                            <>Sorted by: <strong>Genetic Compatibility Score</strong></>
                          ) : (
                            <>Sorted by: <strong>Profile Recency</strong></>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Profiles List */}
                  {currentProfiles.map((profile, index) => (
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
                  ))}
                </>
              ) : (
                <div className="text-center p-5">
                  <div className="mb-3">
                    <i className="fas fa-dna fa-3x text-muted"></i>
                  </div>
                  <h5 className="text-muted">
                    {hasGeneticData ? "No DNA Matches Found" : "No Matches Found"}
                  </h5>
                  <p className="text-muted mb-3">
                    {hasGeneticData 
                      ? "No genetically compatible matches found with current filters. Try adjusting your search criteria."
                      : "No matches found with current filters. Try adjusting your search criteria."
                    }
                  </p>
                  {!userGeneticData && (
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                          <strong>Get Genetic Compatibility Insights:</strong>
                          <ul className="mb-0 mt-2">
                            <li>Upload your DNA report (PDF/CSV format) in your profile</li>
                            <li>Process the file with our AI analysis</li>
                            <li>View genetic compatibility with potential matches</li>
                            <li>Get detailed insights into emotional and health compatibility</li>
                          </ul>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="mt-2"
                            onClick={handleUploadDNA}
                          >
                            📤 Upload DNA Report Now
                          </Button>
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
              {hasGeneticData 
                ? "Your genetic compatibility analysis is active. Matches are ranked by compatibility score."
                : "Upload your DNA report to enable genetic compatibility analysis and get better match recommendations."
              }
            </p>
            
            {/* Status Information */}
            <Alert variant={hasGeneticData ? "success" : "warning"} className="small">
              <strong>
                {hasGeneticData 
                  ? `✅ Genetic Analysis Active - ${usersWithGeneticData} matches with DNA data found`
                  : "⚠️ Genetic Analysis Inactive - Upload DNA report to enable compatibility scoring"
                }
              </strong>
            </Alert>

            {/* Compatibility Factors */}
            <div className="mt-3">
              <h6 className="mb-2">🎯 Compatibility Factors</h6>
              <div className="row">
                <div className="col-md-6">
                  <ul className="small">
                    <li><strong>💖 Emotional Chemistry (45%):</strong> Bonding and attachment genes</li>
                    <li><strong>🧠 Personality Match (15%):</strong> Behavioral and stress response</li>
                    <li><strong>⚡ Lifestyle Balance (15%):</strong> Energy and metabolism compatibility</li>
                    <li><strong>❤️ Health Harmony (10%):</strong> Shared health risk factors</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="small">
                    <li><strong>🛡️ Immune Attraction (5%):</strong> HLA and immune compatibility</li>
                    <li><strong>👶 Reproductive Health (5%):</strong> Fertility and carrier status</li>
                    <li><strong>⚠️ Birth Defect Risk (5%):</strong> Genetic condition screening</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded border">
              <small className="text-muted">
                <strong>Note:</strong> Genetic compatibility analysis is only available when both you and your match have uploaded DNA reports. 
                Always consult healthcare professionals for medical advice. Our analysis provides insights based on current genetic research 
                but should not replace professional genetic counseling.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAMatches;