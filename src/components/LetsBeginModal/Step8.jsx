// Step8.jsx
import React, {useState} from "react";
import { OCCUPATIONS, PROFESSIONS } from "../../constants/formData";

const Step8 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [billingType, setBillingType] = useState("yearly");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (type) => {
    setBillingType(type);
  };
  const professionGroups = Object.entries(PROFESSIONS).map(([group, options]) => ({
    group,
    options
  }));

  return (
    <div className="step8">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/suitcase.png" alt="Suitcase" />
      </div>
      <div className="form-basic">
        <p className="text-center">You are almost done!</p>

        <div className="toggle-container">
          <input
            type="radio"
            id="yearly"
            value="yearly"
            name="incomePer"
            checked={formData.incomePer === "yearly"}
            onChange={handleChange}
          />
          <label htmlFor="yearly" className="toggle-option">
            Yearly
          </label>

          <input
            type="radio"
            id="monthly"
            value="monthly"
            name="incomePer"
            checked={formData.incomePer === "monthly"}
            onChange={handleChange}
          />
          <label htmlFor="monthly" className="toggle-option">
            Monthly
          </label>
        </div>

        <h5 className="modal-title">Income</h5>
        <div className="select-control">
          <select
            className="form-control"
            name="income"
            value={formData.income}
            onChange={handleChange}
          >
            <option value="">Select Income</option>
            <option value="24999">$25,000</option>
            <option value="49999">$49,999</option>
            <option value="74999">$74,999</option>
            <option value="99999">$99,999</option>
            <option value="149999">$149,999</option>
            <option value="199999">$199,999</option>
            <option value="200000">$200,000</option>
            <option value="250000">$250,000+</option>
          </select>
        </div>

        <h5 className="modal-title">Work Details</h5>
        <div className="select-control">
          <select
            className="form-control"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
          >
            {OCCUPATIONS.map((occupation) => (
              <option key={occupation.value} value={occupation.value}>
                {occupation.label}
              </option>
            ))}
          </select>
        </div>

        <h5 className="modal-title">He Works As</h5>
        <div className="select-control">
          <select
            className="form-control"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          >
            <option value="">Select Profession</option>
            {Object.entries(PROFESSIONS).map(([category, options]) => (
              <optgroup key={category} label={category}>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.income || !formData.workType || !formData.profession}
          >
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step8;