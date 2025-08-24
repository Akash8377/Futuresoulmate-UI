import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUsersByLookingForQuery } from "./slice/matchSlice";
import calculateAge from "../../Common/commonfunctions";
import config from "../../../config";
import axios from "axios";
import { toast } from "../../Common/Toast";
import { useConnection } from "./ConnectionContext";


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

        const handleConnect = async (id, profileId) => {
          setPremiumMatches(prev => prev.map(p => 
            p.id === id ? { ...p, connectionRequest: 1 } : p
          ));
          setNewMatches(prev => prev.map(p => 
            p.id === id ? { ...p, connectionRequest: 1 } : p
          ));
          updateConnection(id, 1);
          try {
            await axios.post(`${config.baseURL}/api/notifications/send`, {
              receiver_user_id: id,
              receiver_profile_id: profileId,
              sender_user_id: user?.id,
              sender_profile_id: user?.profileId,
              type: "connect",
              message: `${user?.first_name} wants to connect with you`,
            });
            toast.success("Request sent successfully");
          } catch (error) {
            updateConnection(id, 0);
            console.error("Error sending notification", error);
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
              className="view-all-link text-primary cursor-pointer"
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
              className="view-all-link text-primary cursor-pointer"
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
