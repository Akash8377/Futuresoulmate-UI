import React, { useState } from "react";
import { RELIGIONS, LANGUAGES } from "../../constants/formData";
import LetsBeginModal from "../../components/LetsBeginModal/LetsBeginModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { toast } from "../../components/Common/Toast";
import { setUser } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";
import swal from 'sweetalert';

const SearchByCity = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [searchData, setSearchData] = useState({
    gender: "",
    lookingFor: "",
    minAge: 20,
    maxAge: 27,
    religion: "",
    motherTongue: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const numbers = Array.from({ length: 54 }, (_, i) => i + 20);

  // Combined options for gender and preference
  const genderOptions = [
    { 
      value: "man_bride", 
      label: "I am a Man seeking a Woman",
      gender: "male",
      lookingFor: "Bride"
    },
    { 
      value: "woman_groom", 
      label: "I am a Woman seeking a Man",
      gender: "female",
      lookingFor: "Groom"
    },
    { 
      value: "man_groom", 
      label: "I am a Man seeking a Man",
      gender: "male",
      lookingFor: "Groom"
    },
    { 
      value: "woman_bride", 
      label: "I am a Woman seeking a Woman",
      gender: "female",
      lookingFor: "Bride"
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "genderLookingFor") {
      if (value === "") {
        // Reset values if default option is selected
        setSearchData({ 
          ...searchData, 
          gender: "",
          lookingFor: ""
        });
      } else {
        // Find the selected option
        const selectedOption = genderOptions.find(opt => opt.value === value);
        
        if (selectedOption) {
          console.log("Setting values:", {
            gender: selectedOption.gender,
            lookingFor: selectedOption.lookingFor
          });
          
          setSearchData({ 
            ...searchData, 
            gender: selectedOption.gender,
            lookingFor: selectedOption.lookingFor
          });
        }
      }
    } else {
      setSearchData({ ...searchData, [name]: value });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the complete data object with proper structure
      const completeData = {
        ...searchData,
        ...formData,
      };
      
      console.log("Submitting data:", completeData);
      
      const response = await axios.post(
        `${config.baseURL}/api/profile/register`,
        completeData
      );
      
      console.log("Registration successful:", response.data);
      
      if (response.data.success) {
        dispatch(
          setUser({
            userInfo: response.data.user,
            token: response.data.token,
          })
        );
        localStorage.setItem("authToken", response.data.token);
        
        await swal({
          title: "Success",
          text: "Registration successful! Your login details have been sent to your email.",
          icon: "success",
          buttons: false,
          timer: 2000,
        });
        
        setShowModal(false);
        navigate("/profile-upload");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          toast.error(error.msg);
        });
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section id="search-city" className="search-city">
        <div className="container">
          <div className="row g-0">
            <div className="col-md-4 content">
              <p className="">
                Search <br /> by <strong> City</strong>, Profession &amp; <br />{" "}
                <strong> Culture </strong>
              </p>
            </div>
            <div className="col-md-8 form-blk">
              <form className="">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">I'm Seeking for a</label>
                    <div className="select-control">
                      <select
                        className="form-control"
                        name="genderLookingFor"
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select your preference</option>
                        {genderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Debug info - shows current values */}
                    {/* <div style={{fontSize: '12px', marginTop: '5px', color: '#666'}}>
                      {searchData.gender && searchData.lookingFor ? (
                        `Selected: Gender=${searchData.gender}, LookingFor=${searchData.lookingFor}`
                      ) : (
                        "Please select a preference"
                      )}
                    </div> */}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Between Ages</label>
                    <div className="d-flex align-items-center gap-2">
                      <div className="select-control">
                        <select
                          className="form-control select-num"
                          name="minAge"
                          value={searchData.minAge}
                          onChange={handleInputChange}
                        >
                          {numbers.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="">to</div>
                      <div className="select-control">
                        <select
                          className="form-control select-num"
                          name="maxAge"
                          value={searchData.maxAge}
                          onChange={handleInputChange}
                        >
                          {numbers.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">of Religion</label>
                      <div className="select-control">
                        <select
                          className="form-control"
                          name="religion"
                          value={searchData.religion}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select</option>
                          {RELIGIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">and Languages Spoken</label>
                      <div className="select-control">
                        <select
                          className="form-control"
                          name="motherTongue"
                          value={searchData.motherTongue}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select</option>
                          {LANGUAGES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-filled2"
                  type="button"
                  onClick={() => {
                    // Check if gender and lookingFor are set before opening modal
                    if (!searchData.gender || !searchData.lookingFor) {
                      toast.error("Please select your gender preference");
                      return;
                    }
                    setShowModal(true);
                  }}
                  disabled={!searchData.gender || !searchData.lookingFor || !searchData.religion || !searchData.motherTongue}
                >
                  {isLoading ? "Processing..." : "Let's Begin"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <LetsBeginModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default SearchByCity;