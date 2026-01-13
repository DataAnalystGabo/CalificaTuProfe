import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BiMenuAltRight } from "react-icons/bi";
import logoBlack from "../assets/logo-black.svg";

export default function Header({ onMenuToggle }) {

    // Extraemos las funciones del contexto dentro del componente
    const { isAuthenticated, user, signOut, openLogin, openRegister } = useAuth();

    return (
        <header className="bg-white/90 backdrop-blur-sm shadow-sm w-full p-4 fixed top-0 z-30 transition-all border-b border-stone-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo de CalificáTuProfe */}

                <Link
                    to="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    aria-label="CalificáTuProfe - Inicio"
                >
                    <img 
                        src={logoBlack} 
                        alt="Logo de CalificáTuProfe"
                        className="h-8 w-auto" 
                    />
                </Link>

                {/* Menú de escritorio dinámico */}
                <nav
                    className="hidden md:flex items-center gap-8"
                >
                    {isAuthenticated ? (
                        // Vista Logueado
                        <div className="flex items-center gap-6">
                            <button
                                onClick={onMenuToggle}
                                className="flex items-center gap-2 group cursor-pointer"
                            >
                                <div className="h-8 w-8 bg-stone-400 text-white rounded-full flex items-center justify-center font-black text-xs uppercase group-hover:bg-sky-400 transition-colors">
                                    {user?.nickname?.charAt(0) || "U"}
                                </div>
                                <span className="text-stone-600 font-medium text-sm group-hover:text-sky-600 transition-colors">
                                    {user?.nickname || "Usuario"}
                                </span>
                            </button>
                        </div>
                    ) : (
                        // Vista invitado
                        <div className="flex items-center gap-6">
                            <button
                            onClick={openLogin}
                            className="text-stone-600 hover:text-sky-500 font-medium transition-colors cursor-pointer"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={openRegister}
                                className="text-stone-600 hover:text-sky-500 font-medium transition-colors cursor-pointer"
                            >
                                Registrarse
                            </button>
                            <Link
                                to="/acerca"
                                className="text-stone-600 hover:text-sky-500 font-medium transition-colors"
                            >
                                Acerca de
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Menú de móviles */}
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-md text-stone-600 hover:bg-stone-100 transition duration-150 md:hidden  cursor-pointer"
                    aria-label="Abrir menú de navegación"
                >
                    <BiMenuAltRight
                        className="w-6 h-6"
                    />
                </button>
            </div>
        </header>
    )
}