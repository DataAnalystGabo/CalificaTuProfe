/**
 * ============================================================================================
 * REVIEW SERVICE
 * ============================================================================================
 * 
 * NATURALEZA:
 *   Servicio especializado en la gestión de interacciones detalladas y sociales relacionadas
 *   con las reseñas de profesores. Este módulo encapsula todas las operaciones que involucran
 *   la visualización, consulta y manipulación de reseñas individuales y sus metadatos asociados.
 * 
 * RESPONSABILIDADES:
 *   - Obtener información de cabecera para perfiles de profesores
 *   - Recuperar listados de reseñas con datos enriquecidos (tags, nicknames)
 *   - Gestionar el sistema de votación de reseñas (consulta, registro, eliminación)
 * 
 * TAREAS ESPECÍFICAS:
 *   1. getTeacherHeaderInfo  → Consulta la vista 'teacher_summary' para obtener datos de cabecera
 *                              (nombre completo, universidad, materia, rating promedio, total reviews)
 * 
 *   2. getTeacherReviews     → Recupera todas las reseñas de un teacher_subject_id con joins a:
 *                              - Users (nickname)
 *                              - Reviews_Tags → Tags (id, name)
 *                              Incluye mapeo para simplificar la estructura de tags
 * 
 *   3. getUserVote           → Consulta si el usuario actual ya votó en una reseña específica
 *                              Retorna el valor del voto o null si no existe
 * 
 *   4. submitVote            → Inserta o actualiza (upsert) un voto en 'Review_Votes'
 *                              Maneja conflictos por la combinación review_id + user_id
 * 
 *   5. deleteVote            → Elimina un voto existente de la tabla 'Review_Votes'
 * 
 * DEPENDENCIAS:
 *   - Supabase Client (../supabaseClient)
 *   - Tablas: Reviews, Review_Votes, Users, Reviews_Tags, Tags
 *   - Vista: teacher_summary
 * 
 * ============================================================================================
 */

import { supabase } from '../supabaseClient';

// Obtener información de cabecera del profesor para la página de detalle:
export const getTeacherHeaderInfo = async (teacherSubjectId) => {
    try {
        console.log(`[reviewService > getTeacherHeaderInfo] Fetching header para: ${teacherSubjectId}`);

        const { data, error } = await supabase
            .from('teacher_summary')
            .select('teacher_subject_id, full_name, university, subject_name, average_rating, total_reviews')
            .eq('teacher_subject_id', teacherSubjectId)
            .single();

        if (error) throw error;

        return data;

    } catch (error) {
        console.error("[reviewService > getTeacherHeaderInfo] Error:", error.message);
        throw error;
    }
};

// Obtener todas las reseñas de un profesor/materia con sus tags:
export const getTeacherReviews = async (teacherSubjectId) => {
    try {
        console.log(`[reviewService > getTeacherReviews] Fetching reviews para: ${teacherSubjectId}`);

        const { data, error } = await supabase
            .from('Reviews')
            .select(`
                id,
                teacher_subject_id,
                clarity_rating,
                kindness_rating,
                difficulty_rating,
                availability_rating,
                material_rating,
                positive_comment,
                constructive_comment,
                created_at,
                user_id,
                helpful_score,
                Users:user_id (
                    nickname
                ),
                Reviews_Tags (
                    tag_id,
                    Tags:tag_id (
                        id,
                        name
                    )
                )
            `)
            .eq('teacher_subject_id', teacherSubjectId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Mapear para simplificar estructura de tags y extraer nickname
        const mappedData = (data || []).map(review => ({
            ...review,
            nickname: review.Users?.nickname || 'Anónimo',
            helpful_score: review.helpful_score || 0,
            tags: review.Reviews_Tags
                ?.map(rt => rt.Tags)
                .filter(Boolean) || []
        }));

        return mappedData;

    } catch (error) {
        console.error("[reviewService > getTeacherReviews] Error:", error.message);
        throw error;
    }
};

// ============ VOTING FUNCTIONS ============

// Obtener el voto del usuario actual para una reseña
export const getUserVote = async (reviewId, userId) => {
    try {
        const { data, error } = await supabase
            .from('Review_Votes')
            .select('vote_value')
            .eq('review_id', reviewId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        return data?.vote_value || null;

    } catch (error) {
        console.error("[reviewService > getUserVote] Error:", error.message);
        return null;
    }
};

// Insertar o actualizar voto (upsert)
export const submitVote = async (reviewId, userId, value) => {
    try {
        const { data, error } = await supabase
            .from('Review_Votes')
            .upsert({
                review_id: reviewId,
                user_id: userId,
                vote_value: value
            }, {
                onConflict: 'review_id,user_id'
            })
            .select();

        if (error) throw error;
        return data;

    } catch (error) {
        console.error("[reviewService > submitVote] Error:", error.message);
        throw error;
    }
};

// Eliminar voto
export const deleteVote = async (reviewId, userId) => {
    try {
        const { error } = await supabase
            .from('Review_Votes')
            .delete()
            .eq('review_id', reviewId)
            .eq('user_id', userId);

        if (error) throw error;
        return true;

    } catch (error) {
        console.error("[reviewService > deleteVote] Error:", error.message);
        throw error;
    }
};
