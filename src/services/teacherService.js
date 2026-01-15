import { supabase } from "../supabaseClient";

const CACHE_KEY = "TEACHER_DATA_CACHE";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

export const getTeacherSummary = async () => {
    try {
        // 1. Intentar obtener datos del caché local
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
            const { data, timestamp } = JSON.parse(cachedRaw);
            const isExpired = (Date.now() - timestamp) > CACHE_DURATION;

            if (!isExpired && data && data.length > 0) {
                console.log("Serving professor data from cache (Instant Load)");
                return data;
            }
        }

        console.log("Cache miss or expired. Fetching from Supabase...");

        // 2. Si no hay caché válido, consultar a Supabase (con Timeout de seguridad)
        const queryPromise = supabase
            .from("teacher_summary")
            .select("*");

        const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => {
                console.warn("Consulta a teacher_summary excedió el tiempo límite.");
                resolve({ data: [], error: { message: "Timeout waiting for Supabase data" } });
            }, 8000) // 8 segundos de espera máxima para datos
        );

        const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

        if (error) {
            console.error("Error al obtener datos de Supabase:", error.message);
            // Fallback: Si falla la red, intentar devolver caché viejo si existe
            if (cachedRaw) {
                console.warn("Using stale cache due to network error");
                return JSON.parse(cachedRaw).data;
            }
            return [];
        }

        // 3. Guardar en caché si la respuesta es exitosa
        if (data && data.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        }

        return data || [];
    } catch (err) {
        console.error("Error inesperado en el servicio:", err);
        // Fallback de emergencia
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
            return JSON.parse(cachedRaw).data;
        }
        return [];
    }
};