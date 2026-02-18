import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DashboardData } from '../types';
import { useLocale } from '../context/LocaleContext';

const STORAGE_KEY = '@air_dashboard_notif_settings';

interface Settings {
  notifyHighUV:  boolean;
  notifyPoorAQI: boolean;
}

async function persistSettings(s: Settings) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

async function checkPermission(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as 'granted' | 'denied' | 'undetermined';
}

async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function useNotificationSettings() {
  const { t } = useLocale();

  const [notifyHighUV,  setNotifyHighUV]  = useState(false);
  const [notifyPoorAQI, setNotifyPoorAQI] = useState(false);

  const notifiedRef = useRef({ uv: false, aqi: false });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return;
      const parsed: Settings = JSON.parse(raw);
      setNotifyHighUV(!!parsed.notifyHighUV);
      setNotifyPoorAQI(!!parsed.notifyPoorAQI);
    });
  }, []);

  const ensurePermission = useCallback(async (): Promise<boolean> => {
    const status = await checkPermission();
    if (status === 'granted') return true;

    if (status === 'undetermined') {
      const granted = await requestPermission();
      if (granted) return true;
    }

    // Permission is denied — show native dialog with a direct link to Settings
    Alert.alert(
      t.notifDialog.title,
      t.notifDialog.message,
      [
        { text: t.notifDialog.cancel, style: 'cancel' },
        {
          text: t.notifDialog.openSettings,
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: true },
    );
    return false;
  }, [t]);

  const toggleNotifyHighUV = useCallback(async () => {
    if (notifyHighUV) {
      setNotifyHighUV(false);
      notifiedRef.current.uv = false;
      await persistSettings({ notifyHighUV: false, notifyPoorAQI });
      return;
    }
    const granted = await ensurePermission();
    if (!granted) return;
    setNotifyHighUV(true);
    await persistSettings({ notifyHighUV: true, notifyPoorAQI });
  }, [notifyHighUV, notifyPoorAQI, ensurePermission]);

  const toggleNotifyPoorAQI = useCallback(async () => {
    if (notifyPoorAQI) {
      setNotifyPoorAQI(false);
      notifiedRef.current.aqi = false;
      await persistSettings({ notifyHighUV, notifyPoorAQI: false });
      return;
    }
    const granted = await ensurePermission();
    if (!granted) return;
    setNotifyPoorAQI(true);
    await persistSettings({ notifyHighUV, notifyPoorAQI: true });
  }, [notifyHighUV, notifyPoorAQI, ensurePermission]);

  const checkAndNotify = useCallback(async (data: DashboardData) => {
    const uvHigh  = data.uv.uvMax >= 8;
    const aqiPoor = data.airQuality.aqi >= 4;

    if (notifyHighUV) {
      if (uvHigh && !notifiedRef.current.uv) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t.notifications.uvTitle,
            body:  t.notifications.uvBody(data.uv.uvMax),
          },
          trigger: null,
        });
        notifiedRef.current.uv = true;
      } else if (!uvHigh) {
        notifiedRef.current.uv = false;
      }
    }

    if (notifyPoorAQI) {
      if (aqiPoor && !notifiedRef.current.aqi) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t.notifications.aqiTitle,
            body:  t.notifications.aqiBody(data.airQuality.aqi),
          },
          trigger: null,
        });
        notifiedRef.current.aqi = true;
      } else if (!aqiPoor) {
        notifiedRef.current.aqi = false;
      }
    }
  }, [notifyHighUV, notifyPoorAQI, t]);

  return {
    notifyHighUV,
    notifyPoorAQI,
    toggleNotifyHighUV,
    toggleNotifyPoorAQI,
    checkAndNotify,
  };
}
