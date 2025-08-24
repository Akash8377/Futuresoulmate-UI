import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../features/user/userSlice';
import { toast } from '../../components/Common/Toast';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { getSocket, disconnectSocket } from "../../utils/socket";
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get user info directly from Redux store
  const { userInfo } = useSelector(state => state.user);
  const isLoggedIn = !!userInfo;
  const handleLogout = () => {

     const socket = getSocket()
        if (socket && socket.connected) {
          const userId = userInfo?.id || userInfo?.user_id; // fallback just in case
          socket.emit("userOffline", { userId });
        }
      disconnectSocket();
    dispatch(clearUser());
    setIsDropdownOpen(false);
    navigate("/");
    toast.success("Logged out successfully!");
  };
  const handleNavToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  // Enhanced CustomToggle with arrow indicators
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <button
        className="user-menu-button nav-link dropdown-toggle"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
          onClick(e);
        }}
      >
        <span className="user-greeting">
          {children}
          <span className="dropdown-arrow ms-1">
            {isOpen ? "▲" : "▼"}
          </span>
        </span>
      </button>
    );
  });

  return (
    <section className="header">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Link className="navbar-brand" to="/">
            <img src="images/logo.svg" alt="Site Logo" />
          </Link>
          
          <Navbar.Toggle 
            aria-controls="navbarSupportedContent" 
            onClick={handleNavToggle}
          >
            <span className="navbar-toggler-icon" />
          </Navbar.Toggle>
          
          <Navbar.Collapse id="navbarSupportedContent" className={!isNavCollapsed ? 'show' : ''}>
            <Nav className="ms-auto mb-2 mb-lg-0">
              <Nav.Item>
                <Link className="nav-link active" aria-current="page" to="#">
                  About Us
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link className="nav-link active" to="#">
                  Help
                </Link>
              </Nav.Item>
              
              {isLoggedIn ? (
                <Dropdown as={Nav.Item}>
                  <Dropdown.Toggle as={CustomToggle}>
                    Hi, {userInfo?.first_name || "User"}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/dashboard", { state: { activtab: "dash" } })}>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/dashboard", { state: { activtab: "settings" } })}>
                      Setting
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Item>
                  <Link to="/login">
                    <button className="btn btn-filled ms-4" type="button">
                      <img src="images/login-arrow.svg" className="me-1" alt="Login" />
                      Login
                    </button>
                  </Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </section>
  );
};

export default Header;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { clearUser } from '../../features/user/userSlice';
// import { toast } from '../../components/Common/Toast';

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isNavCollapsed, setIsNavCollapsed] = useState(true); // New state for navbar collapse
  
//   // Get user info directly from Redux store
//   const { userInfo } = useSelector(state => state.user);
//   const isLoggedIn = !!userInfo; // Simplified login check

//   const handleLogout = () => {
//     dispatch(clearUser());
//     setIsDropdownOpen(false);
//     navigate("/");
//     toast.success("Logged out successfully!");
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleNavToggle = () => {
//     setIsNavCollapsed(!isNavCollapsed);
//   };

//   return (
//     <section className="header">
//       <nav className="navbar navbar-expand-lg">
//         <div className="container">
//           <Link className="navbar-brand" to="/">
//             <img src="images/logo.svg" alt="Site Logo" />
//           </Link>
          
//           <button
//             className="navbar-toggler"
//             type="button"
//             onClick={handleNavToggle}
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded={!isNavCollapsed}
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon" />
//           </button>
          
//           <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link className="nav-link active" aria-current="page" to="#">
//                   About Us
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="#">
//                   Help
//                 </Link>
//               </li>
              
//               {isLoggedIn ? (
//                 <li className="nav-item dropdown">
//                   <button
//                     className="user-menu-button nav-link dropdown-toggle"
//                     onClick={toggleDropdown}
//                     aria-expanded={isDropdownOpen}
//                     id="userDropdown"
//                     data-bs-toggle="dropdown"
//                   >
//                     <span className="user-greeting">
//                       Hi, {userInfo?.first_name || "User"}{" "}
//                       <span className="dropdown-arrow">
//                         {isDropdownOpen ? "▲" : "▼"}
//                       </span>
//                     </span>
//                   </button>
                  
//                   <div
//                     className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
//                     aria-labelledby="userDropdown"
//                   >
//                     <button type="button" className="dropdown-item" onClick={()=>navigate("/dashboard")}>Dashboard</button>
//                     <hr className="dropdown-divider" />
//                     <button type="button" className="dropdown-item" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 </li>
//               ) : (
//                 <li>
//                   <Link to="/login">
//                     <button className="btn btn-filled" type="button">
//                       <img src="images/login-arrow.svg" alt="Login" />
//                       Login
//                     </button>
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </section>
//   );
// };  

// export default Header;