import React from 'react';
import { HOBBIES } from "../../../constants/formData";

const HobbiesSection = ({ 
  isEditing, 
  editingFields, 
  selectedHobbies, 
  handleCheckboxChange, 
  onEditClick, 
  onSaveClick, 
  onCancelClick 
}) => {
  return (
    <div className="row py-3 border-top">
      <div className="col-md-12 pe-md-4">
        <table className="table table-borderless table-sm mini-data mb-0">
          <tbody>
            <tr>
              <td>
                {isEditing && editingFields === "hobbies" ? (
                  <div className='d-flex flex-wrap gap-2'>
                    {HOBBIES.map((hobby) => (
                      <div key={hobby.value} className="form-check">
                        <input
                          type="checkbox"
                          id={`hobby-${hobby.value}`}
                          checked={selectedHobbies.includes(hobby.value)}
                          onChange={() => handleCheckboxChange(hobby.value)}
                          className="form-check-input"
                          disabled={selectedHobbies.includes(hobby.value) || selectedHobbies.length < 5 ? false : true}
                        />
                        <label htmlFor={`hobby-${hobby.value}`} className="form-check-label">
                          {hobby.label}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : selectedHobbies.length > 0 ? (
                  selectedHobbies.join(", ")
                ) : (
                  <>Add Hobbies & Interests</>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HobbiesSection;