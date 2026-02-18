import { View, Text, StyleSheet } from 'react-native';
import { AirQualityData, UVData } from '../types';
import { useLocale } from '../context/LocaleContext';

interface Props {
  airQuality: AirQualityData;
  uv: UVData;
}

export default function AlertBanner({ airQuality, uv }: Props) {
  const { t } = useLocale();

  const alerts: string[] = [];
  if (airQuality.aqi >= 4) alerts.push(t.alerts.poorAirQuality);
  if (uv.uvMax >= 8)       alerts.push(t.alerts.highUV);

  if (!alerts.length) return null;

  return (
    <View style={styles.banner}>
      {alerts.map((alert, i) => (
        <Text key={i} style={styles.text}>{alert}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#FF6D00', borderRadius: 12, padding: 14, gap: 6 },
  text:   { color: '#fff', fontWeight: '600', fontSize: 14, lineHeight: 20 },
});
