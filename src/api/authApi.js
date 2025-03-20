import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, { 
      withCredentials: true,  
      headers: { "Content-Type": "application/json" } 
    });

    console.log("Login API Response:", response.data); // Debugging log

    // ✅ Ensure the token exists
    if (!response.data.token) {
      throw new Error("Login failed: No token received from server");
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data?.message || "Login failed");
    throw error.response?.data || error;
  }
};



// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};



// ✅ Logout User
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Request Password Reset (Send Email)
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Password Reset Request Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Reset Password (Change Password Using Token)
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
