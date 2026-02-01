import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTeacherHeaderInfo, getTeacherReviews } from "../services/reviewService";
import TeacherHeader from "../components/TeacherHeader";
import ReviewCard from "../components/ReviewCard";
import { IoArrowBack } from "react-icons/io5";

export default function TeacherReviewsPage() {
    const { id } = useParams(); // teacher_subject_id
    const { isAuthenticated, sessionReady, loading: authLoading } = useAuth();
    
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated || !id) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch ambos en paralelo
                const [headerData, reviewsData] = await Promise.all([
                    getTeacherHeaderInfo(id),
                    getTeacherReviews(id)
                ]);

                setTeacherInfo(headerData);
                setReviews(reviewsData);

            } catch (err) {
                console.error("[TeacherReviewsPage] Error loading data:", err);
                setError("No pudimos cargar la información del profesor. Verifica que el enlace sea correcto.");
            } finally {
                setLoading(false);
            }
        };

        if (sessionReady && isAuthenticated) {
            fetchData();
        }
    }, [sessionReady, isAuthenticated, id]);

    // Pantalla de carga de autenticación
    if (authLoading) {
        return (
            <div className="w-full min-h-screen bg-stone-50 pt-16 flex items-center justify-center">
                <div className="text-stone-400 font-medium animate-pulse text-lg">
                    Verificando sesión...
                </div>
            </div>
        );
    }

    // Pantalla de error
    if (error) {
        return (
            <div className="w-full min-h-screen bg-stone-50 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-stone-500 font-medium text-lg mb-6">
                            {error}
                        </p>
                        <Link
                            to="/explorar"
                            className="flex items-center gap-2 text-sky-500 font-semibold hover:text-sky-600 transition-colors"
                        >
                            <IoArrowBack className="w-5 h-5" />
                            Volver a Explorar
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-stone-50 pt-16">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Botón Volver */}
                <Link
                    to="/explorar"
                    className="inline-flex items-center gap-2 text-stone-500 hover:text-sky-500 font-medium mb-6 transition-colors"
                >
                    <IoArrowBack className="w-5 h-5" />
                    Volver a Explorar
                </Link>

                {/* Header del Profesor */}
                <TeacherHeader 
                    teacherInfo={teacherInfo} 
                    isLoading={loading} 
                />

                {/* Lista de Reseñas */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-stone-700 mb-6">
                        Todas las reseñas
                    </h2>

                    {loading ? (
                        // Skeletons de carga
                        <div className="flex flex-col gap-4">
                            {[...Array(3)].map((_, i) => (
                                <ReviewCard key={`skeleton-${i}`} isLoading={true} />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {reviews.map(review => (
                                <ReviewCard 
                                    key={review.id} 
                                    review={review} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-stone-400 font-medium">
                                Este profesor aún no tiene reseñas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
