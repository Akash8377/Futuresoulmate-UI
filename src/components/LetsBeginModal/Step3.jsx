// Step3.jsx
import React, { useEffect, useState } from "react";
import { RELIGIONS, COMMUNITIES, COUNTRIES } from "../../constants/formData";

const Step3 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [showCommunity, setShowCommunity] = useState(false);
  const [showLivingIn, setShowLivingIn] = useState(false);

  useEffect(() => {
    if (formData.religion) {
      setShowCommunity(true);
    } else {
      setShowCommunity(false);
    }
  }, [formData.religion]);

  useEffect(() => {
    if (formData.community) {
      setShowLivingIn(true);
    } else {
      setShowLivingIn(false);
    }
  }, [formData.community]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="step3">
      <div className="left-icon1">
        <button type="button" className="backbutton" onClick={prevStep}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      <div className="icon-blk text-center">
        <img src="images/profile-icon.svg" alt="Profile" />
      </div>
      <div className="form-basic">
        <h5 className="modal-title">Your religion</h5>
        <div className="mb-3">
          <div className="select-control">
            <select
              className="form-control"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
            >
              <option value="">Select Religion</option>
              {RELIGIONS.map((religion) => (
                <option key={religion.value} value={religion.value}>
                  {religion.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showCommunity && (
          <>
            <h5 className="modal-title mt-3">Community</h5>
            <div className="mb-3">
              <div className="select-control">
                <select
                  className="form-control"
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                >
                  <option value="">Select Community</option>
                  {COMMUNITIES.map((community) => (
                    <option key={community.value} value={community.value}>
                      {community.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {showLivingIn && (
          <>
            <h5 className="modal-title mt-3">Living in</h5>
            <div className="mb-3">
              <div className="select-control">
                <select
                  className="form-control"
                  name="livingIn"
                  value={formData.livingIn}
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={nextStep}
            disabled={!formData.religion || (showCommunity && !formData.community) || (showLivingIn && !formData.livingIn)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;