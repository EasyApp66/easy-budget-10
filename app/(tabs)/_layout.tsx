
import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Href } from 'expo-router';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const pathname = usePathname();
  const [triggerAdd, setTriggerAdd] = useState(0);

  const tabs: TabBarItem[] = [
    {
      name: 'budget',
      route: '/(tabs)/budget' as Href,
      icon: 'attach-money',
      label: 'Budget',
    },
    {
      name: 'subscriptions',
      route: '/(tabs)/subscriptions' as Href,
      icon: 'sync',
      label: 'Abos',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile' as Href,
      icon: 'person',
      label: 'Profil',
    },
  ];

  const handleAddPress = () => {
    console.log('Add button pressed, current path:', pathname);
    setTriggerAdd(prev => prev + 1);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => <FloatingTabBar tabs={tabs} onAddPress={handleAddPress} />}
      >
        <Tabs.Screen
          name="budget"
          options={{
            title: 'Budget',
          }}
          initialParams={{ triggerAdd }}
        />
        <Tabs.Screen
          name="subscriptions"
          options={{
            title: 'Abos',
          }}
          initialParams={{ triggerAdd }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
          }}
        />
      </Tabs>
    </>
  );
}
