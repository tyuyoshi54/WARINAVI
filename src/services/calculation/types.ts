export interface Balance {
  userId: string;
  amount: number; // 正数: 受け取るべき金額, 負数: 支払うべき金額
}

export interface Settlement {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  payerId: string;
  amount: number;
  description: string;
  participants: string[];
  splitMethod: 'equal' | 'custom';
  customSplits?: Record<string, number>;
  createdAt: Date;
}