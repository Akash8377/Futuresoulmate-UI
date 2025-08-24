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
      const parts = [];
      
      if (searchParams.ageFrom && searchParams.ageTo) {
        parts.push(`Age from ${searchParams.ageFrom} to ${searchParams.ageTo}yrs`);
      }
      
      if (searchParams.religion) {
        parts.push(searchParams.religion);
      }
      
      if (searchParams.community) {
        parts.push(searchParams.community);
      }
      
      if (searchParams.motherTongue) {
        const tongues = Array.isArray(searchParams.motherTongue) 
          ? searchParams.motherTongue 
          : [searchParams.motherTongue];
        parts.push(tongues.join(', '));
      }
      
      return parts.join(', ');
    } catch (e) {
      console.error('Error formatting search params:', e);
      return 'Recent search';
    }
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
      
      const response = await axios.get(`${config.baseURL}/api/search/search-profiles`, {
        params: {
          ...params,
          skipRecentSave: true
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/search-results', {
        state: {
          searchData: params,
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
    return <div>No recent searches found</div>;
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
                    <tbody>
                      {Object.entries(JSON.parse(search.search_params)).map(([key, value]) => (
                        value && (
                          <tr key={key}>
                            <th className="pe-3">{key.replace(/[\[\]_]/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
                            <td>: {Array.isArray(value) ? value.join(', ') : value}</td>
                          </tr>
                        )
                      ))}
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
            
            {expandedSearchId === search.id && (
              <div className="search-item">
                <div className="w-100 d-flex justify-content-end">
                  <button 
                    className="delete-btn btn btn-link p-0 text-danger"
                    onClick={(e) => deleteSearch(search.id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {index < displayedSearches.length - 1 && <hr />}
          </React.Fragment>
        ))}
        
        {filteredSearches.length > 1 && (
          <button 
            onClick={toggleShowAll}
            className="btn p-0 mt-2 view-more"
          >
            {showAll ? 'Show Less' : 'View More'}
          </button>
        )}
      </div>
    </>
  );
};

export default RecentSearches;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../../config';
// import { useSelector } from 'react-redux';
// import { toast } from '../../Common/Toast';
// import { useNavigate } from 'react-router-dom';

// const RecentSearches = ({ isAdvanced }) => {
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedSearchId, setExpandedSearchId] = useState(null);
//   const [showAll, setShowAll] = useState(false);
//   const { userInfo, token } = useSelector(state => state.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userInfo && userInfo.id) {
//       fetchRecentSearches();
//     }
//   }, [userInfo]);

//   const fetchRecentSearches = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${config.baseURL}/api/search/recent-searches`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       console.log(response.data.data)
//       setRecentSearches(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching recent searches:', error);
//       toast.error('Failed to load recent searches');
//     } finally {
//       setLoading(false);
//     }
//   };

  // const formatSearchParams = (params) => {
  //   try {
  //     const searchParams = typeof params === 'string' ? JSON.parse(params) : params;
  //     const parts = [];
      
  //     if (searchParams.ageFrom && searchParams.ageTo) {
  //       parts.push(`Age from ${searchParams.ageFrom} to ${searchParams.ageTo}yrs`);
  //     }
      
  //     if (searchParams.religion) {
  //       parts.push(searchParams.religion);
  //     }
      
  //     if (searchParams.community) {
  //       parts.push(searchParams.community);
  //     }
      
  //     if (searchParams.motherTongue) {
  //       const tongues = Array.isArray(searchParams.motherTongue) 
  //         ? searchParams.motherTongue 
  //         : [searchParams.motherTongue];
  //       parts.push(tongues.join(', '));
  //     }
      
  //     return parts.join(', ');
  //   } catch (e) {
  //     console.error('Error formatting search params:', e);
  //     return 'Recent search';
  //   }
  // };

  // const deleteSearch = async (searchId, e) => {
  //   e.stopPropagation();
  //   try {
  //     await axios.delete(`${config.baseURL}/api/search/recent-searches/${searchId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     setRecentSearches(recentSearches.filter(search => search.id !== searchId));
  //     toast.success('Search deleted');
  //   } catch (error) {
  //     console.error('Error deleting search:', error);
  //     toast.error('Failed to delete search');
  //   }
  // };

  // const handleSearchAgain = async (searchParams, e) => {
  //   e.stopPropagation();
  //   try {
  //     const params = typeof searchParams === 'string' ? JSON.parse(searchParams) : searchParams;
      
  //     const response = await axios.get(`${config.baseURL}/api/search/search-profiles`, {
  //       params: {
  //         ...params,
  //         skipRecentSave: true
  //       },
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     navigate('/search-results', {
  //       state: {
  //         searchData: params,
  //         initialResults: response.data.data
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error performing search:', error);
  //     toast.error('Failed to perform search');
  //   }
  // };

  // const toggleExpandSearch = (searchId) => {
  //   setExpandedSearchId(expandedSearchId === searchId ? null : searchId);
  // };

  // const toggleShowAll = () => {
  //   setShowAll(!showAll);
  // };

//   if (loading) {
//     return <div>Loading recent searches...</div>;
//   }

//   if (!recentSearches.length) {
//     return <div>No recent searches found</div>;
//   }

//   const displayedSearches = showAll ? recentSearches : recentSearches.slice(0, 1);

//   return (
//     <>
//       <h2>Recent Searches</h2>
//       <div className="recent-search-box">
//         {displayedSearches.map((search, index) => (
//           <React.Fragment key={search.id}>
//             <div 
//               className="search-item d-flex justify-content-between align-items-center" 
//               onClick={() => toggleExpandSearch(search.id)}
//               style={{ cursor: 'pointer' }}
//             >
//               <div className="recent-search-item">
//                 <i className="fa fa-clock-o me-1" aria-hidden="true"></i>
//                 {formatSearchParams(search.search_params)}
//                 <div className="hover-box">
//                   <table className="w-100">
//                     <tbody>
//                       {Object.entries(JSON.parse(search.search_params)).map(([key, value]) => (
//                         value && (
//                           <tr key={key}>
//                             <th className="pe-3">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</th>
//                             <td>: {Array.isArray(value) ? value.join(', ') : value}</td>
//                           </tr>
//                         )
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div 
//                 className="search-again"
//                 onClick={(e) => handleSearchAgain(search.search_params, e)}
//               >
//                 <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
//               </div>
//             </div>
            
//             {expandedSearchId === search.id && (
//               <div className="search-item">
//                 <div className="w-100 d-flex justify-content-end">
//                   <button 
//                     className="delete-btn btn btn-link p-0 text-danger"
//                     onClick={(e) => deleteSearch(search.id, e)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             )}
//             {index < displayedSearches.length - 1 && <hr />}
//           </React.Fragment>
//         ))}
        
//         {recentSearches.length > 1 && (
//           <button 
//             onClick={toggleShowAll}
//             className="btn p-0 mt-2 view-more"
//           >
//             {showAll ? 'Show Less' : 'View More'}
//           </button>
//         )}
//       </div>
//     </>
//   );
// };

// export default RecentSearches;