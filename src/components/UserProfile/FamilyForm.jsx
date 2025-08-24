import React from "react";

const FamilyForm = ({ familyDetails, handleFamilyChange, handleFamilySubmit }) => (
  <>
    <div className="icon-blk text-center">
      <img src="images/familydetail.png" alt="Family details" />
      <h4>Add Family Details</h4>
      <p>This really helps find common connection</p>
    </div>
    <div className="family-details">
      <form id="familyForm" autoComplete="off" onSubmit={handleFamilySubmit}>
        {[
          { id: "mother", label: "Mother's details", options: ["Homemaker", "Teacher", "Doctor", "Engineer", "Businesswoman"] },
          { id: "father", label: "Father's details", options: ["Businessman", "Government employee", "Teacher", "Doctor", "Engineer"] },
          { id: "sisters", label: "No. of Sisters", options: ["None", "1", "2", "3", "4+"] },
          { id: "brothers", label: "No. of Brothers", options: ["None", "1", "2", "3", "4+"] }
        ].map((field) => (
          <div className="select-wrap" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <select
              id={field.id}
              name={field.id}
              value={familyDetails[field.id]}
              onChange={handleFamilyChange}
              required
            >
              <option value="" disabled hidden>Select</option>
              {field.options.map((option) => (
                <option key={option} value={option === "None" ? "0" : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" id="continueBtn" className="btn">Continue</button>
      </form>
    </div>
  </>
);

export default FamilyForm;