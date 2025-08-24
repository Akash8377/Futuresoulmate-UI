import React from "react";
import { camelCaseToNormalText } from "../../utils/helpers";

const PreferenceItem = ({ section, field, value, onItemClick }) => {
  return (
    <li onClick={() => onItemClick(section, field)}>
      <span className="label">{camelCaseToNormalText(field)}</span>
      <span>
        {value}
        <i className="fa fa-angle-right" aria-hidden="true"></i>
      </span>
    </li>
  );
};

export default PreferenceItem;