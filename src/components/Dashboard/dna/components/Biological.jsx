import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const biologicalGeneGroups = {
  "Circadian & Sleep Rhythms": ["ARNTL", "CLOCK", "PER1", "PER3"],
  "Digestive & Metabolic Traits": ["ADH1B", "ALDH2", "FTO", "LEPR", "PPARG"],
  "Immune System & Scent-Based Attraction": ["HLA"],
  "Musculoskeletal & Physical Performance": ["ACE", "ACTN3"],
  "Pigmentation & Sensory Appearance": [
    "ASIP",
    "EDAR",
    "HERC2/OCA2",
    "MC1R",
    "SLC24A4",
    "TYR",
  ],
  "Taste & Sensory Response": ["TAS2R38"],
};

const geneDescriptions = {
  ARNTL: "Regulates circadian rhythms and sleep patterns",
  CLOCK: "Controls the body's internal clock",
  PER1: "Influences sleep timing and duration",
  PER3: "Affects sleep quality and jet lag adaptation",
  ADH1B: "Alcohol metabolism and digestion",
  ALDH2: "Alcohol processing and metabolic rate",
  FTO: "Fat storage and obesity risk",
  LEPR: "Leptin receptor affecting appetite",
  PPARG: "Fat cell differentiation and metabolism",
  HLA: "Immune function and scent-based attraction",
  ACE: "Muscle efficiency and endurance",
  ACTN3: "Fast-twitch muscle fibers and power",
  ASIP: "Skin and hair pigmentation",
  EDAR: "Hair thickness and tooth shape",
  "HERC2/OCA2": "Eye color determination",
  MC1R: "Red hair and fair skin traits",
  SLC24A4: "Skin pigmentation",
  TYR: "Melanin production",
  TAS2R38: "Bitterness taste perception",
};

const Biological = () => {
  const [userName, setUserName] = useState({ first_name: "", last_name: "" });
  const [secondUserName, setSecondUserName] = useState({
    first_name: "",
    last_name: "",
  });
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
    if (
      Object.keys(currentUserMarkers).length > 0 &&
      Object.keys(otherUserMarkers).length > 0
    ) {
      calculateBiologicalScores(currentUserMarkers, otherUserMarkers);
    }
  }, [currentUserMarkers, otherUserMarkers]);

  const calculateBiologicalScores = (currentUser, otherUser) => {
    const scores = [];

    for (const group in biologicalGeneGroups) {
      const genes = biologicalGeneGroups[group];
      let totalPossibleGenes = 0;
      let matchingGenes = 0;

      genes.forEach((gene) => {
        const currentValue = getGeneValue(currentUser, gene);
        const otherValue = getGeneValue(otherUser, gene);

        if (currentValue !== undefined && otherValue !== undefined) {
          totalPossibleGenes++;
          if (currentValue === otherValue) {
            matchingGenes++;
          }
        }
      });

      const compatibilityPercentage =
        totalPossibleGenes > 0
          ? Math.round((matchingGenes / totalPossibleGenes) * 100)
          : 0;

      scores.push({
        category: group,
        percentage: compatibilityPercentage,
        genes: genes.filter((gene) => {
          const currentValue = getGeneValue(currentUser, gene);
          const otherValue = getGeneValue(otherUser, gene);
          return currentValue !== undefined && otherValue !== undefined;
        }),
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

  // Calculate overall biological attraction score
  const overallScore =
    groupScores.length > 0
      ? Math.round(
          groupScores.reduce((sum, group) => sum + group.percentage, 0)
        ) / groupScores.length
      : 0;

  return (
    <>
      <div className="dna-wrapper">
        <div className="result_table" style={{ overflowX: "auto" }}>
          <div className="container">
            <h2
              style={{
                fontWeight: "bold",
                color: "#d61962",
                textAlign: "center",
              }}
            >
              Biological Attraction Analysis
            </h2>
            <h2
              style={{
                fontWeight: '500', fontSize:'28px',marginBottom: "20px",color: "#d61962",textAlign: "center",padding: "25px",
              }}
            >
              {userName.first_name} compared with [{" "}
              <span style={{ color: "#df8525" }}>{secondUserName.first_name}</span>{" "}
              ]
            </h2>

            <h3
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
              onClick={toggleExpanded}
            >
              Biological Attraction Overall Rating: [{" "}
              <span style={{ color: "#df8525" }}>{Math.floor(overallScore)}%</span>{" "}
              ]
              <span
                style={{
                  marginLeft: "10px",
                  transition: "transform 0.3s",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </h3>

            {isExpanded && (
              <>
                <p>
                  The genetic section summarizes the results from the DNA test
                  kit you completed, with your data compared directly to the
                  person you selected as a potential match. These insights help
                  highlight areas of biological compatibility based on genetic
                  markers.
                </p>
                <div style={{ fontWeight: "bold", fontSize: 17 }}>
                  Biological Attraction:
                </div>
                <p>
                  These genes play a key role in shaping physical traits,
                  sensory perceptions, and biochemical signals that influence
                  human attraction, mate selection, and compatibility.
                  Collectively, they contribute to both visible and invisible
                  elements of attraction rooted in evolutionary biology.
                </p>

                <div style={{ marginTop: "30px" }}>
                  {groupScores.map((group, index) => (
                    <div key={index} style={{ marginBottom: "25px" }}>
                      <h5 style={{ fontWeight: "600" }}>
                        - {group.category}:{" "}
                        <span style={{ color: "#df8525" }}>
                          {Math.floor(group.percentage)}%
                        </span>
                      </h5>
                      <p style={{ marginLeft: "20px" }}>
                        These genes ({group.genes.join(", ")}){" "}
                        {geneDescriptions[group.genes[0]]?.toLowerCase() ||
                          "affect various biological traits"}
                        . They influence {group.category.toLowerCase()} and may
                        affect your natural compatibility.
                      </p>
                    </div>
                  ))}
                </div>

                {/* <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", marginTop: "20px" }}>
                                    <h4 style={{ fontWeight: "bold" }}>Interpretation:</h4>
                                    <p>
                                        Higher percentages indicate greater genetic compatibility in each category.
                                        These results are based on comparing your DNA markers with your partner's markers
                                        in key biological attraction-related genes.
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

export default Biological;
