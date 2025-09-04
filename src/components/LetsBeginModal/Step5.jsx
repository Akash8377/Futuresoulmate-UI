// Step5.jsx
import React, { useState } from "react";
import { SUBCOMMUNITIES } from "../../constants/formData";

const Step5 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [livesWithFamily, setLivesWithFamily] = useState("yes");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFamilyChange = (value) => {
    setLivesWithFamily(value);
  };

  return (
    <div className="step5">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/location.png" alt="Location" />
      </div>
      <div className="form-basic">
        <p className="text-center">Now let's build your Profile</p>

        <h5 className="modal-title">City</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
        <h5 className="modal-title">You lives with her family?</h5>
        <div className="toggle-group">
          <label className="custom-radio">
            <input
              type="radio"
              name="livesWithFamily"
              value="yes"
              checked={livesWithFamily === "yes"}
              onChange={() => handleFamilyChange("yes")}
            />
            <span className="switch-label">Yes</span>
          </label>

          <label className="custom-radio">
            <input
              type="radio"
              name="livesWithFamily"
              value="no"
              checked={livesWithFamily === "no"}
              onChange={() => handleFamilyChange("no")}
            />
            <span className="switch-label">No</span>
          </label>
        </div>

        {livesWithFamily === "no" && (
          <div style={{ marginTop: "10px" }}>
            <h5 className="modal-title">Family Location</h5>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="familyCity"
                value={formData.familyCity}
                onChange={handleChange}
                placeholder="City Her Family Lives"
              />
            </div>
          </div>
        )}

        
        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={
              !formData.city ||
              (livesWithFamily === "no" && !formData.familyCity)
            }
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5;
