import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/events`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const createEvent = async (eventData) => {
  try {
      const response = await axios.post(API_URL, eventData, {
          headers: getAuthHeaders(),
          withCredentials: true, 
      });
      return response.data;
  } catch (error) {
      console.error("Error creating event:", error.response?.data || error.message);
      throw error;
  }
};

// Fetch All Events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Fetch Single Event by ID
export const getEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};


// Update Event (Admin Only)
export const updateEvent = async (eventId, eventData, token) => {
  const response = await axios.put(`${API_URL}/${eventId}`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete Event (Admin Only)
export const deleteEvent = async (eventId, token) => {
  const response = await axios.delete(`${API_URL}/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
