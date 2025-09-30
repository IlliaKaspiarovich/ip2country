export function formatTimeNowInTZ(timeZone: string) {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone,
        }).format(new Date())
    } catch {
        return ''
    }
}