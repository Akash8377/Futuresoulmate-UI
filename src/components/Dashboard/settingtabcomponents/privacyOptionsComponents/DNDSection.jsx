import React from 'react';
import FormFooter from './FormFooter';

const DNDSection = ({ settings, onSettingChange }) => (
  <div className="privacy-part1">
    <div className="fw-semibold mb-2">Do Not Disturb</div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        name="dndSetting"
        id="dndOption"
        checked={settings.dnd}
        onChange={(e) => onSettingChange('dnd', e.target.checked)}
      />
      <label className="form-check-label" htmlFor="dndOption">
        Future Soulmate can Call Me Related Premium Offer
      </label>
    </div>
  </div>
);

export default DNDSection;



// import React from 'react';
// import FormFooter from './FormFooter';

// const DNDSection = () => (
//   <div className="privacy-part1">
//     <div className="fw-semibold mb-2">Do Not Disturb</div>
//     <div className="form-check">
//       <input
//         className="form-check-input"
//         type="checkbox"
//         name="dndSetting"
//         id="dndOption"
//         defaultChecked
//       />
//       <label className="form-check-label" htmlFor="dndOption">
//         Future Soulmate can Call Me Related Premium Offer
//       </label>
//     </div>
//     <FormFooter />
//   </div>
// );

// export default DNDSection;