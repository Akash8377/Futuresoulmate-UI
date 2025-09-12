import React, { useEffect, useState } from "react";
import HLATest from "./components/HLATest";
import DNATest from "./components/DNATest";
import { Tab, Tabs } from "react-bootstrap";
import ChatBox from "../../inbox/components/ChatBox";
import { useLocation } from "react-router-dom";
const DNA = () => {
  const [key, setKey] = useState("");
  const location = useLocation()

  const [showChatBox, setShowChatBox] = useState(false)
  const chatBoxOpen = () =>{
    setShowChatBox(true)
  }
  const setTab = (key)=>{
    sessionStorage.setItem("DNATab", key)
    setKey(key);
  }


  useEffect(()=>{
    if(location?.state?.activeKey === "hla-dna-matches"){
      setKey(location?.state?.activeKey)
      sessionStorage.setItem("DNATab","hla-dna-matches")
      location.state.activeKey = "hla-test"
    }else if(sessionStorage.getItem("DNATab")){
      setKey(sessionStorage.getItem("DNATab"))
    }else{
      setKey("hla-test")
    }
  },[location])

  return (
    <>
      <div className="container mt-3">
        <Tabs
          id=""
          activeKey={key}
          onSelect={(k) => setTab(k)}
          className="nav nav-tabs justify-content-center"
        >
          <Tab eventKey="hla-test" title="HLA Test">
            <HLATest/>
          </Tab>
          <Tab eventKey="dna-test" title="DNA Test">
            <DNATest />
          </Tab>
        </Tabs>
      </div>
      <ChatBox showChatBox={showChatBox} setShowChatBox={()=>setShowChatBox(false)}/>
    </>
  );
};

export default DNA;
