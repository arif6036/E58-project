import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookTicket, getUserTickets, cancelTicket } from "../api/ticketApi";

// Async Thunks
export const bookNewTicket = createAsyncThunk("tickets/book", async ({ eventId, ticketData, token }, { rejectWithValue }) => {
  try {
    return await bookTicket(eventId, ticketData, token);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUserTickets = createAsyncThunk("tickets/fetch", async (token, { rejectWithValue }) => {
  try {
    return await getUserTickets(token);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Redux Slice
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      });
  },
});

export default ticketSlice.reducer;
