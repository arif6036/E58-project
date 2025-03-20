import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Spinner, Image } from "react-bootstrap";
import { Trash, Edit, Calendar, MapPin, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageEvents = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/"); // Redirect to Home if not admin
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        setError("Failed to fetch events.");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete event.");
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <Calendar className="me-2" /> Manage Events
      </h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading events...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Type</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event._id}>
                <td>{index + 1}</td>
                <td>
                  {event.image ? (
                    <Image src={event.image} alt={event.title} width={50} height={50} rounded />
                  ) : (
                    <span className="text-muted">No Image</span>
                  )}
                </td>
                <td>{event.title}</td>
                <td>
                  <Clock size={16} className="me-1" />
                  {new Date(event.date).toLocaleDateString()} - {event.time}
                </td>
                <td>
                  <MapPin size={16} className="me-1" />
                  {event.venue}
                </td>
                <td>{event.eventType}</td>
                <td>${event.ticketPrice || "Free"}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditEvent(event._id)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ManageEvents;
