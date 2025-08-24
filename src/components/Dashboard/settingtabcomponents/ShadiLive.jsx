import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-toastify';

const ShadiLive = ({ token }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState({
    pushNotification: true,
    email: true,
    sms: true,
    whatsapp: true,
    call: true,
  });
  const [loading, setLoading] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggle = (field) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleReset = () => {
    setPreferences({
      pushNotification: true,
      email: true,
      sms: true,
      whatsapp: true,
      call: true,
    });
  };

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/profile/shadilive-preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error("Failed to load ShadiLive preferences:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${config.baseURL}/api/profile/shadilive-preferences`,
        { preferences },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('ShadiLive preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchPreferences();
    }
  }, [isExpanded, token]);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingSeven">
        <button
          className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleSection}
        >
          Shadi Live
        </button>
      </h2>
      <div
        id="collapseSeven"
        className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
        data-bs-parent="#settingsAccordion"
      >
        <div className="accordion-body">
          <div className="shadi-live">
            <div className="form-section">
              <h5>Edit your Communication Preferences</h5>
              <p>
                Please select the communication channels on which you would want to receive updates about Shaadi Live
                events.
              </p>

              <div className="form-check form-switch">
                <label className="form-check-label" htmlFor="pushNotification">
                  Push Notification
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pushNotification"
                  checked={preferences.pushNotification}
                  onChange={() => handleToggle('pushNotification')}
                />
              </div>

              <div className="form-check form-switch">
                <label className="form-check-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="email"
                  checked={preferences.email}
                  onChange={() => handleToggle('email')}
                />
              </div>

              <div className="form-check form-switch">
                <label className="form-check-label" htmlFor="sms">
                  SMS
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sms"
                  checked={preferences.sms}
                  onChange={() => handleToggle('sms')}
                />
              </div>

              <div className="form-check form-switch">
                <label className="form-check-label" htmlFor="whatsapp">
                  WhatsApp
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="whatsapp"
                  checked={preferences.whatsapp}
                  onChange={() => handleToggle('whatsapp')}
                />
              </div>

              <div className="form-check form-switch">
                <label className="form-check-label" htmlFor="call">
                  Call
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="call"
                  checked={preferences.call}
                  onChange={() => handleToggle('call')}
                />
              </div>

              <div className="d-flex gap-2 button-privacy">
                <button 
                  className="btn btn-cancel px-4" 
                  type="button" 
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </button>
                <button 
                  className="btn btn-submit px-4" 
                  type="button" 
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadiLive;



// import React, { useState } from 'react';

// const ShadiLive = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [preferences, setPreferences] = useState({
//     pushNotification: true,
//     email: true,
//     sms: true,
//     whatsapp: true,
//     call: true,
//   });

//   const toggleSection = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleToggle = (field) => {
//     setPreferences((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const handleReset = () => {
//     setPreferences({
//       pushNotification: true,
//       email: true,
//       sms: true,
//       whatsapp: true,
//       call: true,
//     });
//   };

//   const handleUpdate = () => {
//     // console.log('Preferences updated:', preferences);
//     // You can add API call here to save preferences
//   };

//   return (
//     <div className="accordion-item">
//       <h2 className="accordion-header" id="headingSeven">
//         <button
//           className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
//           type="button"
//           onClick={toggleSection}
//         >
//           Shadi Live
//         </button>
//       </h2>
//       <div
//         id="collapseSeven"
//         className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}
//         data-bs-parent="#settingsAccordion"
//       >
//         <div className="accordion-body">
//           <div className="shadi-live">
//             <div className="form-section">
//               <h5>Edit your Communication Preferences</h5>
//               <p>
//                 Please select the communication channels on which you would want to receive updates about Shaadi Live
//                 events.
//               </p>

//               <div className="form-check form-switch">
//                 <label className="form-check-label" htmlFor="pushNotification">
//                   Push Notification
//                 </label>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="pushNotification"
//                   checked={preferences.pushNotification}
//                   onChange={() => handleToggle('pushNotification')}
//                 />
//               </div>

//               <div className="form-check form-switch">
//                 <label className="form-check-label" htmlFor="email">
//                   Email
//                 </label>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="email"
//                   checked={preferences.email}
//                   onChange={() => handleToggle('email')}
//                 />
//               </div>

//               <div className="form-check form-switch">
//                 <label className="form-check-label" htmlFor="sms">
//                   SMS
//                 </label>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="sms"
//                   checked={preferences.sms}
//                   onChange={() => handleToggle('sms')}
//                 />
//               </div>

//               <div className="form-check form-switch">
//                 <label className="form-check-label" htmlFor="whatsapp">
//                   WhatsApp
//                 </label>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="whatsapp"
//                   checked={preferences.whatsapp}
//                   onChange={() => handleToggle('whatsapp')}
//                 />
//               </div>

//               <div className="form-check form-switch">
//                 <label className="form-check-label" htmlFor="call">
//                   Call
//                 </label>
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="call"
//                   checked={preferences.call}
//                   onChange={() => handleToggle('call')}
//                 />
//               </div>

//               <div className="d-flex gap-2 button-privacy">
//                 <button className="btn btn-cancel px-4" type="button" onClick={handleReset}>
//                   Reset
//                 </button>
//                 <button className="btn btn-submit px-4" type="button" onClick={handleUpdate}>
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShadiLive;
