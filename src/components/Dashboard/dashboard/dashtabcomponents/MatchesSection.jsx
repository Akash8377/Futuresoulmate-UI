import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUsersByLookingForQuery } from "./slice/matchSlice";
import calculateAge from "../../../Common/commonfunctions";
import config from "../../../../config";
import axios from "axios";
import { toast } from "../../../Common/Toast";
import { useConnection } from "./ConnectionContext";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ data, showAll, handleConnect }) => {
  const { connections } = useConnection();
  return (
    <>
      {data.slice(0, showAll ? data.length : 2).map((match, i) => (
        <div className="match-row d-flex align-items-center mb-3" key={i}>
          <img src={match.profile_image ? `${config.baseURL}/uploads/profiles/${match.profile_image}` : "images/womenpic.jpg"} alt={match.name} style={{ width: 60, height: 60, borderRadius: "50%" }} />
          <div className="flex-grow-1 ms-3">
            <span className="name-line fw-bold">{match.first_name} {match.last_name}</span>
            {/* {match.isVip && (
              <span className="vip-badge ms-1 text-danger">
                <i className="fa fa-diamond" aria-hidden="true"></i> +
              </span>
            )} */}
            {/* {match.isCrown && (
              <span className="crown-badge ms-1 text-warning">
                <i className="fa fa-diamond" aria-hidden="true"></i>
              </span>
            )} */}
            {match.isNew && <span className="new-pill ms-1 badge bg-success">New</span>}
            <br />   
             {calculateAge(match.birth_day, match.birth_month, match.birth_year)} years, {match.height}, {match.language}, {match.city}
            <br />
            {match.profession}
          </div>
          {connections[match.user_id] === 1 || match.connectionRequest === 1 ? (<a className="btn-connect text-decoration-none text-center"><span className="small pe-2">Connected</span></a>):(<a href="#" className="btn-connect text-decoration-none text-center" 
           onClick={() => handleConnect(match.user_id, match.profileId)}>
            <i className="fa fa-check-circle-o" aria-hidden="true"></i>
            <br />
            <span className="small">Connect Now</span>
          </a>)}
        </div>
      ))}
    </>
  );
};

const MatchesSection = () => {
    const user = useSelector((state) => state.user.userInfo)
    const token = useSelector((state) => state.user.token)
    const navigate = useNavigate()
    const searchFor = user?.looking_for === "Bride" ? "Groom" : "Bride";
    const { data, isLoading, isError } = useGetUsersByLookingForQuery({
      id: user.id,
      looking_for: searchFor
    });
    const [premiumMatches, setPremiumMatches] = useState([]);
    const [newMatches, setNewMatches] = useState([]);
    const [showPremiumAll, setShowPremiumAll] = useState(false);
    const [showNewAll, setShowNewAll] = useState(false);
    const {updateConnection } = useConnection();


    useEffect(() => {
      if (data?.success && Array.isArray(data.users)) {
        const updatedUsers = data.users.map((user) => ({
          ...user,
          language: user.language || "Hindi", 
          isNew: user.isNew || true,                        
          isCrown: user.isCrown || true,  
          isVip: user.isVip || true                     
        }));

        setPremiumMatches(updatedUsers);
        setNewMatches(updatedUsers);
      }
    }, [data]);

    const handleConnect = async (id, profileId, userName) => {
  if (!user.plan_name || user.plan_name === null) {
    toast.info("Please upgrade your plan to use the connect feature.");
    navigate("/upgrade-profile");
    return;
  }

  // Update UI immediately
  setPremiumMatches(prev => prev.map(p => 
    p.id === id ? { ...p, connectionRequest: 1 } : p
  ));
  setNewMatches(prev => prev.map(p => 
    p.id === id ? { ...p, connectionRequest: 1 } : p
  ));
  updateConnection(id, 1);

  try {
    // First, use the Shortlist service
    const serviceResponse = await fetch(`${config.baseURL}/api/profile/service/use`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ serviceName: 'Shortlist' })
    });

    const serviceResult = await serviceResponse.json();
    
    if (!serviceResult.success) {
      throw new Error(serviceResult.message || 'Failed to use connection service');
    }

    // Then send the connection notification
    await axios.post(`${config.baseURL}/api/notifications/send`, {
      receiver_user_id: id,
      receiver_profile_id: profileId,
      sender_user_id: user?.user_id,
      sender_profile_id: user?.profileId,
      type: "connect",
      message: `${user?.first_name} wants to connect with you`,
    });

    // Show remaining connects in toast
    const remainingConnects = serviceResult.uses_left || serviceResult.services_left?.Shortlist;
    const message = remainingConnects !== undefined 
      ? `Connection request sent successfully! ${remainingConnects} connects remaining.`
      : `Connection request sent successfully! 0 connects remaining.`;

    toast.success(message);

  } catch (error) {
    // Revert UI on error
    setPremiumMatches(prev => prev.map(p => 
      p.id === id ? { ...p, connectionRequest: 0 } : p
    ));
    setNewMatches(prev => prev.map(p => 
      p.id === id ? { ...p, connectionRequest: 0 } : p
    ));
    updateConnection(id, 0);
    if (error.message) {
      if(error.message === "No Shortlist uses left for your Premium plan"){
        toast.info(error.message);
        navigate("/upgrade-profile");
      }else  
        toast.error(error.message);
    } else {
      toast.error("Failed to send connection request");
    }
  }
};

  if (isLoading) return <p>Loading matches...</p>;
  if (isError) return <p>Error loading matches.</p>;

  // console.log(premiumMatches, "premiumMatches");

  return (
    <div className="row g-4 mt-4">
      {/* Premium Matches */}
      <div className="col-lg-6">
        <div className="card-lite p-3">
          <h6>
            Premium Matches <span className="badge bg-danger ms-1">{premiumMatches?.length}</span>
          </h6>
          <div className="match-card" id="premiumMatches">
            <MatchCard data={premiumMatches} showAll={showPremiumAll} handleConnect={handleConnect}/>
            <span
              className="view-all-link  cursor-pointer"
              onClick={() => setShowPremiumAll(!showPremiumAll)}
            >
              {showPremiumAll ? "View Less" : "View All"}
            </span>
          </div>
        </div>
      </div>

      {/* New Matches */}
      <div className="col-lg-6">
        <div className="card-lite p-3">
          <h6>
            New Matches <span className="badge bg-danger ms-1">{newMatches?.length}</span>
          </h6>
          <div className="match-card" id="newMatches">
            <MatchCard data={newMatches} showAll={showNewAll} handleConnect={handleConnect} />
            <span
              className="view-all-link  cursor-pointer"
              onClick={() => setShowNewAll(!showNewAll)}
            >
              {showNewAll ? "View Less" : "View All"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesSection;
