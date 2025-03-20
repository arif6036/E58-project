import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FaCalendarAlt, FaTicketAlt, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllEvents } from "../api/eventApi";

import "../styles/global.css"; // Import styles

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ✅ Define state
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    console.log("User from Redux:", user);
  }, [user]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err.message);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Prevent crashes by checking `loading` and `error`
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading events...</p>
      </div>
    );
  
  if (error) return <p className="text-danger text-center">{error}</p>;

  // ✅ Handle Event Register Button Click
  const handleRegisterEvent = () => {
    console.log("User Role:", user?.role); // ✅ Debugging Log
  
    if (user?.role?.toLowerCase() === "admin") {  // ✅ Ensure case-insensitive check
      navigate("/registerevent");
    } else {
      setShowPopup(true);
      toast.error("Access Denied! Only admins can register events.");
      setTimeout(() => setShowPopup(false), 3000);
    }
  };
  return (
    <div className="home-container">
      <motion.div
        className="cover-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="cover-title">Discover & Book Your Next Experience</h1>
        <p className="cover-subtitle">Find the best events, book tickets, and create unforgettable memories.</p>

        {/* ✅ Navigation Buttons */}
        <div className="button-group">
          <Button variant="success" size="lg" onClick={() => navigate("/events")}>
            <FaCalendarAlt /> Explore Events
          </Button>
          <Button variant="success" size="lg" onClick={() => navigate("/tickets")}>
            <FaTicketAlt /> Book Tickets
          </Button>
          <Button variant="success" size="lg" onClick={handleRegisterEvent}>
            <FaPlusCircle /> Register Event
          </Button>
        </div>

        {showPopup && <Alert variant="danger" className="mt-2">Only admins can register events!</Alert>}
      </motion.div>

      <Container className="mt-5">
        <h2 className="section-title">Trending & Popular Events</h2>
        <Row>
          {events.length > 0 ? (
            events.map((event) => (
              <Col md={6} lg={4} key={event._id} className="d-flex align-items-stretch">
                <Card className="mb-3 shadow-sm w-100 event-card">
                  <Card.Img
                    variant="top"
                    src={event.image || "/default-event.jpg"} // ✅ Prevent missing image errors
                    alt={event.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Button variant="secondary" onClick={() => navigate(`/events/${event._id}`)}>
                      View Event
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No events available.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
