import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaFilePdf, FaFileCsv, FaUpload, FaTimes, FaEye } from "react-icons/fa";
import { Button, ProgressBar } from 'react-bootstrap';
import config from '../../../../config';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import axios from 'axios';

const ActivitySummary = ({ notifications, onEditClick, userInfo, recentVisitors }) => {
  const { token } = useSelector(state => state.user);
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [userDna, setUserDna] = useState(null);
  const [dnaUploading, setDnaUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dnaRef = useRef(null);

  useEffect(() => {
    if (notifications.length) {
      const pendingNotifications = notifications.filter(n => 
        n.status === 'pending' || n.status === 'sent'
      );
      const acceptedNotifications = notifications.filter(n => 
        n.status === 'accepted'
      );
      setPending(pendingNotifications);
      setAccepted(acceptedNotifications);
    }
    fetchUserDna();
  }, [notifications, token]); // Added token to dependencies

  const fetchUserDna = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    try {
      const response = await axios.get(`${config.baseURL}/api/dna`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDna(response.data.file);
    } catch (error) {
      console.error('Error fetching DNA file:', error);
      if (error.response?.status === 401) {
        console.error('Token expired or invalid');
      }
    }
  };

  const handleDnaInputClick = () => {
    dnaRef.current?.click();
  };

  const handleDnaUpload = async (event) => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in again.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    
    if (!isPdf && !isCsv) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select a PDF or CSV file',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 5MB',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const formData = new FormData();
    formData.append('dnaFile', file);

    try {
      setDnaUploading(true);
      setUploadProgress(0);

      const response = await axios.post(`${config.baseURL}/api/dna/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUserDna(response.data.file);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'DNA report uploaded successfully!',
        confirmButtonColor: '#3085d6',
        timer: 3000,
        showConfirmButton: true,
      });
    } catch (error) {
      console.error('Error uploading DNA report:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#d33',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: error.response?.data?.error || 'Failed to upload DNA report',
          confirmButtonColor: '#d33',
        });
      }
    } finally {
      setDnaUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (dnaRef.current) dnaRef.current.value = '';
    }
  };

  const handleRemoveDna = async () => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in again.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to remove your DNA report. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${config.baseURL}/api/dna`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDna(null);
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'DNA report removed successfully!',
        confirmButtonColor: '#3085d6',
        timer: 3000,
        showConfirmButton: true,
      });
    } catch (error) {
      console.error('Error removing DNA report:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#d33',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Remove Failed',
          text: 'Failed to remove DNA report',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleViewDna = async () => {
    if (!userDna) return;
    
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in again.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      const response = await axios.get(`${config.baseURL}/api/dna/view`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create blob URL and open in new tab
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to handle the download/view
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = userDna.originalName || 'dna_report';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error viewing DNA report:', error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#d33',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'View Failed',
          text: 'Failed to view DNA report',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().endsWith('.pdf')) {
      return <FaFilePdf size={24} className="text-danger me-2" />;
    } else if (fileName?.toLowerCase().endsWith('.csv')) {
      return <FaFileCsv size={24} className="text-success me-2" />;
    }
    return <FaFilePdf size={24} className="text-primary me-2" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card-lite p-3">
      <div className="dna_upload_section mt-4 mb-8">
        <h4>Upload Your DNA Report</h4>

        <div className="dna_upload_wrapper">
          <input
            type="file"
            id="dnaUpload"
            style={{ display: 'none' }}
            accept=".pdf,.csv"
            ref={dnaRef}
            onChange={handleDnaUpload}
            disabled={dnaUploading || !token}
          />

          {userDna ? (
            <div className="dna_uploaded">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  {getFileIcon(userDna.originalName)}
                  <span className="dna-filename">
                    {userDna.originalName || userDna.fileName || 'DNA Report'}
                  </span>
                </div>
                <div className="dna-actions">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={handleDnaInputClick}
                    disabled={dnaUploading || !token}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={handleViewDna}
                    disabled={dnaUploading || !token}
                  >
                    <FaEye className="me-1" />
                    View
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveDna}
                    disabled={dnaUploading || !token}
                  >
                    <FaTimes />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Uploaded on {dayjs(userDna.uploadedAt).format('MMM D, YYYY')}
                  {userDna.fileSize && ` • ${formatFileSize(userDna.fileSize)}`}
                </small>
              </div>
            </div>
          ) : (
            <>
              <label 
                htmlFor="dnaUpload" 
                className={`btn btn-outline-primary ${dnaUploading || !token ? 'disabled' : ''}`}
              >
                {dnaUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="me-2" />
                    Upload DNA
                  </>
                )}
              </label>
              <div className="mt-2">
                <small className="text-muted">Supported formats: PDF, CSV (Max 5MB)</small>
                {!token && (
                  <div className="text-warning small mt-1">
                    Authentication required
                  </div>
                )}
              </div>
            </>
          )}

          {dnaUploading && (
            <div className="mt-2">
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="w-100"
              />
            </div>
          )}
        </div>
      </div>

      <h6>Your Activity Summary</h6>
      
      <ActivityTable 
        data={[
          { value: pending?.length || 0, label: 'Pending Invitations' },
          { value: accepted?.length || 0, label: 'Accepted Invitations' },
          { value: recentVisitors?.length , label: 'Recent Visitors', badge: 'NEW' }
        ]}
      />

      <ActivityTable 
        data={[
          { value: 0, label: 'Contacts Viewed' },
          { value: 0, label: 'Chats initiated' },
          { 
            customContent: userInfo?.plan_status !== "active" && (
              <>
                <span className="text-primary fw-semibold">Only Premium Members</span> can avail these benefits{' '}
                <i className="fa fa-lock" aria-hidden="true" style={{ color: '#d61962' }}></i>
              </>
            )
          }
        ]}
      />

      <hr />
      <p className="small mb-0 cursor-pointer" onClick={onEditClick}>
        <strong>Complete Profile</strong>
      </p>
    </div>
  );
};

const ActivityTable = ({ data }) => (
  <table className="w-100 text-center act-table mb-2">
    <tbody>
      <tr className="head">
        {data.map((item, index) => (
          <td key={index} style={{ width: '33.33%' }}>
            {item.customContent || (
              <>
                {item.value}
                {item.badge && (
                  <span className="badge align-top small" style={{ backgroundColor: '#cef8e5' }}>
                    {item.badge}
                  </span>
                )}
                <br />
                <span className="fw-normal text-muted small">{item.label}</span>
              </>
            )}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

export default ActivitySummary;