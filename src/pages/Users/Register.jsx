import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COUNTRIES, QUALIFICATIONS, RELIGIONS, MONTHS, DAYS, YEARS } from '../../constants/formData';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import config from '../../config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', lookingFor: '', month: '', day: '', year: '',
    religion: '', education: '', country: '', email: '', password: '', notRobot: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'lookingFor', 'month', 'day', 
      'year', 'religion', 'education', 'country'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required`;
    });

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.notRobot) newErrors.notRobot = 'Please verify you are not a robot';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const dob = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
      const response = await axios.post(`${config.baseURL}/api/auth/register`, { ...formData, dob });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const serverErrors = {};
        errorData.errors.forEach(err => serverErrors[err.param] = err.msg);
        setErrors(serverErrors);
      } else {
        setErrors({ form: errorData?.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, label, type = 'text') => (
    <div className="form-group">
      <label>{label}*</label>
      <input type={type} name={name} value={formData[name]} onChange={handleChange}
        className={errors[name] ? 'is-invalid' : ''} />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderSelect = (name, label, options) => (
    <div className="form-group">
      <label>{label}*</label>
      <select name={name} value={formData[name]} onChange={handleChange}
        className={errors[name] ? 'is-invalid' : ''}>
        <option value="">Please select..</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const renderRadio = () => (
    <div className="form-group">
      <label>I am looking for*</label>
      <div className="radio-group d-flex gap-2">
        {['Bride', 'Groom'].map(opt => (
          <label key={opt}>
            <input type="radio" name="lookingFor" value={opt}
              checked={formData.lookingFor === opt} onChange={handleChange} /> {opt}
          </label>
        ))}
      </div>
      {errors.lookingFor && <div className="invalid-feedback d-block">{errors.lookingFor}</div>}
    </div>
  );

  const renderDateFields = () => (
    <div className="form-group">
      <label>Date of Birth*</label>
      <div style={{ display: "flex", gap: 10 }}>
        {[['month', 'Month', MONTHS], ['day', 'Day', DAYS], ['year', 'Year', YEARS]].map(([name, label, options]) => (
          <select key={name} name={name} value={formData[name]} onChange={handleChange}
            className={errors[name] ? 'is-invalid' : ''}>
            <option value="">{label}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ))}
      </div>
      {(errors.month || errors.day || errors.year) && 
        <div className="invalid-feedback d-block">Date of birth is required</div>}
    </div>
  );

  return (
    <>
      <Header />
      <section className="login-part">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <div className="register-form">
                <h2>Register Here Your Profile</h2>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}
                <form onSubmit={handleSubmit}>
                  {renderInput('firstName', 'First Name')}
                  {renderInput('lastName', 'Last Name')}
                  {renderRadio()}
                  {renderDateFields()}
                  {renderSelect('religion', 'Religion', RELIGIONS)}
                  {renderSelect('education', 'Education', QUALIFICATIONS)}
                  {renderSelect('country', 'Country', COUNTRIES)}
                  {renderInput('email', 'Email Address', 'email')}
                  {renderInput('password', 'Password', 'password')}
                  <div className="form-group">
                    <label>
                      <input type="checkbox" name="notRobot" checked={formData.notRobot}
                        onChange={handleChange} className={errors.notRobot ? 'is-invalid' : ''} />
                      {" "}I'm not a robot
                    </label>
                    {errors.notRobot && <div className="invalid-feedback d-block">{errors.notRobot}</div>}
                  </div>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'SUBMIT'}
                  </button>
                  <div className="footer-note">
                    By providing my contact details, I agree to receive communications.
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-5">
              <div className="Register-box">
                <h4>Hello Members,</h4>
                <p>You are here because you want to find a good match. Here are a few tips:</p>
                <ol>
                  <li>Enter all required details on the form</li>
                  <li>Upload a recent favorite photo</li>
                  <li>Don't wait for others to contact you</li>
                  <li>Have patience with the process</li>
                  <li>Have realistic expectations</li>
                </ol>
                <p><strong>Good Luck!</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Register;