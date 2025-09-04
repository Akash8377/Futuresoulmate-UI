import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { MARITAL_STATUS, RELIGIONS, CULTURES, LANGUAGES, COUNTRIES, INITIAL_PREFS } from "../../../constants/formData";
import { parseAgeRange, parseHeight, formatHeight } from "../../../utils/helpers";
import { toast } from "../../../components/Common/Toast";
import axios from "axios";
import config from "../../../config";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../../../features/user/userSlice";

const ContactFilter = ({ userInfo, token }) => {
  const partnerPref = userInfo?.partner_preference ? typeof userInfo?.partner_preference === 'object'? userInfo?.partner_preference:JSON.parse(userInfo?.partner_preference || INITIAL_PREFS) : INITIAL_PREFS;
  const dispatch = useDispatch()
  // Initial states
  const [mainOpen, setMainOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(Object.fromEntries(
    ['age', 'height', 'country', 'religion', 'community', 'language', 'marital'].map(k => [k, false])));
  const [ageRange, setAgeRange] = useState(parseAgeRange(partnerPref.basic?.ageRange));
  const [heightRange, setHeightRange] = useState(parseHeight(partnerPref.basic?.heightRange));
  
  const fieldKeys = {
    country: partnerPref.location?.country, religion: partnerPref.community?.religion, community: partnerPref.community?.community, language: partnerPref.community?.language, marital: partnerPref.basic?.maritalStatus
  };

const [selectedOptions, setSelectedOptions] = useState(Object.fromEntries(
  Object.entries(fieldKeys).map(([k, v]) => [
    k, v && v !== "Open to All" ? (typeof v === 'string' ? v.split(',').map(item => item.trim()) : [v]) : []])
  ));

  const [openToAll, setOpenToAll] = useState(Object.fromEntries(
  Object.entries(fieldKeys).map(([k, v]) => [
    k, v === "Open to All" || !v])));

  const [dropdownOpen, setDropdownOpen] = useState(Object.fromEntries(
    Object.keys(fieldKeys).map(k => [k, false])
  ));

  const [searchTerms, setSearchTerms] = useState(Object.fromEntries(
    Object.keys(fieldKeys).map(k => [k, ''])
  ));

   const handleSearchChange = (key, e) => {
    const value = e.target.value;
    setSearchTerms(prev => ({ ...prev, [key]: value }));
    
    // Open dropdown when user starts typing
    if (value && !dropdownOpen[key]) {
      setDropdownOpen(prev => ({ ...prev, [key]: true }));
    }
  };

  // Data mapping
  const fieldData = {
    country: COUNTRIES, religion: RELIGIONS, community: CULTURES, language: LANGUAGES, marital: MARITAL_STATUS
  };

  const getFilteredOptions = (key) => {
    const term = searchTerms[key].toLowerCase();
    return fieldData[key].filter(o => o.label.toLowerCase().includes(term));
  };

  const toggleState = (setter, key) => setter(prev => ({ ...prev, [key]: !prev[key] }));

  const handleOptionSelect = (key, value) => {
    if (value === 'Open to All') {
      setOpenToAll(prev => ({ ...prev, [key]: true }));
      setSelectedOptions(prev => ({ ...prev, [key]: [] }));
    } else {
      setOpenToAll(prev => ({ ...prev, [key]: false }));
      setSelectedOptions(prev => ({
        ...prev,
        [key]: prev[key].includes(value) 
          ? prev[key].filter(opt => opt !== value)
          : [...prev[key], value]
      }));
    }
  };

  const formatSelectedValues = (key) => {
    if (openToAll[key]) return "Open to All";
    const opts = selectedOptions[key];
    return !opts.length ? "None selected" :
      opts.length > 3 ? `${opts.length} selected` :
      opts.join(", ");
  };

  const handleSubmit = async () => {
     const updatedPref = {
    ...partnerPref,
    basic: {
      ...partnerPref.basic,
      ageRange: `${ageRange[0]} – ${ageRange[1]}`,
      heightRange: `${formatHeight(heightRange[0])} – ${formatHeight(heightRange[1])}`,
      maritalStatus: openToAll.marital ? "Open to All" : selectedOptions.marital.join(", ") || ""
    },
    community: {
      ...partnerPref.community,
      religion: openToAll.religion ? "Open to All" : selectedOptions.religion.join(", ") || "",
      community: openToAll.community ? "Open to All" : selectedOptions.community.join(", ") || "",
      language: openToAll.language ? "Open to All" : selectedOptions.language.join(", ") || ""
    },
    location: {
      ...partnerPref.location,
      country: openToAll.country ? "Open to All" : selectedOptions.country.join(", ") || ""
    }
  };

    console.log("Updated partner preference:", {...updatedPref, onlyPartnerPrefrence:true});
    const response = await axios.post(
      `${config.baseURL}/api/profile/partner-preference`,
      {...updatedPref, onlyPartnerPrefrence:true},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Partner preferences saved successfully:", response.data);
    if (response.data.success) {
      toast.success("Partner preferences saved successfully!");
      const updatedUser = {
        ...userInfo,
        partner_preference: updatedPref,
      };
      dispatch(setUser({
        userInfo: updatedUser,
        token: token, // ← do NOT change token
      }));
  }
  };

  // Field configuration
  const fields = [
    { key: "age", label: "Age", value: `${ageRange[0]} – ${ageRange[1]}`, color: "text-success" },
    { key: "height", label: "Height", value: `${formatHeight(heightRange[0])} – ${formatHeight(heightRange[1])}`, color: "text-warning" },
    ...Object.keys(fieldKeys).map(key => ({
      key,
      label: key === 'language' ? 'Language' : 
             key === 'marital' ? 'Marital Status' : 
             key === 'community' ? 'Culture' : 
             key.charAt(0).toUpperCase() + key.slice(1),
      value: formatSelectedValues(key),
      color: `text-${key === 'country' ? 'primary' : 
             key === 'religion' ? 'warning' : 
             key === 'community' ? 'danger' : 
             key === 'language' ? 'info' : 'danger'}`
    }))
  ];

  // Render components
  const renderRangeSlider = (key, value, onChange, min, max, unit = '') => (
    <div className="p-3">
      <div className="mb-4">
        <h6>{key} Range: {key === 'height' ? formatHeight(value[0]) : value[0]} – {key === 'height'?formatHeight(value[1]) : value[1] }{unit}</h6>
        <Slider
          range min={min} max={max} value={value} onChange={onChange}
        />
        {key === 'height' && <div className="text-muted small mt-1">(Slider in inches for precision)</div>}
      </div>
    </div>
  );

  const renderDropdown = (key, label) => (
    <div className="select-container position-relative" onClick={() => toggleState(setDropdownOpen, key)}>
      <div className="selected-tags">
        {openToAll[key] ? <span className="tag">Open to All</span> :
          selectedOptions[key].length ? 
            selectedOptions[key].map(option => (
              <span className="tag" key={option}>
                {option}
                <button onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOptions(prev => ({ ...prev, [key]: prev[key].filter(opt => opt !== option) }));
                }}>×</button>
              </span>
            )) : <span className="tag">None selected</span>
        }
      </div>
      <input 
        className="select-input" 
        type="text" 
        placeholder={`Search ${label}...`}
        value={searchTerms[key]}
        onChange={(e) => handleSearchChange(key, e)}
        onClick={(e) => {
          e.stopPropagation();
          if (!dropdownOpen[key]) {
            setDropdownOpen(prev => ({ ...prev, [key]: true }));
          }
        }}
      />
      <span 
        className={`cursor-pointer select-arrow ${dropdownOpen[key] ? 'open' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleState(setDropdownOpen, key); }}
      >▼</span>
      {dropdownOpen[key] && (
        <div className="dropdown-options">
          <div 
            className={`dropdown-option ${openToAll[key] ? 'selected' : ''}`}
            onClick={() => {
              setOpenToAll(prev => ({ ...prev, [key]: true }));
              setSelectedOptions(prev => ({ ...prev, [key]: [] }));
            }}
          >
            Open to All
            {openToAll[key] && <span className="check-mark">✓</span>}
          </div>
          {getFilteredOptions(key).map(option => (
            <div 
              key={option.value}
              className={`dropdown-option ${selectedOptions[key].includes(option.value) ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(key, option.value)}
            >
              {option.label}
              {selectedOptions[key].includes(option.value) && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingThree">
        <button
          className={`accordion-button ${mainOpen ? "" : "collapsed"}`}
          type="button"
          onClick={() => setMainOpen(!mainOpen)}
        >
          Contact Filters
        </button>
      </h2>
      {mainOpen && (
        <div className="accordion-collapse collapse show">
          <div className="accordion-body">
            <div className="container mt-5">
              <div className="border rounded shadow-sm bg-white">
                <div className="p-3 border-bottom">
                  <h5 className="mb-1">Who can contact me?</h5>
                  <small className="text-muted">
                    Only Members matching the below criteria will get to see your contact details.
                  </small>
                  <br />
                  <small className="text-muted fst-italic">Tap on the field to edit</small>
                </div>

                <div className="accordion" id="contactAccordion">
                  {fields.map(({ key, label, value, color }) => (
                    <div className="accordion-item" key={key}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button d-flex align-items-center ${subOpen[key] ? "" : "collapsed"}`}
                          type="button"
                          onClick={() => toggleState(setSubOpen, key)}
                        >
                          <span className={`icon-label ${color}`}>{label}</span>
                          <span className="value-label ms-auto">{value}</span>
                        </button>
                      </h2>
                      {subOpen[key] && (
                        <div className="accordion-collapse collapse show">
                          <div className="accordion-body">
                            <div className="country-part">
                              <div className="box">
                                <label>Selected {label}</label>
                                {key === "age" && renderRangeSlider("age", ageRange, setAgeRange, 20, 71)}
                                {key === "height" && renderRangeSlider("height", heightRange, setHeightRange, 140, 200, "(ft/inch)")}
                                {!["age", "height"].includes(key) && renderDropdown(key, label)}
                                <div className="buttons mt-3">
                                  <button className="btn btn-cancel me-2" onClick={() => toggleState(setSubOpen, key)}>
                                    Cancel
                                  </button>
                                  <button className="btn btn-submit" onClick={handleSubmit}>
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactFilter;