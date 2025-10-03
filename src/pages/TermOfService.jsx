import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { Link } from 'react-router-dom';

const TermOfService = () => {
  return (
    <>
    <Header/>
       <div className='policy-term-page'>
          <div className='heading-condition'>
                <div className='container'>
       <h1 className="display-4 fw-bold mb-3 text-center">Terms of Service</h1>
        {/* <h2 className="text-center">Privacy Policy</h2> */}
<nav aria-label="breadcrumb">
  <ol className="breadcrumb justify-content-center">
    <li className="breadcrumb-item">
      <Link to="/">Home</Link>
    </li>
    <li className="breadcrumb-item active" aria-current="page">
 Terms of Service
    </li>
  </ol>
</nav>
    </div>
          </div>
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-12 col-xl-12">
          {/* Header */}
          {/* <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Future Soulmate</h1>
            <h2 className="h3 text-muted">Terms of Service</h2>
          </div> */}

          {/* Introduction */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">1. Introduction</h3>
              <p>
                Welcome to Future Soulmate, the premier matchmaking service designed to help you find 
                your perfect partner through advanced compatibility algorithms and personalized matching. 
                By accessing or using our website, mobile application, or services, you agree to be bound 
                by these Terms of Service.
              </p>
              <p className="mb-0">
                Please read these terms carefully as they contain important information about your legal 
                rights, remedies, and obligations. If you do not agree with these terms, you may not 
                access or use our services.
              </p>
            </div>
          </div>

          {/* Eligibility */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">2. Eligibility</h3>
              <p>To use Future Soulmate services, you must:</p>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <i class="fa fa-check" aria-hidden="true"></i>

                  Be at least 18 years of age
                </li>
                <li className="list-group-item">
              <i class="fa fa-check" aria-hidden="true"></i>

                  Have the legal capacity to enter into binding contracts
                </li>
                <li className="list-group-item">
                 <i class="fa fa-check" aria-hidden="true"></i>

                  Not be prohibited from using our services under applicable laws
                </li>
                <li className="list-group-item">
             <i class="fa fa-check" aria-hidden="true"></i>

                  Provide accurate and complete registration information
                </li>
              </ul>
              <p className="mb-0">
                We reserve the right to refuse service, suspend, or terminate accounts at our sole discretion.
              </p>
            </div>
          </div>

          {/* Membership and Subscription */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">3. Membership and Subscription</h3>
              <h5 className="h6 text-muted mt-3">Free Membership</h5>
              <p>
                Basic features including profile creation, limited matching, and profile browsing are available 
                at no cost.
              </p>
              
              <h5 className="h6 text-muted mt-3">Premium Subscription</h5>
              <p>Premium features include:</p>
              <ul>
                <li>Unlimited messaging with matches</li>
                <li>Advanced compatibility analysis</li>
                <li>Priority profile placement</li>
                <li>Enhanced search filters</li>
                <li>Read receipts and typing indicators</li>
              </ul>
              
              <div className=""  style={{ background: "#fff3e5",color:"black", padding:"10px" }}>
                <strong>Billing:</strong> Subscriptions automatically renew unless canceled at least 24 hours 
                before the end of the current billing period. All fees are non-refundable.
              </div>
            </div>
          </div>

          {/* User Conduct and Content */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">4. User Conduct and Content</h3>
              
              <h5 className="h6 text-muted mt-3">Prohibited Activities</h5>
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    <li>Harassment or abusive behavior</li>
                    <li>Impersonation or false representation</li>
                    <li>Commercial solicitation</li>
                    <li>Uploading malicious content</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul>
                    <li>Sharing explicit or inappropriate content</li>
                    <li>Data mining or scraping</li>
                    <li>Circumventing security measures</li>
                    <li>Violating others' privacy</li>
                  </ul>
                </div>
              </div>

              <h5 className="h6 text-muted mt-3">Content Guidelines</h5>
              <p>
                You are solely responsible for the content you post, including photos, messages, and profile 
                information. Content must not:
              </p>
              <ul>
                <li>Be defamatory, obscene, or offensive</li>
                <li>Infringe on intellectual property rights</li>
                <li>Contain personal contact information</li>
                <li>Include false or misleading information</li>
              </ul>
            </div>
          </div>

          {/* Privacy and Data Protection */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">5. Privacy and Data Protection</h3>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                your personal information. By using our services, you consent to our collection and use of 
                your data as described in the Privacy Policy.
              </p>
              <div className="" style={{ background: "#fff3e5",color:"black", padding:"10px" }}>
                <strong>Data Usage:</strong> We use your data to provide personalized matches, improve our 
                services, and communicate with you. We do not sell your personal information to third parties.
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">6. Intellectual Property</h3>
              <p>
                Future Soulmate and its original content, features, and functionality are owned by Future 
                Soulmate Inc. and are protected by international copyright, trademark, and other intellectual 
                property laws.
              </p>
              <p className="mb-0">
                You may not reproduce, distribute, modify, or create derivative works of our content without 
                express written permission.
              </p>
            </div>
          </div>

          {/* Disclaimer of Warranties */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">7. Disclaimer of Warranties</h3>
              <p>
                Our services are provided "as is" and "as available" without warranties of any kind, either 
                express or implied. We do not guarantee:
              </p>
              <ul>
                <li>That you will find a compatible match</li>
                <li>Continuous, uninterrupted, or secure access to our services</li>
                <li>The accuracy or completeness of any match suggestions</li>
                <li>The conduct of other users</li>
              </ul>
              <div className="" style={{ background: "#fff3e5",color:"black", padding:"10px" }}>
                <strong>Important:</strong> We are not responsible for the actions, content, information, or 
                data of third parties. You release us from any claims and damages arising out of disputes 
                with other users.
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">8. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, Future Soulmate shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to loss of 
                profits, data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul>
                <li>Your access to or use of our services</li>
                <li>Any conduct or content of any third party</li>
                <li>Unauthorized access, use, or alteration of your content</li>
                <li>Any other matter relating to our services</li>
              </ul>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="h4 text-primary1 mb-3">9. Changes to Terms</h3>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of significant 
                changes by posting the new Terms on our website and updating the "Last Updated" date. Your 
                continued use of our services after such changes constitutes your acceptance of the new Terms.
              </p>
            </div>
          </div>

          {/* Acceptance Section */}
          <div className="mt-5 p-4 privacy-part">
            <h4 className="mb-3">Acceptance of Terms</h4>
            <p className="mb-4">
              By creating an account or using our services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default TermOfService;