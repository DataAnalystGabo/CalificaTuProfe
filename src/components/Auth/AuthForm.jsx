import React, { useState } from "react";
import { authService } from "../../services/authService";
import { MdOutlineLock, MdOutlineEmail } from "react-icons/md";
import LoadingSpinner  from "../../components/LoadingSpinner";

export default function AuthForm({ mode = "login", onSuccess, onSwitchMode }) {
    // --- ESTADOS DEL FORMULARIO Y CARGA ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- LÓGICA DE ENVÍO Y AUTENTICACIÓN ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "login") {
                await authService.signIn(email, password);
                if (onSuccess) onSuccess();
            } else {
                await authService.signUp(email, password);
                alert("¡Registro exitoso! Revisá tu email y confirmá el registro.");
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header dinámico */}
            <h2 className="text-2xl font-black text-stone-700 mb-2">
                {mode === "login" ? "¡Hola de nuevo!" : "Únete a la comunidad en segundos"}
            </h2>

            <p className="text-stone-500 text-sm mb-8">
                {mode === "login"
                    ? "Ingresá tus credenciales para continuar."
                    : "Registrate y accedé a cientos de reseñas."
                }
            </p>

            {/* Formularios Login/Register */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Input de email */}
                <div className="relative">
                    <label
                        htmlFor="email"
                        className="text-xs font-bold text-stone-500 uppercase ml-1"
                    >
                        Email
                    </label>
                    <div className="relative mt-1 group">
                        <MdOutlineEmail className="absolute h-5 w-5 left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-sky-500" />
                        <input
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                            placeholder="tu@email.com"
                        />
                    </div>
                </div>

                {/* Input de Password */}
                <div className="relative">
                    <label
                        htmlFor="password"
                        className="text-xs font-bold text-stone-500 uppercase ml-1"
                    >
                        Contraseña
                    </label>
                    <div className="relative mt-1 group">
                        <MdOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5 group-focus-within:text-sky-500" />
                        <input
                            id="password"
                            name="password"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-stone-700"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                        {error}
                    </p>
                )}

                {/* Botón principal */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-4 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-stone-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                    {loading && <LoadingSpinner size={20} color="#FFFFFF" />}
                    {loading ? "Procesando..." : (mode === "login" ? "Entrar" : "Crear cuenta")}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm">
                <span className="text-stone-500">
                    {mode === "login" ? "¿No tienes cuenta?" : "¿Ya estás registrado?"}
                </span>
                <button
                    onClick={onSwitchMode}
                    className="ml-2 font-bold hover:underline text-sky-500 hover:text-sky-400 transition-all cursor-pointer"
                >
                    {mode === "login" ? "Creá una aquí." : "Iniciá sesión."}
                </button>
            </div>
        </div>
    );
}
