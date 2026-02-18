
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
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

  const [showMonthOptionsModal, setShowMonthOptionsModal] = useState(false);
  const [selectedMonthId, setSelectedMonthId] = useState('');

  const [showExpenseOptionsModal, setShowExpenseOptionsModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState('');

  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [newMonthName, setNewMonthName] = useState('');

  const [showRenameMonthModal, setShowRenameMonthModal] = useState(false);
  const [renameMonthValue, setRenameMonthValue] = useState('');

  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editExpenseName, setEditExpenseName] = useState('');
  const [editExpenseAmount, setEditExpenseAmount] = useState('');

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

  const handleLongPressMonth = (monthId: string) => {
    console.log('Month long pressed:', monthId);
    setSelectedMonthId(monthId);
    setShowMonthOptionsModal(true);
  };

  const handleMonthDuplicate = () => {
    duplicateMonth(selectedMonthId);
    setShowMonthOptionsModal(false);
  };

  const handleMonthRename = () => {
    const month = months.find(m => m.id === selectedMonthId);
    if (month) {
      setRenameMonthValue(month.name);
      setShowMonthOptionsModal(false);
      setShowRenameMonthModal(true);
    }
  };

  const submitRenameMonth = () => {
    if (renameMonthValue.trim()) {
      renameMonth(selectedMonthId, renameMonthValue.trim());
      setShowRenameMonthModal(false);
      console.log('Month renamed:', renameMonthValue);
    }
  };

  const handleMonthTogglePin = () => {
    togglePinMonth(selectedMonthId);
    setShowMonthOptionsModal(false);
  };

  const handleMonthDelete = () => {
    if (months.length <= 1) {
      setShowMonthOptionsModal(false);
      return;
    }
    deleteMonth(selectedMonthId);
    setShowMonthOptionsModal(false);
  };

  const handleLongPressExpense = (expenseId: string) => {
    console.log('Expense long pressed:', expenseId);
    setSelectedExpenseId(expenseId);
    setShowExpenseOptionsModal(true);
  };

  const handleExpenseEdit = () => {
    const expense = activeMonth?.expenses.find(e => e.id === selectedExpenseId);
    if (expense) {
      setEditExpenseName(expense.name);
      setEditExpenseAmount(expense.amount.toString());
      setShowExpenseOptionsModal(false);
      setShowEditExpenseModal(true);
    }
  };

  const submitEditExpense = () => {
    const amount = parseFloat(editExpenseAmount);
    if (editExpenseName.trim() && !isNaN(amount) && amount >= 0 && activeMonthId) {
      updateExpense(activeMonthId, selectedExpenseId, editExpenseName.trim(), amount);
      setShowEditExpenseModal(false);
      console.log('Expense updated:', editExpenseName, amount);
    }
  };

  const handleExpenseDuplicate = () => {
    if (activeMonthId) {
      duplicateExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
    }
  };

  const handleExpenseTogglePin = () => {
    if (activeMonthId) {
      togglePinExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
    }
  };

  const handleExpenseDelete = () => {
    if (activeMonthId) {
      deleteExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
    }
  };

  const handleAddMonth = () => {
    console.log('Add month button pressed');
    setShowAddMonthModal(true);
  };

  const submitAddMonth = () => {
    if (newMonthName.trim()) {
      addMonth(newMonthName.trim());
      setNewMonthName('');
      setShowAddMonthModal(false);
      console.log('Month added:', newMonthName);
    }
  };

  const remainingColor = remaining >= 0 ? '#34C759' : '#FF3B30';
  const remainingText = remaining >= 0 ? remaining.toFixed(2) : `${remaining.toFixed(2)}`;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
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
              <Text style={styles.budgetName}>{budgetName}</Text>
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
              <Text style={styles.budgetAmount}>CHF {budgetAmount.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryBubble}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>CHF {totalExpenses.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Bleibt</Text>
            <Text style={[styles.summaryValue, { color: remainingColor }]}>
              CHF {remainingText}
            </Text>
          </View>
        </View>

        <View style={styles.monthsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthsScroll}>
            <TouchableOpacity style={styles.addMonthButton} onPress={handleAddMonth}>
              <IconSymbol android_material_icon_name="add" size={24} color="#34C759" />
            </TouchableOpacity>

            {months.map((month) => {
              const isActive = month.id === activeMonthId;
              const monthStyle = isActive ? styles.monthChipActive : styles.monthChip;
              const monthTextStyle = isActive ? styles.monthTextActive : styles.monthText;

              return (
                <TouchableOpacity
                  key={month.id}
                  style={[monthStyle, month.isPinned && styles.monthChipPinned]}
                  onPress={() => {
                    setActiveMonthId(month.id);
                    console.log('Active month changed:', month.name);
                  }}
                  onLongPress={() => handleLongPressMonth(month.id)}
                >
                  <Text style={monthTextStyle}>{month.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.expensesSection}>
          {activeMonth?.expenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={[styles.expenseCard, expense.isPinned && styles.expenseCardPinned]}
              onLongPress={() => handleLongPressExpense(expense.id)}
            >
              <View style={styles.expenseContent}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseAmount}>CHF {expense.amount.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  if (activeMonthId) {
                    deleteExpense(activeMonthId, expense.id);
                    console.log('Expense deleted via X button:', expense.id);
                  }
                }}
              >
                <IconSymbol android_material_icon_name="close" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddExpense}>
        <IconSymbol android_material_icon_name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

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
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.inputLabel}>Betrag (CHF)</Text>
            <TextInput
              style={styles.input}
              value={newExpenseAmount}
              onChangeText={setNewExpenseAmount}
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
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
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMonthOptionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Monat Optionen</Text>
            <TouchableOpacity onPress={() => setShowMonthOptionsModal(false)}>
              <Text style={styles.modalCloseText}>Schliessen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContent}>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthDuplicate}>
              <Text style={styles.optionButtonText}>Duplizieren</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthTogglePin}>
              <Text style={styles.optionButtonText}>
                {months.find(m => m.id === selectedMonthId)?.isPinned ? 'Fixierung aufheben' : 'Fixieren'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthRename}>
              <Text style={styles.optionButtonText}>Umbenennen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, months.length <= 1 && styles.optionButtonDisabled]}
              onPress={handleMonthDelete}
              disabled={months.length <= 1}
            >
              <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>Löschen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showExpenseOptionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExpenseOptionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ausgabe Optionen</Text>
            <TouchableOpacity onPress={() => setShowExpenseOptionsModal(false)}>
              <Text style={styles.modalCloseText}>Schliessen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsContent}>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseEdit}>
              <Text style={styles.optionButtonText}>Bearbeiten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseDuplicate}>
              <Text style={styles.optionButtonText}>Duplizieren</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseTogglePin}>
              <Text style={styles.optionButtonText}>
                {activeMonth?.expenses.find(e => e.id === selectedExpenseId)?.isPinned ? 'Fixierung aufheben' : 'Fixieren'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseDelete}>
              <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>Löschen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddMonthModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddMonthModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Neuer Monat</Text>
            <TouchableOpacity onPress={() => setShowAddMonthModal(false)}>
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={newMonthName}
              onChangeText={setNewMonthName}
              placeholder="z.B. Januar 2024"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitAddMonth}>
              <Text style={styles.submitButtonText}>Hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </View>
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
            <Text style={styles.inputLabel}>Neuer Name</Text>
            <TextInput
              style={styles.input}
              value={renameMonthValue}
              onChangeText={setRenameMonthValue}
              placeholder="Monat Name"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitRenameMonth}>
              <Text style={styles.submitButtonText}>Speichern</Text>
            </TouchableOpacity>
          </View>
        </View>
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
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.inputLabel}>Betrag (CHF)</Text>
            <TextInput
              style={styles.input}
              value={editExpenseAmount}
              onChangeText={setEditExpenseAmount}
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitEditExpense}>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  budgetNameInput: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#34C759',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  budgetAmount: {
    fontSize: 24,
    color: '#34C759',
    fontWeight: '600',
  },
  budgetAmountInput: {
    fontSize: 24,
    color: '#34C759',
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#34C759',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  summaryBubble: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3A3A3C',
  },
  monthsSection: {
    marginBottom: 20,
  },
  monthsScroll: {
    flexDirection: 'row',
  },
  addMonthButton: {
    width: 50,
    height: 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  monthChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  monthChipActive: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#34C759',
  },
  monthChipPinned: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  monthText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  monthTextActive: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  expensesSection: {
    marginBottom: 20,
  },
  expenseCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  expenseCardPinned: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  expenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  bottomSpacer: {
    height: 120,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#34C759',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionsContent: {
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  optionButtonTextDanger: {
    color: '#FF3B30',
  },
});
