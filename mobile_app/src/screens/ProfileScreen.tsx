import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View, Pressable } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { palette } from '@/constants/colors';

export const ProfileScreen: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const { updateProfile, logout } = useAppStore((state) => state.actions);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [marketing, setMarketing] = useState(user?.notifications.marketing ?? true);
  const [updates, setUpdates] = useState(user?.notifications.updates ?? true);
  const [partners, setPartners] = useState(user?.notifications.partners ?? false);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        city,
        phone,
        notifications: { marketing, updates, partners }
      });
      Alert.alert('Профиль обновлён', 'Изменения сохранены.');
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось обновить профиль');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Здравствуйте,</Text>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.balance}>Баланс: {user.bonusBalance.toLocaleString('ru-RU')} бонусов</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Контактные данные</Text>
          <TextInput value={fullName} onChangeText={setFullName} placeholder="ФИО" style={styles.input} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Телефон" style={styles.input} />
          <TextInput value={city} onChangeText={setCity} placeholder="Город проживания" style={styles.input} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Маркетинговые предложения</Text>
              <Text style={styles.switchHint}>Персональные офферы, бонусные акции, мероприятия</Text>
            </View>
            <Switch value={marketing} onValueChange={setMarketing} />
          </View>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Новости и обновления</Text>
              <Text style={styles.switchHint}>Анонсы новых партнёров и сервисов</Text>
            </View>
            <Switch value={updates} onValueChange={setUpdates} />
          </View>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Предложения партнёров</Text>
              <Text style={styles.switchHint}>Коммерческие предложения напрямую от компаний холдинга</Text>
            </View>
            <Switch value={partners} onValueChange={setPartners} />
          </View>
        </View>
        <Pressable onPress={handleSave} style={styles.button} disabled={isSaving} accessibilityRole="button">
          <Text style={styles.buttonLabel}>{isSaving ? 'Сохраняем...' : 'Сохранить'}</Text>
        </Pressable>
        <Pressable onPress={logout} style={styles.logoutButton} accessibilityRole="button">
          <Text style={styles.logoutLabel}>Выйти</Text>
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
    paddingBottom: 80
  },
  hero: {
    backgroundColor: palette.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8
  },
  balance: {
    color: palette.accent,
    marginTop: 12,
    fontWeight: '600'
  },
  section: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16
  },
  input: {
    backgroundColor: palette.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  switchTitle: {
    fontWeight: '600'
  },
  switchHint: {
    color: palette.muted,
    marginTop: 4,
    maxWidth: 220
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  logoutButton: {
    marginTop: 16,
    alignItems: 'center'
  },
  logoutLabel: {
    color: palette.danger,
    fontWeight: '600'
  }
});
