import { Dimensions } from 'react-native';

const BASE_WIDTH = 375;
const { width } = Dimensions.get('window');

// Scale factor: shrinks proportionally below 375 px, grows above but caps at ~414 px equivalent
const scale = Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.12);

/** Responsive size — scales fonts and dimensions from a 375 px baseline */
export const rf = (size: number): number => Math.round(size * scale);

/** True when running on a tablet-sized screen (≥ 768 logical px) */
export const isTablet = width >= 768;

/** Maximum content width for tablet layouts */
export const MAX_CONTENT_WIDTH = 600;
