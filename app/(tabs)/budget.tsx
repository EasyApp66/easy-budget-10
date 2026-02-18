
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useBudget } from '@/contexts/BudgetContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function BudgetScreen() {
  const {
    budgetName,
    setBudgetName,
    budgetAmount,
    setBudgetAmount,
    months,
    activeMonthId,
    setActiveMonthId,
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
  } = useBudget();

  const [editingBudgetName, setEditingBudgetName] = useState(false);
  const [editingBudgetAmount, setEditingBudgetAmount] = useState(false);
  const [tempBudgetName, setTempBudgetName] = useState(budgetName);
  const [tempBudgetAmount, setTempBudgetAmount] = useState(budgetAmount.toString());

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  const activeMonth = months.find(m => m.id === activeMonthId);
  const totalExpenses = activeMonth?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  const remaining = budgetAmount - totalExpenses;

  const saveBudgetName = () => {
    if (tempBudgetName.trim()) {
      setBudgetName(tempBudgetName.trim());
      console.log('Budget name saved:', tempBudgetName);
    }
    setEditingBudgetName(false);
  };

  const saveBudgetAmount = () => {
    const amount = parseFloat(tempBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setBudgetAmount(amount);
      console.log('Budget amount saved:', amount);
    }
    setEditingBudgetAmount(false);
  };

  const handleAddExpense = () => {
    console.log('Add expense button pressed');
    setShowAddExpenseModal(true);
  };

  const submitAddExpense = () => {
    const amount = parseFloat(newExpenseAmount);
    if (newExpenseName.trim() && !isNaN(amount) && amount >= 0 && activeMonthId) {
      addExpense(activeMonthId, newExpenseName.trim(), amount);
      setNewExpenseName('');
      setNewExpenseAmount('');
      setShowAddExpenseModal(false);
      console.log('Expense added:', newExpenseName, amount);
    }
  };

  const remainingColor = remaining >= 0 ? '#9FE870' : '#FF3B30';
  const totalText = totalExpenses.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const remainingText = Math.abs(remaining).toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const budgetText = budgetAmount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.budgetHeader}>
          {editingBudgetName ? (
            <TextInput
              style={styles.budgetNameInput}
              value={tempBudgetName}
              onChangeText={setTempBudgetName}
              onBlur={saveBudgetName}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity onPress={() => {
              setTempBudgetName(budgetName);
              setEditingBudgetName(true);
            }}>
              <Text style={styles.budgetLabel}>BUDGET</Text>
            </TouchableOpacity>
          )}

          {editingBudgetAmount ? (
            <TextInput
              style={styles.budgetAmountInput}
              value={tempBudgetAmount}
              onChangeText={setTempBudgetAmount}
              onBlur={saveBudgetAmount}
              keyboardType="decimal-pad"
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity onPress={() => {
              setTempBudgetAmount(budgetAmount.toString());
              setEditingBudgetAmount(true);
            }}>
              <Text style={styles.budgetAmount}>{budgetText.replace(/\s/g, "'")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL</Text>
            <Text style={styles.summaryValue}>{totalText.replace(/\s/g, "'")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>BLEIBT</Text>
            <Text style={[styles.summaryValue, { color: remainingColor }]}>
              {remaining < 0 ? '-' : ''}{remainingText.replace(/\s/g, "'")}
            </Text>
          </View>
        </View>

        <View style={styles.addButtonRow}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={28} color="#000000" />
          </TouchableOpacity>
        </View>

        <View style={styles.expensesSection}>
          {activeMonth?.expenses.map((expense, index) => (
            <React.Fragment key={expense.id}>
            <View
              style={[styles.expenseCard, expense.isPinned && styles.expenseCardPinned]}
            >
              <View style={styles.expenseContent}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    if (activeMonthId) {
                      deleteExpense(activeMonthId, expense.id);
                      console.log('Expense deleted:', expense.id);
                    }
                  }}
                >
                  <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <Text style={styles.expenseAmount}>{expense.amount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
            </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showAddExpenseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Neue Ausgabe</Text>
            <TouchableOpacity onPress={() => setShowAddExpenseModal(false)}>
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={newExpenseName}
              onChangeText={setNewExpenseName}
              placeholder="z.B. Lebensmittel"
              placeholderTextColor="#666666"
            />
            <Text style={styles.inputLabel}>Betrag</Text>
            <TextInput
              style={styles.input}
              value={newExpenseAmount}
              onChangeText={setNewExpenseAmount}
              placeholder="0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitAddExpense}>
              <Text style={styles.submitButtonText}>Hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  budgetHeader: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  budgetNameInput: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#9FE870',
    paddingHorizontal: 5,
  },
  budgetAmount: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  budgetAmountInput: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#9FE870',
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  summaryCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButtonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9FE870',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expensesSection: {
    marginBottom: 20,
  },
  expenseCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  expenseCardPinned: {
    borderWidth: 2,
    borderColor: '#9FE870',
  },
  expenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  expenseName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  expenseAmount: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 120,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#9FE870',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#9FE870',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});
