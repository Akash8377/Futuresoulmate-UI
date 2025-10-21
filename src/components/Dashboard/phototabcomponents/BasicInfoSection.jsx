import React from 'react';
import { MARITAL_STATUS, HEIGHTS, COUNTRIES, DIET, BLOODGROUP } from "../../../constants/formData";
import { calculateAge, camelCaseToNormalText } from '../../../utils/helpers';

const BasicInfoSection = ({ isEditing, getValue, onDataChange, editingFields }) => {
  return (
    <div className="row py-3 border-top">
      <div className="col-md-6 pe-md-4">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            {/* <tr>
              <td>Age:</td>
              <td>{calculateAge(
                getValue('birth_year'), 
                getValue('birth_month'), 
                getValue('birth_day')
              )}</td>
            </tr> */}
            <tr>
              <td>Name:</td>
              <td className=''>{isEditing && editingFields === "basic" ? (
                  <div className='d-inline-flex gap-1 w-75'>
                  <input 
                    type="text" 
                    value={getValue('first_name') || ''} 
                    onChange={(e) => onDataChange('first_name', e.target.value)}
                    className="form-control form-control-sm "
                    placeholder="First Name"
                  />
                  <input 
                    type="text" 
                    value={getValue('last_name') || ''} 
                    onChange={(e) => onDataChange('last_name', e.target.value)}
                    className="form-control form-control-sm "
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                `${getValue('first_name')} ${getValue('last_name')}`
              )}</td>
            </tr>
            <tr>
              <td>DOB:</td>
              <td className=''>{isEditing && editingFields === "basic" ? (
                  <div className='d-inline-flex gap-1 w-75'>
                  <input 
                    type="text" 
                    value={getValue('birth_day') || ''} 
                    onChange={(e) => onDataChange('birth_day', e.target.value)}
                    className="form-control form-control-sm "
                    placeholder="Day"
                  />
                  <input 
                    type="text" 
                    value={getValue('birth_month') || ''} 
                    onChange={(e) => onDataChange('birth_month', e.target.value)}
                    className="form-control form-control-sm "
                    placeholder="Month"
                  />
                  <input 
                    type="text" 
                    value={getValue('birth_year') || ''} 
                    onChange={(e) => onDataChange('birth_year', e.target.value)}
                    className="form-control form-control-sm "
                    placeholder="Year"
                  />
                </div>
              ) : (
                `${getValue('birth_day')}-${getValue('birth_month')}-${getValue('birth_year')}`
              )}</td>
            </tr>
            <tr>
              <td>Marital Status:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('marital_status') || ''} 
                  onChange={(e) => onDataChange('marital_status', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {MARITAL_STATUS.map((item)=>(
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('marital_status')
              )}</td>
            </tr>
            <tr>
              <td>Height:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('height') || ''} 
                  onChange={(e) => onDataChange('height', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {HEIGHTS.map((item)=>(
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('height')
              )}</td>
            </tr>
            <tr>
              <td>Grow Up:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('country') || ''} 
                  onChange={(e) => onDataChange('country', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {COUNTRIES.map((item)=>(
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('country') || ''
              )}</td>
            </tr>
             <tr>
              <td>Looking For:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('looking_for') || ''} 
                  onChange={(e) => onDataChange('looking_for', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  <option key={"Bride"} value="Bride">Bride</option>
                  <option key={"Groom"} value="Groom">Groom</option>
                </select>
              ) : (
                camelCaseToNormalText(getValue('looking_for'))
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Gender:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('gender') || ''} 
                  onChange={(e) => onDataChange('gender', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  <option key={"male"} value="male">Male</option>
                  <option key={"female"} value="female">Female</option>
                </select>
              ) : (
                camelCaseToNormalText(getValue('gender'))
              )}</td>
            </tr>
            <tr>
              <td>Diet:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('diet') || ''} 
                  onChange={(e) => onDataChange('diet', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {DIET.map((item)=>(
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('diet')
              )}</td>
            </tr>
            <tr>
              <td>Blood Group:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <select 
                  value={getValue('blood_group') || ''} 
                  onChange={(e) => onDataChange('blood_group', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {BLOODGROUP.map((item)=>(
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('blood_group') || '------'
              )}</td>
            </tr>
            <tr>
              <td>Health Information:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <input 
                  type="text" 
                  value={getValue('health_info') || ''} 
                  onChange={(e) => onDataChange('health_info', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('health_info') || '------'
              )}</td>
            </tr>
            <tr>
              <td>Disability:</td>
              <td>{isEditing && editingFields === "basic" ? (
                <input 
                  type="text" 
                  value={getValue('disability') || ''} 
                  onChange={(e) => onDataChange('disability', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('disability') || '------'
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicInfoSection;