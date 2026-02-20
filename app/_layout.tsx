
import { Stack } from 'expo-router';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <BudgetProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </BudgetProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
