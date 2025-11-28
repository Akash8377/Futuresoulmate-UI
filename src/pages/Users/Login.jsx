import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import config from '../../config';
import { connectSocket } from '../../utils/socket';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleRecoverAccount = async () => {
  try {
    setIsSubmitting(true);
    const response = await axios.post(`${config.baseURL}/api/auth/recover`, {
      email: formData.email,
      password: formData.password
    });

    if (response.data.success) {
      await Swal.fire({
        title: "Account Recovered",
        text: "Your account has been successfully recovered. Please login again.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000
      });
    }
  } catch (error) {
    await Swal.fire({
      title: "Recovery Failed",
      text: error.response?.data?.message || "Could not recover account",
      icon: "error",
      showConfirmButton: false,
      timer: 2000
    });
  } finally {
    setIsSubmitting(false);
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await axios.post(`${config.baseURL}/api/auth/login`, {
      email: formData.email,
      password: formData.password,
    });

    if (response.data.success) {
      const { token, user } = response.data;
      
      // Validate token exists and is properly formatted
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received from server');
      }

      // Store token securely
      if (formData.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userInfo', JSON.stringify(user));
      }

      dispatch(setUser({
        userInfo: user,
        token: token,
        rememberMe: formData.rememberMe
      }));

      connectSocket(token);
      
      await Swal.fire({
        title: "Success",
        text: "Logged in successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000
      });

      navigate('/dashboard');
    }
  } catch (error) {
    if (error.response?.status === 403 && error.response.data.recoverable) {
      const result = await Swal.fire({
        title: "Account Deleted",
        text: "Your account was deleted but can be recovered within 30 days. Would you like to recover it now?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Recover",
        cancelButtonColor: "#aaa",
        confirmButtonColor: "#d61962",
      });

      if (result.isConfirmed) {
        await handleRecoverAccount();
      }
    } else if (error.response?.status === 401) {
      await Swal.fire({
        title: "Unauthorized",
        text: "Invalid email or password.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      await Swal.fire({
        title: "Login Failed",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <section className="login-part">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="login-img">
                <img src="images/futurelogin.png" alt="Login visual" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="login-box">
                <div className="login-title">Existing Member? Login</div>
                {errors.form && (
                  <div className="alert alert-danger" style={{ marginBottom: '15px' }}>
                    {errors.form}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group email-box">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter E-Mail ID"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && (
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="form-group password-box">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'is-invalid' : ''}
                    />
                    <span
                      className="toggle-eye"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </span>
                    {errors.password && (
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="keepLoggedIn"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="keepLoggedIn">Keep me logged in</label>
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                  </button>
                  <div className="helper-links">
                    Trouble logging in?
                    <br />
                    <Link to="/#search-city" state={{signUp:true}}>Sign Up</Link> |{' '}
                    <Link to="/forget-password" className="forget-password">
                      Forgot password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../features/user/userSlice';
// import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';
// import config from '../../config';

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// const handleRecoverAccount = async () => {
//   try {
//     setIsSubmitting(true);
//     const response = await axios.post(`${config.baseURL}/api/auth/recover`, {
//       email: formData.email,
//       password: formData.password
//     });

//     if (response.data.success) {
//       await Swal.fire({
//         title: "Account Recovered",
//         text: "Your account has been successfully recovered. Please login again.",
//         icon: "success",
//         showConfirmButton: false,
//         timer: 2000
//       });
//     }
//   } catch (error) {
//     await Swal.fire({
//       title: "Recovery Failed",
//       text: error.response?.data?.message || "Could not recover account",
//       icon: "error",
//       showConfirmButton: false,
//       timer: 2000
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setIsSubmitting(true);

//   try {
//     const response = await axios.post(`${config.baseURL}/api/auth/login`, {
//       email: formData.email,
//       password: formData.password,
//     });

//     if (response.data.success) {
//       dispatch(setUser({
//         userInfo: response.data.user,
//         token: response.data.token,
//         rememberMe: formData.rememberMe
//       }));

//       await Swal.fire({
//         title: "Success",
//         text: "Logged in successfully!",
//         icon: "success",
//         showConfirmButton: false,
//         timer: 2000
//       });

//       navigate('/dashboard');
//     }
//   } catch (error) {
//     if (error.response?.status === 403 && error.response.data.recoverable) {
//       const result = await Swal.fire({
//         title: "Account Deleted",
//         text: "Your account was deleted but can be recovered within 30 days. Would you like to recover it now?",
//         icon: "warning",
//         showCancelButton: true,
//         cancelButtonText: "Cancel",
//         confirmButtonText: "Recover",
//         cancelButtonColor: "#aaa",
//         confirmButtonColor: "#d61962",  // Custom Recover button color
//       });

//       if (result.isConfirmed) {
//         await handleRecoverAccount();
//       }

//     } else if (error.response?.status === 401) {
//       await Swal.fire({
//         title: "Unauthorized",
//         text: "Invalid email or password.",
//         icon: "error",
//         showConfirmButton: false,
//         timer: 2000
//       });
//     } else {
//       await Swal.fire({
//         title: "Login Failed",
//         text: "Something went wrong. Please try again.",
//         icon: "error",
//         showConfirmButton: false,
//         timer: 2000
//       });
//     }
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>
//       <Header />
//       <section className="login-part">
//         <div className="container">
//           <div className="row">
//             <div className="col-md-6">
//               <div className="login-img">
//                 <img src="images/futurelogin.png" alt="Login visual" />
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="login-box">
//                 <div className="login-title">Existing Member? Login</div>
//                 {errors.form && (
//                   <div className="alert alert-danger" style={{ marginBottom: '15px' }}>
//                     {errors.form}
//                   </div>
//                 )}
//                 <form onSubmit={handleSubmit}>
//                   <div className="form-group email-box">
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Enter E-Mail ID"
//                       value={formData.email}
//                       onChange={handleChange}
//                       className={`${errors.email ? 'is-invalid' : ''}`}
//                     />
//                     {errors.email && (
//                       <div className="invalid-feedback" style={{ display: 'block' }}>
//                         {errors.email}
//                       </div>
//                     )}
//                   </div>
//                   <div className="form-group password-box">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       placeholder="Enter Password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className={errors.password ? 'is-invalid' : ''}
//                     />
//                     <span
//                       className="toggle-eye"
//                       onClick={togglePasswordVisibility}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       {showPassword ? '👁️' : '👁️‍🗨️'}
//                     </span>
//                     {errors.password && (
//                       <div className="invalid-feedback" style={{ display: 'block' }}>
//                         {errors.password}
//                       </div>
//                     )}
//                   </div>
//                   <div className="checkbox">
//                     <input
//                       type="checkbox"
//                       id="keepLoggedIn"
//                       name="rememberMe"
//                       checked={formData.rememberMe}
//                       onChange={handleChange}
//                     />
//                     <label htmlFor="keepLoggedIn">Keep me logged in</label>
//                   </div>
//                   <button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
//                   </button>
//                   <div className="helper-links">
//                     Trouble logging in?
//                     <br />
//                     <Link to="/#search-city" state={{signUp:true}}>Sign Up</Link> |{' '}
//                     <Link to="/forget-password" className="forget-password">
//                       Forgot password?
//                     </Link>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// };

// export default Login;