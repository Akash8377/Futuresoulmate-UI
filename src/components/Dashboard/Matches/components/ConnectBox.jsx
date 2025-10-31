import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import check from "../../../assets/checked.png";
import { useService } from "../../../../context/ServiceContext";
import config from "../../../../config";

const ConnectBox = ({ id, profileId, onConnectionSent }) => {
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { serviceData, updateServiceUsage } = useService(); // Use the context
  const [isSending, setIsSending] = useState(false);

  const handleConnectClick = async () => {
    if (!serviceData.plan_name || !serviceData.service_found) {
      toast.info("Please upgrade your plan to use the connect feature.");
      navigate("/upgrade-profile");
      return;
    }

    if (serviceData.uses_left <= 0) {
      toast.info("No connection requests left in your current plan.");
      navigate("/upgrade-profile");
      return;
    }

    setIsSending(true);

    try {
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

      await axios.post(`${config.baseURL}/api/notifications/send`, {
        receiver_user_id: id,
        receiver_profile_id: profileId,
        sender_user_id: user?.user_id,
        sender_profile_id: user?.profileId,
        type: "connect",
        message: `${user?.first_name} wants to connect with you`,
      });
      
      toast.success("Connection request sent successfully!");
      
      // Update the shared service context
      updateServiceUsage(
        serviceResult.service_used || (serviceData.used + 1),
        serviceResult.uses_left || Math.max(0, serviceData.max_uses - (serviceData.used + 1))
      );

      if (onConnectionSent) {
        onConnectionSent(id);
      }
      
    } catch (error) {
      console.error("Error sending connection request", error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setIsSending(false);
    }
  };

  const isConnectDisabled = isSending || serviceData.loading || serviceData.uses_left <= 0 || !serviceData.service_found;

  // if (serviceData.loading) {
  //   return (
  //     <div className="text-center" id="connectBox">
  //       <div className="small text-muted mb-2">Like this profile?</div>
  //       <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
  //       <div>
  //         <button className="btn btn-outline-secondary btn-sm" disabled>
  //           Loading...
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="text-center" id="connectBox">
      <div className="small text-muted mb-2">Like this profile?</div>
      <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
      
      {/* Show remaining connections - reduced size */}
      {serviceData.service_found && (
        <div className="small mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
          <strong>{serviceData.used}/{serviceData.max_uses}</strong> connects
        </div>
      )}
      
      <div>
        <button 
          className="btn btn-outline-success btn-sm" 
          id="connectBtn" 
          onClick={handleConnectClick}
          // disabled={isConnectDisabled}
          style={{cursor: isConnectDisabled ? "not-allowed" : "pointer"}}
          title={
            !serviceData.service_found
              ? "Connect feature not available in your plan"
              : serviceData.uses_left <= 0
              ? "No connection requests left, upgrade your plan!"
              : "Send connection request"
          }
        >
          {isSending ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Sending...
            </>
          ) : (
            "Connect Now"
          )}
        </button>
      </div>

      {/* Show upgrade prompt if no service available */}
      {serviceData.plan_name && !serviceData.service_found && (
        <div className="small text-warning mt-1" style={{ fontSize: '0.7rem' }}>
          Upgrade to connect
        </div>
      )}
    </div>
  );
};

export default ConnectBox;
