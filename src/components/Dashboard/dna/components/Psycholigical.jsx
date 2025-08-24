import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

const psychologicalGeneGroups = {
    "Cognition & Memory": ["BDNF", "GRIN2B", "KIBRA", "FOXP2"],
    "Empathy, Bonding & Social Behavior": ["AVPR1A", "OXTR", "DRD2", "SLC6A4"],
    "Impulsivity, Risk & Personality Style": ["CADM2", "DRD4", "MAOA"],
    "Mood & Stress Regulation": ["5-HT2A", "COMT"]
};

const geneDescriptions = {
    "BDNF": "Brain-derived neurotrophic factor affecting memory and learning",
    "GRIN2B": "Glutamate receptor involved in cognitive function",
    "KIBRA": "Memory formation and recall",
    "FOXP2": "Language processing and communication skills",
    "AVPR1A": "Vasopressin receptor affecting pair bonding and social behavior",
    "OXTR": "Oxytocin receptor influencing trust and empathy",
    "DRD2": "Dopamine receptor affecting reward processing and social bonding",
    "SLC6A4": "Serotonin transporter influencing emotional regulation",
    "CADM2": "Risk-taking behavior and impulsivity",
    "DRD4": "Dopamine receptor linked to novelty-seeking behavior",
    "MAOA": "Monoamine oxidase affecting aggression and impulsivity",
    "5-HT2A": "Serotonin receptor influencing mood and anxiety",
    "COMT": "Catechol-O-methyltransferase affecting stress response"
};

const Psychological = () => {
    const [userName, setUserName] = useState({ first_name: '', last_name: '' });
    const [secondUserName, setSecondUserName] = useState({ first_name: '', last_name: '' });
    const [currentUserMarkers, setCurrentUserMarkers] = useState({});
    const [otherUserMarkers, setOtherUserMarkers] = useState({});
    const [groupScores, setGroupScores] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
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
            calculatePsychologicalScores(currentUserMarkers, otherUserMarkers);
        }
    }, [currentUserMarkers, otherUserMarkers]);

    const calculatePsychologicalScores = (currentUser, otherUser) => {
        const scores = [];

        for (const group in psychologicalGeneGroups) {
            const genes = psychologicalGeneGroups[group];
            let totalPossibleGenes = 0;
            let matchingGenes = 0;

            genes.forEach(gene => {
                const currentValue = getGeneValue(currentUser, gene);
                const otherValue = getGeneValue(otherUser, gene);

                if (currentValue !== undefined && otherValue !== undefined) {
                    totalPossibleGenes++;
                    if (currentValue === otherValue) {
                        matchingGenes++;
                    }
                }
            });

            const compatibilityPercentage = totalPossibleGenes > 0
                ? Math.round((matchingGenes / totalPossibleGenes) * 100)
                : 0;

            scores.push({
                category: group,
                percentage: compatibilityPercentage,
                genes: genes.filter(gene => {
                    const currentValue = getGeneValue(currentUser, gene);
                    const otherValue = getGeneValue(otherUser, gene);
                    return currentValue !== undefined && otherValue !== undefined;
                })
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
        return undefined;
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Calculate overall psychological compatibility score
    const overallScore = groupScores.length > 0
        ? Math.round(groupScores.reduce((sum, group) => sum + group.percentage, 0)) / groupScores.length
        : 0;

    return (
        <>
            <div className="dna-wrapper">
                <div className="result_table" style={{ overflowX: "auto" }}>
                    <div className="container">
                        <h2 style={{ fontWeight: 'bold', color: "#d61962", textAlign: "center" }}>
                            Psychological Compatibility
                        </h2>
                        <h2 style={{ fontWeight: '500', fontSize:'28px', marginBottom: '20px', color: "#d61962", textAlign: "center", padding: "15px" }}>
                            {userName.first_name} compared with [ <span style={{ color: "#df8525" }}>{secondUserName.first_name}</span> ]
                        </h2>

                        <h3
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: "bold" }}
                            onClick={toggleExpanded}
                        >
                            Psychological Compatibility Overall Rating: [ <span style={{ color: "#df8525" }}>{Math.floor(overallScore)}%</span> ]
                            <span style={{ marginLeft: '10px', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                ▼
                            </span>
                        </h3>

                        {isExpanded && (
                            <>
                                <p>The genetic section summarizes the results from the DNA test kit you completed, with your data compared directly to the person you selected as a potential match. These insights help highlight areas of psychological compatibility between individuals.</p>
                                <div style={{ fontWeight: "bold", fontSize: 17 }}>Psychological Compatibility:</div>
                                <p>This group of genes influences cognitive function, emotional regulation, circadian rhythms, social behavior, and personality traits - core factors in long-term psychological compatibility between individuals. Together, these genes help shape how individuals think, feel, connect, and cope; foundational elements of psychological harmony in relationships.</p>

                                <div style={{ marginTop: "30px" }}>
                                    {groupScores.map((group, index) => (
                                        <div key={index} style={{ marginBottom: "25px" }}>
                                            <h5 style={{ fontWeight: "600" }}>
                                                - {group.category}: [<span style={{ color: "#df8525" }}>{group.percentage}%</span>]
                                            </h5>
                                            <p style={{ marginLeft: "20px" }}>
                                                These genes ({group.genes.join(", ")}) {geneDescriptions[group.genes[0]]?.toLowerCase() || "affect various psychological traits"}. 
                                                {group.category === "Cognition & Memory" && " They influence how easily you process new information and form long-term memories."}
                                                {group.category === "Empathy, Bonding & Social Behavior" && " They affect how you bond with others, express empathy, and respond in social situations."}
                                                {group.category === "Impulsivity, Risk & Personality Style" && " They shape traits like impulsivity, risk-taking, and decision-making."}
                                                {group.category === "Mood & Stress Regulation" && " They help regulate mood and how you handle stress."}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", marginTop: "20px" }}>
                                    <h4 style={{ fontWeight: "bold" }}>Interpretation:</h4>
                                    <p>
                                        Higher percentages indicate greater psychological compatibility in each category. 
                                        These results are based on comparing your DNA markers with your partner's markers 
                                        in key psychological compatibility-related genes.
                                    </p>
                                </div> */}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Psychological;