import React from "react";
import PreferenceItem from "./PreferenceItem";

const PreferenceCard = ({ 
  section, 
  title, 
  iconClass, 
  preferences, 
  fields, 
  onItemClick 
}) => {
  // console.log("field", preferences)
  // console.log("field", section)
  return (
    <section className="pref-card">
      {/* <div className="pref-head" onClick={() => onItemClick(section, "title")}> */}
      <div className="pref-head">
        <i className={iconClass} aria-hidden="true"></i>
        <span className="title">{title}</span>
      </div>
      <ul className="pref-body">
        {fields.map((field) => (
          
          <PreferenceItem
            key={field}
            section={section}
            field={field}
            value={preferences[section][field]}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </section>
  );
};

export default PreferenceCard;