
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      if (pathname === tab.route) {
        score = 100;
      } else if (pathname.startsWith(tab.route as string)) {
        score = 80;
      } else if (pathname.includes(tab.name)) {
        score = 60;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => {
            const isActive = activeTabIndex === index;

            return (
              <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <IconSymbol
                    android_material_icon_name={tab.icon}
                    ios_icon_name={tab.icon}
                    size={24}
                    color={isActive ? '#9FE870' : '#666666'}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
              </React.Fragment>
            );
          })}
          
          <TouchableOpacity
            style={styles.addButtonTab}
            onPress={() => {
              console.log('Add button pressed from tab bar');
              if (pathname.includes('budget')) {
                console.log('Triggering add expense');
              } else if (pathname.includes('subscriptions')) {
                console.log('Triggering add subscription');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.addButton}>
              <IconSymbol
                android_material_icon_name="add"
                ios_icon_name="plus"
                size={32}
                color="#000000"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(44, 44, 46, 0.95)',
    borderRadius: 30,
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
  },
  tabLabelActive: {
    color: '#9FE870',
    fontWeight: '600',
  },
  addButtonTab: {
    marginLeft: 10,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9FE870',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
