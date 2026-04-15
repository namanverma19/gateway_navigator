import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginSuccess = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL se ?token=... nikalna
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token); // Context aur LocalStorage mein save ho gaya
      navigate("/dashboard"); // Seedha dashboard bhejo
    } else {
      navigate("/"); // Agar token nahi hai toh wapas login bhejo
    }
  }, [location, login, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Verifying Identity... 🛡️</h2>
      <p>Please wait while we set up your secure session.</p>
    </div>
  );
};

export default LoginSuccess;