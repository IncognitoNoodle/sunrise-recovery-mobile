import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootLayout from './src/app/_layout';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <RootLayout />
    </>
  );
}
