import { RxStar } from "react-icons/rx";
import { RxStarFilled } from "react-icons/rx";
import { FaBook, FaUniversity, FaComment } from "react-icons/fa";

// Función auxiliar para renderizar el número de estrellas
const StarRating = ({ 
    rating =  0, 
    maxRating = 5,
    filledColor = "text-stone-500",
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

export default function Target({ 
    rating,
    comment,
    qcomment,
    teacherName, 
    subjectName,
    university,
    emptyColor,
    filledColor
}) {
    return (

        <div className="bg-white p-4 rounded-lg shadow-2xl border border-stone-500 transition duration-300 hover:shadow-xl w-[300px] h-full flex flex-col">

            {/* Encabezado de la tarjeta (usuario y calificacion) */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-300">
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-stone-500">
                        {teacherName}
                    </p>
                    
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
            <div className="p-2 pl-0">
                <StarRating
                    emptyColor={emptyColor}
                    filledColor={filledColor}
                    rating={rating}
                    maxRating={5}
                />
            </div>

            {/* Comentario */}
            <p className="text-stone-500 text-sm italic flex-grow mt-2">
                "{comment}"
            </p>
        </div>
    )
}