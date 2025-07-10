import { Balance, Expense } from './types';

export const BalanceCalculator = {
  calculateBalances(expenses: Expense[], memberIds: string[]): Balance[] {
    const balances: Record<string, number> = {};
    
    // 初期化
    memberIds.forEach(memberId => {
      balances[memberId] = 0;
    });

    expenses.forEach(expense => {
      const { payerId, amount, participants, splitMethod, customSplits } = expense;
      
      // 支払った人は正の金額を追加
      balances[payerId] += amount;

      if (splitMethod === 'equal') {
        // 等分割
        const splitAmount = amount / participants.length;
        participants.forEach(participantId => {
          balances[participantId] -= splitAmount;
        });
      } else if (splitMethod === 'custom' && customSplits) {
        // カスタム分割
        Object.entries(customSplits).forEach(([participantId, splitAmount]) => {
          balances[participantId] -= splitAmount;
        });
      }
    });

    return memberIds.map(memberId => ({
      userId: memberId,
      amount: Math.round(balances[memberId] * 100) / 100 // 小数点以下2桁に丸める
    }));
  },

  validateExpense(expense: Omit<Expense, 'id' | 'createdAt'>): boolean {
    const { amount, participants, splitMethod, customSplits } = expense;
    
    if (amount <= 0) return false;
    if (participants.length === 0) return false;
    
    if (splitMethod === 'custom') {
      if (!customSplits) return false;
      
      const totalCustomAmount = Object.values(customSplits).reduce((sum, amt) => sum + amt, 0);
      const tolerance = 0.01; // 1円の誤差は許容
      
      if (Math.abs(totalCustomAmount - amount) > tolerance) return false;
    }
    
    return true;
  }
};