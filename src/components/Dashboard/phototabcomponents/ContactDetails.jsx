import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { scrollToTop } from '../../../utils/helpers';

const ContactDetails = ({ isEditing, onEditClick, onSaveClick, onDataChange, updatedData }) => {
  const { userInfo, token } = useSelector(state => state.user);
  
  const getValue = (field) => {
    return updatedData[field] !== undefined ? updatedData[field] : userInfo[field];
  };

  return (
    <div>
      <div className="section-title">
        Contact Details{" "}
        {isEditing ? (
          <a onClick={onSaveClick} className="small float-end cursor-pointer">
            Save
          </a>
        ) : (
          <a onClick={onEditClick} className="small float-end cursor-pointer">
            Edit
          </a>
        )}
      </div>
      <div className="row py-3 border-top">
        <div className="col-md-6 pe-md-4">
          <table className="table table-borderless table-sm mini-data mb-0">
            <tbody>
              <tr>
                <td>Mobile:</td>
                <td>{isEditing ? (
                  <input 
                    type="text" 
                    value={getValue('phone')} 
                    onChange={(e) => onDataChange('phone', e.target.value)}
                    className="form-control form-control-sm d-inline-block w-auto"
                  />
                ) : (
                  `+91 ${userInfo?.phone}`
                )}</td>
              </tr>
              <tr>
                <td>Display Options:</td>
                <td>Only Premium</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6 pe-md-4"></div>
      </div>
      <div className="text-end mt-0">
        <button type='button' className="btn btn-link back-to-top" onClick={scrollToTop}>
          Back to Top <i className="fa fa-angle-up" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  )
}

export default ContactDetails