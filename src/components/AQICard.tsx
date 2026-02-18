import { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { AirQualityData } from '../types';
import { AQI_COLORS, AQI_LEVEL_KEYS } from '../constants/levels';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { rf } from '../utils/responsive';

interface Props {
  aq: AirQualityData;
  notifyEnabled: boolean;
  onToggleNotify: () => void;
}

export default function AQICard({ aq, notifyEnabled, onToggleNotify }: Props) {
  const { colors, isDark } = useTheme();
  const { t }              = useLocale();

  const color      = AQI_COLORS[aq.aqi] ?? '#999';
  const levelKey   = AQI_LEVEL_KEYS[aq.aqi];
  const level      = t.aqiLevels[levelKey];

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const tooltipBg   = isDark ? '#3d0000' : '#FFEBEE';
  const tooltipText = isDark ? '#ffb3b3' : '#5a0000';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t.airQualityIndex}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{level.label}</Text>
        </View>
      </View>

      <Text style={[styles.aqiNumber, { color: colors.text }]}>{aq.aqi}/5</Text>
      <Text style={[styles.advice, { color: colors.textSecondary }]}>{level.advice}</Text>

      {/* Pollutant breakdown */}
      <View style={[styles.pollutantsRow, { backgroundColor: colors.surfaceAlt }]}>
        <PollutantCell label="PM2.5" value={`${aq.pm2_5}`} unit="µg/m³" colors={colors} />
        <View style={[styles.pollutantDivider, { backgroundColor: colors.border }]} />
        <PollutantCell label="PM10"  value={`${aq.pm10}`}  unit="µg/m³" colors={colors} />
        <View style={[styles.pollutantDivider, { backgroundColor: colors.border }]} />
        <PollutantCell label="O₃"    value={`${aq.o3}`}    unit="µg/m³" colors={colors} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Notification toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleIcon}>🔔</Text>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>{t.alertOnPoorAQI}</Text>

        <TouchableOpacity
          onPress={() => setTooltipVisible((v) => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.infoBtn, { color: tooltipVisible ? '#D50000' : colors.textSecondary }]}>
            ⓘ
          </Text>
        </TouchableOpacity>

        <Switch
          value={notifyEnabled}
          onValueChange={onToggleNotify}
          trackColor={{ false: colors.border, true: '#EF9A9A' }}
          thumbColor={notifyEnabled ? '#D50000' : colors.surfaceAlt}
          ios_backgroundColor={colors.border}
        />
      </View>

      {/* Tooltip */}
      {tooltipVisible && (
        <View style={[styles.tooltip, { backgroundColor: tooltipBg, borderLeftColor: '#D50000' }]}>
          <Text style={[styles.tooltipText, { color: tooltipText }]}>{t.aqiTooltip}</Text>
        </View>
      )}
    </View>
  );
}

function PollutantCell({
  label, value, unit, colors,
}: {
  label: string; value: string; unit: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.pollutantCell}>
      <Text style={[styles.pollutantValue, { color: colors.text }]} numberOfLines={1}>{value}</Text>
      <Text style={[styles.pollutantUnit,  { color: colors.textSecondary }]}>{unit}</Text>
      <Text style={[styles.pollutantLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:             { borderRadius: 16, padding: rf(20), gap: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title:            { fontSize: rf(16), fontWeight: '700' },
  badge:            { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText:        { color: '#fff', fontWeight: '700', fontSize: rf(13) },
  aqiNumber:        { fontSize: rf(36), fontWeight: '800', lineHeight: rf(42) },
  advice:           { fontSize: rf(14), lineHeight: rf(20) },
  pollutantsRow:    { flexDirection: 'row', borderRadius: 12, padding: rf(14), marginTop: 4 },
  pollutantDivider: { width: StyleSheet.hairlineWidth, marginHorizontal: 6 },
  pollutantCell:    { flex: 1, alignItems: 'center', gap: 2 },
  pollutantValue:   { fontSize: rf(16), fontWeight: '700' },
  pollutantUnit:    { fontSize: rf(10) },
  pollutantLabel:   { fontSize: rf(12), fontWeight: '600', marginTop: 2 },
  divider:          { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  toggleRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleIcon:       { fontSize: 17 },
  toggleLabel:      { flex: 1, fontSize: rf(14), fontWeight: '600' },
  infoBtn:          { fontSize: 17 },
  tooltip:          { borderRadius: 10, padding: rf(12), borderLeftWidth: 3 },
  tooltipText:      { fontSize: rf(13), lineHeight: rf(19) },
});
