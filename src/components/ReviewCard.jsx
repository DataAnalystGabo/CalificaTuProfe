import React, { useState, useEffect } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { TbArrowBigUpLines, TbArrowBigDownLines } from "react-icons/tb";
import PillBadge from "./PillBadge";
import { getTagConfig } from "../utils/tagIcons";
import { formatRelativeDate } from "../utils/formatDate";
import { getUserVote, submitVote, deleteVote } from "../services/reviewService";
import { useAuth } from "../context/AuthContext";

// Mapeo de categorías con labels en español
const RATING_CATEGORIES = [
    { key: 'clarity_rating', label: 'Claridad' },
    { key: 'kindness_rating', label: 'Amabilidad' },
    { key: 'difficulty_rating', label: 'Dificultad' },
    { key: 'availability_rating', label: 'Disponibilidad' },
    { key: 'material_rating', label: 'Material' }
];

// Helper para obtener color según el valor del rating
const getRatingColor = (value) => {
    if (value <= 2) return 'bg-orange-400';
    if (value === 3) return 'bg-amber-200';
    return 'bg-emerald-400';
};

// Componente de barras de rating por categoría
const RatingBarsBreakdown = ({ ratings }) => {
    return (
        <div className="flex flex-col gap-2">
            {RATING_CATEGORIES.map(({ key, label }) => {
                const value = ratings[key] || 0;
                const widthPercent = (value / 5) * 100;
                const colorClass = getRatingColor(value);

                return (
                    <div key={key} className="flex items-center gap-3">
                        <span className="text-sm text-stone-600 w-24 shrink-0">
                            {label}
                        </span>
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${colorClass} rounded-full transition-all`}
                                style={{ width: `${widthPercent}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-stone-600 w-6 text-right">
                            {value.toFixed(1)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// Skeleton para la card
function ReviewCardSkeleton() {
    return (
        <div className="w-full bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
            <div className="flex gap-4">
                {/* Voting sidebar skeleton */}
                <div className="flex flex-col items-center justify-center gap-1 w-8">
                    <div className="h-6 w-6 bg-stone-200 rounded"></div>
                    <div className="h-4 w-4 bg-stone-200 rounded"></div>
                    <div className="h-6 w-6 bg-stone-200 rounded"></div>
                </div>
                {/* Content skeleton */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-24 bg-stone-200 rounded"></div>
                            <div className="h-4 w-16 bg-stone-100 rounded"></div>
                        </div>
                        <div className="h-4 w-20 bg-stone-100 rounded"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-20 bg-emerald-50 rounded-r-md border-l-4 border-emerald-300"></div>
                        <div className="h-20 bg-amber-50 rounded-r-md border-l-4 border-amber-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReviewCard({
    review,
    isLoading = false
}) {
    const { user } = useAuth();
    const [userVote, setUserVote] = useState(null); // 1, -1, or null
    const [displayScore, setDisplayScore] = useState(0);
    const [isVoting, setIsVoting] = useState(false);

    // Extraer datos del review
    const { 
        id: reviewId,
        clarity_rating,
        kindness_rating,
        difficulty_rating,
        availability_rating,
        material_rating,
        positive_comment, 
        constructive_comment, 
        created_at, 
        tags = [], 
        nickname = 'Anónimo',
        helpful_score = 0 
    } = review || {};

    // Agrupar ratings para el componente de barras
    const ratings = {
        clarity_rating,
        kindness_rating,
        difficulty_rating,
        availability_rating,
        material_rating
    };

    // Inicializar score y cargar voto del usuario
    useEffect(() => {
        setDisplayScore(helpful_score);
        
        if (user?.id && reviewId) {
            getUserVote(reviewId, user.id).then(vote => {
                setUserVote(vote);
            });
        }
    }, [reviewId, user?.id, helpful_score]);

    // Manejar click en upvote
    const handleUpvote = async () => {
        if (!user?.id || isVoting) return;
        setIsVoting(true);

        try {
            if (userVote === 1) {
                // Ya votó positivo, eliminar voto
                await deleteVote(reviewId, user.id);
                setDisplayScore(prev => prev - 1);
                setUserVote(null);
            } else {
                // Nuevo voto o cambio de voto
                const previousVote = userVote;
                await submitVote(reviewId, user.id, 1);
                setDisplayScore(prev => prev + 1 + (previousVote === -1 ? 1 : 0));
                setUserVote(1);
            }
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setIsVoting(false);
        }
    };

    // Manejar click en downvote
    const handleDownvote = async () => {
        if (!user?.id || isVoting) return;
        setIsVoting(true);

        try {
            if (userVote === -1) {
                // Ya votó negativo, eliminar voto
                await deleteVote(reviewId, user.id);
                setDisplayScore(prev => prev + 1);
                setUserVote(null);
            } else {
                // Nuevo voto o cambio de voto
                const previousVote = userVote;
                await submitVote(reviewId, user.id, -1);
                setDisplayScore(prev => prev - 1 - (previousVote === 1 ? 1 : 0));
                setUserVote(-1);
            }
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setIsVoting(false);
        }
    };

    if (isLoading || !review) {
        return <ReviewCardSkeleton />;
    }

    const relativeDate = formatRelativeDate(created_at);

    return (
        <div className="w-full bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Voting Sidebar */}
                <div className="flex flex-col justify-center items-center gap-1 pt-1">
                    {/* Upvote */}
                    <button
                        onClick={handleUpvote}
                        disabled={isVoting || !user}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            userVote === 1
                                ? 'text-emerald-500'
                                : 'text-stone-300 hover:text-emerald-300'
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={user ? "Útil" : "Inicia sesión para votar"}
                    >
                        <TbArrowBigUpLines className="h-6 w-6" />
                    </button>

                    {/* Score */}
                    <span className={`text-sm font-bold ${
                        displayScore > 0 ? 'text-emerald-500' :
                        displayScore < 0 ? 'text-red-500' :
                        'text-stone-400'
                    }`}>
                        {displayScore}
                    </span>

                    {/* Downvote */}
                    <button
                        onClick={handleDownvote}
                        disabled={isVoting || !user}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                            userVote === -1
                                ? 'text-red-500'
                                : 'text-stone-300 hover:text-red-300'
                        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={user ? "No útil" : "Inicia sesión para votar"}
                    >
                        <TbArrowBigDownLines className="h-6 w-6" />
                    </button>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                    {/* Header: Fecha */}
                    <div className="flex justify-end mb-4">
                        <span className="text-sm text-stone-400">
                            {relativeDate}
                        </span>
                    </div>

                    {/* Rating Bars Breakdown */}
                    <div className="mb-4 p-3 bg-white rounded-lg border border-stone-200">
                        <RatingBarsBreakdown ratings={ratings} />
                    </div>

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag, index) => {
                                const config = getTagConfig(tag.name);
                                return (
                                    <PillBadge
                                        key={tag.id || index}
                                        icon={config.icon}
                                        text={tag.name}
                                        bgColor={config.bgColor}
                                        borderColor={config.borderColor}
                                        textColor={config.textColor}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Comentarios */}
                    <div className="flex flex-col gap-3">
                        {/* Bloque positivo */}
                        {positive_comment && (
                            <div className="flex flex-col justify-center px-4 py-4 gap-2 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-md">
                                <div className="flex items-center gap-1">
                                    <AiOutlineLike className="h-4 w-4 text-emerald-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                        Lo mejor
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    "{positive_comment}"
                                </p>
                            </div>
                        )}

                        {/* Bloque constructivo */}
                        {constructive_comment && (
                            <div className="flex flex-col justify-center px-4 py-4 gap-2 border-l-4 border-amber-400 bg-amber-50 rounded-r-md">
                                <div className="flex items-center gap-1">
                                    <AiOutlineDislike className="h-4 w-4 text-amber-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                                        Podría mejorar
                                    </span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed italic">
                                    "{constructive_comment}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Autor de la reseña */}
                    <div className="flex justify-end mt-4 pt-3 border-t border-stone-100">
                        <span className="text-sm text-stone-400">
                            Publicado por <span className="font-medium text-stone-500">{nickname}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
