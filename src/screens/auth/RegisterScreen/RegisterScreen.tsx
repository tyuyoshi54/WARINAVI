import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Loading } from '@/components/common';
import { AuthService, FirestoreService } from '@/services';
import { RegisterCredentials } from '@/types';
import { styles } from './RegisterScreen.styles';

interface RegisterForm extends RegisterCredentials {}

export const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      payPayId: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const user = await AuthService.signUp(data.email, data.password, data.displayName);
      
      // Create user document in Firestore
      await FirestoreService.createUser(user.uid, {
        uid: user.uid,
        email: data.email,
        displayName: data.displayName,
        payPayId: data.payPayId || null,
      });

      Alert.alert(
        'アカウント作成完了',
        'アカウントが正常に作成されました',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'アカウント作成エラー',
        error instanceof Error ? error.message : 'アカウント作成に失敗しました',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // TODO: Navigate back to login screen
    Alert.alert(
      'ログイン画面',
      'ログイン画面に戻ります',
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
          <Text style={styles.title}>アカウント作成</Text>
          <Text style={styles.subtitle}>ワリナビを始めよう</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="displayName"
            rules={{
              required: '名前を入力してください',
              minLength: {
                value: 2,
                message: '名前は2文字以上で入力してください',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="名前"
                placeholder="田中太郎"
                value={value}
                onChangeText={onChange}
                error={errors.displayName?.message}
                testID="register-name-input"
              />
            )}
          />

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
                testID="register-email-input"
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
                placeholder="6文字以上のパスワード"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
                testID="register-password-input"
              />
            )}
          />

          <Controller
            control={control}
            name="payPayId"
            render={({ field: { onChange, value } }) => (
              <Input
                label="PayPay ID（任意）"
                placeholder="your-paypay-id"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                testID="register-paypay-input"
              />
            )}
          />

          <Button
            title="アカウント作成"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            testID="register-button"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>すでにアカウントをお持ちの方</Text>
          <Button
            title="ログインに戻る"
            onPress={handleBackToLogin}
            variant="outline"
          />
        </View>
      </ScrollView>

      {isLoading && <Loading overlay text="アカウント作成中..." />}
    </KeyboardAvoidingView>
  );
};