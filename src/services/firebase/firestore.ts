import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

export const FirestoreService = {
  // Users
  async createUser(userId: string, userData: any): Promise<void> {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.now()
    });
  },

  async getUser(userId: string): Promise<any> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateUser(userId: string, updates: any): Promise<void> {
    await updateDoc(doc(db, 'users', userId), updates);
  },

  // Groups
  async createGroup(groupData: any): Promise<string> {
    const groupRef = doc(collection(db, 'groups'));
    await setDoc(groupRef, {
      ...groupData,
      createdAt: Timestamp.now()
    });
    return groupRef.id;
  },

  async getGroup(groupId: string): Promise<any> {
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async getUserGroups(userId: string): Promise<any[]> {
    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateGroup(groupId: string, updates: any): Promise<void> {
    await updateDoc(doc(db, 'groups', groupId), updates);
  },

  // Expenses
  async createExpense(expenseData: any): Promise<string> {
    const expenseRef = doc(collection(db, 'expenses'));
    await setDoc(expenseRef, {
      ...expenseData,
      createdAt: Timestamp.now()
    });
    return expenseRef.id;
  },

  async getGroupExpenses(groupId: string): Promise<any[]> {
    const q = query(
      collection(db, 'expenses'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateExpense(expenseId: string, updates: any): Promise<void> {
    await updateDoc(doc(db, 'expenses', expenseId), updates);
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await deleteDoc(doc(db, 'expenses', expenseId));
  },

  // Settlements
  async createSettlement(settlementData: any): Promise<string> {
    const settlementRef = doc(collection(db, 'settlements'));
    await setDoc(settlementRef, {
      ...settlementData,
      createdAt: Timestamp.now()
    });
    return settlementRef.id;
  },

  async getGroupSettlements(groupId: string): Promise<any[]> {
    const q = query(
      collection(db, 'settlements'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateSettlement(settlementId: string, updates: any): Promise<void> {
    await updateDoc(doc(db, 'settlements', settlementId), updates);
  }
};