// TableHeader.jsx
import React from 'react';

const TableHeader = () => (
  <div className="band" role="rowheader">
    {[
      { icon: 'M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z', label: 'NAME' },
      { icon: 'M12 20a8 8 0 100-16 8 8 0 000 16zm.5-12h-1v5l4 2 .5-.87-3.5-1.88V8z', label: 'AGE' },
      { icon: 'M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z', label: 'LOCATION' },
      { icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C18 14.17 13.33 13 11 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', label: 'POSSIBLE RELATIVES' },
      { icon: 'M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z', label: 'FULL REPORT' }
    ].map((column, index) => (
      <div key={index}>
        <span className="ico" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d={column.icon}/></svg>
        </span> {column.label}
      </div>
    ))}
  </div>
);

export default TableHeader;