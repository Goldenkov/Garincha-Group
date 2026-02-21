import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { palette } from '@/constants/colors';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('alexander.petrov@example.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const error = useAppStore((state) => state.error);
  const { login } = useAppStore((state) => state.actions);

  const emailNormalized = email.trim();
  const emailIsValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized), [emailNormalized]);
  const canSubmit = emailIsValid && password.trim().length >= 4 && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Проверьте данные', 'Введите валидный email и пароль длиной от 4 символов.');
      return;
    }

    setIsLoading(true);
    try {
      await login(emailNormalized, password);
    } catch (err) {
      Alert.alert('Авторизация', err instanceof Error ? err.message : 'Не удалось выполнить вход');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Garincha Group</Text>
        <Text style={styles.subtitle}>Войдите, чтобы управлять партнёрскими программами и бонусами.</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email участника клуба"
          placeholderTextColor={palette.muted}
          style={styles.input}
          accessibilityLabel="Email"
        />
        {!emailIsValid && emailNormalized.length > 0 ? <Text style={styles.validation}>Введите корректный email.</Text> : null}

        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Пароль или код доступа"
          placeholderTextColor={palette.muted}
          style={styles.input}
          accessibilityLabel="Пароль"
        />
        {password.length > 0 && password.length < 4 ? (
          <Text style={styles.validation}>Минимальная длина пароля — 4 символа.</Text>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={handleSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="Войти"
        >
          <Text style={styles.buttonLabel}>{isLoading ? 'Вход...' : 'Продолжить'}</Text>
        </Pressable>

        <Text style={styles.helper}>Используйте корпоративный email @example.com для доступа.</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.primary,
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    backgroundColor: palette.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text
  },
  validation: {
    marginBottom: 10,
    color: palette.danger,
    fontSize: 12
  },
  error: {
    color: palette.danger,
    marginBottom: 12
  },
  button: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  helper: {
    marginTop: 16,
    textAlign: 'center',
    color: palette.muted,
    fontSize: 12
  }
});
