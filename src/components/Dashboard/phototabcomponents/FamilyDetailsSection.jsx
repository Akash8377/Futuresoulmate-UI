import React from 'react';
import { MOTHERDETAILS, FATHERDETAILS, NUMOFSIBLINGS, FINANCIALSTATUS } from "../../../constants/formData";
const FamilyDetailsSection = ({ isEditing, getValue, getFamilyValue, onDataChange, editingFields }) => {
  return (
    <div className="row py-3 border-top">
      <div className="col-md-6 pe-md-4">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Mother's Details:</td>
              <td>{isEditing && editingFields === "family" ? (
                <select 
                  value={getFamilyValue('mother')} 
                  onChange={(e) => onDataChange('mother', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {MOTHERDETAILS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getFamilyValue('mother') || '------'
              )}</td>
            </tr>
            <tr>
              <td>Father's Details:</td>
              <td>{isEditing && editingFields === "family" ? (
                <select 
                  value={getFamilyValue('father')} 
                  onChange={(e) => onDataChange('father', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {FATHERDETAILS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getFamilyValue('father')|| '------'
              )}</td>
            </tr>
            <tr>
              <td>Family Location:</td>
              <td>{isEditing && editingFields === "family" ? (
                <input 
                  type="text" 
                  value={getValue('city') || ''} 
                  onChange={(e) => onDataChange('city', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                `${getValue('city')}`
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>No. of Sisters:</td>
              <td>{isEditing && editingFields === "family" ? (
                <select 
                  value={getFamilyValue('sisters')} 
                  onChange={(e) => onDataChange('sisters', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {NUMOFSIBLINGS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getFamilyValue('sisters') || '------'
              )}</td>
            </tr>
            <tr>
              <td>No. of Brothers:</td>
              <td>{isEditing && editingFields === "family" ? (
                <select 
                  value={getFamilyValue('brothers')} 
                  onChange={(e) => onDataChange('brothers', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {NUMOFSIBLINGS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getFamilyValue('brothers') || '------'
              )}</td>
            </tr>
            <tr>
  <td>Family Financial Status:</td>
  <td>
    {isEditing && editingFields === "family" ? (
      <select 
        value={getValue('financial_status') || 'Elite'} 
        onChange={(e) => onDataChange('financial_status', e.target.value)}
        className="form-select form-select-sm d-inline-block w-75"
      >
        <option value="">Select</option>
        {FINANCIALSTATUS.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>
    ) : (
      getValue('financial_status') || '------'
    )}
  </td>
</tr>
            {/* <tr>
              <td>Family Financial Status:</td>
              <td>{isEditing && editingFields === "family" ? (
                <select 
                  value={getValue('financial_status') || 'Elite'} 
                  onChange={(e) => onDataChange('financial_status', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {FINANCIALSTATUS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('financial_status') || '------'
              )}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyDetailsSection;