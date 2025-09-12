// AstroDetailsModal.js
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import config from "../../../../config";
import { RASHI_OPTIONS, NAKSHATRA_OPTIONS, MANGLIK_OPTIONS } from '../../../../constants/formData';
import { setUser } from '../../../../features/user/userSlice';
import { toast } from "../../../Common/Toast";

const AstroDetailsModal = ({ show, onHide, currentUser }) => {
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    birth_time: currentUser?.birth_time || "08:00",
    birth_city: currentUser?.birth_city || "",
    manglik: currentUser?.manglik || "DontKnow",
    nakshatra: currentUser?.nakshatra || NAKSHATRA_OPTIONS[1].key,
    rashi: currentUser?.rashi || RASHI_OPTIONS[0].key
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        birth_time: currentUser?.birth_time || "08:00",
        birth_city: currentUser?.birth_city || "",
        manglik: currentUser?.manglik || "DontKnow",
        nakshatra: currentUser?.nakshatra || NAKSHATRA_OPTIONS[1].key,
        rashi: currentUser?.rashi || RASHI_OPTIONS[0].key
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      await axios.put(`${config.baseURL}/api/profile/astro-details`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = { ...currentUser, ...formData };
      dispatch(setUser({ userInfo: updatedUser, token }));
      onHide();
      
      setSuccess("Astro details updated successfully!");
      setTimeout(() => setSuccess(""), 2000);
      toast.success("Astro details updated successfully!")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update astro details");
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
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      className="letsbeginmodal"
      style={{ zIndex: 9999 }}
    >
      <Modal.Header>
        <h5 className="modal-title" id="editModalLabel">
          Edit Astro Details
        </h5>
        <button
          type="button"
          onClick={onHide}
          className="btn-close"
          aria-label="Close"
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="astro-detail-form p-2" style={{maxHeight:"60vh"}}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
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
              Zodiac Sign(Raashi)
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
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AstroDetailsModal;