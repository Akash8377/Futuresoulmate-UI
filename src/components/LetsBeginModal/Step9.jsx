// Step9.jsx
import React, { useState } from "react";

const Step9 = ({ formData, setFormData, prevStep, onSubmit}) => {
  const [profileDescription, setProfileDescription] = useState(
    `It is a pleasure sharing a few words about my ${formData.person === "myself" ? "self" : formData.person}.
He is currently living in ${formData.city}. With hard work and determination in achieving his goals, he has built a successful career. He needs a loving and caring girl who can be with him in all ups and downs of life.`
  );
  const [excludeFromAffiliates, setExcludeFromAffiliates] = useState(false);
  const [startLoading, setStartLoading] = useState(false)
  const handleSubmit = () => {
    setStartLoading(true)
    onSubmit({
      ...formData,
      profileDescription,
      excludeFromAffiliates,
    });
  };

  return (
    <div className="step9">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>

      <div className="form-basic">
        <p className="text-center">
          We have added a short description about {formData.firstName}
        </p>
        <h5 className="modal-title">Her Name</h5>
        <textarea
          value={profileDescription}
          onChange={(e) => setProfileDescription(e.target.value)}
          style={{ width: "100%", height: "150px", padding: "10px", fontSize: "14px" }}
        />
        <input
          type="checkbox"
          id="Profile"
          name="Profile"
          checked={excludeFromAffiliates}
          onChange={(e) => setExcludeFromAffiliates(e.target.checked)}
        />
        <label htmlFor="Profile" style={{ fontSize: "10px" }} className="px-1">
          {" "}
          Do not add my Profile to Future Soulmate affiliated Matchmaking services
        </label>
        <br />
        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={handleSubmit}
          >
            { startLoading ? "Creating...":"Create Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step9;