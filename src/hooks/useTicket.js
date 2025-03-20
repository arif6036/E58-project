import { useDispatch, useSelector } from "react-redux";
import { fetchUserTickets } from "../features/ticketSlice";
import { useEffect } from "react";

const useTicket = (token) => {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserTickets(token));
    }
  }, [dispatch, token]);

  return { tickets, loading };
};

export default useTicket;
