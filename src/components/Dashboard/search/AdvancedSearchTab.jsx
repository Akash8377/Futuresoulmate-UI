import React from 'react';
import ProfileIdSearch from './ProfileIdSearch';
import RecentSearches from './RecentSearches';
import AdvancedSearchForm from './AdvancedSearchForm';

const AdvancedSearchTab = () => {
  return (
    <div className="Basic-search">
      <ProfileIdSearch isAdvanced={true} />
      <RecentSearches isAdvanced={true}/>
      <AdvancedSearchForm />
    </div>
  );
};

export default AdvancedSearchTab;