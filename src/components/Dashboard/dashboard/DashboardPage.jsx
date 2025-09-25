
import React, { useState, useEffect } from "react";
import DashboardTab from "./DashboardTab";
import ProfileTab from "./ProfileTab";
import PhotosTab from "./PhotosTab";
import PartnerTab from "./PartnerTab";
import SettingsTab from "./SettingsTab";
import MoreTab from "./MoreTab";
import HLA_DNA from "./dna/HLA_DNA"
import { useLocation } from 'react-router-dom';
import ChatBox from "../inbox/components/ChatBox";

// Component mapping
const tabComponents = {
  dash: DashboardTab,
  profile: ProfileTab,
  photos: PhotosTab,
  partner: PartnerTab,
  settings: SettingsTab,
  more: MoreTab,
  dnaHla:HLA_DNA,
};

// Headings mapping
const tabHeadings = {
  dash: "Dashboard",
  profile: "My Profile",
  photos: "My Photos",
  partner: "Partner Preferences",
  settings: "Settings",
  more: "More",
  dnaHla:"DNA + HLA Test"
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("");
  const ActiveComponent = tabComponents[activeTab];
 const location = useLocation();

   const setTab = (key)=>{
    sessionStorage.setItem("DashboardTab", key)
    setActiveTab(key);
  }

 useEffect(()=>{
   if(location.state?.activtab){
    setTab(location.state?.activtab || "dash")
    sessionStorage.setItem("DashboardTab",location.state?.activtab)
    }else if(sessionStorage.getItem("DashboardTab")){
      setTab(sessionStorage.getItem("DashboardTab"))
    }else{
      setTab("dash")
    }
 },[location.state?.activtab])

  return (
    <div>
      {/* Navbar/Header remains unchanged */}
      <div className="container mt-3">
        <ul className="nav nav-tabs" id="mainTab" role="tablist">
          {Object.keys(tabComponents).map((tabKey) => (
            <li className="nav-item" key={tabKey}>
              <button
                className={`nav-link ${activeTab === tabKey ? "active" : ""}`}
                onClick={() => setTab(tabKey)}
              >
                {tabHeadings[tabKey]}
              </button>
            </li>
          ))}
        </ul>

        {/* Heading and Tab Content */}
        <div className="tab-content">
          {/* <h3 className="mb-3">{tabHeadings[activeTab]}</h3> */}
          {/* {ActiveComponent && <ActiveComponent />} */}
            {activeTab === "dash" ? (
            <DashboardTab onChangeTab={setTab} />
          ) : activeTab === "profile" ? (
            <ProfileTab onChangeTab={setTab} />
          ) : activeTab === "more" ? (
            <MoreTab onChangeTab={setTab} />
          ): activeTab === "photos" ? (
            <PhotosTab onChangeTab={setTab} />
          ):(
            ActiveComponent && <ActiveComponent />
          )}
        </div>
        <ChatBox/>
      </div>
    </div>
  );
};

export default DashboardPage;
