import React, { useState, useMemo } from "react";
import { PROFESSIONS, STATE } from "../../constants/formData";

const CheckboxModal = ({ 
  title, 
  options, 
  selectedValues, 
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Get the categorized data source based on title
  const categorizedDataSource = useMemo(() => {
    if (title === "Profession" && PROFESSIONS) return PROFESSIONS;
    if (title === "State" && STATE) return STATE;
    return null;
  }, [title]);

  // Calculate total options count for categorized data
  const totalCategorizedOptions = useMemo(() => {
    return categorizedDataSource 
      ? Object.values(categorizedDataSource).reduce((sum, arr) => sum + arr.length, 0)
      : 0;
  }, [categorizedDataSource]);

  // For non-categorized fields
  const openToAllOption = useMemo(() => 
    options.find(opt => opt.value === "Open to All"), 
    [options]
  );
  
  const otherOptions = useMemo(() => 
    options.filter(opt => opt.value !== "Open to All"), 
    [options]
  );
  
  // Filter and sort options for non-categorized fields
  const filteredOptions = useMemo(() => {
    let result = otherOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm)
    );
    
    if (searchTerm) {
      // Sort alphabetically only when searching
      result = [...result].sort((a, b) => 
        a.label.localeCompare(b.label)
      );
    }
    return result;
  }, [otherOptions, searchTerm]);

  // For categorized fields (Profession/State)
  const filteredCategorizedOptions = useMemo(() => {
    if (!categorizedDataSource) return {};
    
    const result = {};
    
    Object.entries(categorizedDataSource).forEach(([category, categoryOptions]) => {
      let filtered = categoryOptions.filter(option =>
        option.label.toLowerCase().includes(searchTerm)
      );
      
      if (searchTerm) {
        // Sort alphabetically only when searching
        filtered = [...filtered].sort((a, b) => 
          a.label.localeCompare(b.label)
        );
      }
      
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    });
    
    return result;
  }, [categorizedDataSource, searchTerm]);

  const showSearchBar = categorizedDataSource 
    ? totalCategorizedOptions > 10 
    : otherOptions.length > 10;

  // Render categorized fields (Profession/State)
  if (categorizedDataSource) {
    return (
      <div className="checkbox-container">
        {/* Open to All always at top */}
        <div className="form-check open-to-all">
          <input
            className="form-check-input"
            type="checkbox"
            id="option-open-to-all"
            checked={selectedValues.includes("Open to All")}
            onChange={() => onChange("Open to All")}
          />
          <label className="form-check-label" htmlFor="option-open-to-all">
            Open to All
          </label>
        </div>
        
        {/* Conditionally show search bar */}
        {showSearchBar && (
          <div className="search-bar mb-2">
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              className="form-control"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        )}
        
        {/* Render categories */}
        {Object.entries(filteredCategorizedOptions).map(([category, categoryOptions]) => (
          <div key={category} className="profession-category">
            <h6>{category}</h6>
            {categoryOptions.map((option) => (
              <div key={option.value} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`option-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => onChange(option.value)}
                  disabled={selectedValues.includes("Open to All")}
                />
                <label 
                  className={`form-check-label ${selectedValues.includes("Open to All") ? 'text-muted' : ''}`} 
                  htmlFor={`option-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Render non-categorized fields
  return (
    <div className="checkbox-container">
      {/* Open to All always at top */}
      {openToAllOption && (
        <div className="form-check open-to-all">
          <input
            className="form-check-input"
            type="checkbox"
            id="option-open-to-all"
            checked={selectedValues.includes(openToAllOption.value)}
            onChange={() => onChange(openToAllOption.value)}
          />
          <label className="form-check-label" htmlFor="option-open-to-all">
            {openToAllOption.label}
          </label>
        </div>
      )}
      
      {/* Conditionally show search bar */}
      {showSearchBar && (
        <div className="search-bar mb-2">
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="form-control"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}
      
      {/* Filtered and sorted options */}
      {filteredOptions.map((option) => (
        <div key={option.value} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`option-${option.value}`}
            checked={selectedValues.includes(option.value)}
            onChange={() => onChange(option.value)}
            disabled={openToAllOption && selectedValues.includes("Open to All")}
          />
          <label className="form-check-label" htmlFor={`option-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxModal;