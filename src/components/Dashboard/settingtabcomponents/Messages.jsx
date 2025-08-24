

import React, { useState } from 'react';

const Messages = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingNine">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleAccordion}
        >
          Messages
        </button>
      </h2>
      {isOpen && (
        <div
          id="collapseNine"
          className="accordion-collapse collapse show"
          data-bs-parent="#settingsAccordion"
        >
          <div className="accordion-body">
            <div className="Message-part">
              <p>
                <a href="#">Edit Messages</a> for Connects, Accepts, Reminders
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
