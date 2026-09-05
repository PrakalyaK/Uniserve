import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/context/UserContext';
import { BookingProvider } from './src/context/BookingContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <BookingProvider>
          <NavigationContainer>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <AppNavigator />
          </NavigationContainer>
        </BookingProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
