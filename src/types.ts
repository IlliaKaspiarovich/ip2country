export type RowStatus = 'idle' | 'loading' | 'done' | 'error';

export interface LookupResult {
  ip: string;
  country?: string;
  countryCode?: string;
  city?: string;
  timezone?: string; // IANA like "Europe/Warsaw"
  error?: string;
}

export interface RowItem {
  id: string;
  label: string;
  ip: string;
  status: RowStatus;
  result?: LookupResult;
  error?: string;
}
