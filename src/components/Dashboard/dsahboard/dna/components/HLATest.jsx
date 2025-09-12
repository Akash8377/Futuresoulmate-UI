import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const {userInfo, token} = useSelector(state=> state.user)
  const navigate = useNavigate();
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
  }, []);

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
    await saveStepData();
  
    if (step < 3) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate("/hla-dna", { state: { activeKey: "hla-dna-matches" } });
    }
  }, [step, saveStepData, navigate]);
  
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
                            return (
                              <React.Fragment key={gene.id}>
                                <tr>
                                  <td data-label="S.No.">{index + 1}</td>
                                  <td data-label="Gene Name">{gene.name}</td>
                                  <td data-label="Select">
                                    <select
                                      value={selectedOptions[gene.id] || ""}
                                      onChange={(e) => handleSelection(gene.id, e.target.value)}
                                      className="form-control"
                                    >
                                      <option value="">Select allele</option>
                                      {options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                                {selectedOptions[gene.id] === "Other" && (
                                  <tr>
                                    <td colSpan="2"></td>
                                    <td>
                                      <input
                                        type="text"
                                        placeholder="Please specify your HLA allele"
                                        value={otherValues[gene.id] || ""}
                                        onChange={(e) => handleOtherInput(gene.id, e.target.value)}
                                        className="form-control"
                                        style={{ marginTop: '5px' }}
                                      />
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
    </div>
  );
};

export default React.memo(HLATest);








// import React, { useState, useEffect } from 'react';
// import config from "../../../../config"
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import tippy from 'tippy.js';
// import 'tippy.js/dist/tippy.css';
// import { useSelector } from 'react-redux';
// import { toast } from '../../../Common/Toast';
// import axios from "axios";
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../../../features/user/userSlice';

// // HLA Allele Options
// const hlaOptions = {
//   "HLA-A": ["HLA-A*01", "HLA-A*02", "HLA-A*03", "HLA-A*11", "HLA-A*23", "HLA-A*24", "HLA-A*25", "HLA-A*26", "HLA-A*29", "HLA-A*30", "HLA-A*31", "HLA-A*32", "HLA-A*33", "HLA-A*34", "HLA-A*68", "HLA-A*69", "Other"],
//   "HLA-B": ["HLA-B*07", "HLA-B*08", "HLA-B*13", "HLA-B*15", "HLA-B*18", "HLA-B*27", "HLA-B*35", "HLA-B*37", "HLA-B*38", "HLA-B*39", "HLA-B*40", "HLA-B*44", "HLA-B*45", "HLA-B*49", "HLA-B*50", "HLA-B*51", "HLA-B*52", "HLA-B*53", "HLA-B*57", "HLA-B*58", "Other"],
//   "HLA-C": ["HLA-C*01", "HLA-C*02", "HLA-C*03", "HLA-C*04", "HLA-C*05", "HLA-C*06", "HLA-C*07", "HLA-C*08", "HLA-C*12", "HLA-C*14", "HLA-C*15", "HLA-C*16", "Other"],
//   "HLA-DPA1": ["HLA-DPA1*01", "HLA-DPA1*02", "HLA-DPA1*03", "HLA-DPA1*04", "Other"],
//   "HLA-DPB1": ["HLA-DPB1*01", "HLA-DPB1*02", "HLA-DPB1*03", "HLA-DPB1*04", "HLA-DPB1*05", "Other"],
//   "HLA-DQA1": ["HLA-DQA1*01", "HLA-DQA1*02", "HLA-DQA1*03", "HLA-DQA1*04", "HLA-DQA1*05", "Other"],
//   "HLA-DQB1": ["HLA-DQB1*02", "HLA-DQB1*03", "HLA-DQB1*04", "HLA-DQB1*05", "HLA-DQB1*06", "Other"],
//   "HLA-DRB1": ["HLA-DRB1*01", "HLA-DRB1*03", "HLA-DRB1*04", "HLA-DRB1*07", "HLA-DRB1*08", "HLA-DRB1*09", "HLA-DRB1*10", "HLA-DRB1*11", "HLA-DRB1*12", "HLA-DRB1*13", "HLA-DRB1*14", "HLA-DRB1*15", "HLA-DRB1*16", "Other"],
//   "HLA-DRB3": ["DRB3*01", "DRB3*02", "DRB3*03", "Other"],
//   "HLA-DRB4": ["DRB4*01", "Other"],
//   "HLA-DRB5": ["DRB5*01", "Other"]
// };

// // HLA Allele Descriptions
// const hlaDescriptions = {
//   "HLA-A": "Human Leukocyte Antigen A - involved in immune system regulation and presentation of peptides from inside the cell",
//   "HLA-B": "Human Leukocyte Antigen B - plays a critical role in the immune system by presenting peptide antigens to T-cells",
//   "HLA-C": "Human Leukocyte Antigen C - involved in immune system regulation, particularly in natural killer cell function",
//   "HLA-DPA1": "Human Leukocyte Antigen DP alpha chain - involved in antigen presentation to immune cells",
//   "HLA-DPB1": "Human Leukocyte Antigen DP beta chain - works with DPA1 to present antigens to T-cells",
//   "HLA-DQA1": "Human Leukocyte Antigen DQ alpha chain - involved in immune response and associated with autoimmune diseases",
//   "HLA-DQB1": "Human Leukocyte Antigen DQ beta chain - forms heterodimers with DQA1 to present antigens",
//   "HLA-DRB1": "Human Leukocyte Antigen DR beta chain - critical for immune response and associated with many autoimmune conditions",
//   "HLA-DRB3": "Human Leukocyte Antigen DR beta chain 3 - variant of DRB involved in immune response",
//   "HLA-DRB4": "Human Leukocyte Antigen DR beta chain 4 - variant of DRB involved in immune response",
//   "HLA-DRB5": "Human Leukocyte Antigen DR beta chain 5 - variant of DRB involved in immune response",
  
//   // Specific allele descriptions
//   "HLA-A*01": "Associated with slower HIV progression and certain autoimmune diseases",
//   "HLA-A*02": "Most common HLA-A allele in many populations, associated with some cancer immunotherapies",
//   "HLA-A*03": "Associated with hemochromatosis and some autoimmune conditions",
//   "HLA-B*27": "Strongly associated with ankylosing spondylitis and other seronegative spondyloarthropathies",
//   "HLA-B*57": "Associated with slow HIV progression and hypersensitivity to abacavir",
//   "HLA-DRB1*15": "Strongly associated with multiple sclerosis",
//   "HLA-DQB1*06": "Associated with narcolepsy and multiple sclerosis",
//   "HLA-DRB1*04": "Associated with rheumatoid arthritis and type 1 diabetes",
// };

// // HLA Test Questions Structure
// const hlaQuestions = {
//   step1: [
//     { id: "HLA-A1", name: "First HLA-A allele", options: hlaOptions["HLA-A"] },
//     { id: "HLA-A2", name: "Second HLA-A allele", options: hlaOptions["HLA-A"] },
//     { id: "HLA-B1", name: "First HLA-B allele", options: hlaOptions["HLA-B"] },
//     { id: "HLA-B2", name: "Second HLA-B allele", options: hlaOptions["HLA-B"] },
//     { id: "HLA-C1", name: "First HLA-C allele", options: hlaOptions["HLA-C"] },
//     { id: "HLA-C2", name: "Second HLA-C allele", options: hlaOptions["HLA-C"] }
//   ],
//   step2: [
//     { id: "HLA-DPA11", name: "First HLA-DPA1 allele", options: hlaOptions["HLA-DPA1"] },
//     { id: "HLA-DPA12", name: "Second HLA-DPA1 allele", options: hlaOptions["HLA-DPA1"] },
//     { id: "HLA-DPB11", name: "First HLA-DPB1 allele", options: hlaOptions["HLA-DPB1"] },
//     { id: "HLA-DPB12", name: "Second HLA-DPB1 allele", options: hlaOptions["HLA-DPB1"] },
//     { id: "HLA-DQA11", name: "First HLA-DQA1 allele", options: hlaOptions["HLA-DQA1"] },
//     { id: "HLA-DQA12", name: "Second HLA-DQA1 allele", options: hlaOptions["HLA-DQA1"] },
//     { id: "HLA-DQB11", name: "First HLA-DQB1 allele", options: hlaOptions["HLA-DQB1"] },
//     { id: "HLA-DQB12", name: "Second HLA-DQB1 allele", options: hlaOptions["HLA-DQB1"] }
//   ],
//   step3: [
//     { id: "HLA-DRB11", name: "First HLA-DRB1 allele", options: hlaOptions["HLA-DRB1"] },
//     { id: "HLA-DRB12", name: "Second HLA-DRB1 allele", options: hlaOptions["HLA-DRB1"] },
//     { id: "HLA-DRB3", name: "HLA-DRB3 allele", options: hlaOptions["HLA-DRB3"] },
//     { id: "HLA-DRB4", name: "HLA-DRB4 allele", options: hlaOptions["HLA-DRB4"] },
//     { id: "HLA-DRB5", name: "HLA-DRB5 allele", options: hlaOptions["HLA-DRB5"] }
//   ]
// };

// const HLATest = () => {
//   const [step, setStep] = useState(1);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const {userInfo, token} = useSelector(state => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Fetch existing HLA data
//     const fetchHLAData = async () => {
//       try {
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const response = await axios.get(
//           `${config.baseURL}/api/dna/get-hla-data`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//           }
//         );

//         const data = response.data;
//         if (data.hla_data) {
//           setSelectedOptions(JSON.parse(data.hla_data));
//         }
//       } catch (error) {
//         console.error("Error fetching HLA data:", error);
//         if (error.response) {
//           console.error("Server response:", error.response.data);
//         }
//       }
//     };
//     fetchHLAData();
//   }, [token]);

//   const handleSelection = (id, value) => {
//     setSelectedOptions((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   const saveStepData = async (currentStep) => {
//     try {
//       const response = await axios.post(
//         `${config.baseURL}/api/dna/save-hla-data`,
//         selectedOptions, 
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//         }
//       );

//       if (response.status !== 200) {
//         toast.error("Failed to save HLA data");
//       } else {
//         if (step === 3) toast.success("HLA data saved successfully");
//       }
//     } catch (error) {
//       console.error("Error saving HLA data:", error);
//       toast.error("Failed to save HLA data");
//     }
//   };

//   useEffect(() => {
//     tippy('.tooltip', {
//       allowHTML: true,
//       content: ``,
//       placement: 'top',
//     });
//   }, []);

//   const handleNext = async (e) => {
//     e.preventDefault();
//     await saveStepData(step);
  
//     if (step < 3) {
//       setStep((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       console.log("navigating to dna matches")
//       navigate("/hla-dna", { state: { activeKey: "hla-dna-matches" } });
//     }
//   };
  
//   const handlePrevious = () => {
//     setStep((prev) => prev - 1);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const getStepTitle = () => {
//     switch(step) {
//       case 1:
//         return (
//           <>
//             <h2 style={{ fontWeight: 'bold', marginBottom: '20px', color: "#d61962" }}>FUTURE SHADI HLA TEST</h2>
//             <h3 style={{ marginBottom: '20px' }}>Class I Genes (HLA-A, HLA-B, HLA-C)</h3>
//           </>
//         );
//       case 2:
//         return <h3 style={{ marginBottom: '20px', color: "#d61962" }}>Class II Genes (HLA-DP, HLA-DQ)</h3>;
//       case 3:
//         return <h3 style={{ marginBottom: '20px', color: "#d61962" }}>Class II Genes (HLA-DR and DRB3/4/5)</h3>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="loginscreen">
//       <div className="form_part">
//         <div className="panel-body personalityformpage">
//           <div id="grad1">
//             <div className="dna-card card">
//               <div
//                 className="tooltip reporttooltip"
//                 onClick={() => setShowPopup(true)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 ?
//               </div>
// {showPopup && (
//   <div className="popup" style={{
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//     zIndex: 1000,
//     width: '90%',
//     maxWidth: '400px',
//     maxHeight: '80vh',
//     overflowY: 'auto',
//   }}>
//     <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginBottom:'10px' }}>
//     <strong>HLA Allele Names and Details:</strong>
//       <button
//         onClick={() => setShowPopup(false)}
//         style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
//       >
//         ×
//       </button>
//     </div>
//     <div className='text-start'>
//         {/* HLA-A Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-A</strong> - Human Leukocyte Antigen A - involved in immune system regulation and presentation of peptides from inside the cell
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-A*01</strong> - Associated with slower HIV progression and certain autoimmune diseases</div>
//             <div><strong>HLA-A*02</strong> - Most common HLA-A allele in many populations, associated with some cancer immunotherapies</div>
//             <div><strong>HLA-A*03</strong> - Associated with hemochromatosis and some autoimmune conditions</div>
//             <div><strong>HLA-A*11</strong> - Common in Asian populations, associated with certain viral responses</div>
//             <div><strong>HLA-A*23</strong> - Found in various populations, involved in immune presentation</div>
//             <div><strong>HLA-A*24</strong> - Common in Asian populations, associated with some autoimmune diseases</div>
//             <div><strong>HLA-A*25</strong> - Less common variant with specific immune functions</div>
//             <div><strong>HLA-A*26</strong> - Found in diverse populations, involved in antigen presentation</div>
//             <div><strong>HLA-A*29</strong> - Associated with certain inflammatory conditions</div>
//             <div><strong>HLA-A*30</strong> - Variant with specific immune response patterns</div>
//             <div><strong>HLA-A*31</strong> - Associated with drug hypersensitivity reactions</div>
//             <div><strong>HLA-A*32</strong> - Less common allele with unique presentation properties</div>
//             <div><strong>HLA-A*33</strong> - Common in some ethnic groups, involved in immune regulation</div>
//             <div><strong>HLA-A*34</strong> - Rare variant with specific immune functions</div>
//             <div><strong>HLA-A*68</strong> - Broad antigen presentation capabilities</div>
//             <div><strong>HLA-A*69</strong> - Rare allele with unique immune properties</div>
//           </div>
//         </div>

//         {/* HLA-B Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-B</strong> - Human Leukocyte Antigen B - plays a critical role in the immune system by presenting peptide antigens to T-cells
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-B*07</strong> - Common allele involved in various immune responses</div>
//             <div><strong>HLA-B*08</strong> - Associated with autoimmune diseases like celiac disease</div>
//             <div><strong>HLA-B*13</strong> - Found in diverse populations, involved in immune presentation</div>
//             <div><strong>HLA-B*15</strong> - Family with multiple subtypes and immune functions</div>
//             <div><strong>HLA-B*18</strong> - Involved in various immune response mechanisms</div>
//             <div><strong>HLA-B*27</strong> - Strongly associated with ankylosing spondylitis and other seronegative spondyloarthropathies</div>
//             <div><strong>HLA-B*35</strong> - Common allele with broad antigen presentation</div>
//             <div><strong>HLA-B*37</strong> - Less common variant with specific immune functions</div>
//             <div><strong>HLA-B*38</strong> - Involved in specific immune responses</div>
//             <div><strong>HLA-B*39</strong> - Variant with unique presentation properties</div>
//             <div><strong>HLA-B*40</strong> - Family with multiple subtypes and functions</div>
//             <div><strong>HLA-B*44</strong> - Common in European populations, involved in immune regulation</div>
//             <div><strong>HLA-B*45</strong> - Found in African populations, specific immune functions</div>
//             <div><strong>HLA-B*49</strong> - Less common allele with unique properties</div>
//             <div><strong>HLA-B*50</strong> - Variant involved in specific immune responses</div>
//             <div><strong>HLA-B*51</strong> - Associated with Behçet's disease</div>
//             <div><strong>HLA-B*52</strong> - Involved in various autoimmune conditions</div>
//             <div><strong>HLA-B*53</strong> - Common in African populations, specific immune functions</div>
//             <div><strong>HLA-B*57</strong> - Associated with slow HIV progression and hypersensitivity to abacavir</div>
//             <div><strong>HLA-B*58</strong> - Associated with allopurinol hypersensitivity</div>
//           </div>
//         </div>

//         {/* HLA-C Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-C</strong> - Human Leukocyte Antigen C - involved in immune system regulation, particularly in natural killer cell function
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-C*01</strong> - Involved in NK cell regulation and immune response</div>
//             <div><strong>HLA-C*02</strong> - Common allele with specific immune functions</div>
//             <div><strong>HLA-C*03</strong> - Associated with various immune response patterns</div>
//             <div><strong>HLA-C*04</strong> - Involved in antigen presentation to immune cells</div>
//             <div><strong>HLA-C*05</strong> - Variant with unique immune properties</div>
//             <div><strong>HLA-C*06</strong> - Common in many populations, immune regulation</div>
//             <div><strong>HLA-C*07</strong> - Most common HLA-C allele, broad immune functions</div>
//             <div><strong>HLA-C*08</strong> - Involved in specific immune responses</div>
//             <div><strong>HLA-C*12</strong> - Common allele with diverse immune functions</div>
//             <div><strong>HLA-C*14</strong> - Less common variant with specific properties</div>
//             <div><strong>HLA-C*15</strong> - Involved in immune regulation and response</div>
//             <div><strong>HLA-C*16</strong> - Variant with unique presentation capabilities</div>
//           </div>
//         </div>

//         {/* HLA-DPA1 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DPA1</strong> - Human Leukocyte Antigen DP alpha chain - involved in antigen presentation to immune cells
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-DPA1*01</strong> - Alpha chain variant with specific binding properties</div>
//             <div><strong>HLA-DPA1*02</strong> - Common alpha chain involved in immune response</div>
//             <div><strong>HLA-DPA1*03</strong> - Variant with unique antigen presentation</div>
//             <div><strong>HLA-DPA1*04</strong> - Less common alpha chain with specific functions</div>
//           </div>
//         </div>

//         {/* HLA-DPB1 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DPB1</strong> - Human Leukocyte Antigen DP beta chain - works with DPA1 to present antigens to T-cells
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-DPB1*01</strong> - Beta chain variant involved in immune response</div>
//             <div><strong>HLA-DPB1*02</strong> - Common beta chain with broad antigen presentation</div>
//             <div><strong>HLA-DPB1*03</strong> - Variant with specific immune functions</div>
//             <div><strong>HLA-DPB1*04</strong> - Involved in various autoimmune conditions</div>
//             <div><strong>HLA-DPB1*05</strong> - Less common variant with unique properties</div>
//           </div>
//         </div>

//         {/* HLA-DQA1 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DQA1</strong> - Human Leukocyte Antigen DQ alpha chain - involved in immune response and associated with autoimmune diseases
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-DQA1*01</strong> - Alpha chain variant associated with celiac disease risk</div>
//             <div><strong>HLA-DQA1*02</strong> - Involved in various immune response patterns</div>
//             <div><strong>HLA-DQA1*03</strong> - Variant with specific antigen presentation</div>
//             <div><strong>HLA-DQA1*04</strong> - Less common alpha chain with unique functions</div>
//             <div><strong>HLA-DQA1*05</strong> - Common variant involved in multiple autoimmune conditions</div>
//           </div>
//         </div>

//         {/* HLA-DQB1 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DQB1</strong> - Human Leukocyte Antigen DQ beta chain - forms heterodimers with DQA1 to present antigens
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-DQB1*02</strong> - Strongly associated with celiac disease and type 1 diabetes</div>
//             <div><strong>HLA-DQB1*03</strong> - Family with multiple subtypes and immune functions</div>
//             <div><strong>HLA-DQB1*04</strong> - Involved in various autoimmune responses</div>
//             <div><strong>HLA-DQB1*05</strong> - Variant with specific immune properties</div>
//             <div><strong>HLA-DQB1*06</strong> - Associated with narcolepsy and multiple sclerosis</div>
//           </div>
//         </div>

//         {/* HLA-DRB1 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DRB1</strong> - Human Leukocyte Antigen DR beta chain - critical for immune response and associated with many autoimmune conditions
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>HLA-DRB1*01</strong> - Associated with rheumatoid arthritis and other autoimmune diseases</div>
//             <div><strong>HLA-DRB1*03</strong> - Involved in multiple autoimmune conditions</div>
//             <div><strong>HLA-DRB1*04</strong> - Strongly associated with rheumatoid arthritis and type 1 diabetes</div>
//             <div><strong>HLA-DRB1*07</strong> - Common variant with various immune functions</div>
//             <div><strong>HLA-DRB1*08</strong> - Involved in specific immune responses</div>
//             <div><strong>HLA-DRB1*09</strong> - Less common variant with unique properties</div>
//             <div><strong>HLA-DRB1*10</strong> - Rare allele with specific immune functions</div>
//             <div><strong>HLA-DRB1*11</strong> - Family with multiple subtypes and functions</div>
//             <div><strong>HLA-DRB1*12</strong> - Variant involved in immune regulation</div>
//             <div><strong>HLA-DRB1*13</strong> - Common allele with broad immune functions</div>
//             <div><strong>HLA-DRB1*14</strong> - Involved in various immune response patterns</div>
//             <div><strong>HLA-DRB1*15</strong> - Strongly associated with multiple sclerosis</div>
//             <div><strong>HLA-DRB1*16</strong> - Less common variant with specific properties</div>
//           </div>
//         </div>

//         {/* HLA-DRB3 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DRB3</strong> - Human Leukocyte Antigen DR beta chain 3 - variant of DRB involved in immune response
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>DRB3*01</strong> - Variant involved in specific immune responses</div>
//             <div><strong>DRB3*02</strong> - Common DRB3 variant with immune functions</div>
//             <div><strong>DRB3*03</strong> - Less common variant with unique properties</div>
//           </div>
//         </div>

//         {/* HLA-DRB4 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DRB4</strong> - Human Leukocyte Antigen DR beta chain 4 - variant of DRB involved in immune response
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>DRB4*01</strong> - Primary variant of DRB4 involved in immune regulation</div>
//           </div>
//         </div>

//         {/* HLA-DRB5 Family */}
//         <div style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #d61962' }}>
//           <strong style={{ color: '#d61962', fontSize: '16px' }}>HLA-DRB5</strong> - Human Leukocyte Antigen DR beta chain 5 - variant of DRB involved in immune response
//           <div style={{ marginLeft: '15px', marginTop: '5px' }}>
//             <div><strong>DRB5*01</strong> - Primary variant of DRB5 involved in immune functions</div>
//           </div>
//         </div>
//     </div>
//   </div>
// )}

//               <div className="row">
//                 <div className="col-md-12 mx-0">
//                   <form id="msform">
//                     <fieldset>
//                       <table className="dnatable">
//                         <caption>
//                           {getStepTitle()}
//                         </caption>
//                         <thead>
//                           <tr>
//                             <th scope="col">S.No.</th>
//                             <th scope="col">Gene Name</th>
//                             <th scope="col">Selection</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {hlaQuestions[`step${step}`].map((gene, index) => (
//                             <tr key={gene.id}>
//                               <td data-label="S.No.">{index + 1}</td>
//                               <td data-label="Gene Name">{gene.name}</td>
//                               <td data-label="Select">
//                                 <div className="webform-component-radios">
//                                     <select
//                                       value={selectedOptions[gene.id] || ""}
//                                       onChange={(e) => handleSelection(gene.id, e.target.value)}
//                                       className="form-control"
//                                     >
//                                       <option value="">Select allele</option>
//                                       {gene.options.map((option) => (
//                                         <option key={option} value={option}>
//                                           {option}
//                                         </option>
//                                       ))}
//                                     </select>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                       <div className="stapcount">Step {step} of 3</div>
//                       {step > 1 && (
//                         <input
//                           type="button"
//                           className="previous action-button-previous"
//                           value="Previous"
//                           onClick={handlePrevious}
//                         />
//                       )}
//                       <input
//                         type="button"
//                         className="next action-button"
//                         value={step < 3 ? "Next Step" : "Finish"}
//                         onClick={handleNext}
//                       />
//                     </fieldset>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HLATest;