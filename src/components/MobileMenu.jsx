import React from "react";

// Icono de cierre
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default function MobileMenu({ isOpen, onClose }) {
    // Clase de Tailwind para controlar la visibilidad y transición del menú
    const menuClasses = `fixed top-0 left-0 h-full w-64 bg-indigo-700 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0': '-translate-x-full'
    } `;

    return (
        <>
            {/* El menú desplegable */}
            <div className={menuClasses}>
                <div className="p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-white p-1 hover:bg-indigo-600 rounded-md transition duration-150"
                        aria-label="Cerrar menú"
                    >
                        <CloseIcon />
                    </button>
                </div>

                { /* Items del menú */}
                <nav className="flex flex-col p-4 space-y-2">
                    <a href="#" className="text-white text-lg font-medium p-2 rounded hover:bg-indigo-600">
                        Iniciar Sesión
                    </a>
                    <a href="#" className="text-white text-lg font-medium p-2 rounded hover:bg-indigo-600">
                        Registrarse
                    </a>
                    <a href="#" className="text-white text-lg font-medium p-2 rounded hover:bg-indigo-600">
                        Acerca de
                    </a>
                </nav>
            </div>

            {/* Overlay oscuro (para cuando el menú está abierto) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={onClose} // Cierra el menú al hacer clic fuera
                />
            )}
        </>
    );
}