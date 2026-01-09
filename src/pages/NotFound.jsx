import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return(
        <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-stone-100 text-4xl font-black text-stone-400">
                404
            </div>

            <h1 className="text-3xl font-extrabold text-stone-700 md:text-4xl">
                Página no encontrada
            </h1>
            
            <p className="mt-4 max-w-md text-lg text-stone-500">
                Lo sentimos, la sección que buscas no existe o fue movida a otra ubicación. 
                Nuestras reseñas son honestas, pero esta URL parece que no lo fue.
            </p>

            <div className="mt-10">
                <Link
                    to="/"
                    className="bg-sky-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-sky-400 transition-all shadow-lg hover:shadow-sky-200 inline-block"
                >
                    Volver al inicio
                </Link>
            </div>
        </main>
    )
}