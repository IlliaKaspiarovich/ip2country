import { countryCodeToEmoji } from 'src/utils/flags';
import { describe, expect,it } from 'vitest';

describe('countryCodeToEmoji', () => {
  it('converts valid ISO alpha-2 to emoji', () => {
    expect(countryCodeToEmoji('US')).toBe('🇺🇸');
    expect(countryCodeToEmoji('PL')).toBe('🇵🇱');
    expect(countryCodeToEmoji('DE')).toBe('🇩🇪');
    expect(countryCodeToEmoji('JP')).toBe('🇯🇵');
    expect(countryCodeToEmoji('GB')).toBe('🇬🇧');
  });

  it('is case-insensitive', () => {
    expect(countryCodeToEmoji('us')).toBe('🇺🇸');
    expect(countryCodeToEmoji('Gb')).toBe('🇬🇧');
  });

  it('returns empty string for invalid codes', () => {
    for (const v of ['', 'U', 'USA', '1A', 'A1', '😊', 'ru ', ' C A ', undefined]) {
      expect(countryCodeToEmoji(v)).toBe('');
    }
  });
});
