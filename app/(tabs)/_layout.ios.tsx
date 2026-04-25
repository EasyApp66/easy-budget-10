
import { Tabs } from 'expo-router';
import React from 'react';
import FloatingTabBar from '@/components/FloatingTabBar';
import { useRouter, usePathname } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const handleAddPress = () => {
    console.log('Add button pressed, current path:', pathname);
    
    if (pathname.includes('/budget')) {
      console.log('Triggering budget add expense');
      router.push({
        pathname: '/(tabs)/budget',
        params: { triggerAdd: Date.now().toString() }
      });
    } else if (pathname.includes('/subscriptions')) {
      console.log('Triggering subscriptions add');
      router.push({
        pathname: '/(tabs)/subscriptions',
        params: { triggerAdd: Date.now().toString() }
      });
    }
  };

  const tabs = [
    {
      name: 'budget',
      route: '/(tabs)/budget' as any,
      icon: 'attach-money' as any,
      label: t('tabBudget'),
    },
    {
      name: 'subscriptions',
      route: '/(tabs)/subscriptions' as any,
      icon: 'subscriptions' as any,
      label: t('tabSubs'),
    },
    {
      name: 'profile',
      route: '/(tabs)/profile' as any,
      icon: 'person' as any,
      label: t('tabProfile'),
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="budget" options={{ headerShown: false }} />
        <Tabs.Screen name="subscriptions" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
      <FloatingTabBar tabs={tabs} onAddPress={handleAddPress} />
    </>
  );
}
