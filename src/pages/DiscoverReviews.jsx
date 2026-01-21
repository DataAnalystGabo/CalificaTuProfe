import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Button from "../components/Button";
import TeacherCard from "../components/TeacherCard";
import { getTeacherSummary, getLocalTeacherCache } from "../services/teacherService";
import { formatRelativeDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";

export default function DiscoverReviews() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [professors, setProfessors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        let timeoutId;

        const fetchProfessors = async () => {
            // Evitamos cargar datos si no hay usuario autenticado
            if (!isAuthenticated) return;

            if (mounted) setLoading(true);

            // Variable para controlar si ya mostramos datos (para evitar "parpadeo" si la red responde justo después del caché)
            let dataShown = false;

            // RACE STRATEGY:
            // 1. Iniciamos la petición a RED.
            const networkPromise = getTeacherSummary()
                .then(data => ({ source: 'network', data }))
                .catch(error => ({ source: 'network', error }));

            // 2. Iniciamos un TIMER de fallback (ej: 2.5 segundos).
            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ source: 'timeout' }), 2500));

            // 3. Esperamos a que gane el primero (o red rápida o el timer).
            const winner = await Promise.race([networkPromise, timeoutPromise]);

            if (winner.source === 'timeout') {
                console.warn("[DiscoverReviews] Red lenta. Intentando mostrar caché local mientras la red termina...");
                const cachedData = getLocalTeacherCache();
                if (cachedData && mounted && !dataShown) {
                    setProfessors(cachedData);
                    setLoading(false); // Quitamos skeleton
                    dataShown = true;
                }
            } else if (winner.source === 'network' && !winner.error) {
                // Red ganó y fue exitosa
                console.log("[DiscoverReviews] Red respondió rápido. Mostrando datos frescos.");
                if (mounted) {
                    setProfessors(winner.data || []);
                    setLoading(false);
                    dataShown = true;
                    // Ya terminamos, no necesitamos esperar nada más (salvo que quieras asegurar que el otro promise no afecte, pero aquí es lineal)
                    return;
                }
            }

            // 4. Si ganó el timeout (ya mostramos caché), AÚN debemos esperar a la red para actualizar (o fallar).
            // O si la red ganó pero falló (error).
            if (winner.source === 'timeout' || (winner.source === 'network' && winner.error)) {
                // Si fue timeout, networkPromise sigue corriendo. Esperamos su resultado final.
                // Si fue error de red inmediato, ya lo tenemos.

                try {
                    const result = winner.source === 'network' ? winner : await networkPromise;

                    if (result.error) throw result.error;

                    // Si llegó data fresca y es diferente/nueva, actualizamos.
                    if (mounted) {
                        console.log("[DiscoverReviews] Datos frescos llegaron (post-timeout). Actualizando vista.");
                        setProfessors(result.data || []);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Fallo definitivo de red:", err.message);
                    // Si no habíamos mostrado nada (ni caché), ahora sí no queda otra que mostrar vacío o caché si existe y no se usó
                    if (mounted && !dataShown) {
                        const fallbackCache = getLocalTeacherCache();
                        setProfessors(fallbackCache || []);
                        setLoading(false);
                    }
                }
            }
        };

        if (!authLoading) {
            // Solo intentamos cargar si está autenticado
            if (isAuthenticated) {
                fetchProfessors();
            }
        } else {
            console.log("[DiscoverReviews] Esperando auth...");
            timeoutId = setTimeout(() => {
                // Validación adicional post-timeout
                if (isAuthenticated) {
                    console.warn("[DiscoverReviews] Auth timeout - cargando datos");
                    fetchProfessors();
                } else {
                    console.log("[DiscoverReviews] Auth timeout - usuario no autenticado, abortando carga.");
                }
            }, 4000);
        }

        return () => {
            mounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [authLoading]);

    const filteredProfessors = professors.filter(p =>
        (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.university?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Mostrar pantalla de verificación mientras valida sesión
    if (authLoading) {
        return (
            <div className="w-full min-h-screen bg-stone-50 pt-16 flex items-center justify-center">
                <div className="text-stone-400 font-medium animate-pulse text-lg">
                    Verificando sesión...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-stone-50 pt-16">
            <div className="sticky top-17 z-20 py-8 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
                <div className="max-w-2xl mx-auto flex flex-col gap-6 px-4">
                    <Search
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="w-full flex flex-wrap justify-start gap-2">
                        <Button onClick={() => console.log("Filtro Facultad")}>
                            Universidad
                        </Button>
                        <Button onClick={() => console.log("Filtro Materia")}>
                            Materia
                        </Button>
                        <Button onClick={() => console.log("Filtro Profesor")}>
                            Profesor
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-stone-700 uppercase tracking-tight">
                        Explorar reseñas
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {[...Array(6)].map((_, i) => (
                            <TeacherCard key={`skeleton-${i}`} isLoading={true} width="w-full" />
                        ))}
                    </div>
                ) : filteredProfessors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {filteredProfessors.map(prof => {
                            // Asumimos que top_tags viene como array de objetos desde Supabase
                            const topTags = Array.isArray(prof.top_tags) ? prof.top_tags : [];

                            return (
                                <TeacherCard
                                    key={prof.teacher_subject_id}
                                    isLoading={false}
                                    rating={prof.average_rating || 0}
                                    positiveComment={prof.latest_positive}
                                    constructiveComment={prof.latest_constructive}
                                    qcomment={`${prof.total_reviews} reseñas`}
                                    teacherName={prof.full_name}
                                    subjectName={prof.subject_name}
                                    university={prof.university}
                                    width="w-full"
                                    reviewDate={formatRelativeDate(prof.last_review_date)}
                                    topTags={topTags}
                                />
                            );
                        })}
                    </div>
                ) : (
                    < div >
                        <p className="text-stone-400 font-medium text-lg">
                            No encontramos resultados para tu búsqueda.
                        </p>
                    </div>
                )}
            </main >
        </div >
    );
}