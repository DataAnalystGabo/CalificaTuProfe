import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login"); // login o register

    const openLogin = () => { setModalMode("login"); setIsModalOpen(true); };
    const openRegister = () => { setModalMode("register"); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // -----------------------------------------------
    // Función TEMPORAL para TESTEAR circuito de login
    // useEffect(()=>{
    //     const loginTest = async () => {
    //         await supabase.auth.signInWithPassword({
    //             email: "email registrado en supabase",
    //             password: "contraseña registrada en supabase"
    //         });
    //     };

    //     loginTest();
    // }, []);
    // -----------------------------------------------

    useEffect(() => {
        // 1. Verificamos sesión actual al cargar la app
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // 2. Escuchar cambios en la autenticación (login, logout, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

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
            setModalMode // Para cambiar entre pestañas dentro del modal    
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );

};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);