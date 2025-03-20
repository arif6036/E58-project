import { useState } from "react";
import { requestPasswordReset } from "../api/authApi";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setLoading(true);
      await requestPasswordReset(email);
      setSuccessMessage("A password reset link has been sent to your email.");
      toast.success("Check your email for the reset link.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset email.");
      toast.error("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow border-0 rounded-lg" style={{ width: "400px" }}>
        <Card.Header className="bg-primary text-white text-center py-3">
          <h3 className="mb-0">Forgot Password?</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaEnvelope className="text-primary" />
                </span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
