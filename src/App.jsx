import AppRoutes from "./routes/routes";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  return (
    <>
      <NavigationBar />
      <Container>
        <AppRoutes /> 
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
      <Footer />
    </>
  );
}

export default App;
