import React, { useState, useRef, useEffect } from "react";
import { toast } from "../Common/Toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { getSocket, disconnectSocket } from "../../utils/socket";
import axios from "axios";
import config from "../../config";

const Header = ({ unreadNotificationCount }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(""); // manual active tab
  const helpRef = useRef(null);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  // console.log("UserInfo", user)
  const lookingFor = user?.looking_for;
  const searchFor = lookingFor === "Bride" ? "Groom" : "Bride";
  const [profiles, setProfiles] = useState([]);
 

  const handleLogout = () => {
    const socket = getSocket();
    if (socket && socket.connected) {
      const userId = user?.id || user?.user_id;
      if (userId) {
        socket.emit("userOffline", { userId });
      }
    }
    disconnectSocket();
    navigate("/login");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      dispatch(clearUser());
    }, 1000);
  };
  const fetchFilteredProfiles = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/matches/new-matches`,
        {
          params: {
            user_id: user.id,
            looking_for: searchFor,
          },
        }
      );
      setProfiles(response.data.users || []);
    } catch (error) {
      console.error("Error fetching profiles", error);
    }
  };

  useEffect(() => {
    if (searchFor) fetchFilteredProfiles();
  }, [searchFor]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg topbar dashboard">
      <div className="container-fluid px-4 px-md-4">
        <NavLink className="navbar-brand" to="/">
          <img src="/images/dashbard-logo.png" alt="Shaadi" className="brand-logo" />
        </NavLink>
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shaadiNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="shaadiNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3  text-start text-lg-center ">
            <li className="nav-item">
              <NavLink
                className="nav-link text-white"
                to="/dashboard"
                title="My Profile"
                onClick={() => setActiveTab("")}
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item position-relative">
              <NavLink
                className="nav-link text-white"
                to="/matches"
                title="View Matches"
                onClick={() => setActiveTab("")}
              >
                Matches
                <span className="badge bg-white text-dark rounded-pill position-absolute top-0 start-100 translate-middle">
                  {profiles.length}
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link text-white"
                to="/search-profile"
                title="Search Profiles"
                onClick={() => setActiveTab("")}
              >
                Search
              </NavLink>
            </li>
            <li className="nav-item position-relative">
              <NavLink
                className="nav-link text-white"
                to="/inbox"
                title="Inbox Messages"
                onClick={() => setActiveTab("")}
              >
                Inbox
                {unreadNotificationCount > 0 && (
                  <span className="badge bg-white text-dark rounded-pill position-absolute top-0 start-100 translate-middle">
                    {unreadNotificationCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li className="nav-item position-relative">
              <NavLink
                className="nav-link text-white"
                to="/identity-enrichment"
                title="Inbox Messages"
                onClick={() => setActiveTab("")}
              >
                Identity Enrichment
                {unreadNotificationCount > 0 && (
                  <span className="badge bg-white text-dark rounded-pill position-absolute top-0 start-100 translate-middle">
                    {unreadNotificationCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-1 ms-lg-3">
            <button className="btn btn-sm btn-outline-light btn-upgrade d-flex align-items-center gap-1" onClick={()=> navigate('/upgrade-profile')}>
              <i className="bi bi-gem"></i> {user.plan_name && user.plan_status === "active"? user.plan_name : "Upgrade Now"}
            </button>

            {/* Help Dropdown */}
            <div className="dropdown" ref={helpRef}>
              <button
                className="btn btn-link text-white text-decoration-none dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  setShowHelp(!showHelp);
                  setShowProfile(false);
                }}
              >
                Help
              </button>
              {showHelp && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li>
                    <NavLink className="dropdown-item" to="#">
                      FAQ
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="#">
                      Contact Support
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>

            <div className="v-divider d-none d-lg-block"></div>

            {/* Profile Dropdown */}
            <div className="dropdown" ref={profileRef}>
              <button
                className="btn btn-link d-flex align-items-center dropdown-toggle text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setShowProfile(!showProfile);
                  setShowHelp(false);
                }}
              >
                <img
                  src="/images/user.png"
                  className="rounded-circle"
                  alt="user"
                  height="32"
                />
              </button>
              {showProfile && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  <li><NavLink className="dropdown-item" to="/dashboard" state={{ activtab: "profile" }}>Profile</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/dashboard" state={{ activtab: "settings" }}>Settings</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;