import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from 'axios';
import config from '../../../config';
import { useDispatch } from "react-redux";
import { setUser } from '../../../features/user/userSlice';
import { RASHI_OPTIONS, NAKSHATRA_OPTIONS, MANGLIK_OPTIONS, CITY_OPTIONS } from '../../../constants/formData';

const AstroDetails = ({ userInfo, token }) => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAstroOpen, setIsAstroOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contactStatus, setContactStatus] = useState("visibleToALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    birth_time: userInfo?.birth_time || "08:00",
    birth_city: userInfo?.birth_city || CITY_OPTIONS[0],
    manglik: userInfo?.manglik || "DontKnow",
    nakshatra: userInfo?.nakshatra || NAKSHATRA_OPTIONS[1].key,
    rashi: userInfo?.rashi || RASHI_OPTIONS[0].key
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const loadContactSettings = async () => {
      if (!isMainOpen) return;
      try {
        const response = await axios.get(
          `${config.baseURL}/api/profile/profile-settings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.settings?.astro_display_status) {
          setContactStatus(response.data.settings.astro_display_status);
        }
      } catch (error) {
        console.error("Failed to load contact settings:", error);
      }
    };
    loadContactSettings();
  }, [isMainOpen, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type, data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const url = type === 'settings' 
        ? '/api/profile/profile-settings' 
        : '/api/profile/astro-details';
      
      await axios.put(`${config.baseURL}${url}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (type === 'astro') {
        const updatedUser = { ...userInfo, ...data };
        dispatch(setUser({ userInfo: updatedUser, token }));
        setShowModal(false);
      }

      setSuccess(`${type === 'settings' ? 'Privacy' : 'Astro'} settings updated successfully!`);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${type} settings`);
    } finally {
      setLoading(false);
    }
  };

  const renderRadioGroup = (name, options) => (
    <div className="toggle-group">
      {options.map((option) => (
        <label key={option.key} className="custom-radio">
          <input
            type="radio"
            name={name}
            checked={formData[name] === option.key}
            onChange={() => handleRadioChange(name, option.key)}
          />
          <span className="switch-label">{option.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingFour">
          <button
            className={`accordion-button ${isMainOpen ? "" : "collapsed"}`}
            type="button"
            onClick={() => setIsMainOpen(!isMainOpen)}
          >
            Astro Details
          </button>
        </h2>

        <div
          id="collapseFour"
          className={`accordion-collapse collapse ${isMainOpen ? "show" : ""}`}
        >
          <div className="accordion-body">
            <div className="astro-details-part">
              <div className="accordion-container">
                {/* Astro Privacy Settings */}
                <div
                  className="accordion-header"
                  onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                >
                  <span>
                    Astro Privacy Settings{" "}
                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  </span>
                </div>
                <div
                  className="accordion-content"
                  style={{ display: isPrivacyOpen ? "block" : "none" }}
                >
                  <div>
                    <div className="fw-semibold mb-2">
                      Contact display status
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="contactStatus"
                        id="visibleToALL"
                        checked={contactStatus === "visibleToALL"}
                        onChange={() => setContactStatus("visibleToALL")}
                      />
                      <label className="form-check-label" htmlFor="visibleToALL">
                        Visible to all Members
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="contactStatus"
                        id="visibleToContactedAndAccepted"
                        checked={contactStatus === "visibleToContactedAndAccepted"}
                        onChange={() => setContactStatus("visibleToContactedAndAccepted")}
                      />
                      <label className="form-check-label" htmlFor="visibleToContactedAndAccepted">
                        Visible to Contacted and accepted Members
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="contactStatus"
                        id="hideFromALL"
                        checked={contactStatus === "hideFromALL"}
                        onChange={() => setContactStatus("hideFromALL")}
                      />
                      <label className="form-check-label" htmlFor="hideFromALL">
                        Hide From All
                      </label>
                    </div>
                    
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                    <div className="buttons astro-btn">
                      <button 
                        className="btn-submit"
                        onClick={() => handleSubmit('settings', { astro_display_status: contactStatus })}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                </div>

                {/* Astro Details Section */}
                <div
                  className="accordion-header"
                  onClick={() => setIsAstroOpen(!isAstroOpen)}
                >
                  <span>
                    Astro Details{" "}
                    <i className="fa fa-chevron-down" aria-hidden="true"></i>
                  </span>
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                  >
                    EDIT
                  </button>
                </div>
                <div
                  className="accordion-content"
                  style={{ display: isAstroOpen ? "block" : "none" }}
                >
                  <div className="astro-item">
                    <div>
                      <span>Time of Birth</span>
                      <small>{userInfo?.birth_time}</small>
                    </div>
                  </div>
                  <div className="astro-item">
                    <div>
                      <span>Place of Birth</span>
                      <small>{userInfo?.birth_city}</small>
                    </div>
                  </div>
                  <div className="astro-item">
                    <div>
                      <span>Manglik</span>
                      <small>{userInfo?.manglik}</small>
                    </div>
                  </div>
                  <div className="astro-item">
                    <div>
                      <span>Nakshatra</span>
                      <small>{userInfo?.nakshatra || "----"}</small>
                    </div>
                  </div>
                  <div className="astro-item">
                    <div>
                      <span>Rashi</span>
                      <small>{userInfo?.rashi || "----"}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
        className="letsbeginmodal"
      >
        <Modal.Header>
          <h5 className="modal-title" id="editModalLabel">
            Edit Astro Details
          </h5>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="btn-close"
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="astro-detail-form p-2">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="timeOfBirth" className="form-label">
                  Time of Birth
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="timeOfBirth"
                  name="birth_time"
                  value={formData.birth_time}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="placeOfBirth" className="form-label">
                  Place of Birth
                </label>
                  <input
                    type="text"
                    className="form-control"
                    id="placeOfBirth"
                    name="birth_city"
                    value={formData.birth_city}
                    onChange={handleInputChange}
                  />
              </div>
            </div>

            <div className="mb-3">
              <div className="">
                <h5 className="modal-title">Manglik Dosh</h5>
                {renderRadioGroup("manglik", MANGLIK_OPTIONS)}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="raashi" className="form-label">
                Raashi
              </label>
              <small className="d-block text-muted">
                This is based on lunar star sign.
              </small>
              <select
                className="form-select"
                id="raashi"
                name="rashi"
                value={formData.rashi}
                onChange={handleInputChange}
              >
                {RASHI_OPTIONS.map(rashi => (
                  <option key={rashi.key} value={rashi.key}>{rashi.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <div className="">
                <h5 className="modal-title">Nakshtra</h5>
                {renderRadioGroup("nakshatra", NAKSHATRA_OPTIONS)}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn w-100 py-2 btn-filled"
            onClick={() => handleSubmit('astro', formData)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AstroDetails;