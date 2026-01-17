import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate("/explorar", { replace: true });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in duration-300">
                <AuthForm
                    mode={mode}
                    onSuccess={handleSuccess}
                    onSwitchMode={() => setMode(mode === "login" ? "register" : "login")}
                />
            </div>
        </div>
    );
}
