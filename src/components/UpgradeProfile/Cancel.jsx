import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row justify-content-center py-5">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0">
            <div className="card-body p-5 text-center">
              {/* Cancel Icon */}
              <div className="mb-4">
                <div 
                  className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    fill="white" 
                    className="bi bi-x-circle" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </div>
              </div>

              {/* Cancel Message */}
              <h2 className="card-title mb-3" style={{ color: 'var(--color-secondary)' }}>
                Payment Cancelled
              </h2>
              
              <p className="card-text mb-4">
                Your payment was not completed. No charges have been made to your account.
              </p>

              <div className="alert alert-warning mb-4 text-start">
                <h6 className="alert-heading">No worries!</h6>
                <p className="mb-0">
                  You can upgrade your profile anytime from your dashboard to access premium features.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Link 
                  to="/upgrade-profile" 
                  className="btn py-2"
                  style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', color: 'white' }}
                >
                  Try Again
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className="btn btn-outline-secondary py-2"
                >
                  Return to Dashboard
                </Link>
                
                <Link 
                  to="/search-profile" 
                  className="btn btn-link text-muted"
                >
                  Continue with free features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;