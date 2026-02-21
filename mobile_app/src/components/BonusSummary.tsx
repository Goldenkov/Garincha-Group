import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '@/constants/colors';

interface Props {
  balance: number;
  forecast: number;
}

export const BonusSummary: React.FC<Props> = ({ balance, forecast }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.label}>Бонусный баланс</Text>
      <Text style={styles.value}>{balance.toLocaleString('ru-RU')} ₽</Text>
    </View>
    <View style={styles.divider} />
    <View>
      <Text style={styles.label}>Ожидается начисление</Text>
      <Text style={styles.forecast}>{forecast.toLocaleString('ru-RU')} ₽</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.primary,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.15,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 14
  },
  label: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.7
  },
  value: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#fff'
  },
  forecast: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: '700',
    color: '#FCD34D'
  }
});
