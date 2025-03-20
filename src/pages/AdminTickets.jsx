import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventBookings } from "../api/ticketApi";
import { Container, Table, Alert, Spinner, Button } from "react-bootstrap";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AdminTickets = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEventBookings(id)
      .then(setTickets)
      .catch(() => setError("Error fetching ticket bookings"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Link to="/admin/dashboard" className="btn btn-link">
        <ArrowLeft size={18} className="me-1" /> Back to Dashboard
      </Link>

      <h2 className="mt-3">Ticket Bookings</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {tickets.length === 0 ? (
        <Alert variant="info">No tickets booked for this event.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Ticket Type</th>
              <th>Price</th>
              <th>Check-In</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>{ticket.user.name}</td>
                <td>{ticket.user.email}</td>
                <td>{ticket.ticketType}</td>
                <td>${ticket.price}</td>
                <td>
                  {ticket.isCheckedIn ? (
                    <span className="text-success">Checked In</span>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCheckIn(ticket._id)}
                    >
                      Check-In
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

const handleCheckIn = async (ticketId) => {
  try {
    await fetch(`/api/tickets/ticket/${ticketId}/check-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    window.location.reload(); // Refresh after check-in
  } catch (error) {
    console.error("Error during check-in:", error);
  }
};

export default AdminTickets;
