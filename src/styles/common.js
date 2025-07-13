import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { TextStyles } from './typography';

// アプリ全体で共通使用されるスタイル定義
export const CommonStyles = StyleSheet.create({
  // レイアウト
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // ヘッダー
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  headerTitle: {
    ...TextStyles.headerMedium,
    color: Colors.textPrimary,
  },
  
  // ボタン
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  
  buttonText: {
    ...TextStyles.button,
    color: Colors.textInverse,
  },
  
  buttonTextSecondary: {
    ...TextStyles.button,
    color: Colors.textPrimary,
  },
  
  buttonTextDisabled: {
    ...TextStyles.button,
    color: Colors.disabledText,
  },
  
  // テキスト
  textPrimary: {
    color: Colors.textPrimary,
  },
  
  textSecondary: {
    color: Colors.textSecondary,
  },
  
  textTertiary: {
    color: Colors.textTertiary,
  },
  
  // 入力フィールド
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    ...TextStyles.bodyMedium,
    color: Colors.textPrimary,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  // カード
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // リストアイテム
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  
  // セパレーター
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  
  separatorThick: {
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  
  // 中央寄せ
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // シャドウ効果
  shadow: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  shadowLight: {
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

// よく使用される寸法
export const Dimensions = {
  // パディング・マージン
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // ボーダー半径
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    round: 999,
  },
  
  // アイコンサイズ
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // プロフィール画像サイズ
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
    xl: 80,
  },
};