
import { Stack, Redirect, usePathname, useRouter } from 'expo-router';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isOnboardingComplete } from "@/utils/onboardingStorage";
import { useState, useEffect } from "react";

function SubscriptionRedirect() {
  const { isSubscribed, loading } = useSubscription();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || authLoading) return;
    const onAuthScreen = pathname === "/auth";
    if (onAuthScreen) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    const onOnboarding = pathname.startsWith("/onboarding");
    if (onOnboarding) return;

    let cancelled = false;
    isOnboardingComplete().then((done) => {
      if (cancelled) return;
      if (!done) {
        router.replace("/onboarding");
        return;
      }
      const onPaywall = pathname === "/paywall";
      if (onPaywall) return;
      if (!isSubscribed) {
        router.replace("/paywall");
      }
    }).catch(() => {
      if (cancelled) return;
      const onPaywall = pathname === "/paywall";
      if (onPaywall) return;
      if (!isSubscribed) {
        router.replace("/paywall");
      }
    });
    return () => { cancelled = true; };
  }, [isSubscribed, loading, authLoading, pathname, user]);

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
      <AuthProvider>
        <SubscriptionProvider>
          <SubscriptionRedirect />
          <LanguageProvider>
            <BudgetProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="auth-popup" />
                <Stack.Screen name="auth-callback" />
                <Stack.Screen name="paywall" options={{ headerShown: false }} />
              </Stack>
            </BudgetProvider>
          </LanguageProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
