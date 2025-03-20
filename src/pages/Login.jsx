import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "../styles/global.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const resultAction = await dispatch(login({ email, password }));
  
      if (login.fulfilled.match(resultAction)) {
        toast.success("Login successful!");
  
        // ✅ Save user to localStorage (Optional)
        if (resultAction.payload.user) {
          localStorage.setItem("user", JSON.stringify(resultAction.payload.user));
        }
  
        // ✅ Redirect to Home Page ("/") after login success
        navigate("/");
      } else {
        throw new Error(resultAction.payload || "Invalid email or password");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100">
          <Col md={6} lg={5} className="mx-auto">
            <Card className="login-card shadow-lg">
              <Card.Header className="text-center">
                <h2 className="mb-0 fw-bold">Welcome Back</h2>
              </Card.Header>

              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope className="text-light" />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between">
                      <Form.Label>Password</Form.Label>
                      <Link to="/forgot-password" className="text-warning text-decoration-none">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock className="text-light" />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 btn-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </span>
                    ) : (
                      <span>
                        <FaSignInAlt className="me-2" />
                        Login
                      </span>
                    )}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-warning fw-bold">
                  <FaUserPlus className="me-1" /> Register Now
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
