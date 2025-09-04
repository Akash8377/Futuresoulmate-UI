import React from 'react';
import { OCCUPATIONS, PROFESSIONS } from "../../../constants/formData";

const EducationCareerSection = ({ isEditing, getValue, onDataChange, editingFields }) => {
  const allProfessions = Object.values(PROFESSIONS).flat();

  return (
    <div className="row py-3 border-top">
      <div className="col-md-6 pe-md-4">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Highest Qualification:</td>
              <td>{isEditing && editingFields === "career" ? (
                <input 
                  type="text" 
                  value={getValue('education') || ''} 
                  onChange={(e) => onDataChange('education', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('education')
              )}</td>
            </tr>
            <tr>
              <td>College:</td>
              <td>{isEditing && editingFields === "career" ? (
                <input 
                  type="text" 
                  value={getValue('college') || ''} 
                  onChange={(e) => onDataChange('college', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('college')
              )}</td>
            </tr>
            <tr>
              <td>Annual Income:</td>
              <td>{isEditing && editingFields === "career" ? (
               <select 
                  value={getValue('income') || ''} 
                  onChange={(e) => onDataChange('income', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select Income</option>
                  {[
                    25000, 50000, 75000, 100000, 125000, 150000,
                    175000, 200000, 225000, 250000
                  ].map((val) => (
                    <option key={val} value={val}>
                      ${val.toLocaleString()}
                    </option>
                  ))}
                </select>
              ) : (
                <>{getValue('income') ? `$${Number(getValue('income')).toLocaleString()}` : ''}</>
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Working With:</td>
              <td>{isEditing && editingFields === "career" ? (
                <select 
                  value={getValue('work_type') || ''} 
                  onChange={(e) => onDataChange('work_type', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {OCCUPATIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('work_type')
              )}</td>
            </tr>
            <tr>
              <td>Working as:</td>
              <td>{isEditing && editingFields === "career" ? (
                <select 
                  value={getValue('profession') || ''} 
                  onChange={(e) => onDataChange('profession', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {allProfessions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('profession')
              )}</td>
            </tr>
            <tr>
              <td>Employer Name:</td>
              <td>{isEditing && editingFields === "career" ? (
                <input 
                  type="text" 
                  value={getValue('employer') || ''} 
                  onChange={(e) => onDataChange('employer', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('employer') || '------'
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EducationCareerSection;