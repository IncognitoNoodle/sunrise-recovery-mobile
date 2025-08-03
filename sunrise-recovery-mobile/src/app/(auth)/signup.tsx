import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SignupForm } from '../../components/forms/SignupForm';

export default function SignupScreen() {
  const router = useRouter();

  const handleSwitchToLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignupSuccess = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <SignupForm 
        onSwitchToLogin={handleSwitchToLogin}
        onSuccess={handleSignupSuccess}
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