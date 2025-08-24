import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const SliderModal = ({ 
  title, 
  value, 
  min, 
  max, 
  onChange, 
  formatValue 
}) => {
  return (
    <div className="slider-container">
      <label>
        {title}: {formatValue ? formatValue(value) : value.join(" - ")}
      </label>
      <div style={{ margin: "20px" }}>
        <Slider
          range
          min={min}
          max={max}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SliderModal;