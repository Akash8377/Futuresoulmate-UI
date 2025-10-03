import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const ProfileDetails = ({ currentProfile }) => {
  const userInfo = useSelector(state=>state.user.userInfo)
  const family_details = typeof currentProfile?.family_details ==='object'?currentProfile?.family_details:JSON.parse(currentProfile?.family_details)
  // console.log("Profiledetail User Info",userInfo)
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    return Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
  };

  const age = calculateAge(currentProfile.dob);
  const partnerPreference = currentProfile.partner_preference ? JSON.parse(currentProfile.partner_preference) : null;

  // Format phone and email for privacy
  const formatPhone = (phone) => {
    if (!phone) return 'XXXXXX';
    return phone.length > 6 
      ? `${phone.substring(0, phone.length - 6)}XXXXXX` 
      : 'XXXXXX';
  };

  const formatEmail = (email) => {
    if (!email) return 'XXXXXX';
    const atIndex = email.indexOf('@');
    return atIndex > 0 
      ? `${'X'.repeat(atIndex)}${email.substring(atIndex)}`
      : 'XXXXXX';
  };

  return (
    <div className="timeline">
      {/* About */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-quote-left" aria-hidden="true"></i></div>
        <h5 className="section-title">About {currentProfile.first_name}</h5>
        <div className="card-box">
          <div className="d-flex justify-content-between mb-2">
            <span><strong>ID:</strong> {currentProfile.profileId}</span>
            <span className="badge bg-secondary">
              {currentProfile.person === 'myself' ? 'Self Managed' : 'Parent Managed'}
            </span>
          </div>
          <p>{currentProfile.profile_description || 'No description available.'}</p>
        </div>
      </div>

      {/* Contact */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-phone" aria-hidden="true"></i></div>
        <h5 className="section-title">Contact Details</h5>
        <div className="card-box">
          <p>
            <strong>Contact Number:</strong> +1 {userInfo.plan_status === "active" ?currentProfile.phone:formatPhone(currentProfile.phone)} 
            <i className="bi bi-lock-fill lock-icon"></i>
            {userInfo.plan_status === "active" ? "" :(<p><span className="upgrade-text">Upgrade Now</span> to view details</p>)} 
          </p>
          <p><strong>Email ID:</strong> {userInfo.plan_status === "active" ?currentProfile.email:formatEmail(currentProfile.email)}</p>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-glass" aria-hidden="true"></i></div>
        <h5 className="section-title">Lifestyle</h5>
        <div className="card-box text-center">
          {/* <img src="images/egg.png" alt="Egg" width="40" /> */}
          <p className="mt-2 mb-0">{currentProfile.diet || 'Diet information not available'}</p>
        </div>
      </div>

      {/* Background */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-book" aria-hidden="true"></i></div>
        <h5 className="section-title">Background</h5>
        <div className="card-box">
          <p><i className="fa fa-user" aria-hidden="true"></i> {currentProfile.religion}, {currentProfile.mother_tongue || currentProfile.community}</p>
          <p><i className="fa fa-map-marker" aria-hidden="true"></i> Lives in {currentProfile.city}, {currentProfile.country}</p>
        </div>
      </div>

      {/* Horoscope */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-globe" aria-hidden="true"></i></div>
        <h5 className="section-title">Horoscope Details</h5>
        {userInfo?.rashi && userInfo?.manglik && userInfo?.nakshatra ? currentProfile?.rashi && currentProfile?.manglik && currentProfile?.nakshatra ? (
          <div className="card-box">
          <p><i className="fa fa-clock-o" aria-hidden="true"></i> {currentProfile.birth_time}</p>
          <p><i className="fa fa-map-marker" aria-hidden="true"></i> {currentProfile.birth_city}</p>
          <p><i className="fa fa-fire" aria-hidden="true"></i> {currentProfile.manglik}</p>
          <p><i className="fa fa-star" aria-hidden="true"></i> {currentProfile.rashi}</p>
          <p><i className="fa fa-moon-o" aria-hidden="true"></i> {currentProfile.nakshatra}</p>
        </div>
        ):(<div className="astro-box"><p className="astro-text">
            Details not found
          </p></div>):(<div className="astro-box">
          <div className="astro-icon">
            <i className="fa fa-folder-open-o" aria-hidden="true"></i>
          </div>
          <p className="astro-text">
            For the common interest of members,<br />
            quickly enter your Astro details & unhide her info.
          </p>
          <NavLink to="/dashboard" state={{ activtab: "settings" }} className="astro-link">Add My Details <i
              className="fa fa-caret-down" aria-hidden="true"></i>
          </NavLink>
        </div>)}
      </div>

      {/* Family */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-home" aria-hidden="true"></i></div>
        <h5 className="section-title">Family Details</h5>
        {userInfo?.family_details ? family_details ? (<div className="card-box">
          <p><i className="fa fa-female" aria-hidden="true"></i> {family_details?.mother}</p>
          <p><i className="fa fa-male" aria-hidden="true"></i> {family_details?.father}</p>
          <p><i className="fa fa-female" style={{transform: 'scale(0.8)'}} aria-hidden="true"></i> {family_details?.sisters}</p>
          <p><i className="fa fa-male" style={{transform: 'scale(0.8)'}} aria-hidden="true"></i> {family_details?.brothers}</p>
        </div>):(<div className="astro-box"><p className="astro-text">
            Details not found
          </p></div>):(<div className="astro-box">
          <div className="astro-icon">
            <i className="fa fa-folder-open-o" aria-hidden="true"></i>
          </div>
          <p className="astro-text">
            For the common interest of members,<br />
            quickly enter your Astro details & unhide her info.
          </p>
          <NavLink to="/dashboard" state={{ activtab: "profile" }} className="astro-link">Add My Details <i
              className="fa fa-caret-down" aria-hidden="true"></i>
          </NavLink>
        </div>)}
      </div>

      {/* Education */}
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-graduation-cap" aria-hidden="true"></i></div>
        <h5 className="section-title">Education</h5>
        <div className="card-box">
          <p><i className="fa fa-graduation-cap" aria-hidden="true"></i> {currentProfile.qualification}</p>
          <p><i className="fa fa-book" aria-hidden="true"></i> {currentProfile.education}</p>
          <p><i className="fa fa-address-book-o" aria-hidden="true"></i> {currentProfile.profession}</p>
          <p><i className="fa fa-home" aria-hidden="true"></i>
            <strong>Self</strong> Earns INR {currentProfile.income} {currentProfile.incomePer === 'yearly' ? 'Annualy' : 'Monthly'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;