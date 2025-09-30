/**
 * Converts an ISO 3166-1 alpha-2 code to an emoji flag.
 * Emoji flags are two Regional Indicator Symbols:
 * 'A'..'Z' → U+1F1E6..U+1F1FF. We map each letter and join.
 * Returns '' for invalid codes.
 */

export function countryCodeToEmoji(code?: string): string {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return '';

  const base = 0x1f1e6; // Regional Indicator Symbol Letter A
  const A = 'A'.charCodeAt(0);
  const up = code.toUpperCase();

  return (
    String.fromCodePoint(base + (up.charCodeAt(0) - A)) +
    String.fromCodePoint(base + (up.charCodeAt(1) - A))
  );
}
