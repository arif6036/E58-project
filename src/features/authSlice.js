import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser, getUserProfile } from "../api/authApi";

// ✅ Login User
export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await loginUser(userData);

    if (!response.token) {
      return rejectWithValue("Login failed: No token received");
    }

    // ✅ Save Token and User to Local Storage
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response.user; // ✅ Return only user data
  } catch (error) {
    console.error("Login Error:", error);

    let errorMessage = "Invalid email or password";
    if (error.response?.data) {
      errorMessage = error.response.data.message || JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }

    return rejectWithValue(errorMessage);
  }
});

// ✅ Register User
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    return await registerUser(userData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// ✅ Logout User
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutUser(); // ✅ Call API if needed
    localStorage.removeItem("token"); // ✅ Remove token
    localStorage.removeItem("user"); // ✅ Remove user
    return null;
  } catch (error) {
    return null;
  }
});

// ✅ Fetch User Profile
export const fetchUserProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token"); // ✅ Ensure Token is Stored
    if (!token) throw new Error("No authentication token found");

    return await getUserProfile();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

// ✅ Redux Slice
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // ✅ Load user from localStorage on refresh
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // ✅ Load user from localStorage
    isAuthenticated: !!localStorage.getItem("token"), // ✅ Check authentication
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
