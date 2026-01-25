import { supabase } from '../supabaseClient';

const CACHE_KEY = 'TEACHER_DATA_CACHE';
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

// Obtener filtros únicos para los modales
// Obtener filtros únicos para los modales
export const getDistinctFilters = async () => {
    try {
        console.log("[teacherService] Fetching distinct filters...");

        // Al haber actualizado la vista teacher_summary con los datos formateados,
        // podemos obtener todos los filtros directamente de allí.
        const { data: summaryData, error: summaryError } = await supabase
            .from('teacher_summary')
            .select('university, subject_name, full_name');

        if (summaryError) throw summaryError;

        // Procesar datos para obtener listas únicas
        const universities = [...new Set(summaryData.map(item => item.university).filter(Boolean))].sort();
        const subjects = [...new Set(summaryData.map(item => item.subject_name).filter(Boolean))].sort();
        const teachers = [...new Set(summaryData.map(item => item.full_name).filter(Boolean))].sort();

        return {
            universities,
            subjects,
            teachers
        };

    } catch (error) {
        console.error("[teacherService] Error fetching filters:", error.message);
        return { universities: [], subjects: [], teachers: [] };
    }
};

export const getTeacherSummary = async ({ page = 1, pageSize = 12, searchTerm = "", filters = {} } = {}) => {
    try {
        console.log(`[teacherService] Fetching page ${page} with search: "${searchTerm}"`, filters);

        const MAX_ATTEMPTS = 4;

        const fetchWithRetry = async (attempt = 1) => {
            // Tiempos de timeout incrementales: 10s, 15s, 20s, 25s
            const timeout = 5000 + (attempt * 5000);

            try {
                // Calcular rango para Supabase (0-indexed)
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;

                let query = supabase
                    .from("teacher_summary")
                    .select("*", { count: "exact" });

                // Aplicar búsqueda si existe
                if (searchTerm) { 
                    query = query.or(`full_name.ilike.%${searchTerm}%,subject_name.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%`);
                }

                // Aplicar Filtros
                if (filters.universities && filters.universities.length > 0) {
                    query = query.in('university', filters.universities);
                }
                if (filters.subjects && filters.subjects.length > 0) {
                    query = query.in('subject_name', filters.subjects);
                }
                if (filters.teachers && filters.teachers.length > 0) {
                    query = query.in('full_name', filters.teachers);
                }

                // Aplicar paginación
                query = query
                    .range(from, to)
                    .order('total_reviews', { ascending: false });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => {
                        reject(new Error(`Timeout en intento ${attempt} (${timeout}ms)`));
                    }, timeout)
                );

                const { data, error, count } = await Promise.race([query, timeoutPromise]);

                if (error) throw error;

                return { data: data || [], count: count || 0 };

            } catch (error) {
                console.warn(`[teacherService] Intento ${attempt} falló:`, error.message);

                if (attempt < MAX_ATTEMPTS) {
                    const backoffTime = 2000 * attempt; // 2s, 4s, 6s
                    console.log(`[teacherService] Esperando ${backoffTime}ms antes de reintentar...`);
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                    return fetchWithRetry(attempt + 1);
                }

                throw error; // Si fallan todos, lanzamos el error
            }
        };

        return await fetchWithRetry();

    } catch (err) {
        console.error("[teacherService] Error fetching teachers:", err.message);
        throw err;
    }
};
