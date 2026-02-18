// ── AQI (1–5 OpenWeatherMap scale) ───────────────────────────────────────────

export const AQI_COLORS: Record<number, string> = {
  1: '#00C853',
  2: '#FFD600',
  3: '#FF6D00',
  4: '#D50000',
  5: '#6A1B9A',
};

// Keys used to look up translated labels in i18n
export type AQILevelKey = 'good' | 'fair' | 'moderate' | 'poor' | 'veryPoor';

export const AQI_LEVEL_KEYS: Record<number, AQILevelKey> = {
  1: 'good',
  2: 'fair',
  3: 'moderate',
  4: 'poor',
  5: 'veryPoor',
};

// ── UV index ─────────────────────────────────────────────────────────────────

export type UVLevelKey = 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';

export const getUVColor = (uv: number): string => {
  if (uv <= 2)  return '#00C853';
  if (uv <= 5)  return '#FFD600';
  if (uv <= 7)  return '#FF6D00';
  if (uv <= 10) return '#D50000';
  return '#6A1B9A';
};

export const getUVLevelKey = (uv: number): UVLevelKey => {
  if (uv <= 2)  return 'low';
  if (uv <= 5)  return 'moderate';
  if (uv <= 7)  return 'high';
  if (uv <= 10) return 'veryHigh';
  return 'extreme';
};
