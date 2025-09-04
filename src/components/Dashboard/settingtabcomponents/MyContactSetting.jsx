import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from '../../../features/user/userSlice';
import { Modal } from "react-bootstrap";
import { toast } from "../../Common/Toast";

const MyContactSetting = ({ userInfo, token, updateUserPhone }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("premiumMembers");
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await axios.post(`${config.baseURL}/api/auth/send-phone-otp`, { 
        phone: phoneNumber 
      });
      
      setCountdown(60);
      setShowOTPModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndUpdatePhone = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First verify the OTP
      await axios.post(`${config.baseURL}/api/auth/verify-phone-otp`, { 
        phone: phoneNumber, 
        otp: phoneOTP 
      });
      
      // If OTP is verified, update the phone number
      const res = await axios.put(
        `${config.baseURL}/api/profile/profile-settings`,
        { phone: phoneNumber, contactStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setShowOTPModal(false);
        toast.success("Phone number updated successfully");
        
        const updatedUser = {
          ...userInfo,
          phone: phoneNumber,
          phone_verified: 1 // Mark as verified
        };
        
        dispatch(setUser({
          userInfo: updatedUser,
          token: token,
        }));
        
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or failed to update phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    await sendOTP();
  };

  const handleCancelEdit = () => {
    setPhoneNumber(userInfo?.phone || '');
    setIsEditing(false);
    setError('');
    setShowOTPModal(false);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmitSettings = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await axios.put(
        `${config.baseURL}/api/profile/profile-settings`,
        { phone: userInfo?.phone, contactStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Contact settings updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const response = await axios.get(
          `${config.baseURL}/api/profile/profile-settings`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (response.data.settings?.display_contact_status) {
          setContactStatus(response.data.settings.display_contact_status);
        }
      } catch (error) {
        console.error('Failed to load contact settings:', error);
      }
    };

    if (isOpen) {
      loadContactSettings();
    }
  }, [isOpen]);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingTwo">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleAccordion}
        >
          My Contact Settings
        </button>
      </h2>

      {isOpen && (
        <div className="accordion-collapse collapse show">
          <div className="accordion-body">
            <div className="card-setting">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className='w-100'>
                    <div className="fw-semibold">Contact Number</div>
                    {isEditing ? (
                      <div className="mt-2 d-flex flex-column gap-2">
                        <input
                          type="text"
                          className="form-control border-0"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-cancel"
                            onClick={handleCancelEdit}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-submit"
                            onClick={sendOTP}
                            disabled={loading || phoneNumber.length !== 10 || phoneNumber === userInfo?.phone}
                          >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        +1 {userInfo?.phone}
                        <span className="verified-badge ms-2">
                          {userInfo?.phone_verified === 0 ? (
                            <><i className="fa fa-times-circle text-danger" aria-hidden="true"></i> Not Verified</>
                          ) : (
                            <><i className="fa fa-check-circle" aria-hidden="true"></i> Verified</>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      className="btn btn-link text-primary p-0"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div>
                  <div className="fw-semibold mb-2">Contact display status</div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactStatus"
                      id="premiumMembers"
                      checked={contactStatus === "premiumMembers"}
                      onChange={() => setContactStatus("premiumMembers")}
                    />
                    <label className="form-check-label" htmlFor="premiumMembers">
                      Only Premium Members
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactStatus"
                      id="premiumLiked"
                      checked={contactStatus === "premiumLiked"}
                      onChange={() => setContactStatus("premiumLiked")}
                    />
                    <label className="form-check-label" htmlFor="premiumLiked">
                      Only Premium Members you like
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactStatus"
                      id="noOne"
                      checked={contactStatus === "noOne"}
                      onChange={() => setContactStatus("noOne")}
                    />
                    <label className="form-check-label" htmlFor="noOne">
                      No one (Matches won't be able to call you)
                    </label>
                  </div>
                  <div className="form-check disabled">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactStatus"
                      id="allMatches"
                      checked={contactStatus === "allMatches"}
                      onChange={() => setContactStatus("allMatches")}
                    />
                    <label className="form-check-label" htmlFor="allMatches">
                      Only visible to all your Matches <small>(Expires with Membership)</small>
                    </label>
                    <span
                      className="ms-1 text-muted"
                      title="Visible only while membership is active"
                    >
                      ⓘ
                    </span>
                  </div>

                  {error && <div className="alert alert-danger mt-3">{error}</div>}
                  {success && <div className="alert alert-success mt-3">{success}</div>}

                  <div className="submit-btn mt-3">
                    <button
                      type="button"
                      className="btn submit-btn1"
                      onClick={handleSubmitSettings}
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>

                <div className="shadi-instruction mt-3">
                  <p><i className="fa fa-lock" aria-hidden="true"></i> FutureSoulmates.com does not share personal details / contact information with third parties</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      <Modal
        show={showOTPModal}
        onHide={() => setShowOTPModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        size="sm"
        className="letsbeginmodal"
      >
        <Modal.Header>
          <h5 className="modal-title">Verify Phone Number</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowOTPModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <p>We've sent a 4-digit OTP to +1 {phoneNumber}</p>
          <div className="mb-3">
            <input
              type="text"
              className="form-control text-center otp-input"
              value={phoneOTP}
              onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="----"
              maxLength={4}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}

          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowOTPModal(false);
                setPhoneOTP("");
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn py-2 btn-filled mb-2"
              onClick={verifyOTPAndUpdatePhone}
              disabled={phoneOTP.length !== 4 || loading}
            >
              {loading ? "Verifying..." : "Verify & Update"}
            </button>
            <div className="text-center mb-3">
              <a
                href="#"
                className="text-primary text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  resendOTP();
                }}
                style={{ opacity: countdown > 0 ? 0.5 : 1 }}
              >
                Resend OTP {countdown > 0 ? `(${countdown}s)` : ""}
              </a>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyContactSetting;