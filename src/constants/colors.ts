export interface ThemeColors {
  background:    string;
  surface:       string;
  surfaceAlt:    string;
  text:          string;
  textSecondary: string;
  textMuted:     string;
  border:        string;
  divider:       string;
  inputBg:       string;
  placeholder:   string;
}

export const lightColors: ThemeColors = {
  background:    '#F0F4F8',
  surface:       '#ffffff',
  surfaceAlt:    '#F0F4F8',
  text:          '#1a1a2e',
  textSecondary: '#8892b0',
  textMuted:     '#aaaaaa',
  border:        '#e9ecef',
  divider:       '#f0f0f0',
  inputBg:       '#ffffff',
  placeholder:   '#999999',
};

export const darkColors: ThemeColors = {
  background:    '#0d1117',
  surface:       '#161b22',
  surfaceAlt:    '#21262d',
  text:          '#e6edf3',
  textSecondary: '#8b949e',
  textMuted:     '#6e7681',
  border:        '#30363d',
  divider:       '#30363d',
  inputBg:       '#21262d',
  placeholder:   '#6e7681',
};
