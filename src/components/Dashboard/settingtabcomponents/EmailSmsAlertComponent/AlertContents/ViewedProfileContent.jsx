import React from "react";
import AlertBox from "../AlertBox";

const ViewedProfileContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Viewed Profile Email">
    <div className="mb-3">
      <label className="form-label">Email Alert</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="viewedProfile"
          id="weekly5"
          checked={settings.viewedProfile === 'weekly'}
          onChange={() => onSettingChange('viewedProfile', 'weekly')}
        />
        <label className="form-check-label" htmlFor="weekly5">
          Weekly
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="viewedProfile"
          id="unsubscribe5"
          checked={settings.viewedProfile === 'unsubscribe'}
          onChange={() => onSettingChange('viewedProfile', 'unsubscribe')}
        />
        <label className="form-check-label" htmlFor="unsubscribe5">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default ViewedProfileContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const ViewedProfileContent = () => {
//   return (
//     <AlertBox title="Viewed Profile Email">
//     <div className="mb-3">
//       <label className="form-label">Email Alert</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert5"
//           id="weekly5"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="weekly5">
//           Weekly
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert5"
//           id="unsubscribe5"
//         />
//         <label className="form-check-label" htmlFor="unsubscribe5">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default ViewedProfileContent
