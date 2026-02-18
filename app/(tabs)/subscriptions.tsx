
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
  const subCountText = subCount === 1 ? '1 Abo' : `${subCount} Abos`;

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Abos</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Totale Ausgaben</Text>
            <Text style={styles.summaryValue}>CHF {totalCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Abo Kosten</Text>
            <Text style={styles.summaryValue}>{subCountText}</Text>
          </View>
        </View>

        <View style={styles.subscriptionsSection}>
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
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
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddSubscription}>
        <IconSymbol android_material_icon_name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

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
              placeholderTextColor="#8E8E93"
            />
            <Text style={styles.inputLabel}>Betrag (CHF)</Text>
            <TextInput
              style={styles.input}
              value={newSubAmount}
              onChangeText={setNewSubAmount}
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
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

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.subscriptionCard, subscription.isPinned && styles.subscriptionCardPinned, animatedStyle]}>
          <Text style={styles.subscriptionName}>{subscription.name}</Text>
          <Text style={styles.subscriptionAmount}>CHF {subscription.amount.toFixed(2)}</Text>
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
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#3A3A3C',
    marginVertical: 8,
  },
  subscriptionsSection: {
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionCardPinned: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  subscriptionName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subscriptionAmount: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
});
