import React from 'react';
import { RELIGIONS, CULTURES, SUBCOMMUNITIES, LANGUAGES } from "../../../constants/formData";

const ReligiousBackgroundSection = ({ setEditingFields, isEditing, getValue, onDataChange, editingFields, onEditClick, onSaveClick, onCancelClick }) => {
  return (
    <div className="row py-3 border-top">
      <div className="col-md-6 pe-md-4">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mini-section-title mb-2">Culture & Religion</h6>
          {isEditing && editingFields === "religious" ? (
            <span className="d-flex gap-2">
              <a onClick={onSaveClick} className="mini-edit-link text-primary cursor-pointer">
                Save
              </a>
              <a onClick={onCancelClick} className="mini-edit-link text-primary cursor-pointer">
                Cancel
              </a>
            </span>
          ) : (
            <a onClick={() => { onEditClick(); setEditingFields("religious") }} className="mini-edit-link text-primary cursor-pointer">
              Edit
            </a>
          )}
        </div>

        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Religion:</td>
              <td>{isEditing && editingFields === "religious" ? (
                <select 
                  value={getValue('religion') || ''} 
                  onChange={(e) => onDataChange('religion', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {RELIGIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('religion')
              )}</td>
            </tr>
            <tr>
              <td>Culture:</td>
              <td>{isEditing && editingFields === "religious" ? (
                <select 
                  value={getValue('culture') || ''} 
                  onChange={(e) => onDataChange('culture', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {CULTURES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('culture')
              )}</td>
            </tr>
            {/* <tr>
              <td>Sub community:</td>
              <td>{isEditing && editingFields === "religious" ? (
                <select 
                  value={getValue('sub_community') || ''} 
                  onChange={(e) => onDataChange('sub_community', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  <optgroup label="FREQUENTLY USED">
                    {SUBCOMMUNITIES["FREQUENTLY USED"].map((community) => (
                      <option key={community.value} value={community.value}>
                        {community.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="ALL CULTURES">
                    {SUBCOMMUNITIES["ALL COMMUNITIES"].map((community) => (
                      <option key={community.value} value={community.value}>
                        {community.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                getValue('sub_community')
              )}</td>
            </tr>
            <tr>
              <td>Gothra / Gothram:</td>
              <td>{isEditing && editingFields === "religious" ? (
                <input 
                  type="text" 
                  value={getValue('gothra') || ''} 
                  onChange={(e) => onDataChange('gothra', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('gothra') || '------'
              )}</td>
            </tr> */}
            <tr>
              <td>Language:</td>
              <td>{isEditing && editingFields === "religious" ? (
                <select 
                  value={getValue('mother_tongue') || ''} 
                  onChange={(e) => onDataChange('mother_tongue', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              ) : (
                getValue('mother_tongue') || '------'
              )}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="col-md-6 border-start ps-md-4 mt-4 mt-md-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mini-section-title mb-2">Astro Details</h6>
          {isEditing && editingFields === "astro" ? (
            <span className="d-flex gap-2">
              <a onClick={onSaveClick} className="mini-edit-link text-primary cursor-pointer">
                Save
              </a>
              <a onClick={onCancelClick} className="mini-edit-link text-primary cursor-pointer">
                Cancel
              </a>
            </span>
          ) : (
            <a onClick={() => { onEditClick(); setEditingFields("astro") }} className="mini-edit-link text-primary cursor-pointer">
              Edit
            </a>
          )}
        </div>

        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>Manglik/Chevvai dosham:</td>
              <td>{isEditing && editingFields === "astro" ? (
                <select 
                  value={getValue('manglik') || ''} 
                  onChange={(e) => onDataChange('manglik', e.target.value)}
                  className="form-select form-select-sm d-inline-block w-75"
                >
                  <option value="">Select</option>
                  <option value="Manglik">Manglik</option>
                  <option value="Non-Manglik">Non-Manglik</option>
                  <option value="Partial Manglik">Partial Manglik</option>
                  <option value="Not Sure">Not Sure</option>
                </select>
              ) : (
                getValue('manglik') || '------'
              )}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>{getValue('birth_day')}-{getValue('birth_month')}-{getValue('birth_year')}</td>
            </tr>
            <tr>
              <td>Time of Birth:</td>
              <td>{isEditing && editingFields === "astro" ? (
                <input 
                  type="time" step="1"
                  value={getValue('birth_time') || ''} 
                  onChange={(e) => onDataChange('birth_time', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('birth_time') ||"-----"
              )}</td>
            </tr>
            <tr>
              <td>City of Birth:</td>
              <td>{isEditing && editingFields === "astro" ? (
                <input 
                  type="text" 
                  value={getValue('birth_city') || ''} 
                  onChange={(e) => onDataChange('birth_city', e.target.value)}
                  className="form-control form-control-sm d-inline-block w-75"
                />
              ) : (
                getValue('birth_city') ||"-----"
              )}</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default ReligiousBackgroundSection;