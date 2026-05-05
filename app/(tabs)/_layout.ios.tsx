
import { Tabs } from 'expo-router';
import React from 'react';
import FloatingTabBar from '@/components/FloatingTabBar';
import { useRouter, usePathname } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { PanResponder, View } from 'react-native';

const TAB_ORDER = ['/(tabs)/budget', '/(tabs)/subscriptions', '/(tabs)/profile'];

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      const { dx, dy } = gestureState;
      return Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 15;
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, vx } = gestureState;
      if (Math.abs(dx) < 120 || Math.abs(vx) < 0.3) return;
      console.log('[TabSwipe] Swipe detected dx:', dx, 'vx:', vx, 'pathname:', pathname);
      const currentTab = TAB_ORDER.find(tab => pathname.includes(tab.replace('/(tabs)/', ''))) ?? TAB_ORDER[0];
      const currentIndex = TAB_ORDER.indexOf(currentTab);
      if (dx < 0 && currentIndex < TAB_ORDER.length - 1) {
        console.log('[TabSwipe] Navigating to next tab:', TAB_ORDER[currentIndex + 1]);
        router.replace(TAB_ORDER[currentIndex + 1] as any);
      } else if (dx > 0 && currentIndex > 0) {
        console.log('[TabSwipe] Navigating to previous tab:', TAB_ORDER[currentIndex - 1]);
        router.replace(TAB_ORDER[currentIndex - 1] as any);
      }
    },
  });

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
    <View style={{ flex: 1, backgroundColor: '#000000' }} {...panResponder.panHandlers}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          animation: 'shift',
          sceneStyle: { backgroundColor: '#000000' },
        }}
      >
        <Tabs.Screen name="budget" options={{ headerShown: false }} />
        <Tabs.Screen name="subscriptions" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ headerShown: false }} />
      </Tabs>
      <FloatingTabBar tabs={tabs} onAddPress={handleAddPress} />
    </View>
  );
}
