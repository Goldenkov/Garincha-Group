import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/useAppStore';
import { palette } from '@/constants/colors';

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const product = useAppStore((state) => state.products.find((item) => item.id === route.params.productId));
  const partner = useAppStore((state) => state.partners.find((item) => item.id === product?.partnerId));
  const { addToCart } = useAppStore((state) => state.actions);

  if (!product) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Предложение недоступно</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.multiplierChip}>
              <Text style={styles.multiplierLabel}>x{product.bonusMultiplier}</Text>
            </View>
          </View>

          <Text style={styles.price}>{product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.tags}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagLabel}>#{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Бонус за покупку</Text>
            <Text style={styles.infoDescription}>
              После оплаты будет начислено {(product.price * product.bonusMultiplier).toFixed(0)} бонусов клуба Garincha.
            </Text>
          </View>

          {partner ? (
            <View style={styles.partnerCard}>
              <Text style={styles.infoTitle}>Партнёр программы</Text>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerDescription}>{partner.description}</Text>
              <Pressable onPress={() => Linking.openURL(partner.website)} style={styles.linkButton} accessibilityRole="link">
                <Text style={styles.linkLabel}>Открыть сайт партнёра</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            addToCart(product);
            navigation.navigate('Cart');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryLabel}>Добавить в корзину</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background
  },
  container: {
    paddingBottom: 120
  },
  image: {
    height: 300,
    width: '100%'
  },
  content: {
    padding: 18
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  title: {
    flex: 1,
    fontSize: 25,
    fontWeight: '800',
    color: palette.text,
    lineHeight: 30
  },
  multiplierChip: {
    backgroundColor: palette.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  multiplierLabel: {
    color: palette.accent,
    fontWeight: '700'
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.primary,
    marginTop: 10,
    marginBottom: 12
  },
  description: {
    fontSize: 15,
    color: palette.textSecondary,
    marginBottom: 16,
    lineHeight: 21
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
    gap: 8
  },
  tag: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: palette.border
  },
  tagLabel: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: palette.border
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: palette.text
  },
  infoDescription: {
    color: palette.textSecondary,
    lineHeight: 20
  },
  partnerCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.primary,
    marginBottom: 6
  },
  partnerDescription: {
    color: palette.textSecondary,
    marginBottom: 12,
    lineHeight: 20
  },
  linkButton: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  linkLabel: {
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
    borderTopWidth: 1,
    borderTopColor: palette.border
  },
  primaryButton: {
    backgroundColor: palette.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center'
  },
  primaryLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800'
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fallbackText: {
    color: palette.textSecondary
  }
});
