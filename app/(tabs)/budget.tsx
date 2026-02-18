
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { useBudget } from '@/contexts/BudgetContext';
import { IconSymbol } from '@/components/IconSymbol';
import { useLocalSearchParams } from 'expo-router';

export default function BudgetScreen() {
  const params = useLocalSearchParams();
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

  const [showMonthOptionsModal, setShowMonthOptionsModal] = useState(false);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  const [showRenameMonthModal, setShowRenameMonthModal] = useState(false);
  const [tempMonthName, setTempMonthName] = useState('');

  const [showExpenseOptionsModal, setShowExpenseOptionsModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editExpenseName, setEditExpenseName] = useState('');
  const [editExpenseAmount, setEditExpenseAmount] = useState('');

  useEffect(() => {
    if (params.triggerAdd) {
      handleAddExpense();
    }
  }, [params.triggerAdd]);

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

  const handleAddMonth = () => {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    addMonth(monthName);
    console.log('New month added');
  };

  const handleMonthLongPress = (monthId: string) => {
    setSelectedMonthId(monthId);
    setShowMonthOptionsModal(true);
    console.log('Month long pressed:', monthId);
  };

  const handleMonthRename = () => {
    if (selectedMonthId) {
      const month = months.find(m => m.id === selectedMonthId);
      if (month) {
        setTempMonthName(month.name);
        setShowMonthOptionsModal(false);
        setShowRenameMonthModal(true);
      }
    }
  };

  const submitMonthRename = () => {
    if (selectedMonthId && tempMonthName.trim()) {
      renameMonth(selectedMonthId, tempMonthName.trim());
      setShowRenameMonthModal(false);
      setSelectedMonthId(null);
      console.log('Month renamed:', tempMonthName);
    }
  };

  const handleMonthDuplicate = () => {
    if (selectedMonthId) {
      duplicateMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month duplicated');
    }
  };

  const handleMonthTogglePin = () => {
    if (selectedMonthId) {
      togglePinMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month pin toggled');
    }
  };

  const handleMonthDelete = () => {
    if (selectedMonthId) {
      deleteMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month deleted');
    }
  };

  const handleExpenseLongPress = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowExpenseOptionsModal(true);
    console.log('Expense long pressed:', expenseId);
  };

  const handleExpenseEdit = () => {
    if (selectedExpenseId && activeMonth) {
      const expense = activeMonth.expenses.find(e => e.id === selectedExpenseId);
      if (expense) {
        setEditExpenseName(expense.name);
        setEditExpenseAmount(expense.amount.toString());
        setShowExpenseOptionsModal(false);
        setShowEditExpenseModal(true);
      }
    }
  };

  const submitExpenseEdit = () => {
    const amount = parseFloat(editExpenseAmount);
    if (selectedExpenseId && activeMonthId && editExpenseName.trim() && !isNaN(amount) && amount >= 0) {
      updateExpense(activeMonthId, selectedExpenseId, editExpenseName.trim(), amount);
      setShowEditExpenseModal(false);
      setSelectedExpenseId(null);
      console.log('Expense updated:', editExpenseName, amount);
    }
  };

  const handleExpenseDuplicate = () => {
    if (selectedExpenseId && activeMonthId) {
      duplicateExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
      setSelectedExpenseId(null);
      console.log('Expense duplicated');
    }
  };

  const handleExpenseTogglePin = () => {
    if (selectedExpenseId && activeMonthId) {
      togglePinExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
      setSelectedExpenseId(null);
      console.log('Expense pin toggled');
    }
  };

  const remainingColor = remaining >= 0 ? '#BFFE84' : '#FF3B30';
  const totalText = totalExpenses.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const remainingText = Math.abs(remaining).toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const budgetText = budgetAmount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const selectedMonth = selectedMonthId ? months.find(m => m.id === selectedMonthId) : null;
  const selectedExpense = selectedExpenseId && activeMonth ? activeMonth.expenses.find(e => e.id === selectedExpenseId) : null;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        <View style={styles.monthsRow}>
          <TouchableOpacity style={styles.addMonthButton} onPress={handleAddMonth}>
            <IconSymbol android_material_icon_name="add" ios_icon_name="plus" size={24} color="#000000" />
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            style={styles.monthsScroll} 
            contentContainerStyle={styles.monthsScrollContent}
            showsHorizontalScrollIndicator={false}
          >
            {months.map((month, index) => {
              const isActive = month.id === activeMonthId;
              return (
                <React.Fragment key={month.id}>
                <Pressable
                  onPress={() => {
                    setActiveMonthId(month.id);
                    console.log('Month selected:', month.name);
                  }}
                  onLongPress={() => handleMonthLongPress(month.id)}
                  style={[
                    styles.monthPill,
                    isActive && styles.monthPillActive,
                    month.isPinned && styles.monthPillPinned,
                  ]}
                >
                  <Text style={[styles.monthPillText, isActive && styles.monthPillTextActive]}>
                    {month.name}
                  </Text>
                </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.expensesSection}>
          {activeMonth?.expenses.map((expense, index) => {
            const isLeftColumn = index % 2 === 0;
            return (
              <React.Fragment key={expense.id}>
              <Pressable
                onLongPress={() => handleExpenseLongPress(expense.id)}
                style={[
                  styles.expenseCard,
                  expense.isPinned && styles.expenseCardPinned,
                  isLeftColumn ? styles.expenseCardLeft : styles.expenseCardRight,
                ]}
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
                    <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.expenseAmount}>{expense.amount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
              </Pressable>
              </React.Fragment>
            );
          })}
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
            <Text style={styles.inputLabel}>Name (z.B. ESSEN)</Text>
            <TextInput
              style={styles.input}
              value={newExpenseName}
              onChangeText={setNewExpenseName}
              placeholder="z.B. ESSEN"
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

      <Modal
        visible={showMonthOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthOptionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMonthOptionsModal(false)}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{selectedMonth?.name}</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthRename}>
              <Text style={styles.optionButtonText}>Namen anpassen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthDuplicate}>
              <Text style={styles.optionButtonText}>Duplizieren</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthTogglePin}>
              <Text style={styles.optionButtonText}>
                {selectedMonth?.isPinned ? 'Lösen' : 'Fixieren'}
              </Text>
            </TouchableOpacity>
            {months.length > 1 && (
              <TouchableOpacity style={[styles.optionButton, styles.optionButtonDanger]} onPress={handleMonthDelete}>
                <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>Löschen</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showRenameMonthModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRenameMonthModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Monat umbenennen</Text>
            <TouchableOpacity onPress={() => setShowRenameMonthModal(false)}>
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={tempMonthName}
              onChangeText={setTempMonthName}
              placeholder="Monatsname"
              placeholderTextColor="#666666"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitMonthRename}>
              <Text style={styles.submitButtonText}>Speichern</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showExpenseOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExpenseOptionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowExpenseOptionsModal(false)}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{selectedExpense?.name}</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseEdit}>
              <Text style={styles.optionButtonText}>Namen anpassen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseEdit}>
              <Text style={styles.optionButtonText}>Zahl anpassen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseDuplicate}>
              <Text style={styles.optionButtonText}>Duplizieren</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseTogglePin}>
              <Text style={styles.optionButtonText}>
                {selectedExpense?.isPinned ? 'Lösen' : 'Fixieren'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showEditExpenseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditExpenseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ausgabe bearbeiten</Text>
            <TouchableOpacity onPress={() => setShowEditExpenseModal(false)}>
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editExpenseName}
              onChangeText={setEditExpenseName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            <Text style={styles.inputLabel}>Betrag</Text>
            <TextInput
              style={styles.input}
              value={editExpenseAmount}
              onChangeText={setEditExpenseAmount}
              placeholder="0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitExpenseEdit}>
              <Text style={styles.submitButtonText}>Speichern</Text>
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
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  budgetNameInput: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#BFFE84',
    paddingHorizontal: 5,
  },
  budgetAmount: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  budgetAmountInput: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#BFFE84',
    paddingHorizontal: 5,
    textAlign: 'right',
  },
  summaryCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  monthsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  addMonthButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#BFFE84',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  monthsScroll: {
    flex: 1,
  },
  monthsScrollContent: {
    paddingRight: 20,
  },
  monthPill: {
    backgroundColor: '#2C2C2E',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginRight: 12,
  },
  monthPillActive: {
    backgroundColor: '#BFFE84',
  },
  monthPillPinned: {
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  monthPillText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  monthPillTextActive: {
    color: '#000000',
  },
  expensesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  expenseCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    width: '48%',
  },
  expenseCardLeft: {
    marginRight: '2%',
  },
  expenseCardRight: {
    marginLeft: '2%',
  },
  expenseCardPinned: {
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  expenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  expenseName: {
    fontSize: 14,
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
    fontSize: 28,
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
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalCloseText: {
    fontSize: 17,
    color: '#BFFE84',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 18,
    fontSize: 17,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  optionsTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  optionButtonTextDanger: {
    color: '#FFFFFF',
  },
});
