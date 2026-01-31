import React from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { FaBuildingColumns, FaBook, FaCommentDots } from "react-icons/fa6";

// Componente de estrellas reutilizable
const StarRating = ({ rating = 0, maxRating = 5, size = "lg" }) => {
    const stars = [];
    const sizeClass = size === "lg" ? "h-6 w-6" : "h-4 w-4";

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
            <StarIcon key={i} className={`${sizeClass} ${starColor}`} />
        );
    }

    return <div className="flex space-x-0.5">{stars}</div>;
};

// Skeleton para el header
function TeacherHeaderSkeleton() {
    return (
        <div className="w-full bg-gradient-to-br from-sky-50 to-stone-100 rounded-2xl p-8 animate-pulse">
            <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-stone-300 rounded w-2/3 mb-4"></div>
                <div className="flex flex-col gap-2 mb-6">
                    <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                    <div className="h-4 bg-stone-200 rounded w-1/4"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-20 bg-stone-300 rounded-xl"></div>
                    <div className="h-6 w-32 bg-stone-200 rounded"></div>
                    <div className="h-5 w-24 bg-stone-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export default function TeacherHeader({ 
    teacherInfo, 
    isLoading = false 
}) {
    if (isLoading || !teacherInfo) {
        return <TeacherHeaderSkeleton />;
    }

    const { full_name, university, subject_name, average_rating, total_reviews } = teacherInfo;

    return (
        <div className="w-full bg-gradient-to-br from-sky-50 via-white to-stone-50 rounded-2xl border border-stone-200 shadow-sm">
            <div className="max-w-4xl mx-auto p-8">
                {/* Nombre del Profesor */}
                <h1 className="text-3xl font-bold text-stone-700 mb-4">
                    {full_name}
                </h1>

                {/* Materia y Universidad */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center text-stone-500">
                        <FaBook className="h-4 w-4 mr-2 text-sky-500" />
                        <span className="font-normal">{subject_name}</span>
                    </div>
                    <div className="flex items-center text-stone-500">
                        <FaBuildingColumns className="h-4 w-4 mr-2 text-sky-500" />
                        <span className="font-normal">{university}</span>
                    </div>
                    <div className="flex items-center text-stone-500">
                        <FaCommentDots className="h-4 w-4 mr-2 text-sky-500" />
                        <span className="font-normal">{total_reviews} reseñas</span>
                    </div>
                </div>

                {/* Rating Destacado */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-auto flex flex-row px-6 py-1 gap-2 items-center justify-center bg-stone-50 rounded-4xl border border-stone-400">
                        <span className="text-3xl font-bold text-stone-600">
                            {Number(average_rating).toFixed(1)}
                        </span>
                        <StarRating rating={average_rating} size="lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
