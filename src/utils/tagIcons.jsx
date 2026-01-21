import {
    FiSun,
    FiClipboard,
    FiCoffee,
    FiMessageCircle,
    FiCheckCircle,
    FiSmile,
    FiTrendingUp,
    FiAlertTriangle
} from "react-icons/fi";

const TAG_STYLES = {
    "La tiene clara": {
        icon: FiSun,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Toma lista": {
        icon: FiClipboard,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "ttext-sky-600"
    },
    "Explica claro": {
        icon: FiCoffee,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Divaga mucho": {
        icon: FiMessageCircle,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Super aprobable": {
        icon: FiCheckCircle,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Buena onda": {
        icon: FiSmile,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Promocionable": {
        icon: FiTrendingUp,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Clases dinámicas": {
        icon: FiTrendingUp,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    },
    "Exigente": {
        icon: FiAlertTriangle,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-400",
        textColor: "text-sky-600"
    }
};

const INACTIVE_STYLES = {
    bgColor: "bg-stone-50",
    borderColor: "border-stone-400",
    textColor: "text-stone-600"
};

export const getTagConfig = (tagName, { isActive = true } = {}) => {
    const tagStyle = TAG_STYLES[tagName];

    // Si no existe la etiqueta, retornamos null o un default absoluto
    if (!tagStyle) {
        return {
            icon: null,
            ...INACTIVE_STYLES
        };
    }

    // Si existe, retornamos el icono siempre, y los colores según el estado
    return {
        icon: tagStyle.icon,
        ...(isActive
            ? {
                bgColor: tagStyle.bgColor,
                borderColor: tagStyle.borderColor,
                textColor: tagStyle.textColor
            }
            : INACTIVE_STYLES
        )
    };
};
