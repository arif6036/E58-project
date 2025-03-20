import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../styles/global.css"; // Import styles

const EventDetails = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth); // Get logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    getEventById(id)
      .then((data) => setEvent(data))
      .catch(() => setError("Error fetching event details"));
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate(`/book/${id}`); // Navigate to booking page if logged in
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!event) return <p className="loading-text">Loading event details...</p>;

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-lg">
        <Card.Img variant="top" src={event.image} alt={event.title} />
        <Card.Body>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}
          </p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Event Type:</strong> {event.eventType}</p>

          <Button variant="primary" onClick={handleBooking}>
            {user ? "Book Ticket" : "Login to Book"}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventDetails;
