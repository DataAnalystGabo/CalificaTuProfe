import { supabase } from '../supabaseClient';

// Obtener filtros únicos para los modales:
export const getDistinctFilters = async () => {
    try {
        console.log("[teacherService / getDistinctFilters] Consultando tablas maestro...");

        // Consultas paralelas a las tablas maestro:
        const [teachersRes, subjectsRes, universitiesRes] = await Promise.all([
            supabase.from('Teachers').select('first_name, last_name'),
            supabase.from('Subjects').select('name'),
            supabase.from('Universities').select('name, acronym')
        ]);

        if (teachersRes.error) throw teachersRes.error;
        if (subjectsRes.error) throw subjectsRes.error;
        if (universitiesRes.error) throw universitiesRes.error;

        // Procesar datos:
        const teachers = teachersRes.data
            .map(t => `${t.first_name} ${t.last_name}`)
            .sort();
        
        const subjects = subjectsRes.data.map(s => s.name).sort();
        
        // Formatear universidades como "Nombre (ACRONIMO)":
        const universities = universitiesRes.data
            .map(u => `${u.name} (${u.acronym})`)
            .sort();

        return { universities, subjects, teachers };

    } catch (error) {
        console.error("[teacherService / getDistinctFilters] Error:", error.message);
        return { universities: [], subjects: [], teachers: [] };
    }
};

export const getTeacherSummary = async ({ page = 1, pageSize = 12, searchTerm = "", filters = {} } = {}) => {
    try {
        console.log(`[teacherService < getTeacherSummary] Fetching página ${page} con búsqueda: "${searchTerm}"`, filters);

        const MAX_ATTEMPTS = 4;

        const fetchWithRetry = async (attempt = 1) => {
            // Tiempos de timeout incrementales: 10s, 15s, 20s, 25s
            const timeoutDuration = 20000 + (attempt * 20000);

            // Creamos el controlador de cancelación
            const controller = new AbortController();

            // Programamos el "corede de llamada" automático si se pasa del tiempo
            const timeoutId = setTimeout(() => {
                controller.abort(); // Esto cancela la petición de red real
            }, timeoutDuration);

            try {
                // Calcular rango para Supabase (0-indexed)
                const from = (page - 1) * pageSize;
                const to = from + pageSize - 1;

                let query = supabase
                    .from('teacher_summary')
                    .select('*', { count: 'exact' });

                // Aplicar búsqueda si existe
                if (searchTerm) { 
                    query = query.or(`full_name.ilike.%${searchTerm}%,subject_name.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%`);
                }

                // Aplicar Filtros
                if (filters.universities?.length > 0) {
                    query = query.in('university', filters.universities);
                }
                if (filters.subjects?.length > 0) {
                    query = query.in('subject_name', filters.subjects);
                }
                if (filters.teachers?.length > 0) {
                    query = query.in('full_name', filters.teachers);
                }

                // Aplicar paginación
                query = query
                    .range(from, to)
                    .order('total_reviews', { ascending: false })
                    .abortSignal(controller.signal); // Conectamos el controlador a la query de Supabase

                // Ejecutamos la query directamente (sin Promise.race)
                const { data, error, count } = await query;

                // Si llegamos aquí, la petición fue exitosoa antes del timeout. Limpiamos el temporizador para que no intente abortar nada después:
                clearTimeout(timeoutId);

                if (error) throw error;

                return { data: data || [], count: count || 0 };

            } catch (error) {
                // Limpiamos el timeout también en caso de error inmediato:
                clearTimeout(timeoutId);

                // Detectamos si el error fue por cancelación (Timeout) o por red:
                const isAbortError = error.name === 'AbortError' || error.message.includes('Aborted');
                const errorMessage = isAbortError ? `Timeout excedido (${timeoutDuration}ms)` : error.message;

                console.warn(`[teacherService < getTeacherSummary] Intento ${attempt} falló:`, errorMessage);

                if (attempt < MAX_ATTEMPTS) {
                    const backoffTime = 2000 * attempt;
                    console.log(`[teacherService < getTeacherSummary] Esperando ${backoffTime}ms antes de reintentar...`);
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                    return fetchWithRetry(attempt + 1);
                }

                throw error; // Si fallan todos, lanzamos el error
            }
        };

        return await fetchWithRetry();

    } catch (err) {
        console.error("[teacherService < getTeacherSummary] Error de consulta:", err.message);
        throw err;
    }
};
