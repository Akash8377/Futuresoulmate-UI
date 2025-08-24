import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config"
import { toast } from "../Common/Toast";

const Step4 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [verificationStep, setVerificationStep] = useState("input"); // 'input', 'email-otp', 'phone-otp'
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOTPChange = (e, type) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (type === "email") {
      setEmailOTP(value);
    } else {
      setPhoneOTP(value);
    }
  };

  const sendOTP = async (type) => {
    try {
      setLoading(true);
      setError("");
      
      const endpoint = type === "email" 
        ? `${config.baseURL}/api/auth/send-email-otp` 
        : `${config.baseURL}/api/auth/send-phone-otp`;
      
      const payload = type === "email" 
        ? { email: formData.email } 
        : { phone: formData.phone };
      const response = await axios.post(endpoint, payload);
      console.log("Response data:", response.data);
      setCountdown(60);
      setVerificationStep(`${type}-otp`);
    } catch (err) {
      toast.error(err.response.data.message)
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (type) => {
    try {
      setLoading(true);
      setError("");
      
      const endpoint = type === "email" 
        ? `${config.baseURL}/api/auth/verify-email-otp` 
        : `${config.baseURL}/api/auth/verify-phone-otp`;
      
      const payload = type === "email" 
        ? { email: formData.email, otp: emailOTP } 
        : { phone: formData.phone, otp: phoneOTP };

      await axios.post(endpoint, payload);
      
      if (type === "email") {
        setEmailVerified(true);
      } else {
        setPhoneVerified(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (type) => {
    if (countdown > 0) return;
    await sendOTP(type);
  };

  const renderInputStep = () => (
    <div className="form-basic">
      <p className="text-center">
        An active email ID &amp; phone no.
        <br />
        are required to secure your Profile
      </p>

      <h5 className="modal-title">Email ID</h5>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email ID"
        />
      </div>
      <h5 className="modal-title">Mobile no.</h5>
      <div className="mb-3">
        <input
          type="tel"
          className="form-control"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Mobile number"
        />
      </div>
      <div className="modal-footer border-0 justify-content-center p-0 footer-modal mt-4">
        <button
          type="button"
          className="btn w-100 py-2 btn-filled"
          onClick={() => sendOTP("email")}
          disabled={!formData.email || loading}
        >
          {loading ? "Sending..." : "Verify Email"}
        </button>
      </div>

      <div className="form-terms">
        By creating account, you agree to our{" "}
        <a tabIndex="-1" href="/" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a tabIndex="-1" href="/" target="_blank" rel="noopener noreferrer">
          T&amp;C.
        </a>
      </div>
    </div>
  );

  const renderOTPStep = (type) => {
    const isEmail = type === "email";
    const verified = isEmail ? emailVerified : phoneVerified;
    const otp = isEmail ? emailOTP : phoneOTP;
    const contact = isEmail ? formData.email : formData.phone;
    
    return (
      <div className="form-basic">
        <h5 className="modal-title text-center">
          Verify {isEmail ? "Email" : "Phone"}
        </h5>
        
        <p className="text-center">
          We sent a 4-digit code to {contact}
        </p>

        {!verified && (
          <>
            <div className="otp-input-container mb-3">
              <input
                type="text"
                className="form-control text-center otp-input"
                value={otp}
                onChange={(e) => handleOTPChange(e, type)}
                placeholder="____"
                maxLength={4}
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              type="button"
              className="btn w-100 py-2 btn-filled mb-2"
              onClick={() => verifyOTP(type)}
              disabled={otp.length !== 4 || loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <div className="text-center mb-3">
              <a 
                href="#"
                className="text-primary text-decoration-none"
                onClick={(e) => {
                  e.preventDefault();
                  resendOTP(type);
                }}
                style={{ opacity: countdown > 0 ? 0.5 : 1 }}
              >
                Resend Code {countdown > 0 ? `(${countdown}s)` : ""}
              </a>
            </div>
          </>
        )}

        {verified && (
          <>
            <div className="alert alert-success text-center">
              <i className="fa fa-check-circle me-2"></i>
              {isEmail ? "Email" : "Phone"} verified successfully!
            </div>

            {isEmail && (
              <div className="d-flex flex-column gap-2 mt-3">
                {formData.phone && !phoneVerified && (
                  <button
                    type="button"
                    className="btn w-100 py-2"
                    onClick={() => sendOTP("phone")}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Verify Phone"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn w-100 py-2 btn-outline btn-filled"
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            )}

            {!isEmail && phoneVerified && (
              <button
                type="button"
                className="btn w-100 py-2 btn-filled mt-3"
                onClick={nextStep}
              >
                Continue
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="step4">
      <div className="left-icon1">
        <button 
          type="button" 
          className="backbutton" 
          onClick={() => {
            if (verificationStep === "input") {
              prevStep();
            } else {
              setVerificationStep("input");
            }
          }}
        >
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
      </div>
      
      <div className="icon-blk text-center">
        <img src="images/profile-icon.svg" alt="Profile" />
      </div>

      {verificationStep === "input" && renderInputStep()}
      {verificationStep === "email-otp" && renderOTPStep("email")}
      {verificationStep === "phone-otp" && renderOTPStep("phone")}
    </div>
  );
};

export default Step4;