import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Button from "../components/Button";
import TeacherCard from "../components/TeacherCard";
import { getTeacherSummary } from "../services/teacherService";
import { formatRelativeDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";

export default function DiscoverReviews() {
    // Obtener el estado de autenticarión real
    const { isAuthenticated, loading: authLoading } = useAuth();

    // Estados para los datos de la DB y el estado de cara
    const [professors, setProfessors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Efecto par cargar los datos al montar el componente
    useEffect(() => {
        const fetchProfessors = async () => {
            if (authLoading) return;
            
            console.log("Iniciando fetchProfessors...");
            setLoading(true);

            // Creamos una promesa que se resuelve en 5 segundos para no quedar trabados
            const timeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Tiempo de espera agotado")), 5000)
            );

            try {
                // Ejecutamos la consulta y el timeout en carrera
                const data = await Promise.race([getTeacherSummary(), timeout]);
                console.log("Datos de profesores recuperados.");
                setProfessors(data || []);
            } catch (error) {
                console.error("Error capturado:", error.message);
                setProfessors([]);
            } finally {
                console.log("Finalizando carga.");
                setLoading(false);
            }
        };

        fetchProfessors();
    }, [authLoading]);

    // Filtrado sobre los datos recibidos desde Supabase para el buscador
    const filteredProfessors = professors.filter(p =>
        (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.university?.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        {loading ? "Cargando...": `${filteredProfessors.length} resultados encontrados`}
                    </p>
                </div>

                {filteredProfessors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {filteredProfessors.map(prof => (
                            <TeacherCard 
                                key={prof.teacher_subject_id}
                                rating={prof.average_rating || 0}
                                positiveComment={prof.latest_positive}
                                constructiveComment={prof.latest_constructive}
                                qcomment={`${prof.total_reviews} reseñas`}
                                teacherName={prof.full_name}
                                subjectName={prof.subject_name}
                                university={prof.university}
                                width="w-full"
                                reviewDate={formatRelativeDate(prof.last_review_date)}
                                tagsPillBadge={[]}
                                isAuthenticated={isAuthenticated}
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
};