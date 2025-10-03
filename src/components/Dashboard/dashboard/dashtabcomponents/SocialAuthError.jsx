import { useSearchParams } from 'react-router-dom';

const SocialAuthError = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const platform = searchParams.get('platform');
  const socialName = searchParams.get('social_name');
  const dbName = searchParams.get('db_name');

  const getErrorDetails = () => {
    switch (error) {
      case 'name_mismatch':
        return {
          title: 'Name Mismatch',
          message: `The name on your ${platform} account (${socialName}) doesn't match your registered name (${dbName}). Please use the same name or contact support.`
        };
      case 'auth_failed':
        return {
          title: 'Authentication Failed',
          message: 'Failed to authenticate with the social platform. Please try again.'
        };
      case 'invalid_state':
        return {
          title: 'Security Error',
          message: 'Security verification failed. Please try the connection process again.'
        };
      default:
        return {
          title: 'Connection Failed',
          message: 'Something went wrong during the connection process. Please try again.'
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* <div style={styles.errorIcon}>❌</div> */}
        <h3 style={styles.title}>{errorDetails.title}</h3>
        <p style={styles.message}>{errorDetails.message}</p>
        <div style={styles.actions}>
          <button 
            style={styles.button}
            onClick={() => window.close()}
          >
            Close Window
          </button>
          <button 
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => window.history.back()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  },
  content: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%'
  },
  errorIcon: {
    fontSize: '60px',
    marginBottom: '20px'
  },
  title: {
    color: '#dc3545',
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  message: {
    color: '#495057',
    fontSize: '16px',
    marginBottom: '30px',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#0977af',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  secondaryButton: {
    backgroundColor: '#6c757d'
  }
};

export default SocialAuthError;