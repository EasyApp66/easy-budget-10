
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
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function SubscriptionsScreen() {
  const { subscriptions, addSubscription, deleteSubscription, togglePinSubscription } = useBudget();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const subCount = subscriptions.length;

  const handleAddSubscription = () => {
    console.log('Add subscription button pressed');
    setShowAddModal(true);
  };

  const submitAddSubscription = () => {
    const amount = parseFloat(newSubAmount);
    if (newSubName.trim() && !isNaN(amount) && amount >= 0) {
      addSubscription(newSubName.trim(), amount);
      setNewSubName('');
      setNewSubAmount('');
      setShowAddModal(false);
      console.log('Subscription added:', newSubName, amount);
    }
  };

  const totalCostText = totalCost.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ABO KOSTEN</Text>
            <Text style={styles.summaryValue}>{totalCostText}</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{subCount}</Text>
          </View>
        </View>

        <View style={styles.subscriptionsSection}>
          {subscriptions.map((sub, index) => (
            <React.Fragment key={sub.id}>
            <SubscriptionCard
              subscription={sub}
              onDelete={() => {
                deleteSubscription(sub.id);
                console.log('Subscription deleted:', sub.id);
              }}
              onTogglePin={() => {
                togglePinSubscription(sub.id);
                console.log('Subscription pin toggled:', sub.id);
              }}
            />
            </React.Fragment>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Neues Abo</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCloseText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={newSubName}
              onChangeText={setNewSubName}
              placeholder="z.B. Netflix"
              placeholderTextColor="#666666"
            />
            <Text style={styles.inputLabel}>Betrag</Text>
            <TextInput
              style={styles.input}
              value={newSubAmount}
              onChangeText={setNewSubAmount}
              placeholder="0"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitAddSubscription}>
              <Text style={styles.submitButtonText}>Hinzufügen</Text>
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
}: {
  subscription: { id: string; name: string; amount: number; isPinned: boolean };
  onDelete: () => void;
  onTogglePin: () => void;
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
        onDelete();
      } else if (event.translationX > 100) {
        translateX.value = withTiming(0);
        onTogglePin();
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
        <Animated.View style={[styles.subscriptionCard, subscription.isPinned && styles.subscriptionCardPinned, animatedStyle]}>
          <Text style={styles.subscriptionName}>{subscription.name}</Text>
          <Text style={styles.subscriptionAmount}>{amountText}</Text>
        </Animated.View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
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
  },
  summaryLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 32,
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
    padding: 20,
  },
  subscriptionCardPinned: {
    borderWidth: 2,
    borderColor: '#9FE870',
  },
  subscriptionName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 30,
  },
  subscriptionAmount: {
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
