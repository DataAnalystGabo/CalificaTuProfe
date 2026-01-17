import React from "react";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";

export default function AuthShell() {
    // --- CONTEXTO Y NAVEGACIÓN ---
    const { isModalOpen, closeModal, modalMode, setModalMode } = useAuth();
    const navigate = useNavigate();

    if (!isModalOpen) return null;

    const handleSuccess = () => {
        // Redirección tras login exitoso si es necesario, o solo cerrar
        // En el modal, asumimos que si estabas en una pagina publica, te quedas ahi,
        // o si estabas 'viajando' a algun lado, el AuthGuard o la logica del componente lo maneja.
        // Pero el AuthShell original redirigia a /explorar siempre. Mantenemos eso por ahora para login.
        if (modalMode === "login") {
            navigate("/explorar");
        }
        closeModal();
    };

    return (
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
                    <MdOutlineClose className="h-6 w-6 text-stone-500 cursor-pointer" />
                </button>

                <div className="p-8">
                    <AuthForm
                        mode={modalMode}
                        onSuccess={handleSuccess}
                        onSwitchMode={() => setModalMode(modalMode === "login" ? "register" : "login")}
                    />
                </div>

            </div>
        </div>
    );
};