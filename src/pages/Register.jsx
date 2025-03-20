import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/global.css"; 

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(user);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="register-card shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Create Your Account</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                  className="input-field"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  className="input-field"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                  className="input-field"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">Select Role</Form.Label>
                <Form.Select
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="success" className="w-100 btn-custom">
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
