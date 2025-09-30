// IPv4 basic regex (simple & readable)
const OCTET = '(25[0-5]|2[0-4]\\d|1?\\d?\\d)'
const IPV4 = new RegExp(`^${OCTET}\\.${OCTET}\\.${OCTET}\\.${OCTET}$`)

export function isValidIPv4(ip: string): boolean {
    return IPV4.test(ip.trim())
}