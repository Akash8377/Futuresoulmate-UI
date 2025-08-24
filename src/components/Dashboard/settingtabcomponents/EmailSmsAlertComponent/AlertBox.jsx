import React from "react";

const AlertBox = ({ title, description, children }) => (
  <div className="alert-box">
    <h6>{title}</h6>
    {description && (
      <>
        <h5 className="mt-3">{description}</h5>
        <p className="small-text">
          Personalized matches for you delivered via email as often as you like. 
          A very effective match-making tool.
        </p>
      </>
    )}
    {children}
  </div>
);

export default AlertBox;