import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PillBadge from "./PillBadge";
import { RxStar } from "react-icons/rx";
import { RxStarFilled } from "react-icons/rx";
import { FaBook, FaUniversity, FaComment } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdOutlineLock } from "react-icons/md";

// Función auxiliar para renderizar el número de estrellas
const StarRating = ({ 
    rating =  0, 
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

export default function TeacherCard({ 
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
    tagsPillBadge = [],
    isAuthenticated
}) {
    // Obtenemos la función del contexto
    const { openRegister } = useAuth();

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
                        <div className="flex items-center text-xs text-stone-500">
                            <FaUniversity className="h-2.5 w-2.5 mr-1"/>
                            <span>{university}</span>
                        </div>

                        {/* Categoría: materia */}
                        <div className="flex items-center text-xs text-stone-500">
                            <FaBook className="h-2.5 w-2.5 mr-1"/>
                            <span>{subjectName}</span>
                        </div>

                        {/* Categoría: materia */}
                        <div className="flex items-center text-xs text-stone-500">
                            <FaComment className="h-2.5 w-2.5 mr-1"/>
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
                        <AiOutlineLike className="h-3 w-3 text-emerald-600"/>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                            Lo mejor
                        </span>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                        "{positiveComment || "Sé el primero en comentar."}"
                    </p>

                </div>

                {/* Bloque constructivo */}
                <div className="relative flex flex-col justify-center h-30 px-3 py-6 gap-1 border-l-4 border-amber-400 bg-amber-50 rounded-r-md overflow-hidden">
                
                    {/* Contenido: Se blurea si NO está autenticado */}
                    <div className={`flex flex-col gap-1 transition-all duration-500 ${!isAuthenticated ? 'blur-xs select-none': ''}`}>
                        <div className="flex items-center gap-1">
                            <AiOutlineDislike className="h-3 w-3 text-amber-600"/>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                Podría mejorar
                            </span>
                        </div>
                        
                        <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2">
                            "{constructiveComment || "Sé el primero en comentar."}"
                        </p>
                    </div>

                    {/* Overlay de Bloqueo: Solo aparece si NO está autenticado */}
                    {!isAuthenticated && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <MdOutlineLock className="h-5 w-5 text-amber-700 mb-1"/>
                            <button 
                                onClick={openRegister}
                                className="text-sm font-medium tracking-tighter text-amber-800 px-2 py-0.5 cursor-pointer">
                                Registrate para leer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón de acción final */}
            <Link
                to="/leerReseñas"
                className="bg-sky-500 text-white px-8 py-3 rounded-xl text-center mt-4 font-medium hover:bg-sky-400 transition-all shadow-lg hover:shadow-sky-200 inline-block cursor-pointer"
                onClick={() => console.log('CTA: Leer todas las reseñas')}
            >
                Leer reseñas
            </Link>
        </div>
    )
}