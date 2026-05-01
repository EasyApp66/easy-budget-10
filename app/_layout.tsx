
import React from 'react';
import { Stack } from 'expo-router';
import { BudgetProvider, useBudget } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { GlassProvider } from '@/contexts/GlassContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function GlassProviderWithPremium({ children }: { children: React.ReactNode }) {
  const { premiumStatus } = useBudget();
  const isPremium = premiumStatus.type !== 'None' && premiumStatus.type !== 'Expired';
  return <GlassProvider isPremium={isPremium}>{children}</GlassProvider>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubscriptionProvider>
        <LanguageProvider>
          <BudgetProvider>
            <GlassProviderWithPremium>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="paywall" options={{ headerShown: false }} />
              </Stack>
            </GlassProviderWithPremium>
          </BudgetProvider>
        </LanguageProvider>
      </SubscriptionProvider>
    </GestureHandlerRootView>
  );
}
