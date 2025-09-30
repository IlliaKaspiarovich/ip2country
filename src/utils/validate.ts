const HEX_RE = /^[0-9a-fA-F]{1,4}$/;

export function isValidIPv4(ip: string): boolean {
  const s = ip.trim();
  const parts = s.split('.');

  if (parts.length !== 4) return false;

  for (const p of parts) {
    if (!/^\d+$/.test(p)) return false;

    if (p.length > 1 && p.startsWith('0')) return false;

    const n = Number(p);

    if (n < 0 || n > 255) return false;
  }

  return true;
}

function isValidIPv6Core(core: string, hasIPv4Tail: boolean): boolean {
  if (core.includes(':::')) return false;

  const dc = (core.match(/::/g) || []).length;

  if (dc > 1) return false;

  const validateHextets = (arr: string[]) =>
    arr.length === 0 || arr.every((h) => h.length > 0 && HEX_RE.test(h));

  if (dc === 1) {
    const [l, r] = core.split('::');
    const left = l ? l.split(':') : [];
    const right = r ? r.split(':') : [];

    if (!validateHextets(left) || !validateHextets(right)) return false;

    const count = left.length + right.length;
    const neededZeros = 8 - count - (hasIPv4Tail ? 2 : 0);

    return neededZeros >= 1;
  } else {
    const parts = core ? core.split(':') : [];

    if (parts.length === 0) return false;

    if (!validateHextets(parts)) return false;

    const required = 8 - (hasIPv4Tail ? 2 : 0);

    return parts.length === required;
  }
}

export function isValidIPv6(ip: string): boolean {
  const s = ip.trim();

  if (!s) return false;

  if (s.includes('.')) {
    const idx = s.lastIndexOf(':');

    if (idx === -1) return false;

    const ipv4 = s.slice(idx + 1);
    const core = s.slice(0, idx);

    if (!isValidIPv4(ipv4)) return false;

    return isValidIPv6Core(core, true);
  }

  return isValidIPv6Core(s, false);
}

export function isValidIP(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}
