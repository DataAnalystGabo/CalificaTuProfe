import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";

// --- PAGINAS ---
import LandingPage from "./pages/LandingPage";
import DiscoverReviews from "./pages/DiscoverReviews";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta Login Dedicada (Sin Layout) */}
                    <Route path="/login" element={<AuthPage />} />

                    {/* Rutas Principales (Con Header, AuthShell, etc) */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/explorar" element={<DiscoverReviews />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;