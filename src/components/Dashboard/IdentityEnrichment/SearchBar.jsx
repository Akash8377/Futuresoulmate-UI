// SearchBar.jsx
import React from 'react';

const SearchBar = () => (
  <div className="search-hero">
    <div className="container">
      <div className="row g-2 justify-content-center align-items-center">
        <div className="col-md-3">
          <input type="email" className="form-control" placeholder="Enter Email" />
        </div>
        <div className="col-md-1 text-center fw-bold" style={{color:'#000'}}>
          OR
        </div>
        <div className="col-md-3">
          <input type="tel" className="form-control" placeholder="Enter Phone Number" />
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
    </div>    
  </div>
);

export default SearchBar;