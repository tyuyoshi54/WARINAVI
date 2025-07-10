# ワリナビ - 設計書

## 1. システム概要

**ワリナビ**は、グループ内での割り勘精算をスマートに管理するモバイルアプリケーションです。  
PayPay送金リンクと連携し、最適化された精算計算により、立替金の精算を効率化します。

### 1.1 目的
- グループでの立替金を記録し、差額を最小回数で最適化して精算
- PayPay送金リンクによるワンタップ送金
- iOS / Android両対応

### 1.2 主要機能
- 認証機能（Firebase Auth）
- 割り勘グループ管理
- 立替記録・精算計算
- PayPay送金リンク統合
- 精算履歴管理

---

## 2. 技術スタック

### 2.1 フロントエンド
- **React Native**: クロスプラットフォーム開発
- **Expo**: 開発効率化・デプロイ管理
- **TypeScript**: 型安全性確保
- **React Navigation**: ナビゲーション管理
- **React Hook Form**: フォーム管理
- **Async Storage**: ローカルストレージ

### 2.2 バックエンド
- **Firebase Authentication**: 認証
- **Firebase Firestore**: データベース
- **Firebase Functions**: API・ビジネスロジック
- **Firebase Storage**: ファイルストレージ
- **Firebase Cloud Messaging**: プッシュ通知

### 2.3 外部API
- **PayPay送金リンク**: `https://paypay.me/{username}?amount={金額}`

---

## 3. データベース設計（Firestore）

### 3.1 Collections構造

```
users/
├── {userId}/
│   ├── uid: string
│   ├── email: string
│   ├── displayName: string
│   ├── payPayId: string
│   └── createdAt: timestamp

groups/
├── {groupId}/
│   ├── name: string
│   ├── description: string
│   ├── createdBy: string (userId)
│   ├── createdAt: timestamp
│   ├── isActive: boolean
│   └── members: array<string> (userIds)

expenses/
├── {expenseId}/
│   ├── groupId: string
│   ├── payerId: string (userId)
│   ├── amount: number
│   ├── description: string
│   ├── participants: array<string> (userIds)
│   ├── splitMethod: string ("equal" | "custom")
│   ├── customSplits: object<userId, amount>
│   └── createdAt: timestamp

settlements/
├── {settlementId}/
│   ├── groupId: string
│   ├── fromUserId: string
│   ├── toUserId: string
│   ├── amount: number
│   ├── isCompleted: boolean
│   ├── completedAt: timestamp
│   └── createdAt: timestamp
```

### 3.2 セキュリティルール

```javascript
// users collection
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// groups collection
match /groups/{groupId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in resource.data.members;
}

// expenses collection
match /expenses/{expenseId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.members;
}

// settlements collection
match /settlements/{settlementId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.members;
}
```

---

## 4. API設計（Firebase Functions）

### 4.1 エンドポイント

```typescript
// 精算計算エンドポイント
POST /calculateSettlements
{
  groupId: string
}
Response: {
  settlements: Array<{
    fromUserId: string,
    toUserId: string,
    amount: number
  }>
}

// グループ招待リンク生成
POST /generateInviteLink
{
  groupId: string
}
Response: {
  inviteLink: string,
  expiredAt: timestamp
}

// 招待リンクからグループ参加
POST /joinGroupByLink
{
  inviteToken: string,
  userId: string
}
Response: {
  success: boolean,
  groupId: string
}
```

### 4.2 精算計算アルゴリズム

```typescript
interface Balance {
  userId: string;
  amount: number; // 正数: 受け取るべき金額, 負数: 支払うべき金額
}

function calculateSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances.filter(b => b.amount < 0);
  const creditors = balances.filter(b => b.amount > 0);
  const settlements: Settlement[] = [];

  // 最小取引回数でのマッチング
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
    
    settlements.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amount: amount
    });
    
    debtor.amount += amount;
    creditor.amount -= amount;
    
    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }
  
  return settlements;
}
```

---

## 5. 画面設計

### 5.1 画面構成

```
App Navigator (Stack)
├── Auth Navigator (Stack)
│   ├── Login Screen
│   └── Register Screen
└── Main Navigator (Tab)
    ├── Home Stack
    │   ├── Home Screen
    │   ├── Group Detail Screen
    │   └── Expense Input Screen
    ├── History Stack
    │   ├── History Screen
    │   └── Settlement Detail Screen
    └── Profile Stack
        ├── Profile Screen
        └── Settings Screen
```

### 5.2 主要画面詳細

#### 5.2.1 ホーム画面
```typescript
interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

Components:
- グループ一覧 (FlatList)
- 新規グループ作成ボタン
- アクティブな精算通知
```

#### 5.2.2 グループ詳細画面
```typescript
interface GroupDetailScreenProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

Components:
- グループ情報表示
- メンバー一覧
- 立替記録一覧
- 精算結果表示
- 立替追加ボタン
```

#### 5.2.3 精算結果画面
```typescript
interface SettlementScreenProps {
  settlements: Settlement[];
  onPayPay: (settlement: Settlement) => void;
  onMarkCompleted: (settlementId: string) => void;
}

Components:
- 精算一覧表示
- PayPay送金ボタン
- 精算完了チェック
```

---

## 6. PayPay統合仕様

### 6.1 送金リンク仕様
```typescript
interface PayPayLinkConfig {
  baseUrl: "https://paypay.me/";
  username: string;
  amount: number;
}

function generatePayPayLink(config: PayPayLinkConfig): string {
  return `${config.baseUrl}${config.username}?amount=${config.amount}`;
}
```

### 6.2 送金フロー
1. 精算結果画面で「PayPayで送る」ボタンタップ
2. PayPay送金リンクを生成
3. 外部ブラウザまたはPayPayアプリを起動
4. PayPay側で送金完了後、アプリに戻る
5. 手動で「精算完了」をマーク

---

## 7. 認証・権限設計

### 7.1 認証方法
- Google認証
- メール/パスワード認証
- LINE認証（将来実装）

### 7.2 権限レベル
- **グループオーナー**: 全ての操作が可能
- **グループメンバー**: 立替記録・精算のみ可能
- **未認証ユーザー**: 読み取り専用（招待リンクのみ）

---

## 8. 開発環境・デプロイ

### 8.1 開発環境
```bash
# 必要なツール
- Node.js (v18+)
- Expo CLI
- Firebase CLI
- React Native CLI

# 開発サーバー起動
expo start

# ビルド
expo build:android
expo build:ios
```

### 8.2 デプロイ戦略
- **開発環境**: Expo Development Build
- **ステージング**: Expo Preview
- **本番環境**: App Store / Google Play Store

---

## 9. テスト戦略

### 9.1 テスト種類
- **Unit Test**: Jest + React Native Testing Library
- **Integration Test**: Detox
- **E2E Test**: Maestro

### 9.2 テスト項目
- 認証フロー
- 精算計算ロジック
- PayPay連携
- オフライン対応
- セキュリティ

---

## 10. 運用・監視

### 10.1 監視項目
- Firebase Analytics
- Crashlytics
- Performance Monitoring
- Cloud Functions監視

### 10.2 メンテナンス
- データベース定期バックアップ
- 未使用グループの自動削除
- パフォーマンス最適化

---

## 11. 今後の拡張予定

### 11.1 Phase 2
- レシート画像認識機能
- 複数通貨対応
- 分割方法カスタマイズ

### 11.2 Phase 3
- 他の決済アプリ連携
- 定期的な割り勘設定
- 分析・レポート機能

---

## 12. 開発スケジュール

### 12.1 マイルストーン
- **Phase 1** (8週間): 基本機能実装
- **Phase 2** (4週間): テスト・最適化
- **Phase 3** (2週間): デプロイ・運用開始

### 12.2 リスク管理
- PayPay API変更リスク
- Firebase制限・コスト
- アプリストア審査
- セキュリティ脆弱性