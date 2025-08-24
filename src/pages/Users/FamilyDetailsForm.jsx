import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FamilyForm from "../../components/UserProfile/FamilyForm";
import FinancialForm from "../../components/UserProfile/FinancialForm";
import { toast } from "../../components/Common/Toast";

const FamilyDetailsForm = () => {
  const [familyDetails, setFamilyDetails] = useState({
    mother: "", father: "", sisters: "", brothers: ""
  });
  const [financialStatus, setFinancialStatus] = useState("");
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    const otherData = JSON.parse(sessionStorage.getItem("otherData"));
    if (otherData?.familyDetails) {
      setFamilyDetails(otherData?.familyDetails)
    }
    if (otherData?.financialStatus) {
      setFinancialStatus(otherData?.financialStatus)
    }
  }, []);

  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setFamilyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (e) => setFinancialStatus(e.target.value);

  const handleFamilySubmit = (e) => {
    e.preventDefault();
    setShowFinancialForm(true);
  };

  const handleFinancialSubmit = (e) => {
    e.preventDefault();
    toast.success("Data saved successfully!");
    let otherData = JSON.parse(sessionStorage.getItem('otherData'));
    otherData={
      ...otherData,
      familyDetails, financialStatus
    }
    sessionStorage.setItem("otherData", JSON.stringify(otherData))
    navigate("/partner-preferences")
  };

  return (
    <>
      <section className="verfiy-profile">
        <div className="verfiy-profile-new">
          {!showFinancialForm ? (
            <FamilyForm 
              familyDetails={familyDetails}
              handleFamilyChange={handleFamilyChange}
              handleFamilySubmit={handleFamilySubmit}
            />
          ) : (
            <FinancialForm 
              financialStatus={financialStatus}
              handleFinancialChange={handleFinancialChange}
              handleFinancialSubmit={handleFinancialSubmit}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default FamilyDetailsForm;