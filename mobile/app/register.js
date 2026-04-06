import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { Colors } from '../src/theme';
import { Link, useRouter } from 'expo-router';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
       return Alert.alert('Error', 'Please fill all fields');
    }
    if (formData.password !== formData.confirmPassword) {
       return Alert.alert('Error', 'Passwords do not match');
    }
    
    setLoading(true);
    const res = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    setLoading(false);
    
    if (res.success) {
      Alert.alert('Success', 'Account created! Please login.');
      router.push('/login');
    } else {
      Alert.alert('Registration Failed', res.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logoText}>NEW <Text style={styles.goldText}>HUNTER</Text></Text>
          <Text style={styles.subtitle}>REGISTRATION IS REQUIRED FOR RANK ASSIGNMENT.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>REGISTRY</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>HUNTER NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sung Jin-Woo"
              placeholderTextColor={Colors.textMuted}
              value={formData.name}
              onChangeText={t => setFormData({...formData, name: t})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="hunter@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={t => setFormData({...formData, email: t})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={formData.password}
              onChangeText={t => setFormData({...formData, password: t})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={t => setFormData({...formData, confirmPassword: t})}
            />
          </View>

          <TouchableOpacity 
            style={styles.regBtn} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.regBtnText}>{loading ? 'REGISTERING...' : 'REGISTER'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already registered? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Login here</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
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
    marginBottom: 16,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 10,
    color: Colors.textPrimary,
  },
  regBtn: {
    backgroundColor: Colors.gold,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  regBtnText: {
    color: '#000',
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
    color: Colors.purpleLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
