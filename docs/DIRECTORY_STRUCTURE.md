# ワリナビ - ディレクトリ構成

## プロジェクト全体構成

```
WARINAVI/
├── .expo/                          # Expo設定ファイル
├── .git/                           # Git設定
├── assets/                         # 画像・フォント等のアセット
│   ├── images/
│   │   ├── icons/
│   │   └── splash/
│   └── fonts/
├── src/                            # メインソースコード
│   ├── components/                 # 再利用可能なコンポーネント
│   │   ├── common/                 # 共通コンポーネント
│   │   │   ├── Button/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.styles.ts
│   │   │   ├── Input/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.styles.ts
│   │   │   ├── Loading/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Loading.tsx
│   │   │   │   └── Loading.styles.ts
│   │   │   └── index.ts
│   │   ├── forms/                  # フォーム関連コンポーネント
│   │   │   ├── ExpenseForm/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   └── ExpenseForm.styles.ts
│   │   │   ├── GroupForm/
│   │   │   │   ├── index.ts
│   │   │   │   ├── GroupForm.tsx
│   │   │   │   └── GroupForm.styles.ts
│   │   │   └── index.ts
│   │   ├── lists/                  # リスト表示コンポーネント
│   │   │   ├── GroupList/
│   │   │   │   ├── index.ts
│   │   │   │   ├── GroupList.tsx
│   │   │   │   ├── GroupList.styles.ts
│   │   │   │   └── GroupListItem.tsx
│   │   │   ├── ExpenseList/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   ├── ExpenseList.styles.ts
│   │   │   │   └── ExpenseListItem.tsx
│   │   │   ├── SettlementList/
│   │   │   │   ├── index.ts
│   │   │   │   ├── SettlementList.tsx
│   │   │   │   ├── SettlementList.styles.ts
│   │   │   │   └── SettlementListItem.tsx
│   │   │   └── index.ts
│   │   ├── modals/                 # モーダルコンポーネント
│   │   │   ├── InviteModal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── InviteModal.tsx
│   │   │   │   └── InviteModal.styles.ts
│   │   │   ├── ConfirmModal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ConfirmModal.tsx
│   │   │   │   └── ConfirmModal.styles.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── screens/                    # 画面コンポーネント
│   │   ├── auth/                   # 認証関連画面
│   │   │   ├── LoginScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── LoginScreen.styles.ts
│   │   │   ├── RegisterScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   └── RegisterScreen.styles.ts
│   │   │   └── index.ts
│   │   ├── home/                   # ホーム関連画面
│   │   │   ├── HomeScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   └── HomeScreen.styles.ts
│   │   │   ├── GroupDetailScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── GroupDetailScreen.tsx
│   │   │   │   └── GroupDetailScreen.styles.ts
│   │   │   ├── ExpenseInputScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ExpenseInputScreen.tsx
│   │   │   │   └── ExpenseInputScreen.styles.ts
│   │   │   └── index.ts
│   │   ├── settlement/             # 精算関連画面
│   │   │   ├── SettlementScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── SettlementScreen.tsx
│   │   │   │   └── SettlementScreen.styles.ts
│   │   │   ├── PaymentScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── PaymentScreen.tsx
│   │   │   │   └── PaymentScreen.styles.ts
│   │   │   └── index.ts
│   │   ├── history/                # 履歴関連画面
│   │   │   ├── HistoryScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── HistoryScreen.tsx
│   │   │   │   └── HistoryScreen.styles.ts
│   │   │   └── index.ts
│   │   ├── profile/                # プロフィール関連画面
│   │   │   ├── ProfileScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   └── ProfileScreen.styles.ts
│   │   │   ├── SettingsScreen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── SettingsScreen.tsx
│   │   │   │   └── SettingsScreen.styles.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── navigation/                 # ナビゲーション設定
│   │   ├── types.ts               # ナビゲーション型定義
│   │   ├── AuthNavigator.tsx      # 認証フロー
│   │   ├── MainNavigator.tsx      # メインフロー
│   │   ├── TabNavigator.tsx       # タブナビゲーション
│   │   └── index.ts
│   ├── services/                   # API・外部サービス
│   │   ├── firebase/              # Firebase関連
│   │   │   ├── config.ts         # Firebase設定
│   │   │   ├── auth.ts           # 認証サービス
│   │   │   ├── firestore.ts      # Firestore操作
│   │   │   ├── functions.ts      # Cloud Functions
│   │   │   └── index.ts
│   │   ├── paypay/               # PayPay関連
│   │   │   ├── linkGenerator.ts  # 送金リンク生成
│   │   │   ├── types.ts         # PayPay型定義
│   │   │   └── index.ts
│   │   ├── calculation/          # 精算計算
│   │   │   ├── settlement.ts    # 精算計算ロジック
│   │   │   ├── balance.ts       # 残高計算
│   │   │   ├── types.ts         # 計算関連型定義
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── stores/                    # 状態管理
│   │   ├── auth/                 # 認証状態
│   │   │   ├── authStore.ts
│   │   │   ├── authTypes.ts
│   │   │   └── index.ts
│   │   ├── groups/               # グループ状態
│   │   │   ├── groupStore.ts
│   │   │   ├── groupTypes.ts
│   │   │   └── index.ts
│   │   ├── expenses/             # 支出状態
│   │   │   ├── expenseStore.ts
│   │   │   ├── expenseTypes.ts
│   │   │   └── index.ts
│   │   ├── settlements/          # 精算状態
│   │   │   ├── settlementStore.ts
│   │   │   ├── settlementTypes.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                     # カスタムフック
│   │   ├── useAuth.ts
│   │   ├── useGroups.ts
│   │   ├── useExpenses.ts
│   │   ├── useSettlements.ts
│   │   ├── usePayPay.ts
│   │   └── index.ts
│   ├── utils/                     # ユーティリティ関数
│   │   ├── date.ts               # 日付操作
│   │   ├── currency.ts           # 通貨フォーマット
│   │   ├── validation.ts         # バリデーション
│   │   ├── storage.ts            # ローカルストレージ
│   │   └── index.ts
│   ├── constants/                 # 定数定義
│   │   ├── colors.ts             # カラーパレット
│   │   ├── fonts.ts              # フォント定義
│   │   ├── dimensions.ts         # 画面サイズ等
│   │   ├── api.ts                # API定数
│   │   └── index.ts
│   ├── types/                     # 型定義
│   │   ├── auth.ts               # 認証関連型
│   │   ├── group.ts              # グループ関連型
│   │   ├── expense.ts            # 支出関連型
│   │   ├── settlement.ts         # 精算関連型
│   │   ├── user.ts               # ユーザー関連型
│   │   └── index.ts
│   └── App.tsx                    # アプリケーションルート
├── functions/                     # Firebase Functions
│   ├── src/
│   │   ├── settlement/
│   │   │   ├── calculator.ts
│   │   │   └── index.ts
│   │   ├── invite/
│   │   │   ├── generator.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── __tests__/                     # テストファイル
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── utils/
│   └── __mocks__/
├── docs/                          # ドキュメント
│   ├── api/
│   ├── components/
│   └── deployment/
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── app.json                       # Expo設定
├── babel.config.js
├── metro.config.js
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
├── DESIGN.md
└── CLAUDE.md
```

## ファイル命名規則

### コンポーネント
- **フォルダ名**: PascalCase (`Button`, `GroupList`)
- **ファイル名**: 
  - `index.ts` (エクスポート用)
  - `ComponentName.tsx` (メインコンポーネント)
  - `ComponentName.styles.ts` (スタイル)
  - `ComponentName.test.tsx` (テスト)

### サービス・ユーティリティ
- **ファイル名**: camelCase (`authService.ts`, `dateUtils.ts`)
- **フォルダ名**: camelCase (`firebase`, `paypay`)

### 型定義
- **ファイル名**: camelCase (`authTypes.ts`, `groupTypes.ts`)
- **interface名**: PascalCase (`User`, `GroupData`)

## インポート規則

### インポート順序
1. React関連
2. 外部ライブラリ
3. 内部モジュール（絶対パス）
4. 相対パス

### 例
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import { Button } from '@/components/common';
import { useAuth } from '@/hooks';
import { AuthService } from '@/services';

import { styles } from './LoginScreen.styles';
```

## エクスポート規則

### インデックスファイル
各フォルダに`index.ts`を配置し、明示的なエクスポート

```typescript
// src/components/common/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Loading } from './Loading';
```

### 個別コンポーネント
```typescript
// src/components/common/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```