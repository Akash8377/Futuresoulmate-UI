import React, { useState } from "react";
import axios from "axios";
import config from "../../../config";
import { Modal } from "react-bootstrap";
import { toast } from "../../Common/Toast";
import { setUser } from "../../../features/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
const AccountSetting = ({ userInfo,token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState(userInfo?.email);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch()

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const sendOTP = async () => {
    try {
      setLoading(true)
      await axios.post(`${config.baseURL}/api/auth/send-email-otp`, { 
        email: newEmail 
      });
      setCountdown(60);
      setShowOTPModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndUpdateEmail = async () => {
    try {
      setLoading(true);
      await axios.post(`${config.baseURL}/api/auth/verify-email-otp`, { 
        email: newEmail, 
        otp: emailOTP 
      });
      // If OTP is verified, update the email
      const res = await axios.put(`${config.baseURL}/api/profile/update-email`, {
        newEmail,
        userId: userInfo?.id
      }, {
        headers: {
          Authorization: `Bearer ${token}` // or however you handle auth
        }
      });
      if(res.data.success){
        setShowOTPModal(false)
        toast.success("Email updated succssfully")
           const updatedUser = {
              ...userInfo,
              email: res.data.email,
            };
            dispatch(setUser({
              userInfo: updatedUser,
              token: token, // ← do NOT change token
            }));
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or failed to update email. Please try again.");
      console.log("Update email error ", err)
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    await sendOTP();
  };

  // Countdown effect
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className={`accordion-button ${isOpen ? "" : "collapsed"}`}
          type="button"
          onClick={toggleAccordion}
        >
          Account Settings
        </button>
      </h2>

      {isOpen && (
        <div className="accordion-collapse collapse show">
          <div className="accordion-body">
            <div className="form-box">
              <h5 className="mb-3">Update Email Id</h5>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={(e) => {
                e.preventDefault();
                sendOTP();
              }}>
                <div className="mb-4">
                  <label className="form-label">New Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newEmail}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="d-flex gap-3">
                  <button 
                    type="button" 
                    className="btn btn-cancel"
                    onClick={() => {
                      setNewEmail(userInfo?.email);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-submit"
                    disabled={newEmail === userInfo?.email || loading}
                  >
                    {loading ? "Sending OTP..." : "Update Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showOTPModal}
        onHide={!showOTPModal}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
        className="letsbeginmodal"
      >
        <Modal.Header>
          <h5 className="modal-title">Verify Email</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowOTPModal(false)}
                ></button>
        </Modal.Header>
        <Modal.Body>

                <p>We've sent a 4-digit OTP to {newEmail}</p>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control text-center otp-input"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, "").slice(0, 4))}
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
                    setEmailOTP("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn py-2 btn-filled mb-2"
                  onClick={verifyOTPAndUpdateEmail}
                  disabled={emailOTP.length !== 4 || loading}
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

export default AccountSetting;