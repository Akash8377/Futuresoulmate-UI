import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const DeleteSocialInstruction = () => {
  return (
    <>
    <Header/>
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Future Soulmate</h1>
            <h2 className="h3 text-muted">Social Account Disconnection Guide</h2>
            <p className="lead text-muted">How to manage your connected social accounts</p>
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Follow these instructions to safely disconnect your social media accounts from Future Soulmate
            </div>
          </div>

          {/* Introduction */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">Why Disconnect Social Accounts?</h3>
              <p>
                You may want to disconnect your social accounts from Future Soulmate for various reasons:
              </p>
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    <li>Enhanced privacy control</li>
                    <li>Reducing digital footprint</li>
                    <li>Account security concerns</li>
                    <li>Changing social media preferences</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li>Closing social media accounts</li>
                    <li>Minimizing app permissions</li>
                    <li>Personal preference</li>
                    <li>Account consolidation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-4">Step-by-Step Disconnection Guide</h3>
              
              {/* Step 1 */}
              <div className="row mb-4">
                <div className="col-md-2 text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="h4 mb-0">1</span>
                  </div>
                </div>
                <div className="col-md-10">
                  <h5>Access Your Future Soulmate Settings</h5>
                  <p className="mb-2">Navigate to your account settings within the Future Soulmate app or website:</p>
                  <ul>
                    <li>Click on your profile picture in the top right corner</li>
                    <li>Select "Settings" from the dropdown menu</li>
                    <li>Go to "Connected Accounts" or "Social Connections"</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="row mb-4">
                <div className="col-md-2 text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="h4 mb-0">2</span>
                  </div>
                </div>
                <div className="col-md-10">
                  <h5>Review Connected Accounts</h5>
                  <p className="mb-2">You'll see a list of all social media accounts currently connected to your Future Soulmate profile:</p>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-facebook text-primary me-2"></i>
                        <span>Facebook</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-instagram text-danger me-2"></i>
                        <span>Instagram</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-spotify text-success me-2"></i>
                        <span>Spotify</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-linkedin text-primary me-2"></i>
                        <span>LinkedIn</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="row mb-4">
                <div className="col-md-2 text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="h4 mb-0">3</span>
                  </div>
                </div>
                <div className="col-md-10">
                  <h5>Disconnect Individual Accounts</h5>
                  <p className="mb-2">For each account you wish to disconnect:</p>
                  <ul>
                    <li>Click the "Disconnect" or "Remove" button next to the social platform</li>
                    <li>Confirm your decision in the pop-up window</li>
                    <li>Wait for the confirmation message</li>
                  </ul>
                  <div className="alert alert-info">
                    <strong>Note:</strong> Disconnecting social accounts will not delete your Future Soulmate profile. 
                    Only the connection and imported data from that platform will be removed.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="row mb-4">
                <div className="col-md-2 text-center">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                    <span className="h4 mb-0">4</span>
                  </div>
                </div>
                <div className="col-md-10">
                  <h5>Verify Disconnection</h5>
                  <p className="mb-2">After disconnecting, verify that:</p>
                  <ul>
                    <li>The social platform no longer appears in your connected accounts list</li>
                    <li>Any imported data (photos, interests) from that platform is removed from your profile</li>
                    <li>You receive a confirmation email from Future Soulmate (if enabled)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Platform-Specific Instructions */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-4">Platform-Specific Instructions</h3>
              
              {/* Facebook */}
              <div className="mb-4">
                <h5 className="text-primary">
                  <i className="bi bi-facebook me-2"></i>
                  Facebook
                </h5>
                <p>To completely remove Future Soulmate access from Facebook:</p>
                <ol>
                  <li>Log into your Facebook account</li>
                  <li>Go to Settings & Privacy → Settings</li>
                  <li>Click "Apps and Websites" in the left menu</li>
                  <li>Find "Future Soulmate" in the active apps list</li>
                  <li>Click "Remove" and confirm</li>
                </ol>
              </div>

              {/* Instagram */}
              <div className="mb-4">
                <h5 className="text-danger">
                  <i className="bi bi-instagram me-2"></i>
                  Instagram
                </h5>
                <p>To manage Instagram connections:</p>
                <ol>
                  <li>Open Instagram and go to your profile</li>
                  <li>Tap the menu (three lines) and select "Settings"</li>
                  <li>Go to "Security" → "Apps and Websites"</li>
                  <li>Find "Future Soulmate" and tap "Remove"</li>
                  <li>Confirm the disconnection</li>
                </ol>
              </div>

              {/* Spotify */}
              <div>
                <h5 className="text-primary">
                  <i className="bi bi-spotify me-2"></i>
                  LinkedIn
                </h5>
                <p>To manage LinkedIn app connections:</p>
                <ol>
                  <li>Log into your LinkedIn account on the web</li>
                  <li>Go to your Account page</li>
                  <li>Click "Apps" in the left menu</li>
                  <li>Find "Future Soulmate" and click "Remove Access"</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Data Impact */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">What Happens After Disconnection?</h3>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Data Type</th>
                      <th>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Imported Photos</td>
                      <td>Photos imported from social media will be removed from your profile</td>
                    </tr>
                    <tr>
                      <td>Profile Information</td>
                      <td>Information synced from social accounts will be deleted</td>
                    </tr>
                    <tr>
                      <td>Friends/Connections</td>
                      <td>Mutual friend information will no longer be available</td>
                    </tr>
                    <tr>
                      <td>Login Method</td>
                      <td>You'll need to use email/password to log in if social login was your only method</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="alert alert-warning">
                <strong>Important:</strong> We recommend setting up an email and password login method 
                before disconnecting all social accounts to ensure you don't lose access to your Future Soulmate profile.
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary mb-3">Troubleshooting Common Issues</h3>
              
              <div className="accordion" id="troubleshootingAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#issue1">
                      "Disconnect" button is grayed out
                    </button>
                  </h2>
                  <div id="issue1" className="accordion-collapse collapse show" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      This usually happens when social login is your only authentication method. 
                      Please set up email/password login first in your security settings.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#issue2">
                      Social account still shows as connected
                    </button>
                  </h2>
                  <div id="issue2" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      Try refreshing the page or logging out and back into your Future Soulmate account. 
                      If the issue persists, disconnect from the social platform's side as well.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#issue3">
                      Lost access after disconnecting
                    </button>
                  </h2>
                  <div id="issue3" className="accordion-collapse collapse" data-bs-parent="#troubleshootingAccordion">
                    <div className="accordion-body">
                      Use the "Forgot Password" feature with your registered email address to regain access. 
                      Contact support if you need assistance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default DeleteSocialInstruction;