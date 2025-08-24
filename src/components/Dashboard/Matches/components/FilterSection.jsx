// const FilterSection = ({ title, type, options, showMore }) => {
//   return (
//     <div className="mb-3">
//       <div className="d-flex justify-content-between align-items-center p-2 bg-light">
//         <strong className="text-dark small">{title}</strong>
//         <span style={{ cursor: "pointer" }}>&#8722;</span>
//       </div>
//       <div className="p-2">
//         {options.map((option, idx) => (
//           <div className="form-check mt-2" key={idx}>
//             <input
//               className="form-check-input"
//               type={type}
//               name={title.replace(/\s+/g, "-")}
//               id={`${title}-${idx}`}
//               defaultChecked={idx === 0}
//             />
//             <label className="form-check-label" htmlFor={`${title}-${idx}`}>
//               {option.label}
//               {option.isNew && (
//                 <span
//                   className="badge bg-warning rounded-pill ms-1"
//                   style={{ fontSize: "10px" }}
//                 >
//                   NEW
//                 </span>
//               )}
//               {option.count !== undefined && option.count !== null && (
//                 <> ({option.count})</>
//               )}
//             </label>
//           </div>
//         ))}

//         {showMore && (
//           <div className="more-button">
//             <a href="#">
//               More <i className="fa fa-caret-right" aria-hidden="true"></i>
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;

import React, { useState, useEffect } from 'react';

const FilterSection = ({ 
  title, 
  type, 
  options, 
  showMore,
  filterKey,
  onChange
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  // Initialize state properly
  const [selections, setSelections] = useState(() => {
    if (type === 'radio') {
      // Return first option value for radio
      return options[0]?.value || '';
    }
    // Return array with first option value for checkbox
    return options[0]?.value ? [options[0].value] : [];
  });

  // Handle initial options change
  useEffect(() => {
    if (onChange && filterKey) {
      onChange(filterKey, selections);
    }
  }, []); // Run only on mount

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleShowAll = () => {
    setShowAllOptions(!showAllOptions);
  };

  const handleOptionChange = (value) => {
    let newSelections;

    if (type === 'radio') {
      // For radio buttons, select the new value
      newSelections = value;
    } else {
      // For checkboxes
      if (value === 'all') {
        // When "All" is selected, clear other selections
        newSelections = ['all'];
      } else {
        // Add/remove the value from selections
        const isSelected = Array.isArray(selections) && selections.includes(value);
        newSelections = isSelected
          ? selections.filter(v => v !== value && v !== 'all')
          : [...(selections || []).filter(v => v !== 'all'), value];
        
        // If no options are selected, default to "All"
        if (newSelections.length === 0) {
          newSelections = ['all'];
        }
      }
    }

    setSelections(newSelections);
    
    // Notify parent component of the change
    if (onChange && filterKey) {
      onChange(filterKey, newSelections);
    }
  };

  // Determine which options to show
  const visibleOptions = showMore && !showAllOptions 
    ? options.slice(0, 3) 
    : options;

  return (
    <div className="mb-3">
      <div 
        className="d-flex justify-content-between align-items-center p-2 bg-light"
        style={{ cursor: 'pointer' }}
        onClick={toggleExpand}
      >
        <strong className="text-dark small">{title}</strong>
        <span>{expanded ? '−' : '+'}</span>
      </div>
      
      {expanded && (
        <div className="p-2">
          {visibleOptions.map((option, idx) => {
            if (!option.value) return null;
            
            // Determine if this option is selected
            let isSelected = false;
            
            if (type === 'radio') {
              isSelected = selections === option.value;
            } else if (Array.isArray(selections)) {
              isSelected = selections.includes(option.value);
            }

            return (
              <div className="form-check mt-2" key={`${filterKey}-${idx}`}>
                <input
                  className="form-check-input"
                  type={type}
                  name={filterKey}
                  id={`${filterKey}-${idx}`}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleOptionChange(option.value)}
                />
                <label className="form-check-label" htmlFor={`${filterKey}-${idx}`}>
                  {option.label}
                  {option.isNew && (
                    <span
                      className="badge bg-warning rounded-pill ms-1"
                      style={{ fontSize: "10px" }}
                    >
                      NEW
                    </span>
                  )}
                  {option.count !== undefined && option.count !== null && (
                    <> ({option.count})</>
                  )}
                </label>
              </div>
            );
          })}

          {showMore && options.length > 3 && (
            <div className="more-button mt-2">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={toggleShowAll}
              >
                {showAllOptions ? 'Show Less' : 'Show More'} 
                <i 
                  className={`fa fa-caret-${showAllOptions ? 'up' : 'down'} ms-1`} 
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSection;