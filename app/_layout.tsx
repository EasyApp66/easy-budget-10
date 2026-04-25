
import { Stack, usePathname, useRouter } from 'expo-router';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isOnboardingComplete } from "@/utils/onboardingStorage";
import { useState, useEffect } from "react";

function SubscriptionRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onOnboarding = pathname.startsWith("/onboarding");
    if (onOnboarding) return;

    let cancelled = false;
    isOnboardingComplete().then((done) => {
      if (cancelled) return;
      if (!done) {
        router.replace("/onboarding");
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [pathname, router]);

  return null;
}

export default function RootLayout() {
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    isOnboardingComplete().then((complete) => {
      setOnboardingComplete(complete);
    });
  }, [pathname]);

  if (onboardingComplete === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SubscriptionProvider>
        <SubscriptionRedirect />
        <LanguageProvider>
          <BudgetProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
