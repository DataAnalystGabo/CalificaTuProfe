import { supabase } from '../supabaseClient';

// Obtener filtros únicos para los modales:
export const getDistinctFilters = async () => {
    try {
        console.log("[teacherService > getDistinctFilters] Consultando tablas maestro a Supabase...");

        // Consultas paralelas a las tablas maestro (incluyendo ID para filtrado por UUID):
        const [teachersRes, subjectsRes, universitiesRes] = await Promise.all([
            supabase.from('Teachers').select('id, first_name, last_name'),
            supabase.from('Subjects').select('id, name'),
            supabase.from('Universities').select('id, name, acronym')
        ]);

        if (teachersRes.error) throw teachersRes.error;
        if (subjectsRes.error) throw subjectsRes.error;
        if (universitiesRes.error) throw universitiesRes.error;

        // Mapeo a objetos { id, label } para cada categoría:
        const teachers = teachersRes.data
            .map(t => ({ id: t.id, label: `${t.first_name} ${t.last_name}` }))
            .sort((a, b) => a.label.localeCompare(b.label));
        
        const subjects = subjectsRes.data
            .map(s => ({ id: s.id, label: s.name }))
            .sort((a, b) => a.label.localeCompare(b.label));
        
        const universities = universitiesRes.data
            .map(u => ({ id: u.id, label: `${u.name} (${u.acronym})` }))
            .sort((a, b) => a.label.localeCompare(b.label));

        return { universities, subjects, teachers };

    } catch (error) {
        console.error("[teacherService > getDistinctFilters] Error:", error.message);
        return { universities: [], subjects: [], teachers: [] };
    }
};

export const getTeacherSummary = async ({ page = 1, pageSize = 12, searchTerm = "", filters = {} } = {}) => {
    try {
        console.log(`[teacherService < getTeacherSummary] Fetching página ${page} con búsqueda: "${searchTerm}"`, filters);

        const MAX_ATTEMPTS = 4;

        const fetchWithRetry = async (attempt = 1) => {
            // Tiempos de timeout ágiles: 5s base + 3s por cada intento adicional
            const timeoutDuration = 5000 + ((attempt - 1) * 3000);

            // Creamos el controlador de cancelación
            const controller = new AbortController();

            // Programamos el "core de llamada" automático si se pasa del tiempo
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

                // Aplicar Filtros por ID (UUID)
                if (filters.university_ids?.length > 0) {
                    query = query.in('university_id', filters.university_ids);
                }
                if (filters.subject_ids?.length > 0) {
                    query = query.in('subject_id', filters.subject_ids);
                }
                if (filters.teacher_ids?.length > 0) {
                    query = query.in('teacher_id', filters.teacher_ids);
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

// Obtener información de cabecera del profesor para la página de detalle:
export const getTeacherHeaderInfo = async (teacherSubjectId) => {
    try {
        console.log(`[teacherService > getTeacherHeaderInfo] Fetching header para: ${teacherSubjectId}`);

        const { data, error } = await supabase
            .from('teacher_summary')
            .select('teacher_subject_id, full_name, university, subject_name, average_rating, total_reviews')
            .eq('teacher_subject_id', teacherSubjectId)
            .single();

        if (error) throw error;

        return data;

    } catch (error) {
        console.error("[teacherService > getTeacherHeaderInfo] Error:", error.message);
        throw error;
    }
};

// Obtener todas las reseñas de un profesor/materia con sus tags:
export const getTeacherReviews = async (teacherSubjectId) => {
    try {
        console.log(`[teacherService > getTeacherReviews] Fetching reviews para: ${teacherSubjectId}`);

        const { data, error } = await supabase
            .from('Reviews')
            .select(`
                id,
                teacher_subject_id,
                rating,
                positive_comment,
                constructive_comment,
                created_at,
                user_id,
                Reviews_Tags (
                    Tags (
                        id,
                        name
                    )
                )
            `)
            .eq('teacher_subject_id', teacherSubjectId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Mapear para simplificar estructura de tags
        const mappedData = (data || []).map(review => ({
            ...review,
            tags: review.Reviews_Tags
                ?.map(rt => rt.Tags)
                .filter(Boolean) || []
        }));

        return mappedData;

    } catch (error) {
        console.error("[teacherService > getTeacherReviews] Error:", error.message);
        throw error;
    }
};
