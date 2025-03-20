import { useEffect, useState } from "react";
import { getAllEvents } from "../api/eventApi";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, MapPin, Clock, Users, PlusCircle } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Get time from date string
  const getTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Navigate to Create Event Page
  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading events...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5 bg-light">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Upcoming Events</h2>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary">Filter</Button>
            {user?.role === "admin" && (
              <Button variant="primary" onClick={handleCreateEvent}>
                <PlusCircle size={16} className="me-2" /> Add Event
              </Button>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No upcoming events found.</p>
            {user?.role === "admin" && (
              <Button variant="outline-primary" onClick={handleCreateEvent}>
                Create an Event
              </Button>
            )}
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {events.map(event => (
              <Col key={event._id}>
                <Card className="h-100 shadow-sm hover-shadow border-0">
                  {event.image && (
                    <div className="card-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={event.image || "/api/placeholder/400/200"}
                        alt={event.title}
                        className="event-image"
                      />
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="fw-bold">{event.title}</Card.Title>
                    <div className="mb-3">
                      <div className="d-flex align-items-center text-muted mb-2">
                        <Calendar size={16} className="me-2" />
                        <small>{formatDate(event.date)}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted mb-2">
                        <Clock size={16} className="me-2" />
                        <small>{getTime(event.date)}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <MapPin size={16} className="me-2" />
                        <small>{event.venue}</small>
                      </div>
                    </div>
                    <Card.Footer className="bg-white border-0 pt-0">
                      <div className="d-grid gap-2">
                        <Link to={`/events/${event._id}`} className="text-decoration-none">
                          <Button variant="outline-primary" size="sm" className="w-100">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default Events;
