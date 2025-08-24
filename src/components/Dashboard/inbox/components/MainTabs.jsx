import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Received from './Recieved';
import Accepted from './Accepted';
// import Sent from './Sent';
import Requested from './Requested';
import Deleted from './Deleted';
import ChatBox from './ChatBox';



function MainTabs() {
  const [activeKey, setActiveKey] = useState('');
   const [showChatBox, setShowChatBox] = useState(false)
   const chatBoxOpen = () =>{
    setShowChatBox(true)
 }

  const handleSelect = (key)=>{
    sessionStorage.setItem("InboxTab", key)
    setActiveKey(key);
  }
   
  useEffect(()=>{
      if(sessionStorage.getItem("InboxTab")){
        handleSelect(sessionStorage.getItem("InboxTab"))
      }else{
        handleSelect("received")
      }
  },[])

 const tabComponents = [
  {
    key: 'received',
    title: 'Received',
    component: <Received activeKey={activeKey}/>,
  },
  {
    key: 'accepted',
    title: 'Accepted',
    component: <Accepted chatBoxOpen={chatBoxOpen} activeKey={activeKey}/>,
  },
  {
    key: 'request',
    title: 'Request',
    component: <Requested chatBoxOpen={chatBoxOpen} activeKey={activeKey}/>,
  },
  {
    key: 'deleted',
    title: 'Deleted',
    component: <Deleted chatBoxOpen={chatBoxOpen} activeKey={activeKey}/>,
  },
];

  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onSelect={handleSelect}
        id="main-tab"
        className="nav nav-tabs justify-content-center"
      >
        {tabComponents.map(({ key, title }) => (
          <Tab eventKey={key} title={title} key={key} />
        ))}
      </Tabs>

      {/* Only render one component, but don't remount others */}
      <div className="p-4">
        {tabComponents.map(({ key, component }) => (
          <div key={key} style={{ display: activeKey === key ? 'block' : 'none' }}>
            {component}
          </div>
        ))}
      </div>
      <ChatBox showChatBox={showChatBox} setShowChatBox={()=>setShowChatBox(false)}/>
    </div>
  );
}

export default MainTabs;
