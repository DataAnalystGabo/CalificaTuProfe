import React, { useState, useEffect, useRef } from 'react';
import { FaHeadSideCough } from "react-icons/fa6";
import { FaCompassDrafting } from "react-icons/fa6";
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Target from './components/Target';
import PillBadge from './components/PillBadge';
import ReviewsCarousel from './components/ReviewsCarousel';

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
                threshold: 0,
                rootMargin: "0px 0px 800px 0px"
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
                <div className="max-w-lg mx-auto p-4 text-left flex flex-col items-start">

                    <h2 ref={titleRef} className={`text-4xl font-extrabold mb-4 text-stone-700 ${
                    isVisible ? 'animate-typewriter' : 'opacity-0'}`}>Asimetría de Poder</h2>

                    <PillBadge
                        text="Buscando el equilibrio"
                        bgColor="bg-emerald-100"
                        borderColor="border-emerald-500"
                        textColor="text-emerald-800"
                    />

                    <p className="text-lg mt-4 mb-8 text-left text-stone-500">
                        <strong>¿Alguna vez quisiste dar una crítica constructiva y sincera pero te detuvo el miedo?</strong> La relación en el ámbito universitario a menudo es una calle de sentido único: el profesor evalúa tu futuro, mientras tu experiencia se queda sin voz. Este desbalance fomenta el silencio y la resignación ante la baja calidad pedagógica. Esto no solo es injusto para el estudiante, sino que degrada la excelencia en la enseñanza. <strong>Es hora de darle la vuelta a esa dinámica.</strong>
                    </p>
                </div>

                <div className="max-w-lg mx-auto p-4 text-left flex flex-col items-start">

                    <h2 ref={titleRef} className={`text-4xl font-extrabold mb-4 text-stone-700 ${
                    isVisible ? 'animate-typewriter' : 'opacity-0'}`}>Anonimidad Total</h2>

                    <PillBadge
                        icon={FaHeadSideCough}
                        text="Promoviendo la libertad de expresión"
                        bgColor="bg-violet-100"
                        borderColor="border-violet-500"
                        textColor="text-violet-800"
                    />

                    <p className="text-lg mt-4 mb-8 text-left text-stone-500">
                        <strong>Nuestra misión es simple: construir un ecosistema académico basado en la transparencia.</strong> Hemos creado un espacio donde tu experiencia tiene un peso real, sin riesgo personal alguno. Garantizamos el anonimato total de cada reseña para que la sinceridad sea tu única preocupación. Al empoderar a miles de alumnos anónimos, la calidad pedagógica se convierte en el nuevo estándar. Es la libertad de expresión, finalmente, aplicada a tu educación. 
                    </p>
                </div>

                <div className="max-w-lg mx-auto p-4 text-left flex flex-col items-start">

                    <h2 ref={titleRef} className={`text-4xl font-extrabold mb-4 text-stone-700 ${
                    isVisible ? 'animate-typewriter' : 'opacity-0'}`}>Decisiones Justas</h2>

                    <PillBadge
                        icon={FaCompassDrafting}
                        text="Democratizando la información"
                        bgColor="bg-amber-100"
                        borderColor="border-amber-500"
                        textColor="text-amber-800"
                    />

                    <p className="text-lg mt-4 mb-8 text-left text-stone-500">
                        Nunca más tendrás que inscribirte en una clase sin saber a lo que te enfrentas. <strong>Accede a miles de reseñas honestas que te permiten anticipar y planificar tu camino académico.</strong> Elige a los profesores que genuinamente inspiran y evita aquellos que dificultan tu progreso. Tu participación anónima genera una herramienta colectiva que beneficia a toda la comunidad. Juntos, elevamos el nivel de exigencia, empujando a la universidad hacia la excelencia académica.
                    </p>
                </div>
            </section>

            <section className="w-full max-w-7xl mx-auto py-16 bg-stone-50 overflow-hidden mb-10">
                <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                    <h3 className="text-3xl font-bold text-stone-700">Lo que dicen los estudiantes</h3>
                </div>

                <ReviewsCarousel/>
            </section>
        </div>
    );
}

export default App;