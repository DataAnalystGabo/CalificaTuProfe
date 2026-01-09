import React, { useEffect } from "react";

// Icono de cierre
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function MobileMenu({ isOpen, onClose }) {
    // Bloquear el scroll del body cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else  {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

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
                    <span className="font-bold text-stone-700 text-lg">Menú</span>
                    <button 
                        onClick={onClose}
                        className="p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    >
                        <CloseIcon size={24} />
                    </button>
                </div>

                {/* Lista de Enlaces */}
                <nav className="flex flex-col p-6 space-y-6">
                    <a 
                        href="#" 
                        className="block px-4 py-3 text-stone-600 font-medium rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all"
                        onClick={onClose}
                    >
                        Iniciar Sesión
                    </a>
                    <a 
                        href="#" 
                        className="block px-4 py-3 text-stone-600 font-medium rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all"
                        onClick={onClose}
                    >
                        Registrarse
                    </a>
                    <a 
                        href="#" 
                        className="block px-4 py-3 text-stone-600 font-medium rounded-xl hover:bg-stone-50 hover:text-sky-600 transition-all"
                        onClick={onClose}
                    >
                        Acerca de
                    </a>
                </nav>
            </div>
        </>
    );
};