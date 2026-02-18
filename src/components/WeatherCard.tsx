import { View, Text, Image, StyleSheet } from 'react-native';
import { WeatherData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import { rf } from '../utils/responsive';

interface Props {
  w: WeatherData;
}

export default function WeatherCard({ w }: Props) {
  const { isDark } = useTheme();
  const { t }      = useLocale();
  const iconUri    = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
  const cardBg     = isDark ? '#0D47A1' : '#1565C0';

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">
        {w.city}, {w.country}
      </Text>

      <View style={styles.mainRow}>
        <Image source={{ uri: iconUri }} style={styles.icon} />
        <Text style={styles.temp}>{w.temp}°C</Text>
      </View>

      <Text style={styles.desc} numberOfLines={1}>{w.description}</Text>

      <View style={styles.metaRow}>
        <MetaPill icon="💧" label={`${w.humidity}%`}     sublabel={t.humidity}  />
        <MetaPill icon="💨" label={`${w.windSpeed} m/s`} sublabel={t.wind}      />
        <MetaPill icon="🌡" label={`${w.feelsLike}°C`}   sublabel={t.feelsLike} />
      </View>
    </View>
  );
}

function MetaPill({ icon, label, sublabel }: { icon: string; label: string; sublabel: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillIcon}>{icon}</Text>
      <Text style={styles.pillValue} numberOfLines={1}>{label}</Text>
      <Text style={styles.pillLabel} numberOfLines={1}>{sublabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { borderRadius: 16, padding: rf(20), gap: 8 },
  city:      { fontSize: rf(20), fontWeight: '700', color: '#fff', textTransform: 'capitalize' },
  mainRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon:      { width: rf(64), height: rf(64) },
  temp:      { fontSize: rf(52), fontWeight: '800', color: '#fff', lineHeight: rf(60) },
  desc:      { fontSize: rf(15), color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize', marginBottom: 4 },
  metaRow:   { flexDirection: 'row', gap: 8, marginTop: 4 },
  pill:      { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: rf(10), alignItems: 'center', gap: 2 },
  pillIcon:  { fontSize: 18 },
  pillValue: { fontSize: rf(14), fontWeight: '700', color: '#fff' },
  pillLabel: { fontSize: rf(11), color: 'rgba(255,255,255,0.7)' },
});
