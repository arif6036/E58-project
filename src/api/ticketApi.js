import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/tickets`;



// Get the stored token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Book a Ticket
export const bookTicket = async (eventId, ticketData) => {
  try {
    const response = await axios.post(`${API_URL}/${eventId}/book`, ticketData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    console.log("Booking Ticket Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ticket Booking Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// ✅ Get User's Booked Tickets
export const getUserTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-tickets`, {
      headers: getAuthHeaders(),
      withCredentials: true, // Ensure cookies are sent
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user tickets:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getAllTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Cancel Ticket
export const cancelTicket = async (ticketId) => {
  try {
    const response = await axios.delete(`${API_URL}/cancel/${ticketId}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error canceling ticket:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Get Event Bookings (Admin)
export const getEventBookings = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/${eventId}/bookings`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event bookings:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Generate QR Code for a Ticket
export const generateTicket = async (ticketId) => {
  try {
    const response = await axios.get(`${API_URL}/${ticketId}/qr`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating ticket QR code:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Check-in Ticket (Event Staff)
export const checkInTicket = async (ticketId) => {
  try {
    const response = await axios.post(`${API_URL}/${ticketId}/api/payment`, {}, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking in ticket:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


// ✅ Initiate Payment Before Booking
export const initiatePayment = async (paymentData) => {
  try {
    console.log("Initiating Payment - Data Sent:", paymentData); // ✅ Debugging log

    const response = await axios.post(`${API_URL}/payment`, paymentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });

    console.log("Payment Response:", response.data); // ✅ Debugging log
    return response.data;
  } catch (error) {
    console.error("Payment Initiation Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};



// ✅ Confirm Ticket Booking After Payment
export const confirmBooking = async (eventId, ticketData, token) => {
  try {
    console.log("Confirming Booking - Data Sent:", ticketData); // Debugging Log

    const response = await axios.post(`${API_URL}/${eventId}/book`, ticketData, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      withCredentials: true,
    });

    console.log("Booking Confirmed:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error confirming booking:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

