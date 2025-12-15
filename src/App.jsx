import React, { useState, useEffect, useRef } from 'react';
import { FaHeadSideCough } from "react-icons/fa6";
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Target from './components/Target';
import PillBadge from './components/PillBadge';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    function useIsVisible() {
        const [isVisible, setIsVisible] = useState(false);
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            }, {
                threshold: 0.5,
                rootMargin: "0px 0px -100px 0px"
            });

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect()
        }, []);

        return { ref, isVisible }
    }

    const { ref: titleRef, isVisible } = useIsVisible()

    return (
        <div className="min-h-screen flex flex-col">
            
            {/* Componentes de Navegación */}
            <Header onMenuToggle={toggleMenu}/>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

            {/* Sección Principal (Main) */}
            <main className="w-full max-w-7xl mx-auto h-full overflow-hidden max-h-[80vh] bg-stone-50">

                <div className="max-w-lg mx-auto p-4 relative">

                    {/* Texto principal (z-20 para estar por encima de todo) */}
                    <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full p-6 text-center">
                        <h2 className="text-5xl font-extrabold mb-4 leading-snug text-stone-700 animate-slide-right">
                            Descubrí la verdad sobre cada clase.
                        </h2>
                        <p className="text-lg mb-8 max-w-sm text-stone-500 animate-delay-500 animate-slide-left">
                            La plataforma anónima donde los estudiantes evalúan a sus profesores, tal como ellos a nosotros.
                        </p>
                        <a 
                            href="#" 
                            className="bg-sky-500 border border-sky-500 text-white text-lg font-medium px-8 py-3 rounded-xl hover:bg-sky-400 transition duration-150 shadow-lg"
                            onClick={() => console.log('CTA Principal: Registro')}
                        >
                            Ver reseñas
                        </a>
                    </div>

                    {/* Tarjeta dispersa 1 */}
                    <div className="absolute top-[10%] left-[-60%] opacity-0 transform -rotate-350 z-0 animate-fade-target-1">
                        <Target
                            teacherName={"Prof. Julieta Prandi"}
                            university={"UNAB"}
                            subjectName={"Comercio Electrónico"}
                            qcomment={"+15 reseñas"}
                            comment={"Sus clases son un placer."}
                            rating={4}
                        />
                    </div>

                    {/* Tarjeta dispersa 2 */}
                    <div className="absolute top-[10%] left-[125%] opacity-0 transform -rotate-20 z-0 animate-fade-target-2">
                        <Target
                            teacherName={"Prof. Mariana Bayeslian"}
                            university={"UNAB"}
                            subjectName={"Inteligencia Artificial"}
                            qcomment={"+25 reseñas"}
                            comment={"Su forma de explicar los conceptos es incomparable."}
                            rating={3}
                        />
                    </div>

                    {/* Tarjeta dispersa 3 */}
                    <div className="absolute top-[60%] left-[-60%] opacity-0 transform -rotate-350 z-0 animate-fade-target-3 animate-delay-300">
                        <Target
                            teacherName={"Prof. Florencia Statti"}
                            university={"UNAB"}
                            subjectName={"Inf. Estad. & Rec. de Patrones"}
                            qcomment={"+5 reseñas"}
                            comment={"Flor es extremadamente rigurosa al describir las matemáticas."}
                            rating={5}
                        />
                    </div>

                    {/* Tarjeta dispersa 4 */}
                    <div className="absolute top-[70%] right-[-40%] opacity-0 transform -rotate-30 z-0 animate-fade-target-4">
                        <Target
                            teacherName={"Prof. Margaret Colapinto"}
                            university={"UNAB"}
                            subjectName={"Inglés Técnico"}
                            qcomment={"+35 reseñas"}
                            comment={"Su inglés es una exquisitez. La recomiendo para aprender de verdad."}
                            rating={2}
                        />
                    </div>
                </div>
            </main>
            
            <section className="w-full max-w-7xl mx-auto py-16 bg-white">
                <div className="max-w-lg mx-auto p-4 text-center flex flex-col items-center">

                    <h2 ref={titleRef} className={`text-4xl font-extrabold mb-4 text-stone-700 ${
                    isVisible ? 'animate-typewriter' : 'opacity-0'}`}>Nuestra misión</h2>

                    <PillBadge
                        text="Equilibrando poderes"
                        bgColor="bg-emerald-100"
                        borderColor="border-emerald-500"
                        textColor="text-emerald-800"
                    />

                    <p className="text-lg mt-4 mb-8 text-stone-500">
                        ¿Cuántas veces callaste una crítica constructiva por miedo a un impacto negativo en tu nota o relación con un docente? El desequilibrio de poder actual obliga a la obediencia sobre la honestidad. Nosotros rompemos esa regla. Nuestra plataforma te da la <strong>libertad de ser brutalmente honesto</strong> —o genuinamente elogioso— <strong>sin revelar tu identidad</strong>. Desde el anonimato, empoderamos al alumno, y trabajamos por una relación profesor-estudiante de excelencia basada en la calidad pedagógica y el respeto mutuo. 
                    </p>
                </div>

                <div className="max-w-lg mx-auto p-4 text-center flex flex-col items-center">

                    <h2 ref={titleRef} className={`text-4xl font-extrabold mb-4 text-stone-700 ${
                    isVisible ? 'animate-typewriter' : 'opacity-0'}`}>Vos sos anónimo</h2>

                    <PillBadge
                        icon={FaHeadSideCough}
                        text="Promoviendo la libertad de expresión"
                        bgColor="bg-violet-100"
                        borderColor="border-violet-500"
                        textColor="text-violet-800"
                    />

                    <p className="text-lg mt-4 mb-8 text-stone-500">
                        <strong>CalificáTuProfe garantiza la anonimidad</strong> para quienes leen o dejan una reseña. No recopilamos ni publicamos tus datos. <strong>Sos libre, sos anónimo</strong> y tenés la posibilidad de construir una comunidad que ayude a premiar el trabajo de quienes tienen la enorme tarea de transmitir su conocimiento y a mejorar su desempeño en el aula con críticas constructivas. 
                    </p>
                </div>
            </section>
        </div>
    );
}

export default App;