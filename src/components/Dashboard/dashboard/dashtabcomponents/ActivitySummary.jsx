import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaFilePdf, 
  FaFileCsv, 
  FaUpload, 
  FaTimes, 
  FaEye, 
  FaRobot,
  FaDna,
  FaChartBar,
  FaExclamationTriangle,
  FaHistory,
  FaUser,
  FaSync,
  FaDatabase
} from "react-icons/fa";
import { Button, ProgressBar, Card, Badge, Accordion, Alert } from 'react-bootstrap';
import config from '../../../../config';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import axios from 'axios';

const ActivitySummary = ({ notifications, onEditClick, userInfo, recentVisitors }) => {
  const { token, user } = useSelector(state => state.user);
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [userDna, setUserDna] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [geneticHistory, setGeneticHistory] = useState([]);
  const [dnaUploading, setDnaUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
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
    fetchParsedData();
    fetchGeneticHistory();
  }, [notifications, token]);

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
    }
  };

  const fetchParsedData = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.baseURL}/api/dna/parsed-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParsedData(response.data.data);
    } catch (error) {
      console.error('Error fetching parsed data:', error);
    }
  };

  const fetchGeneticHistory = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.baseURL}/api/dna/genetic-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneticHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching genetic history:', error);
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
      setParsedData(null); // Reset parsed data when new file uploaded
      
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
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.response?.data?.error || 'Failed to upload DNA report',
        confirmButtonColor: '#d33',
      });
    } finally {
      setDnaUploading(false);
      setUploadProgress(0);
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

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${config.baseURL}/api/dna`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDna(null);
      setParsedData(null);
      setGeneticHistory([]);
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'DNA report removed successfully!',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Error removing DNA report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Remove Failed',
        text: 'Failed to remove DNA report',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleParseDNA = async () => {
    if (!userDna || !token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in and ensure DNA file is uploaded.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      setParsing(true);
      Swal.fire({
        title: 'AI Analysis in Progress...',
        html: `
          <div style="text-align: center;">
            <div class="spinner-border text-primary mb-3"></div>
            <p>AI is analyzing your genetic data</p>
            <p><small>Extracting conditions, genes, and risk factors...</small></p>
          </div>
        `,
        allowOutsideClick: false,
        showConfirmButton: false
      });

      const response = await axios.post(
        `${config.baseURL}/api/dna/parse-pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();
      setParsedData(response.data.data);
      await fetchGeneticHistory(); // Refresh history
      
      const action = response.data.database_action === 'updated' ? 'Updated' : 'Created';
      
      Swal.fire({
        icon: 'success',
        title: `${action} Successfully!`,
        html: `
          <div style="text-align: left;">
            <p><strong>Genetic Report Analyzed Successfully</strong></p>
            <p>✅ ${action} genetic data for user</p>
            <p>🧬 Conditions Found: ${response.data.data.conditions_and_genes?.length || 0}</p>
            <p>📊 Risk Estimates: ${response.data.data.risk_estimates?.length || 0}</p>
            <p>👤 User ID: ${response.data.summary?.user_id}</p>
            <br>
            <p><small>Database Action: ${response.data.database_action}</small></p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
      });

      console.log('🎯 FULL PARSED GENETIC DATA:', response.data.data);
      
    } catch (error) {
      console.error('Error parsing DNA report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Analysis Failed',
        text: error.response?.data?.error || 'Failed to analyze DNA report',
        confirmButtonColor: '#d33',
      });
    } finally {
      setParsing(false);
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

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = userDna.originalName || 'dna_report';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error viewing DNA report:', error);
      Swal.fire({
        icon: 'error',
        title: 'View Failed',
        text: 'Failed to view DNA report',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleViewGeneticHistory = async () => {
    if (!token) return;

    try {
      await fetchGeneticHistory(); // Refresh data
      
      Swal.fire({
        title: 'Genetic Data History',
        html: `
          <div style="text-align: left; max-height: 400px; overflow-y: auto;">
            <p><strong>Total Versions:</strong> ${geneticHistory.length}</p>
            <div style="border: 1px solid #ddd; border-radius: 5px; padding: 10px;">
              ${geneticHistory.length === 0 ? 
                '<p style="text-align: center; color: #666;">No genetic data history found</p>' :
                geneticHistory.map((record, index) => `
                  <div style="border-bottom: ${index < geneticHistory.length - 1 ? '1px solid #eee' : 'none'}; padding: 10px 0;">
                    <strong>Version ${index + 1}</strong>
                    ${index === 0 ? ' <span style="background: #d4edda; color: #155724; padding: 2px 6px; border-radius: 3px; font-size: 0.8em;">Latest</span>' : ''}
                    <br>
                    <small><strong>Processed:</strong> ${new Date(record.processed_at).toLocaleString()}</small><br>
                    <small><strong>Updated:</strong> ${new Date(record.updated_at).toLocaleString()}</small>
                  </div>
                `).join('')
              }
            </div>
          </div>
        `,
        width: '600px',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Error fetching genetic history:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load history',
        text: 'Could not fetch genetic data history',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleDeleteGeneticData = async () => {
    if (!token) return;

    const result = await Swal.fire({
      title: 'Delete Genetic Data?',
      text: 'This will remove all your parsed genetic data but keep your DNA file. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete genetic data!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${config.baseURL}/api/dna/genetic-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setParsedData(null);
      setGeneticHistory([]);
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Genetic data deleted successfully',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error('Error deleting genetic data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete genetic data',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleRefreshData = async () => {
    await fetchParsedData();
    await fetchGeneticHistory();
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed!',
      text: 'Genetic data refreshed successfully',
      timer: 2000,
      showConfirmButton: false,
    });
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

  const GeneticDataSummary = () => {
    if (!parsedData) return null;

    const lastUpdated = parsedData.database_info?.updated_at 
      ? new Date(parsedData.database_info.updated_at).toLocaleString()
      : 'Unknown';

    return (
      <Card className="mt-3 border-primary">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <FaDna className="me-2" />
            AI Genetic Analysis Results
            {geneticHistory.length > 0 && (
              <Badge bg="light" text="dark" className="ms-2">
                v{geneticHistory.length}
              </Badge>
            )}
          </div>
          <div>
            <Button
              variant="outline-light"
              size="sm"
              className="me-1"
              onClick={handleRefreshData}
              title="Refresh Data"
            >
              <FaSync size={12} />
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              className="me-1"
              onClick={handleViewGeneticHistory}
              title="View History"
            >
              <FaHistory size={12} />
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Database Info Alert */}
          <Alert variant="info" className="py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <FaDatabase className="me-2" />
                <strong>User ID:</strong> {parsedData.user_info?.user_id} 
                <span className="ms-2">•</span>
                <strong className="ms-2">Last Updated:</strong> {lastUpdated}
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDeleteGeneticData}
              >
                <FaTimes className="me-1" />
                Clear Data
              </Button>
            </div>
          </Alert>

          <div className="row text-center mb-3">
            <div className="col-3">
              <div className="border rounded p-2">
                <h5 className="text-primary">{parsedData.conditions_and_genes?.length || 0}</h5>
                <small>Conditions</small>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <h5 className="text-success">{parsedData.genetic_markers?.length || 0}</h5>
                <small>Markers</small>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <h5 className="text-warning">{parsedData.risk_estimates?.length || 0}</h5>
                <small>Risk Factors</small>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <h5 className="text-info">{geneticHistory.length}</h5>
                <small>Versions</small>
              </div>
            </div>
          </div>

          {/* Carrier Summary */}
          {parsedData.carrier_summary && (
            <Alert variant={parsedData.carrier_summary.conditions_count > 0 ? 'warning' : 'success'}>
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="me-2" />
                <div>
                  <strong>{parsedData.carrier_summary.status}</strong>
                  <br />
                  <small>{parsedData.carrier_summary.recommendation}</small>
                </div>
              </div>
            </Alert>
          )}

          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FaChartBar className="me-2" />
                Key Conditions & Genes ({parsedData.conditions_and_genes?.length || 0})
              </Accordion.Header>
              <Accordion.Body>
                {parsedData.conditions_and_genes?.slice(0, 10).map((item, index) => (
                  <div key={index} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <strong>{item.condition}</strong>
                      <div>
                        <Badge bg="secondary" className="me-1">{item.gene}</Badge>
                        <Badge bg={item.significance === 'High' ? 'warning' : 'info'}>
                          {item.significance}
                        </Badge>
                        <Badge bg="dark" className="ms-1">{item.inheritance}</Badge>
                      </div>
                    </div>
                    {item.chance && (
                      <div className="text-danger small mt-1">
                        <strong>Risk:</strong> {item.chance}
                      </div>
                    )}
                    {item.risk_level && item.risk_level !== item.chance && (
                      <div className="text-muted small">
                        <strong>Level:</strong> {item.risk_level}
                      </div>
                    )}
                  </div>
                ))}
                {parsedData.conditions_and_genes?.length > 10 && (
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      ... and {parsedData.conditions_and_genes.length - 10} more conditions
                    </small>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>

            {parsedData.risk_estimates && parsedData.risk_estimates.length > 0 && (
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <FaExclamationTriangle className="me-2" />
                  Risk Estimates ({parsedData.risk_estimates.length})
                </Accordion.Header>
                <Accordion.Body>
                  {parsedData.risk_estimates.map((item, index) => (
                    <div key={index} className="border-bottom pb-2 mb-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>{item.condition}</strong>
                        <Badge bg="danger">{item.chance}</Badge>
                      </div>
                      <small className="text-muted">{item.risk_description}</small>
                      {item.gene && (
                        <div className="mt-1">
                          <Badge bg="outline-secondary">Gene: {item.gene}</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            )}

            {parsedData.partner_data && parsedData.partner_data.name && (
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  <FaUser className="me-2" />
                  Partner Information
                </Accordion.Header>
                <Accordion.Body>
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Name:</strong> {parsedData.partner_data.name}
                  </div>
                  {parsedData.partner_data.inheritance_patterns && parsedData.partner_data.inheritance_patterns.length > 0 && (
                    <div className="border-bottom pb-2 mb-2">
                      <strong>Inheritance Patterns:</strong>
                      <div className="mt-1">
                        {parsedData.partner_data.inheritance_patterns.map((pattern, index) => (
                          <Badge key={index} bg="outline-dark" className="me-1">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            )}

            {parsedData.test_information && (
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  <FaFilePdf className="me-2" />
                  Test Information
                </Accordion.Header>
                <Accordion.Body>
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Test Name:</strong> {parsedData.test_information.test_name}
                  </div>
                  <div className="border-bottom pb-2 mb-2">
                    <strong>Panel Size:</strong> {parsedData.test_information.panel_size}
                  </div>
                  <div>
                    <strong>Methodology:</strong> {parsedData.test_information.methodology}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>

          <div className="mt-3 d-flex justify-content-between">
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={() => console.log('Full Data:', parsedData)}
            >
              View Full Data in Console
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={handleParseDNA}
              disabled={parsing}
            >
              {parsing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Re-analyzing...
                </>
              ) : (
                <>
                  <FaRobot className="me-1" />
                  Re-analyze
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="card-lite p-3">
      <div className="dna_upload_section mt-4 mb-4">
        <h4>
          <FaDna className="me-2" />
          DNA Report Analysis
        </h4>

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
                  <div>
                    <div className="dna-filename">
                      {userDna.originalName || userDna.fileName || 'DNA Report'}
                    </div>
                    <small className="text-muted">
                      Uploaded {dayjs(userDna.uploadedAt).format('MMM D, YYYY')}
                      {userDna.fileSize && ` • ${formatFileSize(userDna.fileSize)}`}
                    </small>
                  </div>
                </div>
                <div className="dna-actions">
                  {userDna.originalName?.toLowerCase().endsWith('.pdf') && (
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={handleParseDNA}
                      disabled={parsing || !token}
                    >
                      {parsing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FaRobot className="me-1" />
                          AI Parse
                        </>
                      )}
                    </Button>
                  )}
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
                    Upload DNA Report
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

        {/* Genetic Data Summary */}
        <GeneticDataSummary />

        {/* No Data Message */}
        {userDna && !parsedData && (
          <Alert variant="info" className="mt-3">
            <div className="text-center">
              <FaDna size={24} className="mb-2" />
              <p>No genetic data analyzed yet. Click "AI Parse" to analyze your DNA report.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleParseDNA}
                disabled={parsing}
              >
                <FaRobot className="me-1" />
                Analyze with AI
              </Button>
            </div>
          </Alert>
        )}
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