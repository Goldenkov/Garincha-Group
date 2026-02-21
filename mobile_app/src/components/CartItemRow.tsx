import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartItem } from '@/types';
import { palette } from '@/constants/colors';

interface Props {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onIncrement, onDecrement, onRemove }) => (
  <View style={styles.container}>
    <View style={styles.info}>
      <Text style={styles.title}>{item.product.title}</Text>
      <Text style={styles.price}>
        {(item.product.price * item.quantity).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
      </Text>
      <Text style={styles.meta}>
        {item.quantity} шт · бонусов: {(item.product.price * item.quantity * item.product.bonusMultiplier).toFixed(0)}
      </Text>
    </View>

    <View style={styles.controlsRow}>
      <View style={styles.actions}>
        <Pressable onPress={onDecrement} style={styles.roundButton} accessibilityRole="button">
          <Text style={styles.roundButtonLabel}>−</Text>
        </Pressable>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Pressable onPress={onIncrement} style={styles.roundButton} accessibilityRole="button">
          <Text style={styles.roundButtonLabel}>+</Text>
        </Pressable>
      </View>

      <Pressable onPress={onRemove} style={styles.removeButton} accessibilityRole="button">
        <Text style={styles.removeLabel}>Удалить</Text>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: palette.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: palette.border
  },
  info: {
    marginBottom: 14
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.primary
  },
  meta: {
    marginTop: 5,
    color: palette.textSecondary
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roundButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceMuted
  },
  roundButtonLabel: {
    fontSize: 20,
    color: palette.primary,
    fontWeight: '700'
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: palette.text
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FEE2E2'
  },
  removeLabel: {
    color: palette.danger,
    fontWeight: '600'
  }
});
