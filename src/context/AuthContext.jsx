import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Estados de usuario y sesión con hidratación:
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("app_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("[AuthContext] Error leyendo localStorage:", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(() => {
        try {
            const savedUser = localStorage.getItem("app_user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                return !parsed.nickname; // Si tiene nickname, no loading
            }
            return true;
        } catch (error) {
            return true;
        }
    });

    // Indica si la sesión está lista para queries a Supabase:
    const [sessionReady, setSessionReady] = useState(false);

    // Ref para evitar procesar eventos duplicados:
    const eventProcessedRef = useRef(false);

    // Estados del modal:
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login");

    // Helper para persistir usuario:
    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            try {
                localStorage.setItem("app_user", JSON.stringify(newUser));
            } catch (error) {
                console.error("[AuthContext] Error guardando en localStorage:", error);
            }
        } else {
            localStorage.removeItem("app_user");
        }
    };

    // Verificar si el cache tiene perfil completo:
    const hasCompleteProfile = (u) => u && u.nickname != null;

    // Fetch del perfil de usuario (con reintentos):
    const fetchUserProfile = async (userId, attempt = 1) => {
        const MAX_ATTEMPTS = 3;
        const timeout = 8000;

        try {
            console.log(`[AuthContext < fetchUserProfile] Intento ${attempt}/${MAX_ATTEMPTS}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const { data, error } = await supabase
                .from('Users')
                .select('nickname, role, status')
                .eq('id', userId)
                .single()
                .abortSignal(controller.signal);

            clearTimeout(timeoutId);

            if (error) throw error;
            if (!data) throw new Error("Datos vacíos");

            console.log(`[fetchUserProfile] Éxito:`, data);
            return data;

        } catch (error) {
            console.warn(`[fetchUserProfile] Intento ${attempt} falló:`, error.message);

            if (attempt < MAX_ATTEMPTS) {
                await new Promise(r => setTimeout(r, 1000 * attempt));
                return fetchUserProfile(userId, attempt + 1);
            }
            return null;
        }
    };

    // Efecto principal de autenticación:
    useEffect(() => {
        let mounted = true;
        const cachedUser = user;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;
                console.log("[AuthContext] Auth event:", event, "session:", !!session);

                // SIGNED_OUT: Limpiar todo
                if (event === 'SIGNED_OUT') {
                    console.log("[AuthContext] Cerrando sesión");
                    updateUser(null);
                    setSessionReady(false);
                    eventProcessedRef.current = false;
                    setLoading(false);
                    return;
                }

                // INITIAL_SESSION o SIGNED_IN con sesión válida:
                if (session?.user?.id) {
                    const userId = session.user.id;

                    // Caso F5 con cache válido: usar cache inmediatamente, no fetch
                    if (event === 'INITIAL_SESSION' && hasCompleteProfile(cachedUser)) {
                        console.log("[AuthContext] F5 con cache válido - sin fetch");
                        setSessionReady(true);
                        setLoading(false);
                        eventProcessedRef.current = true;
                        return;
                    }

                    // Evitar procesamiento duplicado:
                    if (eventProcessedRef.current && event === 'SIGNED_IN') {
                        console.log("[AuthContext] SIGNED_IN duplicado - ignorando");
                        return;
                    }

                    // Login fresco o F5 sin cache: set user básico inmediatamente
                    if (!eventProcessedRef.current) {
                        console.log("[AuthContext] Procesando sesión - set user básico");
                        eventProcessedRef.current = true;
                        
                        // Set user inmediatamente con datos de sesión (sin esperar fetch):
                        const basicUser = {
                            id: userId,
                            email: session.user.email,
                            nickname: cachedUser?.nickname || null,
                            role: cachedUser?.role || 'user',
                            status: cachedUser?.status || 'active'
                        };
                        updateUser(basicUser);
                        setSessionReady(true);
                        setLoading(false);

                        // Fetch perfil en background (no bloquea UI):
                        setTimeout(async () => {
                            if (!mounted) return;
                            const profile = await fetchUserProfile(userId);
                            if (profile && mounted) {
                                updateUser({ ...session.user, ...profile });
                                console.log("[AuthContext] Perfil actualizado en background");
                            }
                        }, 100);
                    }
                    return;
                }

                // Sin sesión y sin cache: estado limpio
                if (!session && !cachedUser) {
                    console.log("[AuthContext] Sin sesión ni cache");
                    setSessionReady(true);
                    setLoading(false);
                }
            }
        );

        // Timeout de seguridad:
        const timeoutId = setTimeout(() => {
            if (mounted && !eventProcessedRef.current) {
                console.warn("[AuthContext] Timeout - forzando ready");
                setSessionReady(true);
                setLoading(false);
            }
        }, 5000);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    // Función de deslogueo:
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            updateUser(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

    // Acciones del modal:
    const openLogin = () => { setModalMode("login"); setIsModalOpen(true); };
    const openRegister = () => { setModalMode("register"); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    console.log("[AuthContext] Render - user:", !!user, "loading:", loading, "sessionReady:", sessionReady);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            sessionReady,
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