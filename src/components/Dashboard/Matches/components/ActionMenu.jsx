// components/ActionMenu.js
import React, { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ActionMenu = ({ profile, user, onBlock, onUnblock, onReport, isBlocked }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleReport = () => {
    setShowMenu(false);
    setShowReportModal(true);
  };

  const handleBlock = () => {
    setShowMenu(false);
    setShowBlockModal(true);
  };

  const submitReport = () => {
    if (reportReason.trim()) {
      onReport(profile.user_id, reportReason);
      setShowReportModal(false);
      setReportReason("");
    }
  };

  const confirmBlock = () => {
    onBlock(profile.user_id);
    setShowBlockModal(false);
  };

  const handleUnblock = () => {
    onUnblock(profile.user_id);
    setShowMenu(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="position-relative" ref={menuRef}>
        <button
          className="btn btn-sm btn-outline-secondary border-0"
          onClick={toggleMenu}
          style={{ background: "transparent" }}
        >
          <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
        </button>

        {showMenu && (
          <div className="position-absolute end-0 mt-1 bg-white shadow rounded border" style={{ zIndex: 1000, minWidth: "150px" }}>
            {isBlocked ? (
              <button
                className="btn btn-link text-danger d-block w-100 text-start px-3 py-2 text-decoration-none"
                onClick={handleUnblock}
              >
                <i className="fa fa-unlock me-2" aria-hidden="true"></i>
                Unblock
              </button>
            ) : (
              <>
                <button
                  className="btn btn-link text-danger d-block w-100 text-start px-3 py-2 text-decoration-none"
                  onClick={handleBlock}
                >
                  <i className="fa fa-ban me-2" aria-hidden="true"></i>
                  Block
                </button>
                <button
                  className="btn btn-link text-warning d-block w-100 text-start px-3 py-2 text-decoration-none"
                  onClick={handleReport}
                >
                  <i className="fa fa-flag me-2" aria-hidden="true"></i>
                  Report
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} style={{top:"20%"}}>
        <Modal.Header closeButton>
          <Modal.Title>Report User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Reporting: <strong>{profile.first_name} {profile.last_name}</strong></p>
          <Form.Group>
            <Form.Label>Reason for reporting:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you are reporting this profile..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={submitReport}>
            Submit Report
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Block Modal */}
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)} style={{top:"20%"}}>
        <Modal.Header closeButton>
          <Modal.Title>Block User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to block <strong>{profile.first_name} {profile.last_name}</strong>?</p>
          <p className="text-muted small">
            Blocked users won't be able to see your profile or contact you. You can unblock them anytime.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={confirmBlock}>
            Block User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ActionMenu;