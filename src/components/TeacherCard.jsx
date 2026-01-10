import PillBadge from "./PillBadge";
import { RxStar } from "react-icons/rx";
import { RxStarFilled } from "react-icons/rx";
import { FaBook, FaUniversity, FaComment } from "react-icons/fa";

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
                className={`h-5 w-5 ${starColor}`}
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
    tagsPillBadge = []
}) {
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
            <div className="w-full flex items-center justify-between mb-2 pb-2 border-b border-stone-300">
                <div className="w-full flex flex-col">
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-lg font-bold text-stone-500">
                            {teacherName}
                        </p>
                        <p className="text-xs text-stone-400">
                            {reviewDate}
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
            <div className="flex flex-col md:flex-row p-2 pl-0 justify-start items-start md:items-center gap-4">
                <div className="w-auto flex flex-row px-3 py-1 border- gap-2 items-center justify-center bg-stone-100 rounded-2xl  border border-stone-400">
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
                
                <div className="flex flex-wrap gap-2 mt-1 mb-3">
                    {tagsPillBadge.map((tag, index) => (
                        <PillBadge 
                            text={tag}
                            bgColor="bg-white"
                            borderColor="border-stone-300"
                            textColor="text-stone-500"
                        />
                    ))}
                </div>
            </div>

            {/* Comentarios */}
            <div className="flex flex-col gap-3 mt-4 grow">
                
                {/* Bloque positivo */}
                <div className="pl-3 border-l-4 border-emerald-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Lo mejor</span>
                    <p className="text-stone-600 text-sm leading-relaxed">
                        "{positiveComment || "Sé el primero en comentar."}"
                    </p>
                </div>

                {/* Bloque constructivo */}
                <div className="pl-3 border-l-4 border-amber-400">
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                            A mejorar
                        </span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed italic">
                        "{constructiveComment || "Sé el primero en comentar."}"
                    </p>
                </div>
            </div>

        </div>
    )
}