import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

interface ToggleRowProps {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, description, value, onToggle }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#dde', true: '#90CAF9' }}
        thumbColor={value ? '#1976D2' : '#f4f4f4'}
        ios_backgroundColor="#dde"
      />
    </View>
  );
}

interface Props {
  notifyHighUV: boolean;
  notifyPoorAQI: boolean;
  onToggleUV: () => void;
  onToggleAQI: () => void;
  permissionMsg: string | null;
  onDismissMsg: () => void;
}

export default function NotificationSettingsCard({
  notifyHighUV,
  notifyPoorAQI,
  onToggleUV,
  onToggleAQI,
  permissionMsg,
  onDismissMsg,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>🔔 Alert Settings</Text>
        <Text style={styles.subtitle}>Get notified when conditions change</Text>
      </View>

      <ToggleRow
        icon="☀️"
        label="High UV Index"
        description="Alert when UV index reaches 8 or above"
        value={notifyHighUV}
        onToggle={onToggleUV}
      />

      <View style={styles.divider} />

      <ToggleRow
        icon="😷"
        label="Poor Air Quality"
        description="Alert when AQI level reaches 4 (Poor) or above"
        value={notifyPoorAQI}
        onToggle={onToggleAQI}
      />

      {/* Permission denied message */}
      {permissionMsg && (
        <View style={styles.permissionBanner}>
          <View style={styles.permissionContent}>
            <Text style={styles.permissionIcon}>🚫</Text>
            <Text style={styles.permissionText}>{permissionMsg}</Text>
          </View>
          <TouchableOpacity onPress={onDismissMsg} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.dismissBtn}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  titleRow: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 12,
    color: '#8892b0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  rowDesc: {
    fontSize: 12,
    color: '#8892b0',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: -4,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6D00',
  },
  permissionContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  permissionIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  permissionText: {
    flex: 1,
    fontSize: 13,
    color: '#7a4500',
    lineHeight: 19,
  },
  dismissBtn: {
    fontSize: 14,
    color: '#aaa',
    paddingLeft: 4,
  },
});
