import type { LookupResult } from '@/types'

// Uses ipapi.co (has CORS + free tier)
export async function lookupIp(ip: string): Promise<LookupResult> {
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`
    const res = await fetch(url)
    if (!res.ok) {
        return { ip, error: `HTTP ${res.status}` }
    }
    const data = await res.json()
    if ((data as any).error) {
        return { ip, error: (data as any).reason || 'Lookup failed' }
    }
    return {
        ip,
        country: data.country_name ?? undefined,
        city: data.city ?? undefined,
        timezone: data.timezone ?? undefined,
    }
}