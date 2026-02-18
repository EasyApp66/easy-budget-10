
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export interface Month {
  id: string;
  name: string;
  expenses: Expense[];
  isPinned: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

interface BudgetContextType {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
  budgetName: string;
  setBudgetName: (name: string) => void;
  budgetAmount: number;
  setBudgetAmount: (amount: number) => void;
  months: Month[];
  setMonths: (months: Month[]) => void;
  activeMonthId: string;
  setActiveMonthId: (id: string) => void;
  subscriptions: Subscription[];
  setSubscriptions: (subs: Subscription[]) => void;
  addMonth: (name: string) => void;
  deleteMonth: (id: string) => void;
  duplicateMonth: (id: string) => void;
  renameMonth: (id: string, newName: string) => void;
  togglePinMonth: (id: string) => void;
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
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [months, setMonths] = useState<Month[]>([]);
  const [activeMonthId, setActiveMonthId] = useState('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = async () => {
    try {
      console.log('Loading budget data from AsyncStorage...');
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        console.log('Data loaded successfully:', data);
        setHasSeenWelcome(data.hasSeenWelcome || false);
        setBudgetName(data.budgetName || 'Budget');
        setBudgetAmount(data.budgetAmount || 0);
        setMonths(data.months || []);
        setActiveMonthId(data.activeMonthId || '');
        setSubscriptions(data.subscriptions || []);
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
  };

  const saveData = async () => {
    try {
      const data = {
        hasSeenWelcome,
        budgetName,
        budgetAmount,
        months,
        activeMonthId,
        subscriptions,
      };
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Budget data saved successfully');
    } catch (e) {
      console.error('Error saving budget data:', e);
    }
  };

  const initializeDefaultData = () => {
    const currentDate = new Date();
    const currentMonthName = currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthName = nextMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

    const month1: Month = {
      id: Date.now().toString(),
      name: currentMonthName,
      isPinned: false,
      expenses: [],
    };

    const month2: Month = {
      id: (Date.now() + 1).toString(),
      name: nextMonthName,
      isPinned: false,
      expenses: [],
    };

    setMonths([month1, month2]);
    setActiveMonthId(month1.id);
    setBudgetAmount(0);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [hasSeenWelcome, budgetName, budgetAmount, months, activeMonthId, subscriptions, isLoaded]);

  const addMonth = (name: string) => {
    const newMonth: Month = {
      id: Date.now().toString(),
      name,
      expenses: [],
      isPinned: false,
    };
    setMonths([...months, newMonth]);
    console.log('Month added:', name);
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
        name: monthToDuplicate.name + ' (Kopie)',
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
            name: expenseToDuplicate.name + ' (Kopie)',
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
        name: subToDuplicate.name + ' (Kopie)',
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
        budgetAmount,
        setBudgetAmount,
        months,
        setMonths,
        activeMonthId,
        setActiveMonthId,
        subscriptions,
        setSubscriptions,
        addMonth,
        deleteMonth,
        duplicateMonth,
        renameMonth,
        togglePinMonth,
        addExpense,
        deleteExpense,
        updateExpense,
        duplicateExpense,
        togglePinExpense,
        addSubscription,
        deleteSubscription,
        updateSubscription,
        duplicateSubscription,
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
