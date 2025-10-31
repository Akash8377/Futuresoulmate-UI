import React from 'react';
import Select from 'react-select';
import useSearchFormHandlers from './SearchFormHandlers';
import { MARITAL_STATUS, RELIGIONS, CULTURES, LANGUAGES, COUNTRIES, STATE } from "../../../constants/formData";

const BasicSearchForm = () => {
  
  const {
    formData,
    loading,
    handleChange,
    handleSelectChange,
    handleSubmit,
    resetForm,
    handleMultiSelectChange
  } = useSearchFormHandlers();

  // Get states based on selected country
  const getStatesForCountry = (country) => {
    if (!country || !country.value) return [];
    return STATE[country.value] || [];
  };

  const currentStates = getStatesForCountry(formData.country);

  const renderRangeSelects = (label, fromName, toName, fromOptions, toOptions = fromOptions) => (
    <div className="row mb-3 mt-3 align-items-start">
      <div className="col-md-3"><label>{label}</label></div>
      <div className="col-auto">
        <select className="form-select" name={fromName} value={formData[fromName]} onChange={handleChange}>
          {fromOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="col-auto"><label className='pt-2'>to</label></div>
      <div className="col-auto">
        <select className="form-select" name={toName} value={formData[toName]} onChange={handleChange}>
          {toOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="row mb-3">
      <div className="col-md-3"><label htmlFor={name}>{label}</label></div>
      <div className="col-md-9">
        <Select
          id={name}
          name={name}
          value={formData[name]}
          onChange={(selectedOption) => handleSelectChange(name, selectedOption)}
          options={options}
          isClearable
          isSearchable
          placeholder={`Select ${label}`}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );

  const renderStateSelect = () => (
    <div className="row mb-3">
      <div className="col-md-3"><label htmlFor="state">State Living In</label></div>
      <div className="col-md-9">
        <Select
          id="state"
          name="state"
          value={formData.state}
          onChange={(selectedOption) => handleSelectChange('state', selectedOption)}
          options={currentStates}
          isClearable
          isSearchable
          isDisabled={!formData.country}
          placeholder={!formData.country ? "Select Country First" : "Select State"}
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {!formData.country && (
          <div className="form-text text-muted">
            Please select a country first to choose a state
          </div>
        )}
      </div>
    </div>
  );

  const renderCheckboxGroup = (label, items) => (
    <div className="row mb-3">
      <div className="col-md-3"><label>{label}</label></div>
      <div className="col-md-9">
        <div className="select-form-part">
          {items.map(item => (
            <div className="form-check mt-2" key={item.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={item.id}
                name={item.id}
                checked={formData[item.id]}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Add this function to your AdvancedSearchForm component
  const renderMultiSelect = (label, name, options) => (
    <div className="row mb-3">
      <div className="col-md-3"><label htmlFor={name}>{label}</label></div>
      <div className="col-md-9">
        <Select
          id={name}
          name={name}
          value={formData[name]}
          onChange={(selectedOptions) => handleMultiSelectChange(name, selectedOptions)}
          options={options}
          isClearable
          isSearchable
          isMulti
          placeholder={`Select ${label.replace('advance', '').replace(/([A-Z])/g, ' $1').trim()}`}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );

  return (
    <div className="search-form-part">
      <form onSubmit={(e) => handleSubmit(e, false)}>
        {renderRangeSelects(
          "Age", 
          "ageFrom", 
          "ageTo", 
          Array.from({length: 51}, (_, i) => (20 + i).toString())
        )}
        
        {renderRangeSelects(
          "Height", 
          "heightFrom", 
          "heightTo", 
          ["5ft 0in", "5ft 1in", "5ft 2in", "5ft 3in","5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in","5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in","6ft 0in", "6ft 1in", "6ft 2in","6ft 3in", "6ft 4in", "6ft 5in"]
        )}
        {renderSelect("Marital Status", "maritalStatus", MARITAL_STATUS)}
        {renderSelect("Religion", "religion", RELIGIONS)}
        {renderSelect("Language", "motherTongue", LANGUAGES)}
        {renderSelect("Community", "community", CULTURES)}
        {renderSelect("Country Living In", "country", COUNTRIES)}

        {renderCheckboxGroup("Privacy Settings", [
          {id: "visibleToAll", label: "Visible to all"},
          {id: "protectedPhoto", label: "Protected"}
        ])}

        {renderCheckboxGroup("Do not Show", [
          {id: "filterMeOut", label: "Profiles that have Filtered me out"},
          {id: "iFilteredOut", label: "Profiles that I have Filtered out"}
        ])}

        <div className="search-btn-options">
          <button type="submit" className='me-3' disabled={loading}>
            {loading ? 'Searching...' : 'Search'} <i className="fa fa-caret-right" aria-hidden="true"></i>
          </button>
          <button 
            type="button" 
            className="btn btn-link p-0"
            onClick={() => resetForm(false)}
            style={{textDecoration: 'none', color:'black', border: 'none', background: 'none'}}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicSearchForm;