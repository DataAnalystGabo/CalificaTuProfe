import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // --- ESTADOS DE USUARIO Y SESIÓN ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            return null;
        }
    };

    // --- EFECTO DE AUTENTICACIÓN (LIFECYCLE) ---
    /**
     * Gestiona la sesión de forma global. Al cargar o cambiar el estado,
     * combina los datos de Auth con los del perfil público.
     */
    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {

            try {
                // Creamos un timeout de seguridad de 10 segundos
                // Si Supabase se cuelga refrescando el token, esto forzará la carga de la UI
                const timeoutPromise = new Promise((resolve) =>
                    setTimeout(() => {
                        console.warn("Auth check timed out - forcing guest mode");
                        resolve({ data: { session: null }, error: "Timeout" });
                    }, 10000)
                );

                // 2. Ejecutamos getSession compitiendo con el timeout
                const { data, error } = await Promise.race([
                    supabase.auth.getSession(),
                    timeoutPromise
                ]);

                if (error || !data.session) {
                    if (mounted) setUser(null);
                    // Si hubo error real de Supabase (y no es nuestro timeout), limpiamos
                    if (error && error !== "Timeout") await supabase.auth.signOut();
                } else {
                    // Si tenemos sesión, buscamos el perfil (también protegido)
                    const profile = await fetchUserProfile(data.session.user.id);
                    if (mounted) {
                        setUser(profile ? { ...data.session.user, ...profile } : data.session.user);
                    }
                }
            } catch (err) {
                console.warn("Inicialización forzada por timeout o error:", err);
                if (mounted) setUser(null); // Fallback a modo invitado
            } finally {
                // 4. EL PUNTO CRÍTICO: Si el componente sigue montado, apagamos loading SIEMPRE
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_OUT' || (!session && event === 'USER_UPDATED')) {
                setUser(null);
                setLoading(false);
            } else if (session) {
                const profile = await fetchUserProfile(session.user.id);
                setUser({ ...session.user, ...profile });
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // --- ACCIONES DE AUTENTICACIÓN ---
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null); // Limpieza manual inmediata del estado
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión: ", error.message);
        }
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
            {/* Si está cargando mostramos un spinner simple, sino la app */}
            {loading ? (
                <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                    <div className="text-stone-400 font-medium animate-pulse">Cargando sesión...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );

};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);