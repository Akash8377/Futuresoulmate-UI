import React, { useState, useEffect } from 'react';
import config from "../../../../../config"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';
import { toast } from '../../../../Common/Toast';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../../../../../features/user/userSlice';

const geneData = {
  step1: [
    { id: "ACE", name: "ACE" },
    { id: "ACTN3", name: "ACTN3" },
    { id: "ASIP", name: "ASIP" },
    { id: "AVPR1A", name: "AVPR1A/BRCA2" },
    { id: "COMT", name: "COMT" },
    { id: "EDAR", name: "EDAR" },
    { id: "FTO", name: "FTO" },
    { id: "HERC2/OCA2", name: "HERC2/OCA2" },
    { id: "HLA", name: "HLA" },
    { id: "LEPR", name: "LEPR" },
    { id: "MC1R", name: "MC1R" },
    { id: "PPARG", name: "PPARG" },
    { id: "SLC24A4", name: "SLC24A4" },
    { id: "TAS2R38", name: "TAS2R38" },
    { id: "TYR", name: "TYR" },
  ],
  step2: [
    { id: "5-HT2A (HTR2A)", name: "5-HT2A (HTR2A)" },
    { id: "APOE", name: "APOE" },
    { id: "ARNTL (BMAL1)", name: "ARNTL (BMAL1)" },
    { id: "BDNF", name: "BDNF" },
    { id: "CADM2", name: "CADM2" },
    { id: "CLOCK", name: "CLOCK" },
    { id: "COMT", name: "COMT" },
    { id: "DRD2", name: "DRD2" },
    { id: "DRD4", name: "DRD4" },
    { id: "FOXP2", name: "FOXP2" },
    { id: "GRIN2B", name: "GRIN2B" },
    { id: "KIBRA", name: "KIBRA" },
    { id: "MAOA", name: "MAOA" },
    { id: "OXTR", name: "OXTR" },
    { id: "PER1", name: "PER1" },
    { id: "PER3", name: "PER3" },
    { id: "SLC6A4", name: "SLC6A4" },
  ], 
  step3: [
    { id: "APOE", name: "APOE" },
    { id: "ATP7A", name: "ATP7A" },
    { id: "CFTR", name: "CFTR" },
    { id: "COL1A1", name: "COL1A1" },
    { id: "COL1A2", name: "COL1A2" },
    { id: "CYP21A2", name: "CYP21A2" },
    { id: "DMD", name: "DMD" },
    { id: "FMR1", name: "FMR1" },
    { id: "G6PD", name: "G6PD" },
    { id: "GJB2", name: "GJB2" },
    { id: "GLB1", name: "GLB1" },
    { id: "HBA1", name: "HBA1" },
    { id: "HBA2", name: "HBA2" },
    { id: "HBB", name: "HBB" },
    { id: "HBB (E variant)", name: "HBB (E variant)" },
    { id: "HEXA", name: "HEXA" },
    { id: "HLA", name: "HLA" },
    { id: "MPZ", name: "MPZ" },
    { id: "MTHFR Variant", name: "MTHFR Variant" },
    { id: "PAH", name: "PAH" },
    { id: "SMN1", name: "SMN1" },
    { id: "TSC1", name: "TSC1" },
    { id: "TSC2", name: "TSC2" },
  ],
  step4: [
    { id: "BRCA1,", name: "BRCA1," },
    { id: "BRCA2", name: "BRCA2" },
    { id: "CFTR", name: "CFTR" },
    { id: "COMT", name: "COMT" },
    { id: "FMR1", name: "FMR1" },
    { id: "GALT", name: "GALT" },
    { id: "HLA", name: "HLA" },
    { id: "LEPR", name: "LEPR" },
    { id: "MTHFR", name: "MTHFR" },
    { id: "PHEX", name: "PHEX" },
  ],
};

const DNATest = () => {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const {userInfo, token} = useSelector(state=> state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    // Fetch existing genetic marker data
const fetchGeneticMarkers = async () => {
  try {

    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await axios.get(
      `${config.baseURL}/api/dna/get-genetic-markers`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    // console.log("Fetched Data:", data);

    if (data.grouped_genetic_markers) {
      // console.log("flattenedData ",data.grouped_genetic_markers)
      const updatedUserInfo = {...userInfo, grouped_genetic_markers:{...data.grouped_genetic_markers}}
      dispatch(setUser({
        userInfo: updatedUserInfo,
        token: token,
      }));
      // Flatten the grouped data into a single object
      const flattenedData = {};

      // Process each category
      Object.values(data.grouped_genetic_markers).forEach((category) => {
        Object.entries(category).forEach(([gene, value]) => {
          if (typeof value === "number") {
            flattenedData[gene] = value;
          } else if (typeof value === "string") {
            flattenedData[gene] = value === "Yes" ? 1 : 0;
          }
        });
      });

      // Also check if there's any data in the root level (for backward compatibility)
      if (data.genetic_markers) {
        Object.entries(data.genetic_markers).forEach(([gene, value]) => {
          if (typeof value === "number") {
            flattenedData[gene] = value;
          } else if (typeof value === "string") {
            flattenedData[gene] = value === "Yes" ? 1 : 0;
          }
        });
      }
      setSelectedOptions(flattenedData);
    } else if (data.genetic_markers) {
      // Fallback to old structure if grouped data isn't available
      setSelectedOptions(data.genetic_markers);
    }
  } catch (error) {
    console.error("Error fetching genetic markers:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
  }
};
    fetchGeneticMarkers();
  }, []);

  const handleSelection = (id, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [id]: value === "Yes" ? 1 : 0,
    }));
  };



const saveStepData = async (currentStep) => {
  try {
    console.log("token", token);
    console.log(`Saving Step ${currentStep} Data:`, selectedOptions);

    const response = await axios.post(
      `${config.baseURL}/api/dna/save-genetic-markers`,
      selectedOptions, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );

    console.log("response: ", response);

    if (response.status !== 200) {
      toast.error("Failed to save step data");
    } else {
      if (step === 4) toast.success("Genetic data saved successfully");
      console.log("Step data saved successfully");
    }
  } catch (error) {
    console.error("Error saving step data:", error);
    toast.error("Failed to save step data");
  }
};



  useEffect(() => {
    tippy('.tooltip', {
      allowHTML: true, // Enable HTML content
      content: ``,
      placement: 'top', // Adjust tooltip placement as needed
    });
  }, []);

  const handleNext = async (e) => {
    e.preventDefault();
    await saveStepData(step);
  
    if (step < 4) {
      setStep((prev) => prev + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };
  
  const handlePrevious = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
  };

  const getStepTitle = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 style={{ fontWeight: 'bold', marginBottom: '20px',color:"#0977af" }}>FUTURE SOULMATES DNA TEST</h2>
            <h3 style={{ marginBottom: '20px' }}>Biological Attraction & Compatibility Genes</h3>
          </>
        );
      case 2:
        return <h3 style={{ marginBottom: '20px',color:"#d61962" }}>Psychological Compatibility Genes</h3>;
      case 3:
        return <h3 style={{marginBottom: '20px',color:"#d61962"  }}>Birth Defect Risk & Genetic Disorder Genes</h3>;
      case 4:
        return <h3 style={{ marginBottom: '20px',color:"#d61962"  }}>Reproductive Health & Cancer Risk Genes</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="loginscreen">
      <div className="form_part">
        <div className="panel-body personalityformpage">
          <div id="grad1">
            <div className="dna-card card">
              <div
                className="tooltip reporttooltip"
                onClick={() => setShowPopup(true)}
                style={{ cursor: 'pointer' }}
              >
                ?
              </div>
              {showPopup && (
                <div className="popup" style={{
                  position: 'fixed',
                  top: '52%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  padding: '20px',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  width: '400px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}>
                  <div style={{ fontSize: '18px',display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'5px' }}>
                    <strong className=''>Gene Names and Details:</strong>
                    <button
                      onClick={() => setShowPopup(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li><strong>ACE</strong> - Angiotensin-converting enzyme, involved in blood pressure regulation.</li>
                    <li><strong>HBB</strong> - Hemoglobin subunit beta, crucial for oxygen transport in red blood cells.</li>
                    <li><strong>PAH</strong> - Phenylalanine hydroxylase, associated with phenylketonuria (PKU).</li>
                    <li><strong>BRCA1/BRCA2</strong> - Breast cancer susceptibility genes, linked to hereditary breast and ovarian cancer.</li>
                    <li><strong>FMR1</strong> - Fragile X mental retardation 1, associated with Fragile X syndrome.</li>
                    <li><strong>SMN1</strong> - Survival motor neuron 1, linked to spinal muscular atrophy.</li>
                    <li><strong>HEXA</strong> - Hexosaminidase A, associated with Tay-Sachs disease.</li>
                    <li><strong>ATP7B</strong> - ATPase copper transporting beta, linked to Wilson's disease.</li>
                    <li><strong>GBA</strong> - Glucosylceramidase beta, associated with Gaucher's disease.</li>
                    <li><strong>GALT</strong> - Galactose-1-phosphate uridylyltransferase, linked to galactosemia.</li>
                    <li><strong>TCF7L2</strong> - Transcription factor 7-like 2, associated with type 2 diabetes risk.</li>
                    <li><strong>ADRB2</strong> - Adrenoceptor beta 2, involved in asthma and bronchodilation.</li>
                    <li><strong>APOE</strong> - Apolipoprotein E, linked to Alzheimer's disease and lipid metabolism.</li>
                    <li><strong>HLA</strong> - Human leukocyte antigen, involved in immune system regulation.</li>
                    <li><strong>MC1R</strong> - Melanocortin 1 receptor, associated with skin and hair pigmentation.</li>
                    <li><strong>EDAR</strong> - Ectodysplasin A receptor, linked to hair and tooth development.</li>
                    <li><strong>LEP</strong> - Leptin, involved in appetite and energy balance regulation.</li>
                    <li><strong>FTO</strong> - Fat mass and obesity-associated gene, linked to obesity risk.</li>
                    <li><strong>CLOCK</strong> - Circadian locomotor output cycles kaput, regulates circadian rhythms.</li>
                    <li><strong>OXTR</strong> - Oxytocin receptor, associated with social bonding and behavior.</li>
                    <li><strong>AVPR1A</strong> - Arginine vasopressin receptor 1A, linked to social behavior and stress response.</li>
                    <li><strong>SLC6A4</strong> - Serotonin transporter, associated with mood and anxiety disorders.</li>
                    <li><strong>COMT</strong> - Catechol-O-methyltransferase, involved in dopamine metabolism.</li>
                    <li><strong>DRD4</strong> - Dopamine receptor D4, linked to behavior and ADHD.</li>
                    <li><strong>BDNF</strong> - Brain-derived neurotrophic factor, associated with neuronal growth and plasticity.</li>
                    <li><strong>MAOA</strong> - Monoamine oxidase A, involved in neurotransmitter breakdown.</li>
                    <li><strong>NPY</strong> - Neuropeptide Y, regulates stress, appetite, and energy balance.</li>
                  </ul>
                </div>
              )}

              <div className="row">
                <div className="col-md-12 mx-0">
                  <form id="msform">
                    <fieldset>
                      <table className="dnatable">
                        <caption>
                          {getStepTitle()}
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">Gene Name</th>
                            <th scope="col">Selection</th>
                          </tr>
                        </thead>
                        <tbody>
                          {geneData[`step${step}`].map((gene, index) => (
                            <tr key={gene.id}>
                              <td data-label="S.No.">{index + 1}</td>
                              <td data-label="Gene Name">{gene.name}</td>
                              <td data-label="Select">
                                <div className="webform-component-radios">
                                  <div className="form-radius d-flex gap-3">
                                    <label className="control-label">
                                      <input
                                        type="radio"
                                        name={`gene-${gene.id}`}
                                        value="Yes"
                                        className="form-radio fancy-processed"
                                        checked={selectedOptions[gene.id] === 1}
                                        onChange={() => handleSelection(gene.id, "Yes")}
                                      />{" "}
                                      <span className="label-text">Yes</span>
                                    </label>
                                    <label className="control-label">
                                      <input
                                        type="radio"
                                        name={`gene-${gene.id}`}
                                        value="No"
                                        className="form-radio fancy-processed"
                                        checked={selectedOptions[gene.id] === 0}
                                        onChange={() => handleSelection(gene.id, "No")}
                                      />{" "}
                                      <span className="label-text">No</span>
                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="stapcount">Step {step} of 4</div>
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
                        value={step < 4 ? "Next Step" : "Finish"}
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

export default DNATest;