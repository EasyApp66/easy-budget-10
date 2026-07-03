
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, TextInput, Alert, Animated, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBudget } from '@/contexts/BudgetContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useGlass } from '@/contexts/GlassContext';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';

const USER_NAME_KEY = '@easy_budget_username';
const SUPPORT_EMAIL = 'ivanmirosnic006@gmail.com';
const TERMS_URL = 'https://www.termsfeed.com/live/6f7b7674-e830-468a-9f48-24a723dd62e9';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topInset = insets.top || (Platform.OS === 'android' ? 24 : 44);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showAppGuideModal, setShowAppGuideModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(5);
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [skipConfirmations, setSkipConfirmations] = useState(false);
  const [purchaseSuccessful, setPurchaseSuccessful] = useState(false);
  
  const router = useRouter();
  const { glassEnabled, setGlassEnabled } = useGlass();
  const { language, setLanguage, t } = useLanguage();
  const { premiumStatus, setPremiumStatus, purchasePremium, fetchPremiumStatus, cancelPremium, setMonths, setSubscriptions, setBudgetName, setActiveMonthId, setHasSeenWelcome } = useBudget();
  const { packages, purchasePackage, restorePurchases, checkSubscription, isSubscribed } = useSubscription();

  // Fade-in animations
  const [fadeAnims] = useState(() => ({
    header: new Animated.Value(0),
    menu: new Animated.Value(0),
  }));

  useEffect(() => {
    // Staggered fade-in animation
    Animated.stagger(80, [
      Animated.timing(fadeAnims.header, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnims.menu, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnims.header, fadeAnims.menu]);

  useEffect(() => {
    loadUsername();
    // Fetch premium status from backend on mount
    fetchPremiumStatus().catch(err => console.warn('Could not fetch premium status:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('@easy_budget_skip_confirmations').then(val => {
      if (val === 'true') setSkipConfirmations(true);
    });
  }, []);

  const handleToggleSkipConfirmations = async () => {
    if (premiumStatus.type === 'None' || premiumStatus.type === 'Expired') {
      closeAllModals();
      router.push('/paywall');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newVal = !skipConfirmations;
    setSkipConfirmations(newVal);
    await AsyncStorage.setItem('@easy_budget_skip_confirmations', newVal ? 'true' : 'false');
    console.log('[Profile] skipConfirmations set to:', newVal);
  };

  const handleToggleGlass = async () => {
    if (premiumStatus.type === 'None' || premiumStatus.type === 'Expired') {
      closeAllModals();
      router.push('/paywall');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setGlassEnabled(!glassEnabled);
    console.log('[Profile] Glass mode set to:', !glassEnabled);
  };

  const loadUsername = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem(USER_NAME_KEY);
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        const randomUsername = generateRandomUsername();
        setUsername(randomUsername);
        await AsyncStorage.setItem(USER_NAME_KEY, randomUsername);
      }
    } catch (error) {
      console.error('Error loading username:', error);
      const randomUsername = generateRandomUsername();
      setUsername(randomUsername);
    }
  };

  const generateRandomUsername = () => {
    const adjectives = ['happy', 'clever', 'bright', 'swift', 'calm', 'bold', 'wise', 'cool', 'smart', 'kind'];
    const nouns = ['user', 'saver', 'planner', 'budgeter', 'tracker', 'manager', 'organizer', 'expert', 'pro', 'master'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    const usernameText = `${randomAdj}.${randomNoun}${randomNum}`;
    return usernameText;
  };

  const handleUsernamePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTempUsername(username);
    setEditingUsername(true);
  };

  const saveUsername = async () => {
    Keyboard.dismiss();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      await AsyncStorage.setItem(USER_NAME_KEY, tempUsername.trim());
      console.log('Username saved:', tempUsername);
    }
    setEditingUsername(false);
  };

  const handleLegalPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('[Profile] Legal button pressed');
    closeAllModals();
    setShowLegalModal(true);
  };

  const handlePremiumPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('[Profile] Premium holen pressed — opening premium modal');
    closeAllModals();
    setShowPremiumModal(true);
  };

  const handleDonationPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('[Profile] Donation button pressed');
    closeAllModals();
    setShowDonationModal(true);
  };

  const handleSupportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject: t('supportSubject'),
        body: t('supportBody'),
      });
    } else {
      Alert.alert(t('error'), t('emailNotAvailable'));
    }
  };

  const handleBugReportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject: t('bugReportSubject'),
        body: t('bugReportBody'),
      });
    } else {
      Alert.alert(t('error'), t('emailNotAvailable'));
    }
  };

  const handleSuggestionPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject: t('suggestionSubject'),
        body: t('suggestionBody'),
      });
    } else {
      Alert.alert(t('error'), t('emailNotAvailable'));
    }
  };

  const handleLanguageToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cycle through all 5 languages: de -> en -> fr -> es -> ru -> de
    const langCycle: ('de' | 'en' | 'fr' | 'es' | 'ru')[] = ['de', 'en', 'fr', 'es', 'ru'];
    const currentIndex = langCycle.indexOf(language as 'de' | 'en' | 'fr' | 'es' | 'ru');
    const nextIndex = (currentIndex + 1) % langCycle.length;
    const newLanguage = langCycle[nextIndex];
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
  };

  const handleDonation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const amount = selectedDonationAmount;
    console.log('[Profile] Donation button pressed, amount:', amount);

    const tipIdentifier = `tip_${amount}`;
    const tipPkg = packages.find(p => p.identifier === tipIdentifier || p.product?.identifier === tipIdentifier);

    if (!tipPkg) {
      console.warn('[Profile] Tip package not found in RC offerings:', tipIdentifier);
      setModalMessage(language === 'de'
        ? 'Trinkgeld-Pakete sind noch nicht eingerichtet. Bitte versuche es später erneut.'
        : 'Tip packages are not yet configured. Please try again later.');
      closeAllModals();
      setShowErrorModal(true);
      return;
    }

    const donationAmountStr = `CHF ${selectedDonationAmount.toFixed(2)}`;
    Alert.alert(
      t('confirmDonationTitle'),
      t('confirmDonationMessage').replace('{amount}', donationAmountStr),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('donate'),
          style: 'default',
          onPress: async () => {
            setIsPurchasing(true);
            try {
              console.log('[Profile] Purchasing tip package:', tipPkg.identifier);
              const success = await purchasePackage(tipPkg);
              if (success) {
                console.log('[Profile] Tip purchase successful');
                closeAllModals();
                setModalMessage(t('donationThankYou'));
                setShowSuccessModal(true);
              } else {
                closeAllModals();
                setModalMessage(t('error'));
                setShowErrorModal(true);
              }
            } catch (error: any) {
              console.error('[Profile] Tip purchase failed:', error);
              if (!error.userCancelled) {
                closeAllModals();
                setModalMessage(t('error'));
                setShowErrorModal(true);
              }
            } finally {
              setIsPurchasing(false);
            }
          },
        },
      ]
    );
  };

  const handleOneTimePayment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('[Profile] One-time lifetime payment initiated');
    const lifetimePkg = packages.find(
      (p) => p.identifier === '$rc_lifetime' || p.packageType === 'LIFETIME'
    ) ?? packages[packages.length - 1];
    const lifetimePrice = lifetimePkg?.product?.priceString ?? t('priceNotAvailable');
    Alert.alert(
      t('confirmPurchaseTitle'),
      t('confirmLifetimePurchase').replace('{price}', lifetimePrice),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('paywallPay'),
          style: 'default',
          onPress: async () => {
            setIsPurchasing(true);
            try {
              const success = await purchasePremium('lifetime');
              if (success) {
                closeAllModals();
                setModalMessage(t('premiumActivated'));
                setPurchaseSuccessful(true);
                setShowSuccessModal(true);
                fetchPremiumStatus().catch(err => console.warn('[Profile] fetchPremiumStatus after lifetime:', err));
              } else {
                setModalMessage(t('error'));
                closeAllModals();
                setShowErrorModal(true);
              }
            } catch (error) {
              console.error('[Profile] One-time payment failed:', error);
              setModalMessage(t('error'));
              closeAllModals();
              setShowErrorModal(true);
            } finally {
              setIsPurchasing(false);
            }
          },
        },
      ]
    );
  };

  const handleMonthlySubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('[Profile] Monthly subscription initiated');
    const monthlyPkg = packages.find(
      (p) => p.identifier === '$rc_monthly' || p.packageType === 'MONTHLY'
    ) ?? packages[0];
    const monthlyPrice = monthlyPkg?.product?.priceString ?? t('priceNotAvailable');
    Alert.alert(
      t('confirmPurchaseTitle'),
      t('confirmMonthlyPurchase').replace('{price}', monthlyPrice),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('subscribe'),
          style: 'default',
          onPress: async () => {
            setIsPurchasing(true);
            try {
              const success = await purchasePremium('monthly');
              if (success) {
                closeAllModals();
                setModalMessage(t('premiumActivated'));
                setPurchaseSuccessful(true);
                setShowSuccessModal(true);
                fetchPremiumStatus().catch(err => console.warn('[Profile] fetchPremiumStatus after monthly:', err));
              } else {
                setModalMessage(t('error'));
                closeAllModals();
                setShowErrorModal(true);
              }
            } catch (error) {
              console.error('[Profile] Monthly subscription failed:', error);
              setModalMessage(t('error'));
              closeAllModals();
              setShowErrorModal(true);
            } finally {
              setIsPurchasing(false);
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('[Profile] Restore purchases tapped');
    setIsPurchasing(true);
    try {
      const restored = await restorePurchases();
      console.log('[Profile] Restore purchases result:', restored);
      if (restored) {
        closeAllModals();
        setModalMessage(t('premiumActivated'));
        setPurchaseSuccessful(true);
        setShowSuccessModal(true);
        fetchPremiumStatus().catch(err => console.warn('[Profile] fetchPremiumStatus after restore:', err));
      } else {
        setModalMessage(language === 'de' ? 'Keine früheren Käufe gefunden.' : 'No previous purchases found.');
        closeAllModals();
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('[Profile] Restore purchases failed:', error);
      setModalMessage(t('error'));
      closeAllModals();
      setShowErrorModal(true);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCancelPremium = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeAllModals();
    setShowCancelConfirmModal(true);
  };

  const confirmCancelPremium = async () => {
    closeAllModals();
    setIsCancelling(true);
    try {
      const success = await cancelPremium();
      if (success) {
        let successMsg = t('cancelPremium');
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const expirationDate = customerInfo.entitlements.active['pro']?.expirationDate;
          if (expirationDate) {
            const formattedDate = new Date(expirationDate).toLocaleDateString();
            successMsg = t('premiumEndsOn').replace('{date}', formattedDate);
          }
        } catch (infoErr) {
          console.warn('[Profile] Could not fetch customer info for expiry date:', infoErr);
        }
        setModalMessage(successMsg);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('[Profile] Cancel premium failed:', error);
      setModalMessage(t('error'));
      setShowErrorModal(true);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDeleteLocalData = async () => {
    console.log('[Profile] Delete Local Data pressed');
    Alert.alert(
      t('deleteLocalData'),
      t('deleteLocalDataMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            console.log('[Profile] Confirm delete local data pressed');
            try {
              await AsyncStorage.clear();
              setMonths([]);
              setSubscriptions([]);
              setPremiumStatus({ type: 'None', endDate: null });
              setBudgetName('Budget');
              setActiveMonthId('');
              setHasSeenWelcome(false);
              router.replace('/');
            } catch (error) {
              console.error('Error deleting data:', error);
              Alert.alert(t('error'), t('deleteAllDataError'));
            }
          },
        },
      ]
    );
  };

  const handleRequestAccountDeletion = async () => {
    console.log('[Profile] Request Account Deletion pressed');
    Alert.alert(
      t('accountDeletionTitle'),
      t('accountDeletionMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('accountDeletionSendEmail'),
          onPress: async () => {
            console.log('[Profile] Account deletion confirmed — opening mail composer');
            const isAvailable = await MailComposer.isAvailableAsync();
            if (isAvailable) {
              await MailComposer.composeAsync({
                recipients: [SUPPORT_EMAIL],
                subject: 'Easy Budget - Account Deletion',
                body: '',
              });
            } else {
              Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Easy%20Budget%20-%20Account%20Deletion`);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (isSubscribed) {
      console.log('[Profile] isSubscribed changed to true — refreshing premiumStatus');
      fetchPremiumStatus().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscribed]);

  const getPremiumStatusText = () => {
    if (isSubscribed && (premiumStatus.type === 'None' || premiumStatus.type === 'Expired')) {
      return `Premium: Ja, für immer!`;
    }
    if (premiumStatus.type === 'Lifetime') {
      return `Premium: Ja, für immer! ✓`;
    } else if (premiumStatus.type === 'Trial' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const daysText = daysLeft === 1 ? t('day') : t('days');
      return `${t('premiumTrial')}: ${daysLeft} ${daysText}`;
    } else if (premiumStatus.type === 'Monthly' && premiumStatus.endDate) {
      const renewalDate = new Date(premiumStatus.endDate);
      const day = renewalDate.getDate().toString().padStart(2, '0');
      const month = (renewalDate.getMonth() + 1).toString().padStart(2, '0');
      const year = renewalDate.getFullYear();
      return `Premium: Aktiv · Verlängerung ${day}.${month}.${year}`;
    } else if (premiumStatus.type === 'Expired') {
      return `Premium: ${t('premiumNo')}`;
    }
    return `Premium: ${t('premiumNo')}`;
  };

  const closeAllModals = () => {
    setShowLegalModal(false);
    setShowPremiumModal(false);
    setShowDonationModal(false);
    setShowCancelConfirmModal(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setShowAppGuideModal(false);
  };

  const lifetimePkg = packages.find(p => p.identifier === '$rc_lifetime' || p.packageType === 'LIFETIME');
  const monthlyPkg = packages.find(p => p.identifier === '$rc_monthly' || p.packageType === 'MONTHLY');
  const lifetimePrice = lifetimePkg?.product?.priceString ?? t('priceNotAvailable');
  const monthlyPrice = monthlyPkg?.product?.priceString ? `${monthlyPkg.product.priceString}/${t('month')}` : t('priceNotAvailable');

  const currentLanguageText = language === 'de' ? 'Deutsch' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : language === 'es' ? 'Español' : 'Русский';
  const premiumStatusText = getPremiumStatusText();

  return (
    <View style={styles.container}>
      <View style={{ height: topInset + 10, backgroundColor: '#000000' }} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.profileHeader, { opacity: fadeAnims.header }]}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={60} color="#000000" />
          </View>
          {editingUsername ? (
            <TextInput
              style={styles.usernameInput}
              value={tempUsername}
              onChangeText={setTempUsername}
              onBlur={saveUsername}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity onPress={handleUsernamePress}>
              <Text style={styles.username}>{username}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.premiumBadge}>{premiumStatusText}</Text>
        </Animated.View>

        <Animated.View style={[styles.menuSection, { opacity: fadeAnims.menu }]}>
          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handlePremiumPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="star" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('getPremium')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          {premiumStatus.hasAppleSubscription && (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                closeAllModals();
                setShowCancelConfirmModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name="cancel" size={24} color="#FF3B30" />
                <Text style={styles.menuItemText}>{isCancelling ? '...' : t('cancelPremium')}</Text>
              </View>
              {isCancelling ? (
                <ActivityIndicator size="small" color="#666666" />
              ) : (
                <MaterialIcons name="chevron-right" size={24} color="#666666" />
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleLanguageToggle}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="language" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('language')}: {currentLanguageText}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, glassEnabled && styles.glassCard]}
            onPress={handleToggleSkipConfirmations}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="notifications-off" size={24} color="#BFFE84" />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>{t('skipConfirmationsLabel')}</Text>
                {(premiumStatus.type === 'None' || premiumStatus.type === 'Expired') && (
                  <Text style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>Nur für Premium</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {(premiumStatus.type === 'None' || premiumStatus.type === 'Expired') ? (
                <MaterialIcons name="lock" size={18} color="#888888" />
              ) : (
                <View style={{
                  width: 44, height: 26, borderRadius: 13,
                  backgroundColor: skipConfirmations ? '#BFFE84' : '#3A3A3C',
                  justifyContent: 'center', paddingHorizontal: 3,
                }}>
                  <View style={{
                    width: 20, height: 20, borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: skipConfirmations ? 18 : 0 }],
                  }} />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, glassEnabled && styles.glassCard]}
            onPress={handleToggleGlass}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="blur-on" size={24} color="#BFFE84" />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>{t('glassMode')}</Text>
                {(premiumStatus.type === 'None' || premiumStatus.type === 'Expired') && (
                  <Text style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>{t('premiumOnly')}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {(premiumStatus.type === 'None' || premiumStatus.type === 'Expired') ? (
                <MaterialIcons name="lock" size={18} color="#888888" />
              ) : (
                <View style={{
                  width: 44, height: 26, borderRadius: 13,
                  backgroundColor: glassEnabled ? '#BFFE84' : '#3A3A3C',
                  justifyContent: 'center', paddingHorizontal: 3,
                }}>
                  <View style={{
                    width: 20, height: 20, borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: glassEnabled ? 18 : 0 }],
                  }} />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleLegalPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="description" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('legal')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleSupportPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="help" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('support')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleBugReportPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="bug-report" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('reportBug')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleSuggestionPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="lightbulb" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('suggestion')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, glassEnabled && styles.glassCard]} 
            onPress={handleDonationPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="favorite" size={24} color="#FF3B30" />
              <Text style={styles.menuItemText}>{t('donation')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, glassEnabled && styles.glassCard]}
            onPress={() => {
              console.log('[Profile] App Guide pressed');
              closeAllModals();
              setShowAppGuideModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="menu-book" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('appGuide')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderWidth: 1, borderColor: '#FF9500', backgroundColor: '#1A0D00' }]}
            onPress={handleDeleteLocalData}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="delete-sweep" size={24} color="#FF9500" />
              <Text style={[styles.menuItemText, { color: '#FF9500' }]}>{t('deleteLocalData')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF9500" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderWidth: 1, borderColor: '#FF3B30', backgroundColor: '#1A0000' }]}
            onPress={handleRequestAccountDeletion}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="delete-forever" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>{t('requestAccountDeletionTitle')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.madeWithText}>Made with ❤️</Text>
          <Text style={{ fontSize: 13, color: '#666666', marginTop: 4 }}>by Design Studio Dübendorf</Text>
          <TouchableOpacity onPress={() => { console.log('[Profile] Tapped n55.ch link'); Linking.openURL('https://n55.ch'); }} activeOpacity={0.7}>
            <Text style={{ fontSize: 13, color: '#BFFE84', textDecorationLine: 'underline', marginTop: 2 }}>n55.ch</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Legal Modal */}
      <Modal
        visible={showLegalModal}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={() => setShowLegalModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: 16 }]}>{t('termsAndPrivacy')}</Text>
            <TouchableOpacity onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowLegalModal(false);
            }}>
              <Text style={styles.modalCloseText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>{t('imprint')}</Text>
            <Text style={styles.sectionText}>
              Easy Budget 2{'\n'}
              Ivan Mirosnic{'\n'}
              Ahornstrasse{'\n'}
              8600 Dübendorf{'\n'}
              CH - Switzerland
            </Text>

            <Text style={styles.sectionTitle}>{t('privacyPolicy')}</Text>
            <Text style={styles.sectionText}>
              Easy Budget 2 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert.
            </Text>
            <Text style={styles.sectionText}>
              Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern. Es werden keine Benutzerdaten gesammelt - nur Ihre Eingaben werden lokal gespeichert.
            </Text>
            <Text style={styles.sectionText}>
              Die App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.
            </Text>

            <Text style={styles.sectionTitle}>{t('termsOfUse')}</Text>
            <Text style={styles.sectionText}>
              Durch die Nutzung von Easy Budget 2 erklären Sie sich mit folgenden Bedingungen einverstanden:
            </Text>
            <Text style={styles.sectionText}>
              1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.{'\n'}
              2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.{'\n'}
              3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.{'\n'}
              4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.
            </Text>
            <Text style={styles.sectionText}>
              Anwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.
            </Text>

            <Text style={styles.sectionTitle}>Allgemeine Geschäftsbedingungen (AGB)</Text>
            <Text style={styles.sectionText}>
              1. Geltungsbereich: Diese AGB gelten für die Nutzung der Easy Budget 2 App.{'\n\n'}
              2. Leistungen: Die App bietet Funktionen zur Verwaltung von Budgets, Ausgaben und Abonnements.{'\n\n'}
              3. Nutzungsrechte: Sie erhalten ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der App.{'\n\n'}
              4. Haftung: Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.{'\n\n'}
              5. Änderungen: Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern.
            </Text>
            <Text style={styles.sectionText}>
              Bei Fragen kontaktieren Sie uns unter: ivanmirosnic006@gmail.com
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={[styles.premiumModal, glassEnabled && styles.glassModal]}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPremiumModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.premiumIconContainer}>
              <MaterialIcons name="star" size={32} color="#BFFE84" />
            </View>

            <Text style={styles.premiumModalTitle}>{t('getPremium')}</Text>
            <Text style={styles.premiumModalSubtitle}>{t('unlimitedFeatures')}</Text>

            <View style={styles.premiumFeatures}>
              <Text style={styles.premiumFeatureText}>• {t('unlimitedSubscriptions')}</Text>
              <Text style={styles.premiumFeatureText}>• {t('unlimitedExpenses')}</Text>
              <Text style={styles.premiumFeatureText}>• {t('unlimitedMonths')}</Text>
            </View>

            <View style={styles.premiumPricing}>
              <View style={styles.pricingOption}>
                <Text style={styles.pricingTitle}>{t('oneTimePayment')}</Text>
                <Text style={styles.pricingAmount}>{lifetimePrice}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)} style={{ marginBottom: 6, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pricingButton, isPurchasing && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  disabled={isPurchasing}
                  onPress={handleOneTimePayment}
                >
                  {isPurchasing ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.pricingButtonText}>{t('pay')}</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.orText}>{t('or')}</Text>

              <View style={styles.pricingOption}>
                <Text style={styles.pricingTitle}>{t('monthlySubscription')}</Text>
                <Text style={styles.pricingAmount}>{monthlyPrice}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)} style={{ marginBottom: 6, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.pricingButton, isPurchasing && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  disabled={isPurchasing}
                  onPress={handleMonthlySubscription}
                >
                  {isPurchasing ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.pricingButtonText}>{t('pay')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.restoreButton}
              activeOpacity={0.7}
              disabled={isPurchasing}
              onPress={handleRestorePurchases}
            >
              <Text style={styles.restoreButtonText}>
                {language === 'de' ? 'Käufe wiederherstellen' :
                 language === 'fr' ? 'Restaurer les achats' :
                 language === 'es' ? 'Restaurar compras' :
                 'Restore Purchases'}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 10, color: '#555555', textAlign: 'center', lineHeight: 14, marginTop: 8, paddingHorizontal: 4 }}>
              {'Abo kündigen: Einstellungen → Apple ID → Abonnements → Easy Budget'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Donation Modal */}
      <Modal
        visible={showDonationModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDonationModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={[styles.donationModal, glassEnabled && styles.glassModal]}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDonationModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.donationIconContainer}>
              <MaterialIcons name="favorite" size={32} color="#FF3B30" />
            </View>

            <Text style={styles.donationModalTitle}>{t('donation')}</Text>
            <Text style={styles.donationModalSubtitle}>{t('supportDevelopment')}</Text>

            <Text style={{ fontSize: 12, color: '#888888', textAlign: 'center', marginBottom: 12, lineHeight: 18 }}>
              {t('donationDisclaimer')}
            </Text>

            <View style={styles.donationAmounts}>
              {[1, 5, 10, 20].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.donationAmountButton,
                    selectedDonationAmount === amount && styles.donationAmountButtonSelected,
                  ]}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDonationAmount(amount);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.donationAmountText,
                    selectedDonationAmount === amount && styles.donationAmountTextSelected,
                  ]}>
                    {`CHF ${amount}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => {
                console.log('[Profile] AGB & Datenschutz link pressed');
                Linking.openURL(TERMS_URL);
              }}
              style={{ marginBottom: 10, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 11, color: '#888888', textDecorationLine: 'underline' }}>
                {t('termsAndPrivacy')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.donateButton, isPurchasing && { opacity: 0.6 }]}
              onPress={handleDonation}
              activeOpacity={0.8}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="favorite" size={14} color="#FFFFFF" />
                  <Text style={styles.donateButtonText}>
                    {t('donate')} CHF {selectedDonationAmount.toFixed(2)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal
        visible={showCancelConfirmModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCancelConfirmModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.promoModal}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCancelConfirmModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[styles.promoIconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.2)' }]}>
              <MaterialIcons name="cancel" size={40} color="#FF3B30" />
            </View>

            <Text style={styles.promoModalTitle}>{t('cancelPremium')}</Text>
            <Text style={[styles.promoModalMessage, { color: '#CCCCCC' }]}>
              {t('cancelPremiumConfirmMessage')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.promoOkButton, { flex: 1, backgroundColor: '#2C2C2E' }]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowCancelConfirmModal(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.promoOkButtonText, { color: '#FFFFFF' }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.promoOkButton, { flex: 1, backgroundColor: '#FF3B30' }]}
                onPress={confirmCancelPremium}
                activeOpacity={0.8}
              >
                <Text style={styles.promoOkButtonText}>{t('delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.promoModal}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSuccessModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[styles.promoIconContainer, { backgroundColor: 'rgba(191, 254, 132, 0.2)' }]}>
              <MaterialIcons name="check-circle" size={40} color="#BFFE84" />
            </View>

            <Text style={styles.promoModalTitle}>{t('success')}</Text>
            <Text style={[styles.promoModalMessage, { color: '#CCCCCC' }]}>
              {modalMessage}
            </Text>

            <TouchableOpacity 
              style={styles.promoOkButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSuccessModal(false);
                if (purchaseSuccessful) {
                  setPurchaseSuccessful(false);
                  router.replace('/(tabs)/(home)');
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.promoOkButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.promoModal}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowErrorModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={[styles.promoIconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.2)' }]}>
              <MaterialIcons name="error" size={40} color="#FF3B30" />
            </View>

            <Text style={styles.promoModalTitle}>{t('error')}</Text>
            <Text style={[styles.promoModalMessage, { color: '#CCCCCC' }]}>
              {modalMessage}
            </Text>

            <TouchableOpacity 
              style={styles.promoOkButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowErrorModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.promoOkButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* App Guide Modal */}
      <Modal visible={showAppGuideModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.appGuideModal, { maxHeight: '85%' }, glassEnabled && styles.glassModal]}>
            <Text style={styles.appGuideModalTitle}>{t('appGuideTitle')}</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <Text style={[styles.appGuideSectionTitle, { marginTop: 8 }]}>{t('appGuideBudgetTitle')}</Text>
              {t('appGuideBudgetContent').split('\n').map((line, i) => (
                <Text key={i} style={styles.appGuideItem}>{line}</Text>
              ))}
              <Text style={[styles.appGuideSectionTitle, { marginTop: 16 }]}>{t('appGuideSubsTitle')}</Text>
              {t('appGuideSubsContent').split('\n').map((line, i) => (
                <Text key={i} style={styles.appGuideItem}>{line}</Text>
              ))}
              <Text style={[styles.appGuideSectionTitle, { marginTop: 16 }]}>{t('appGuideProfileTitle')}</Text>
              {t('appGuideProfileContent').split('\n').map((line, i) => (
                <Text key={i} style={styles.appGuideItem}>{line}</Text>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.appGuideCloseButton} onPress={() => {
              console.log('[Profile] App Guide modal closed');
              setShowAppGuideModal(false);
            }}>
              <Text style={styles.appGuideCloseButtonText}>{t('close')}</Text>
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
    paddingTop: 20,
    paddingHorizontal: 2,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#BFFE84',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#2C2C2E',
  },
  username: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  usernameInput: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BFFE84',
    paddingHorizontal: 10,
    textAlign: 'center',
    minWidth: 200,
  },
  premiumBadge: {
    fontSize: 16,
    color: '#BFFE84',
    fontWeight: '600',
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  promoButton: {
    backgroundColor: '#1C4D1C',
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    flexShrink: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  madeWithText: {
    fontSize: 14,
    color: '#666666',
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
    paddingTop: Platform.OS === 'android' ? 24 : 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#BFFE84',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 12,
  },
  centeredModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  premiumModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    position: 'relative',
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(191, 254, 132, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  premiumModalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  premiumModalSubtitle: {
    fontSize: 13,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
  },
  premiumFeatures: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  premiumFeatureText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 4,
  },
  premiumPricing: {
    gap: 12,
  },
  pricingOption: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  pricingTitle: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  pricingAmount: {
    fontSize: 18,
    color: '#BFFE84',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pricingButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 10,
    padding: 11,
    alignItems: 'center',
  },
  pricingButtonText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '600',
  },
  donationModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    position: 'relative',
  },
  donationIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  donationModalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  donationModalSubtitle: {
    fontSize: 13,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
  },
  donationAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6,
  },
  donationAmountButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  donationAmountButtonSelected: {
    backgroundColor: '#BFFE84',
  },
  donationAmountText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  donationAmountTextSelected: {
    color: '#000000',
  },
  customAmountContainer: {
    marginBottom: 16,
  },
  customAmountLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  customAmountInput: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  donateButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  donateButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  promoModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    position: 'relative',
  },
  promoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(191, 254, 132, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  promoModalTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  promoModalMessage: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  promoCodeBox: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  promoCodeText: {
    fontSize: 24,
    color: '#BFFE84',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  promoOkButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  promoOkButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  pricingButtonDisabled: {
    opacity: 0.6,
  },
  restoreButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32,
  },
  appGuideModal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  appGuideModalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  appGuideSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#BFFE84',
    marginTop: 4,
    marginBottom: 4,
  },
  guideText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
    marginTop: 4,
  },
  appGuideItem: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 10,
  },
  appGuideCloseButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  appGuideCloseButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
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
});
