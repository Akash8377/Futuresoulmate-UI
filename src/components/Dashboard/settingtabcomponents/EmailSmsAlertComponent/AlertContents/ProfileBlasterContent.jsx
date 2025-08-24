import React from "react";
import AlertBox from "../AlertBox";

const ProfileBlasterContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Future Soulmate Profile Blaster">
    <div className="mb-3">
      <label className="form-label">Profile Blaster</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="profileBlaster"
          id="subscribe9"
          checked={settings.profileBlaster === 'subscribe'}
          onChange={() => onSettingChange('profileBlaster', 'subscribe')}
        />
        <label className="form-check-label" htmlFor="subscribe9">
          Subscribe
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="profileBlaster"
          id="unsubscribe9"
          checked={settings.profileBlaster === 'unsubscribe'}
          onChange={() => onSettingChange('profileBlaster', 'unsubscribe')}
        />
        <label className="form-check-label" htmlFor="unsubscribe9">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default ProfileBlasterContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const ProfileBlasterContent = () => {
//   return (
//      <AlertBox title="Future Shadi Profile Blaster">
//     <div className="mb-3">
//       <label className="form-label">Profile Blaster</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="blasterAlert"
//           id="subscribe9"
//         />
//         <label className="form-check-label" htmlFor="subscribe9">
//           Subscribe
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="blasterAlert"
//           id="unsubscribe9"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="unsubscribe9">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default ProfileBlasterContent
