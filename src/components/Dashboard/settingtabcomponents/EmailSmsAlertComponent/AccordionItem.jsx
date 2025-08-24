import React from "react";

const AccordionItem = ({ id, title, children, isOpen, toggle }) => (
  <div className="accordion-item">
    <h2 className="accordion-header" id={`heading-${id}`}>
      <button
        className={`accordion-button ${isOpen ? "" : "collapsed"}`}
        type="button"
        onClick={() => toggle(id)}
      >
        {title}
      </button>
    </h2>
    <div
      id={id}
      className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
    >
      <div className="accordion-body">{children}</div>
    </div>
  </div>
);

export default AccordionItem;