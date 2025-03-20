import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Users, Calendar, Ticket, Shield } from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access Denied! Admins only.");
      navigate("/"); // Redirect to Home if not admin
    }
  }, [user, navigate]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">
        <Shield className="me-2" /> Admin Dashboard
      </h2>
      <Row>
        {/* Manage Users */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Users size={48} />
              <h4 className="mt-3">Manage Users</h4>
              <p>View, edit, and delete users.</p>
              <Button as={Link} to="/admin/users" variant="primary">
                Go to Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Events */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Calendar size={48} />
              <h4 className="mt-3">Manage Events</h4>
              <p>Create, edit, and delete events.</p>
              <Button as={Link} to="/admin/events" variant="success">
                Go to Events
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Tickets */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Ticket size={48} />
              <h4 className="mt-3">Manage Tickets</h4>
              <p>View and manage ticket bookings.</p>
              <Button as={Link} to="/admin/tickets" variant="warning">
                Go to Tickets
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
