import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PillBadge from "./PillBadge";

import { FaBuildingColumns, FaBook, FaCommentDots } from "react-icons/fa6";
import { RxStar, RxStarFilled } from "react-icons/rx";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

// Función auxiliar para renderizar el número de estrellas
const StarRating = ({
    rating = 0,
    maxRating = 5,
    filledColor = "text-yellow-400",
    emptyColor = "text-stone-300"

}) => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        const isFilled = i <= rating;
        const StarIcon = isFilled ? RxStarFilled : RxStar;
        const starColor = isFilled ? filledColor : emptyColor;

        stars.push(
            <StarIcon
                key={i}
                className={`h-4 w-4 ${starColor}`}
            />
        );
    }

    return <div className="flex space-x-0.5">{stars}</div>
}

// Skeleton interno
function TeacherCardSkeleton({ width = "w-72", shadow = true }) {
    return (
        <div className={`
            bg-white p-4 rounded-lg border border-stone-300 h-full flex flex-col
            ${width}
            ${shadow ? "shadow-md" : "shadow-none"}
            animate-pulse
        `}>
            {/* Header */}
            <div className="w-full pb-2 border-b border-stone-300">
                <div className="h-5 bg-stone-300 rounded w-2/3 mb-2"></div>
                <div className="space-y-1.5">
                    <div className="h-3 bg-stone-200 rounded w-3/4"></div>
                    <div className="h-3 bg-stone-200 rounded w-2/3"></div>
                    <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                </div>
            </div>

            {/* Comments */}
            <div className="flex flex-col gap-3 mt-4 pb-4 grow border-b border-stone-300">
                <div className="h-3 bg-stone-200 rounded w-20"></div>

                {/* Positive comment skeleton */}
                <div className="flex flex-col h-30 px-3 py-6 gap-2 border-l-4 border-emerald-300 bg-emerald-50 bg-emerald-50 rounded-r-md">
                    <div className="h-3 bg-emerald-200 rounded w-16"></div>
                    <div className="h-3 bg-emerald-200 rounded w-full"></div>
                    <div className="h-3 bg-emerald-200 rounded w-5/6"></div>
                </div>

                {/* Constructive comment skeleton */}
                <div className="flex flex-col h-30 px-3 py-6 gap-2 border-l-4 border-amber-300 bg-amber-50 bg-amber-50 rounded-r-md">
                    <div className="h-3 bg-amber-200 rounded w-20"></div>
                    <div className="h-3 bg-amber-200 rounded w-full"></div>
                    <div className="h-3 bg-amber-200 rounded w-4/6"></div>
                </div>
            </div>

            {/* Button */}
            <div className="h-12 bg-stone-300 rounded-xl mt-4"></div>
        </div>
    );
}

export default function TeacherCard({
    isLoading = false,
    rating,
    positiveComment,
    constructiveComment,
    qcomment,
    teacherName,
    subjectName,
    university,
    emptyColor,
    filledColor,
    shadow = true,
    width = "w-72",
    reviewDate,
    tagsPillBadge = []
}) {
    const navigate = useNavigate();

    // Obtenemos la función del contexto
    const { openRegister } = useAuth();

    // Si está cargando, mostrar skeleton
    if (isLoading) {
        return <TeacherCardSkeleton width={width} shadow={shadow} />;
    }

    // Función para manejar el botón de "Leer reseñas" de forma dinámica
    const handleAction = (e) => {
        e.preventDefault(); // evitamos cualquier comportamiento por defecto
        navigate("/readReviews");
    };

    return (
        <div className={`
            bg-white p-4 rounded-lg border border-stone-500 h-full flex flex-col
            transition-all duration-300 ease-in-out
            ${width}
            ${shadow
                ? 'shadow-md hover:shadow-xl hover:-translate-y-1' /* Efecto Levitar */
                : 'shadow-none'
            }
        `}>

            {/* Encabezado de la tarjeta (usuario y calificacion) */}
            <div className="w-full flex items-center justify-between pb-2 border-b border-stone-300">
                <div className="w-full flex flex-col">
                    <div className="w-full flex items-start">
                        <p className="text-lg font-bold text-stone-500">
                            {teacherName}
                        </p>
                    </div>

                    {/* Contenedor de categorías */}
                    <div className="flex flex-col space-y-1 mt-1 mb-1">

                        {/* Categoría: universidad */}
                        <div className="flex items-center text-sm text-stone-500">
                            <FaBuildingColumns className="h-3 w-3 mr-1" />
                            <span>{university}</span>
                        </div>

                        {/* Categoría: materia */}
                        <div className="flex items-center text-sm text-stone-500">
                            <FaBook className="h-3 w-3 mr-1" />
                            <span>{subjectName}</span>
                        </div>

                        {/* Categoría: materia */}
                        <div className="flex items-center text-sm text-stone-500">
                            <FaCommentDots className="h-3 w-3 mr-1" />
                            <span>{qcomment}</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Estrellas de puntuación */}
            <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4 mt-4">

                <div className="w-auto flex flex-row px-3 py-0.5 gap-2 items-center justify-center bg-stone-50 rounded-2xl  border border-stone-400">
                    <span className="font-bold text-stone-500">
                        {/* Number y toFixed asegura que los numeros enteros se muestren con el decimal .0. Ejemplo: 4.0 */}
                        {Number(rating).toFixed(1)}
                    </span>

                    <StarRating
                        emptyColor={emptyColor}
                        filledColor={filledColor}
                        rating={rating}
                        maxRating={5}
                    />
                </div>

                {/* Solo renderizamos este div si el array tiene elementos */}
                {tagsPillBadge && tagsPillBadge.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 mb-1">
                        {tagsPillBadge.map((tag, index) => (
                            <PillBadge
                                key={index} // Siempre agrega una key
                                text={tag}
                                bgColor="bg-white"
                                borderColor="border-stone-300"
                                textColor="text-stone-500"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Comentarios */}
            <div className="flex flex-col gap-3 mt-4 pb-4 grow border-b border-stone-300">

                <p className="text-xs text-stone-400">
                    {reviewDate}
                </p>

                {/* Bloque positivo */}
                <div className="flex flex-col justify-center h-30 px-3 py-6 gap-1 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-md">

                    <div className="flex items-center gap-1">
                        <AiOutlineLike className="h-3 w-3 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Lo mejor
                        </span>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                        "{positiveComment}"
                    </p>

                </div>

                {/* Bloque constructivo */}
                <div className="flex flex-col justify-center h-30 px-3 py-6 gap-1 border-l-4 border-amber-400 bg-amber-50 rounded-r-md">
                    <div className="flex items-center gap-1">
                        <AiOutlineDislike className="h-3 w-3 text-amber-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                            Podría mejorar
                        </span>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2">
                        "{constructiveComment}"
                    </p>
                </div>
            </div>

            {/* Botón de acción final */}
            <button
                onClick={handleAction}
                className="bg-sky-500 text-white px-8 py-3 rounded-xl text-center mt-4 font-medium hover:bg-sky-400 transition-all shadow-lg hover:shadow-sky-200 inline-block cursor-pointer"
            >
                Leer reseñas
            </button>
        </div>
    );
}