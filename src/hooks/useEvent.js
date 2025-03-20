import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../features/eventSlice";
import { useEffect } from "react";

const useEvent = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return { events, loading };
};

export default useEvent;
