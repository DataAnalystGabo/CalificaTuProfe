import { supabase } from "../supabaseClient";

export const getTeacherSummary = async () => {
    try {
        const { data, error } = await supabase
            .from("teacher_summary")
            .select("*");

        if (error) {
            console.error("Error al obtener datos de Supabase:", error.message);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Error inesperado en el servicio:", err);
        return [];
    }
};