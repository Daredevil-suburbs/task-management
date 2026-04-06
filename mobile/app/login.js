import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/theme';
import { Link } from 'expo-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    
    if (!res.success) {
      Alert.alert('Login Failed', res.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logoText}>HUNTER <Text style={styles.goldText}>SYSTEM</Text></Text>
          <Text style={styles.subtitle}>WAKE UP, HUNTER. IT'S TIME TO LEVEL UP.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>LOGIN</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="hunter@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? 'VERIFYING...' : 'LOGIN'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New Hunter? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Register here</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        
        <Text style={styles.versionText}>SYSTEM v1.0.4 - RANK E-S COMPATIBLE</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
  },
  goldText: {
    color: Colors.gold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.bgCard,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 10,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardTitle: {
    color: Colors.purpleLight,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 12,
    color: Colors.textPrimary,
  },
  loginBtn: {
    backgroundColor: Colors.purpleDark,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  linkText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  versionText: {
    color: Colors.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 1,
  },
});
