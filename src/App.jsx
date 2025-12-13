import React, { useState } from 'react';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Target from './components/Target';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen flex flex-col">
            
            {/* Componentes de Navegación */}
            <Header onMenuToggle={toggleMenu} />
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

            {/* Sección Principal (Main) */}
            <main className="w-full max-w-7xl mx-auto h-full overflow-hidden max-h-[80vh]">

                <div className="max-w-lg mx-auto p-4 relative">

                    {/* Texto principal (z-20 para estar por encima de todo) */}
                    <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full p-6 text-center">
                        <h2 className="text-5xl font-extrabold mb-4 leading-snug text-stone-700">
                            Descubre la verdad sobre cada clase.
                        </h2>
                        <p className="text-lg mb-8 max-w-sm text-stone-500">
                            La plataforma anónima donde los estudiantes evalúan a sus profesores, tal como ellos a nosotros.
                        </p>
                        <a 
                            href="#" 
                            className="bg-white text-indigo-600 text-lg font-medium px-8 py-3 rounded-xl hover:bg-gray-100 transition duration-150 shadow-lg"
                            onClick={() => console.log('CTA Principal: Registro')}
                        >
                            Comienza Ahora
                        </a>
                    </div>

                    {/* Tarjeta dispersa 1 */}
                    <div className="absolute top-[10%] left-[-20%] transform -rotate-350 z-0">
                        <Target
                            teacherName={"Prof. Julieta Prandi"}
                            university={"UNAB"}
                            subjectName={"Comercio Electrónico"}
                            qcomment={"+15 reseñas"}
                            comment={"Sus clases son un placer."}
                            rating={2}
                        />
                    </div>

                    {/* Tarjeta dispersa 2 */}
                    <div className="absolute top-[10%] left-[70%] transform -rotate-20 z-0">
                        <Target
                            teacherName={"Prof. Mariana Bayeslian"}
                            university={"UNAB"}
                            subjectName={"Inteligencia Artificial"}
                            qcomment={"+25 reseñas"}
                            comment={"Se destaca por su brillantez en cada clase."}
                            rating={4}
                        />
                    </div>

                    {/* Tarjeta dispersa 3 */}
                    <div className="absolute top-[60%] left-[-30%] transform -rotate-350 z-0">
                        <Target
                            teacherName={"Prof. Florencia Statti"}
                            university={"UNAB"}
                            subjectName={"Inf. Estad. & Rec. de Patrones"}
                            qcomment={"+5 reseñas"}
                            comment={"Se destacar por su rigurosidad matemática en cada clase."}
                            rating={2}
                        />
                    </div>

                    {/* Tarjeta dispersa 4 */}
                    <div className="absolute top-[60%] right-[-40%] transform -rotate-30 z-0">
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
            
            {/* Puedes agregar aquí más secciones de la Landing Page */}
            
        </div>
    );
}

export default App;