
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
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS, withSequence } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function BudgetScreen() {
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const {
    budgetName,
    months,
    activeMonthId,
    setActiveMonthId,
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
  } = useBudget();

  const [editingBudgetAmount, setEditingBudgetAmount] = useState(false);
  const [tempBudgetAmount, setTempBudgetAmount] = useState('0');

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
  const [expenseViewMode, setExpenseViewMode] = useState<'grid' | 'list'>('grid');

  const [fadeAnims] = useState(() => ({
    header: new Animated.Value(0),
    summary: new Animated.Value(0),
    months: new Animated.Value(0),
    expenses: new Animated.Value(0),
  }));

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(fadeAnims.header, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.summary, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.months, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.expenses, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeMonthId]);

  useEffect(() => {
    if (params.triggerAdd) {
      console.log('triggerAdd detected, opening modal');
      handleAddExpense();
    }
  }, [params.triggerAdd]);

  const activeMonth = months.find(m => m.id === activeMonthId);
  const budgetAmount = activeMonth?.budgetAmount || 0;
  const totalExpenses = activeMonth?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
  const remaining = budgetAmount - totalExpenses;

  const saveBudgetAmount = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(tempBudgetAmount);
    if (!isNaN(amount) && amount >= 0 && activeMonthId) {
      updateMonthBudget(activeMonthId, amount);
      console.log('Budget amount saved for month:', amount);
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
    addMonth(newMonthName, 0);
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

  const handleChangeView = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpenseViewMode(expenseViewMode === 'grid' ? 'list' : 'grid');
    setShowExpenseOptionsModal(false);
    console.log('View mode changed to:', expenseViewMode === 'grid' ? 'list' : 'grid');
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
      <View style={styles.safeZone} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.budgetHeader, { opacity: fadeAnims.header }]}>
          <Text style={styles.budgetLabel}>{t('budget')}</Text>

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
        </Animated.View>

        <Animated.View style={[styles.summaryCard, { opacity: fadeAnims.summary }]}>
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
        </Animated.View>

        <Animated.View style={[styles.monthsRow, { opacity: fadeAnims.months }]}>
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
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnims.expenses }}>
          {expenseViewMode === 'grid' ? (
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
          ) : (
            <View style={styles.expensesListSection}>
              {sortedExpenses.map((expense) => {
                const expenseAmountText = expense.amount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                return (
                  <React.Fragment key={expense.id}>
                  <ExpenseListCard
                    expense={expense}
                    onDelete={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (activeMonthId) {
                        deleteExpense(activeMonthId, expense.id);
                        console.log('Expense deleted:', expense.id);
                      }
                    }}
                    onTogglePin={async () => {
                      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      if (activeMonthId) {
                        togglePinExpense(activeMonthId, expense.id);
                        console.log('Expense pin toggled:', expense.id);
                      }
                    }}
                    onLongPress={() => handleExpenseLongPress(expense.id)}
                  />
                  </React.Fragment>
                );
              })}
            </View>
          )}
        </Animated.View>

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
            <TouchableOpacity style={styles.optionButton} onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowMonthOptionsModal(false);
            }} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showRenameMonthModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowRenameMonthModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.compactModal}>
            <Text style={styles.compactModalTitle}>{t('rename')}</Text>
            
            <TextInput
              style={styles.compactInput}
              value={tempMonthName}
              onChangeText={setTempMonthName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            
            <View style={styles.compactModalButtons}>
              <TouchableOpacity 
                style={styles.compactCancelButton} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowRenameMonthModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactSubmitButton} 
                onPress={submitMonthRename}
                activeOpacity={0.8}
              >
                <Text style={styles.compactSubmitButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity style={styles.optionButton} onPress={handleChangeView} activeOpacity={0.7}>
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
        animationType="fade"
        transparent
        onRequestClose={() => setShowEditExpenseModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.compactModal}>
            <Text style={styles.compactModalTitle}>{t('editExpense')}</Text>
            
            <TextInput
              style={styles.compactInput}
              value={editExpenseName}
              onChangeText={setEditExpenseName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            
            <TextInput
              style={[styles.compactInput, { marginTop: 12 }]}
              value={editExpenseAmount}
              onChangeText={setEditExpenseAmount}
              placeholder="Betrag"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            
            <View style={styles.compactModalButtons}>
              <TouchableOpacity 
                style={styles.compactCancelButton} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowEditExpenseModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactSubmitButton} 
                onPress={submitExpenseEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.compactSubmitButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ExpenseListCard({
  expense,
  onDelete,
  onTogglePin,
  onLongPress,
}: {
  expense: { id: string; name: string; amount: number; isPinned: boolean };
  onDelete: () => void;
  onTogglePin: () => void;
  onLongPress: () => void;
}) {
  const translateX = useSharedValue(0);
  const deleteIconOpacity = useSharedValue(0);
  const pinIconOpacity = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
        deleteIconOpacity.value = withTiming(Math.min(Math.abs(event.translationX) / 100, 1), { duration: 150 });
        pinIconOpacity.value = withTiming(0, { duration: 150 });
      } else if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, 100);
        pinIconOpacity.value = withTiming(Math.min(event.translationX / 100, 1), { duration: 150 });
        deleteIconOpacity.value = withTiming(0, { duration: 150 });
      }
    })
    .onEnd((event) => {
      if (event.translationX < -80) {
        deleteIconOpacity.value = withSequence(
          withTiming(1, { duration: 150 }),
<<<<<<< HEAD
          withTiming(0, { duration: 400 })
        );
        translateX.value = withTiming(0, { duration: 400 });
=======
          withTiming(0, { duration: 250 })
        );
        translateX.value = withTiming(0, { duration: 250 });
>>>>>>> origin/main
        runOnJS(onDelete)();
      } else if (event.translationX > 80) {
        pinIconOpacity.value = withSequence(
          withTiming(1, { duration: 150 }),
<<<<<<< HEAD
          withTiming(0, { duration: 400 })
        );
        translateX.value = withTiming(0, { duration: 400 });
        runOnJS(onTogglePin)();
      } else {
        translateX.value = withTiming(0, { duration: 300 });
        deleteIconOpacity.value = withTiming(0, { duration: 300 });
        pinIconOpacity.value = withTiming(0, { duration: 300 });
=======
          withTiming(0, { duration: 250 })
        );
        translateX.value = withTiming(0, { duration: 250 });
        runOnJS(onTogglePin)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        deleteIconOpacity.value = withTiming(0, { duration: 200 });
        pinIconOpacity.value = withTiming(0, { duration: 200 });
>>>>>>> origin/main
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const deleteIconStyle = useAnimatedStyle(() => {
    return {
      opacity: deleteIconOpacity.value,
    };
  });

  const pinIconStyle = useAnimatedStyle(() => {
    return {
      opacity: pinIconOpacity.value,
    };
  });

  const amountText = expense.amount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <View style={styles.cardWrapper}>
      <AnimatedReanimated.View style={[styles.deleteIconContainer, deleteIconStyle]}>
        <IconSymbol android_material_icon_name="delete" ios_icon_name="trash" size={24} color="#FF3B30" />
      </AnimatedReanimated.View>
      <AnimatedReanimated.View style={[styles.pinIconContainer, pinIconStyle]}>
        <IconSymbol 
          android_material_icon_name={expense.isPinned ? "push-pin" : "push-pin"} 
          ios_icon_name="pin.fill" 
          size={24} 
          color="#BFFE84" 
        />
      </AnimatedReanimated.View>
      <GestureDetector gesture={panGesture}>
        <Pressable onLongPress={onLongPress}>
          <AnimatedReanimated.View style={[styles.expenseListCard, expense.isPinned && styles.expenseListCardPinned, animatedStyle]}>
            <Text style={styles.expenseListName}>{expense.name}</Text>
            <Text style={styles.expenseListAmount}>{amountText}</Text>
          </AnimatedReanimated.View>
        </Pressable>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeZone: {
    height: 70,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 5,
    paddingHorizontal: 12,
  },
  budgetHeader: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
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
  budgetAmount: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  budgetAmountInput: {
    fontSize: 28,
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
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 28,
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
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  expensesListSection: {
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  deleteIconContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  pinIconContainer: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  expenseListCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseListCardPinned: {
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  expenseListName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  expenseListAmount: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    width: '96%',
    maxWidth: 500,
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
    padding: 14,
    alignItems: 'center',
  },
  compactCancelButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  compactSubmitButton: {
    flex: 1,
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  compactSubmitButtonText: {
    fontSize: 14,
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
