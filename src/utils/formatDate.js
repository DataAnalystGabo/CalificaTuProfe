export const formatRelativeDate = (dateString) => {
    if (!dateString) return "Sin fecha";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    // Definimos los umbrales en segundos
    const UN_MINUTO = 60;
    const UNA_HORA = 3600;
    const UN_DIA = 86400;

    // Lógica personalizada por tramos
    if (diffInSeconds < UNA_HORA) {
        return "Actualizado hace unos minutos";
    }

    if (diffInSeconds < UN_DIA) {
        return "Actualizado hace unas horas";
    }

    const days = Math.floor(diffInSeconds / UN_DIA);

    if (days === 1) {
        return "Actualizado hace un día";
    } else {
        return `Actualizado hace ${days} días`
    }
}