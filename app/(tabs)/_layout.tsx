
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: 'budget',
      route: '/(tabs)/budget',
      icon: 'account-balance-wallet',
      label: 'Budget',
    },
    {
      name: 'subscriptions',
      route: '/(tabs)/subscriptions',
      icon: 'autorenew',
      label: 'Abos',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profil',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="budget" />
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
