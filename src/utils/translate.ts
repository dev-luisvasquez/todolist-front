import { DateTime } from "luxon";

export function FormatTime(minutes: number): string {
    if (minutes < 0) {
        return "0 minutos";
    }

    // Si es menos de 1 minuto, mostrar en segundos
    if (minutes < 1) {
        const seconds = Math.round(minutes * 60);
        if (seconds === 0) {
            return "0 segundos";
        }
        return seconds === 1 ? "1 segundo" : `${seconds} segundos`;
    }

    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = Math.floor(minutes % 60);

    const parts: string[] = [];

    if (days > 0) {
        parts.push(days === 1 ? "1 día" : `${days} días`);
    }

    if (hours > 0) {
        parts.push(hours === 1 ? "1 hora" : `${hours} horas`);
    }

    if (remainingMinutes > 0) {
        parts.push(remainingMinutes === 1 ? "1 minuto" : `${remainingMinutes} minutos`);
    }

    // Si no hay días, horas ni minutos, mostrar "0 minutos"
    if (parts.length === 0) {
        return "0 minutos";
    }

    // Unir las partes con "y" antes del último elemento
    if (parts.length === 1) {
        return parts[0];
    } else if (parts.length === 2) {
        return parts.join(" y ");
    } else {
        return parts.slice(0, -1).join(", ") + " y " + parts[parts.length - 1];
    }
}

export function TranslatePriority(priority: string): string {
    const priorityUpper = priority.toUpperCase();
    switch (priorityUpper) {
        case 'LOW':
            return 'Baja';
        case 'MEDIUM':
            return 'Media';
        case 'HIGH':
            return 'Alta';
        default:
            return priority;
    }
}

export function TranslateState(state: string): string {
    const stateLower = state.toLowerCase();
    switch (stateLower) {
        case 'pending':
            return 'Pendiente';
        case 'in_progress':
            return 'En Progreso';
        case 'completed':
            return 'Completada';
        default:
            return state;
    }
}

export function FormatDate(dateString: string): string {
    const date = DateTime.fromISO(dateString);
    if (!date.isValid) {
        return dateString; // Retorna el string original si no es una fecha válida
    }
    return date.setLocale('es').toFormat('ccc dd LLL');
} 

