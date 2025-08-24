// Pagination.jsx
import React from 'react';

const Pagination = () => (
  <nav className="pager" aria-label="Pagination">
    <a className="page" href="#" aria-label="Previous">&#171;</a>
    <a className="page active" href="#" aria-current="page">1</a>
    <a className="page" href="#">2</a>
    <a className="page" href="#" aria-label="Next">&#187;</a>
  </nav>
);

export default Pagination;