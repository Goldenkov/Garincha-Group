import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '@/types';
import { palette } from '@/constants/colors';

interface Props {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress, onAddToCart }) => (
  <Pressable
    style={styles.card}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Открыть карточку: ${product.title}`}
  >
    <Image source={{ uri: product.image }} style={styles.image} />
    <View style={styles.overlayChip}>
      <Text style={styles.overlayChipLabel}>x{product.bonusMultiplier} бонусов</Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {product.description}
      </Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>{product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
          <Text style={styles.bonusHint}>Повышенный коэффициент начисления</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={onAddToCart}
          accessibilityRole="button"
          accessibilityLabel={`Добавить в корзину: ${product.title}`}
        >
          <Text style={styles.buttonLabel}>В корзину</Text>
        </Pressable>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  image: {
    height: 190,
    width: '100%'
  },
  overlayChip: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  overlayChipLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 6,
    lineHeight: 24
  },
  description: {
    color: palette.textSecondary,
    marginBottom: 14,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.primary
  },
  bonusHint: {
    fontSize: 12,
    color: palette.accent,
    marginTop: 4
  },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700'
  }
});
