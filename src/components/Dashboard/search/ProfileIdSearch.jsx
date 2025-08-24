import React, { useState } from 'react';
import useSearchFormHandlers from './SearchFormHandlers';
import { toast } from '../../Common/Toast';

const ProfileIdSearch = ({ isAdvanced }) => {
    const [inputValue, setInputValue] = useState('');
    const {
      searchByProfileId
    } = useSearchFormHandlers();

    const handleSearch = async () => {
      try {
        if (!inputValue.trim()) {
          toast.error('Please enter a Profile ID');
          return;
        }
        await searchByProfileId(inputValue);
      } catch (error) {
        toast.error('Search failed. Please try again.');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className="basic-search-part">
        <h2 className="mt-4">Profile ID Search</h2>
        <div className="search-box">
          <div className="d-flex align-items-center justify-content-center">
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Enter Profile ID"
              style={{maxWidth: '250px'}}
              name={isAdvanced ? "advanceProfileId" : "profileId"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn custom-btn"
              onClick={handleSearch}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    );
};

export default ProfileIdSearch;