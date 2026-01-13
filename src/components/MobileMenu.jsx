import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { FaPerson, FaChartColumn } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";

export default function MobileMenu({ isOpen, onClose }) {

    // Extraemos las funciones del contexto dentro del componente
    const { isAuthenticated, user, signOut, openLogin, openRegister } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {/* 1. OVERLAY (El fondo oscuro semitransparente) */}
            <div 
                className={`fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-xs transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose} // Cierra al hacer click fuera
            />

            {/* 2. SIDEBAR (El panel deslizante) */}
            <div 
                className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Cabecera del Sidebar */}
                <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <span className="font-bold text-stone-700 text-lg">
                        {isAuthenticated ? `¡Hola ${user?.nickname}!` : "Menú"}
                    </span>
                    <button 
                        onClick={onClose}
                        className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <MdOutlineClose className="w-6 h-6"/>
                    </button>
                </div>

                {/* Lista de Enlaces */}
                <nav className="flex flex-col p-6 space-y-6">
                    {isAuthenticated ? (
                        <>
                            {/* Opciones de Usuario Logueado */}
                            <Link
                                to="/perfil"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 text-stone-600 rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all"
                            >
                                <FaPerson className="text-lg" /> Mi perfil
                            </Link>
                            <Link
                                to="/estadisticas"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 text-stone-600  rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all"
                            >
                                <FaChartColumn className="text-lg" /> Mis estadísticas
                            </Link>
                            
                            <div className="w-full pt-4 mt-4 border-t border-stone-200">
                                <button
                                    onClick={
                                        async () => {
                                            await signOut();
                                            onClose();
                                            navigate("/"); // Redirección
                                        }
                                    }
                                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <TbLogout2 className="text-xl" /> Cerrar sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Opciones de Invitado */}
                            <button
                                onClick={() => { openLogin(); onClose(); }}
                                className="block px-4 py-3 text-stone-600 text-start font-medium rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all cursor-pointer"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => { openRegister(); onClose(); }}
                                className="block px-4 py-3 text-stone-600 text-start font-medium rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all cursor-pointer"
                            >
                                Registrarse
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
};