import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { LoginScreen } from '@/screens/LoginScreen';
import { ProductDetailsScreen } from '@/screens/ProductDetailsScreen';
import { CartScreen } from '@/screens/CartScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { useAppStore } from '@/store/useAppStore';
import { ActivityIndicator, View } from 'react-native';
import { palette } from '@/constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const isBootstrapping = useAppStore((state) => state.isBootstrapping);
  const { bootstrap } = useAppStore((state) => state.actions);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="ProductDetails"
              component={ProductDetailsScreen}
              options={{ title: 'Карточка предложения' }}
            />
            <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Корзина' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Оформление заказа' }} />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
