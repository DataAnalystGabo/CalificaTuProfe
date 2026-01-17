import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Rutas protegidas
    const protectedRoutes = ["/explorar"];
    const isProtectedRoute = protectedRoutes.includes(location.pathname);

    useEffect(() => {
        // Solo redirigir si terminó de cargar y no está autenticado y está en una ruta protegida
        if (!loading && !isAuthenticated && isProtectedRoute) {
            console.log("[AuthGuard] Usuario no autenticado - redirigiendo a login.");
            navigate("/login", { replace: true });
        }
    }, [loading, isAuthenticated, isProtectedRoute, navigate])

    return children;
}