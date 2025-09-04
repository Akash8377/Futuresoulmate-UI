import React from "react";

const financialOptions = [
  {
    value: "Affluent / Wealthy",
    title: "Affluent / Wealthy",
    details: [
      "Senior executives, entrepreneurs, or high-net-worth professionals",
      "Multiple properties, investments, and luxury lifestyle",
      "Household income $250,000+ annually"
    ]
  },
  {
    value: "Upper Middle Class",
    title: "Upper Middle Class",
    details: [
      "Doctors, lawyers, engineers, or mid-to-senior management professionals",
      "Own home, stable investments, comfortable lifestyle",
      "Household income $150,000 – $250,000 annually"
    ]
  },
  {
    value: "Middle Class",
    title: "Middle Class",
    details: [
      "Skilled professionals, small business owners, or office jobs",
      "Owns a home or paying mortgage, moderate savings",
      "Household income $70,000 – $150,000 annually"
    ]
  },
  {
    value: "Working Class / Aspiring",
    title: "Working Class / Aspiring",
    details: [
      "Entry-level professionals, service jobs, or small businesses",
      "May rent or share accommodation, limited investments",
      "Household income below $70,000 annually"
    ]
  }
];


const FinancialForm = ({ financialStatus, handleFinancialChange, handleFinancialSubmit }) => (
  <div className="added-family-detail">
    <div className="panel">
      <h1>Add family details</h1>
      <p className="subtitle">This really helps find common connections</p>
      <form id="financialForm" autoComplete="off" onSubmit={handleFinancialSubmit}>
        <label className="section-title">Your Family's Financial Status</label>
        {financialOptions.map((option) => (
          <label className="status-card" key={option.value}>
            <input
              type="radio"
              name="finStatus"
              value={option.value}
              checked={financialStatus === option.value}
              onChange={handleFinancialChange}
              required={financialStatus === "" && option.value === "Elite"}
            />
            <div className="family-box">
              <div className="header">
                <span className="radio-dot"></span>
                <span className="title">{option.title}</span>
              </div>
              <ul className="details">
                {option.details.map((detail, i) => (
                  <li key={i}>
                    <i className={`fa ${i === 0 ? 'fa-briefcase' : i === 1 ? 'fa-home' : 'fa-indian-rupee-sign'}`}></i>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </label>
        ))}
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  </div>
);

export default FinancialForm;