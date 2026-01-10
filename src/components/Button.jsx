import React from "react";

/**
 * Componente Button
 * Utilizado para filtros y botones de acción con soporte para íconos y chevrons.
 */

// Icono del menú
const ArrowIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-3 w-3 opacity-60" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default function Button({ 
    children, 
    onClick, 
    icon: Icon,
    hasChevron = true, 
    className = "" 
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 
                bg-white border border-stone-300 rounded-full 
                text-xs font-bold text-stone-500 
                hover:border-sky-500 hover:text-sky-600 
                hover:shadow-sm
                transition-all duration-200
                whitespace-nowrap cursor-pointer
                ${className}
            `}
        >
            {/* Si existe el componente Icon, se renderiza */}
            {Icon && <Icon className="w-3 h-3" />}
            
            <span>{children}</span>
            
            {/* Chevron de despliegue opcional */}
            {hasChevron && (<ArrowIcon />)}
        </button>
    );
}