import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

export const FunctionsService = {
  calculateSettlements: httpsCallable(functions, 'calculateSettlements'),
  generateInviteLink: httpsCallable(functions, 'generateInviteLink'),
  joinGroupByLink: httpsCallable(functions, 'joinGroupByLink'),
};