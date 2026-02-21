import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ProductCard } from '@/components/ProductCard';
import { palette } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { RootStackParamList } from '@/navigation/types';

const QUICK_FILTERS = ['путешествия', 'здоровье', 'lifestyle'];

export const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const products = useAppStore((state) => state.products);
  const partners = useAppStore((state) => state.partners);
  const cart = useAppStore((state) => state.cart);
  const { addToCart } = useAppStore((state) => state.actions);
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return products;
    }
    return products.filter((product) =>
      product.title.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized) ||
      product.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  }, [products, query]);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Garincha Group</Text>
        <Text style={styles.title}>Каталог премиальных предложений</Text>
        <Text style={styles.subtitle}>Партнёры: {partners.length} · Доступно предложений: {products.length}</Text>
        <Pressable style={styles.cartButton} onPress={() => navigation.navigate('Cart')} accessibilityRole="button">
          <Text style={styles.cartLabel}>Открыть корзину · {cartItemsCount}</Text>
        </Pressable>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск по направлению, партнёру или тегу"
        placeholderTextColor={palette.muted}
        style={styles.search}
        accessibilityLabel="Поиск предложений"
      />

      <View style={styles.filtersRow}>
        {QUICK_FILTERS.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setQuery(filter)}
            style={[styles.filterChip, query.toLowerCase() === filter ? styles.filterChipActive : null]}
            accessibilityRole="button"
          >
            <Text style={[styles.filterLabel, query.toLowerCase() === filter ? styles.filterLabelActive : null]}>{filter}</Text>
          </Pressable>
        ))}
        {query ? (
          <Pressable onPress={() => setQuery('')} style={styles.resetChip} accessibilityRole="button">
            <Text style={styles.resetLabel}>Сбросить</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
            onAddToCart={() => addToCart(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.empty}>Ничего не найдено. Попробуйте другой запрос.</Text>
            <Pressable onPress={() => setQuery('')} style={styles.emptyButton} accessibilityRole="button">
              <Text style={styles.emptyButtonLabel}>Сбросить фильтр</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 16
  },
  heroCard: {
    backgroundColor: palette.primary,
    marginTop: 8,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 30
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    marginBottom: 14
  },
  cartButton: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  cartLabel: {
    color: palette.primaryDark,
    fontWeight: '700'
  },
  search: {
    backgroundColor: palette.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  filterChip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border
  },
  filterChipActive: {
    backgroundColor: palette.surfaceMuted,
    borderColor: palette.primary
  },
  filterLabel: {
    color: palette.textSecondary,
    fontWeight: '600'
  },
  filterLabelActive: {
    color: palette.primary
  },
  resetChip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2'
  },
  resetLabel: {
    color: palette.danger,
    fontWeight: '600'
  },
  listContent: {
    paddingBottom: 36
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 32
  },
  empty: {
    textAlign: 'center',
    color: palette.textSecondary,
    marginBottom: 10
  },
  emptyButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: palette.primary
  },
  emptyButtonLabel: {
    color: '#fff',
    fontWeight: '700'
  }
});
