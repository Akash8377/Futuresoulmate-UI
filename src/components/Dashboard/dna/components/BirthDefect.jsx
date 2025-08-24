import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

const geneticGroups = {
    "Biological Attraction": [
        "ACE", "ACTN3", "ASIP", "AVPR1A", "COMT", "EDAR", "FTO", "HERC2/OCA2",
        "HLA", "LEPR", "MC1R", "PPARG", "SLC24A4", "TAS2R38", "TYR"
    ],
    "Psychological Compatibility": [
        "5-HT2A", "APOE", "ARNTL", "BDNF", "CADM2", "CLOCK", "COMT", "DRD2", "DRD4",
        "FOXP2", "GRIN2B", "KIBRA", "MAOA", "OXTR", "PER1", "PER3", "SLC6A4"
    ],
    "Birth Defect Risk": [
        "APOE", "ATP7A", "CFTR", "COL1A1", "COL1A2", "CYP21A2", "DMD", "FMR1",
        "G6PD", "GJB2", "GLB1", "HBA1", "HBA2", "HBB", "HBB (E variant)", "HEXA",
        "HLA", "MPZ", "MTHFR Variant", "PAH", "SMN1", "TSC1", "TSC2"
    ],
    "Reproductive Health": [
        "BRCA1", "BRCA2", "CFTR", "COMT", "FMR1", "GALT", "HLA", "LEPR", "MTHFR", "PHEX"
    ]
};

const geneDescriptions = {
    "APOE": {
        description: "Associated with Alzheimer's disease risk and cardiovascular health.",
        risk: "Moderate",
        childRisk: "If both partners carry APOE ε4 variant, increased risk of Alzheimer's in offspring (1 in 4 chance if both parents have one copy)."
    },
    "ATP7A": {
        description: "Linked to Menkes disease, a copper metabolism disorder.",
        risk: "High",
        childRisk: "If both parents carry a mutation, 25% chance of affected child with severe neurological symptoms."
    },
    "CFTR": {
        description: "Causes cystic fibrosis when both copies are mutated.",
        risk: "High",
        childRisk: "25% chance of cystic fibrosis if both parents are carriers."
    },
    "COL1A1": {
        description: "Associated with Osteogenesis Imperfecta (brittle bone disease).",
        risk: "High",
        childRisk: "50% chance of passing on dominant form; 25% chance if both parents carry recessive mutations."
    },
    "COL1A2": {
        description: "Another gene for Osteogenesis Imperfecta.",
        risk: "High",
        childRisk: "Similar risks to COL1A1."
    },
    "CYP21A2": {
        description: "Causes congenital adrenal hyperplasia.",
        risk: "Moderate",
        childRisk: "25% chance if both parents are carriers."
    },
    "DMD": {
        description: "Causes Duchenne muscular dystrophy (X-linked).",
        risk: "High",
        childRisk: "Male children of carrier mothers have 50% chance of being affected."
    },
    "FMR1": {
        description: "Associated with Fragile X syndrome.",
        risk: "Moderate",
        childRisk: "Risk depends on number of CGG repeats; can range from mild to severe effects."
    },
    "G6PD": {
        description: "Causes G6PD deficiency (red blood cell disorder).",
        risk: "Moderate",
        childRisk: "X-linked, so males more likely to show symptoms if mother is carrier."
    },
    "GJB2": {
        description: "Commonly linked to hereditary non-syndromic hearing loss.",
        risk: "Moderate",
        childRisk: "If both parents carry a mutation, 25% chance of child with hearing loss."
    },
    "GLB1": {
        description: "Associated with GM1 gangliosidosis (lysosomal storage disorder).",
        risk: "High",
        childRisk: "25% chance if both parents are carriers."
    },
    "HBA1": {
        description: "Alpha thalassemia related gene.",
        risk: "Moderate",
        childRisk: "Depends on specific mutations; can range from mild to severe anemia."
    },
    "HBA2": {
        description: "Another alpha thalassemia gene.",
        risk: "Moderate",
        childRisk: "Similar to HBA1."
    },
    "HBB": {
        description: "Beta thalassemia and sickle cell disease gene.",
        risk: "High",
        childRisk: "25% chance of severe disease if both parents carry mutations."
    },
    "HBB (E variant)": {
        description: "Hemoglobin E variant.",
        risk: "Moderate",
        childRisk: "Combination with other variants can cause thalassemia."
    },
    "HEXA": {
        description: "Causes Tay-Sachs disease.",
        risk: "High",
        childRisk: "25% chance if both parents are carriers."
    },
    "HLA": {
        description: "Various immune-related conditions.",
        risk: "Variable",
        childRisk: "Depends on specific HLA associations."
    },
    "MPZ": {
        description: "Associated with Charcot-Marie-Tooth disease.",
        risk: "Moderate",
        childRisk: "50% chance if one parent has dominant form."
    },
    "MTHFR Variant": {
        description: "Affects folate metabolism; associated with neural tube defects.",
        risk: "Moderate",
        childRisk: "Increased risk of birth defects, especially with poor folate intake."
    },
    "PAH": {
        description: "Causes phenylketonuria (PKU).",
        risk: "High",
        childRisk: "25% chance if both parents are carriers."
    },
    "SMN1": {
        description: "Spinal muscular atrophy gene.",
        risk: "High",
        childRisk: "25% chance if both parents are carriers."
    },
    "TSC1": {
        description: "Tuberous sclerosis complex gene.",
        risk: "High",
        childRisk: "50% chance if one parent has dominant mutation."
    },
    "TSC2": {
        description: "Another tuberous sclerosis gene.",
        risk: "High",
        childRisk: "Similar to TSC1."
    }
};

const BirthDefect = () => {
    const [userName, setUserName] = useState({ first_name: '', last_name: '' });
    const [secondUserName, setSecondUserName] = useState({ first_name: '', last_name: '' });
    const [currentUserMarkers, setCurrentUserMarkers] = useState({});
    const [otherUserMarkers, setOtherUserMarkers] = useState({});
    const [groupScores, setGroupScores] = useState([]);
    const [isBirthDefectExpanded, setIsBirthDefectExpanded] = useState(true);
    const [isReproductiveHealthExpanded, setIsReproductiveHealthExpanded] = useState(true);
    const [sharedRiskGenes, setSharedRiskGenes] = useState([]);
      const location = useLocation();

  useEffect(() => {
    console.log("User Profile: ", location?.state?.userProfile);
    console.log("Selected Profile: ", location?.state?.selectedProfile);
    if (location?.state?.userProfile && location?.state?.selectedProfile) {
      setCurrentUserMarkers(location?.state?.userProfile.grouped_genetic_markers || {});
      setSecondUserName({
        first_name: location?.state?.userProfile.first_name,
        last_name: location?.state?.userProfile.last_name,
      });
      setOtherUserMarkers(
        location?.state?.selectedProfile.grouped_genetic_markers || {}
      );
      setUserName({
        first_name: location?.state?.selectedProfile.first_name,
        last_name: location?.state?.selectedProfile.last_name,
      });
    }
  }, [location]);

    useEffect(() => {
        if (Object.keys(currentUserMarkers).length > 0 && Object.keys(otherUserMarkers).length > 0) {
            calculateScores(currentUserMarkers, otherUserMarkers);
            findSharedRiskGenes(currentUserMarkers, otherUserMarkers);
        }
    }, [currentUserMarkers, otherUserMarkers]);

    const findSharedRiskGenes = (currentUser, otherUser) => {
        const sharedGenes = [];
        const birthDefectGenes = geneticGroups["Birth Defect Risk"];

        birthDefectGenes.forEach(gene => {
            const currentValue = getGeneValue(currentUser, gene);
            const otherValue = getGeneValue(otherUser, gene);

            // Check if both have the gene and it's a risk variant (value = 1)
            if (currentValue !== undefined && otherValue !== undefined &&
                currentValue === 1 && otherValue === 1) {
                sharedGenes.push(gene);
            }
        });

        setSharedRiskGenes(sharedGenes);
    };

    // const calculateScores = (currentUser, otherUser) => {
    //     const scores = [];

    //     for (const group in geneticGroups) {
    //         const genes = geneticGroups[group];
    //         let totalPossibleGenes = 0;
    //         let compatibleGenes = 0;
    //         let riskGenes = 0;

    //         genes.forEach(gene => {
    //             const currentValue = getGeneValue(currentUser, gene);
    //             const otherValue = getGeneValue(otherUser, gene);

    //             // Only count genes that exist in both users
    //             if (currentValue !== undefined && otherValue !== undefined) {
    //                 totalPossibleGenes++;

    //                 // For Biological Attraction, we want to calculate based on matching
    //                 if (group === "Biological Attraction") {
    //                     if (currentValue === otherValue) {
    //                         compatibleGenes++;
    //                     } else {
    //                         riskGenes++;
    //                     }
    //                 }
    //                 // For other categories, we consider 0 as compatible
    //                 else {
    //                     if (currentValue === 0 && otherValue === 0) {
    //                         compatibleGenes++;
    //                     } else {
    //                         riskGenes++;
    //                     }
    //                 }
    //             }
    //         });

    //         const compatibilityPercentage = totalPossibleGenes > 0
    //             ? Math.round((compatibleGenes / totalPossibleGenes) * 100)
    //             : 0;

    //         // For Birth Defect Risk, if there are any shared risk genes, set risk level to Moderate
    //         let riskLevel;
    //         if (group === "Birth Defect Risk" && sharedRiskGenes.length > 0) {
    //             riskLevel = "⚠️ Moderate";
    //         } else {
    //             // For other cases, use the original calculation
    //             riskLevel = compatibilityPercentage >= 75 ? "✅ Low" :
    //                 compatibilityPercentage >= 50 ? "⚠️ Moderate" : "🔴 High";
    //         }

    //         // Format notes based on risk genes count
    //         let notes;
    //         if (totalPossibleGenes === 0) {
    //             notes = "No shared genetic data";
    //         } else if (riskGenes === 0) {
    //             notes = "No major shared risk";
    //         } else {
    //             notes = `${riskGenes} risk gene(s) in ${group}`;
    //         }

    //         scores.push({
    //             category: group,
    //             percentage: `${compatibilityPercentage}%`,
    //             riskLevel,
    //             notes
    //         });
    //     }

    //     setGroupScores(scores);
    // };
const calculateScores = (currentUser, otherUser) => {
    const scores = [];

    for (const group in geneticGroups) {
        const genes = geneticGroups[group];
        let totalPossibleGenes = 0;
        let compatibleGenes = 0;
        let riskGenes = 0;

        genes.forEach(gene => {
            const currentValue = getGeneValue(currentUser, gene);
            const otherValue = getGeneValue(otherUser, gene);

            // Only count genes that exist in both users
            if (currentValue !== undefined && otherValue !== undefined) {
                totalPossibleGenes++;

                // For all categories except Biological Attraction, we consider 1 as compatible
                if (group === "Biological Attraction") {
                    if (currentValue === otherValue) {
                        compatibleGenes++;
                    } else {
                        riskGenes++;
                    }
                } else {
                    if (currentValue === 1 && otherValue === 1) {
                        compatibleGenes++;
                    } else {
                        riskGenes++;
                    }
                }
            }
        });

        const compatibilityPercentage = totalPossibleGenes > 0
            ? Math.round((compatibleGenes / totalPossibleGenes) * 100)
            : 0;

        let riskLevel;
        if (group === "Birth Defect Risk" && sharedRiskGenes.length > 0) {
            // For Birth Defect Risk, override the risk level based on shared risk genes
            const riskPercentage = (sharedRiskGenes.length / geneticGroups["Birth Defect Risk"].length) * 100;
            
            if (riskPercentage > 50) {
                riskLevel = "🔴 High";
            } else if (riskPercentage > 25) {
                riskLevel = "⚠️ Moderate";
            } else {
                riskLevel = "✅ Low";
            }
        } else {
            // For other cases, use the original calculation
            riskLevel = compatibilityPercentage >= 75 ? "✅ Low" :
                compatibilityPercentage >= 50 ? "⚠️ Moderate" : "🔴 High";
        }

        let notes;
        if (totalPossibleGenes === 0) {
            notes = "No shared genetic data";
        } else if (riskGenes === 0) {
            notes = "No major shared risk";
        } else {
            notes = `${riskGenes} risk gene(s) in ${group}`;
        }

        scores.push({
            category: group,
            percentage: `${compatibilityPercentage}%`,
            riskLevel,
            notes
        });
    }

    setGroupScores(scores);
};
    const getGeneValue = (data, gene) => {
        for (let group in data) {
            if (data[group] && gene in data[group]) {
                const val = data[group][gene];
                if (typeof val === "string") return val === "Yes" ? 1 : 0;
                return val;
            }
        }
        return undefined; // Return undefined if gene not found
    };

    const toggleBirthDefect = () => {
        setIsBirthDefectExpanded(!isBirthDefectExpanded);
    };

    const toggleReproductiveHealth = () => {
        setIsReproductiveHealthExpanded(!isReproductiveHealthExpanded);
    };

    return (
        <>
            <div className="dna-wrapper">
                <div className="result_table" style={{ overflowX: "auto" }}>
                    <div className="container w-100">
                        <h2 style={{ fontWeight: 'bold', color: "#d61962", textAlign: "center", }}>
                            Birth Defects and Health Risks
                        </h2>
                        <h2 style={{ fontWeight: '500', fontSize:'28px', marginBottom: '20px', color: "#d61962", textAlign: "center", padding: "25px" }}>
                            {userName.first_name} compared with [ <span style={{ color: "#df8525" }}>{secondUserName.first_name}</span> ]
                        </h2>

                        <h3
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: "bold", }}
                            onClick={toggleBirthDefect}
                        >
                            Birth Defect Risk & Genetic Disorders Rating: [ <span style={{ color: "#df8525" }}>{
                                groupScores
                                    .filter(item => item.category === "Birth Defect Risk")
                                    .map((item, index) => (
                                        <span key={index}>{item.percentage}</span>
                                    ))
                            }
                            </span> ]
                            <span style={{ marginLeft: '10px', transition: 'transform 0.3s', transform: isBirthDefectExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                ▼
                            </span>
                        </h3>

                        {isBirthDefectExpanded && (
                            <>
                                <p>The genetic section summarizes the results from the DNA test kit you completed, with your data compared directly to the person you selected as a potential match. These insights help highlight areas of biological and psychological compatibility, as well as any potential reproductive considerations.</p>
                                <div style={{ fontWeight: "bold", fontSize: 17 }}>Birth Defect Risk & Genetic Disorders:</div>
                                <p>This group of genes is associated with inherited conditions, developmental disorders, and genetic mutations that can impact health before or after birth. Identifying variants in these genes can help assess reproductive risk, carrier status, and the likelihood of passing on certain genetic disorders to offspring.</p>



                                <div style={{ overflowX: "auto" }}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <td><strong>Category</strong></td>
                                                <td><strong>Risk Level</strong></td>
                                                <td><strong>Compatibility Score</strong></td>
                                                <td><strong>Key Notes</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupScores
                                                .filter(item => item.category === "Birth Defect Risk")
                                                .map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.category}</td>
                                                        <td>{item.riskLevel}</td>
                                                        <td>{item.percentage}</td>
                                                        <td>{item.notes}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Show shared risk genes warning if any */}
                                {sharedRiskGenes.length > 0 ? (
                                    <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderRadius: "5px", margin: "15px 0" }}>
                                        <h4 style={{ color: "#856404", marginBottom: "10px" }}>⚠️ Important Genetic Risk Notice</h4>
                                        <p>Both you and your partner carry mutations in the following genes, which increases the risk of certain genetic conditions in your potential children:</p>
                                        <ul style={{ paddingLeft:15}}>
                                            {sharedRiskGenes.map((gene, index) => (
                                                <li key={index}>
                                                    <strong>{gene}</strong>: {geneDescriptions[gene]?.childRisk || "Increased risk of genetic condition."}
                                                </li>
                                            ))}
                                        </ul>
                                        <p style={{ marginTop: "10px", fontWeight: "bold" }}>We strongly recommend consulting with a genetic counselor to better understand these risks.</p>
                                    </div>
                                ) : (
                                    <div style={{ backgroundColor: "#d4edda", padding: "15px", borderRadius: "5px", margin: "15px 0" }}>
                                        <h4 style={{ color: "#155724", marginBottom: "10px" }}>✅ No Significant Shared Risk Genes</h4>
                                        <p>Based on your genetic profiles, you and your partner don't share mutations in any of the major birth defect risk genes we analyze.</p>
                                    </div>
                                )}

                            </>
                        )}
                        <div>
                            <h3
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: "bold", }}
                                onClick={toggleReproductiveHealth}
                            >
                                Reproductive Health & Cancer Risk Rating: [ <span style={{ color: "#df8525" }}>{
                                    groupScores
                                        .filter(item => item.category === "Reproductive Health")
                                        .map((item, index) => (
                                            <span key={index}>{item.percentage}</span>
                                        ))
                                }
                                </span> ]
                                <span style={{ marginLeft: '10px', transition: 'transform 0.3s', transform: isReproductiveHealthExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    ▼
                                </span>
                            </h3>

                            {isReproductiveHealthExpanded && (
                                <>
                                    <p>The genetic section summarizes the results from the DNA test kit you completed, with your data compared directly to the person you selected as a potential match. These insights help highlight areas of biological and psychological compatibility, as well as any potential reproductive considerations.</p>
                                    <div style={{ fontWeight: "bold", fontSize: 17 }}>Reproductive Health & Cancer Risk:</div><p>This group of genes influences fertility, reproductive function, and susceptibility to hormone-related cancers and inherited health risks. Together, these genes offer insight into reproductive wellness and inherited cancer risks, enabling proactive health planning and risk reduction strategies.</p>
                                    <div style={{ overflowX: "auto" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td><strong>Category</strong></td>
                                                    <td><strong>Risk Level</strong></td>
                                                    <td><strong>Compatibility Score</strong></td>
                                                    <td><strong>Key Notes</strong></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {groupScores
                                                    .filter(item => item.category === "Reproductive Health")
                                                    .map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.category}</td>
                                                            <td>{item.riskLevel}</td>
                                                            <td>{item.percentage}</td>
                                                            <td>{item.notes}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ul>
                                        <li>
                                            {groupScores
                                                .filter(item => item.category === "Reproductive Health")
                                                .map((item, index) => {
                                                    const percentage = item.percentage.replace('%', '');
                                                    const riskLevel = item.riskLevel;

                                                    if (riskLevel.includes("Low")) {
                                                        return (
                                                            <span key={index}>
                                                                Your genetic comparison with this individual shows an {item.percentage} overall compatibility score when it comes to reproductive health and cancer risk. The results also indicate that there are no major concerns about passing on serious fertility issues or inherited cancer conditions to future children. In short, your genetic profiles are generally a strong match, with no significant red flags.
                                                            </span>
                                                        );
                                                    } else if (riskLevel.includes("Moderate")) {
                                                        return (
                                                            <span key={index}>
                                                                Your genetic comparison with this individual shows an {item.percentage} overall compatibility score when it comes to reproductive health and cancer risk. The results indicate there are moderate concerns about passing on serious fertility issues or inherited cancer conditions to future children. You may want to consult with a genetic counselor for further evaluation.
                                                            </span>
                                                        );
                                                    } else { // High risk
                                                        return (
                                                            <span key={index}>
                                                                Your genetic comparison with this individual shows an {item.percentage} overall compatibility score when it comes to reproductive health and cancer risk. The results indicate there are significant concerns about passing on serious fertility issues or inherited cancer conditions to future children. We strongly recommend consulting with a genetic counselor before making reproductive decisions.
                                                            </span>
                                                        );
                                                    }
                                                })
                                            }
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default BirthDefect;