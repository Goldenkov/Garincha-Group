import React from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CartItemRow } from '@/components/CartItemRow';
import { useAppStore, selectBonusEarned, selectCartTotal } from '@/store/useAppStore';
import { palette } from '@/constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

export const CartScreen: React.FC = () => {
  const cart = useAppStore((state) => state.cart);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addToCart, changeQuantity, removeFromCart, clearCart } = useAppStore((state) => state.actions);

  const total = selectCartTotal(cart);
  const bonus = selectBonusEarned(cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Корзина</Text>
            <Text style={styles.summarySubtitle}>Всего товаров: {totalItems}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={() => addToCart(item.product)}
            onDecrement={() => changeQuantity(item.product.id, item.quantity - 1)}
            onRemove={() => removeFromCart(item.product.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Корзина пока пустая</Text>
            <Text style={styles.emptyText}>Добавьте предложения из каталога, чтобы оформить заказ и получить бонусы.</Text>
            <Pressable
              onPress={() => navigation.navigate('Main')}
              style={styles.emptyButton}
              accessibilityRole="button"
              accessibilityLabel="Перейти в каталог"
            >
              <Text style={styles.emptyButtonLabel}>Перейти в каталог</Text>
            </Pressable>
          </View>
        }
      />
      {cart.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.total}>{total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
            <Text style={styles.bonus}>К начислению: {bonus.toFixed(0)} бонусов</Text>
          </View>
          <View style={styles.footerActions}>
            <Pressable onPress={clearCart} style={styles.secondaryButton} accessibilityRole="button">
              <Text style={styles.secondaryLabel}>Очистить</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Checkout')}
              style={styles.primaryButton}
              accessibilityRole="button"
            >
              <Text style={styles.primaryLabel}>Оформить</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  listContent: {
    padding: 16,
    paddingBottom: 120
  },
  summary: {
    marginBottom: 16
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text
  },
  summarySubtitle: {
    marginTop: 4,
    color: palette.textSecondary
  },
  emptyCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 26
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8
  },
  emptyText: {
    color: palette.textSecondary,
    lineHeight: 20,
    marginBottom: 14
  },
  emptyButton: {
    alignSelf: 'flex-start',
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  emptyButtonLabel: {
    color: '#fff',
    fontWeight: '700'
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: palette.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text
  },
  bonus: {
    marginTop: 4,
    color: palette.accent
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: palette.background
  },
  secondaryLabel: {
    color: palette.muted,
    fontWeight: '600'
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: palette.primary
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '600'
  }
});
