import { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { UVData } from '../types';
import { getUVColor, getUVLevelKey } from '../constants/levels';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { rf } from '../utils/responsive';

interface Props {
  uv: UVData;
  notifyEnabled: boolean;
  onToggleNotify: () => void;
}

export default function UVCard({ uv, notifyEnabled, onToggleNotify }: Props) {
  const { colors, isDark } = useTheme();
  const { t }              = useLocale();

  const color       = getUVColor(uv.uvMax);
  const levelKey    = getUVLevelKey(uv.uvMax);
  const level       = t.uvLevels[levelKey];
  const fillPercent = Math.min(uv.uvMax / 12, 1);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const tooltipBg   = isDark ? '#3d3000' : '#FFFDE7';
  const tooltipText = isDark ? '#ffe082' : '#5a4a00';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t.uvIndex}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{level.label}</Text>
        </View>
      </View>

      <Text style={[styles.value, { color }]}>{uv.uvMax}</Text>

      {/* Progress bar */}
      <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
        <View style={[styles.barFill, { width: `${fillPercent * 100}%`, backgroundColor: color }]} />
      </View>

      <Text style={[styles.hint, { color: colors.textSecondary }]}>{level.hint}</Text>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Notification toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleIcon}>🔔</Text>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>{t.alertOnHighUV}</Text>

        <TouchableOpacity
          onPress={() => setTooltipVisible((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.infoBtn, { color: tooltipVisible ? '#F57F17' : colors.textSecondary }]}>
            ⓘ
          </Text>
        </TouchableOpacity>

        <Switch
          value={notifyEnabled}
          onValueChange={onToggleNotify}
          trackColor={{ false: colors.border, true: '#FFD54F' }}
          thumbColor={notifyEnabled ? '#F57F17' : colors.surfaceAlt}
          ios_backgroundColor={colors.border}
        />
      </View>

      {/* Tooltip */}
      {tooltipVisible && (
        <View style={[styles.tooltip, { backgroundColor: tooltipBg, borderLeftColor: '#F57F17' }]}>
          <Text style={[styles.tooltipText, { color: tooltipText }]}>{t.uvTooltip}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { borderRadius: 16, padding: rf(20), gap: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title:       { fontSize: rf(16), fontWeight: '700' },
  badge:       { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText:   { color: '#fff', fontWeight: '700', fontSize: rf(13) },
  value:       { fontSize: rf(48), fontWeight: '800', lineHeight: rf(54) },
  barTrack:    { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill:     { height: '100%', borderRadius: 4 },
  hint:        { fontSize: rf(13) },
  divider:     { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  toggleRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleIcon:  { fontSize: 17 },
  toggleLabel: { flex: 1, fontSize: rf(14), fontWeight: '600' },
  infoBtn:     { fontSize: 17 },
  tooltip:     { borderRadius: 10, padding: rf(12), borderLeftWidth: 3 },
  tooltipText: { fontSize: rf(13), lineHeight: rf(19) },
});
