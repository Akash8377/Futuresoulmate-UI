import React from 'react';
import config from '../../../../config';

const PartnerPreferences = ({ currentProfile, matchingRatio }) => {
  const partnerPreference = currentProfile.partner_preference ? JSON.parse(currentProfile.partner_preference) : null;

  if (!partnerPreference) {
    return (
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-id-card-o" aria-hidden="true"></i></div>
        <h5 className="section-title">Partner Preferences</h5>
        <div className="card-box">
          <p>No partner preferences specified.</p>
        </div>
      </div>
    );
  }

    // Render helpers
  const renderPreferenceRow = (title, value) => (
    <div className="row mb-2">
      <div className="col-md-6">
        <div className="label-title">{title}</div>
        <div className="label-value">{value || "Not specified"}</div>
      </div>
      <div className="col-md-6 text-end">
        <i className="fa fa-check-circle-o" aria-hidden="true"></i>
      </div>
    </div>
  );

  return (
    <div className="timeline">
      <div className="mb-4 position-relative">
        <div className="timeline-icon"><i className="fa fa-id-card-o" aria-hidden="true"></i></div>
        <h5 className="section-title">Partner Preferences</h5>
        <div className="card-box">
          <div className="match-section">
            <div className="row align-items-center mb-4">
              <div className="col-md-3 text-center">
                <img 
                  src={currentProfile.profile_image ? `${config.baseURL}/uploads/profiles/${currentProfile.profile_image}` : "images/matchesprofile.jpg"} 
                  alt="Her" 
                  className="profile-img" 
                />
                <div className="mt-2 fw-semibold">Her Preferences</div>
              </div>
              <div className="col-md-6 text-center">
                <div className="match-badge">You match {matchingRatio}% of her Preferences</div>
              </div>
              <div className="col-md-3 text-center">
                <img src="images/maleimg.jpg" alt="You" className="profile-img" />
                <div className="mt-2 fw-semibold">You match</div>
              </div>
            </div>

            {/* Preferences */}
            {renderPreferenceRow('Age', partnerPreference.basic?.ageRange)}
            {renderPreferenceRow('Height', partnerPreference.basic?.heightRange)}
            {renderPreferenceRow('Marital Status', partnerPreference.basic?.maritalStatus)}
            {renderPreferenceRow('Religion', partnerPreference.community?.religion)}
            {renderPreferenceRow('Community', partnerPreference.community?.community)}
            {renderPreferenceRow('Mother Tongue', partnerPreference.community?.motherTongue)}
            {renderPreferenceRow('Country', partnerPreference.location?.country)}
            {renderPreferenceRow('State', partnerPreference.location?.state)}
            {renderPreferenceRow('Qualification', partnerPreference.education?.qualification)}
            {renderPreferenceRow('Working with', partnerPreference.education?.workingWith)}
            {renderPreferenceRow('Profession', partnerPreference.education?.profession)}
            {renderPreferenceRow('Annual Income', partnerPreference.education?.annualIncome)}
            {renderPreferenceRow('Profile Managed By', partnerPreference.otherDetails?.profileManagedBy)}
            {renderPreferenceRow('Diet', partnerPreference.otherDetails?.diet)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPreferences;