import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className='suuces-payment'>
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row justify-content-center py-5">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0">
            <div className="card-body p-2 text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    fill="white" 
                    className="bi bi-check-circle" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 6.03a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 9.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.492-4.387z"/>
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h2 className="card-title mb-3">
                Payment Successful!
              </h2>
              
              <p className="card-text mb-4">
                Thank you for upgrading your profile. Your subscription has been activated successfully.
              </p>

              {sessionId && (
                <div className="alert alert-successname mb-4 text-start">
                  <h6 className="alert-heading">Reference ID</h6>
                  <p className="mb-0">{sessionId}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Link 
                  to="/dashboard" 
                  className="btn py-2"
                  style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-secondary)', color: 'white' }}
                >
                  Go to Dashboard
                </Link>
                
                <Link 
                  to="/matches" 
                  className="btn btn-outline-btn py-2"
                >
                  Find Matches
                </Link>
                
                <Link 
                  to="/" 
                  className="btn btn-link return-home"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PaymentSuccess;
