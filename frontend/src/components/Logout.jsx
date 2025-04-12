import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // or a loading spinner if you prefer
}
