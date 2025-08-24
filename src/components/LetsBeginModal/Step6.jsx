// Step6.jsx
import React from "react";
import { MARITAL_STATUS, HEIGHTS, DIETS } from "../../constants/formData";

const Step6 = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="step6">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/profileform.png" alt="Profile Form" />
      </div>
      <div className="form-basic">
        <h5 className="modal-title">Marital Status</h5>
        <div className="mb-3">
          <div className="select-control">
            <select
              className="form-control"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              {MARITAL_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h5 className="modal-title">Height</h5>
        <div className="mb-3">
          <div className="select-control">
            <select
              className="form-control"
              name="height"
              value={formData.height}
              onChange={handleChange}
            >
              {HEIGHTS.map((height) => (
                <option key={height.value} value={height.value}>
                  {height.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h5 className="modal-title">Diet</h5>
        <div className="toggle-group">
          {DIETS.map((diet) => (
            <label key={diet.value} className="custom-radio">
              <input
                type="radio"
                name="diet"
                value={diet.value}
                checked={formData.diet === diet.value}
                onChange={handleChange}
              />
              <span className="switch-label">{diet.label}</span>
            </label>
          ))}
        </div>

        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.maritalStatus || !formData.height || !formData.diet}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;