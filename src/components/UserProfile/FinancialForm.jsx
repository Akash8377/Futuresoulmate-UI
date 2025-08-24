import React from "react";

const financialOptions = [
  {
    value: "Elite",
    title: "Elite",
    details: [
      "Senior executives or business owners",
      "Multiple properties & assets",
      "Annual family income 50L+"
    ]
  },
  {
    value: "High",
    title: "High",
    details: [
      "Professionals or mid-scale business",
      "Own house & investments",
      "Annual family income 30-50L"
    ]
  },
  {
    value: "Middle",
    title: "Middle",
    details: [
      "Family runs a small business or have office jobs",
      "Family owns a vehicle, house & some assets",
      "Annual family income is 10-30L"
    ]
  },
  {
    value: "Aspiring",
    title: "Aspiring",
    details: [
      "Entry-level jobs or small shops",
      "Rented or modest accommodation",
      "Annual family income < 10L"
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