import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // --- ESTADOS DE USUARIO Y SESIÓN CON HIDRATACIÓN ---
    const [user, setUser] = useState(() => {
        // Intentar recuperar usuario del localStorage al iniciar
        try {
            const savedUser = localStorage.getItem("app_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("[AuthContext] Error leyendo localStorage:", error);
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
                localStorage.setItem("app_user", JSON.stringify(newUser));
            } catch (error) {
                console.error("[AuthContext] Error guardando en localStorage:", error);
            }
        } else {
            localStorage.removeItem("app_user");
        }
    };

    // --- LÓGICA DE RECUPERACIÓN DE DATOS ---
    const fetchUserProfile = async (userId, attempt = 1) => {
        const MAX_ATTEMPTS = 3;
        const timeout = 3000 + (attempt * 2000); // 3s + 2s por intento

        try {
            console.log(`[fetchUserProfile] Intento ${attempt}/${MAX_ATTEMPTS} - Timeout: ${timeout}ms`);

            // Timeout de 5 segundos para la query
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout fetchUserProfile')), timeout)
            );

            const queryPromise = supabase
                .from("Users")
                .select("nickname, role, status")
                .eq("id", userId)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) throw error;

            console.log(`[fetchUserProfile] ✅ Éxito en intento ${attempt}:`, data);
            return data;
        } catch (error) {
            console.warn(`[fetchUserProfile] ❌ Intento ${attempt} falló:`, error.message);

            if (attempt < MAX_ATTEMPTS) {
                // Esperar antes de reintentar (1s, 2s)
                const backoffTime = 1000 * attempt;
                console.log(`[fechtUserProfile] Esperando ${backoffTime}ms antes de reintentar...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
                return fetchUserProfile(userId, attempt + 1);
            }
            console.error("[fetchUserProfile] Todos los intentos fallaron");
            return null;
        }
    };

    // --- EFECTO DE AUTENTICACIÓN (LIFECYCLE) ---
    // --- EFECTO DE AUTENTICACIÓN (LIFECYCLE) ---
    useEffect(() => {
        let mounted = true;

        // SIEMPRE suscribirse - Supabase maneja la detección de sesión automáticamente
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
                        console.log("[AuthContext] Usuario con perfil:", profile);
                        updateUser({ ...session.user, ...profile });
                    } else {
                        // Fallback: usar solo datos de session
                        console.warn("[AuthContext] Perfil no encontrado - usando session");
                        updateUser({
                            id: session.user.id,
                            email: session.user.email,
                            nickname: null,
                            role: "user",
                            status: "active"
                        });
                    }
                } else {
                    updateUser(null);
                }

                setLoading(false);
            }
        );

        // Timeout de seguridad (5s) - Da tiempo a que Supabase restaure la sesión
        const timeoutId = setTimeout(() => {
            if (mounted && !sessionRestoredRef.current) {
                console.warn("[AuthContext] Timeout - forzando el modo invitado");
                setLoading(false);
            }
        }, 5000);

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
    console.log("[AuthContext] Renderizando - user:", user, "loading:", loading);

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