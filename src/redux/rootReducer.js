import { combineReducers } from "redux";
import authReducer from "../features/authSlice";
import eventReducer from "../features/eventSlice";
import ticketReducer from "../features/ticketSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventReducer,
  tickets: ticketReducer,
});

export default rootReducer;
