import React from "react";
import AlertBox from "../AlertBox";

const RecentVisitorsContent = ({ settings, onSettingChange }) => (
  <AlertBox title="Recent Visitors Email">
    <div className="mb-3">
      <label className="form-label">Email Alert</label>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="recentVisitors"
          id="weekly3"
          checked={settings.recentVisitors === 'weekly'}
          onChange={() => onSettingChange('recentVisitors', 'weekly')}
        />
        <label className="form-check-label" htmlFor="weekly3">
          Weekly
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="recentVisitors"
          id="unsubscribe3"
          checked={settings.recentVisitors === 'unsubscribe'}
          onChange={() => onSettingChange('recentVisitors', 'unsubscribe')}
        />
        <label className="form-check-label" htmlFor="unsubscribe3">
          Unsubscribe
        </label>
      </div>
    </div>
  </AlertBox>
);

export default RecentVisitorsContent;



// import React from 'react'
// import AlertBox from "../AlertBox";
// import FormButtons from "../FormButtons";

// const RecentVisitorsContent = () => {
//   return (
//       <AlertBox title="Recent Visitors Email">
//     <div className="mb-3">
//       <label className="form-label">Email Alert</label>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert3"
//           id="weekly3"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="weekly3">
//           Weekly
//         </label>
//       </div>
//       <div className="form-check form-check-inline">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="emailAlert3"
//           id="unsubscribe3"
//         />
//         <label className="form-check-label" htmlFor="unsubscribe3">
//           Unsubscribe
//         </label>
//       </div>
//     </div>
//     <FormButtons />
//   </AlertBox>
//   )
// }

// export default RecentVisitorsContent
