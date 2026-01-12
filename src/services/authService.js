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