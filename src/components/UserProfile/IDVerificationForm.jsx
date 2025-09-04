import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IDVerificationForm = ({ type, onSuccess, onBack }) => {
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    useEffect(() => {
      const otherData = JSON.parse(sessionStorage.getItem("otherData"));
      if (otherData?.verificationData) {
        // console.log(otherData?.verificationData)
        setIdNumber(otherData?.verificationData?.idNumber)
      }
    }, []);

const typeConfig = {
  ssn: {
    label: 'Social Security Number (SSN)',
    placeholder: 'Enter SSN (e.g., 123-45-6789)',
    pattern: '^\\d{3}-\\d{2}-\\d{4}$' // US SSN format
  },
  passport: {
    label: 'Passport Number',
    placeholder: 'Enter Passport Number',
    pattern: '^[A-Za-z0-9]{6,9}$' // US passports: 6–9 alphanumeric
  },
  drivers_license: {
    label: 'Driver’s License Number',
    placeholder: 'Enter Driver’s License Number',
    pattern: '^[A-Za-z0-9]{5,15}$' // varies by state, flexible range
  },
  state_id: {
    label: 'State ID Card Number',
    placeholder: 'Enter State ID Number',
    pattern: '^[A-Za-z0-9]{5,15}$' // similar to DL, varies by state
  }
}[type];


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!idNumber.match(typeConfig.pattern)) {
    //   setError(`Please enter a valid ${typeConfig.label}`);
    //   return;
    // }

    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      let payload = {};

      // switch (type) {
      //   case 'pan':
      //     endpoint = '/api/verify/pan';
      //     payload = { panNumber: idNumber };
      //     break;
      //   case 'voter':
      //     endpoint = '/api/verify/voter';
      //     payload = { voterNumber: idNumber };
      //     break;
      //   case 'driving':
      //     endpoint = '/api/verify/dl';
      //     payload = { dlNumber: idNumber };
      //     break;
      //   default:
      //     throw new Error('Invalid verification type');
      // }

      // const response = await axios.post(endpoint, payload);
      
      // if (response.data.success) {
      if (true) {
         onSuccess({type,idNumber,success: true});
      } else {
        // setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="">
       <div className="left-icon1">
        <button type="button" className="backbutton" onClick={onBack}>
          <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
        </button>
       </div>
      </div>
      <div className="icon-blk text-center">
        <img src="images/profileform.png" alt="Verification Form" />
      </div>
      <div className="card1">
        <form id="idForm" onSubmit={handleSubmit} noValidate>
          <label id="lbl" htmlFor="input">{typeConfig.label}</label>
          <input
            id="input"
            name="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder={typeConfig.placeholder}
            pattern={typeConfig.pattern}
            required
          />
          {error && (
            <div id="msg" className="error" style={{ display: error ? 'block' : 'none' }}>
              {error}
            </div>
          )}
          <div className="button-group">
            <button 
              type="submit" 
              id="verifyBtn"
              disabled={loading || !idNumber}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default IDVerificationForm;