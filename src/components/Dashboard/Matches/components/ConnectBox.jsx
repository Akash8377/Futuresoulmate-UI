import React from "react";
import check from "../../../assets/checked.png";

const ConnectBox = ({ handleConnectClick }) => (
  <div className="text-center" id="connectBox">
    <div className="small text-muted mb-2">Like this profile?</div>
    <img src={check} alt="Check" className="mb-2" style={{ width: "40px" }} />
    <div>
      <button className="btn btn-outline-success btn-sm" id="connectBtn" onClick={handleConnectClick}>
        Connect Now
      </button>
    </div>
  </div>
);

export default ConnectBox;
