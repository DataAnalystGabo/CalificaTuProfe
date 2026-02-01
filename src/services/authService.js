/**
 * ============================================================================================
 * AUTH SERVICE
 * ============================================================================================
 * 
 * NATURALEZA:
 *   Servicio centralizado de autenticación que encapsula todas las operaciones relacionadas
 *   con la gestión de sesiones de usuario. Proporciona una interfaz limpia para interactuar
 *   con el sistema de autenticación de Supabase.
 * 
 * RESPONSABILIDADES:
 *   - Registro de nuevos usuarios
 *   - Inicio de sesión con credenciales
 *   - Cierre de sesión y limpieza de tokens
 * 
 * TAREAS ESPECÍFICAS:
 *   1. signUp    → Registra un nuevo usuario en Supabase Auth usando email y contraseña
 *                  Retorna los datos del usuario creado o lanza error si falla
 * 
 *   2. signIn    → Autentica un usuario existente con email y contraseña
 *                  Utiliza signInWithPassword para autenticación segura
 *                  Retorna los datos de sesión o lanza error si las credenciales son inválidas
 * 
 *   3. signOut   → Cierra la sesión actual del usuario
 *                  Invalida los tokens de autenticación en Supabase
 *                  Lanza error si el proceso de cierre falla
 * 
 * DEPENDENCIAS:
 *   - Supabase Client (../supabaseClient)
 *   - Supabase Auth API
 * 
 * ============================================================================================
 */

import { supabase } from "../supabaseClient";

export const authService = {
    // Función para registrarse
    signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    // Función para iniciar sesión
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    // Función para cerrar sesión
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};