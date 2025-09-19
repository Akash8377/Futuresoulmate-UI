import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import tippy from 'tippy.js';
import axios from "axios";
import config from "../../../../../config";
import { toast } from '../../../../Common/Toast';
import 'tippy.js/dist/tippy.css';
import { hlaData, hlaQuestions } from '../../../../../constants/formData';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../../features/user/userSlice';

// Popup Component for Allele Descriptions
const AllelePopup = ({ showPopup, setShowPopup }) => {
  if (!showPopup) return null;

  return (
    <div className="popup" style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000, width: '90%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto',
    }}>
      <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong>HLA Allele Names and Details:</strong>
        <button
          onClick={() => setShowPopup(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
        >
          ×
        </button>
      </div>
      <div className='text-start'>
        {Object.entries(hlaData.options).map(([family, alleles]) => (
          <div key={family} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #0977af' }}>
            <strong style={{ color: '#0977af', fontSize: '16px' }}>{family}</strong> - {hlaData.descriptions[family]}
            <div style={{ marginLeft: '15px', marginTop: '5px' }}>
              {alleles.map(allele => (
                <div key={allele}>
                  <strong>{allele}</strong> - {hlaData.descriptions[allele] || 'Immune system regulation and antigen presentation'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HLATest = () => {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherValues, setOtherValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const {userInfo, token} = useSelector(state=> state.user)
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch existing HLA data
    const fetchHLAData = async () => {
      try {
        if (!token) return;

        const response = await axios.get(
          `${config.baseURL}/api/dna/get-hla-data`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );

        if (response.data.hla_data) {
            const data = JSON.parse(response.data.hla_data);
            setSelectedOptions(data);
            const updatedUserInfo = {...userInfo, hla_data:{...data}}
            dispatch(setUser({
                userInfo: updatedUserInfo,
                token: token,
            }));
          
          // Extract "Other" values if any
          const others = {};
          Object.entries(data).forEach(([key, value]) => {
            if (key.endsWith('_other') && value) {
              const mainKey = key.replace('_other', '');
              others[mainKey] = value;
            }
          });
          setOtherValues(others);
        }
      } catch (error) {
        console.error("Error fetching HLA data:", error);
      }
    };
    
    fetchHLAData();
  }, [token]);

  const handleSelection = useCallback((id, value) => {
    setSelectedOptions(prev => ({ 
      ...prev, 
      [id]: value,
      // Clear other value if not selecting "Other"
      ...(value !== "Other" && {[`${id}_other`]: ""})
    }));
    
    // Clear validation error when a selection is made
    setValidationErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[id];
      return newErrors;
    });
    
    // Clear other value if not selecting "Other"
    if (value !== "Other") {
      setOtherValues(prev => {
        const newValues = {...prev};
        delete newValues[id];
        return newValues;
      });
    }
  }, []);

  const handleOtherInput = useCallback((id, value) => {
    setOtherValues(prev => ({ ...prev, [id]: value }));
    setSelectedOptions(prev => ({ ...prev, [`${id}_other`]: value }));
    
    // Clear validation error when typing in other field
    if (value.trim()) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  }, []);

  const validateStep = useCallback(() => {
    const errors = {};
    const currentStepQuestions = hlaQuestions[`step${step}`];
    
    currentStepQuestions.forEach(gene => {
      // Check if field is empty
      if (!selectedOptions[gene.id]) {
        errors[gene.id] = "This field is required";
      }
      
      // Check if "Other" is selected but no value provided
      if (selectedOptions[gene.id] === "Other" && !otherValues[gene.id]?.trim()) {
        errors[gene.id] = "Please specify your HLA allele";
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [step, selectedOptions, otherValues]);

  const saveStepData = useCallback(async () => {
    try {
      // Combine selected options with other values
      const dataToSave = {
        ...selectedOptions,
        ...Object.fromEntries(
          Object.entries(otherValues).map(([key, value]) => [`${key}_other`, value])
        )
      };
      
      await axios.post(
        `${config.baseURL}/api/dna/save-hla-data`,
        dataToSave, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (step === 3) toast.success("HLA data saved successfully");
    } catch (error) {
      console.error("Error saving HLA data:", error);
      toast.error("Failed to save HLA data");
    }
  }, [selectedOptions, otherValues, token, step]);

  useEffect(() => {
    tippy('.tooltip', { placement: 'top' });
  }, []);

  const handleNext = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate current step before proceeding
    if (!validateStep()) {
      toast.error("Please complete all fields before proceeding");
      return;
    }
    
    await saveStepData();
  
    if (step < 3) {
      setStep(prev => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, saveStepData, validateStep]);
  
  const handlePrevious = useCallback(() => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stepTitle = useMemo(() => {
    const titles = {
      1: { main: "FUTURE SOULMATES HLA TEST", sub: "Class I Genes (HLA-A, HLA-B, HLA-C)" },
      2: { main: "Class II Genes (HLA-DP, HLA-DQ)", sub: null },
      3: { main: "Class II Genes (HLA-DR and DRB3/4/5)", sub: null }
    };
    
    const { main, sub } = titles[step];
    return (
      <>
        {step === 1 && <h2 style={{ fontWeight: 'bold', marginBottom: '20px', color: "#0977af" }}>{main}</h2>}
        <h3 style={{ marginBottom: '20px', color: step !== 1 ? "#0977af" : "inherit" }}>
          {sub || main}
        </h3>
      </>
    );
  }, [step]);

  const currentQuestions = useMemo(() => hlaQuestions[`step${step}`], [step]);

  // Safe option getter to prevent undefined errors
  const getOptions = useCallback((type) => {
    return hlaData.options[type] || [];
  }, []);

  return (
    <div className="loginscreen">
      <div className="form_part">
        <div className="panel-body personalityformpage">
          <div id="grad1">
            <div className="dna-card card">
              <div className="tooltip reporttooltip" onClick={() => setShowPopup(true)} style={{ cursor: 'pointer' }}>
                ?
              </div>

              <AllelePopup showPopup={showPopup} setShowPopup={setShowPopup} />

              <div className="row">
                <div className="col-md-12 mx-0">
                  <form id="msform">
                    <fieldset>
                      <table className="dnatable">
                        <caption>{stepTitle}</caption>
                        <thead>
                          <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">Gene Name</th>
                            <th scope="col">Selection</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentQuestions.map((gene, index) => {
                            const options = getOptions(gene.type);
                            const hasError = validationErrors[gene.id];
                            
                            return (
                              <React.Fragment key={gene.id}>
                                <tr className={hasError ? 'error-row' : ''}>
                                  <td data-label="S.No.">{index + 1}</td>
                                  <td data-label="Gene Name">{gene.name}</td>
                                  <td data-label="Select">
                                    <select
                                      value={selectedOptions[gene.id] || ""}
                                      onChange={(e) => handleSelection(gene.id, e.target.value)}
                                      className={`form-control ${hasError ? 'error' : ''}`}
                                    >
                                      <option value="">Select allele</option>
                                      {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                    {hasError && (
                                      <div className="error-message" style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>
                                        {validationErrors[gene.id]}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                                {selectedOptions[gene.id] === "Other" && (
                                  <tr className={validationErrors[gene.id] ? 'error-row' : ''}>
                                    <td colSpan="2"></td>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Please specify your HLA allele"
                                        value={otherValues[gene.id] || ""}
                                        maxLength={11}
                                        onChange={(e) => {
                                          let value = e.target.value;
                                          if (value.startsWith(" ")) {
                                            value = value.trimStart();
                                          }
                                          if (value.endsWith(" ")) {
                                            value = value.trimEnd();
                                          }
                                          handleOtherInput(gene.id, value);
                                        }}
                                        className={`form-control ${validationErrors[gene.id] ? 'error' : ''}`}
                                        style={{ marginTop: "5px" }}
                                      />
                                      {validationErrors[gene.id] && (
                                        <div className="error-message" style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>
                                          {validationErrors[gene.id]}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="stapcount">Step {step} of 3</div>
                      {step > 1 && (
                        <input
                          type="button"
                          className="previous action-button-previous"
                          value="Previous"
                          onClick={handlePrevious}
                        />
                      )}
                      <input
                        type="button"
                        className="next action-button"
                        value={step < 3 ? "Next Step" : "Finish"}
                        onClick={handleNext}
                      />
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .error {
          border-color: red !important;
        }
        .error-row {
          background-color: #ffebee;
        }
      `}</style>
    </div>
  );
};

export default React.memo(HLATest);