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
                console.log("Sirviendo datos de profesores desde caché (Carga instantánea)");
                return data;
            }
        }

        console.log("Cache miss o expirado. Consultando Supabase...");

        // 2. Consultar a Supabase con retry logic
        const fetchWithRetry = async (attempt = 1) => {
            const MAX_ATTEMPTS = 3;
            // Aumentar timeout por intento: 10s, 15s, 20s
            const timeout = 10000 + (attempt * 5000);

            try {
                const queryPromise = supabase
                    .from("teacher_summary")
                    .select("*");

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => {
                        reject(new Error("Timeout en consulta a teacher_summary"));
                    }, timeout)
                );

                const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

                if (error) throw error;

                return { data, error: null };

            } catch (error) {
                console.warn(`[teacherService] Intento ${attempt} falló:`, error.message);

                if (attempt < MAX_ATTEMPTS) {
                    const backoffTime = 2000 * attempt;
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                    return fetchWithRetry(attempt + 1);
                }

                console.error("[teacherService] Todos los intentos fallaron");
                return { data: null, error };
            }
        };

        const { data, error } = await fetchWithRetry();

        if (error) {
            console.error("Error al obtener datos de Supabase:", error.message);
            // Fallback: devolver caché viejo si existe
            if (cachedRaw) {
                console.warn("Usando caché antiguo debido a error de red");
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