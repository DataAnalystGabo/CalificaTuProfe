import React, { useState, useEffect } from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { TbArrowBigUpLines, TbArrowBigDownLines } from "react-icons/tb";
import PillBadge from "./PillBadge";
import { getTagConfig } from "../utils/tagIcons";
import { formatRelativeDate } from "../utils/formatDate";
import { getUserVote, submitVote, deleteVote } from "../services/teacherService";
import { useAuth } from "../context/AuthContext";

// Componente de estrellas (pequeño para las cards)
const StarRating = ({ rating = 0, maxRating = 5 }) => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        let StarIcon = IoIosStarOutline;
        let starColor = "text-stone-300";

        if (rating >= i) {
            StarIcon = IoIosStar;
            starColor = "text-yellow-400";
        } else if (rating >= i - 0.5) {
            StarIcon = IoIosStarHalf;
            starColor = "text-yellow-400";
        }

        stars.push(
            <StarIcon key={i} className={`h-4 w-4 ${starColor}`} />
        );
    }

    return <div className="flex space-x-0.5">{stars}</div>;
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
        rating, 
        positive_comment, 
        constructive_comment, 
        created_at, 
        tags = [], 
        nickname = 'Anónimo',
        helpful_score = 0 
    } = review || {};

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
                    {/* Header: Rating y Fecha */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-auto flex flex-row px-3 py-0.5 gap-2 items-center justify-center bg-stone-50 rounded-2xl border border-stone-400">
                                <span className="font-bold text-stone-600">
                                    {Number(rating).toFixed(1)}
                                </span>
                                <StarRating rating={rating} />
                            </div>
                        </div>
                        <span className="text-sm text-stone-400">
                            {relativeDate}
                        </span>
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
