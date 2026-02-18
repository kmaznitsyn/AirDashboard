import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export default function Snackbar({ message, onDismiss, duration = 4500 }: Props) {
  const { isDark } = useTheme();
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  // In light mode: dark pill (contrasts against light screen)
  // In dark mode:  near-white pill (contrasts against dark screen)
  const snackBg    = isDark ? '#e6edf3' : '#1a1a2e';
  const snackText  = isDark ? '#1a1a2e' : '#e0e0e0';
  const snackClose = isDark ? '#555e6e' : '#8892b0';

  useEffect(() => {
    if (!message) {
      opacity.setValue(0);
      translateY.setValue(24);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(timer);
  }, [message]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 0, duration: 240, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 24, duration: 240, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.snackbar,
        { backgroundColor: snackBg, opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.icon}>🚫</Text>
      <Text style={[styles.text, { color: snackText }]}>{message}</Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[styles.close, { color: snackClose }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 999,
  },
  icon:  { fontSize: 16, marginTop: 1 },
  text:  { flex: 1, fontSize: 13, lineHeight: 19 },
  close: { fontSize: 14, marginTop: 1 },
});
