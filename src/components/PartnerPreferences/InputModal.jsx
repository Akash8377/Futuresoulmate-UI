import React from "react";

const InputModal = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor="prefInput" className="form-label">
        New value
      </label>
      <input
        type="text"
        className="form-control"
        id="prefInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputModal;