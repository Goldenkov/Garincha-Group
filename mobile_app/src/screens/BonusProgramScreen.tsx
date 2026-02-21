import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAppStore, selectBonusEarned } from '@/store/useAppStore';
import { BonusSummary } from '@/components/BonusSummary';
import { palette } from '@/constants/colors';

export const BonusProgramScreen: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const bonusHistory = useAppStore((state) => state.bonusHistory);
  const cart = useAppStore((state) => state.cart);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bonusHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.title}>Бонусная программа</Text>
            <Text style={styles.subtitle}>
              Отслеживайте баланс, историю операций и будущие начисления.
            </Text>
            <BonusSummary balance={user?.bonusBalance ?? 0} forecast={selectBonusEarned(cart)} />
            <Text style={styles.sectionTitle}>История операций</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('ru-RU')}</Text>
            </View>
            <Text style={[styles.change, item.type === 'earned' ? styles.positive : styles.negative]}>
              {item.type === 'earned' ? '+' : ''}
              {item.change.toLocaleString('ru-RU')} ₽
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>История транзакций скоро появится.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  listContent: {
    padding: 20,
    paddingBottom: 80
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  item: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitle: {
    fontWeight: '600',
    color: palette.text
  },
  itemDate: {
    color: palette.muted,
    marginTop: 6
  },
  change: {
    fontWeight: '700',
    fontSize: 16
  },
  positive: {
    color: palette.success
  },
  negative: {
    color: palette.danger
  },
  empty: {
    textAlign: 'center',
    color: palette.muted,
    marginTop: 40
  }
});
