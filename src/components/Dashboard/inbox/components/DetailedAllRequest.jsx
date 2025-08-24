import React, { useState } from "react";
import config from "../../../../config";
import { timeAgo, formatLastSeen } from "../../../../utils/timeAgo";
import { Link } from "react-router-dom";

function DetailedAllRequest({ receiverData, fetchReceiverData }) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2; // Show 2 requests per page
  console.log("receiverData", receiverData);

  // Calculate total pages
  const totalPages = Math.ceil(receiverData.length / itemsPerPage);

  // Get current page data
  const startIndex = currentPage * itemsPerPage;
  const currentReceivers = receiverData.slice(startIndex, startIndex + itemsPerPage);

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

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  function calculateAge(day, month, year) {
    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  const handleAccept = async (notificationId) => {
    try {
      const response = await fetch(`${config.baseURL}/api/inbox/accept/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Invitation accepted successfully!");
        await fetchReceiverData();
      } else {
        console.error(result.message || "Failed to accept invitation.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Something went wrong.");
    }
  };

  const handleReject = async (notificationId) => {
    try {
      const response = await fetch(`${config.baseURL}/api/inbox/deleted/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Invitation Deleted successfully!");
        await fetchReceiverData();
      } else {
        console.error(result.message || "Failed to delete invitation.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Something went wrong.");
    }
  };

  if (receiverData.length === 0) return (
    <div className="mt-2 filtred-out">
      <div className="profile-request">
        <div className="card-profile">
          <div className="Filtered-out">
            <img src="images/filtredout.jpg" alt="No invitations" />
            <h4>There is no invitations</h4>
            <Link to="/matches" className=" text-decoration-none" style={{ color: "#d61962" }}>View All
              Matches <i className="fa fa-angle-right" aria-hidden="true"></i></Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-request">
      {/* Render multiple requests */}
      {currentReceivers.map((currentReceiver) => (
        <div className="card-profile mb-3" key={currentReceiver.id}>
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
            <div className="col-md-7">
              <div className="d-flex justify-content-between">
                <div className="profile-part-inbox">
                  <div className="profile-nameinbox">
                    {currentReceiver.sender_first_name}{" "}
                    {currentReceiver.sender_last_name}
                  </div>
                  {currentReceiver.sender_online_status === "online" ? (
                    <div className="text-success mb-2" style={{ fontSize: "14px" }}>
                      <i className="bi bi-circle-fill" style={{ color: "green", fontSize: "10px" }}></i> Online now
                    </div>
                  ) : (
                    <div className="text-muted mb-2" style={{ fontSize: "14px" }}>
                      <i className="bi bi-clock"></i> Last seen {formatLastSeen(currentReceiver.sender_online_status)}
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
                {currentReceiver.sender_height} <br />
                {currentReceiver.community}, {currentReceiver.sender_religion}{" "}
                <br />
                {currentReceiver.sender_city}, {currentReceiver.sender_living_in}{" "}
                <br />
                {currentReceiver.sender_qualification} <br />
                {currentReceiver.sender_profession}
              </div>

              <div className="message-box mt-3">
                <div className="meesgae-envlope">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <strong>
                  <i className="fa fa-lock" aria-hidden="true"></i>{" "}
                  {currentReceiver.sender_first_name}{" "}
                  {currentReceiver.sender_last_name}
                </strong>{" "}
                has sent you a message. In the interest of our Premium Members, we
                allow only Premium users to read messages.
                <br />
                <a
                  href="#"
                  className="text-decoration-none"
                  style={{ color: "#d61962" }}
                >
                  Upgrade Now{" "}
                  <i className="fa fa-angle-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <div className="col-md-2 text-center connect-now">
              <div className="text-muted mb-2" style={{ fontSize: "11px" }}>
                {currentReceiver.sender_first_name} invited you to
                <br />
                Connect
              </div>
              <button className="accept-btn mb-3"
                onClick={() => handleAccept(currentReceiver.id)}
              >
                <img
                  src="images/checked.png"
                  alt="Check"
                  className="mb-2"
                  style={{ width: "40px" }}
                />
                <br />
                Accept
              </button>
              <button className="decline-btn"
                onClick={() => handleReject(currentReceiver.id)}
              >
                <img
                  src="images/decline.jpg"
                  alt="Decline"
                  className="mb-2"
                  style={{ width: "40px" }}
                />
                <br />
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-wrapper d-flex justify-content-center align-items-center mt-4">
          <button
            className="pagination-button me-2"
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            &larr; Prev
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pagination-page-button mx-1 ${currentPage === i ? 'active' : ''}`}
              onClick={() => goToPage(i)}
            >
              {i + 1}
            </button>
          ))}
          
          <span className="pagination-info mx-3">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, receiverData.length)} of {receiverData.length}
          </span>
          
          <button
            className="pagination-button ms-2"
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default DetailedAllRequest;