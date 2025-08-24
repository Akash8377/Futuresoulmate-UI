// Step2.jsx
import React from "react";
import { MONTHS, DAYS, YEARS } from '../../constants/formData';

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="step2">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/profile-icon.svg" alt="Profile" />
      </div>
      <div className="form-basic">
        <h5 className="modal-title">Your Name</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
        </div>
        <h5 className="modal-title">Date of birth</h5>
        <div className="mb-3">
          <div className="row select-control">
            <div className="col-md-4">
              <select
                className="form-control"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
              >
                <option value="">Day</option>
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
              >
                <option value="">Month</option>
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-control"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
              >
                <option value="">Year</option>
                {YEARS.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.firstName || !formData.lastName || !formData.birthDay|| !formData.birthMonth|| !formData.birthYear}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;