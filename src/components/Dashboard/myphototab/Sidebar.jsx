import React,{useState} from "react";
import { Link } from "react-router-dom";
import ProfileIdSearch from "../search/ProfileIdSearch";
import useSearchFormHandlers from "../search/SearchFormHandlers";
import { toast } from "../../Common/Toast";

const Sidebar = ({ onChangeTab,isAdvanced=false }) => {
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
  <div className="col-md-3">
    <div className="sidebar-filter-sort mt-2">
      <div className="bg-light p-3 rounded small">
        <div className="profile-management">
          <h4>
            <strong>Quick Links</strong>
          </h4>
          <div className="profile-edit-list">
            <div className="row mt-2">
              <div className="col-12 col-md-12">
                <Link to="/matches" state={{ activtab: "shortlisted" }}>
                  Shortlists
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="/matches" state={{ activtab: "matches" }}>
                  New Matches
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="/matches" state={{ activtab: "mymatches" }}>
                  My Matches
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="/matches" state={{ activtab: "todays" }}>
                  Today Matches
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="/matches" state={{ activtab: "nearme" }}>
                  Near Me
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="/search-profile" state={{ activtab: "nearme" }}>
                  My Saved Searches
                </Link>
              </div>
              <div className="col-12 col-md-12">
                <Link to="#">
                  My Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="sidebar-filter-sort mt-2">
      <div className="bg-light p-3 rounded small">
        <div className="profile-management">
          <h4>
            <strong>Profile ID Search</strong>
          </h4>
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
      </div>
    </div>
     {/* <div className="basic-search-part">
        <h4 className="mt-4">Profile ID Search</h4>
        <div className="search-box">
          <div className="d-flex align-items-center justify-content-center pe-3 ps-3">
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
      </div> */}
  </div>
)
};

export default Sidebar;
// import React from 'react';

// const Sidebar = () => (
//   <div className="sidebar">
//     <h4>Quick Links</h4>
//     <ul>
//       <li>- Shortlists & more</li>
//       <li>- New Matches</li>
//       <li>- My Matches</li>
//       <li>- Near Me</li>
//       <li>- My Saved Searches</li>
//       <li>- My Help</li>
//     </ul>


//   </div>
// );

// export default Sidebar;
