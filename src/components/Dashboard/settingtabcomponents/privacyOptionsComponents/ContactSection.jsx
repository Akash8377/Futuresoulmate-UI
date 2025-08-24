import React from 'react';
import FormFooter from './FormFooter';

const ContactSection = ({ title, options, currentValue, onSettingChange }) => (
  <div className="privacy-part1">
    <div className="fw-semibold mb-2">{title}</div>
    {options.map((option, index) => (
      <div key={index} className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name={`${title}-options`}
          id={`${title}-option-${index}`}
          checked={currentValue === option.value}
          onChange={() => onSettingChange(option.value)}
        />
        <label 
          className="form-check-label" 
          htmlFor={`${title}-option-${index}`}
        >
          {option.label}
          {option.tooltip && (
            <span 
              className="ms-1 text-muted"
              data-bs-toggle="tooltip"
              data-bs-original-title={option.tooltip}
            >
              ⓘ
            </span>
          )}
        </label>
      </div>
    ))}
  </div>
);

export default ContactSection;



// import React from 'react';
// import FormFooter from './FormFooter';

// const ContactSection = ({ title, options }) => (
//   <div className="privacy-part1">
//     <div className="fw-semibold mb-2">{title}</div>
//     {options.map((option, index) => (
//       <div key={index} className="form-check">
//         <input
//           className="form-check-input"
//           type="radio"
//           name={`${title}-options`}
//           id={`${title}-option-${index}`}
//           defaultChecked={index === 0}
//         />
//         <label 
//           className="form-check-label" 
//           htmlFor={`${title}-option-${index}`}
//         >
//           {option.label}
//           {option.tooltip && (
//             <span 
//               className="ms-1 text-muted"
//               data-bs-toggle="tooltip"
//               data-bs-original-title={option.tooltip}
//             >
//               ⓘ
//             </span>
//           )}
//         </label>
//       </div>
//     ))}
//     <FormFooter />
//   </div>
// );

// export default ContactSection;