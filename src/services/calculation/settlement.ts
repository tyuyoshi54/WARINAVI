import { Balance, Settlement } from './types';

export const SettlementCalculator = {
  calculateOptimalSettlements(balances: Balance[]): Settlement[] {
    const debtors = balances.filter(b => b.amount < 0).map(b => ({ ...b }));
    const creditors = balances.filter(b => b.amount > 0).map(b => ({ ...b }));
    const settlements: Settlement[] = [];

    // 最小取引回数でのマッチング
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      
      const amount = Math.min(Math.abs(debtor.amount), creditor.amount);
      
      // 1円未満は無視
      if (amount < 1) {
        if (Math.abs(debtor.amount) < creditor.amount) {
          debtors.shift();
        } else {
          creditors.shift();
        }
        continue;
      }
      
      settlements.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount: Math.round(amount)
      });
      
      debtor.amount += amount;
      creditor.amount -= amount;
      
      if (Math.abs(debtor.amount) < 1) debtors.shift();
      if (creditor.amount < 1) creditors.shift();
    }
    
    return settlements;
  },

  getTotalSettlementAmount(settlements: Settlement[]): number {
    return settlements.reduce((total, settlement) => total + settlement.amount, 0);
  },

  getSettlementsForUser(settlements: Settlement[], userId: string): {
    toReceive: Settlement[];
    toPay: Settlement[];
  } {
    return {
      toReceive: settlements.filter(s => s.toUserId === userId),
      toPay: settlements.filter(s => s.fromUserId === userId)
    };
  }
};