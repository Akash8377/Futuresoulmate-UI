import React, { useState, useEffect } from "react";
import { Carousel, Badge, Accordion, ProgressBar, Alert, Modal, Button, Table } from "react-bootstrap";
import ConnectBox from "./ConnectBox";
import ContactOptions from "./ContactOptions";
import verifiedBadge from "../../../assets/verified-badge.png";
import requestedPhoto from "../../../assets/request-photo.jpg";
import config from "../../../../config";
import { calculateAge } from "../../../../utils/helpers";
import { formatLastSeen } from "../../../../utils/timeAgo";
import { useNavigate } from "react-router-dom";
import AstroModal from "./AstroModal";
import ActionMenu from "./ActionMenu";
import { blockUser, unblockUser, reportUser } from "../../../../features/user/userApi";
import { toast } from "../../../Common/Toast";
import axios from "axios";

const ProfileCard = ({ 
  profile, 
  handleConnectClick, 
  activeIndex, 
  setActiveIndex, 
  chatBoxOpen, 
  dnaMatches = false, 
  user = {}, 
  onProfileUpdate 
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAstroModal, setShowAstroModal] = useState(false);
  const [showDNAModal, setShowDNAModal] = useState(false);
  const [compatibilityReport, setCompatibilityReport] = useState(null);
  const [loadingCompatibility, setLoadingCompatibility] = useState(false);
  const navigate = useNavigate();
  const [isBlocked, setIsBlocked] = useState(false);

  const getShortDescription = (text) => {
    const words = text?.split(" ");
    if (!words || words.length <= 40) return text;
    return words.slice(0, 40).join(" ") + "...";
  };

  const handleToggleDescription = (e) => {
    e.preventDefault();
    setShowFullDescription((prev) => !prev);
  };

  // Handle profile click navigation
  const handleProfileClick = () => {
    navigate(`/profile/${profile.profileId || profile.user_id}`, {
      state: {
        profile: profile,
        currentUser: user,
        source: dnaMatches ? "dna-matches" : "regular-matches"
      }
    });
  };

  // Fetch DNA compatibility report
  const fetchDNACompatibility = async () => {
    if (!profile.user_id || !user.user_id) return;
    
    setLoadingCompatibility(true);
    try {
      const token = localStorage.getItem('token') || user.token;
      const response = await axios.get(
        `${config.baseURL}/api/genetic-markers/compatibility/${profile.user_id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setCompatibilityReport(response.data.report);
        setShowDNAModal(true);
      } else {
        toast.error('Failed to load compatibility report');
      }
    } catch (error) {
      console.error('Error fetching DNA compatibility:', error);
      if (error.response?.status === 404) {
        toast.info('Genetic data not available for compatibility calculation');
      } else {
        toast.error('Failed to load DNA compatibility report');
      }
    } finally {
      setLoadingCompatibility(false);
    }
  };

  // Calculate compatibility score from available data
  const calculateCompatibilityScore = () => {
    // Priority 1: Use DNA compatibility score if available
    if (profile.dna_compatibility_score) {
      return profile.dna_compatibility_score;
    }
    
    // Priority 2: Use DNA compatibility report overall score
    if (profile.dna_compatibility?.overall_score) {
      return profile.dna_compatibility.overall_score;
    }
    
    // Priority 3: Use genetic compatibility overall score
    if (profile.genetic_compatibility?.overall_score) {
      return profile.genetic_compatibility.overall_score;
    }
    
    // Priority 4: Use compatibilityScore
    if (profile.compatibilityScore) {
      return profile.compatibilityScore;
    }
    
    // Priority 5: Calculate from HLA score if available
    if (profile.hla_score && profile.max_hla_score) {
      const hlaPercentage = (profile.hla_score / profile.max_hla_score) * 100;
      return Math.min(100, Math.round(hlaPercentage * 0.7)); // HLA contributes 70% to overall
    }
    
    // Priority 6: Use hla_percentage directly
    if (profile.hla_percentage) {
      return Math.min(100, Math.round(profile.hla_percentage * 0.7));
    }
    
    return 0;
  };

  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Poor Match';
  };

  const getCompatibilityDetails = () => {
    const score = calculateCompatibilityScore();
    
    // Check if we have detailed DNA compatibility data
    if (profile.dna_compatibility) {
      return {
        score,
        level: profile.dna_compatibility.compatibility_level || getScoreText(score),
        hasDNAData: true,
        categories: profile.dna_compatibility.category_scores || {},
        riskFlags: profile.dna_compatibility.risk_flags || []
      };
    }
    
    // Check if we have genetic compatibility data
    if (profile.genetic_compatibility) {
      return {
        score,
        level: profile.genetic_compatibility.compatibility_level || getScoreText(score),
        hasDNAData: true,
        categories: profile.genetic_compatibility.category_scores || {},
        riskFlags: profile.genetic_compatibility.risk_flags || []
      };
    }
    
    // HLA only data
    return {
      score,
      level: getScoreText(score),
      hasDNAData: false,
      isHLAOnly: true,
      hlaScore: profile.hla_score,
      hlaPercentage: profile.hla_percentage
    };
  };

  const renderDNACompatibilityBadge = () => {
    if (!dnaMatches) return null;

    const compatibility = getCompatibilityDetails();
    const { score, level, hasDNAData, isHLAOnly } = compatibility;
    
    if (score === 0) return null;

    return (
      <Badge 
        bg={getScoreVariant(score)} 
        className="ms-2 dna-compatibility-badge"
        style={{ 
          fontSize: '0.75rem', 
          padding: '0.4rem 0.6rem', 
          cursor: 'pointer',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        onClick={fetchDNACompatibility}
        title={`${hasDNAData ? 'DNA' : 'HLA'} Compatibility: ${score}% - ${level} - Click for details`}
      >
        {hasDNAData ? '🧬' : '🩺'} {score}%
        {isHLAOnly && <small className="ms-1">(HLA)</small>}
      </Badge>
    );
  };

  const renderHLACompatibilityBadge = () => {
    if (!dnaMatches || !profile.hla_compatibility) return null;

    return (
      <Badge 
        bg={getScoreVariant(profile.hla_percentage)} 
        className="ms-2"
        style={{ 
          fontSize: '0.7rem', 
          padding: '0.3rem 0.5rem',
          cursor: 'pointer'
        }}
        title={`HLA Compatibility: ${profile.hla_compatibility} (${profile.hla_percentage}%)`}
      >
        🛡️ HLA {profile.hla_percentage}%
      </Badge>
    );
  };

  const renderDNACompatibilityModal = () => {
    if (!compatibilityReport) return null;

    const { 
      overall_score, 
      compatibility_level, 
      category_scores = {}, 
      category_details = {},
      risk_flags = [], 
      recommendations = [],
      carrier_overlap = [],
      risk_overlap = [],
      interpretation,
      couple_info = {},
      users = {}
    } = compatibilityReport;

    return (
      <Modal show={showDNAModal} onHide={() => setShowDNAModal(false)} size="xl" centered scrollable>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            🧬 FutureSoulmates Genetic Compatibility Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          
          {/* User Information */}
          {users && (
            <div className="row mb-4">
              <div className="col-6 text-center">
                <div className="p-3 border rounded bg-primary text-white">
                  <h6>Your Profile</h6>
                  <strong>{users.user?.name || 'You'}</strong>
                  <br />
                  <small>ID: {users.user?.id}</small>
                </div>
              </div>
              <div className="col-6 text-center">
                <div className="p-3 border rounded bg-success text-white">
                  <h6>Partner Profile</h6>
                  <strong>{users.partner?.name || profile.first_name + ' ' + profile.last_name}</strong>
                  <br />
                  <small>ID: {users.partner?.id || profile.user_id}</small>
                </div>
              </div>
            </div>
          )}

          {/* Header with Risk Level */}
          <div className={`text-center mb-4 p-4 border rounded ${
            overall_score < 50 ? 'bg-danger text-white' : 
            overall_score < 70 ? 'bg-warning' : 'bg-success text-white'
          }`}>
            <h2 className="mb-3">
              {overall_score < 50 ? '❌ "High Risk Pairing"' : 
               overall_score < 70 ? '⚠️ "Moderate Risk Pairing"' : 
               '✅ "Excellent Match"'}
            </h2>
            <h1 className="display-4 fw-bold mb-2">{overall_score}/100</h1>
            <h4 className="mb-3">{compatibility_level} Compatibility</h4>
            <ProgressBar 
              variant={getScoreVariant(overall_score)}
              now={overall_score} 
              style={{ height: '20px' }}
              className="mb-3"
            />
            {couple_info.summary && (
              <p className="lead mb-0" style={{ whiteSpace: 'pre-line' }}>{couple_info.summary}</p>
            )}
          </div>

          {/* Highlights */}
          {couple_info.highlights && couple_info.highlights.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">📊 Key Findings</h5>
              {couple_info.highlights.map((highlight, index) => (
                <Alert key={index} variant="info" className="small">
                  {highlight}
                </Alert>
              ))}
            </div>
          )}

          {/* Risk Flags */}
          {risk_flags.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">⚠️ Risk Assessment</h5>
              {risk_flags.map((flag, index) => (
                <Alert key={index} variant={flag.type === 'high_risk' ? 'danger' : 'warning'} className="small">
                  <div className="d-flex align-items-start">
                    <span className="me-2 fs-5">
                      {flag.type === 'high_risk' ? '🚨' : '⚠️'}
                    </span>
                    <div>
                      <strong>{flag.message}</strong>
                      {flag.genes && (
                        <div className="mt-1">
                          <small>
                            <strong>Genes:</strong> {flag.genes.join(', ')}
                          </small>
                        </div>
                      )}
                      {flag.impact && (
                        <div className="mt-1">
                          <small>
                            <strong>Impact:</strong> {flag.impact}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Compatibility Breakdown */}
          <div className="mb-4">
            <h5 className="mb-3">🧩 Compatibility Breakdown</h5>
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead className="table-dark">
                  <tr>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Genes Tested</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(category_details).map(([category, details]) => (
                    <tr key={category}>
                      <td className="text-capitalize fw-medium">
                        {getCategoryIcon(category)} {category.replace(/_/g, ' ')}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className={`badge bg-${getScoreVariant(details.score)} me-2`}>
                            {details.score}%
                          </span>
                          <ProgressBar 
                            variant={getScoreVariant(details.score)}
                            now={details.score} 
                            style={{ width: '60px', height: '6px' }}
                          />
                        </div>
                      </td>
                      <td>{details.genes_tested || 'N/A'}</td>
                      <td>
                        <small className="text-muted">{details.description}</small>
                        {details.genes && details.genes.length > 0 && (
                          <div className="mt-1">
                            <small>
                              <strong>Key Genes:</strong> {details.genes.slice(0, 3).map(g => g.gene).join(', ')}
                              {details.genes.length > 3 && '...'}
                            </small>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Carrier Overlap */}
          {carrier_overlap.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">🧬 Shared Carrier Status</h5>
              <Alert variant="danger" className="small">
                <strong>🚨 High Reproductive Risk Detected</strong>
                <div className="table-responsive mt-2">
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        <th>Gene</th>
                        <th>Condition</th>
                        <th>Your Genotype</th>
                        <th>Partner Genotype</th>
                        <th>Offspring Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrier_overlap.map((carrier, index) => (
                        <tr key={index}>
                          <td><strong>{carrier.gene}</strong></td>
                          <td>{carrier.condition}</td>
                          <td>{carrier.user_genotype || 'N/A'}</td>
                          <td>{carrier.partner_genotype || 'N/A'}</td>
                          <td className="text-danger fw-bold">{carrier.risk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Alert>
            </div>
          )}

          {/* Risk Overlap */}
          {risk_overlap.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">📈 Shared Risk Factors</h5>
              <Alert variant="warning" className="small">
                <div className="table-responsive">
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        <th>Gene</th>
                        <th>Condition</th>
                        <th>Your Genotype</th>
                        <th>Partner Genotype</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risk_overlap.map((risk, index) => (
                        <tr key={index}>
                          <td><strong>{risk.gene}</strong></td>
                          <td>{risk.condition}</td>
                          <td>{risk.user_genotype || 'N/A'}</td>
                          <td>{risk.partner_genotype || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Alert>
            </div>
          )}

          {/* Interpretation */}
          {interpretation && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h5 className="mb-3">🧩 Genetic Interpretation</h5>
              <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{interpretation}</p>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-3">💡 Recommendations</h5>
              <div className="p-3 border rounded bg-light">
                <ul className="mb-0">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="mb-2">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3 border rounded bg-light">
            <small className="text-muted">
              <strong>Disclaimer:</strong> This genetic compatibility analysis is for informational purposes only. 
              It should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult qualified healthcare professionals and genetic counselors for medical guidance.
              The analysis is based on the provided genetic data and current scientific understanding.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDNAModal(false)}>
            Close
          </Button>
          {(risk_flags.some(f => f.type === 'high_risk') || carrier_overlap.length > 0) && (
            <Button variant="danger">
              📞 Speak with Genetic Counselor
            </Button>
          )}
          <Button variant="primary">
            📋 Save Report
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      emotional_chemistry: '💖',
      personality_match: '🧠',
      health_harmony: '❤️',
      lifestyle_balance: '⚡',
      immune_attraction: '🛡️',
      polygenic_health: '🧬',
      reproductive_health: '👶',
      birth_defect_risk: '⚠️'
    };
    return icons[category] || '📊';
  };

  const handleBlock = async (blockedUserId) => {
    try {
      await blockUser(user.user_id, blockedUserId);
      setIsBlocked(true);
      onProfileUpdate();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblock = async (blockedUserId) => {
    try {
      await unblockUser(user.user_id, blockedUserId);
      setIsBlocked(false);
      onProfileUpdate();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleReport = async (reportedUserId, reason) => {
    try {
      await reportUser(user.user_id, reportedUserId, reason);
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  // Parse gallery images and include profile image as first item
  const profile_gallery_images = profile?.profile_gallery_images 
    ? JSON.parse(profile.profile_gallery_images)
    : [];
  
  let allImages = [];
  if (profile_gallery_images.length > 0) {
    allImages = [
      {
        id: 'profile-main',
        filename: profile.profile_image
      },
      ...profile_gallery_images
    ];
  }

  const compatibility = getCompatibilityDetails();

  return (
    <>
      <div className="profile-part">
        <div className="row g-0">
          <div className="col-md-4 position-relative cursor-pointer" onClick={handleProfileClick}>
            {allImages.length > 0 ? (
              <>
                <Carousel
                  activeIndex={activeIndex}
                  onSelect={setActiveIndex}
                  interval={null}
                >
                  {allImages.map((img, idx) => (
                    <Carousel.Item key={img.id || idx}>
                      <img
                        src={`${config.baseURL}/uploads/profiles/${img.filename}`}
                        className="d-block w-100"
                        alt={`Profile ${idx + 1}`}
                        style={{ height: "330px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <div
                  className="position-absolute bottom-0 start-0 px-2 py-1 text-white small"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  {`${activeIndex + 1} of ${allImages.length}`}
                </div>
              </>
            ) : (
              <div className="position-relative">
                {profile.isProtected ? (
                  <div className="profile-img">
                    <div className="lock-img">
                      <img
                        src={profile.profile_image ? `${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
                        alt="Protected Profile"
                        style={{ height: "330px", objectFit: "cover" }}
                      />
                      <div className="lock-img-text text-white">
                        <i className="fa fa-lock me-1" aria-hidden="true"></i>
                        Visible to Premium Members
                        <a href="#" className="text-white ms-2">
                          View Plans
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-img-wrapper">
                    <img
                      src={profile.profile_image ?`${config.baseURL}/uploads/profiles/${profile.profile_image}`: "/images/no-image-found.webp"}
                      alt="Profile"
                      style={{ height: "330px", objectFit: "cover" }}
                    />
                    {profile.isNew && (
                      <div className="new-photo position-absolute top-0 start-0 bg-warning text-white px-2 py-1 small">
                        New
                      </div>
                    )}
                    {profile.image === requestedPhoto && (
                      <div
                        className="request-photonew position-absolute bottom-0 start-0 w-100 text-center py-2"
                        style={{
                          backgroundColor: "#b10f62",
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        Request Photo
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="p-3">
              <h5 className="mb-1 d-flex justify-content-between align-items-center">
                <span 
                  className="profile-name-link" 
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                >
                  {profile.first_name} {profile.last_name}
                  {profile.isVerified && (
                    <img
                      src={verifiedBadge}
                      alt="Verified"
                      className="ms-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                  )}
                  {profile.linkedin_connected ? (<i className="fa fa-linkedin-square ms-1" style={{fontSize:"20px", color:"#0977af"}} aria-hidden="true"></i>):null}
                  {profile.facebook_connected ? (<i className="fa fa-facebook-square ms-1" style={{fontSize:"20px", color:"#0977af"}} aria-hidden="true"></i>):null}
                </span>
                <div className="d-flex align-items-center">
                  {/* DNA Compatibility Badge */}
                  {renderDNACompatibilityBadge()}
                  
                  {/* HLA Score (if exists) */}
                  {renderHLACompatibilityBadge()}
                  
                  {/* Action Menu */}
                  <ActionMenu 
                    profile={profile}
                    user={user}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                    onReport={handleReport}
                    isBlocked={isBlocked}
                  />
                </div>
              </h5>
              
              {/* Compatibility Level Text */}
              {dnaMatches && compatibility.score > 0 && (
                <div className="mb-2">
                  <small className={`text-${getScoreVariant(compatibility.score)} fw-bold`}>
                    {compatibility.hasDNAData ? '🧬 ' : '🩺 '}
                    {compatibility.level}
                    {compatibility.isHLAOnly && ' (HLA Compatibility)'}
                  </small>
                </div>
              )}

              <div className="d-flex gap-3 mb-2 small">
                {profile.online ? (
                  <span className="text-success">
                    <i className="fa fa-phone me-1" aria-hidden="true"></i>
                    Online now
                  </span>
                ) : (
                  <span className="text-muted">
                    {profile.online_status === "online" ? (
                      <span className="text-success">Online now</span>
                    ) : (
                      <><i className="fa fa-clock-o me-1" aria-hidden="true"></i>{`${formatLastSeen(profile.online_status)}`}</>
                    )}
                  </span>
                )}
                <span className="text-muted">
                  <i className="fa fa-users me-1" aria-hidden="true"></i> You &
                  {profile.looking_for === "Bride"?" Him":" Her"}
                </span>
                <span 
                  className="text-warning cursor-pointer"
                  onClick={() => setShowAstroModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-globe me-1" aria-hidden="true"></i> Astro
                </span>
              </div>
              <hr />
              <div className="profile-detail">
                <div className="row text-dark mb-2">
                  <div className="col-6">
                    <div>
                      <div>
                        {calculateAge(
                          profile.birth_year,
                          profile.birth_month,
                          profile.birth_day
                        )}{" "}
                        yrs, {profile.height}
                      </div>
                    </div>
                    <div>
                      {profile.religion}
                    </div>
                    <div>{profile.language}</div>
                  </div>
                  <div className="col-6">
                    <div>{profile.maritalStatus}</div>
                    <div>{profile.location}</div>
                    <div>{profile.profession}</div>
                  </div>
                </div>
              </div>
              
              {/* Loading State for DNA Compatibility */}
              {loadingCompatibility && (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading compatibility...</span>
                  </div>
                  <p className="small text-muted mt-2">Analyzing genetic compatibility...</p>
                </div>
              )}
              
              {/* DNA Compatibility Quick View */}
              {dnaMatches && compatibility.hasDNAData && compatibility.categories && (
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Genetic Compatibility Breakdown:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {Object.entries(compatibility.categories).slice(0, 4).map(([category, score]) => (
                      <Badge 
                        key={category} 
                        bg="outline-secondary" 
                        text="dark"
                        className="small"
                        style={{ fontSize: '0.65rem' }}
                      >
                        {getCategoryIcon(category)} {category.split('_')[0]}: {score}%
                      </Badge>
                    ))}
                    {Object.keys(compatibility.categories).length > 4 && (
                      <Badge bg="light" text="dark" className="small" style={{ fontSize: '0.65rem' }}>
                        +{Object.keys(compatibility.categories).length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* Regular Profile Description */}
              {!dnaMatches && (
                <p className="mb-0 text-dark fs-6">
                  {showFullDescription || profile.profile_description?.split(" ").length <= 40
                    ? profile.profile_description
                    : getShortDescription(profile.profile_description)}
                  {profile.profile_description?.split(" ").length > 40 && (
                    <a href="#" className="text-primary ms-1" onClick={handleToggleDescription}>
                      {showFullDescription ? "Less" : "More"}
                    </a>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-center justify-content-center connect-now p-2">
            {profile.connectionRequest ? (
              <ContactOptions profile={profile} chatBoxOpen={chatBoxOpen}/>
            ) : (
              <ConnectBox 
                id={profile.user_id} 
                profileId={profile.profileId}
                onConnectionSent={handleConnectClick}
              />  
            )}
          </div>
        </div>
      </div>
      
      <AstroModal 
        show={showAstroModal} 
        onHide={() => setShowAstroModal(false)} 
        profile={profile}
        currentUser={user}
        handleConnectClick={handleConnectClick}
        chatBoxOpen={chatBoxOpen}
      />
      
      {/* DNA Compatibility Modal */}
      {renderDNACompatibilityModal()}
    </>
  );
};

export default ProfileCard;