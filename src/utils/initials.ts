

export function generateInitials(name?: string, lastName?: string): string {
    const firstInitial = name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
}