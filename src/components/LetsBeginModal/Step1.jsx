// Step1.jsx
import React from "react";

const Step1 = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="step1">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/profile-icon.svg" alt="Profile" />
      </div>
      <div className="form-basic">
        <h5 className="modal-title">This Profile is for</h5>
        <div className="toggle-group">
          {["myself", "son", "daughter", "brother", "sister", "friend", "relative"].map((option) => (
            <label key={option} className="custom-radio">
              <input
                type="radio"
                name="person"
                value={option}
                checked={formData.person === option}
                onChange={handleChange}
              />
              <span className="switch-label">My {option === "myself" ? "self" : option}</span>
            </label>
          ))}
        </div>
        <h5 className="modal-title">Gender</h5>
        <div className="toggle-group">
          {["male", "female"].map((gender) => (
            <label key={gender} className="custom-radio">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={handleChange}
              />
              <span className="switch-label">{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
            </label>
          ))}
        </div>
        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.person}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1;