import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthShell from "./components/Auth/AuthShell";

// --- PAGINAS Y COMPONENTES GLOBALES ---
import LandingPage from "./pages/LandingPage";
import DiscoverReviews from "./pages/DiscoverReviews";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";

function App() {

    // Estado único para el menú móvil (controla Header y MobileMenu)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Funciones de control
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-stone-50 flex flex-col">
                    {/* Header Global  */}
                    <Header onMenuToggle={openMenu} />
                    <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />

                    {/* Contenedor de Rutas */}
                    <div className="grow">
                        <Routes>
                            {/* Ruta: Landing Page */}
                            <Route path="/" element={<LandingPage />} />

                            {/* Ruta: Explorar */}
                            <Route path="/explorar" element={<DiscoverReviews />} />
                            
                            {/* Ruta: Not Found */}
                            <Route path="*" element={<NotFound />}/>
                        </Routes>
                    </div>
                </div>
                <AuthShell />
            </Router>
        </AuthProvider>
    );
}

export default App;