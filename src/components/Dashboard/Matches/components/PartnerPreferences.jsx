import React, {useMemo} from 'react';
import config from '../../../../config';

const PartnerPreferences = ({ currentProfile, user }) => {

    const calculateAge = (dob) => Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
  
    const matchingCriteria = useMemo(() => {
      if (!currentProfile?.partner_preference || !user) return { matches: 0, total: 0, details: [] };
      
      try {
        const pref = JSON.parse(currentProfile.partner_preference);
        
        const criteria = [
          { 
            key: 'age',
            title: 'Age',
            value: pref.basic?.ageRange,
            check: () => {
              const [min, max] = pref.basic?.ageRange?.split("–").map(Number) || [];
              const age = calculateAge(user.dob);
              return min && max && age >= min && age <= max;
            }
          },
          { 
            key: 'height',
            title: 'Height',
            value: pref.basic?.heightRange,
            check: () => {
              // Basic height matching logic - you might want to enhance this
              const userHeight = user.height;
              const preferredHeight = pref.basic?.heightRange;
              return preferredHeight === "Open to All" || userHeight === preferredHeight;
            }
          },
          { 
            key: 'maritalStatus',
            title: 'Marital Status', 
            value: pref.basic?.maritalStatus,
            check: () => pref.basic?.maritalStatus === "Open to All" || pref.basic?.maritalStatus === user.marital_status 
          },
          { 
            key: 'religion',
            title: 'Religion',
            value: pref.community?.religion,
            check: () => pref.community?.religion === "Open to All" || pref.community?.religion === user.religion 
          },
          { 
            key: 'culture',
            title: 'Culture',
            value: pref.community?.community,
            check: () => pref.community?.community === "Open to All" || pref.community?.community === user.culture
          },
          { 
            key: 'motherTongue',
            title: 'Language',
            value: pref.community?.motherTongue,
            check: () => pref.community?.motherTongue === "Open to All" || pref.community?.motherTongue === user.mother_tongue 
          },
          { 
            key: 'country',
            title: 'Country',
            value: pref.location?.country,
            check: () => {
              const preferredCountries = Array.isArray(pref.location?.country) 
                ? pref.location.country 
                : [pref.location?.country].filter(Boolean);
              return preferredCountries.includes("Open to All") || preferredCountries.includes(user.country);
            }
          },
          { 
            key: 'state',
            title: 'State',
            value: pref.location?.state,
            check: () => pref.location?.state === "Open to All" || pref.location?.state === user.city
          },
          { 
            key: 'qualification',
            title: 'Qualification',
            value: pref.education?.qualification,
            check: () => pref.education?.qualification === "Open to All" || pref.education?.qualification === user.qualification
          },
          { 
            key: 'workingWith',
            title: 'Working with',
            value: pref.education?.workingWith,
            check: () => pref.education?.workingWith === "Open to All" || pref.education?.workingWith === user.work_type
          },
          { 
            key: 'profession',
            title: 'Profession',
            value: pref.education?.profession,
            check: () => pref.education?.profession === "Open to All" || pref.education?.profession === user.profession
          },
          { 
            key: 'annualIncome',
            title: 'Annual Income',
            value: pref.education?.annualIncome,
            check: () => {
              const incomeRange = pref.education?.annualIncome;
              if (incomeRange === "Open to All") return true;
              
              // Basic income matching - you might want to enhance this
              const userIncome = parseInt(user.income) || 0;
              const [min, max] = incomeRange?.replace(/[$,]/g, '').split(" – ").map(Number) || [];
              return min && max && userIncome >= min && userIncome <= max;
            }
          },
          { 
            key: 'profileManagedBy',
            title: 'Profile Managed By',
            value: pref.otherDetails?.profileManagedBy,
            check: () => pref.otherDetails?.profileManagedBy === "Open to All" || pref.otherDetails?.profileManagedBy === user.person
          },
          { 
            key: 'diet',
            title: 'Diet',
            value: pref.otherDetails?.diet,
            check: () => pref.otherDetails?.diet === "Open to All" || pref.otherDetails?.diet === user.diet
          }
        ];

        const details = criteria.map(criterion => ({
          ...criterion,
          matched: criterion.check()
        }));

        const matches = details.filter(c => c.matched).length;
        const total = criteria.length;

        return { matches, total, details };
      } catch (error) {
        console.error("Error calculating matching ratio", error);
        return { matches: 0, total: 0, details: [] };
      }
    }, [currentProfile, user]);

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

  // Updated render helper to show check or cross based on match
  const renderPreferenceRow = (title, value, matched = true) => (
    <div className="row mb-2">
      <div className="col-md-6">
        <div className="label-title">{title}</div>
        <div className="label-value">{value || "Not specified"}</div>
      </div>
      <div className="col-md-6 text-end">
        {matched ? (
          <i className="fa fa-check-circle-o text-success" aria-hidden="true"></i>
        ) : (
          <i className="fa fa-times-circle-o text-danger" aria-hidden="true"></i>
        )}
      </div>
    </div>
  );

  console.log("Current Profile", currentProfile);
  
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
                <div className="mt-2 fw-semibold">{currentProfile.looking_for === "Bride"?"His":"Her"} Preferences</div>
              </div>
              <div className="col-md-6 text-center">
                <div className="match-badge">
                  You match {matchingCriteria.matches}/{matchingCriteria.total} of {currentProfile.looking_for === "Bride"?"his":"her"} Preferences
                </div>
              </div>
              <div className="col-md-3 text-center">
                <img 
                  src={user.profile_image ? `${config.baseURL}/uploads/profiles/${user.profile_image}` : "images/matchesprofile.jpg"}  
                  alt="You" 
                  className="profile-img" 
                />
                <div className="mt-2 fw-semibold">You match</div>
              </div>
            </div>

            {/* All 14 preferences with match status */}
            {matchingCriteria.details.map(criterion => (
              renderPreferenceRow(criterion.title, criterion.value, criterion.matched)
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerPreferences;



// import React, {useMemo} from 'react';
// import config from '../../../../config';

// const PartnerPreferences = ({ currentProfile, user }) => {
//     console.log("Current Profile", currentProfile)
//     console.log("Current User", user)
//     const calculateAge = (dob) => Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
  
//     const matchingRatio = useMemo(() => {
//       if (!currentProfile?.partner_preference || !user) return 0;
      
//       try {
//         const pref = JSON.parse(currentProfile.partner_preference);
//         const criteria = [
//           { 
//             check: () => {
//               const [min, max] = pref.basic?.ageRange?.split("–").map(Number) || [];
//               const age = calculateAge(user.dob);
//               return min && max && age >= min && age <= max;
//             }
//           },
//           { check: () => pref.basic?.maritalStatus === user.marital_status },
//           { check: () => pref.community?.religion === user.religion },
//           { check: () => pref.community?.motherTongue === user.mother_tongue },
//           { check: () => pref.location?.country?.includes(user.country) },
//           { check: () => pref.education?.qualification === user.qualification }
//         ];
//         return Math.round((criteria.filter(c => c.check()).length / criteria.length) * 100);
//       } catch (error) {
//         console.error("Error calculating matching ratio", error);
//         return 0;
//       }
//     }, [currentProfile, user]);

//   const partnerPreference = currentProfile.partner_preference ? JSON.parse(currentProfile.partner_preference) : null;

//   if (!partnerPreference) {
//     return (
//       <div className="mb-4 position-relative">
//         <div className="timeline-icon"><i className="fa fa-id-card-o" aria-hidden="true"></i></div>
//         <h5 className="section-title">Partner Preferences</h5>
//         <div className="card-box">
//           <p>No partner preferences specified.</p>
//         </div>
//       </div>
//     );
//   }
//     // Render helpers
//   const renderPreferenceRow = (title, value) => (
//     <div className="row mb-2">
//       <div className="col-md-6">
//         <div className="label-title">{title}</div>
//         <div className="label-value">{value || "Not specified"}</div>
//       </div>
//       <div className="col-md-6 text-end">
//         <i className="fa fa-check-circle-o" aria-hidden="true"></i>
//       </div>
//     </div>
//   );
//   return (
//     <div className="timeline">
//       <div className="mb-4 position-relative">
//         <div className="timeline-icon"><i className="fa fa-id-card-o" aria-hidden="true"></i></div>
//         <h5 className="section-title">Partner Preferences</h5>
//         <div className="card-box">
//           <div className="match-section">
//             <div className="row align-items-center mb-4">
//               <div className="col-md-3 text-center">
//                 <img 
//                   src={currentProfile.profile_image ? `${config.baseURL}/uploads/profiles/${currentProfile.profile_image}` : "images/matchesprofile.jpg"} 
//                   alt="Her" 
//                   className="profile-img" 
//                 />
//                 <div className="mt-2 fw-semibold">Her Preferences</div>
//               </div>
//               <div className="col-md-6 text-center">
//                 <div className="match-badge">You match {matchingRatio}% of her Preferences</div>
//               </div>
//               <div className="col-md-3 text-center">
//                 <img src={user.profile_image ? `${config.baseURL}/uploads/profiles/${user.profile_image}` : "images/matchesprofile.jpg"}  
//                 alt="You" className="profile-img" />
//                 <div className="mt-2 fw-semibold">You match</div>
//               </div>
//             </div>

//             {/* Preferences */}
//             {renderPreferenceRow('Age', partnerPreference.basic?.ageRange)}
//             {renderPreferenceRow('Height', partnerPreference.basic?.heightRange)}
//             {renderPreferenceRow('Marital Status', partnerPreference.basic?.maritalStatus)}
//             {renderPreferenceRow('Religion', partnerPreference.community?.religion)}
//             {renderPreferenceRow('Culture', partnerPreference.community?.community)}
//             {renderPreferenceRow('Language', partnerPreference.community?.motherTongue)}
//             {renderPreferenceRow('Country', partnerPreference.location?.country)}
//             {renderPreferenceRow('State', partnerPreference.location?.state)}
//             {renderPreferenceRow('Qualification', partnerPreference.education?.qualification)}
//             {renderPreferenceRow('Working with', partnerPreference.education?.workingWith)}
//             {renderPreferenceRow('Profession', partnerPreference.education?.profession)}
//             {renderPreferenceRow('Annual Income', partnerPreference.education?.annualIncome)}
//             {renderPreferenceRow('Profile Managed By', partnerPreference.otherDetails?.profileManagedBy)}
//             {renderPreferenceRow('Diet', partnerPreference.otherDetails?.diet)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PartnerPreferences;