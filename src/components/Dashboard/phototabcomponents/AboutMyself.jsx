import React, { useState } from 'react';
import { calculateAge, scrollToTop } from '../../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import BasicInfoSection from './BasicInfoSection';
import ReligiousBackgroundSection from './ReligiousBackgroundSection';
import FamilyDetailsSection from './FamilyDetailsSection';
import EducationCareerSection from './EducationCareerSection';
import HobbiesSection from './HobbiesSection';

const AboutMyself = ({ isEditing, onEditClick, onSaveClick, onCancelClick, onDataChange, updatedData }) => {
  const { userInfo } = useSelector(state => state.user);
  console.log("user Info", userInfo)
  const familyDetails = userInfo?.family_details ? typeof userInfo?.family_details === 'string' ? JSON.parse(userInfo?.family_details): userInfo?.family_details:{mother:"",father:"",sisters:"",brothers:""};
  const hobbies = typeof userInfo?.hobbies === 'string'  ? JSON.parse(userInfo?.hobbies) : userInfo?.hobbies;
  const [selectedHobbies, setSelectedHobbies] = useState(hobbies || []);
  const [editingFields, setEditingFields] = useState("");

  const handleCheckboxChange = (hobbyValue) => {
    if (typeof hobbyValue === 'string') {
      setSelectedHobbies(prev => {
        const newHobbies = prev.includes(hobbyValue)
          ? prev.filter(item => item !== hobbyValue)
          : [...prev, hobbyValue];
        onDataChange('hobbies', newHobbies);
        return newHobbies;
      });
    } else if (hobbyValue.target) {
      const options = Array.from(hobbyValue.target.selectedOptions).map(option => option.value);
      setSelectedHobbies(options);
      onDataChange('hobbies', options);
    }
  };

  const getValue = (field) => {
    return updatedData[field] !== undefined ? updatedData[field] : userInfo[field] || "";
  };

const getFamilyValue = (field) => {  
  // Check updatedData.family_details first, then fall back to original familyDetails
  if (updatedData.family_details && updatedData.family_details[field] !== undefined) {
    return updatedData.family_details[field];
  }
  return familyDetails[field] || "";
};

  return (
    <div>
      <div className="section-title">
        Basics & Lifestyle{" "}
        {isEditing && editingFields === "basic" ? (
          <>
            <a onClick={onCancelClick} className="small float-end cursor-pointer">Cancel</a>
            <a onClick={onSaveClick} className="small float-end cursor-pointer pe-2">Save</a>
          </>
        ) : (
          <a onClick={() => { onEditClick(); setEditingFields("basic") }} className="small float-end cursor-pointer">Edit</a>
        )}
      </div>
      <BasicInfoSection 
        isEditing={isEditing} 
        getValue={getValue} 
        onDataChange={onDataChange} 
        editingFields={editingFields} 
      />

      <ReligiousBackgroundSection 
        isEditing={isEditing} 
        getValue={getValue} 
        onDataChange={onDataChange} 
        editingFields={editingFields}
        setEditingFields={setEditingFields} 
        onEditClick={onEditClick} 
        onSaveClick={onSaveClick} 
        onCancelClick={onCancelClick} 
      />

      <div className="section-title">
        Family Details{" "}
        {isEditing && editingFields === "family" ? (
          <>
            <a onClick={onCancelClick} className="small float-end cursor-pointer">Cancel</a>
            <a onClick={onSaveClick} className="small float-end cursor-pointer pe-2">Save</a>
          </>
        ) : (
          <a onClick={() => { onEditClick(); setEditingFields("family") }} className="small float-end cursor-pointer">Edit</a>
        )}
      </div>
      <FamilyDetailsSection 
        isEditing={isEditing} 
        getValue={getValue} 
        getFamilyValue={getFamilyValue} 
        onDataChange={onDataChange} 
        editingFields={editingFields} 
      />

      <div className="section-title">
        Education & Career{" "}
        {isEditing && editingFields === "career" ? (
          <>
            <a onClick={onCancelClick} className="small float-end cursor-pointer">Cancel</a>
            <a onClick={onSaveClick} className="small float-end cursor-pointer pe-2">Save</a>
          </>
        ) : (
          <a onClick={() => { onEditClick(); setEditingFields("career") }} className="small float-end cursor-pointer">Edit</a>
        )}
      </div>
      <EducationCareerSection 
        isEditing={isEditing} 
        getValue={getValue} 
        onDataChange={onDataChange} 
        editingFields={editingFields} 
      />

      <div className="section-title">
        Hobbies & Interests{" "}
        {isEditing && editingFields === "hobbies" ? (
          <>
            <a onClick={onCancelClick} className="small float-end cursor-pointer">Cancel</a>
            <a onClick={onSaveClick} className="small float-end cursor-pointer pe-2">Save</a>
          </>
        ) : (
          <a onClick={() => { onEditClick(); setEditingFields("hobbies") }} className="small float-end cursor-pointer">Edit</a>
        )}
      </div>
      <HobbiesSection 
        isEditing={isEditing} 
        editingFields={editingFields} 
        selectedHobbies={selectedHobbies} 
        handleCheckboxChange={handleCheckboxChange} 
      />

      <div className="row py-3 border-top"></div>
      <div className="text-end">
        <button type='button' onClick={scrollToTop} className="btn btn-link back-to-top">
          Back to Top <i className="fa fa-angle-up" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};

export default AboutMyself;