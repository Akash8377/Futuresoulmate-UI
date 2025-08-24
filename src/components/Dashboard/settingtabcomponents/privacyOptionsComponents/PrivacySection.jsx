import React from 'react';

const PrivacySection = ({ title, isOpen, toggle, children }) => (
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button
        className={`accordion-button ${isOpen ? "" : "collapsed"}`}
        type="button"
        onClick={toggle}
      >
        {title}
      </button>
    </h2>
    <div
      className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
    >
      <div className="accordion-body">
        {children}
      </div>
    </div>
  </div>
);

export default PrivacySection;