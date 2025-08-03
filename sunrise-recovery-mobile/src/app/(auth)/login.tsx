import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginForm } from '../../components/forms/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  const handleSwitchToSignup = () => {
    router.push('/(auth)/signup');
  };

  const handleLoginSuccess = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LoginForm 
        onSwitchToSignup={handleSwitchToSignup}
        onSuccess={handleLoginSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});