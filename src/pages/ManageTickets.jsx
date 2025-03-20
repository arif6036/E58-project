import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";
import { Trash, Ticket, Calendar, User } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/"); // Redirect to Home if not admin
      return;
    }

    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (error) {
        setError("Failed to fetch ticket bookings.");
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, navigate]);

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      toast.success("Ticket canceled successfully.");
    } catch (error) {
      toast.error("Failed to cancel ticket.");
      console.error("Error canceling ticket:", error);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <Ticket className="me-2" /> Manage Tickets
      </h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading tickets...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Event</th>
              <th>Type</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>
                  <User size={16} className="me-1" />
                  {ticket.user?.name || "Unknown"}
                </td>
                <td>
                  <Calendar size={16} className="me-1" />
                  {ticket.event?.title || "Unknown"}
                </td>
                <td>{ticket.ticketType}</td>
                <td>${ticket.price}</td>
                <td>{ticket.quantity}</td>
                <td>{ticket.isCheckedIn ? "Checked In" : "Not Checked In"}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleCancelTicket(ticket._id)}>
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

export default ManageTickets;
