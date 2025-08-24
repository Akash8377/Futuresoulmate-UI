import React, { useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { camelCaseToNormalText, convertAgeRange,convertHeightRange,convertIncomeRange } from "../../utils/helpers";
import { MARITAL_STATUS, RELIGIONS, COMMUNITIES, LANGUAGES, COUNTRIES, STATE, PROFESSIONS, DIET, PROFILEMANAGEDBY, QUALIFICATIONS, OCCUPATIONS } from "../../constants/formData";
import PreferenceCard from "../../components/PartnerPreferences/PreferenceCard";
import SliderModal from "../../components/PartnerPreferences/SliderModal";
import CheckboxModal from "../../components/PartnerPreferences/CheckboxModal";
import InputModal from "../../components/PartnerPreferences/InputModal";
import { PREFERENCE_SECTIONS, INITIAL_PREFS } from "../../constants/formData";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/Common/Toast";
import axios from "axios";
import config from "../../config";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../../features/user/userSlice";


// Map field names to their corresponding data arrays
const FIELD_OPTIONS_MAP = {
  maritalStatus: MARITAL_STATUS,
  religion: RELIGIONS,
  community: COMMUNITIES,
  motherTongue: LANGUAGES,
  country: COUNTRIES,
  profession: Object.values(PROFESSIONS).flat(), // Flatten the grouped professions into a single array
  diet: DIET,
  profileManagedBy: PROFILEMANAGEDBY,
  workingWith: OCCUPATIONS,
  qualification: QUALIFICATIONS,
  state: Object.values(STATE).flat(),
};

const PartnerPreferences = ({onlyPartnerPrefrence = false}) => {
  const [showExtraCards, setShowExtraCards] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Edit");
  const [inputValue, setInputValue] = useState("");
  const [currentField, setCurrentField] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const { userInfo, token } = useSelector(state => state.user);
  const [preferences, setPreferences] = useState(onlyPartnerPrefrence ? userInfo?.partner_preference && typeof userInfo?.partner_preference === 'object'? userInfo?.partner_preference : JSON.parse(userInfo?.partner_preference) || INITIAL_PREFS : INITIAL_PREFS );
 const [ranges, setRanges] = useState(
  onlyPartnerPrefrence ? {
    age: convertAgeRange(preferences?.basic?.ageRange),
    height: convertHeightRange(preferences?.basic?.heightRange),
    income: convertIncomeRange(preferences?.education?.annualIncome)
  } : {
    age: [20, 23],
    height: [59, 67],
    income: [1, 5]
  }
);
  const dispatch = useDispatch()
  const convertToFeet = useCallback((inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}′ ${remainingInches}″`;
  }, []);

  const handleItemClick = useCallback((section, field) => {
    setCurrentField({ section, field });
    setModalTitle(field === "title"
      ? `${section.charAt(0).toUpperCase() + section.slice(1)} Preferences`
      : camelCaseToNormalText(field)
    );

    // Handle checkbox fields
    if (FIELD_OPTIONS_MAP[field]) {
      const currentValue = preferences[section][field];
      setSelectedOptions(prev => ({
        ...prev,
        [field]: currentValue === "Open to All" ? ["Open to All"] :
          currentValue.includes(",") ? currentValue.split(",").map(s => s.trim()) :
            currentValue ? [currentValue] : []
      }));
    } else {
      setInputValue(
        field === "ageRange" ? ranges.age.join("-") :
          field === "heightRange" ? ranges.height.join("-") :
            preferences[section][field]
      );
    }
    setShowModal(true);
  }, [preferences, ranges]);

  const handleRangeChange = useCallback((type, value) => {
    setRanges(prev => ({ ...prev, [type]: value }));
    const formatValue = type === "height"
      ? `${convertToFeet(value[0])} – ${convertToFeet(value[1])}`
      : type === "income"
        ? `INR ${value[0]} ${value[0] > 1 ? 'lakhs' : 'lakh'} to ${value[1]} lakhs`
        : `${value[0]} – ${value[1]}`;

    setPreferences(prev => ({
      ...prev,
      [type === "income" ? "education" : "basic"]: {
        ...prev[type === "income" ? "education" : "basic"],
        [type === "income" ? "annualIncome" : type + "Range"]: formatValue
      }
    }));
  }, [convertToFeet]);

  const handleCheckboxChange = useCallback((field, value) => {
    setSelectedOptions(prev => {
      const currentSelections = prev[field] || [];

      if (value === "Open to All") {
        return {
          ...prev,
          [field]: currentSelections.includes("Open to All") ? [] : ["Open to All"]
        };
      }

      let newSelected = currentSelections.filter(v => v !== "Open to All");
      const index = newSelected.indexOf(value);

      index > -1 ? newSelected.splice(index, 1) : newSelected.push(value);

      if (newSelected.length === FIELD_OPTIONS_MAP[field].length) {
        newSelected = ["Open to All"];
      }

      return {
        ...prev,
        [field]: newSelected
      };
    });
  }, []);

const handleSave = useCallback(() => {
  if (!currentField) return;
  const { section, field } = currentField;

  const isCheckboxField = FIELD_OPTIONS_MAP[field];
  const newValue = isCheckboxField
    ? selectedOptions[field].includes("Open to All") ||
      selectedOptions[field].length === FIELD_OPTIONS_MAP[field].length
      ? "Open to All"
      : selectedOptions[field].join(", ")
    : inputValue;

  const updatedPreferences = {
    ...preferences,
    [section]: {
      ...preferences[section],
      [field]: newValue
    }
  };

  setPreferences(updatedPreferences);
  setShowModal(false);
}, [currentField, inputValue, selectedOptions, navigate, preferences]);

const handleClose = ()=>{
  setShowModal(false);
}

const handleFormSubmit = async (formData) => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Get data from sessionStorage
    const otherData = JSON.parse(sessionStorage.getItem("otherData") || '{}');
    
    // Combine form data with preferences
    const completeData = {
      ...otherData,
      onlyPartnerPrefrence:onlyPartnerPrefrence,
      ...preferences
    };
    console.log("completeData",completeData);
    // Make API call
    const response = await axios.post(
      `${config.baseURL}/api/profile/partner-preference`,
      completeData,
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
      let updatedUser = {}
      if(!onlyPartnerPrefrence){
        updatedUser = {
          ...userInfo,
          verificationData:  otherData.verificationData,
          hobbies:  otherData.hobbies,
          financial_status:  otherData.financialStatus,
          family_details:  otherData.familyDetails,
          partner_preference: preferences,
        };
      }else{
        updatedUser = {
          ...userInfo,
          partner_preference: preferences,
        };
      }
     dispatch(setUser({
      userInfo: updatedUser,
      token: token, // ← do NOT change token
    }));
      navigate("/dashboard");
      sessionStorage.removeItem("otherData")
    } else {
      throw new Error(response.data.message || "Failed to save preferences");
    }
  } catch (err) {
    console.error("Submission error:", err);
    const errorMessage = err.response?.data?.message || err.message || "Failed to save partner preferences. Please try again.";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  const renderModalContent = useCallback(() => {
    if (!currentField) return null;
    const { field } = currentField;

    // Check if it's a slider field
    if (field === "ageRange" || field === "heightRange" || field === "annualIncome") {
      const type = field === "annualIncome" ? "income" : field.replace("Range", "");
      return (
        <SliderModal
          title={camelCaseToNormalText(field)}
          value={ranges[type]}
          min={type === "age" ? 20 : type === "height" ? 48 : 1}
          max={type === "age" ? 73 : type === "height" ? 84 : 20}
          onChange={(v) => handleRangeChange(type, v)}
          formatValue={type === "height" ?
            (val) => `${convertToFeet(val[0])} - ${convertToFeet(val[1])}` : type === "income" ?
            (val) => `INR ${val[0]} ${val[0] > 1 ? 'lakhs' : 'lakh'} - ${val[1]} lakhs` :
            undefined}
        />
      );
    }

    // Check if it's a checkbox field
    if (FIELD_OPTIONS_MAP[field]) {
      return (
        <CheckboxModal
          title={camelCaseToNormalText(field)}
          options={[{ value: "Open to All", label: "Open to All" }, ...FIELD_OPTIONS_MAP[field]]}
          selectedValues={selectedOptions[field] || []}
          onChange={(value) => handleCheckboxChange(field, value)}
        />
      );
    }

    // Default to input field
    return <InputModal value={inputValue} onChange={setInputValue} />;
  }, [currentField, ranges, inputValue, selectedOptions, handleRangeChange, handleCheckboxChange, convertToFeet]);

  const visibleSections = showExtraCards
    ? PREFERENCE_SECTIONS
    : PREFERENCE_SECTIONS.slice(0, 2);


  return (
    <>
      <div className={`verfiy-profile ${onlyPartnerPrefrence && "bg-transparent" }`}>
        <div className="partner-perfrence">
          <div className="container">
            <h2>Recommended Partner Preferences</h2>
            <p className="note">Tap on the field to edit</p>

            {visibleSections.map(section => (
              <PreferenceCard
                key={section.section}
                {...section}
                preferences={preferences}
                onItemClick={handleItemClick}
              />
            ))}

            {!showExtraCards && (
              <button id="btn-more" className="btn" onClick={() => setShowExtraCards(true)}>
                More
              </button>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body><div className="partner-prefrence">{renderModalContent()}</div></Modal.Body>
              <Modal.Footer>
                <button className="btn btn-primary" onClick={currentField?.field === "ageRange" ||
                  currentField?.field === "heightRange" || currentField?.field === "annualIncome" ?handleClose : handleSave}>
                  {currentField?.field === "ageRange" || currentField?.field === "heightRange" ||
                  currentField?.field === "annualIncome" ? "Close" : "Save"}
                </button>
              </Modal.Footer>
            </Modal>
            <div className="d-flex justify-content-end">
             <button
              className="btn"
              style={{ background: "var(--color-primary)", color: "white" }}
              onClick={handleFormSubmit}
            >
              Save
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerPreferences;