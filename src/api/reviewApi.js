import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/reviews";

// ✅ Create a new review
export const createReview = async (eventId, reviewData) => {
  const response = await axios.post(`${API_URL}/${eventId}`, reviewData, { withCredentials: true });
  return response.data;
};

// ✅ Get all reviews for an event
export const getReviewsByEvent = async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}`);
  return response.data;
};

// ✅ Get all reviews (Admin)
export const getAllReviews = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

// ✅ Approve a review (Admin)
export const approveReview = async (reviewId) => {
  const response = await axios.put(`${API_URL}/${reviewId}/approve`, {}, { withCredentials: true });
  return response.data;
};

// ✅ Delete a review (Admin)
export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`${API_URL}/${reviewId}`, { withCredentials: true });
  return response.data;
};
