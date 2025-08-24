import React from "react";
import AlertBox from "../AlertBox";

const PremiumMatchContent = ({ settings, onSettingChange }) => (
  <AlertBox 
    title="Email Alerts" 
    description="Premium Match Mail & Photo Match Mail"
  >
    <div className="mb-3">
      <label className="form-label">Email Alert</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="premiumMatch"
          id="weekly2"
          checked={settings.premiumMatch === 'weekly'}
          onChange={() => onSettingChange('premiumMatch', 'weekly')}
        />
        <label className="form-check-label" htmlFor="weekly2">
          Weekly
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="premiumMatch"
          id="unsubscribe2"
          checked={settings.premiumMatch === 'unsubscribe'}
          onChange={() => onSettingChange('premiumMatch', 'unsubscribe')}
        />
        <label className="form-check-label" htmlFor="unsubscribe2">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default PremiumMatchContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const PremiumMatchContent = () => {
//   return (
//     <AlertBox 
//     title="Email Alerts" 
//     description="Premium Match Mail & Photo Match Mail"
//   >
//     <div className="mb-3">
//       <label className="form-label">Email Alert</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert2"
//           id="weekly2"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="weekly2">
//           Weekly
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert2"
//           id="unsubscribe2"
//         />
//         <label className="form-check-label" htmlFor="unsubscribe2">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default PremiumMatchContent
