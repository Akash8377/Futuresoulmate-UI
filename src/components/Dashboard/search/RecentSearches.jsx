import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../../config';
import { useSelector } from 'react-redux';
import { toast } from '../../Common/Toast';
import { useNavigate } from 'react-router-dom';

const RecentSearches = ({ isAdvanced }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredSearches, setFilteredSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSearchId, setExpandedSearchId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { userInfo, token } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchRecentSearches();
    }
  }, [userInfo]);

  useEffect(() => {
    // Filter searches based on isAdvanced prop
    if (recentSearches.length) {
      const filtered = recentSearches.filter(search => 
        isAdvanced ? search.search_type === 'Advanced' : search.search_type === 'Basic'
      );
      setFilteredSearches(filtered);
    }
  }, [recentSearches, isAdvanced]);

  const fetchRecentSearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.baseURL}/api/search/recent-searches`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecentSearches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      toast.error('Failed to load recent searches');
    } finally {
      setLoading(false);
    }
  };

  const formatSearchParams = (params) => {
    try {
      const searchParams = typeof params === 'string' ? JSON.parse(params) : params;
      const processedParams = processSearchParams(searchParams);
      const parts = [];
      
      if (processedParams.ageFrom && processedParams.ageTo) {
        parts.push(`Age from ${processedParams.ageFrom} to ${processedParams.ageTo}yrs`);
      }
      
      if (processedParams.religion) {
        parts.push(processedParams.religion);
      }
      
      if (processedParams.community) {
        parts.push(processedParams.community);
      }
      
      if (processedParams.motherTongue) {
        const tongues = Array.isArray(processedParams.motherTongue) 
          ? processedParams.motherTongue 
          : [processedParams.motherTongue];
        parts.push(tongues.join(', '));
      }
      
      return parts.join(', ');
    } catch (e) {
      console.error('Error formatting search params:', e);
      return 'Recent search';
    }
  };

  // Process search parameters to extract values from React Select objects
  const processSearchParams = (params) => {
    if (!params) return {};
    
    const processed = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      
      // Skip null/undefined values
      if (value === null || value === undefined || value === '') {
        return;
      }
      
      // Handle array bracket notation (like motherTongue[0][value])
      if (key.includes('[') && key.includes(']')) {
        const baseKey = key.split('[')[0];
        if (!processed[baseKey]) {
          processed[baseKey] = [];
        }
        
        // Extract value from object notation
        const match = key.match(/\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const property = match[2];
          
          if (property === 'value' || property === 'label') {
            if (!processed[baseKey][index]) {
              processed[baseKey][index] = value;
            }
          }
        }
        return;
      }
      
      // Handle regular arrays
      if (Array.isArray(value)) {
        processed[key] = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            return item.value || item.label || item;
          }
          return item;
        }).filter(item => item && item !== 'Doesn\'t Matter');
      }
      // Handle objects (React Select single values)
      else if (typeof value === 'object' && value !== null) {
        processed[key] = value.value || value.label || value;
      }
      // Handle primitive values
      else {
        processed[key] = value;
      }
    });
    
    // Filter out empty arrays
    Object.keys(processed).forEach(key => {
      if (Array.isArray(processed[key]) && processed[key].length === 0) {
        delete processed[key];
      }
    });
    
    return processed;
  };

  // Helper function to format parameter values
  const formatParamValue = (value) => {
    if (!value) return null;
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return value.join(', ');
    }
    
    // Handle strings and numbers
    return value.toString();
  };

  // Helper function to format parameter keys for display
  const formatParamKey = (key) => {
    const keyMap = {
      ageFrom: 'Age From',
      ageTo: 'Age To',
      heightFrom: 'Height From',
      heightTo: 'Height To',
      maritalStatus: 'Marital Status',
      religion: 'Religion',
      motherTongue: 'Mother Tongue',
      community: 'Community',
      culture: 'Culture',
      country: 'Country',
      state: 'State',
      residencyStatus: 'Residency Status',
      countryGrew: 'Country Grew Up In',
      qualification: 'Qualification',
      educationArea: 'Education Area',
      workingWith: 'Working With',
      professionArea: 'Profession Area',
      annualIncome: 'Annual Income',
      diet: 'Diet',
      keywords: 'Keywords',
      searchType: 'Search Type',
      looking_for: 'Looking For',
      page: 'Page',
      limit: 'Limit'
    };
    
    return keyMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Check if a parameter should be displayed
  const shouldDisplayParam = (key, value) => {
    const hiddenParams = ['page', 'limit', 'skipRecentSave', 'searchType'];
    
    if (hiddenParams.includes(key)) return false;
    if (!value) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (value === 'Doesn\'t Matter' || value === 'Open for All') return false;
    if (typeof value === 'object' && Object.keys(value).length === 0) return false;
    
    return true;
  };

  const deleteSearch = async (searchId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${config.baseURL}/api/search/recent-searches/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRecentSearches(recentSearches.filter(search => search.id !== searchId));
      toast.success('Search deleted');
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    }
  };

  const handleSearchAgain = async (searchParams, e) => {
    e.stopPropagation();
    try {
      const params = typeof searchParams === 'string' ? JSON.parse(searchParams) : searchParams;
      
      // Process the parameters to extract values from React Select objects
      const processedParams = processSearchParams(params);
      
      const response = await axios.get(`${config.baseURL}/api/search/search-profiles`, {
        params: {
          ...processedParams,
          skipRecentSave: true
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/search-results', {
        state: {
          searchData: processedParams,
          initialResults: response.data.data
        }
      });
    } catch (error) {
      console.error('Error performing search:', error);
      toast.error('Failed to perform search');
    }
  };

  const toggleExpandSearch = (searchId) => {
    setExpandedSearchId(expandedSearchId === searchId ? null : searchId);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  if (loading) {
    return <div>Loading recent searches...</div>;
  }

  if (!filteredSearches.length) {
    return null;
  }

  const displayedSearches = showAll ? filteredSearches : filteredSearches.slice(0, 1);

  return (
    <>
      <h2>Recent Searches</h2>
      <div className="recent-search-box">
        {displayedSearches.map((search, index) => (
          <React.Fragment key={search.id}>
            <div 
              className="search-item d-flex justify-content-between align-items-center" 
              onClick={() => toggleExpandSearch(search.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="recent-search-item">
                <i className="fa fa-clock-o me-1" aria-hidden="true"></i>
                {formatSearchParams(search.search_params)}
                <div className="hover-box">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th colSpan="2" className="text-end pb-2">
                          <button 
                            title='Delete this search'
                            className="delete-btn btn btn-link p-0 text-danger"
                            onClick={(e) => deleteSearch(search.id, e)}
                          >
                            <i className="fa fa-close me-1" aria-hidden="true"></i>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        try {
                          const searchParams = typeof search.search_params === 'string' 
                            ? JSON.parse(search.search_params) 
                            : search.search_params;
                          
                          const processedParams = processSearchParams(searchParams);
                          
                          return Object.entries(processedParams)
                            .filter(([key, value]) => shouldDisplayParam(key, value))
                            .map(([key, value]) => (
                              <tr key={key}>
                                <th className="pe-3 text-nowrap" style={{ width: '40%' }}>
                                  {formatParamKey(key)}
                                </th>
                                <td style={{ width: '60%' }}>
                                  : {formatParamValue(value)}
                                </td>
                              </tr>
                            ));
                        } catch (e) {
                          console.error('Error parsing search params:', e);
                          return (
                            <tr>
                              <td colSpan="2" className="text-center text-muted">
                                Unable to display search details
                              </td>
                            </tr>
                          );
                        }
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div 
                className="search-again"
                onClick={(e) => handleSearchAgain(search.search_params, e)}
              >
                <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
              </div>
            </div>
            {index < displayedSearches.length - 1 && <hr />}
          </React.Fragment>
        ))}
        
        {filteredSearches.length > 1 && (
          <button 
            onClick={toggleShowAll}
            className="btn p-0 mt-2 view-more"
          >
            {showAll ? 'Show Less' : `View More (${filteredSearches.length - 1})`}
          </button>
        )}
      </div>
    </>
  );
};

export default RecentSearches;