import { AQILevelKey, UVLevelKey } from './levels';

export type Language = 'uk' | 'en';

export interface Translations {
  // Header
  appTitle: string;

  // Search
  searchPlaceholder: string;
  searchGo:          string;
  searching:         string;

  // Loading / error states
  fetchingConditions: string;
  cityNotFound:       string;
  locationDenied:     string;
  locationError:      string;
  failedToLoad:       string;

  // Weather card meta labels
  humidity:  string;
  wind:      string;
  feelsLike: string;

  // AQI card
  airQualityIndex: string;
  aqiLevels: Record<AQILevelKey, { label: string; advice: string }>;
  alertOnPoorAQI:  string;
  aqiTooltip:      string;

  // UV card
  uvIndex:  string;
  uvLevels: Record<UVLevelKey, { label: string; hint: string }>;
  alertOnHighUV: string;
  uvTooltip:     string;

  // Alert banner
  alerts: {
    poorAirQuality: string;
    highUV:         string;
  };

  // Push notifications
  notifications: {
    uvTitle:  string;
    uvBody:   (uvMax: number) => string;
    aqiTitle: string;
    aqiBody:  (aqi: number) => string;
  };

  // Native permission dialog (shown when notifications are blocked)
  notifDialog: {
    title:        string;
    message:      string;
    openSettings: string;
    cancel:       string;
  };

  // Footer
  footer: string;
}

// ── Ukrainian ─────────────────────────────────────────────────────────────────
const uk: Translations = {
  appTitle: 'Повітряна панель',

  searchPlaceholder: 'Пошук міста...',
  searchGo:          'Знайти',
  searching:         'Пошук...',

  fetchingConditions: 'Завантаження даних...',
  cityNotFound:       'Місто не знайдено. Спробуйте іншу назву.',
  locationDenied:     'Доступ до геолокації заборонено. Знайдіть місто вище.',
  locationError:      'Не вдалося визначити геолокацію. Знайдіть місто вище.',
  failedToLoad:       'Помилка завантаження даних. Перевірте з\'єднання.',

  humidity:  'Вологість',
  wind:      'Вітер',
  feelsLike: 'Відчувається',

  airQualityIndex: 'Якість повітря',
  aqiLevels: {
    good:     { label: 'Добра',        advice: 'Якість повітря відмінна. Насолоджуйтесь прогулянкою!' },
    fair:     { label: 'Задовільна',   advice: 'Чутливим людям варто бути обережними.' },
    moderate: { label: 'Помірна',      advice: 'Обмежте тривале перебування на вулиці.' },
    poor:     { label: 'Погана',       advice: 'Уникайте фізичних навантажень надворі.' },
    veryPoor: { label: 'Дуже погана',  advice: 'По можливості залишайтеся вдома.' },
  },
  alertOnPoorAQI: 'Сповіщати про погане повітря',
  aqiTooltip:
    'Ви отримаєте push-сповіщення, коли індекс якості повітря досягне рівня ' +
    '4 (Поганий) або 5 (Дуже поганий). За таких умов чутливим групам і ' +
    'тим, хто працює надворі, слід вжити запобіжних заходів.',

  uvIndex: 'УФ-індекс',
  uvLevels: {
    low:      { label: 'Низький',        hint: 'Захист не потрібен.' },
    moderate: { label: 'Помірний',       hint: 'Використовуйте сонцезахисний крем.' },
    high:     { label: 'Високий',        hint: 'Носіть капелюх і крем від сонця.' },
    veryHigh: { label: 'Дуже високий',   hint: 'Уникайте полуденного сонця.' },
    extreme:  { label: 'Екстремальний',  hint: 'Максимально уникайте впливу сонця.' },
  },
  alertOnHighUV: 'Сповіщати про високий УФ',
  uvTooltip:
    'Ви отримаєте push-сповіщення, коли УФ-індекс досягне 8 або більше ' +
    '(Дуже високий). Це нагадає вам нанести сонцезахисний крем і ' +
    'вдягти захисний одяг перед виходом на вулицю.',

  alerts: {
    poorAirQuality: '⚠️ Погана якість повітря — обмежте час надворі',
    highUV:         '☀️ Високий УФ-індекс — нанесіть сонцезахисний крем',
  },

  notifications: {
    uvTitle:  '☀️ Попередження про УФ-випромінювання',
    uvBody:   (uvMax) => `УФ-індекс ${uvMax} — нанесіть крем перед виходом надвір.`,
    aqiTitle: '⚠️ Погана якість повітря',
    aqiBody:  (aqi)   => `Рівень ЯП: ${aqi}/5 — обмежте перебування надворі.`,
  },

  notifDialog: {
    title:        'Сповіщення вимкнено',
    message:
      'Щоб отримувати попередження про якість повітря та УФ-індекс, ' +
      'дозвольте сповіщення для AirDashboard у налаштуваннях пристрою.',
    openSettings: 'Відкрити налаштування',
    cancel:       'Скасувати',
  },

  footer: 'Потягніть вниз для оновлення • Дані: OpenWeatherMap та Open-Meteo',
};

// ── English ───────────────────────────────────────────────────────────────────
const en: Translations = {
  appTitle: 'Air Dashboard',

  searchPlaceholder: 'Search city...',
  searchGo:          'Go',
  searching:         'Searching...',

  fetchingConditions: 'Fetching conditions...',
  cityNotFound:       'City not found. Try a different name.',
  locationDenied:     'Location permission denied. Search for a city above.',
  locationError:      'Could not get your location. Search for a city above.',
  failedToLoad:       'Failed to load data. Check your connection.',

  humidity:  'Humidity',
  wind:      'Wind',
  feelsLike: 'Feels like',

  airQualityIndex: 'Air Quality Index',
  aqiLevels: {
    good:     { label: 'Good',      advice: 'Air quality is great. Enjoy the outdoors!' },
    fair:     { label: 'Fair',      advice: 'Sensitive people should take care.' },
    moderate: { label: 'Moderate',  advice: 'Limit prolonged outdoor activity.' },
    poor:     { label: 'Poor',      advice: 'Avoid outdoor exertion.' },
    veryPoor: { label: 'Very Poor', advice: 'Stay indoors if possible.' },
  },
  alertOnPoorAQI: 'Alert on poor AQI',
  aqiTooltip:
    'You\'ll receive a push notification whenever the air quality index reaches ' +
    'level 4 (Poor) or level 5 (Very Poor). At these levels, sensitive groups ' +
    'and outdoor workers should take precautions.',

  uvIndex: 'UV Index',
  uvLevels: {
    low:      { label: 'Low',       hint: 'No protection needed.' },
    moderate: { label: 'Moderate',  hint: 'Wear sunscreen outdoors.' },
    high:     { label: 'High',      hint: 'Wear hat and sunscreen.' },
    veryHigh: { label: 'Very High', hint: 'Avoid midday sun.' },
    extreme:  { label: 'Extreme',   hint: 'Avoid all sun exposure.' },
  },
  alertOnHighUV: 'Alert on high UV',
  uvTooltip:
    'You\'ll receive a push notification whenever the UV index reaches 8 or above ' +
    '(Very High). This helps you remember sunscreen and protective clothing ' +
    'before heading outside.',

  alerts: {
    poorAirQuality: '⚠️ Poor air quality — limit outdoor activity',
    highUV:         '☀️ High UV index — apply sunscreen',
  },

  notifications: {
    uvTitle:  '☀️ High UV Alert',
    uvBody:   (uvMax) => `UV index is ${uvMax} — apply sunscreen before going outside.`,
    aqiTitle: '⚠️ Poor Air Quality Alert',
    aqiBody:  (aqi)   => `AQI is ${aqi}/5 — consider limiting time outdoors.`,
  },

  notifDialog: {
    title:        'Notifications Disabled',
    message:
      'To receive air quality and UV alerts, please allow notifications ' +
      'for AirDashboard in your device settings.',
    openSettings: 'Open Settings',
    cancel:       'Cancel',
  },

  footer: 'Pull down to refresh • Data from OpenWeatherMap & Open-Meteo',
};

export const translations: Record<Language, Translations> = { uk, en };
