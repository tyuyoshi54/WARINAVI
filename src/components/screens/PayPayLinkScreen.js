import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Clipboard,
  Linking,
  Share,
  ScrollView
} from 'react-native';

export default function PayPayLinkScreen({ route, navigation }) {
  const { fromUser, toUser, amount } = route.params;
  const [payPayUsername, setPayPayUsername] = useState('');
  const [customAmount, setCustomAmount] = useState(amount?.toString() || '');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: 'PayPay送金リンク作成',
    });
  }, [navigation]);

  const generatePayPayLink = () => {
    if (!payPayUsername.trim()) {
      Alert.alert('エラー', 'PayPayのユーザー名を入力してください');
      return;
    }

    if (!customAmount || isNaN(customAmount) || Number(customAmount) <= 0) {
      Alert.alert('エラー', '正しい金額を入力してください');
      return;
    }

    const link = `https://paypay.me/${payPayUsername.trim()}?amount=${customAmount}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await Clipboard.setString(generatedLink);
      Alert.alert('コピー完了', 'リンクをクリップボードにコピーしました');
    } catch (error) {
      Alert.alert('エラー', 'コピーに失敗しました');
    }
  };

  const openPayPayApp = async () => {
    const payPayAppUrl = 'paypay://';
    const payPayWebUrl = 'https://paypay.ne.jp/app/send';
    
    try {
      const canOpen = await Linking.canOpenURL(payPayAppUrl);
      if (canOpen) {
        await Linking.openURL(payPayAppUrl);
        Alert.alert(
          'PayPayアプリを開きました',
          `送金手順:\n1. 送金画面で「送る」をタップ\n2. 受取者: ${toUser}\n3. 金額: ¥${Number(customAmount).toLocaleString()}を入力`
        );
      } else {
        await Linking.openURL(payPayWebUrl);
        Alert.alert(
          'PayPayアプリがインストールされていません',
          'ブラウザでPayPayの送金ページを開きました\nアプリをインストールしてご利用ください'
        );
      }
    } catch (error) {
      Alert.alert('エラー', 'PayPayを開けませんでした');
    }
  };

  const openPayPayLink = () => {
    if (!generatedLink) return;
    
    Linking.openURL(generatedLink).catch(() => {
      Alert.alert('エラー', 'PayPayアプリを開けませんでした\nアプリがインストールされているか確認してください');
    });
  };

  const shareLink = async () => {
    if (!generatedLink) return;
    
    try {
      await Share.share({
        message: `PayPayで送金をお願いします\n金額: ¥${Number(customAmount).toLocaleString()}\n\n${generatedLink}`,
        title: 'PayPay送金リンク',
      });
    } catch (error) {
      Alert.alert('エラー', 'シェアに失敗しました');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PayPay送金リンク作成</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>送金情報</Text>
          <Text style={styles.infoText}>送金者: {fromUser}</Text>
          <Text style={styles.infoText}>受取者: {toUser}</Text>
          <Text style={styles.infoText}>金額: ¥{Number(customAmount || 0).toLocaleString()}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PayPayユーザー名 ({toUser}のPayPayユーザー名)</Text>
          <TextInput
            style={styles.input}
            value={payPayUsername}
            onChangeText={setPayPayUsername}
            placeholder="PayPayのユーザー名を入力"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>送金金額</Text>
          <TextInput
            style={styles.input}
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder="金額を入力"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.generateButton, styles.payPayDirectButton]}
          onPress={openPayPayApp}
        >
          <Text style={styles.generateButtonText}>PayPayアプリで直接送金</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePayPayLink}
        >
          <Text style={styles.generateButtonText}>PayPayリンクを生成</Text>
        </TouchableOpacity>

        {generatedLink ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>生成されたリンク</Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText} numberOfLines={3}>
                {generatedLink}
              </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.copyButton]}
                onPress={copyToClipboard}
              >
                <Text style={styles.actionButtonText}>コピー</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.openButton]}
                onPress={openPayPayLink}
              >
                <Text style={styles.actionButtonText}>PayPayで開く</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={shareLink}
              >
                <Text style={styles.actionButtonText}>シェア</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>使い方</Text>
          <Text style={styles.helpText}>
            1. 受取者のPayPayユーザー名を入力{'\n'}
            2. 送金金額を確認・調整{'\n'}
            3. 「PayPayリンクを生成」をタップ{'\n'}
            4. 生成されたリンクをコピー、PayPayで開く、またはシェア
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    padding: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  generateButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  payPayDirectButton: {
    backgroundColor: '#00A0FF',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  linkContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  copyButton: {
    backgroundColor: '#007AFF',
  },
  openButton: {
    backgroundColor: '#ff6b35',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helpContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});