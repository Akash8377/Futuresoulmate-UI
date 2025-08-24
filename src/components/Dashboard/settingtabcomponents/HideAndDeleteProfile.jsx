import React, { useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { clearUser } from '../../../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const HideAndDeleteProfile = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const fetchProfileStatus = async () => {
    try {
      const response = await axios.get(
        `${config.baseURL}/api/profile/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsProfileHidden(response.data.status === 'hidden');
    } catch (error) {
      console.error("Failed to load profile status:", error);
    }
  };

  const toggleSection = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchProfileStatus();
    }
  };

  const handleHideProfile = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: isProfileHidden 
        ? 'Your profile will become visible to others'
        : 'Your profile will be hidden from all users',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const newStatus = isProfileHidden ? 'active' : 'hidden';
        await axios.put(
          `${config.baseURL}/api/profile/hide`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsProfileHidden(!isProfileHidden);
        MySwal.fire(
          'Success!',
          `Profile has been ${isProfileHidden ? 'unhidden' : 'hidden'}`,
          'success'
        );
      } catch (error) {
        console.error('Error updating profile status:', error);
        MySwal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to update profile status',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProfile = async () => {
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'This will delete your profile permanently. You can recover it within 30 days.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      input: 'password',
      inputPlaceholder: 'Enter your password to confirm',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      preConfirm: (password) => {
        if (!password) {
          Swal.showValidationMessage('Password is required');
        }
      }
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(
          `${config.baseURL}/api/profile`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            data: { password: result.value }
          }
        );
        MySwal.fire(
          'Deleted!',
          'Your profile has been deleted. You can recover it within 30 days.',
          'success'
        );
        // Redirect to home or login page after deletion
        navigate("/login");
          setTimeout(() => {
            dispatch(clearUser());
          }, 1000);
      } catch (error) {
        console.error('Error deleting profile:', error);
        MySwal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to delete profile',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingEight">
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={toggleSection}
          disabled={loading}
        >
          Hide / Delete Profile
        </button>
      </h2>
      {isOpen && (
        <div id="collapseEight" className="accordion-collapse show">
          <div className="accordion-body">
            {/* Hide Section */}
            <div className="hide-profile-part">
              <div className="hide-profile-box">
                <h5>Hide Profile</h5>
                <p className="mb-1">
                  Your Profile is currently {isProfileHidden ? 'hidden' : 'visible'}
                  <span
                    className="float-end hide-link cursor-pointer text-primary"
                    onClick={handleHideProfile}
                    style={{ pointerEvents: loading ? 'none' : 'auto' }}
                  >
                    {isProfileHidden ? 'Unhide' : 'Hide'}
                  </span>
                </p>
                <small>
                  When you hide your Profile, you will not be visible on Shaadi.com. <br />
                  You will neither be able to send invitations or messages.
                </small>
              </div>
            </div>

            {/* Delete Section */}
            <div className="hide-profile-part mt-4">
              <div className="hide-profile-box">
                <h5>Delete Profile</h5>
                <p className="mb-1">
                  Delete your profile permanently
                  <span
                    className="float-end hide-link cursor-pointer text-danger"
                    onClick={handleDeleteProfile}
                    style={{ pointerEvents: loading ? 'none' : 'auto' }}
                  >
                    Delete
                  </span>
                </p>
                <small>
                  When you delete your Profile, you will not be visible on Shaadi.com. <br />
                  You can recover your profile within 30 days.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HideAndDeleteProfile;



// import React, { useState } from 'react';

// const HideAndDeleteProfile = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isProfileHidden, setIsProfileHidden] = useState(false);
//   const [isProfileDeleted, setIsProfileDeleted] = useState(false);

//   const handleToggleHide = () => {
//     setIsProfileHidden((prev) => !prev);
//     if (isProfileDeleted) setIsProfileDeleted(false);
//   };

//   return (
//     <div className="accordion-item">
//       <h2 className="accordion-header" id="headingEight">
//         <button
//           className="accordion-button collapsed"
//           type="button"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           Hide /Delete Profile
//         </button>
//       </h2>
//       {isOpen && (
//         <div id="collapseEight" className="accordion-collapse show">
//           <div className="accordion-body">
//             {/* Hide Section */}
//             <div className="hide-profile-part">
//               <div className="hide-profile-box">
//                 <h5>Hide Profile</h5>
//                 <p className="mb-1">
//                   Your Profile is currently {isProfileHidden ? 'hidden' : 'visible'}
//                   <span
//                     className="float-end hide-link cursor-pointer text-primary"
//                     onClick={handleToggleHide}
//                   >
//                     {isProfileHidden ? 'Unhide' : 'Hide'}
//                   </span>
//                 </p>
//                 <small>
//                   When you hide your Profile, you will not be visible on Shaadi.com. <br />
//                   You will neither be able to send invitations or messages.
//                 </small>
//               </div>
//             </div>

//             {/* Delete Section */}
//             <div className="hide-profile-part mt-4">
//               <div className="hide-profile-box">
//                 <h5>Delete Profile</h5>
//                 <p className="mb-1">
//                   Your Profile is currently {isProfileDeleted ? 'deleted' : 'visible'}
//                   <span
//                     className="float-end hide-link cursor-pointer text-danger"
//                     onClick={() =>{}}
//                   >
//                     Delete
//                   </span>
//                 </p>
//                 <small>
//                   When you Delete your Profile, you will not be visible on Shaadi.com. <br />
//                   You will neither be able to send invitations or messages.
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HideAndDeleteProfile;
