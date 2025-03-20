import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../api/eventApi";
import { initiatePayment, confirmBooking } from "../api/ticketApi"; // ✅ Correct API Calls
import { Container, Card, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Calendar, Clock, MapPin, ArrowLeft, CreditCard, Users } from "lucide-react";

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to book tickets.");
      navigate(`/login?redirect=/events/${id}/book`);
      return;
    }

    setLoading(true);
    getEventById(id)
      .then((data) => {
        setEvent(data);
        setTotalPrice(data.ticketPrice || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching event details");
        setLoading(false);
      });
  }, [id, user, navigate]);

  useEffect(() => {
    if (event && event.ticketPrice) {
      setTotalPrice(event.ticketPrice * quantity);
    }
  }, [quantity, event]);

  const handleBooking = async (e) => {
    e.preventDefault();
  
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("User ID is missing. Please re-login.");
      navigate("/login");
      return;
    }
  
    try {
      setBookingInProgress(true);
      
      // ✅ Fetch Token from Local Storage
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please login again.");
        navigate("/login");
        return;
      }
  
      console.log("Total Price Before Payment:", totalPrice); // ✅ Debugging log
  
      if (totalPrice < 0.5) {
        toast.error("Payment amount is too low. Minimum is $0.50 USD.");
        setBookingInProgress(false);
        return;
      }
  
      // ✅ Step 1: Initiate Payment
      const paymentResponse = await initiatePayment({
        eventId: id,
        amount: totalPrice,
        userId, // ✅ Ensure userId is sent
        quantity,
      });
  
      if (!paymentResponse.success || !paymentResponse.paymentUrl) {
        throw new Error(paymentResponse.message || "Payment Failed");
      }
  
      // ✅ Step 2: Confirm Booking
      const ticketData = { ticketType: "Standard", price: totalPrice, userId, quantity };
      const bookingResponse = await confirmBooking(id, ticketData, token);
  
      if (!bookingResponse) {
        throw new Error("Booking confirmation failed.");
      }
  
      toast.success("Ticket booked successfully!");
      navigate("/my-tickets");
  
    } catch (error) {
      setBookingInProgress(false);
      setError(error.response?.data?.message || "Failed to book ticket. Please try again.");
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading event details...</p>
        </div>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Event not found"}</Alert>
        <Button variant="outline-primary" as={Link} to="/events" className="mt-3">
          <ArrowLeft size={16} className="me-2" /> Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2>{event.title}</h2>
              <p><Calendar /> {event.date}</p>
              <p><Clock /> {event.time}</p>
              <p><MapPin /> {event.venue}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Form onSubmit={handleBooking}>
            <Form.Group className="mb-3">
              <Form.Label>Number of Tickets</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Form.Group>
            <h4>Total Price: ${totalPrice}</h4>
            <Button type="submit" disabled={bookingInProgress}>
              {bookingInProgress ? "Processing..." : "Proceed to Payment"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookTicket;
