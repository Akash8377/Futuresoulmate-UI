// TableRow.jsx
import React from 'react';

const TableRow = ({ data }) => (
  <div className="row row1" role="row">
    <div className="cell name">
      <div className="badge" aria-hidden="true">
        <img src="images/badgedash.png" alt="badge" />
      </div>
      <div className="namebox">
        <a href="#">{data.name}</a>
        <div className="subcity">{data.location}</div>
      </div>
    </div>
    <div className="cell age"><span className="age">{data.age}</span></div>
    <div className="cell locations">
      <ul className="list">
        {data.locations.map((location, i) => <li key={i}>{location}</li>)}
      </ul>
    </div>
    <div className="cell relatives">
      <ul className="list">
        {data.relatives.map((relative, i) => <li key={i}>{relative}</li>)}
      </ul>
    </div>
    <div className="cell actions">
      <a className="btn" href="#">Open Report</a>
    </div>
    <div className="meta">
      <div className="vname">
        <span className="tick">
          <svg viewBox="0 0 24 24"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z"/></svg>
        </span> Verified name match: <b>&nbsp;{data.verifiedName}</b>
      </div>
      <div className="likelihood">
        <span>Likeliness Match:</span>
        <span className="dots" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`dot ${i < data.matchScore ? 'on' : ''}`}></span>
          ))}
        </span>
      </div> 
    </div>
  </div>
);

export default TableRow;