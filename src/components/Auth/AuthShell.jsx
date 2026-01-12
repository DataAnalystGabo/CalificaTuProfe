import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { IoClose, IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function AuthShell() {
    const { isModalOpen, closeModal, modalMode, setModalMode } = useAuth();

    // Estados del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (modalMode === "login") {
                await authService.signIn(email, password);
            } else {
                await authService.signUp(email, password);
                alert("¡Registro exitoso! Revisá tu email y confirmá el registro.");
            }
            closeModal(); // Cerramos al tener éxito
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Fondo oscuro (Overlay) */}
            <div 
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={closeModal} 
            />

            {/* Contenedor del Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Botón Cerrar */}
                <button
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-stone-100 transition-colors"
                    onClick={closeModal}
                >
                    <IoClose className="h-6 w-6 text-stone-500 cursor-pointer"/>
                </button>

                <div className="p-8">
                    
                    {/* Header dinámico */}
                    <h2 className="text-2xl font-black text-stone-700 mb-2">
                        {modalMode === "login" ? "¡Hola de nuevo!" : "Únete a la comunidad en segundos"}
                    </h2>

                    <p className="text-stone-500 text-sm mb-8">
                        {modalMode == "login"
                            ? "Ingresá tus credenciales para continuar."
                            : "Registrate y accedé a cientos de reseñas."
                        }
                    </p>
                    
                    {/* Formularios Login/Register */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Input de email */}
                        <div className="relative">
                            <label className="text-xs font-bold text-stone-500 uppercase ml-1">Email</label>
                            <div className="relative mt-1">
                                <IoMailOutline className="absolute h-5 w-5 left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
                                <input 
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        {/* Input de Password */}
                        <div className="relative">
                            <label className="text-xs font-bold text-stone-500 uppercase ml-1">Contraseña</label>
                            <div className="relative mt-1">
                                <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5" />
                                <input 
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                                {error}
                            </p>
                        )}

                        {/* Botón principal */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-4 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-stone-200 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Procesando..." : (modalMode === "login" ? "Entrar" : "Crear cuenta")}
                        </button>
                    </form>
                    
                    {/* Footer */}
                    <div className="mt-8 text-center text-sm">
                        <span className="text-stone-500">
                            {modalMode === "login" ? "¿No tienes cuenta?" : "¿Ya estás registrado?"}
                        </span>
                        <button
                            onClick={() => setModalMode(modalMode === "login" ? "register" : "login")}
                            className="ml-2 font-bold hover:underline text-sky-500 hover:text-sky-400 transition-all cursor-pointer"
                        >
                            {modalMode === "login" ? "Creá una aquí." : "Iniciá sesión."}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};