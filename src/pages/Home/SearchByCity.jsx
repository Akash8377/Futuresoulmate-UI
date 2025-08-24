// SearchByCity.jsx
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
    lookingFor: "Woman",
    minAge: 20,
    maxAge: 27,
    religion: "",
    motherTongue: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const numbers = Array.from({ length: 54 }, (_, i) => i + 20);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      const completeData = {
        ...searchData,
        ...formData,
      } 
      console.log("Form submitted:", completeData);
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
          buttons: false, // This hides all buttons
          timer: 2000,     // Optional: closes alert automatically after 2 seconds
        });
        setShowModal(false)
        navigate("/profile-upload");
      }
    } catch (err) {
      console.error("Registration error:", err.response.data.message);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      toast.error(err.response.data.message)
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
                <strong> Community </strong>
              </p>
            </div>
            <div className="col-md-8 form-blk">
              <form className="">
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">I'm looking for a</label>
                    <div className="select-control">
                      <select
                        className="form-control"
                        name="lookingFor"
                        value={searchData.lookingFor}
                        onChange={handleInputChange}
                      >
                        <option value="Bride">Woman</option>
                        <option value="Groom">Man</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">aged</label>
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
                      <label className="form-label">of religion</label>
                      <div className="select-control">
                        <select
                          className="form-control"
                          name="religion"
                          value={searchData.religion}
                          onChange={handleInputChange}
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
                      <label className="form-label">and mother tongue</label>
                      <div className="select-control">
                        <select
                          className="form-control"
                          name="motherTongue"
                          value={searchData.motherTongue}
                          onChange={handleInputChange}
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
                    setShowModal(true);
                  }}
                  disabled={!searchData.religion || !searchData.motherTongue}
                >
                  Let's Begin
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
      />
    </>
  );
};

export default SearchByCity;
