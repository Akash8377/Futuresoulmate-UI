import React, { useState, useEffect } from "react";
import config from "../../../config";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Notification = ({ onChangeTab }) => {
  const user = useSelector((state) => state.user.userInfo);
  const currentUserId = user?.id;
  const [notifications, setNotifications] = useState([]);
  const [profileVisits, setProfileVisits] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/notifications/${currentUserId}`
      );
      if (response.data.success) {
        // console.log("Notifications", response.data)
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchProfileVisits = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/profile-visits/visits/${currentUserId}`
      );
      if (response.data.success) {
        // console.log("Recent Visitors", response.data)
        setProfileVisits(response.data.visits);
      }
    } catch (error) {
      console.error("Failed to fetch profile visits:", error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchNotifications();
      fetchProfileVisits();
    }
  }, [currentUserId]);

  // Combine notifications and profile visits for display
  const getAllNotifications = () => {
    const visitNotifications = profileVisits.map(visit => ({
      id: `visit_${visit.id}`,
      type: 'profile_visit',
      message: `${visit.first_name} ${visit.last_name} visited your profile`,
      created_at: visit.last_visited_at,
      profile_image: visit.profile_image,
      user_id: visit.visitor_user_id,
      is_visit: true
    }));

    const regularNotifications = notifications.map(notif => ({
      ...notif,
      is_visit: false,
      profile_image: notif.sender_profile_image || notif.profile_image
    }));

    return [...visitNotifications, ...regularNotifications]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'profile_visit':
        return 'fa-eye text-primary';
      case 'connect':
        return 'fa-user-plus text-success';
      case 'message':
        return 'fa-envelope text-info';
      default:
        return 'fa-bell text-warning';
    }
  };

  const allNotifications = getAllNotifications();

  return (
    <div className="all-request-part">
      <div className="row">
        {/* Sidebar - Same as before */}
        <div className="col-md-3">
          <div className="sidebar-filter-sort">
            <div className="bg-light p-3 rounded small">
              <div className="profile-management">
                <h4>
                  <strong>Manage your Profile</strong>
                </h4>
                <div className="profile-edit-list">
                  <div className="row mt-2">
                    <div className="col-12 col-md-12">
                      <a href="#" onClick={() => onChangeTab("settings")}>
                        My Contact Details
                      </a>
                    </div>
                    <div className="col-12 col-md-12">
                      <a href="#" onClick={() => onChangeTab("settings")}>
                        Add Horoscope Details
                      </a>
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
                  <strong>Quick Links</strong>
                </h4>
                <div className="profile-edit-list">
                  <div className="row mt-2">
                    <div className="col-12 col-md-12">
                      <Link to="/matches" state={{ activtab: "todays" }}>
                        Today Matches
                      </Link>
                    </div>
                    <div className="col-12 col-md-12">
                      <Link to="/matches" state={{ activtab: "mymatches" }}>
                        My Matches
                      </Link>
                    </div>
                    <div className="col-12 col-md-12">
                      <Link to="/matches" state={{ activtab: "shortlisted" }}>
                        Shortlist Profiles
                      </Link>
                    </div>
                    <div className="col-12 col-md-12">
                      <Link to="/matches" state={{ activtab: "nearme" }}>
                        Near Me
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Notifications</h5>
          </div>
          
          <div className="tab-container">
            <div className="profile-request">
              {allNotifications.length === 0 ? (
                <div className="card-profile">
                  <p className="text-center text-muted small">No notifications found.</p>
                </div>
              ) : (
                <div className="notification-list">
                  <div className="row">
                    <div className="card-profile d-flex flex-column gap-2">
                      {allNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="d-flex align-items-start p-2 border-bottom"
                        >
                          {/* Notification Icon */}
                          <div className="me-2 mt-1">
                            <i className={`fa ${getNotificationIcon(notification.type)} fa-sm`}></i>
                          </div>
                          
                          {/* Notification Content */}
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="small">
                                <div className="text-muted">
                                  {notification.message}
                                </div>
                                <small className="text-muted">
                                  {new Date(notification.created_at).toLocaleDateString()} {' '}
                                  {new Date(notification.created_at).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </small>
                              </div>
                              
                              {/* Profile Image for All Notifications */}
                              {/* {notification.profile_image && (
                                <div className="ms-2">
                                  <img 
                                    src={`${config.baseURL}/uploads/profiles/${notification.profile_image}`}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.src = '/images/default-profile.png';
                                    }}
                                  />
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;