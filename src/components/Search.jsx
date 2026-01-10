import React from "react";

/**
 * Componente Search
 * @param {string} value - El término de búsqueda actual
 * @param {function} onChange - Función para manejar el cambnio en el input
 * @param {string} placeholder - Texto de ayuuda
 */

// Icono del menú
const SearchIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-stone-400 group-focus-within:text-sky-500 transition-colors" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
    </svg>
);

export default function Search({ value, onChange, placeholder = "Buscar profesor, materia o universidad..."}) {
    return (
        <div className="relative w-full mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
            </div>

            {/* Input de búsqueda */}
            <input 
                type="text" 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all shadow-inner"
            />
        </div>
    )
};