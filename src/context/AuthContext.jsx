import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // --- ESTADOS DE USUARIO Y SESIÓN CON HIDRATACIÓN ---
    const [user, setUser] = useState(() => {
        // Intentar recuperar usuario del localStorage al iniciar
        try {
            const savedUser = localStorage.getItem('app_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('[AuthContext] Error leyendo localStorage:', error);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);
    const sessionRestoredRef = useRef(false);

    // --- ESTADOS DE CONTROL DE MODAL (UI) ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login");

    // --- FUNCIÓN HELPER PARA ACTUALIZAR USUARIO CON PERSISTENCIA ---
    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            try {
                localStorage.setItem('app_user', JSON.stringify(newUser));
            } catch (error) {
                console.error('[AuthContext] Error guardando en localStorage:', error);
            }
        } else {
            localStorage.removeItem('app_user');
        }
    };

    // --- LÓGICA DE RECUPERACIÓN DE DATOS ---
    const fetchUserProfile = async (userId) => {
        try {
            console.log('[fetchUserProfile] Buscando perfil para:', userId);

            // Timeout de 5 segundos para la query
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout fetchUserProfile')), 5000)
            );

            const queryPromise = supabase
                .from("Users")
                .select("nickname, role, status")
                .eq("id", userId)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            console.log('[fetchUserProfile] Respuesta:', { data, error });

            if (error) throw error;

            console.log('[fetchUserProfile] Perfil encontrado:', data);
            return data;
        } catch (error) {
            console.error('[fetchUserProfile] Error:', error.message);
            return null;
        }
    };

    // --- EFECTO DE AUTENTICACIÓN (LIFECYCLE) ---
    useEffect(() => {
        let mounted = true;

        // Detectar si hay token guardado
        const hasToken = Object.keys(localStorage).some(k => k.includes('auth-token'));

        if (!hasToken) {
            setLoading(false);
            return;
        }

        // Si hay token, esperar al evento de Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;
                console.log("[AuthContext] Auth event:", event);

                sessionRestoredRef.current = true;

                if (session) {
                    // Intentar cargar perfil completo
                    const profile = await fetchUserProfile(session.user.id);

                    if (profile) {
                        // Caso ideal: perfil cargado
                        console.log('[AuthContext] Usuario con perfil:', profile);
                        updateUser({ ...session.user, ...profile });
                    } else {
                        // Fallback: usar solo datos de session
                        console.warn('[AuthContext] Perfil no encontrado - usando session');
                        updateUser({
                            id: session.user.id,
                            email: session.user.email,
                            nickname: null,
                            role: 'user',
                            status: 'active'
                        });
                    }
                } else {
                    updateUser(null);
                }

                setLoading(false);
            }
        );

        // Timeout de seguridad (3s)
        const timeoutId = setTimeout(() => {
            if (mounted && !sessionRestoredRef.current) {
                console.warn("[AuthContext] Timeout - forcing guest mode");
                setLoading(false);
            }
        }, 3000);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    // --- ACCIONES DE AUTENTICACIÓN ---
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            updateUser(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión: ", error.message);
        }
    };

    // --- ACCIONES DE INTERFAZ (MODAL) ---
    const openLogin = () => { setModalMode("login"); setIsModalOpen(true); };
    const openRegister = () => { setModalMode("register"); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // Log de estado para debugging
    console.log('[AuthContext] Rendering - user:', user, 'loading:', loading);

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
            setModalMode,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);