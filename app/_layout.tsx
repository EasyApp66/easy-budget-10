
import { Stack } from 'expo-router';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubscriptionProvider>
        <LanguageProvider>
          <BudgetProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="paywall" options={{ headerShown: false }} />
            </Stack>
          </BudgetProvider>
        </LanguageProvider>
      </SubscriptionProvider>
    </GestureHandlerRootView>
  );
}
