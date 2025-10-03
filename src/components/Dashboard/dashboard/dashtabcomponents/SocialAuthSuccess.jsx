import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SocialAuthSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log('SocialAuthSuccess component mounted');
    
    const platform = searchParams.get('social_connected');
    const error = searchParams.get('error');

    console.log('Platform:', platform);
    console.log('Error:', error);

    if (window.opener) {
      if (platform) {
        console.log('Sending SUCCESS message to opener');
        try {
          window.opener.postMessage({
            type: 'SOCIAL_CONNECTION_SUCCESS',
            platform: platform
          }, window.opener.location.origin);
        } catch (err) {
          console.log('Error sending message:', err);
        }
      } else if (error) {
        console.log('Sending ERROR message to opener');
        try {
          window.opener.postMessage({
            type: 'SOCIAL_CONNECTION_ERROR',
            error: error
          }, window.opener.location.origin);
        } catch (err) {
          console.log('Error sending message:', err);
        }
      }
    }
  }, [searchParams]);

  const platform = searchParams.get('social_connected');
  const error = searchParams.get('error');

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          {/* <div style={styles.errorIcon}>⚠️</div> */}
          <h3 style={styles.errorTitle}>Connection Failed</h3>
          <p style={styles.message}>
            {getErrorMessage(error)}
          </p>
          <button 
            style={styles.closeButton}
            onClick={() => window.close()}
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* <div style={styles.successIcon}>✔</div> */}
        <h3 style={styles.successTitle}>Successfully Connected!</h3>
        <p style={styles.message}>
          Your {platform} account has been successfully connected.
        </p>
        <p style={styles.instruction}>
          You can safely close this window now.
        </p>
        <button 
          style={styles.closeButton}
          onClick={() => window.close()}
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

const getErrorMessage = (error) => {
  const errorMessages = {
    'invalid_callback': 'Invalid callback parameters. Please try again.',
    'invalid_state': 'Security verification failed. Please try again.',
    'auth_failed': 'Authentication failed. Please try again.',
    'name_mismatch': 'Name does not match your account. Please use the same name as registered.',
    'default': 'Something went wrong. Please try again.'
  };
  
  return errorMessages[error] || errorMessages.default;
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box'
  },
  content: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '100%'
  },
  successIcon: {
    fontSize: '60px',
    marginBottom: '20px',
    color:"green"
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  successTitle: {
    color: '#28a745',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  errorTitle: {
    color: '#dc3545',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  message: {
    color: '#495057',
    fontSize: '16px',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  instruction: {
    color: '#6c757d',
    fontSize: '14px',
    marginBottom: '25px',
    fontStyle: 'italic'
  },
  closeButton: {
    backgroundColor: '#0977af',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  }
};

// Add hover effect
styles.closeButton[':hover'] = {
  backgroundColor: '#0056b3'
};

export default SocialAuthSuccess;