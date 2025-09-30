import { isValidIP,isValidIPv4, isValidIPv6 } from 'src/utils/validate';
import { describe, expect,it } from 'vitest';

describe('IPv4 validation', () => {
  it('accepts valid', () => {
    for (const ip of ['0.0.0.0', '8.8.8.8', '127.0.0.1', '192.168.0.1', '255.255.255.255']) {
      expect(isValidIPv4(ip)).toBe(true);
    }
  });

  it('rejects invalid', () => {
    for (const ip of ['256.0.0.1', '192.168.1', '1.2.3.4.5', 'abc.def.ghi.jkl', '01.02.03.004']) {
      expect(isValidIPv4(ip)).toBe(false);
    }
  });
});

describe('IPv6 validation', () => {
  it('accepts valid', () => {
    for (const ip of [
      '::',
      '::1',
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      '2001:db8::8a2e:370:7334',
      'fe80::1',
      '::ffff:192.168.0.1',
    ]) {
      expect(isValidIPv6(ip)).toBe(true);
      expect(isValidIP(ip)).toBe(true);
    }
  });

  it('rejects invalid', () => {
    for (const ip of [
      '2001::85a3::8a2e',
      '2001:db8:85a3:z:0:8a2e:370:7334',
      '2001:db8:85a3',
      ':::1',
      '2001:db8:85a3:0000:0000:8a2e:0370:7334:1234',
      '::ffff:999.0.0.1',
    ]) {
      expect(isValidIPv6(ip)).toBe(false);
    }
  });
});
