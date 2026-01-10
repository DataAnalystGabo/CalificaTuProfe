import React, { useState } from "react";
import Search from "../components/Search";
import Button from "../components/Button";
import TeacherCard from "../components/TeacherCard";

// --- Datos de ejemplo ---
const PROFESORES_MOCK = [
    { 
        id: 1, 
        nombre: "Laura Gómez", 
        universidad: "UNAB", 
        materia: "Análisis II", 
        rating: 5, 
        reviews: "12 reseñas",
        comment: "Excelente profesora, explica todo con mucha paciencia.",
        date: "Hace muy poco",
        tags: ["Amable", "Puntual", "Clases claras"]
    },
    { 
        id: 2, 
        nombre: "Mario Rossi", 
        universidad: "UBA", 
        materia: "Anatomía", 
        rating: 2, 
        reviews: "45 reseñas",
        comment: "Muy exigente y las clases son un poco desorganizadas.",
        date: "Hace 1 semana",
        tags: ["Exigente", "Desorganizado"]
    },
    { 
        id: 3, 
        nombre: "Esteban Quito",
        universidad: "UTN", 
        materia: "Algoritmos", 
        rating: 3, 
        reviews: "8 reseñas",
        comment: "El contenido es bueno pero el ritmo es demasiado rápido.",
        date: "Hace 5 días",
        tags: ["Puntual", "Desorganizado", "Lento explicando"]
    },
    { 
        id: 4, 
        nombre: "Lucía Fernández",
        universidad: "UNLP", 
        materia: "Física I", 
        rating: 4, 
        reviews: "19 reseñas",
        comment: "Muy recomendada para entender los conceptos base.",
        date: "Hace 12 días",
        tags: ["Impuntual", "Poco exigente", "Lento"]
    },
    { 
        id: 5, 
        nombre: "Carlos Méndez", 
        universidad: "UCA", 
        materia: "Derecho Civil", 
        rating: 1, 
        reviews: "30 reseñas",
        comment: "Es casi imposible promocionar con él.",
        date: "Hace 2 días",
        tags: ["Imparcial", "Carismático", "Amigable"]
    },
];

export default function Explorar() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProfessors = PROFESORES_MOCK.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.universidad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div className="w-full min-h-screen bg-stone-50 pt-16">

            {/* Barra de Control */}
            <div className="sticky top-17 z-20 py-8 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
                <div className="max-w-2xl mx-auto flex flex-col gap-6 px-4">
                    <Search 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="w-full flex flex-wrap justify-start gap-2">
                        <Button
                            onClick={() => console.log("Filtro Facultad")}
                        >
                            Universidad
                        </Button>

                        <Button
                            onClick={() => console.log("Filtro Materia")}
                        >
                            Materia
                        </Button>

                        <Button
                            onClick={() => console.log("Filtro Profesor")}
                        >
                            Profesor
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenido Principal / Grilla de Resultados */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-stone-700 uppercase tracking-tight">
                        Explorar reseñas
                    </h2>
                    <p className="text-stone-400 text-sm">
                        {filteredProfessors.length} resultados encontrados
                    </p>
                </div>

                {filteredProfessors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {filteredProfessors.map(prof => (
                            <TeacherCard 
                                rating={prof.rating}
                                comment={prof.comment}
                                qcomment={prof.reviews}
                                teacherName={prof.nombre}
                                subjectName={prof.materia}
                                university={prof.universidad}
                                key={prof.id}
                                width="w-full"
                                date={prof.date}
                                tagsPillBadge={prof.tags}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className="text-stone-400 font-medium text-lg">No encontramos resultados para tu búsqueda.</p>
                    </div>
                )}
            </main>
        </div>
    )
}