import React from 'react';
import FormFooter from './FormFooter';

const DisplayNameSection = ({onChangeTab, settings, onSettingChange, userInfo }) => {
  const fullName = `${userInfo?.first_name || ''} ${userInfo?.last_name || ''}`.trim();
  
  return (
    <div className="privacy-part1">
      <div className="mb-3">
        <strong>Full Name</strong>
        <span className="ms-2">{fullName}</span>
        <a href="#" onClick={()=>onChangeTab("profile")} className="edit-link">Edit</a>
      </div>

      <div className="mb-3">
        <strong>Display Name as</strong>
        <div className="form-check mt-2 radio-option">
          <input
            className="form-check-input"
            type="radio"
            name="displayName"
            id="hideLast"
            checked={settings.displayName === 'hideLast'}
            onChange={() => onSettingChange('displayName', 'hideLast')}
          />
          <label className="form-check-label" htmlFor="hideLast">
            Hide my last name <small>({userInfo?.first_name} {userInfo?.last_name?.charAt(0) || ''})</small>
            <span className="recommended-badge">Recommended</span>
          </label>
        </div>
        <div className="form-check mt-2 radio-option">
          <input
            className="form-check-input"
            type="radio"
            name="displayName"
            id="hideFirst"
            checked={settings.displayName === 'hideFirst'}
            onChange={() => onSettingChange('displayName', 'hideFirst')}
          />
          <label className="form-check-label" htmlFor="hideFirst">
            Hide my first name <small>({userInfo?.first_name?.charAt(0) || ''} {userInfo?.last_name})</small>
            {/* <a href="#" className="edit-link">More</a> */}
          </label>
        </div>
      </div>

      <div className="note-text mb-3">
        <em>Note:</em> All Premium Members will be able to see your full name.
      </div>
    </div>
  );
};

export default DisplayNameSection;



// import React from 'react';
// import FormFooter from './FormFooter';

// const DisplayNameSection = () => (
//   <div className="privacy-part1">
//     <div className="mb-3">
//       <strong>Full Name</strong>
//       <span className="ms-2">Akash Choudhary</span>
//       <a href="#" className="edit-link">Edit</a>
//     </div>

//     <div className="mb-3">
//       <strong>Display Name as</strong>
//       <div className="form-check mt-2 radio-option">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="displayName"
//           id="hideLast"
//           defaultChecked
//         />
//         <label className="form-check-label" htmlFor="hideLast">
//           Hide my last name <small>(Akash C)</small>
//           <span className="recommended-badge">Recommended</span>
//         </label>
//       </div>
//       <div className="form-check mt-2 radio-option">
//         <input
//           className="form-check-input"
//           type="radio"
//           name="displayName"
//           id="hideFirst"
//         />
//         <label className="form-check-label" htmlFor="hideFirst">
//           Hide my first name <small>(A Choudhary)</small>
//           <a href="#" className="edit-link">More</a>
//         </label>
//       </div>
//     </div>

//     <div className="note-text mb-3">
//       <em>Note:</em> All Premium Members will be able to see your full name.
//     </div>
    
//     <FormFooter />
//   </div>
// );

// export default DisplayNameSection;