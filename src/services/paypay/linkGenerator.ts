import { PayPayLinkConfig } from './types';

export const PayPayLinkGenerator = {
  generate(config: PayPayLinkConfig): string {
    const { username, amount } = config;
    const baseUrl = 'https://paypay.me/';
    
    if (!username || !amount || amount <= 0) {
      throw new Error('Invalid PayPay link configuration');
    }
    
    return `${baseUrl}${username}?amount=${amount}`;
  },

  validate(username: string, amount: number): boolean {
    return !!(username && amount > 0);
  }
};