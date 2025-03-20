import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../api/eventApi";

// Async Thunks
export const fetchEvents = createAsyncThunk("events/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getAllEvents();
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchEvent = createAsyncThunk("events/fetchOne", async (eventId, { rejectWithValue }) => {
  try {
    return await getEventById(eventId);
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Redux Slice
const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    event: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.event = action.payload;
      });
  },
});

export default eventSlice.reducer;
