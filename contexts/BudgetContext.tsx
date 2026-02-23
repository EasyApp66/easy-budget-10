
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticatedGet, authenticatedPost, authenticatedDelete } from '@/utils/api';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export interface Month {
  id: string;
  name: string;
  budgetAmount: number;
  expenses: Expense[];
  isPinned: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export interface PremiumStatus {
  type: 'None' | 'Trial' | 'Monthly' | 'Lifetime' | 'Expired';
  endDate: string | null;
  hasAppleSubscription?: boolean;
}

interface BudgetContextType {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
  budgetName: string;
  setBudgetName: (name: string) => void;
  months: Month[];
  setMonths: (months: Month[]) => void;
  activeMonthId: string;
  setActiveMonthId: (id: string) => void;
  subscriptions: Subscription[];
  setSubscriptions: (subs: Subscription[]) => void;
  premiumStatus: PremiumStatus;
  setPremiumStatus: (status: PremiumStatus) => void;
  applyPremiumCode: (code: string) => Promise<boolean>;
  purchasePremium: (purchaseType: 'lifetime' | 'monthly', appleTransactionId?: string) => Promise<boolean>;
  fetchPremiumStatus: () => Promise<void>;
  cancelPremium: () => Promise<boolean>;
  addMonth: (name: string) => void;
>>>>>>> origin/main
  deleteMonth: (id: string) => void;
  duplicateMonth: (id: string) => void;
  renameMonth: (id: string, newName: string) => void;
  togglePinMonth: (id: string) => void;
  updateMonthBudget: (id: string, budgetAmount: number) => void;
  addExpense: (monthId: string, name: string, amount: number) => void;
  deleteExpense: (monthId: string, expenseId: string) => void;
  updateExpense: (monthId: string, expenseId: string, name: string, amount: number) => void;
  duplicateExpense: (monthId: string, expenseId: string) => void;
  togglePinExpense: (monthId: string, expenseId: string) => void;
  addSubscription: (name: string, amount: number) => void;
  deleteSubscription: (id: string) => void;
  updateSubscription: (id: string, name: string, amount: number) => void;
  duplicateSubscription: (id: string) => void;
  togglePinSubscription: (id: string) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = '@easy_budget_data';

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [budgetName, setBudgetName] = useState('Budget');
  const [months, setMonths] = useState<Month[]>([]);
  const [activeMonthId, setActiveMonthId] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({ type: 'None', endDate: null });
  const [isLoaded, setIsLoaded] = useState(false);

  const initializeDefaultData = useCallback(() => {
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthName = nextMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

    const month1: Month = {
      id: Date.now().toString(),
      name: currentMonthName,
      budgetAmount: 0,
      isPinned: false,
      expenses: [],
    };

    const month2: Month = {
      id: (Date.now() + 1).toString(),
      name: nextMonthName,
      budgetAmount: 0,
      isPinned: false,
      expenses: [],
    };

    setMonths([month1, month2]);
    setActiveMonthId(month1.id);

    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 14);
    setPremiumStatus({ type: 'Trial', endDate: trialEndDate.toISOString() });
    console.log('14-day trial premium activated');
  }, []);

  const loadData = useCallback(async () => {
    try {
      console.log('Loading budget data from AsyncStorage...');
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        console.log('Data loaded successfully:', data);
        setHasSeenWelcome(data.hasSeenWelcome || false);
        setBudgetName(data.budgetName || 'Budget');
        
        const loadedMonths = data.months || [];
        const migratedMonths = loadedMonths.map((month: any) => ({
          ...month,
          budgetAmount: month.budgetAmount !== undefined ? month.budgetAmount : (data.budgetAmount || 0),
        }));
        setMonths(migratedMonths);
        
        setActiveMonthId(data.activeMonthId || '');
        setSubscriptions(data.subscriptions || []);
        setPremiumStatus(data.premiumStatus || { type: 'None', endDate: null });
      } else {
        console.log('No saved data found, initializing with default data');
        initializeDefaultData();
      }
      setIsLoaded(true);
    } catch (e) {
      console.error('Error loading budget data:', e);
      initializeDefaultData();
      setIsLoaded(true);
    }
  }, [initializeDefaultData]);

  const saveData = useCallback(async () => {
    try {
      const data = {
        hasSeenWelcome,
        budgetName,
        months,
        activeMonthId,
        subscriptions,
        premiumStatus,
      };
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Budget data saved successfully');
    } catch (e) {
      console.error('Error saving budget data:', e);
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions, premiumStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [saveData, isLoaded]);

  const applyPremiumCode = useCallback(async (code: string): Promise<boolean> => {
    console.log('Applying premium code:', code);

    // Try backend first
    try {
      console.log('[API] Requesting /api/premium/verify-code...');
      const result = await authenticatedPost<{
        success: boolean;
        premiumType: 'monthly' | 'lifetime';
        expiryDate: string | null;
      }>('/api/premium/verify-code', { code });

      if (result.success) {
        let newPremiumStatus: PremiumStatus;
        if (result.premiumType === 'lifetime') {
          newPremiumStatus = { type: 'Lifetime', endDate: null };
          console.log('Lifetime premium activated via backend');
        } else {
          newPremiumStatus = { type: 'Monthly', endDate: result.expiryDate };
          console.log('Monthly premium activated via backend, expires:', result.expiryDate);
        }
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        return true;
      }
      return false;
    } catch (backendError) {
      console.warn('[API] Backend verify-code failed, falling back to local check:', backendError);
      // Fallback to local code check if backend is unavailable or user not authenticated
      const now = new Date();
      let newPremiumStatus: PremiumStatus;
      const normalizedCode = code.toLowerCase().trim();

      if (normalizedCode === 'easy2033') {
        newPremiumStatus = { type: 'Lifetime', endDate: null };
        console.log('Lifetime premium activated with local code: easy2033');
      } else if (normalizedCode === 'easy2') {
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        newPremiumStatus = { type: 'Monthly', endDate: oneMonthLater.toISOString() };
        console.log('1-month premium activated with local code: easy2');
      } else {
        console.log('Invalid premium code:', code);
        return false;
      }

      setPremiumStatus(newPremiumStatus);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        hasSeenWelcome,
        budgetName,
        months,
        activeMonthId,
        subscriptions,
        premiumStatus: newPremiumStatus,
      }));
      return true;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);

  const purchasePremium = useCallback(async (purchaseType: 'lifetime' | 'monthly', appleTransactionId?: string): Promise<boolean> => {
    console.log('[API] Requesting /api/premium/purchase...', purchaseType);
    try {
      const body: { purchaseType: 'lifetime' | 'monthly'; appleTransactionId?: string } = { purchaseType };
      if (appleTransactionId) {
        body.appleTransactionId = appleTransactionId;
      }
      const result = await authenticatedPost<{
        success: boolean;
        purchase: { id: string; purchaseType: string; expiryDate: string | null };
      }>('/api/premium/purchase', body);

      if (result.success) {
        let newPremiumStatus: PremiumStatus;
        if (purchaseType === 'lifetime') {
          newPremiumStatus = { type: 'Lifetime', endDate: null };
        } else {
          newPremiumStatus = { type: 'Monthly', endDate: result.purchase.expiryDate, hasAppleSubscription: true };
        }
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        console.log('Premium purchase successful:', purchaseType);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[API] Premium purchase failed:', error);
      throw error;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);

  const fetchPremiumStatus = useCallback(async (): Promise<void> => {
    console.log('[API] Requesting /api/premium/status...');
    try {
      const result = await authenticatedGet<{
        isPremium: boolean;
        type: 'none' | 'lifetime' | 'monthly';
        expiryDate: string | null;
      }>('/api/premium/status');

      if (result.type === 'lifetime') {
        const newPremiumStatus: PremiumStatus = { type: 'Lifetime', endDate: null };
        setPremiumStatus(newPremiumStatus);
      } else if (result.type === 'monthly' && result.isPremium) {
        const newPremiumStatus: PremiumStatus = { type: 'Monthly', endDate: result.expiryDate, hasAppleSubscription: true };
        setPremiumStatus(newPremiumStatus);
      }
      // If 'none' or not premium, keep local status (trial, etc.) unchanged
      console.log('Premium status fetched from backend:', result);
    } catch (error) {
      console.warn('[API] Could not fetch premium status from backend (user may not be authenticated):', error);
    }
  }, []);

  const cancelPremium = useCallback(async (): Promise<boolean> => {
    console.log('[API] Requesting DELETE /api/premium/cancel...');
    try {
      const result = await authenticatedDelete<{ success: boolean }>('/api/premium/cancel');
      if (result.success) {
        const newPremiumStatus: PremiumStatus = { type: 'None', endDate: null };
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        console.log('Premium subscription cancelled');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[API] Cancel premium failed:', error);
      throw error;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);

    // Try backend first
    try {
      console.log('[API] Requesting /api/premium/verify-code...');
      const result = await authenticatedPost<{
        success: boolean;
        premiumType: 'monthly' | 'lifetime';
        expiryDate: string | null;
      }>('/api/premium/verify-code', { code });

      if (result.success) {
        let newPremiumStatus: PremiumStatus;
        if (result.premiumType === 'lifetime') {
          newPremiumStatus = { type: 'Lifetime', endDate: null };
          console.log('Lifetime premium activated via backend');
        } else {
          newPremiumStatus = { type: 'Monthly', endDate: result.expiryDate };
          console.log('Monthly premium activated via backend, expires:', result.expiryDate);
        }
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        return true;
      }
      return false;
    } catch (backendError) {
      console.warn('[API] Backend verify-code failed, falling back to local check:', backendError);
      // Fallback to local code check if backend is unavailable or user not authenticated
      const now = new Date();
      let newPremiumStatus: PremiumStatus;
      const normalizedCode = code.toLowerCase().trim();

      if (normalizedCode === 'easy2033') {
        newPremiumStatus = { type: 'Lifetime', endDate: null };
        console.log('Lifetime premium activated with local code: easy2033');
      } else if (normalizedCode === 'easy2') {
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        newPremiumStatus = { type: 'Monthly', endDate: oneMonthLater.toISOString() };
        console.log('1-month premium activated with local code: easy2');
      } else {
        console.log('Invalid premium code:', code);
        return false;
      }

      setPremiumStatus(newPremiumStatus);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        hasSeenWelcome,
        budgetName,
        months,
        activeMonthId,
        subscriptions,
        premiumStatus: newPremiumStatus,
      }));
      return true;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);

  const purchasePremium = useCallback(async (purchaseType: 'lifetime' | 'monthly', appleTransactionId?: string): Promise<boolean> => {
    console.log('[API] Requesting /api/premium/purchase...', purchaseType);
    try {
      const body: { purchaseType: 'lifetime' | 'monthly'; appleTransactionId?: string } = { purchaseType };
      if (appleTransactionId) {
        body.appleTransactionId = appleTransactionId;
      }
      const result = await authenticatedPost<{
        success: boolean;
        purchase: { id: string; purchaseType: string; expiryDate: string | null };
      }>('/api/premium/purchase', body);

      if (result.success) {
        let newPremiumStatus: PremiumStatus;
        if (purchaseType === 'lifetime') {
          newPremiumStatus = { type: 'Lifetime', endDate: null };
        } else {
          newPremiumStatus = { type: 'Monthly', endDate: result.purchase.expiryDate, hasAppleSubscription: true };
        }
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        console.log('Premium purchase successful:', purchaseType);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[API] Premium purchase failed:', error);
      throw error;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);

  const fetchPremiumStatus = useCallback(async (): Promise<void> => {
    console.log('[API] Requesting /api/premium/status...');
    try {
      const result = await authenticatedGet<{
        isPremium: boolean;
        type: 'none' | 'lifetime' | 'monthly';
        expiryDate: string | null;
      }>('/api/premium/status');

      if (result.type === 'lifetime') {
        const newPremiumStatus: PremiumStatus = { type: 'Lifetime', endDate: null };
        setPremiumStatus(newPremiumStatus);
      } else if (result.type === 'monthly' && result.isPremium) {
        const newPremiumStatus: PremiumStatus = { type: 'Monthly', endDate: result.expiryDate, hasAppleSubscription: true };
        setPremiumStatus(newPremiumStatus);
      }
      // If 'none' or not premium, keep local status (trial, etc.) unchanged
      console.log('Premium status fetched from backend:', result);
    } catch (error) {
      console.warn('[API] Could not fetch premium status from backend (user may not be authenticated):', error);
    }
  }, []);

  const cancelPremium = useCallback(async (): Promise<boolean> => {
    console.log('[API] Requesting DELETE /api/premium/cancel...');
    try {
      const result = await authenticatedDelete<{ success: boolean }>('/api/premium/cancel');
      if (result.success) {
        const newPremiumStatus: PremiumStatus = { type: 'None', endDate: null };
        setPremiumStatus(newPremiumStatus);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          hasSeenWelcome,
          budgetName,
          months,
          activeMonthId,
          subscriptions,
          premiumStatus: newPremiumStatus,
        }));
        console.log('Premium subscription cancelled');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[API] Cancel premium failed:', error);
      throw error;
    }
  }, [hasSeenWelcome, budgetName, months, activeMonthId, subscriptions]);
>>>>>>> origin/main

      if (response.success) {
        let newPremiumStatus: PremiumStatus;
        if (purchaseType === 'lifetime') {
          newPremiumStatus = { type: 'Lifetime', endDate: null, hasAppleSubscription: true };
          console.log('[Premium] Lifetime purchase created successfully');
        } else {
          newPremiumStatus = { type: 'Monthly', endDate: response.purchase.expiryDate, hasAppleSubscription: true };
          console.log('[Premium] Monthly purchase created, expires:', response.purchase.expiryDate);
        }
        setPremiumStatus(newPremiumStatus);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Premium] Failed to create purchase:', error);
      throw error;
    }
  }, []);

  const fetchPremiumStatus = useCallback(async (): Promise<void> => {
    console.log('[Premium] Fetching premium status from backend...');
    try {
      const response = await authenticatedGet<{
        isPremium: boolean;
        type: 'none' | 'lifetime' | 'monthly';
        expiryDate: string | null;
      }>('/api/premium/status');

      console.log('[Premium] Backend status:', response);

      if (!response.isPremium || response.type === 'none') {
        // Don't override local trial status with backend "none"
        // Only update if we have a real backend premium status
        return;
      }

      let newPremiumStatus: PremiumStatus;
      if (response.type === 'lifetime') {
        newPremiumStatus = { type: 'Lifetime', endDate: null, hasAppleSubscription: true };
      } else {
        newPremiumStatus = { type: 'Monthly', endDate: response.expiryDate, hasAppleSubscription: true };
      }
      setPremiumStatus(newPremiumStatus);
      console.log('[Premium] Premium status synced from backend:', newPremiumStatus);
    } catch (error) {
      console.warn('[Premium] Could not fetch premium status from backend (user may not be logged in):', error);
    }
  }, []);

  const cancelPremium = useCallback(async (): Promise<boolean> => {
    console.log('[Premium] Cancelling premium subscription via backend...');
    try {
      const response = await authenticatedDelete<{ success: boolean }>('/api/premium/cancel');
      if (response.success) {
        setPremiumStatus({ type: 'None', endDate: null, hasAppleSubscription: false });
        console.log('[Premium] Premium subscription cancelled successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Premium] Failed to cancel premium:', error);
      throw error;
    }
  }, []);

  const addMonth = (name: string, budgetAmount: number) => {
    const newMonth: Month = {
      id: Date.now().toString(),
      name,
      budgetAmount: 0,
      expenses: [],
      isPinned: false,
    };
    setMonths([...months, newMonth]);
    console.log('Month added:', name, 'with budget:', budgetAmount);
  };

  const deleteMonth = (id: string) => {
    if (months.length <= 1) {
      console.log('Cannot delete last month');
      return;
    }
    const updatedMonths = months.filter(m => m.id !== id);
    setMonths(updatedMonths);
    if (activeMonthId === id && updatedMonths.length > 0) {
      setActiveMonthId(updatedMonths[0].id);
    }
    console.log('Month deleted:', id);
  };

  const duplicateMonth = (id: string) => {
    const monthToDuplicate = months.find(m => m.id === id);
    if (monthToDuplicate) {
      const newMonth: Month = {
        ...monthToDuplicate,
        id: Date.now().toString(),
        name: monthToDuplicate.name + ' *',
        expenses: monthToDuplicate.expenses.map(e => ({
          ...e,
          id: Date.now().toString() + Math.random().toString(),
        })),
      };
      setMonths([...months, newMonth]);
      console.log('Month duplicated:', monthToDuplicate.name);
    }
  };

  const renameMonth = (id: string, newName: string) => {
    setMonths(months.map(m => m.id === id ? { ...m, name: newName } : m));
    console.log('Month renamed:', id, newName);
  };

  const togglePinMonth = (id: string) => {
    setMonths(months.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
    console.log('Month pin toggled:', id);
  };

  const updateMonthBudget = (id: string, budgetAmount: number) => {
    setMonths(months.map(m => m.id === id ? { ...m, budgetAmount } : m));
    console.log('Month budget updated:', id, budgetAmount);
  };

  const addExpense = (monthId: string, name: string, amount: number) => {
    setMonths(months.map(m => {
      if (m.id === monthId) {
        const newExpense: Expense = {
          id: Date.now().toString(),
          name,
          amount,
          isPinned: false,
        };
        return { ...m, expenses: [...m.expenses, newExpense] };
      }
      return m;
    }));
    console.log('Expense added to month:', monthId, name, amount);
  };

  const deleteExpense = (monthId: string, expenseId: string) => {
    setMonths(months.map(m => {
      if (m.id === monthId) {
        return { ...m, expenses: m.expenses.filter(e => e.id !== expenseId) };
      }
      return m;
    }));
    console.log('Expense deleted:', expenseId);
  };

  const updateExpense = (monthId: string, expenseId: string, name: string, amount: number) => {
    setMonths(months.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          expenses: m.expenses.map(e => e.id === expenseId ? { ...e, name, amount } : e),
        };
      }
      return m;
    }));
    console.log('Expense updated:', expenseId, name, amount);
  };

  const duplicateExpense = (monthId: string, expenseId: string) => {
    setMonths(months.map(m => {
      if (m.id === monthId) {
        const expenseToDuplicate = m.expenses.find(e => e.id === expenseId);
        if (expenseToDuplicate) {
          const newExpense: Expense = {
            ...expenseToDuplicate,
            id: Date.now().toString(),
            name: expenseToDuplicate.name + ' *',
          };
          return { ...m, expenses: [...m.expenses, newExpense] };
        }
      }
      return m;
    }));
    console.log('Expense duplicated:', expenseId);
  };

  const togglePinExpense = (monthId: string, expenseId: string) => {
    setMonths(months.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          expenses: m.expenses.map(e => e.id === expenseId ? { ...e, isPinned: !e.isPinned } : e),
        };
      }
      return m;
    }));
    console.log('Expense pin toggled:', expenseId);
  };

  const addSubscription = (name: string, amount: number) => {
    const newSub: Subscription = {
      id: Date.now().toString(),
      name,
      amount,
      isPinned: false,
    };
    setSubscriptions([...subscriptions, newSub]);
    console.log('Subscription added:', name, amount);
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
    console.log('Subscription deleted:', id);
  };

  const updateSubscription = (id: string, name: string, amount: number) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, name, amount } : s));
    console.log('Subscription updated:', id, name, amount);
  };

  const duplicateSubscription = (id: string) => {
    const subToDuplicate = subscriptions.find(s => s.id === id);
    if (subToDuplicate) {
      const newSub: Subscription = {
        ...subToDuplicate,
        id: Date.now().toString(),
        name: subToDuplicate.name + ' *',
      };
      setSubscriptions([...subscriptions, newSub]);
      console.log('Subscription duplicated:', subToDuplicate.name);
    }
  };

  const togglePinSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    console.log('Subscription pin toggled:', id);
  };

  return (
    <BudgetContext.Provider
      value={{
        hasSeenWelcome,
        setHasSeenWelcome,
        budgetName,
        setBudgetName,
        months,
        setMonths,
        activeMonthId,
        setActiveMonthId,
        subscriptions,
        setSubscriptions,
        premiumStatus,
        setPremiumStatus,
        applyPremiumCode,
        purchasePremium,
        fetchPremiumStatus,
        cancelPremium,
        addMonth,
        deleteMonth,
        duplicateMonth,
        renameMonth,
        togglePinMonth,
        updateMonthBudget,
        addExpense,
        deleteExpense,
        updateExpense,
        duplicateExpense,
        togglePinExpense,
        addSubscription,
        deleteSubscription,
        updateSubscription,        duplicateSubscription,
        togglePinSubscription,
        loadData,
        saveData,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
