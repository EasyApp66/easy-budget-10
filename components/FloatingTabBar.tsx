
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';
import { useBudget } from '@/contexts/BudgetContext';
import * as Haptics from 'expo-haptics';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  onAddPress?: () => void;
}

export default function FloatingTabBar({ tabs, onAddPress }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scaleAnims] = React.useState(() => 
    tabs.map(() => new Animated.Value(1))
  );
  const [addButtonScale] = React.useState(new Animated.Value(1));

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

  const handleTabPress = async (route: Href, index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    router.push(route);
  };

  const handleAddPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onAddPress) {
      onAddPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTabIndex === index;

          return (
            <React.Fragment key={index}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => handleTabPress(tab.route, index)}
              activeOpacity={1}
            >
              <Animated.View 
                style={[
                  styles.tabContent,
                  { transform: [{ scale: scaleAnims[index] }] }
                ]}
              >
                <IconSymbol
                  android_material_icon_name={tab.icon}
                  ios_icon_name={tab.icon}
                  size={22}
                  color={isActive ? '#BFFE84' : '#8E8E93'}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
            </React.Fragment>
          );
        })}
        
        <TouchableOpacity
          style={styles.addButtonTab}
          onPress={handleAddPress}
          activeOpacity={1}
        >
          <Animated.View 
            style={[
              styles.addButtonGlow,
              { transform: [{ scale: addButtonScale }] }
            ]}
          >
            <View style={styles.addButton}>
              <IconSymbol
                android_material_icon_name="add"
                ios_icon_name="plus"
                size={32}
                color="#000000"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderRadius: 30,
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 20,
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
    color: '#8E8E93',
  },
  tabLabelActive: {
    color: '#BFFE84',
    fontWeight: '600',
  },
  addButtonTab: {
    marginLeft: 10,
  },
  addButtonGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(191, 254, 132, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BFFE84',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
