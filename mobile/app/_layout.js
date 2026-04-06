import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { Colors } from '../src/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.bgPrimary,
            },
            headerTintColor: Colors.purpleLight,
            headerTitleStyle: {
              fontWeight: 'bold',
              letterSpacing: 2,
            },
            contentStyle: {
              backgroundColor: Colors.bgPrimary,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'HUNTER LOGIN', headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'HUNTER REGISTRY', headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ title: 'QUEST BOARD', headerShown: false }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
