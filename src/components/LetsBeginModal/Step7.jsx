// Step7.jsx
import React from "react";

const Step7 = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="step7">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/degree.png" alt="Degree" />
      </div>
      <div className="form-basic">
        <p className="text-center">Great! Few more details</p>

        <h5 className="modal-title">Highest qualification</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="Qualification"
          />
        </div>

        <h5 className="modal-title">College Name</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="College Name"
          />
        </div>

        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.qualification || !formData.college}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step7;