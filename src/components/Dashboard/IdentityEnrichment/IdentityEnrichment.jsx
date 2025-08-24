// MainReportPage.jsx
import React from 'react';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';
import Pagination from './Pagination';
import Disclaimer from './Disclaimer';

const IdentityEnrichment = () => {
  return (
    <div className="report-page">
      <div className="container">
        <HeroSection />
        <SearchBar />
        <ResultsTable />
        <Pagination />
        <Disclaimer />
      </div>
    </div>
  );
};

export default IdentityEnrichment;