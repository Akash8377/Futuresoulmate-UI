import React from "react";
import AlertBox from "../AlertBox";

const ShadiInsiteContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Shadi Insite">
    <div className="mb-3">
      <label className="form-label">Newsletter Subscription</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="shadiInsite"
          id="subscribeShadiInsite"
          checked={settings.shadiInsite === true}
          onChange={() => onSettingChange('shadiInsite', true)}
        />
        <label className="form-check-label" htmlFor="subscribeShadiInsite">
          Subscribe
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="shadiInsite"
          id="unsubscribeShadiInsite"
          checked={settings.shadiInsite === false}
          onChange={() => onSettingChange('shadiInsite', false)}
        />
        <label className="form-check-label" htmlFor="unsubscribeShadiInsite">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default ShadiInsiteContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const ShadiInsiteContent = () => {
//   return (
//      <AlertBox title="Shadi Insite">
//     <div className="mb-3">
//       <label className="form-label">Insite Updates</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="insiteAlert"
//           id="monthly11"
//         />
//         <label className="form-check-label" htmlFor="monthly11">
//           Monthly
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="insiteAlert"
//           id="unsubscribe11"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="unsubscribe11">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default ShadiInsiteContent
