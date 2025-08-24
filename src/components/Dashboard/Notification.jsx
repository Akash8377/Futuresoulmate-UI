import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Notification = ({ onChangeTab }) => {
  const user = useSelector((state) => state.user.userInfo);
  const currentUserId = user?.id;
  const [notifications, setNotifications] = useState([]);

  const handleNotificationRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n))
    );
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const response = await axios.put(
        `${config.baseURL}/api/notifications/read/${notificationId}`
      );
      handleNotificationRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/notifications/${currentUserId}`
      );
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };
  useEffect(() => {
    if (currentUserId) fetchNotifications();
  }, [currentUserId]);

  return (
    <div className="all-request-part">
      <div className="row">
          {/* Sidebar */}
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
                    {/* <div className="col-12 col-md-12">
                      <a href="#" onClick={() => onChangeTab("settings")}>
                        My Orders
                      </a>
                    </div> */}
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
          <h5>Notifications</h5>
          <div className="tab-container">
            <div className="profile-request">
              {notifications.length === 0 ? (
                <div className="card-profile">
                  <p className="text-center">No notifications found.</p>
                </div>
              ) : (
                <div className="notification-list">
                  <div className="row">
                    <div className="card-profile d-flex flex-column gap-3">
                      {notifications.map((n, idx) => (
                        <div
                          key={idx}
                          className={`${
                            n.is_read ? "" : "unread-notification"
                          }`}
                          onClick={() => handleNotificationClick(n.id)}
                        >
                          <div className="d-flex justify-content-between">
                            <div className="profile-part-inbox">
                              <div title={`${n.is_read === 1? "" : "Mark as read" }`} className={`small-text ${n.is_read === 1?"":"fw-semibold"} cursor-pointer`}>
                                {n.message}
                              </div>
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              {new Date(n.created_at).toLocaleDateString()}{" "}
                              {new Date(n.created_at).toLocaleTimeString()}
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