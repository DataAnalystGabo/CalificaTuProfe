import { useState } from "react";

// Icono del menú
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export default function Header({ onMenuToggle }) {
    return (
        <header className="bg-white shadow-md p-4 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Título de la App */}
                <h1 className="text-xl font-bold text-stone-700">
                    CalificáTuProfe
                </h1>

                {/* Icono de Menu para Mobile */}
                <button
                    onClick={onMenuToggle}
                    className="p-1 rounded-md text-gray-700 hover:bg-gray-100 transition duration-150"
                    aria-label="Abrir menú de navegación"
                >
                    <MenuIcon/>
                </button>
            </div>
        </header>
    )
}