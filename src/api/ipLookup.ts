import type { LookupResult } from '@/types';

const TTL_MS = 10 * 60 * 1000; // 10 mins
const CONCURRENCY = 4;

type CacheItem = {
  value: LookupResult;
  until: number;
};

const cache = new Map<string, CacheItem>();
const inflight = new Map<string, Promise<LookupResult>>();
const queue: Array<() => void> = [];
let active = 0;

function schedule<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = async () => {
      active++;

      try {
        resolve(await task());
      } catch (e) {
        reject(e);
      } finally {
        active--;
        const next = queue.shift();
        if (next) next();
      }
    };

    if (active < CONCURRENCY) {
      run();
    } else {
      queue.push(run);
    }
  });
}

async function fetchIpapi(ip: string): Promise<LookupResult> {
  const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;

  const res = await fetch(url);

  if (!res.ok) {
    return { ip, error: `HTTP ${res.status}` };
  }

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((data as any).error) {
    return {
      ip,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (data as any).reason || 'Lookup failed',
    };
  }

  return {
    ip,
    country: data.country_name ?? undefined,
    countryCode: ((data as Record<string, unknown>).country as string) ?? undefined,
    city: data.city ?? undefined,
    timezone: data.timezone ?? undefined,
  };
}

export async function lookupIp(ip: string): Promise<LookupResult> {
  const key = ip.trim();

  if (!key) return { ip };

  // Checks cache
  const hit = cache.get(key);
  if (hit && hit.until > Date.now()) return hit.value;

  // Checks inflight
  const existing = inflight.get(key);
  if (existing) return existing;

  const p = schedule(async () => {
    try {
      const result = await fetchIpapi(key);

      if (!result.error) {
        cache.set(key, { value: result, until: Date.now() + TTL_MS });
      }

      return result;
    } finally {
      inflight.delete(key);
    }
  });

  inflight.set(key, p);

  return p;
}
