import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  StatusBar,
  Platform,
  FlatList,
  Keyboard,
  Animated,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme }   from './src/context/ThemeContext';
import { LocaleProvider, useLocale } from './src/context/LocaleContext';
import { useDashboard }              from './src/hooks/useDashboard';
import { useNotificationSettings }   from './src/hooks/useNotificationSettings';
import { CitySuggestion }            from './src/types';
import WeatherCard  from './src/components/WeatherCard';
import AQICard      from './src/components/AQICard';
import UVCard       from './src/components/UVCard';
import AlertBanner  from './src/components/AlertBanner';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppContent />
      </LocaleProvider>
    </ThemeProvider>
  );
}

// ─── Language config ──────────────────────────────────────────────────────────
const LANG_META = {
  uk: { flag: '🇺🇦', code: 'УК' },
  en: { flag: '🇬🇧', code: 'EN' },
} as const;

// ─── App body ────────────────────────────────────────────────────────────────
function AppContent() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { lang, t, toggleLocale }       = useLocale();

  const {
    data, loading, error,
    searchCity, refresh,
    suggestions, suggestionsLoading,
    fetchSuggestions, selectSuggestion, clearSuggestions,
  } = useDashboard();

  const {
    notifyHighUV, notifyPoorAQI,
    toggleNotifyHighUV, toggleNotifyPoorAQI,
    checkAndNotify,
  } = useNotificationSettings();

  const [input, setInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Spin animation for theme toggle
  const themeSpin = useRef(new Animated.Value(0)).current;
  const handleToggleTheme = () => {
    Animated.sequence([
      Animated.timing(themeSpin, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(themeSpin, { toValue: 0, duration: 0,   useNativeDriver: true }),
    ]).start();
    toggleTheme();
  };
  const themeRotate = themeSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // Slide animation for language toggle
  const langSlide = useRef(new Animated.Value(0)).current;
  const handleToggleLocale = () => {
    Animated.sequence([
      Animated.timing(langSlide, { toValue: -6, duration: 120, useNativeDriver: true }),
      Animated.timing(langSlide, { toValue:  0, duration: 120, useNativeDriver: true }),
    ]).start();
    toggleLocale();
  };

  useEffect(() => {
    if (data) checkAndNotify(data);
  }, [data, checkAndNotify]);

  const handleChangeText = (text: string) => {
    setInput(text);
    fetchSuggestions(text);
  };

  const handleSelectSuggestion = (s: CitySuggestion) => {
    setInput([s.name, s.state, s.country].filter(Boolean).join(', '));
    Keyboard.dismiss();
    selectSuggestion(s);
  };

  const handleSearch = () => {
    clearSuggestions();
    Keyboard.dismiss();
    if (input.trim()) searchCity(input);
  };

  const showDropdown = suggestions.length > 0 || suggestionsLoading;
  const current      = LANG_META[lang];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          🌤 {t.appTitle}
        </Text>

        <View style={styles.headerControls}>
          {/* Language toggle */}
          <TouchableOpacity
            onPress={handleToggleLocale}
            style={[styles.langBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.75}
          >
            <Animated.View
              style={[styles.langBtnInner, { transform: [{ translateX: langSlide }] }]}
            >
              <Text style={styles.langFlag}>{current.flag}</Text>
              <Text style={[styles.langCode, { color: colors.text }]}>{current.code}</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Theme toggle */}
          <TouchableOpacity
            onPress={handleToggleTheme}
            style={[styles.iconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.75}
          >
            <Animated.Text style={[styles.iconBtnText, { transform: [{ rotate: themeRotate }] }]}>
              {isDark ? '☀️' : '🌙'}
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchRow}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={colors.placeholder}
            value={input}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
          />
          <TouchableOpacity style={styles.btn} onPress={handleSearch} activeOpacity={0.85}>
            <Text style={styles.btnText}>{t.searchGo}</Text>
          </TouchableOpacity>
        </View>

        {/* Autocomplete dropdown */}
        {showDropdown && (
          <View style={[styles.dropdown, { backgroundColor: colors.surface }]}>
            {suggestionsLoading && suggestions.length === 0 ? (
              <View style={styles.dropdownLoading}>
                <ActivityIndicator size="small" color="#1976D2" />
                <Text style={[styles.dropdownLoadingText, { color: colors.textSecondary }]}>
                  {t.searching}
                </Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(item, i) => `${item.lat}-${item.lon}-${i}`}
                keyboardShouldPersistTaps="always"
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.suggestionRow,
                      index < suggestions.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.divider,
                      },
                    ]}
                    onPress={() => handleSelectSuggestion(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionLeft}>
                      <Text style={styles.suggestionIcon}>📍</Text>
                      <View>
                        <Text style={[styles.suggestionCity, { color: colors.text }]}>
                          {item.name}
                        </Text>
                        {(item.state || item.country) && (
                          <Text style={[styles.suggestionSub, { color: colors.textSecondary }]}>
                            {[item.state, item.country].filter(Boolean).join(', ')}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.suggestionArrow, { color: colors.border }]}>›</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* ── Loading ── */}
      {loading && !data && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={[styles.stateText, { color: colors.textSecondary }]}>
            {t.fetchingConditions}
          </Text>
        </View>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* ── Dashboard ── */}
      {data && (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => { clearSuggestions(); Keyboard.dismiss(); }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              tintColor="#1976D2"
              colors={['#1976D2']}
            />
          }
        >
          <AlertBanner airQuality={data.airQuality} uv={data.uv} />
          <WeatherCard w={data.weather} />
          <AQICard
            aq={data.airQuality}
            notifyEnabled={notifyPoorAQI}
            onToggleNotify={toggleNotifyPoorAQI}
          />
          <UVCard
            uv={data.uv}
            notifyEnabled={notifyHighUV}
            onToggleNotify={toggleNotifyHighUV}
          />
          <Text style={[styles.footer, { color: colors.textMuted }]}>{t.footer}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  // Language pill button
  langBtn: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  langBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langFlag: {
    fontSize: 16,
    lineHeight: 20,
  },
  langCode: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Theme (icon) button
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  iconBtnText: {
    fontSize: 17,
  },

  // Search
  searchWrapper: {
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  btn: {
    backgroundColor: '#1976D2',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // Dropdown
  dropdown: {
    position: 'absolute',
    top: 64,
    left: 16,
    right: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 200,
  },
  dropdownLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  dropdownLoadingText: { fontSize: 14 },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  suggestionLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  suggestionIcon:  { fontSize: 16 },
  suggestionCity:  { fontSize: 15, fontWeight: '600' },
  suggestionSub:   { fontSize: 12, marginTop: 1 },
  suggestionArrow: { fontSize: 20, fontWeight: '300' },

  // States
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  stateText:      { fontSize: 15 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 12 },
  errorIcon:      { fontSize: 40 },
  errorText:      { fontSize: 15, color: '#c00', textAlign: 'center', lineHeight: 22 },

  scroll:  { padding: 16, gap: 12, paddingBottom: 32 },
  footer:  { fontSize: 11, textAlign: 'center', marginTop: 8, lineHeight: 18 },
});
