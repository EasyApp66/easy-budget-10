
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { BudgetProvider, useBudget } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { GlassProvider } from '@/contexts/GlassContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function GlassProviderWithPremium({ children }: { children: React.ReactNode }) {
  const { premiumStatus } = useBudget();
  const isPremium = premiumStatus.type !== 'None' && premiumStatus.type !== 'Expired';
  return <GlassProvider isPremium={isPremium}>{children}</GlassProvider>;
}

function RevenueCatSync({ children }: { children: React.ReactNode }) {
  const { isSubscribed } = useSubscription();
  const { setRevenueCatSubscribed } = useBudget();

  useEffect(() => {
    console.log('[RevenueCatSync] isSubscribed changed:', isSubscribed);
    setRevenueCatSubscribed(isSubscribed);
  }, [isSubscribed, setRevenueCatSubscribed]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubscriptionProvider>
        <LanguageProvider>
          <BudgetProvider>
            <RevenueCatSync>
              <GlassProviderWithPremium>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="paywall" options={{ headerShown: false }} />
                </Stack>
              </GlassProviderWithPremium>
            </RevenueCatSync>
          </BudgetProvider>
        </LanguageProvider>
      </SubscriptionProvider>
    </GestureHandlerRootView>
  );
}
