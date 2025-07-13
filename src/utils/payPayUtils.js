import { Linking, Alert } from 'react-native';

const PAYPAY_APP_STORE_URL = 'https://apps.apple.com/jp/app/paypay-%E3%83%9A%E3%82%A4%E3%83%9A%E3%82%A4/id1435783608';

/**
 * PayPayアプリをApp Store経由で開く
 * @param {Object} params - 送金情報
 * @param {string} params.to - 受取者
 * @param {number} params.amount - 金額
 */
export const openPayPayApp = async ({ to, amount }) => {
  try {
    await Linking.openURL(PAYPAY_APP_STORE_URL);
    
    // 2秒後に操作案内を表示
    setTimeout(() => {
      Alert.alert(
        '操作案内',
        `App Storeが開いたら「開く」ボタンをタップしてPayPayアプリを起動してください\n\n送金情報:\n受取者: ${to}\n金額: ¥${amount.toLocaleString()}`,
        [{ text: 'OK' }]
      );
    }, 2000);
  } catch (error) {
    Alert.alert('エラー', 'PayPayアプリを開けませんでした');
  }
};

/**
 * PayPay送金情報のアラートを表示
 * @param {Object} params - 送金情報
 * @param {string} params.to - 受取者
 * @param {number} params.amount - 金額
 */
export const showPayPaySendInfo = ({ to, amount }) => {
  Alert.alert(
    'PayPay送金情報',
    `以下の送金をお願いします：\n\n受取者: ${to}\n金額: ¥${amount.toLocaleString()}\n\n手順:\n1. PayPayアプリを開く\n2. 「送る」をタップ\n3. 上記の受取者と金額を入力`,
    [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: 'PayPayアプリを開く',
        onPress: () => openPayPayApp({ to, amount }),
      },
    ]
  );
};

/**
 * PayPay送金リンク（paypay.me形式）を生成
 * @param {string} username - PayPayユーザー名
 * @param {number} amount - 金額
 * @returns {string} PayPayリンク
 */
export const generatePayPayLink = (username, amount) => {
  if (!username || !amount) {
    throw new Error('ユーザー名と金額は必須です');
  }
  return `https://paypay.me/${username.trim()}?amount=${amount}`;
};

/**
 * PayPay送金リンクの妥当性チェック
 * @param {string} username - PayPayユーザー名
 * @param {string|number} amount - 金額
 * @returns {Object} バリデーション結果
 */
export const validatePayPayInput = (username, amount) => {
  const errors = [];
  
  if (!username?.trim()) {
    errors.push('PayPayユーザー名を入力してください');
  }
  
  const numAmount = Number(amount);
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    errors.push('正しい金額を入力してください');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};