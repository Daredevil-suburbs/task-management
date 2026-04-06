import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/theme';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.purple} size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/login" />;
}
