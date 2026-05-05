
import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBudget } from '@/contexts/BudgetContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlass } from '@/contexts/GlassContext';
import { getLocaleCurrency } from '@/utils/currency';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AnimatedReanimated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, runOnJS, withSequence } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function SubscriptionsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { subscriptions, addSubscription, deleteSubscription, togglePinSubscription, updateSubscription, duplicateSubscription, premiumStatus } = useBudget();

  const { glassEnabled } = useGlass();
  const [showAddModal, setShowAddModal] = useState(false);
  const [skipConfirmations, setSkipConfirmations] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubName, setEditSubName] = useState('');
  const [editSubAmount, setEditSubAmount] = useState('');

  const [fadeAnims] = useState(() => ({
    summary: new Animated.Value(0),
    total: new Animated.Value(0),
    subscriptions: new Animated.Value(0),
  }));

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(fadeAnims.summary, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.total, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.subscriptions, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnims.summary, fadeAnims.total, fadeAnims.subscriptions]);

  useEffect(() => {
    if (params.triggerAdd) {
      console.log('triggerAdd detected for subscriptions, opening modal');
      handleAddSubscription();
    }
  }, [params.triggerAdd]);

  useFocusEffect(
    useCallback(() => {
      const isPremium = premiumStatus.type !== 'None' && premiumStatus.type !== 'Expired';
      if (!isPremium) {
        setSkipConfirmations(false);
        return;
      }
      AsyncStorage.getItem('@easy_budget_skip_confirmations').then(val => {
        setSkipConfirmations(val === 'true');
      });
    }, [premiumStatus.type])
  );

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
      const added = addSubscription(newSubName.trim(), amount);
      if (!added) {
        setShowAddModal(false);
        console.log('[Paywall] Subscription limit reached — navigating to paywall');
        router.push('/paywall');
        return;
      }
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
      const success = duplicateSubscription(selectedSubId);
      setShowOptionsModal(false);
      setSelectedSubId(null);
      if (!success) {
        console.log('[Paywall] Subscription duplicate blocked — navigating to paywall');
        router.push('/paywall');
        return;
      }
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
    if (!selectedSubId) return;
    const isPremium = premiumStatus.type !== 'None' && premiumStatus.type !== 'Expired';
    if (isPremium && skipConfirmations) {
      deleteSubscription(selectedSubId);
      setShowOptionsModal(false);
      setSelectedSubId(null);
      console.log('Subscription deleted (no confirm)');
      return;
    }
    const subName = subscriptions.find(s => s.id === selectedSubId)?.name ?? 'dieses Abo';
    Alert.alert(
      'Abo löschen',
      `Möchtest du "${subName}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteSubscription(selectedSubId!);
            setShowOptionsModal(false);
            setSelectedSubId(null);
            console.log('Subscription deleted');
          },
        },
      ]
    );
  };

  const { locale } = getLocaleCurrency();
  const totalCostText = totalCost.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const selectedSub = selectedSubId ? subscriptions.find(s => s.id === selectedSubId) : null;

  return (
    <View style={styles.container}>
      <View style={styles.safeZone} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.summaryCard, glassEnabled && styles.glassCard, { opacity: fadeAnims.summary }]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('subscriptionCosts')}</Text>
            <Text style={styles.summaryValue}>{subCount}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.totalCard, glassEnabled && styles.glassCard, { opacity: fadeAnims.total }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('total')}</Text>
            <Text style={styles.totalValue}>{totalCostText}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.subscriptionsSection, { opacity: fadeAnims.subscriptions }]}>
          {subscriptions.map((sub, index) => (
            <React.Fragment key={sub.id}>
            <SubscriptionCard
              subscription={sub}
              glassEnabled={glassEnabled}
              onDelete={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const isPremium = premiumStatus.type !== 'None' && premiumStatus.type !== 'Expired';
                if (isPremium && skipConfirmations) {
                  deleteSubscription(sub.id);
                  console.log('Subscription swipe-deleted (no confirm):', sub.id);
                  return;
                }
                Alert.alert(
                  'Abo löschen',
                  `Möchtest du "${sub.name}" wirklich löschen?`,
                  [
                    { text: 'Abbrechen', style: 'cancel' },
                    {
                      text: 'Löschen',
                      style: 'destructive',
                      onPress: () => {
                        deleteSubscription(sub.id);
                        console.log('Subscription swipe-deleted:', sub.id);
                      },
                    },
                  ]
                );
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
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={[styles.compactModal, glassEnabled && styles.glassModal]}>
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
          <View style={[styles.optionsModal, glassEnabled && styles.glassModal]}>
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
            <TouchableOpacity style={styles.optionButton} onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowOptionsModal(false);
            }} activeOpacity={0.7}>
              <Text style={styles.optionButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={[styles.compactModal, glassEnabled && styles.glassModal]}>
            <Text style={styles.compactModalTitle}>{t('editSubscription')}</Text>
            
            <TextInput
              style={styles.compactInput}
              value={editSubName}
              onChangeText={setEditSubName}
              placeholder="Name"
              placeholderTextColor="#666666"
            />
            
            <TextInput
              style={[styles.compactInput, { marginTop: 12 }]}
              value={editSubAmount}
              onChangeText={setEditSubAmount}
              placeholder="Betrag"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
            />
            
            <View style={styles.compactModalButtons}>
              <TouchableOpacity 
                style={styles.compactCancelButton} 
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowEditModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.compactCancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.compactSubmitButton} 
                onPress={submitSubEdit}
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

function SubscriptionCard({
  subscription,
  onDelete,
  onTogglePin,
  onLongPress,
  glassEnabled,
}: {
  subscription: { id: string; name: string; amount: number; isPinned: boolean };
  onDelete: () => void;
  onTogglePin: () => void;
  onLongPress: () => void;
  glassEnabled: boolean;
}) {
  const translateX = useSharedValue(0);
  const deleteIconOpacity = useSharedValue(0);
  const pinIconOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
        deleteIconOpacity.value = Math.min(Math.abs(event.translationX) / 100, 1);
        pinIconOpacity.value = 0;
      } else if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, 100);
        pinIconOpacity.value = Math.min(event.translationX / 100, 1);
        deleteIconOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -80) {
        deleteIconOpacity.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 250 })
        );
        translateX.value = withTiming(0, { duration: 250 });
        runOnJS(onDelete)();
      } else if (event.translationX > 80) {
        pinIconOpacity.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 250 })
        );
        translateX.value = withTiming(0, { duration: 250 });
        runOnJS(onTogglePin)();
      } else {
        translateX.value = withTiming(0, { duration: 200 });
        deleteIconOpacity.value = withTiming(0, { duration: 200 });
        pinIconOpacity.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
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

  const { locale: subLocale } = getLocaleCurrency();
  const amountText = subscription.amount.toLocaleString(subLocale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <View style={styles.cardWrapper}>
      <AnimatedReanimated.View style={[styles.deleteIconContainer, deleteIconStyle]}>
        <MaterialIcons name="delete" size={24} color="#FF3B30" />
      </AnimatedReanimated.View>
      <AnimatedReanimated.View style={[styles.pinIconContainer, pinIconStyle]}>
        <MaterialIcons name="push-pin" size={24} color="#BFFE84" />
      </AnimatedReanimated.View>
      <GestureDetector gesture={panGesture}>
        <Pressable
          onLongPress={onLongPress}
          onPressIn={() => {
            console.log('[SubscriptionCard] Press in:', subscription.name);
            scale.value = withTiming(0.95, { duration: 80 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15, stiffness: 300 });
          }}
        >
          <AnimatedReanimated.View style={[styles.subscriptionCard, subscription.isPinned && styles.subscriptionCardPinned, glassEnabled && styles.glassCard, animatedStyle]}>
            <Text style={styles.subscriptionName}>{subscription.name}</Text>
            <Text style={styles.subscriptionAmount}>{amountText}</Text>
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
    paddingHorizontal: 2,
  },
  summaryCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    marginHorizontal: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    marginHorizontal: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  totalValue: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subscriptionsSection: {
    marginBottom: 20,
    paddingHorizontal: 2,
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
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  subscriptionAmount: {
    fontSize: 28,
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
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassModal: {
    backgroundColor: 'rgba(20,20,20,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  glassButton: {
    backgroundColor: 'rgba(191,254,132,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(191,254,132,0.4)',
  },
});
