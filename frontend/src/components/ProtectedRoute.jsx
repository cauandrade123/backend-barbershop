import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function RotaProtegida({ children }) {
  const { estaLogado } = useAuth();
  const local = useLocation();

  if (!estaLogado) {
    return <Navigate to="/login" state={{ de: local.pathname }} replace />;
  }

  return children;
}

export function RotaAdmin({ children }) {
  const { estaLogado, ehAdmin } = useAuth();
  const local = useLocation();

  if (!estaLogado) {
    return <Navigate to="/login" state={{ de: local.pathname }} replace />;
  }

  if (!ehAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
