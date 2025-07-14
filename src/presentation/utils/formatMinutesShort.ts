/**
 * Decomposes total minutes into the shortest possible time string.
 */
export function formatMinutesShort(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } if (hours > 0) {
        return `${hours}h`;
    }
    return `${minutes}m`;
}
