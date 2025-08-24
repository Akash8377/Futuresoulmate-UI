import React from 'react';
import useChoicesInitializer from './ChoicesInitializer';
import useSearchFormHandlers from './SearchFormHandlers';
import { MARITAL_STATUS, RELIGIONS, COMMUNITIES, LANGUAGES, COUNTRIES, STATE, PROFESSIONS, DIET, PROFILEMANAGEDBY, QUALIFICATIONS, OCCUPATIONS } from "../../../constants/formData";

const AdvancedSearchForm = () => {
  const stateList = Object.values(STATE).flat();
  const professionList = Object.values(PROFESSIONS).flat();
  useChoicesInitializer(true);
  
  const {
    formData,
    loading,
    searchResults,
    handleChange,
    handleMultiSelectChange,
    handleDietChange,
    handleProfileManagedByChange,
    handleSubmit,
    resetForm
  } = useSearchFormHandlers();

  const renderRangeSelects = (label, fromName, toName, options) => (
    <div className="row mb-3 mt-3 align-items-end">
      <div className="col-md-3"><label>{label}</label></div>
      <div className="col-auto">
        <select className="form-select" name={fromName} value={formData[fromName]} onChange={handleChange}>
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="col-auto"><label>to</label></div>
      <div className="col-auto">
        <select className="form-select" name={toName} value={formData[toName]} onChange={handleChange}>
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
    </div>
  );

const renderSelect = (label, name, options) => (
  <div className="row mb-3">
    <div className="col-md-3"><label htmlFor={name}>{label}</label></div>
    <div className="col-md-9">
      <select className="form-select" id={name} name={name} value={formData[name]} onChange={handleChange}>
        <option key={""} value={""}>{`Select ${name.replace('advance', '').replace(/([A-Z])/g, ' $1').trim()}`}</option>
        {options.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </div>
  </div>
);

  const renderCheckboxGroup = (label, name, items, handler) => (
    <div className="row mb-3">
      <div className="col-md-3"><label>{label}</label></div>
      <div className="col-md-9">
        <div className="select-form-part">
          {items.map(item => (
            <div className="form-check mt-2" key={item.value}>
              <input
                className="form-check-input"
                type="checkbox"
                value={item.value}
                id={item.id}
                checked={formData[name].includes(item.value)}
                onChange={handler}
              />
              <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccordionItem = (id, title, children) => (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading${id}`}>
        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`} aria-expanded="false" aria-controls={`collapse${id}`}>
          {title}
        </button>
      </h2>
      <div id={`collapse${id}`} className="accordion-collapse collapse" aria-labelledby={`heading${id}`}
        data-bs-parent="#accordionExample">
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="search-form-part">
      <form onSubmit={(e) => handleSubmit(e, true)}>
        {renderRangeSelects("Age", "advanceAgeFrom", "advanceAgeTo", Array.from({length: 51}, (_, i) => 20 + i))}
        {renderRangeSelects("Height", "advanceHeightFrom", "advanceHeightTo",
        ["5ft 0in", "5ft 1in", "5ft 2in", "5ft 3in","5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in","5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in","6ft 0in", "6ft 1in", "6ft 2in","6ft 3in", "6ft 4in", "6ft 5in"],
        ["5ft 0in", "5ft 1in", "5ft 2in", "5ft 3in","5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in","5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in","6ft 0in", "6ft 1in", "6ft 2in","6ft 3in", "6ft 4in", "6ft 5in"]
        )}
        {renderSelect("Marital Status", "advanceMaritalStatus", MARITAL_STATUS)}
        {renderSelect("Religion", "advanceReligion", RELIGIONS)}
        
        {/* Mother Tongue - Original Implementation */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="advanceMotherTongue">Mother Tongue</label>
          </div>
          <div className="col-md-9">
            <select 
              id="advanceMotherTongue" 
              className="form-select" 
              multiple
              onChange={(e) => handleMultiSelectChange('advanceMotherTongue','advanceMotherTongue')}
              placeholder="Select Mother Tongue"
              value={formData['advanceMotherTongue']}
            >
              {LANGUAGES.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        {renderSelect("Community", "advanceCommunity", COMMUNITIES)}

        <div className="accordion" id="accordionExample">
          {renderAccordionItem("One", "Location & Grew up in Details", <>
            {renderSelect("Country Living In", "advanceCountry", COUNTRIES)}
            {renderSelect("State Living In", "advanceState", stateList)}
            {renderSelect("Residency Status", "advanceResidencyStatus", [
              {value: "Doesn't Matter", label: "Doesn't Matter"},
              {value: "Citizen", label: "Citizen"},
              {value: "Permanent Resident", label: "Permanent Resident"},
              {value: "Work Visa", label: "Work Visa"}
            ])}
            {renderSelect("Country Grew Up In", "advanceCountryGrew", COUNTRIES)}
          </>)}

          {renderAccordionItem("Two", "Education & Profession Details", <>
            {renderSelect("Qualification", "advanceQualification", QUALIFICATIONS)}
            {renderSelect("Education Area", "advanceEducationArea", [
              {value: "Doesn't Matter", label: "Doesn't Matter"},
              {value: "Engineering", label: "Engineering"},
              {value: "Medicine", label: "Medicine"},
              {value: "Arts", label: "Arts"},
              {value: "Science", label: "Science"}
            ])}
            {renderSelect("Working With", "advanceWorkingWith", OCCUPATIONS)}
            {renderSelect("Profession Area", "advanceProfessionArea", professionList)}

            <div className="row mb-3">
              <div className="col-md-3"><label>Annual Income</label></div>
              <div className="col-md-9">
                <div className="d-flex">
                  {["Doesn't Matter", "Specify an income range"].map((option, i) => (
                    <div className="form-check me-3" key={option}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="advanceAnnualIncome"
                        id={`advanceAnnualIncome${i+1}`}
                        value={option}
                        checked={formData.advanceAnnualIncome === option}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={`advanceAnnualIncome${i+1}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>)}

          {renderAccordionItem("Three", "Lifestyle & Appearance", <>
            {renderCheckboxGroup("Diet", "advanceDiet", DIET.map(item => ({
              ...item,
              id: item.value.toLowerCase().replace(/\s+/g, '-')
            })), handleDietChange)}
          </>)}

          {renderAccordionItem("Four", "Search Using Key Words", <>
            <div className="row">
              <div className="col-md-12">
                <h5>For very specific results, filter your search using keywords.</h5>
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="e.g. MBA, traditional, music, etc"
                    style={{maxWidth: '350px'}}
                    name="advanceKeywords"
                    value={formData.advanceKeywords}
                    onChange={handleChange}
                  />
                </div>
                <p className="mb-0 mt-2">Choosing this option might significantly reduce the number of results.</p>
              </div>
            </div>
          </>)}
        </div>

        <div className="row mt-3 mb-3">
          <div className="col-md-3"><label>Chat Status</label></div>
          <div className="col-md-9">
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="advanceChatAvailable"
                name="advanceChatAvailable"
                checked={formData.advanceChatAvailable}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="advanceChatAvailable">
                Only Profiles available for Chat
              </label>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3"><label>Photo Settings</label></div>
          <div className="col-md-9 d-flex gap-2">
            {[
              {id: "advanceVisibleToAll", label: "Visible to all"},
              {id: "advanceProtectedPhoto", label: "Protected Photo"}
            ].map(item => (
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

        {renderCheckboxGroup("Profile Managed by", "advanceProfileManagedBy", PROFILEMANAGEDBY, handleProfileManagedByChange)}

        <div className="row mb-3">
          <div className="col-md-3"><label>Do not Show</label></div>
          <div className="col-md-9 d-flex gap-2">
            {[
              {id: "advanceFilterMeOut", label: "Profiles that have Filtered me out"},
              {id: "advanceIFilteredOut", label: "Profiles that I have Filtered out"}
            ].map(item => (
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

        <div className="search-btn-options">
          <button type="submit" className='me-3'>Search <i className="fa fa-caret-right" aria-hidden="true"></i></button>
          <a href="#" onClick={(e) => { e.preventDefault(); resetForm(true); }}>Reset</a>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearchForm;