import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Loading } from '@/components/common';
import { AuthService } from '@/services';
import { LoginCredentials } from '@/types';
import { styles } from './LoginScreen.styles';

interface LoginForm extends LoginCredentials {}

export const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await AuthService.signIn(data.email, data.password);
      // Navigation will be handled by auth state change
    } catch (error) {
      Alert.alert(
        'ログインエラー',
        error instanceof Error ? error.message : 'ログインに失敗しました',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'パスワードリセット',
      'パスワードリセット機能は近日公開予定です',
      [{ text: 'OK' }]
    );
  };

  const handleSignUp = () => {
    // TODO: Navigate to register screen
    Alert.alert(
      'アカウント作成',
      'アカウント作成画面に移動します',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>ワリナビ</Text>
          <Text style={styles.subtitle}>割り勘精算アプリ</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'メールアドレスを入力してください',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '正しいメールアドレスを入力してください',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="メールアドレス"
                placeholder="example@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                testID="login-email-input"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'パスワードを入力してください',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上で入力してください',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="パスワード"
                placeholder="パスワードを入力"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
                testID="login-password-input"
              />
            )}
          />

          <Button
            title="ログイン"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            testID="login-button"
          />

          <Button
            title="パスワードを忘れた方"
            onPress={handleForgotPassword}
            variant="outline"
            size="small"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>アカウントをお持ちでない方</Text>
          <Button
            title="新規登録"
            onPress={handleSignUp}
            variant="secondary"
          />
        </View>
      </ScrollView>

      {isLoading && <Loading overlay text="ログイン中..." />}
    </KeyboardAvoidingView>
  );
};