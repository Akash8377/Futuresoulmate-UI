import React, { useState } from 'react';
import './ForgotPasswordOTP.css';
import axios from 'axios';
import { toast } from '../../../components/Common/Toast';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

const ForgotPasswordOTP = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    identifier: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOTP = async () => {
    setErrors({});
    if (!formData.identifier) {
      setErrors({ identifier: 'Please enter your email' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${config.baseURL}/api/profile/send-otp`, {
        email: formData.identifier,
      });

      toast.success(response.data.message || 'OTP sent successfully');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToReset = () => {
    if (!formData.otp) {
      setErrors({ otp: 'Please enter the OTP sent to your email' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleResetPassword = async () => {
    setErrors({});
    const { newPassword, confirmPassword } = formData;

    if (!newPassword || newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${config.baseURL}/api/profile/reset-password`, {
        email: formData.identifier,
        otp: formData.otp,
        newPassword,
      });

      toast.success(response.data.message || 'Password reset successfully');
      setFormData({
        ...formData,
        newPassword:'',
        confirmPassword:'',
      })
      setTimeout(() =>{
        navigate('/login');
      },200)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="forgot-password-container">
        <h3>Forgot Password</h3>

        {step === 1 && (
          <>
            <label>Email</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter email"
            />
            {errors.identifier && <div className="error">{errors.identifier}</div>}

            <button onClick={handleRequestOTP} disabled={isSubmitting}>
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="----"
              className='enter-otp'
              />
              <small>OTP sent to {formData.identifier}</small>
            {errors.otp && <div className="error">{errors.otp}</div>}
            <button onClick={handleProceedToReset}>
              Continue
            </button>
          </>
        )}

        {step === 3 && (
          <>
           <label>New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="password-input"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
            <label className='mt-3'>Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="password-input"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            <button onClick={handleResetPassword} disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordOTP;
