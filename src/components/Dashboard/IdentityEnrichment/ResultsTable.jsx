// ResultsTable.jsx
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const tableData = [
  {
    name: "Akash Choudhary",
    location: "RANCHO CUCAMONGA, CA",
    age: "31",
    locations: [
      "Rancho Cucamonga, CA",
      "Los Angeles, CA",
      "Bloomington, CA",
      "Riverside, CA"
    ],
    relatives: [
      "Harish Choudhary",
      "Rana Choudhary",
      "Richa Choudhary",
      "Ruplal Choudhary",
      "Samita Choudhary",
      "Deepika Choudhary"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash C. Choudhary",
    location: "BELLEVUE, WA",
    age: "47",
    locations: [
      "Bellevue, WA",
      "Rolla, MO",
      "Bethlehem, PA"
    ],
    relatives: [
      "Akshay Choudhary",
      "Akash Sehgal"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash K. Choudhary",
    location: "PHILADELPHIA, PA",
    age: "31",
    locations: [
      "Philadelphia, PA",
      "Central Islip, NY",
      "Greensboro, NC",
      "Marshall, MO",
      "Southport, NC",
      "Louisville, KY",
      "Buffalo, NY"
    ],
    relatives: [
      "Anju Choudhary",
      "Chandra Choudhary",
      "Rajesh Choudhary",
      "Rishav Choudhary",
      "Samar Choudhary",
      "Santosh Choudhary"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 4
  },
  {
    name: "Akash Choudhary",
    location: "SAN RAMON, CA",
    age: "53",
    locations: [
      "San Ramon, CA",
      "Pleasant Hill, CA",
      "Somerset, NJ"
    ],
    relatives: [
      "Amish Choudhary",
      "Maria Choudhary"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash Choudhary",
    location: "ANKENY, IA",
    age: "38",
    locations: [
      "Ankeny, IA",
      "Altoona, IA"
    ],
    relatives: [],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash Choudhary",
    location: "HAUPPAUGE, NY",
    age: "–",
    locations: [
      "Hauppauge, NY"
    ],
    relatives: [],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash Choudhary",
    location: "HUNTINGDON VALLEY, PA",
    age: "52",
    locations: [
      "Huntingdon Valley, PA",
      "Glendale, AZ"
    ],
    relatives: [
      "Shailesh Parihar"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash Choudhary",
    location: "SUNNYVALE, CA",
    age: "–",
    locations: [
      "Sunnyvale, CA"
    ],
    relatives: [],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  },
  {
    name: "Akash Choudhary",
    location: "SAN RAMON, CA",
    age: "53",
    locations: [
      "San Ramon, CA",
      "Spears, NV",
      "Pleasant Hill, CA",
      "Milpitas, CA",
      "San Mateo, CA"
    ],
    relatives: [
      "Rinku Thakur",
      "A Choudhary",
      "Amish Choudhary",
      "Maria Choudhary"
    ],
    verifiedName: "Akash Choudhary",
    matchScore: 5
  }
];

const ResultsTable = () => (
  <div>
    <TableHeader />
    <div className="table" role="table" aria-label="People search results">
      {tableData.map((row, index) => (
        <TableRow key={index} data={row} />
      ))}
    </div>
  </div>
);

export default ResultsTable;