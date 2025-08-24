import React, { useState,useEffect } from 'react';
import axios from 'axios';
import IDVerificationForm from '../../components/UserProfile/IDVerificationForm';
import VerificationSuccess from '../../components/UserProfile/VerificationSuccess';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyProfile = () => {
  const [step, setStep] = useState('select'); // 'select', 'verify', 'success'
  const [verificationType, setVerificationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate =  useNavigate()

  const handleDocSelect = (type) => {
    setVerificationType(type);
    setStep('verify');
  };

  useEffect(() => {
    const otherData = JSON.parse(sessionStorage.getItem("otherData"));
    if (otherData?.verificationData) {
      // console.log(otherData?.verificationData)
      setVerificationType(otherData?.verificationData?.type)
      setStep('verify')
    }
  }, []);

  const handleVerificationSuccess = (verificationData) => {
    setStep('success');
    let otherData = JSON.parse(sessionStorage.getItem('otherData'));
    otherData={
      ...otherData,
      verificationData
    }
    setTimeout(()=>{
      sessionStorage.setItem("otherData", JSON.stringify(otherData))
      navigate("/family-details")
    }, 1000)
  };

  return (
    <>
      <section className="verfiy-profile">
        <div className="verfiy-profile-new">
          {step === 'select' && (
            <>
              <div className="icon-blk text-center">
                <img src="images/profile-icon.svg" alt="Profile" />
                <h4>Select your ID document</h4>
                <p>Verification Of Government Id</p>
              </div>
              <div className="form-blk">
                <div className="select-control">
                  <select 
                    className="form-control" 
                    id="docSelect"
                    onChange={(e) => handleDocSelect(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" hidden disabled>Select</option>
                    <option value="pan">PAN Card</option>
                    <option value="voter">Voter Card</option>
                    <option value="driving">Driving Licence</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 'verify' && (
            <IDVerificationForm 
              type={verificationType}
              onSuccess={handleVerificationSuccess}
              onBack={() => setStep('select')}
            />
          )}

          {step === 'success' && <VerificationSuccess />}
        </div>
      </section>
    </>
  );
};

export default VerifyProfile;