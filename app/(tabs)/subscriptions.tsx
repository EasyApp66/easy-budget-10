
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
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function SubscriptionsScreen() {
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { subscriptions, addSubscription, deleteSubscription, togglePinSubscription, updateSubscription, duplicateSubscription } = useBudget();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubName, setEditSubName] = useState('');
  const [editSubAmount, setEditSubAmount] = useState('');

  useEffect(() => {
    if (params.triggerAdd) {
      console.log('triggerAdd detected for subscriptions, opening modal');
      handleAddSubscription();
    }
  }, [params.triggerAdd]);

  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const subCount = subscriptions.length;

  const handleAddSubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Opening add subscription modal');
    setShowAddModal(true);
  };

  const submitAddSubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(newSubAmount);
    if (newSubName.trim() && !isNaN(amount) && amount >= 0) {
      addSubscription(newSubName.trim(), amount);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
      console.log('Subscription added:', newSubName, amount);
    }
  };

  const handleSubLongPress = async (subId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedSubId(subId);
    setShowOptionsModal(true);
    console.log('Subscription long pressed:', subId);
  };

  const handleSubEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSubId) {
      const sub = subscriptions.find(s => s.id === selectedSubId);
      if (sub) {
        setEditSubName(sub.name);
        setEditSubAmount(sub.amount.toString());
        setShowOptionsModal(false);
        setShowEditModal(true);
      }
    }
  };

  const submitSubEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = parseFloat(editSubAmount);
    if (selectedSubId && editSubName.trim() && !isNaN(amount) && amount >= 0) {
      updateSubscription(selectedSubId, editSubName.trim(), amount);
      setShowEditModal(false);
      setSelectedSubId(null);
      console.log('Subscription updated:', editSubName, amount);
    }
  };

  const handleSubDuplicate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSubId) {
      duplicateSubscription(selectedSubId);
      setShowOptionsModal(false);
      setSelectedSubId(null);
      console.log('Subscription duplicated');
    }
  };

  const handleSubTogglePin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSubId) {
      togglePinSubscription(selectedSubId);
      setShowOptionsModal(false);
      setSelectedSubId(null);
      console.log('Subscription pin toggled');
    }
  };

  const handleSubDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSubId) {
      deleteSubscription(selectedSubId);
      setShowOptionsModal(false);
      setSelectedSubId(null);
      console.log('Subscription deleted');
    }
  };

  const totalCostText = totalCost.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const selectedSub = selectedSubId ? subscriptions.find(s => s.id === selectedSubId) : null;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subscriptionCosts')}</Text>
            <Text style={styles.summaryValue}>{totalCostText}</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalValue}>{subCount}</Text>
          </View>
        </View>

        <View style={styles.subscriptionsSection}>
          {subscriptions.map((sub, index) => (
            <React.Fragment key={sub.id}>
            <SubscriptionCard
              subscription={sub}
              onDelete={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                deleteSubscription(sub.id);
                console.log('Subscription deleted:', sub.id);
              }}
              onTogglePin={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                togglePinSubscription(sub.id);
                console.log('Subscription pin toggled:', sub.id);
              }}
              onLongPress={() => handleSubLongPress(sub.id)}
            />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.compactModal}>
            <Text style={styles.compactModalTitle}>{t('newSubscription')}</Text>
            
            <TextInput
              style={styles.compactInput}
              value={newSubName}
              onChangeText={setNewSubName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            
            <TextInput
              style={[styles.compactInput, { marginTop: 12 }]}
              value={newSubAmount}
              onChangeText={setNewSubAmount}
              placeholder="Betrag"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            
            <View style={styles.compactModalButtons}>
              <TouchableOpacity 
                style={styles.compactCancelButton} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAddModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactSubmitButton} 
                onPress={submitAddSubscription}
                activeOpacity={0.8}
              >
                <Text style={styles.compactSubmitButtonText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowOptionsModal(false);
        }}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{selectedSub?.name}</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleSubTogglePin} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>
                {selectedSub?.isPinned ? t('unpin') : t('pin')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleSubDuplicate} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('duplicate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleSubEdit} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('rename')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleSubEdit} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('adjustNumber')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, styles.optionButtonDanger]} onPress={handleSubDelete} activeOpacity={0.7}>
              <Text style={[styles.optionButtonText, styles.optionButtonTextDanger]}>{t('delete')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('editSubscription')}</Text>
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowEditModal(false);
            }}>
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>{t('subscriptionNameExample')}</Text>
            <TextInput
              style={styles.input}
              value={editSubName}
              onChangeText={setEditSubName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            <Text style={styles.inputLabel}>{t('amount')}</Text>
            <TextInput
              style={styles.input}
              value={editSubAmount}
              onChangeText={setEditSubAmount}
              placeholder="0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitSubEdit} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SubscriptionCard({
  subscription,
  onDelete,
  onTogglePin,
  onLongPress,
}: {
  subscription: { id: string; name: string; amount: number; isPinned: boolean };
  onDelete: () => void;
  onTogglePin: () => void;
  onLongPress: () => void;
}) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -150);
      } else if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, 150);
      }
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        translateX.value = withTiming(0);
        runOnJS(onDelete)();
      } else if (event.translationX > 100) {
        translateX.value = withTiming(0);
        runOnJS(onTogglePin)();
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const amountText = subscription.amount.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={panGesture}>
        <Pressable onLongPress={onLongPress}>
          <Animated.View style={[styles.subscriptionCard, subscription.isPinned && styles.subscriptionCardPinned, animatedStyle]}>
            <Text style={styles.subscriptionName}>{subscription.name}</Text>
            <Text style={styles.subscriptionAmount}>{amountText}</Text>
          </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
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
  },
  summaryLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subscriptionsSection: {
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionCardPinned: {
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  subscriptionName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  subscriptionAmount: {
    fontSize: 32,
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
