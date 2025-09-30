import { describe, it, expect } from 'vitest'
import { isValidIPv4 } from 'src/utils/validate'

describe('IPv4 validation', () => {
    it('accepts valid addresses', () => {
        for (const ip of ['0.0.0.0', '8.8.8.8', '127.0.0.1', '192.168.0.1', '255.255.255.255']) {
            expect(isValidIPv4(ip)).toBe(true)
        }
    })

    it('rejects invalid addresses', () => {
        for (const ip of ['256.0.0.1', '192.168.1', '1.2.3.4.5', 'abc.def.ghi.jkl', ' 1.2.3.4 ', '01.02.03.004']) {
            expect(isValidIPv4(ip)).toBe(false)
        }
    })
})