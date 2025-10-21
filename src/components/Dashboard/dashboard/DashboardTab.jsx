import React, { useEffect, useState } from 'react';
import DashProfile from './dashtabcomponents/DashProfile';
import Advertise from './dashtabcomponents/Advertise';
import RecentVisitors from './dashtabcomponents/RecentVisitors';
import MatchesSection from './dashtabcomponents/MatchesSection';
import { useSelector } from "react-redux";
import config from '../../../config';
import axios from 'axios';
import { ConnectionProvider } from './dashtabcomponents/ConnectionContext';

const DashboardTab = ({onChangeTab}) => {

  const user = useSelector((state) => state.user.userInfo);
  const currentUserId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [recentVisitors, setRecentVisiors] = useState([]);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/notifications/${currentUserId}`
      );
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setRecentVisiors(response.data.recentVisitors);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };
  useEffect(() => {
    if (currentUserId) fetchNotifications();
  }, [currentUserId]);

  return (
     <div className="tab-content" id="mainTabContent">
    <div className="tab-pane fade show active p-4" id="dash" role="tabpanel" aria-labelledby="dash-tab">
      <div className="container-xl py-4">
        {/* Row 1 */}
        <DashProfile onEditClick={() =>onChangeTab("profile")} notifications={notifications} recentVisitors={recentVisitors}/>
        <Advertise notifications={notifications}/>
        <ConnectionProvider>
          <RecentVisitors/>
          <MatchesSection/>
        </ConnectionProvider>
          </div>
      </div>
    </div>
  );
};

export default DashboardTab;
