import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PrivacyPolicy = () => {
  return (
    <>
    <Header/>
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Future Soulmate</h1>
            <h2 className="h3 text-muted">Privacy Policy</h2>
            <div className="alert alert-info">
              <i className="bi bi-shield-check me-2"></i>
              Your privacy is our priority. We are committed to protecting your personal information.
            </div>
          </div>

          {/* Introduction */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">1. Introduction</h3>
              <p>
                At Future Soulmate, we understand that privacy is important when looking for your perfect match. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you use our matchmaking services.
              </p>
              <p className="mb-0">
                By using Future Soulmate, you consent to the data practices described in this policy. 
                If you do not agree with the terms, please do not access or use our services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">2. Information We Collect</h3>
              
              <h5 className="h6 text-muted mt-3">Personal Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  <ul>
                    <li>Name and contact details</li>
                    <li>Date of birth and gender</li>
                    <li>Profile information and photos</li>
                    <li>Relationship preferences</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li>Payment information</li>
                    <li>Communication preferences</li>
                    <li>Social media connections (optional)</li>
                    <li>Location data</li>
                  </ul>
                </div>
              </div>

              <h5 className="h6 text-muted mt-3">Automatically Collected Information</h5>
              <ul>
                <li>Device information and IP address</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and tracking technologies</li>
              </ul>

              <h5 className="h6 text-muted mt-3">Sensitive Information</h5>
              <div className="alert alert-warning">
                <strong>Note:</strong> We may collect sensitive information such as religious beliefs, 
                political opinions, or health information only when you voluntarily provide it for 
                compatibility matching purposes. You have full control over what sensitive information you share.
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">3. How We Use Your Information</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex mb-3">
                    <i className="bi bi-heart-fill text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Matchmaking</strong>
                      <p className="mb-0 small">To find compatible partners based on your preferences</p>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <i className="bi bi-chat-dots-fill text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Communication</strong>
                      <p className="mb-0 small">To facilitate messaging between matches</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <i className="bi bi-shield-fill text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Security</strong>
                      <p className="mb-0 small">To protect against fraud and abuse</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex mb-3">
                    <i className="bi bi-graph-up text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Improvement</strong>
                      <p className="mb-0 small">To enhance our matching algorithms</p>
                    </div>
                  </div>
                  <div className="d-flex mb-3">
                    <i className="bi bi-bell-fill text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Notifications</strong>
                      <p className="mb-0 small">To send relevant updates and matches</p>
                    </div>
                  </div>
                  <div className="d-flex">
                    <i className="bi bi-credit-card text-primary me-3 fs-5"></i>
                    <div>
                      <strong>Billing</strong>
                      <p className="mb-0 small">To process subscription payments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">4. Information Sharing</h3>
              <p>We may share your information in the following circumstances:</p>
              
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Information Shared</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>With Your Matches</td>
                      <td>Profile information, photos, basic details</td>
                    </tr>
                    <tr>
                      <td>Service Providers</td>
                      <td>Necessary data for payment processing, hosting, etc.</td>
                    </tr>
                    <tr>
                      <td>Legal Requirements</td>
                      <td>When required by law or to protect our rights</td>
                    </tr>
                    <tr>
                      <td>Business Transfers</td>
                      <td>In case of merger, acquisition, or sale</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-success">
                <strong>We do NOT sell your personal information to third parties for marketing purposes.</strong>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">5. Data Security</h3>
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information, including:
              </p>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3">
                    <i className="bi bi-lock-fill text-success fs-1"></i>
                    <h6 className="mt-2">Encryption</h6>
                    <p className="small mb-0">All data is encrypted in transit and at rest</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3">
                    <i className="bi bi-shield-check text-success fs-1"></i>
                    <h6 className="mt-2">Access Controls</h6>
                    <p className="small mb-0">Strict access limitations to personal data</p>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3">
                    <i className="bi bi-eye-slash text-success fs-1"></i>
                    <h6 className="mt-2">Anonymization</h6>
                    <p className="small mb-0">Data anonymized for analytics purposes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">6. Your Rights</h3>
              <p>You have the following rights regarding your personal data:</p>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Access:</strong> View your personal data
                    </li>
                    <li className="list-group-item">
                      <strong>Correction:</strong> Update inaccurate information
                    </li>
                    <li className="list-group-item">
                      <strong>Deletion:</strong> Request account deletion
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Export:</strong> Download your data
                    </li>
                    <li className="list-group-item">
                      <strong>Objection:</strong> Opt-out of certain processing
                    </li>
                    <li className="list-group-item">
                      <strong>Restriction:</strong> Limit how we use your data
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-3">
                <p>
                  To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@futuresoulmate.com">privacy@futuresoulmate.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">7. Data Retention</h3>
              <p>We retain your personal data only as long as necessary for:</p>
              <ul>
                <li>Providing our services to you</li>
                <li>Compliance with legal obligations</li>
                <li>Resolving disputes and enforcing agreements</li>
                <li>Legitimate business purposes</li>
              </ul>
              <p className="mb-0">
                Upon account deletion, we will remove your personal data within 30 days, except where 
                required to retain it by law.
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="alert alert-info mt-4">
            <h5 className="alert-heading">Policy Updates</h5>
            <p className="mb-0">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;