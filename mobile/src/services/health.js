import { 
  initialize, 
  requestPermission, 
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus
} from 'react-native-health-connect';
import { Alert } from 'react-native';

const PERMISSIONS = [
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'Steps' },
];

export const healthService = {
  checkAvailability: async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      Alert.alert('Health Connect', 'Health Connect is not available on this device.');
      return false;
    }
    if (status === SdkAvailabilityStatus.SDK_NOT_INSTALLED) {
      Alert.alert('Health Connect', 'Health Connect is not installed. Please install it from the Play Store.');
      return false;
    }
    return true;
  },

  initialize: async () => {
    try {
      const isInitialized = await initialize();
      return isInitialized;
    } catch (e) {
      console.error('Health Connect initialization failed', e);
      return false;
    }
  },

  requestPermissions: async () => {
    try {
      const grantedPermissions = await requestPermission(PERMISSIONS);
      return grantedPermissions;
    } catch (e) {
      console.error('Permission request failed', e);
      return [];
    }
  },

  fetchTodayData: async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = now.toISOString();

    try {
      // 1. Fetch Steps
      const steps = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay,
          endTime: endOfDay,
        },
      });
      const totalSteps = steps.reduce((acc, cur) => acc + cur.count, 0);

      // 2. Fetch Heart Rate
      const heartRates = await readRecords('HeartRate', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay,
          endTime: endOfDay,
        },
      });
      
      // Calculate average heart rate if samples exist
      let avgHeartRate = 0;
      if (heartRates.length > 0) {
        let total = 0;
        let count = 0;
        heartRates.forEach(record => {
           record.samples.forEach(s => {
             total += s.beatsPerMinute;
             count++;
           });
        });
        avgHeartRate = count > 0 ? Math.round(total / count) : 0;
      }

      // 3. Fetch Sleep
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const sleepSessions = await readRecords('SleepSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: last24h,
          endTime: endOfDay,
        },
      });

      // Total sleep duration in minutes
      let totalSleepMinutes = 0;
      sleepSessions.forEach(session => {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        totalSleepMinutes += (end - start) / (1000 * 60);
      });

      return {
        steps: totalSteps,
        heartRate: avgHeartRate,
        sleepMinutes: Math.round(totalSleepMinutes),
        timestamp: endOfDay
      };
    } catch (e) {
      console.error('Failed to fetch health data', e);
      return null;
    }
  }
};
