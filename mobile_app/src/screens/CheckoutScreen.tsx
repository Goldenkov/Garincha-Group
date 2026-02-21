import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore, selectCartTotal } from '@/store/useAppStore';
import { palette } from '@/constants/colors';

const PAYMENT_OPTIONS = ['Бонусы + карта', 'Банковская карта', 'СБП'];

export const CheckoutScreen: React.FC = () => {
  const cart = useAppStore((state) => state.cart);
  const user = useAppStore((state) => state.user);
  const lastOrder = useAppStore((state) => state.lastOrder);
  const { checkout } = useAppStore((state) => state.actions);

  const [deliveryAddress, setDeliveryAddress] = useState(user?.city ?? '');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const total = selectCartTotal(cart);
  const canSubmit = useMemo(
    () => !isLoading && cart.length > 0 && deliveryAddress.trim().length >= 8,
    [isLoading, cart.length, deliveryAddress]
  );

  const handleSubmit = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Проверьте адрес', 'Добавьте адрес доставки, чтобы продолжить.');
      return;
    }

    setIsLoading(true);
    try {
      const order = await checkout({ deliveryAddress: deliveryAddress.trim(), paymentMethod, comment: comment.trim() });
      Alert.alert('Заказ оформлен', `Номер: ${order.orderId}\nБонусов начислено: ${order.bonusEarned}`);
    } catch (error) {
      Alert.alert('Не удалось оформить заказ', error instanceof Error ? error.message : 'Попробуйте позже');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Оформление заказа</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Контактные данные</Text>
          <Text style={styles.muted}>Имя: {user?.fullName}</Text>
          <Text style={styles.muted}>Телефон: {user?.phone}</Text>
          <Text style={styles.muted}>Email: {user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Адрес доставки</Text>
          <TextInput
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Город, улица, дом, комментарии для курьера"
            placeholderTextColor={palette.muted}
            style={[styles.input, styles.addressInput]}
            multiline
            accessibilityLabel="Адрес доставки"
          />
          {deliveryAddress.trim().length > 0 && deliveryAddress.trim().length < 8 ? (
            <Text style={styles.validation}>Укажите адрес подробнее (минимум 8 символов).</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Способ оплаты</Text>
          <View style={styles.paymentRow}>
            {PAYMENT_OPTIONS.map((option) => {
              const selected = option === paymentMethod;
              return (
                <Pressable
                  key={option}
                  onPress={() => setPaymentMethod(option)}
                  style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
                  accessibilityRole="button"
                  accessibilityLabel={`Способ оплаты: ${option}`}
                >
                  <Text style={[styles.paymentLabel, selected && styles.paymentLabelSelected]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Комментарий</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Пожелания для партнёра или менеджера"
            placeholderTextColor={palette.muted}
            style={[styles.input, styles.comment]}
            multiline
            accessibilityLabel="Комментарий к заказу"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Итого</Text>
          <Text style={styles.total}>{total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
          <Text style={styles.muted}>Товаров в корзине: {cart.length}</Text>
          <Text style={styles.muted}>Оплата: {paymentMethod}</Text>
          {lastOrder ? (
            <Text style={styles.success}>
              Последний заказ: {lastOrder.orderId}, бонусов начислено {lastOrder.bonusEarned}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          disabled={!canSubmit}
          accessibilityRole="button"
        >
          <Text style={styles.buttonLabel}>{isLoading ? 'Отправка...' : 'Подтвердить заказ'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  content: {
    padding: 20,
    paddingBottom: 60
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: palette.text
  },
  section: {
    backgroundColor: palette.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.border
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: palette.text
  },
  muted: {
    color: palette.textSecondary,
    marginBottom: 6
  },
  input: {
    backgroundColor: palette.background,
    borderRadius: 12,
    padding: 12,
    color: palette.text
  },
  addressInput: {
    minHeight: 72
  },
  comment: {
    minHeight: 80
  },
  validation: {
    marginTop: 8,
    color: palette.danger,
    fontSize: 12
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  paymentOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface
  },
  paymentOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.surfaceMuted
  },
  paymentLabel: {
    color: palette.textSecondary,
    fontWeight: '600'
  },
  paymentLabelSelected: {
    color: palette.primary
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.primary
  },
  success: {
    marginTop: 8,
    color: palette.success
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.55
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  }
});
