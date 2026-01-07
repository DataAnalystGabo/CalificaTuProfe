import { useState } from "react";
import logoBlack from "../assets/logo-black.svg";

// Icono del menú
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export default function Header({ onMenuToggle }) {
    return (
        <header className="bg-white shadow-md w-full p-4 fixed top-0 z-30">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Título de la App */}
                <a 
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    aria-label="CalificáTuProfe - Inicio"
                >
                    <img 
                        src={logoBlack} 
                        alt="Logo de CalificáTuProfe"
                        className="h-8 w-auto"
                    />
                </a>

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