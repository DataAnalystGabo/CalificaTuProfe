import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import AuthShell from "./Auth/AuthShell";
import AuthGuard from "./AuthGuard";

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-stone-50 flex flex-col">
                <Header onMenuToggle={openMenu} />
                <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
                <div className="grow">
                    <Outlet />
                </div>
            </div>
            <AuthShell />
        </AuthGuard>
    );
}
