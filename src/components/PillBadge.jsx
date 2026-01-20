import React from "react";

export default function PillBadge({ icon: Icon, text, bgColor, borderColor, textColor }) {
    // Clases dinámicas de Tailwind, usando backticks para interpolación
    const classes = `
        flex items-center
        px-3 py-1 text-sm font-medium rounded-full
        ${bgColor} ${borderColor} ${textColor}
        border
        w-max
    `;

    return (
        <div className={classes}>
            {Icon && <Icon className="h-4 w-4" />}
            <span>{text}</span>
        </div>
    );
};
