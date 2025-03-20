import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// const { user, isAuthenticated } = useSelector((state) => state.auth);


const NavigationBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Set loaded state for initial animation
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Navbar 
      expand="lg" 
      className={`modern-navbar fixed-top ${scrollPosition > 50 ? 'scrolled' : ''} ${isLoaded ? 'loaded' : ''}`}
    >
      <Container>
        {/* Branding */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <span className="brand-text">Event</span>
          <span className="brand-accent"> Ease</span>
          <span className="brand-dot">.</span>
        </Navbar.Brand>

        {/* Mobile Toggle Button with custom animation */}
        <Navbar.Toggle aria-controls="navbar-nav" className={`custom-toggler ${isLoaded ? 'loaded' : ''}`}>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
          <span className="toggler-icon"></span>
        </Navbar.Toggle>

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto nav-links-container">
            {/* Home */}
            <div className="nav-item-wrapper">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`fancy-nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                Home
                <span className="hover-effect"></span>
              </Nav.Link>
            </div>

            {/* Events */}
            <div className="nav-item-wrapper">
              <Nav.Link 
                as={Link} 
                to="/events" 
                className={`fancy-nav-link ${location.pathname === "/events" ? "active" : ""}`}
              >
                Events
                <span className="hover-effect"></span>
              </Nav.Link>
            </div>

            {user ? (
              <>
                {/* My Tickets (Users Only) */}
                <div className="nav-item-wrapper">
                  <Nav.Link 
                    as={Link} 
                    to="/my-tickets" 
                    className={`fancy-nav-link ${location.pathname === "/my-tickets" ? "active" : ""}`}
                  >
                    My Tickets
                    <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                {/* Dashboard
                <div className="nav-item-wrapper">
                  <Nav.Link 
                    as={Link} 
                    to="/dashboard" 
                    className={`fancy-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                  >
                    Dashboard
                    <span className="hover-effect"></span>
                  </Nav.Link>
                </div> */}

                {/* Admin Links */}
                {user.role === "admin" && (
                  <>
                    {/* Admin Panel */}
                    <div className="nav-item-wrapper">
                      <Nav.Link 
                        as={Link} 
                        to="/dashboard" 
                        className={`fancy-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                      >
                        Admin Panel
                        <span className="hover-effect"></span>
                      </Nav.Link>
                    </div>

                    {/* Register Event (Admins Only) */}
                    <div className="nav-item-wrapper">
                      <Nav.Link 
                        as={Link} 
                        to="/registerevent" 
                        className={`fancy-nav-link ${location.pathname === "/registerevent" ? "active" : ""}`}
                      >
                        Register Event
                        <span className="hover-effect"></span>
                      </Nav.Link>
                    </div>
                  </>
                )}

                {/* Logout Button */}
                <Button 
                  variant="outline" 
                  className="animated-button logout-btn" 
                  onClick={handleLogout}
                >
                  <span className="button-text">Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Login */}
                <div className="nav-item-wrapper">
                  <Nav.Link 
                    as={Link} 
                    to="/login" 
                    className={`fancy-nav-link ${location.pathname === "/login" ? "active" : ""}`}
                  >
                    Login
                    <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                {/* Register */}
                <div className="nav-item-wrapper">
                  <Nav.Link 
                    as={Link} 
                    to="/register" 
                    className={`fancy-nav-link ${location.pathname === "/register" ? "active" : ""}`}
                  >
                    Register
                    <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                {/* Gallery */}
                <div className="nav-item-wrapper">
                  <Nav.Link 
                    as={Link} 
                    to="/gallery" 
                    className={`fancy-nav-link ${location.pathname === "/gallery" ? "active" : ""}`}
                  >
                    Gallery
                    <span className="hover-effect"></span>
                  </Nav.Link>
                </div>

                {/* Get Started Button */}
                <Button 
                  as={Link} 
                  to="/register" 
                  className="animated-button primary-btn"
                >
                  <span className="button-text">Get Started</span>
                  <span className="button-shine"></span>
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
