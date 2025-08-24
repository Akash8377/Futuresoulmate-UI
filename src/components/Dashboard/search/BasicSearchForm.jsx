import React from 'react';
import useChoicesInitializer from './ChoicesInitializer';
import useSearchFormHandlers from './SearchFormHandlers';
import { MARITAL_STATUS, RELIGIONS, COMMUNITIES, LANGUAGES, COUNTRIES, STATE, PROFESSIONS } from "../../../constants/formData";

const BasicSearchForm = () => {
  const stateList = Object.values(STATE).flat();
  useChoicesInitializer();
  
  const {
    formData,
    loading,
    searchResults,
    handleChange,
    handleMultiSelectChange,
    handleSubmit,
    resetForm
  } = useSearchFormHandlers();

  const renderRangeSelects = (label, fromName, toName, fromOptions, toOptions = fromOptions) => (
    <div className="row mb-3 mt-3 align-items-end">
      <div className="col-md-3"><label>{label}</label></div>
      <div className="col-auto">
        <select className="form-select" name={fromName} value={formData[fromName]} onChange={handleChange}>
          {fromOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="col-auto"><label>to</label></div>
      <div className="col-auto">
        <select className="form-select" name={toName} value={formData[toName]} onChange={handleChange}>
          {toOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="row mb-3">
      <div className="col-md-3"><label htmlFor={name}>{label}</label></div>
      <div className="col-md-9">
        <select className="form-select" id={name} name={name} value={formData[name]} onChange={handleChange}>
          <option key={""} value={""}> {`Select ${name.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}`}</option>
          {options.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
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

  return (
    <div className="search-form-part">
      <form onSubmit={(e) => handleSubmit(e, false)}>
        {renderRangeSelects(
          "Age", 
          "ageFrom", 
          "ageTo", 
          Array.from({length: 51}, (_, i) => 20 + i)
        )}
        
        {renderRangeSelects(
          "Height", 
          "heightFrom", 
          "heightTo", 
          ["5ft 0in", "5ft 1in", "5ft 2in", "5ft 3in","5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in","5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in","6ft 0in", "6ft 1in", "6ft 2in","6ft 3in", "6ft 4in", "6ft 5in"],
          ["5ft 0in", "5ft 1in", "5ft 2in", "5ft 3in","5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in","5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in","6ft 0in", "6ft 1in", "6ft 2in","6ft 3in", "6ft 4in", "6ft 5in"]
        )}

        {renderSelect("Marital Status", "maritalStatus", MARITAL_STATUS)}
        {renderSelect("Religion", "religion", RELIGIONS)}
        
        {/* Mother Tongue - Multi-select */}
        <div className="row mb-3">
          <div className="col-md-3"><label htmlFor="motherTongue">Mother Tongue</label></div>
          <div className="col-md-9">
            <select 
              id="motherTongue" 
              className="form-select" 
              multiple
              onChange={() => handleMultiSelectChange('motherTongue', 'motherTongue')}
               placeholder="Select Mother Tongue"
              value={formData['motherTongue']}
            >
              {LANGUAGES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>

        {renderSelect("Community", "community", COMMUNITIES)}
        {renderSelect("Country Living In", "country", COUNTRIES)}
        {renderSelect("State Living In", "state", stateList)}

        {renderCheckboxGroup("Photo Settings", [
          {id: "visibleToAll", label: "Visible to all"},
          {id: "protectedPhoto", label: "Protected Photo"}
        ])}

        {renderCheckboxGroup("Do not Show", [
          {id: "filterMeOut", label: "Profiles that have Filtered me out"},
          {id: "iFilteredOut", label: "Profiles that I have Filtered out"}
        ])}

        <div className="search-btn-options">
          <button type="submit" className='me-3'>Search <i className="fa fa-caret-right" aria-hidden="true"></i></button>
          <a href="#" onClick={(e) => { e.preventDefault(); resetForm(false); }}>Reset</a>
        </div>
      </form>
    </div>
  );
};

export default BasicSearchForm;