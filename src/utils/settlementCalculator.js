// 精算計算ロジック

export const calculateSettlement = (members, payments) => {
  if (!payments || payments.length === 0) {
    return {
      memberBalances: members.reduce((acc, member) => {
        acc[member] = { paid: 0, shouldPay: 0, balance: 0 };
        return acc;
      }, {}),
      settlements: [],
      totalAmount: 0,
      perPersonAmount: 0,
    };
  }

  // 総額を計算
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // 一人当たりの金額を計算
  const perPersonAmount = Math.round(totalAmount / members.length);

  // メンバーごとの支払い額を計算
  const memberPayments = members.reduce((acc, member) => {
    acc[member] = 0;
    return acc;
  }, {});

  payments.forEach(payment => {
    if (memberPayments.hasOwnProperty(payment.payer)) {
      memberPayments[payment.payer] += payment.amount;
    }
  });

  // メンバーごとの収支を計算
  const memberBalances = {};
  members.forEach(member => {
    const paid = memberPayments[member];
    const shouldPay = perPersonAmount;
    const balance = paid - shouldPay; // 正の値：もらう側、負の値：払う側
    
    memberBalances[member] = {
      paid: paid,
      shouldPay: shouldPay,
      balance: balance,
    };
  });

  // 精算プランを生成
  const settlements = generateSettlementPlan(memberBalances);

  return {
    memberBalances,
    settlements,
    totalAmount,
    perPersonAmount,
  };
};

const generateSettlementPlan = (memberBalances) => {
  // 債権者（もらう側）と債務者（払う側）に分ける
  const creditors = []; // 正の残高（もらう側）
  const debtors = []; // 負の残高（払う側）

  Object.entries(memberBalances).forEach(([member, balance]) => {
    if (balance.balance > 0) {
      creditors.push({ name: member, amount: balance.balance });
    } else if (balance.balance < 0) {
      debtors.push({ name: member, amount: Math.abs(balance.balance) });
    }
  });

  const settlements = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  // 精算プランを生成（グリーディアルゴリズム）
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(creditor.amount, debtor.amount);

    if (settlementAmount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: settlementAmount,
      });

      creditor.amount -= settlementAmount;
      debtor.amount -= settlementAmount;
    }

    if (creditor.amount === 0) {
      creditorIndex++;
    }
    if (debtor.amount === 0) {
      debtorIndex++;
    }
  }

  return settlements;
};