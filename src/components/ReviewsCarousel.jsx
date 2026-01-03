import React from "react";
import Target from "./Target";

const reviews = [
    { teacherName: "Prof. Alonso Gómez", university: "UNLP", subjectName: "Derecho Penal I", qcomment: "+35 reseñas", comment: "Excelente profesor y excelente persona.", rating: 4 },
    { teacherName: "Prof. Esteban Diaz", university: "UNAB", subjectName: "Análisis de Redes Sociales", qcomment: "+25 reseñas", comment: "Sus clases te dan sueño pero, se logra entender.", rating: 3 },
    { teacherName: "Prof. Ana María Paula", university: "UBA", subjectName: "Química I", qcomment: "+55 reseñas", comment: "Muy rigurosa. Toma todo lo que se vió en clases", rating: 5 },
    { teacherName: "Prof. Aldo Pérez", university: "UBA", subjectName: "Historia de la Filosofía", qcomment: "+2 reseñas", comment: "Tranqui el profe: la materia es llevadera.", rating: 3 },
]

const ReviewsCarousel = () => {
    return (
        <div className="
                        w-full 
                        inline-flex 
                        flex-nowrap 
                        overflow-hidden 
                        py-8
                        mask-[linear-gradient(to_right,transparent,black_100px,black_calc(100%-100px),transparent)]
                    ">

            <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                {reviews.map((review, index) => (
                    <div key={index} className="mx-4 w-75 shrink-0">
                        <Target {...review} shadow={false} />
                    </div>
                ))}

                {/* SET 2: Duplicamos EXACTAMENTE lo mismo para el efecto loop */}
                {reviews.map((review, index) => (
                    <div key={`duplicate-${index}`} className="mx-4 w-75 shrink-0">
                        <Target {...review} />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ReviewsCarousel;