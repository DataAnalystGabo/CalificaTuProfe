import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Estados de usuario y sesión con hidratación:
    const [user, setUser] = useState(() => {
        // Intentar recuperar usuario del localStorage al iniciar:
        try {
            const savedUser = localStorage.getItem("app_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("[AuthContext] Error leyendo localStorage:", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(() => {
        // Si hay un user hidratado, no mostrar loading:
        try {
            const savedUser = localStorage.getItem("app_user");
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                return !parsed.nickname;
            }
        } catch (error) {
            console.error("[AuthContext] Error leyendo localStorage:", error);
            return true; // Por defecto, loading=true
        }
    });
    const sessionRestoredRef = useRef(false);

    // Estados de control para el modal:
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("login");

    // Función helper para actualizar usuario con persistencia:
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

    // Función para recuperar datos desde Supabase respecto al user:
    const fetchUserProfile = async (userId, attempt = 1) => {
        const MAX_ATTEMPTS = 4;
        const timeout = 5000 + (attempt * 1000); 

        try {
            // Nota: no llamar getSession() aquí - causa deadlock cuando se invoca desde onAuthStateChange:
            console.log(`[AuthContext < fetchUserProfile] Intento ${attempt}/${MAX_ATTEMPTS}`);

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout fetchUserProfile')), timeout)
            );

            const queryPromise = supabase
                .from('Users')
                .select('nickname, role, status')
                .eq('id', userId)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            // Si hay error de conexión o RLS (data null cuando debería haber dato):
            if (error) throw error;
            if (!data) throw new Error("Datos vacíos (Posible bloqueo RLS)");

            console.log(`[fetchUserProfile] Éxito en intento ${attempt}:`, data);
            return data;

        } catch (error) {
            console.warn(`[fetchUserProfile] Intento ${attempt} falló:`, error.message);

            if (attempt < MAX_ATTEMPTS) {
                // Intento 1: espera 200ms (suficiente para token refresh):
                // Intento 2: espera 500ms:
                // Intento 3: espera 1000ms:
                const backoffTime = attempt === 1 ? 200 : (500 * attempt);
                
                await new Promise(resolve => setTimeout(resolve, backoffTime));
                return fetchUserProfile(userId, attempt + 1);
            }
            console.error("[fetchUserProfile] Todos los intentos fallaron");
            return null;
        }
    };

    // Efecto de autenticación (lifecycle):
    useEffect(() => {
        let mounted = true;

        // Siempre suscribirse - Supabase maneja la detección de sesión automáticamente:
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;
                console.log("[AuthContext] Auth event:", event);

                sessionRestoredRef.current = true;

                const userId = session?.user?.id;

                if (session && userId) {
                    // Intentar cargar perfil completo:
                    const profile = await fetchUserProfile(userId);

                    if (profile) {
                        // Caso ideal: perfil cargado:
                        console.log("[AuthContext] Usuario con perfil:", profile);
                        updateUser({ ...session.user, ...profile });
                    } else {
                        // Fallback: preservar datos del cache si existen:
                        const cachedUser = localStorage.getItem('app_user');

                        if (cachedUser) {
                            console.warn("[AuthContext] Usando user del cache - perfil no disponible");
                            // No llamar updateUser - mantener el estado hidratado:

                            setLoading(false);
                            return;
                        } else {
                            // Solo si no hay cache, crear user mínimo:
                            console.warn("[AuthContext] Sin cache - creando user básico");
                            updateUser({
                                id: userId,
                                email: session.user.email,
                                nickname: null,
                                role: 'user',
                                status: 'active'
                            });
                        }
                    }
                } else {
                    // Sin sesión válida - limpiar todo (incluye INITIAL_SESSION sin sesión y SIGNED_OUT):
                    console.log("[AuthContext] Sin sesión activa - limpiando estado");
                    updateUser(null);
                }

                setLoading(false);
            }
        );

        // Timeout de seguridad (5s) - Da tiempo a que Supabase restaure la sesión:
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

    // Función de deslogueo:
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            updateUser(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al cerrar sesión: ", error.message);
        }
    };

    // Acciones de interfaz (modal):
    const openLogin = () => { setModalMode("login"); setIsModalOpen(true); };
    const openRegister = () => { setModalMode("register"); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // Log de estado para debugging:
    console.log("[AuthContext] Renderizando - user:", user, "loading:", loading);

    // Renderizado del proveedor:
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