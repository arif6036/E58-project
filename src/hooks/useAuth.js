import { useSelector } from "react-redux";

const useAuth = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  return { user, isAuthenticated };
};

export default useAuth;
