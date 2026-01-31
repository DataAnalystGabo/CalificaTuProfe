import React from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import PillBadge from "./PillBadge";
import { getTagConfig } from "../utils/tagIcons";
import { formatRelativeDate } from "../utils/formatDate";

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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-24 bg-stone-200 rounded"></div>
                    <div className="h-4 w-16 bg-stone-100 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-stone-100 rounded"></div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 w-20 bg-stone-100 rounded-full"></div>
                <div className="h-6 w-24 bg-stone-100 rounded-full"></div>
            </div>
            <div className="space-y-3">
                <div className="h-20 bg-emerald-50 rounded-r-md border-l-4 border-emerald-300"></div>
                <div className="h-20 bg-amber-50 rounded-r-md border-l-4 border-amber-300"></div>
            </div>
        </div>
    );
}

export default function ReviewCard({
    review,
    isLoading = false
}) {
    if (isLoading || !review) {
        return <ReviewCardSkeleton />;
    }

    const { rating, positive_comment, constructive_comment, created_at, tags = [] } = review;
    const relativeDate = formatRelativeDate(created_at);

    return (
        <div className="w-full bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header: Rating y Fecha */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-auto flex flex-row px-3 py-0.5 gap-2 items-center justify-center bg-stone-50 rounded-2xl  border border-stone-400">
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

            {/* Comentarios - Reutilizando estilos de TeacherCard */}
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
        </div>
    );
}
