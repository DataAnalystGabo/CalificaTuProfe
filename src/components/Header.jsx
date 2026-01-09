import { useState } from "react";
import logoBlack from "../assets/logo-black.svg";

// Icono del menú
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

export default function Header({ onMenuToggle }) {
    return (
        <header className="bg-white/90 backdrop-blur-sm shadow-sm w-full p-4 fixed top-0 z-30 transition-all border-b border-stone-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo de CalificáTuProfe */}
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

                {/* Menú de escritorio */}
                <nav
                    className="hidden md:flex items-center gap-8"
                >
                    <a href="#"
                        className="text-stone-600 hover:text-sky-500 font-medium transition-colors"
                    >
                        Iniciar Sesión
                    </a>
                    <a href="#"
                        className="text-stone-600 hover:text-sky-500 font-medium transition-colors"
                    >
                        Registrarse
                    </a>
                    <a href="#"
                        className="text-stone-600 hover:text-sky-500 font-medium transition-colors"
                    >
                        Acerca de
                    </a>
                </nav>

                {/* Menú de móviles */}
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-md text-stone-600 hover:bg-stone-100 transition duration-150 md:hidden"
                    aria-label="Abrir menú de navegación"
                >
                    <MenuIcon/>
                </button>
            </div>
        </header>
    )
}