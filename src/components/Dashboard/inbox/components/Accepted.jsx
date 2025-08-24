import React, { useEffect, useState } from "react";
import config from "../../../../config";
import SidebarFilterSort from "./SidebarFilterSort";
import { useSelector } from "react-redux";
import { timeAgo,formatLastSeen } from "../../../../utils/timeAgo";
import { Link } from "react-router-dom";
import ContactOptions from "../../Matches/components/ContactOptions"
function Accepted({chatBoxOpen,activeKey}) {
  const [receivers, setReceivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("allRequest");
  const [selectedSort, setSelectedSort] = useState("mostRelevant");

  const itemsPerPage = 2; // Changed from 1 to 2
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchAcceptedReceivers = async () => {
      try {
        const response = await fetch(`${config.baseURL}/api/inbox/accepted-receiver/${user.id}`);
        const data = await response.json();
        setReceivers(data);
      } catch (error) {
        console.error("Error fetching accepted receivers:", error);
      }
    };

    if (user?.id) {
      fetchAcceptedReceivers();
    }
  }, [user, activeKey]);

  const calculateAge = (day, month, year) => {
    const birthDate = new Date(year, month - 1, day);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const applyFilterAndSort = (data) => {
    let filtered = [...data];

    // Filter logic
    if (selectedFilter === "onlineNow") {
      filtered = filtered.filter((item) => item.sender_online_status === "online");
    } else if (selectedFilter === "withPhotos") {
      filtered = filtered.filter((item) => item.sender_profile_image);
    }

    // Sort logic
    if (selectedSort === "newestFirst") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (selectedSort === "olderFirst") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    return filtered;
  };

  const filteredReceivers = applyFilterAndSort(receivers);
  const totalPages = Math.ceil(filteredReceivers.length / itemsPerPage);
  const currentReceivers = filteredReceivers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="all-request-part">
      <div className="row">
        <div className="col-md-3">
          <SidebarFilterSort
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            namespace="accepted"
          />
        </div>

        <div className="col-md-9">
          <div className="tab-container">
            <div className="profile-request">
              {currentReceivers.length > 0 ? (
                <>
                  {currentReceivers.map((currentReceiver) => (
                    <div className="card-profile" key={currentReceiver.id}>
                      <div className="row">
                        <div className="col-md-3 text-center">
                          {currentReceiver.sender_profile_image ? (
                            <img
                              src={`${config.baseURL}/uploads/profiles/${currentReceiver.sender_profile_image}`}
                              className="profile-img"
                              alt="Profile"
                            />
                          ) : (
                            <a href="#" className="request-photo-inbox">
                              Request a Photo
                            </a>
                          )}
                        </div>

                        <div className="col-md-6">
                          <div className="d-flex justify-content-between">
                            <div className="profile-part-inbox">
                              <div className="profile-nameinbox">
                                {currentReceiver.sender_first_name}{" "}
                                {currentReceiver.sender_last_name}
                              </div>

                              {currentReceiver.sender_online_status === "online" ? (
                                <div className="text-success mb-2" style={{ fontSize: "14px" }}>
                                  <i className="bi bi-circle-fill" style={{ color: "green", fontSize: "10px" }}></i>{" "}
                                  Online now
                                </div>
                              ) : (
                                <div className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                  <i className="bi bi-clock"></i> Last seen{" "}
                                  {formatLastSeen(currentReceiver.sender_online_status)}
                                </div>
                              )}
                            </div>
                            <div className="text-muted" style={{ fontSize: "14px" }}>
                              {new Date(currentReceiver.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          <hr />
                          <div className="profile-info">
                            {calculateAge(
                              currentReceiver.sender_birth_day,
                              currentReceiver.sender_birth_month,
                              currentReceiver.sender_birth_year
                            )}{" "}
                            yrs, {currentReceiver.sender_height} <br />
                            {currentReceiver.community}, {currentReceiver.sender_religion} <br />
                            {currentReceiver.sender_city}, {currentReceiver.sender_living_in} <br />
                            {currentReceiver.sender_qualification} <br />
                            {currentReceiver.sender_profession}
                          </div>
                        </div>
                          <div className="col-md-3">
                            <ContactOptions profile={currentReceiver} chatBoxOpen={chatBoxOpen}/>
                          </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* <div className="viwed-application">
                    <img src="images/greencheck.png" alt="Green Check" />
                    <p>View All Accepted Invitations</p>
                  </div> */}
                  
                  {totalPages > 1 && (
                    <div className="pagination-wrapper">
                      <button className="pagination-button" onClick={handlePrev} disabled={currentPage === 0}>
                        &larr; Prev
                      </button>
                      <span className="pagination-info">
                        Showing {currentPage + 1} of {totalPages}
                      </span>
                      <button
                        className="pagination-button"
                        onClick={handleNext}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next &rarr;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="filtred-out">
                  <div className="profile-request">
                    <div className="card-profile">
                      <div className="Filtered-out">
                        <img src="images/filtredout.jpg"/>
                        <h4>No accepted request found.</h4>
                        <Link to="/matches" className="text-decoration-none" style={{color:"#d61962"}}>
                          View All Matches <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </Link>
                      </div>
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
}

export default Accepted;