import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux"; 
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, Calendar, Clock, MapPin, Tag, DollarSign, FileText, Image } from "lucide-react";

const RegisterEvent = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [eventType, setEventType] = useState("free");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !description || !date || !time || !venue || !eventType) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("venue", venue);
      formData.append("eventType", eventType);

      if (eventType === "paid") {
        formData.append("ticketPrice", ticketPrice);
      }
      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/events`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event created successfully!");
      navigate("/admin/events");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event.");
      toast.error(error.response?.data?.message || "Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center fw-bold mb-4">Create Event</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label><FileText size={16} className="me-2" /> Event Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><Tag size={16} className="me-2" /> Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label><Calendar size={16} className="me-2" /> Date</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label><Clock size={16} className="me-2" /> Time</Form.Label>
                  <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label><MapPin size={16} className="me-2" /> Venue</Form.Label>
              <Form.Control type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><Tag size={16} className="me-2" /> Event Type</Form.Label>
              <Form.Select value={eventType} onChange={(e) => setEventType(e.target.value)} required>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Form.Group>

            {eventType === "paid" && (
              <Form.Group className="mb-3">
                <Form.Label><DollarSign size={16} className="me-2" /> Ticket Price ($)</Form.Label>
                <Form.Control type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label><Image size={16} className="me-2" /> Upload Event Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              {preview && (
                <div className="text-center mt-3">
                  <img src={preview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: "200px" }} />
                </div>
              )}
            </Form.Group>

            <Button type="submit" variant="success" disabled={loading} className="w-100">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterEvent;
