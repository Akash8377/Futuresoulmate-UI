import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import config from "../../../../config";
import axios from "axios";
import calculateAge from "../../../Common/commonfunctions";
import { useGetUsersByLookingForQuery } from "./slice/matchSlice";
import { toast } from "../../../Common/Toast";
import { useConnection } from "./ConnectionContext";
import { useNavigate } from "react-router-dom";

// Custom Arrow Components
function SampleNextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0977af",
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        right: "-15px",
        zIndex: 2,
      }}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0977af",
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        left: "-15px",
        zIndex: 2,
      }}
    />
  );
}


const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1 },
    },
  ],
};

const RecentVisitors = () => {
    const [visitor, setVisitors] = useState([]);  
    const user = useSelector((state) => state.user.userInfo)
    const token = useSelector((state) => state.user.token)
    const { connections, updateConnection } = useConnection();
    const navigate = useNavigate()
    const lookingFor = user?.looking_for;
    const searchFor = lookingFor === "Bride" ? "Groom" : "Bride";
    const { data, isLoading, isError } = useGetUsersByLookingForQuery({
      id: user.id,
      looking_for: searchFor
    });
    useEffect(() => {
     if (data?.success && Array.isArray(data.users)) {
       setVisitors(data.users);
     }
   }, [data]);

    const handleConnect = async (id, profileId, userName) => {
  if (!user.plan_name || user.plan_name === null) {
    toast.info("Please upgrade your plan to use the connect feature.");
    navigate("/upgrade-profile");
    return;
  }

  // Update UI immediately
  setVisitors(prev => prev.map(p => 
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
    setVisitors(prev => prev.map(p => 
      p.id === id ? { ...p, connectionRequest: 0 } : p
    ));
    updateConnection(id, 0);
    
    console.error("Error sending connection request:", error);
    
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading visitors</p>;

  return (
    <div className="recent-visitor mt-5 px-3 position-relative">
      <h6 className="mb-3">
        Recent Visitors{" "}
        <span className="badge bg-danger ms-2">{visitor.length}</span>
      </h6>

      <Slider {...settings}>
        {visitor.map((visitor, index) => (
          <div key={index}>
            <div className="profile-blk text-center px-2">
              <div className="img-profile mb-2">
                <img
                  src={visitor.profile_image ? `${config.baseURL}/uploads/profiles/${visitor.profile_image}` : "images/womenpic.jpg"}
                   alt={`${visitor.first_name} ${visitor.last_name}`}
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
              </div>
              <h6>{visitor.first_name}{" "}{visitor.last_name}</h6>
              <p className="text-muted" style={{ fontSize: "14px" }}>
              {calculateAge(visitor.birth_day, visitor.birth_month, visitor.birth_year)} years, {visitor.height}, {visitor.language},{" "}
                {visitor.city}
              </p>
              {connections[visitor.user_id] === 1 || visitor.connectionRequest === 1 ? (<p style={{
                    color: "#0977af",
                    padding: "6px 16px",
                    fontWeight: "bold",
                  }}>Connected</p>):(<div className="connect-btn mt-2">
                <a
                  href="#"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#0977af",
                    color: "#fff",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleConnect(visitor.user_id, visitor.profileId)}
                >
                  Connect Now
                </a>
              </div>)}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecentVisitors;
