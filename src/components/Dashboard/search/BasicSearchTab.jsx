import React from 'react';
import ProfileIdSearch from './ProfileIdSearch';
import RecentSearches from './RecentSearches';
import BasicSearchForm from './BasicSearchForm';

const BasicSearchTab = () => {
  return (
    <div className="Basic-search">
      <ProfileIdSearch isAdvanced={false} />
      <RecentSearches isAdvanced={false}/>
      <BasicSearchForm />
    </div>
  );
};

export default BasicSearchTab;