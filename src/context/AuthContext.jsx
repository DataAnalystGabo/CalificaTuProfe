import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // --- ESTADOS DE USUARIO Y SESIÓN ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);

    // --- ESTADOS DE CONTROL DE MODAL (UI) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login"); // login o register

    // --- LÓGICA DE RECUPERACIÓN DE DATOS ---
    /**
     * Consulta la tabla pública 'Users' para obtener el nickname generado
     * por el Trigger de base de datos tras el registro.
     */
    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from("Users")
                .select("nickname, role, status")
                .eq("id", userId)
                .single()
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error cargando perfil:", error.message);
        } finally {
            // Esto garantiza que la app deje de mostrar el label "Cargando"
            // incluso si hay un error
            setLoading(false);
        }
    };

    // --- EFECTO DE AUTENTICACIÓN (LIFECYCLE) ---
    /**
     * Gestiona la sesión de forma global. Al cargar o cambiar el estado,
     * combina los datos de Auth con los del perfil público.
     */
    useEffect(() => {
        // Obtenemos sesión inicial
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                const profile = await fetchUserProfile(session.user.id);
                setUser({ ...session.user, ...profile });
            }
            setLoading(false);
        });

        // Escuchamos cambios en la auth (Login/Logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const profile = await fetchUserProfile(session.user.id);
                setUser({ ...session.user, ...profile });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- ACCIONES DE AUTENTICACIÓN ---
    const signOut = async () => {
        await supabase.auth.signOut();
        setIsModalOpen(false);
    };

    // --- ACCIONES DE INTERFAZ (MODAL) ---
    const openLogin = () => { setModalMode("login"); setIsModalOpen(true); };
    const openRegister = () => { setModalMode("register"); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // --- RENDERIZADO DEL PROVEEDOR ---
    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            isAuthenticated: !!user,
            isModalOpen,
            modalMode,
            openLogin,
            openRegister,
            closeModal,
            setModalMode, // Para cambiar entre pestañas dentro del modal
            signOut 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );

};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);