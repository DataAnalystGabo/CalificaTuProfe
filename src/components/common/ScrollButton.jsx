/**
 * ============================================================================================
 * SCROLL BUTTON (Smart Navigation)
 * ============================================================================================
 * 
 * FUNCIÓN:
 *   Botón flotante de navegación inteligente que facilita el salto entre los controles de
 *   búsqueda (parte superior de la página) y los controles de paginación (parte inferior)
 *   acompañando la dirección de scroll del usuario.
 * 
 * COMPORTAMIENTO:
 *   - Cuando el usuario hace scroll hacia ABAJO → Flecha apunta ABAJO (ir al final)
 *   - Cuando el usuario hace scroll hacia ARRIBA → Flecha apunta ARRIBA (ir al inicio)
 *   - El botón siempre acompaña la acción actual del usuario
 * 
 * CARACTERÍSTICAS:
 *   - Animación "infinite slide" en la flecha (loop continuo)
 *   - Transición suave al cambiar de dirección
 *   - Scroll behavior: smooth para navegación fluida
 *   - Cleanup automático del event listener al desmontar
 * 
 * ============================================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { TbArrowNarrowDown, TbArrowNarrowUp } from "react-icons/tb";

// Keyframes para la animación "infinite slide"
const slideDownKeyframes = `
@keyframes slideDown {
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    50% {
        transform: translateY(0);
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(100%);
        opacity: 0;
    }
}

@keyframes slideUp {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    50% {
        transform: translateY(0);
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100%);
        opacity: 0;
    }
}
`;

export default function ScrollButton() {
    const [scrollDirection, setScrollDirection] = useState("down"); // "down" o "up"
    const [isVisible, setIsVisible] = useState(false);
    const lastScrollY = useRef(0);

    // Monitorear posición y dirección del scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const distanceToBottom = documentHeight - currentScrollY - windowHeight;
            
            // Mostrar el botón después de un pequeño scroll (100px)
            setIsVisible(currentScrollY > 100);
            
            // Si estamos en el fondo de la página, forzar dirección "up"
            if (distanceToBottom < 50) {
                setScrollDirection("up");
            }
            // Si estamos en el top de la página, forzar dirección "down"
            else if (currentScrollY < 50) {
                setScrollDirection("down");
            }
            // En el medio, detectar dirección del scroll del usuario
            else if (currentScrollY > lastScrollY.current) {
                setScrollDirection("down");
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection("up");
            }
            
            // Guardar posición actual para la próxima comparación
            lastScrollY.current = currentScrollY;
        };

        // Ejecutar una vez al montar
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Manejar click del botón
    const handleClick = () => {
        if (scrollDirection === "down") {
            // Scroll hacia abajo (al final de la página)
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth"
            });
        } else {
            // Scroll hacia arriba (al inicio de la página)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    const isDown = scrollDirection === "down";

    return (
        <>
            {/* Inyectar keyframes en el documento */}
            <style>{slideDownKeyframes}</style>
            
            {/* Botón flotante */}
            <button
                onClick={handleClick}
                className={`
                    fixed bottom-8 right-8 z-50
                    w-10 h-10
                    bg-transparent
                    rounded-full
                    flex items-center justify-center
                    overflow-hidden
                    cursor-pointer
                    transition-all duration-900 ease-in-out 
                    hover:scale-105
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
                `}
                aria-label={isDown ? "Ir al final de la página" : "Ir al inicio de la página"}
            >
                {/* Contenedor de la flecha con animación */}
                <div
                    style={{
                        animation: `${isDown ? "slideDown" : "slideUp"} 1.5s ease-in-out infinite`
                    }}
                >
                    {isDown ? (
                        <TbArrowNarrowDown className="w-7 h-7 text-sky-500" />
                    ) : (
                        <TbArrowNarrowUp className="w-7 h-7 text-sky-500" />
                    )}
                </div>
            </button>
        </>
    );
}
