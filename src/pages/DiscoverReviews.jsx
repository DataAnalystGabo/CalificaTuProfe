import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Button from "../components/Button";
import TeacherCard from "../components/TeacherCard";
import FilterModal from "../components/common/FilterModal";
import { getTeacherSummary, getDistinctFilters } from "../services/teacherService";
import { formatRelativeDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";

export default function DiscoverReviews() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [professors, setProfessors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Estados de la paginación
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 12;

    // Estados de Filtros
    const [activeFilter, setActiveFilter] = useState(null); // 'universities', 'subjects', 'teachers'
    const [filterOptions, setFilterOptions] = useState({ universities: [], subjects: [], teachers: [] });
    const [selectedFilters, setSelectedFilters] = useState({ universities: [], subjects: [], teachers: [] });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Resetear a la página uno en una nueva búsqueda
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Cargar opciones de filtros al montar
    useEffect(() => {
        const loadFilters = async () => {
             const options = await getDistinctFilters();
             setFilterOptions(options);
        };
        if (isAuthenticated) {
            loadFilters();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let mounted = true;

        const fetchProfessors = async () => {
            if (!isAuthenticated) return;
            
            setLoading(true);
            try {
                const { data, count } = await getTeacherSummary({ 
                    page, 
                    pageSize: PAGE_SIZE, 
                    searchTerm: debouncedSearch,
                    filters: selectedFilters
                });

                if (mounted) {
                    setProfessors(data);
                    setTotalCount(count);
                    setTotalPages(Math.ceil(count / PAGE_SIZE));
                }
            } catch (error) {
                console.error("[DiscoverReviews] Error loading teachers:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        if (!authLoading && isAuthenticated) {
            fetchProfessors();
        }

        return () => { mounted = false; };
    }, [authLoading, isAuthenticated, page, debouncedSearch, selectedFilters]);

    const handleApplyFilter = (items) => {
        setSelectedFilters(prev => ({
            ...prev,
            [activeFilter]: items
        }));
        setPage(1); // Resetear a pagina 1 al filtrar
        // El modal se cierra automáticamente por el callback en FilterModal, pero podemos asegurarlo o dejar que FilterModal solo llame onApply
        // En mi implementación de FilterModal, handleApply hace onApply(selected) y luego onClose().
    };

    // Helper para obtener el título y opciones del modal activo
    const getModalProps = () => {
        switch (activeFilter) {
            case 'universities':
                return { title: 'Filtrar por Universidad', options: filterOptions.universities };
            case 'subjects':
                return { title: 'Filtrar por Materia', options: filterOptions.subjects };
            case 'teachers':
                return { title: 'Filtrar por Profesor', options: filterOptions.teachers };
            default:
                return { title: '', options: [] };
        }
    };

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

    const { title: modalTitle, options: modalOptions } = getModalProps();

    return (
        <div className="w-full min-h-screen bg-stone-50 pt-16">
            <div className="sticky top-17 z-20 py-8 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all">
                <div className="max-w-2xl mx-auto flex flex-col gap-6 px-4">
                    <Search
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="w-full flex flex-wrap justify-start gap-2">
                        <Button 
                            active={selectedFilters.universities.length > 0}
                            onClick={() => setActiveFilter('universities')}
                        >
                            Universidad {selectedFilters.universities.length > 0 && `(${selectedFilters.universities.length})`}
                        </Button>
                        <Button 
                            active={selectedFilters.subjects.length > 0}
                            onClick={() => setActiveFilter('subjects')}
                        >
                            Materia {selectedFilters.subjects.length > 0 && `(${selectedFilters.subjects.length})`}
                        </Button>
                        <Button 
                            active={selectedFilters.teachers.length > 0}
                            onClick={() => setActiveFilter('teachers')}
                        >
                            Profesor {selectedFilters.teachers.length > 0 && `(${selectedFilters.teachers.length})`}
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8 flex justify-between items-end">
                    <h2 className="text-2xl font-black text-stone-700 uppercase tracking-tight">
                        Explorar reseñas
                    </h2>
                    {!loading && (
                        <span className="text-stone-500 text-sm font-medium">
                            {totalCount} resultados
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {[...Array(6)].map((_, i) => (
                            <TeacherCard key={`skeleton-${i}`} isLoading={true} width="w-full" />
                        ))}
                    </div>
                ) : professors.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mb-12">
                            {professors.map(prof => {
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
                        
                        {/* Controles de Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-4">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Anterior
                                </button>
                                <span className="text-stone-600 font-medium">
                                    Página {page} de {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <p className="text-stone-400 font-medium text-lg">
                            No encontramos resultados para tu búsqueda.
                        </p>
                    </div>
                )}
            </main>

            {/* Modal de Filtros */}
            <FilterModal
                isOpen={!!activeFilter}
                onClose={() => setActiveFilter(null)}
                title={modalTitle}
                options={modalOptions}
                initialSelected={activeFilter ? selectedFilters[activeFilter] : []}
                onApply={handleApplyFilter}
            />

        </div >
    );
}