import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Step1 from "./Step1"; // Profile for and Gender
import Step2 from "./Step2"; // Name and DOB
import Step3 from "./Step3"; // Relegion, Community and Living in
import Step4 from "./Step4"; // Verify Email and Phone
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";

const LetsBeginModal = ({ searchData,show, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    person: "myself",
    // gender: "",
    firstName: "",
    lastName: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    religion: "",
    culture: "",
    livingIn: "",
    email: "",
    phone: "",
    city: "",
    livesWithFamily: "yes",
    familyCity: "",
    maritalStatus: "Never Married",
    height: "4ft 0in",
    diet: "",
    qualification: "",
    college: "",
    incomePer:"yearly",
    income: "",
    workType: "Private Company",
    profession: "",
  });

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => {
    if (currentStep === 1) {
    onClose(); // Close modal when on first step
  } else {
    setCurrentStep(currentStep - 1); // Go to previous step otherwise
  }
};

  const handleSubmit = (finalData) => {
    onSubmit(finalData);
    // onClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      className="letsbeginmodal"
    >
      <Modal.Body>
        {currentStep === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 4 && (
          <Step4
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 5 && (
          <Step5
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 6 && (
          <Step6
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 7 && (
          <Step7
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 8 && (
          <Step8
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 9 && (
          <Step9
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LetsBeginModal;