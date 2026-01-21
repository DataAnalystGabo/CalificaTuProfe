import { supabase } from "../supabaseClient";

const CACHE_KEY = "TEACHER_DATA_CACHE";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

/**
 * Obtiene los datos del localStorage síncronamente.
 * @returns {Array|null} Datos cacheados o null si no existen/expiraron
 */
export const getLocalTeacherCache = () => {
    try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (!cachedRaw) return null;

        const { data, timestamp } = JSON.parse(cachedRaw);
        const isExpired = (Date.now() - timestamp) > CACHE_DURATION;

        if (isExpired) {
            console.log("[teacherService] Caché expirado.");
            return null;
        }

        return data;
    } catch (e) {
        console.error("[teacherService] Error leyendo caché:", e);
        return null;
    }
};

export const getTeacherSummary = async () => {
    try {
        console.log("[teacherService] Iniciando consulta a Supabase...");

        // Configuración de reintentos
        const MAX_ATTEMPTS = 4;

        const fetchWithRetry = async (attempt = 1) => {
            // Tiempos de timeout incrementales: 10s, 15s, 20s, 25s
            const timeout = 5000 + (attempt * 5000);

            try {
                const queryPromise = supabase
                    .from("teacher_summary")
                    .select("*");

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => {
                        reject(new Error(`Timeout en intento ${attempt} (${timeout}ms)`));
                    }, timeout)
                );

                const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

                if (error) throw error;

                return { data, error: null };

            } catch (error) {
                console.warn(`[teacherService] Intento ${attempt} falló:`, error.message);

                if (attempt < MAX_ATTEMPTS) {
                    const backoffTime = 2000 * attempt; // 2s, 4s, 6s
                    console.log(`[teacherService] Esperando ${backoffTime}ms antes de reintentar...`);
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                    return fetchWithRetry(attempt + 1);
                }

                console.error("[teacherService] Todos los intentos han fallado.");
                return { data: null, error };
            }
        };

        const { data, error } = await fetchWithRetry();

        if (error) {
            throw error; // Lanzamos para manejarlo en el componente
        }

        // Guardar en caché si la respuesta es exitosa
        if (data && data.length > 0) {
            console.log(`[teacherService] Guardando ${data.length} registros en caché.`);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        }

        return data || [];

    } catch (err) {
        // Propagamos el error para que el componente decida usar el caché de respaldo
        console.error("[teacherService] Error final:", err.message);
        throw err;
    }
};