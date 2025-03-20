import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import BookTicket from "../pages/BookTicket";
import ProtectedRoute from "./ProtectedRoute";
import RegisterEvent from "../pages/RegisterEvent";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import CreateEvent from "../pages/CreateEvent";
import MyTickets from "../pages/MyTickets"; 
import ManageUsers from "../pages/ManageUsers"; 
import ManageEvents from "../pages/ManageEvents"; 
import ManageTickets from "../pages/ManageTickets"; 
import { useSelector } from "react-redux"; 

const PrivateRoute = ({ element }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registerevent" element={<RegisterEvent />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/book/:id" element={<ProtectedRoute><BookTicket /></ProtectedRoute>} />
      {/* <Route path="/my-tickets" element={<MyTickets />} />  */}
      <Route path="/my-tickets" element={<PrivateRoute element={<MyTickets />} />} />

        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/events" element={<ManageEvents />} />
        <Route path="/admin/tickets" element={<ManageTickets />} />

      {/* ✅ New Route: Protected Event Creation (Admin Only) */}
      <Route path="/dashboard/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      {/* <Route 
        path="/admin/dashboard" 
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        } 
      /> */}
    

      {/* ✅ New Routes for Password Reset */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default AppRoutes;
