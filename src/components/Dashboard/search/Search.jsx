import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import BasicSearchTab from './BasicSearchTab';
import AdvancedSearchTab from './AdvancedSearchTab';
import ChatBox from '../inbox/components/ChatBox';

const Search = () => {
  const [key, setKey] = useState('');
     const setTab = (key)=>{
      sessionStorage.setItem("SearchTab", key)
      setKey(key);
    }
  
   useEffect(()=>{
      if(sessionStorage.getItem("SearchTab")){
        setTab(sessionStorage.getItem("SearchTab"))
      }else{
        setTab("basic")
      }
   },[])

  return (
    <>
      <div className="container mt-3">
        <Tabs
          id="search-tabs"
          activeKey={key}
          onSelect={(k) => setTab(k)}
          className="nav nav-tabs justify-content-center"
        >
          <Tab eventKey="basic" title="Basic Search">
            <BasicSearchTab />
          </Tab>
          <Tab eventKey="advanced" title="Advanced Search" className='search-nav-link'>
            <AdvancedSearchTab />
          </Tab>
        </Tabs>
      </div>
      <ChatBox/>
    </>
  );
};

export default Search;