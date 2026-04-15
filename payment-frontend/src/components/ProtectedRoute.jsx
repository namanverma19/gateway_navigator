import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // Agar token nahi hai, toh Login page par dhakka de do
  if (!token) {
    return <Navigate to="/" />;
  }

  // Agar token hai, toh Dashboard dikhao
  return children;
};

export default ProtectedRoute;