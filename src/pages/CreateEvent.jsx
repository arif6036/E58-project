import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner, Container, Card } from "react-bootstrap";
import { createEvent } from "../api/eventApi";
import { toast } from "react-toastify";

const CreateEvent = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [eventType, setEventType] = useState("free");
  const [ticketPrice, setTicketPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!user || user.role !== "admin") {
      setError("Only admins can create events.");
      return;
    }
  
    if (!title || !date || !time || !venue) {
      setError("Please fill all required fields.");
      return;
    }
  
    try {
      setLoading(true);
      const eventData = {
        title,
        description,
        date,
        time,
        venue,
        eventType,
        ticketPrice: eventType === "paid" ? Number(ticketPrice) : 0,
      };
  
      await createEvent(eventData);
      toast.success("Event created successfully!");
      navigate("/dashboard"); // ✅ Redirect to dashboard after creation
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event.");
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white text-center">
          <h3>Create a New Event</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleCreateEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                placeholder="Event venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Form.Group>

            {eventType === "paid" && (
              <Form.Group className="mb-3">
                <Form.Label>Ticket Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ticket price"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  required={eventType === "paid"}
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner size="sm" animation="border" className="me-2" /> : "Create Event"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateEvent;
