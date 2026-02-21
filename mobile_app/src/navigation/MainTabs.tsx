import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { CatalogScreen } from '@/screens/CatalogScreen';
import { BonusProgramScreen } from '@/screens/BonusProgramScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { palette } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: palette.primary,
      tabBarInactiveTintColor: palette.muted,
      tabBarStyle: {
        height: 74,
        paddingTop: 8,
        paddingBottom: 10,
        borderTopColor: palette.border,
        backgroundColor: palette.surface
      },
      tabBarLabelStyle: {
        fontWeight: '600',
        fontSize: 12
      },
      tabBarIcon: ({ color, size, focused }) => {
        const icons: Record<keyof MainTabParamList, string> = {
          Catalog: focused ? 'grid' : 'grid-outline',
          Bonus: focused ? 'gift' : 'gift-outline',
          Profile: focused ? 'person-circle' : 'person-circle-outline'
        };
        return <Ionicons name={icons[route.name as keyof MainTabParamList]} size={size} color={color} />;
      }
    })}
  >
    <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Каталог' }} />
    <Tab.Screen name="Bonus" component={BonusProgramScreen} options={{ title: 'Бонусы' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
  </Tab.Navigator>
);
