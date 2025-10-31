import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
  <div className="container">
    <div className="row">
      <div className="col-md-6">
        <div className="footer-logo">
          <img src="images/footerlogo.svg" alt="" />
        </div>
        <div className="footer-links">
          <Link to="#">About us</Link> |<Link to="#">Contact us</Link> |
          <Link to="#">Careers</Link> |<Link to="#">Awards &amp; Recognition</Link> |
          <Link to="/terms-of-service">Terms &amp; Conditions</Link> |<Link to="/privacy-policy">Privacy Policy</Link>{" "}
          |<Link to="#">Disclaimer</Link>
        </div>
      </div>
      <div className="col-md-6">
        <div className="conract-info">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div className="contact-box">
                <img src="images/footermobileicon.svg" alt=""/>
                <div className="text-left">
                  <div className="contact-label">Phone</div>
                  <a className="contact-text text-decoration-none" href="tel:+12229888822">+1 222 9888822</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div className="contact-box">
                <img src="images/footeremailicon.svg" alt=""/>
                <div className="text-left">
                  <div className="contact-label">Mail</div>
                  <a className="contact-text text-decoration-none" href="mailto:info@futuresoulmates.com">info@futuresoulmates.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="copy-right">
      <p>Copyright © 2024. All rights reserved to FutureSoulmates</p>
    </div>
  </div>
</footer>

  )
}

export default Footer
