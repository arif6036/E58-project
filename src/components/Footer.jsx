import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
//import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      {/* Wave decoration */}
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            fill="#141b2d" 
            d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="footer-content">
        <Container>
          <Row className="text-md-left">
            {/* Company info */}
            <Col md={4} className="footer-column">
              <h4 className="footer-title">EventEase<span className="title-dot">.</span></h4>
              <p className="footer-description">
                Creating unforgettable experiences and bringing people together through expertly managed events.
              </p>
              <div className="social-icons">
                <a href="#" className="social-icon"><FaFacebook /></a>
                <a href="#" className="social-icon"><FaTwitter /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
                <a href="#" className="social-icon"><FaLinkedin /></a>
              </div>
            </Col>

            {/* Quick links */}
            <Col md={2} className="footer-column">
              <h5 className="footer-subtitle">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
              </ul>
            </Col>

            {/* Services */}
            <Col md={3} className="footer-column">
              <h5 className="footer-subtitle">Our Services</h5>
              <ul className="footer-links">
                <li><Link to="/services/corporate">Corporate Events</Link></li>
                <li><Link to="/services/weddings">Weddings</Link></li>
                <li><Link to="/services/concerts">Concerts</Link></li>
                <li><Link to="/services/conferences">Conferences</Link></li>
              </ul>
            </Col>

            {/* Contact */}
            <Col md={3} className="footer-column">
              <h5 className="footer-subtitle">Contact Us</h5>
              <address className="footer-contact">
                <p><i className="contact-icon">📍</i> Calicut, Kerala</p>
                <p><i className="contact-icon">📞</i> +974 50256375</p>
                <p><i className="contact-icon">✉️</i> info@eventease.com</p>
              </address>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-md-start">
              <p className="copyright">
                &copy; {currentYear} EventEast. All Rights Reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="footer-legal">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;