// import axios from "axios";
// const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/payment";
// const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };
//   // ✅ Initiate Payment Before Booking
//   export const initiatePayment = async ({ eventId, amount, userId, quantity }) => {
//     try {
//       const response = await axios.post(`${API_URL}/pay`, { eventId, amount, userId, quantity }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });
  
//       console.log("Payment Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Payment Initiation Error:", error.response?.data || error);
//       throw error.response?.data || error;
//     }
//   };
  
//   // ✅ Confirm Booking After Payment
//   export const confirmBooking = async (eventId, ticketData) => {
//     try {
//       const response = await axios.post(`${API_URL}/confirm`, { eventId, ...ticketData }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });
  
//       return response.data;
//     } catch (error) {
//       console.error("Error confirming booking:", error.response?.data || error);
//       throw error.response?.data || error;
//     }
//   };