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
        let mounted = true;
        let timeoutId;

        const fetchProfessors = async () => {

            if (mounted) setLoading(true);

            try {
                // Ejecutamos la consulta directamente
                const data = await getTeacherSummary();
                if (mounted) setProfessors(data || []);
            } catch (error) {
                console.error("Error capturado:", error.message);
                if (mounted) setProfessors([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        // Si authLoading ya terminó, carga inmediatamente
        if (!authLoading) {
            fetchProfessors();
        } else {
            // Si no, espera máximo 4 segundos y carga igual
            console.log('[DiscoverReviews] Esperando auth...');
            timeoutId = setTimeout(() => {
                console.warn('[DiscoverReviews] Auth timeout - cargando datos');
                fetchProfessors();
            }, 4000);
        }

        return () => {
            mounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [authLoading]);

    // Filtrado sobre los datos recibidos desde Supabase para el buscador
    const filteredProfessors = professors.filter(p =>
        (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.university?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
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
                </div>

                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                        <div className="text-stone-400 font-medium animate-pulse text-lg">Cargando profesores...</div>
                    </div>
                ) : filteredProfessors.length > 0 ? (
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