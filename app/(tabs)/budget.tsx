
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
  Animated,
} from 'react-native';
import { useBudget } from '@/contexts/BudgetContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function BudgetScreen() {
  const params = useLocalSearchParams();
  const { t } = useLanguage();
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

  const [monthCounter, setMonthCounter] = useState(1);

  useEffect(() => {
    if (params.triggerAdd) {
      console.log('triggerAdd detected, opening modal');
      handleAddExpense();
    }
  }, [params.triggerAdd]);

  const activeMonth = months.find(m => m.id === activeMonthId);
  const totalExpenses = activeMonth?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  const remaining = budgetAmount - totalExpenses;

  const saveBudgetName = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tempBudgetName.trim()) {
      setBudgetName(tempBudgetName.trim());
      console.log('Budget name saved:', tempBudgetName);
    }
    setEditingBudgetName(false);
  };

  const saveBudgetAmount = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(tempBudgetAmount);
    if (!isNaN(amount) && amount >= 0) {
      setBudgetAmount(amount);
      console.log('Budget amount saved:', amount);
    }
    setEditingBudgetAmount(false);
  };

  const handleAddExpense = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Opening add expense modal');
    setShowAddExpenseModal(true);
  };

  const submitAddExpense = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(newExpenseAmount);
    if (newExpenseName.trim() && !isNaN(amount) && amount >= 0 && activeMonthId) {
      addExpense(activeMonthId, newExpenseName.trim(), amount);
      setNewExpenseName('');
      setNewExpenseAmount('');
      setShowAddExpenseModal(false);
      console.log('Expense added:', newExpenseName, amount);
    }
  };

  const handleAddMonth = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newMonthName = `Neu ${monthCounter}`;
    addMonth(newMonthName);
    setMonthCounter(monthCounter + 1);
    console.log('New month added:', newMonthName);
  };

  const handleMonthLongPress = async (monthId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMonthId(monthId);
    setShowMonthOptionsModal(true);
    console.log('Month long pressed:', monthId);
  };

  const handleMonthRename = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMonthId) {
      const month = months.find(m => m.id === selectedMonthId);
      if (month) {
        setTempMonthName(month.name);
        setShowMonthOptionsModal(false);
        setShowRenameMonthModal(true);
      }
    }
  };

  const submitMonthRename = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMonthId && tempMonthName.trim()) {
      renameMonth(selectedMonthId, tempMonthName.trim());
      setShowRenameMonthModal(false);
      setSelectedMonthId(null);
      console.log('Month renamed:', tempMonthName);
    }
  };

  const handleMonthDuplicate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMonthId) {
      duplicateMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month duplicated');
    }
  };

  const handleMonthTogglePin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMonthId) {
      togglePinMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month pin toggled');
    }
  };

  const handleMonthDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedMonthId) {
      deleteMonth(selectedMonthId);
      setShowMonthOptionsModal(false);
      setSelectedMonthId(null);
      console.log('Month deleted');
    }
  };

  const handleExpenseLongPress = async (expenseId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedExpenseId(expenseId);
    setShowExpenseOptionsModal(true);
    console.log('Expense long pressed:', expenseId);
  };

  const handleExpenseEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const submitExpenseEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(editExpenseAmount);
    if (selectedExpenseId && activeMonthId && editExpenseName.trim() && !isNaN(amount) && amount >= 0) {
      updateExpense(activeMonthId, selectedExpenseId, editExpenseName.trim(), amount);
      setShowEditExpenseModal(false);
      setSelectedExpenseId(null);
      console.log('Expense updated:', editExpenseName, amount);
    }
  };

  const handleExpenseDuplicate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedExpenseId && activeMonthId) {
      duplicateExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
      setSelectedExpenseId(null);
      console.log('Expense duplicated');
    }
  };

  const handleExpenseTogglePin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedExpenseId && activeMonthId) {
      togglePinExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
      setSelectedExpenseId(null);
      console.log('Expense pin toggled');
    }
  };

  const handleExpenseDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedExpenseId && activeMonthId) {
      deleteExpense(activeMonthId, selectedExpenseId);
      setShowExpenseOptionsModal(false);
      setSelectedExpenseId(null);
      console.log('Expense deleted');
    }
  };

  const remainingColor = remaining >= 0 ? '#BFFE84' : '#FF3B30';
  const totalText = totalExpenses.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const remainingText = Math.abs(remaining).toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const budgetText = budgetAmount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const selectedMonth = selectedMonthId ? months.find(m => m.id === selectedMonthId) : null;
  const selectedExpense = selectedExpenseId && activeMonth ? activeMonth.expenses.find(e => e.id === selectedExpenseId) : null;

  const sortedExpenses = activeMonth?.expenses ? [...activeMonth.expenses].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  }) : [];

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
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTempBudgetName(budgetName);
              setEditingBudgetName(true);
            }}>
              <Text style={styles.budgetLabel}>{t('budget')}</Text>
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
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTempBudgetAmount(budgetAmount.toString());
              setEditingBudgetAmount(true);
            }}>
              <Text style={styles.budgetAmount}>{budgetText.replace(/\s/g, "'")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('total')}</Text>
            <Text style={styles.summaryValue}>{totalText.replace(/\s/g, "'")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('remaining')}</Text>
            <Text style={[styles.summaryValue, { color: remainingColor }]}>
              {remaining < 0 ? '-' : ''}{remainingText.replace(/\s/g, "'")}
            </Text>
          </View>
        </View>

        <View style={styles.monthsRow}>
          <TouchableOpacity style={styles.addMonthButton} onPress={handleAddMonth} activeOpacity={0.7}>
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
              const monthNameOnly = month.name.split(' ')[0];
              return (
                <React.Fragment key={month.id}>
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                    {monthNameOnly.toUpperCase()}
                  </Text>
                  <TouchableOpacity
                    style={styles.monthDeleteButton}
                    onPress={async (e) => {
                      e.stopPropagation();
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (months.length > 1) {
                        deleteMonth(month.id);
                      }
                    }}
                  >
                    <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={16} color="#FF3B30" />
                  </TouchableOpacity>
                </Pressable>
                </React.Fragment>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.expensesSection}>
          {sortedExpenses.map((expense, index) => {
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
                <View style={styles.expenseHeader}>
                  <Text style={styles.expenseName}>{expense.name.toUpperCase()}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (activeMonthId) {
                        deleteExpense(activeMonthId, expense.id);
                        console.log('Expense deleted:', expense.id);
                      }
                    }}
                  >
                    <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={16} color="#FF3B30" />
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
        animationType="fade"
        transparent
        onRequestClose={() => setShowAddExpenseModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.compactModal}>
            <Text style={styles.compactModalTitle}>{t('newExpense')}</Text>
            
            <TextInput
              style={styles.compactInput}
              value={newExpenseName}
              onChangeText={setNewExpenseName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            
            <TextInput
              style={[styles.compactInput, { marginTop: 12 }]}
              value={newExpenseAmount}
              onChangeText={setNewExpenseAmount}
              placeholder="Betrag"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            
            <View style={styles.compactModalButtons}>
              <TouchableOpacity 
                style={styles.compactCancelButton} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAddExpenseModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactSubmitButton} 
                onPress={submitAddExpense}
                activeOpacity={0.8}
              >
                <Text style={styles.compactSubmitButtonText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMonthOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthOptionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowMonthOptionsModal(false);
        }}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{selectedMonth?.name}</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthRename} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('rename')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthDuplicate} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleMonthTogglePin} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>
                {selectedMonth?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            {months.length > 1 && (
              <TouchableOpacity style={[styles.optionButton, styles.optionButtonDanger]} onPress={handleMonthDelete} activeOpacity={0.7}>
                <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>{t('delete')}</Text>
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
            <Text style={styles.modalTitle}>{t('rename')}</Text>
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowRenameMonthModal(false);
            }}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>{t('nameExample')}</Text>
            <TextInput
              style={styles.input}
              value={tempMonthName}
              onChangeText={setTempMonthName}
              placeholder="Monatsname"
              placeholderTextColor="#666666"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitMonthRename} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>{t('save')}</Text>
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
        <Pressable style={styles.modalOverlay} onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowExpenseOptionsModal(false);
        }}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{selectedExpense?.name}</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseEdit} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('rename')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseEdit} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('adjustNumber')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseDuplicate} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleExpenseTogglePin} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>
                {selectedExpense?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('changeView')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, styles.optionButtonDanger]} onPress={handleExpenseDelete} activeOpacity={0.7}>
              <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>{t('delete')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowExpenseOptionsModal(false);
            }} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('cancel')}</Text>
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
            <Text style={styles.modalTitle}>{t('editExpense')}</Text>
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowEditExpenseModal(false);
            }}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>{t('nameExample')}</Text>
            <TextInput
              style={styles.input}
              value={editExpenseName}
              onChangeText={setEditExpenseName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            <Text style={styles.inputLabel}>{t('amount')}</Text>
            <TextInput
              style={styles.input}
              value={editExpenseAmount}
              onChangeText={setEditExpenseAmount}
              placeholder="0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitExpenseEdit} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>{t('save')}</Text>
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
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  budgetHeader: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
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
    minWidth: 100,
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
    paddingVertical: 8,
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontWeight: 'bold',
  },
  monthPillTextActive: {
    color: '#000000',
  },
  monthDeleteButton: {
    padding: 2,
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
    aspectRatio: 1,
    justifyContent: 'space-between',
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expenseName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  expenseAmount: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 120,
  },
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  compactModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 350,
  },
  compactModalTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  compactInput: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  compactModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  compactCancelButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  compactCancelButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  compactSubmitButton: {
    flex: 1,
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  compactSubmitButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
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
