import React from "react";
import AlertBox from "../AlertBox";

const ShadiSpecialsContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Shadi Specials">
    <div className="mb-3">
      <label className="form-label">Newsletter Subscription</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="shadiSpecials"
          id="subscribeShadiSpecials"
          checked={settings.shadiSpecials === true}
          onChange={() => onSettingChange('shadiSpecials', true)}
        />
        <label className="form-check-label" htmlFor="subscribeShadiSpecials">
          Subscribe
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="shadiSpecials"
          id="unsubscribeShadiSpecials"
          checked={settings.shadiSpecials === false}
          onChange={() => onSettingChange('shadiSpecials', false)}
        />
        <label className="form-check-label" htmlFor="unsubscribeShadiSpecials">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default ShadiSpecialsContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const ShadiSpecialsContent = () => {
//   return (
//     <AlertBox title="Shadi Specials">
//     <div className="mb-3">
//       <label className="form-label">Newsletter</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="newsletterAlert"
//           id="occasionally10"
//         />
//         <label className="form-check-label" htmlFor="occasionally10">
//           Occasionally - Not more than twice a month
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="newsletterAlert"
//           id="unsubscribe10"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="unsubscribe10">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default ShadiSpecialsContent
