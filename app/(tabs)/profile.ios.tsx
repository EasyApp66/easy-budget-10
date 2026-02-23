
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import * as MailComposer from 'expo-mail-composer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBudget } from '@/contexts/BudgetContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_NAME_KEY = '@easy_budget_username';

export default function ProfileScreen() {
  const { premiumStatus, applyPremiumCode, purchasePremium, fetchPremiumStatus, cancelPremium } = useBudget();
  const { language, setLanguage, t } = useLanguage();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
<<<<<<< HEAD
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
=======
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
>>>>>>> origin/main
  const [codeInput, setCodeInput] = useState('');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(5);
  const [customDonationAmount, setCustomDonationAmount] = useState('');
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
<<<<<<< HEAD
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
=======
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
>>>>>>> origin/main

  // Fade-in animations
  const [fadeAnims] = useState(() => ({
    header: new Animated.Value(0),
    code: new Animated.Value(0),
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
      Animated.timing(fadeAnims.code, {
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
  }, []);

  useEffect(() => {
    loadUsername();
<<<<<<< HEAD
    // Sync premium status from backend on mount
    fetchPremiumStatus().catch(err => console.warn('[Profile] Could not sync premium status:', err));
=======
    // Fetch premium status from backend on mount
    fetchPremiumStatus().catch(err => console.warn('Could not fetch premium status:', err));
>>>>>>> origin/main
  }, []);

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
    console.log('Legal button pressed');
    setShowLegalModal(true);
  };

  const handlePremiumPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Premium button pressed');
    setShowPremiumModal(true);
  };

  const handleDonationPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Donation button pressed');
    setShowDonationModal(true);
  };

  const handleSupportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Support button pressed');
    
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['ivanmirosnic006@gmail.com'],
        subject: 'Easy Budget - Support',
        body: '',
      });
    } else {
      Alert.alert('Error', 'Mail composer is not available on this device');
    }
  };

  const handleBugReportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Bug report button pressed');
    
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['ivanmirosnic006@gmail.com'],
        subject: 'Easy Budget - Bug Report',
        body: '',
      });
    } else {
      Alert.alert('Error', 'Mail composer is not available on this device');
    }
  };

  const handleSuggestionPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Suggestion button pressed');
    
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['ivanmirosnic006@gmail.com'],
        subject: 'Easy Budget - Vorschlag',
        body: '',
      });
    } else {
      Alert.alert('Error', 'Mail composer is not available on this device');
    }
  };

  const handleLanguageToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Cycle through all 4 languages: de -> en -> fr -> es -> de
    const langCycle: Array<'de' | 'en' | 'fr' | 'es'> = ['de', 'en', 'fr', 'es'];
    const currentIndex = langCycle.indexOf(language as 'de' | 'en' | 'fr' | 'es');
    const nextIndex = (currentIndex + 1) % langCycle.length;
    const newLang = langCycle[nextIndex];
    console.log('Language toggle pressed, switching to:', newLang);
    setLanguage(newLang);
  };

  const handleApplyCode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('[Profile] Applying premium code:', codeInput);
    
    if (!codeInput.trim()) {
      setModalMessage(t('enterCode'));
      setShowErrorModal(true);
      return;
    }

    try {
      const success = await applyPremiumCode(codeInput.trim());
      if (success) {
        setModalMessage(t('premiumActivated'));
        setShowSuccessModal(true);
        setCodeInput('');
      } else {
        setModalMessage(t('invalidCode'));
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('[Profile] Error applying code:', error);
      setModalMessage(t('invalidCode'));
      setShowErrorModal(true);
    }
  };

  const handleDonation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = customDonationAmount ? parseFloat(customDonationAmount) : selectedDonationAmount;
<<<<<<< HEAD
    console.log('[Profile] Donation amount:', amount);
=======
    console.log('Donation amount:', amount);
    // Donation is handled via Apple Pay / external payment - show thank you
    Alert.alert(t('thankYou'), t('donationThankYou'));
>>>>>>> origin/main
    setShowDonationModal(false);
    setModalMessage(t('donationThankYou'));
    setShowSuccessModal(true);
  };

  const handleOneTimePayment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('[Profile] One-time lifetime payment initiated');
    setIsPurchasing(true);
    try {
      const success = await purchasePremium('lifetime');
      if (success) {
        setShowPremiumModal(false);
        setModalMessage(t('premiumActivated'));
        setShowSuccessModal(true);
      } else {
        setModalMessage(t('error'));
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('[Profile] One-time payment failed:', error);
      setModalMessage(t('error'));
      setShowErrorModal(true);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleMonthlySubscription = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('[Profile] Monthly subscription initiated');
    setIsPurchasing(true);
    try {
      const success = await purchasePremium('monthly');
      if (success) {
        setShowPremiumModal(false);
        setModalMessage(t('premiumActivated'));
        setShowSuccessModal(true);
      } else {
        setModalMessage(t('error'));
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('[Profile] Monthly subscription failed:', error);
      setModalMessage(t('error'));
      setShowErrorModal(true);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCancelPremium = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCancelConfirmModal(true);
  };

  const confirmCancelPremium = async () => {
    setShowCancelConfirmModal(false);
    setIsCancelling(true);
    try {
      const success = await cancelPremium();
      if (success) {
        setModalMessage(t('cancelPremium'));
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

  const handlePromoCodePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPromoModal(true);
  };

  const getPremiumStatusText = () => {
    if (premiumStatus.type === 'Lifetime') {
      return t('premiumForever');
    } else if (premiumStatus.type === 'Trial' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const daysText = t('days');
      return `${t('trial')} (${daysLeft} ${daysText})`;
    } else if (premiumStatus.type === 'Monthly' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const daysText = t('days');
      return `${t('premiumActive')} (${daysLeft} ${daysText})`;
    } else if (premiumStatus.type === 'Expired') {
      return t('premiumExpired');
    } else {
      return `Premium: ${t('premiumNo')}`;
    }
  };

  const currentLanguageText = language === 'de' ? 'Deutsch' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Español';
  const premiumStatusText = getPremiumStatusText();

  return (
    <View style={styles.container}>
      <View style={styles.safeZone} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

        <Animated.View style={[styles.premiumCodeSection, { opacity: fadeAnims.code }]}>
          <Text style={styles.premiumCodeLabel}>{t('enterPremiumCode')}</Text>
          <View style={styles.premiumCodeRow}>
            <TextInput
              style={styles.premiumCodeInput}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder={t('premiumCodePlaceholder')}
              placeholderTextColor="#666666"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.applyCodeButton} 
              onPress={handleApplyCode}
              activeOpacity={0.8}
            >
              <Text style={styles.applyCodeButtonText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.menuSection, { opacity: fadeAnims.menu }]}>
          <TouchableOpacity 
            style={styles.menuItem} 
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
              onPress={handleCancelPremium}
              activeOpacity={0.7}
<<<<<<< HEAD
              disabled={isCancelling}
=======
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCancelConfirmModal(true);
              }}
>>>>>>> origin/main
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
            style={styles.menuItem} 
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
            style={styles.menuItem} 
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
            style={styles.menuItem} 
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
            style={styles.menuItem} 
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
            style={styles.menuItem} 
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
            style={styles.menuItem} 
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
            style={[styles.menuItem, styles.promoButton]} 
            onPress={handlePromoCodePress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="card-giftcard" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>Promo Code</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.madeWithText}>Made with ❤️</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showLegalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLegalModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('legal')}</Text>
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
              Easy Budget 10{'\n'}
              Ivan Mirosnic{'\n'}
              Ahornstrasse{'\n'}
              8600 Dübendorf{'\n'}
              CH - Switzerland
            </Text>

            <Text style={styles.sectionTitle}>{t('privacyPolicy')}</Text>
            <Text style={styles.sectionText}>
              Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert.
            </Text>
            <Text style={styles.sectionText}>
              Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern. Es werden keine Benutzerdaten gesammelt - nur Ihre Eingaben werden lokal gespeichert.
            </Text>
            <Text style={styles.sectionText}>
              Die App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.
            </Text>

            <Text style={styles.sectionTitle}>{t('termsOfUse')}</Text>
            <Text style={styles.sectionText}>
              Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:
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
              1. Geltungsbereich: Diese AGB gelten für die Nutzung der Easy Budget 10 App.{'\n\n'}
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

      <Modal
        visible={showPremiumModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.premiumModal}>
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
              <View style={styles.premiumFeature}>
                <Text style={styles.premiumFeatureText}>• {t('unlimitedSubscriptions')}</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Text style={styles.premiumFeatureText}>• {t('unlimitedExpenses')}</Text>
              </View>
              <View style={styles.premiumFeature}>
                <Text style={styles.premiumFeatureText}>• {t('unlimitedMonths')}</Text>
              </View>
            </View>

            {purchaseError ? (
              <Text style={styles.purchaseErrorText}>{purchaseError}</Text>
            ) : null}
            {purchaseSuccess ? (
              <Text style={styles.purchaseSuccessText}>{purchaseSuccess}</Text>
            ) : null}

            <View style={styles.premiumPricing}>
              <View style={styles.pricingOption}>
                <Text style={styles.pricingTitle}>{t('oneTimePayment')}</Text>
                <Text style={styles.pricingAmount}>CHF 10.00</Text>
                <TouchableOpacity 
<<<<<<< HEAD
                  style={[styles.pricingButton, isPurchasing && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  onPress={handleOneTimePayment}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
=======
                  style={[styles.pricingButton, purchaseLoading && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  disabled={purchaseLoading}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    console.log('[API] One-time lifetime payment initiated');
                    setPurchaseLoading(true);
                    setPurchaseError(null);
                    setPurchaseSuccess(null);
                    try {
                      const success = await purchasePremium('lifetime');
                      if (success) {
                        setPurchaseSuccess(t('premiumActivated'));
                        setTimeout(() => {
                          setShowPremiumModal(false);
                          setPurchaseSuccess(null);
                        }, 1500);
                      }
                    } catch (err: any) {
                      console.error('[API] Lifetime purchase failed:', err);
                      setPurchaseError(err?.message || t('error'));
                    } finally {
                      setPurchaseLoading(false);
                    }
                  }}
                >
                  {purchaseLoading ? (
>>>>>>> origin/main
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.pricingButtonText}>{t('pay')}</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.orText}>{t('or')}</Text>

              <View style={styles.pricingOption}>
                <Text style={styles.pricingTitle}>{t('monthlySubscription')}</Text>
                <Text style={styles.pricingAmount}>CHF 1.00/{t('month')}</Text>
                <TouchableOpacity 
<<<<<<< HEAD
                  style={[styles.pricingButton, isPurchasing && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  onPress={handleMonthlySubscription}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? (
=======
                  style={[styles.pricingButton, purchaseLoading && styles.pricingButtonDisabled]}
                  activeOpacity={0.8}
                  disabled={purchaseLoading}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    console.log('[API] Monthly subscription initiated');
                    setPurchaseLoading(true);
                    setPurchaseError(null);
                    setPurchaseSuccess(null);
                    try {
                      const success = await purchasePremium('monthly');
                      if (success) {
                        setPurchaseSuccess(t('premiumActivated'));
                        setTimeout(() => {
                          setShowPremiumModal(false);
                          setPurchaseSuccess(null);
                        }, 1500);
                      }
                    } catch (err: any) {
                      console.error('[API] Monthly purchase failed:', err);
                      setPurchaseError(err?.message || t('error'));
                    } finally {
                      setPurchaseLoading(false);
                    }
                  }}
                >
                  {purchaseLoading ? (
>>>>>>> origin/main
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.pricingButtonText}>{t('pay')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDonationModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowDonationModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.donationModal}>
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
                    setCustomDonationAmount('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.donationAmountText,
                    selectedDonationAmount === amount && styles.donationAmountTextSelected,
                  ]}>
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customAmountContainer}>
              <Text style={styles.customAmountLabel}>CHF {t('customAmount')}</Text>
              <TextInput
                style={styles.customAmountInput}
                value={customDonationAmount}
                onChangeText={(text) => {
                  setCustomDonationAmount(text);
                  setSelectedDonationAmount(0);
                }}
                placeholder="0"
                placeholderTextColor="#666666"
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity 
              style={styles.donateButton}
              onPress={handleDonation}
              activeOpacity={0.8}
            >
              <MaterialIcons name="favorite" size={14} color="#FFFFFF" />
              <Text style={styles.donateButtonText}>
                {t('donate')} CHF {customDonationAmount || selectedDonationAmount}.00
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPromoModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.promoModal}>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPromoModal(false);
              }}
            >
              <MaterialIcons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.promoIconContainer}>
              <MaterialIcons name="card-giftcard" size={40} color="#BFFE84" />
            </View>

            <Text style={styles.promoModalTitle}>{t('promoCodeTitle')}</Text>
            <Text style={styles.promoModalMessage}>{t('promoCodeMessage')}</Text>

            <View style={styles.promoCodeBox}>
              <Text style={styles.promoCodeText}>easy2</Text>
            </View>

            <TouchableOpacity 
              style={styles.promoOkButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPromoModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.promoOkButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

<<<<<<< HEAD
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
          <View style={styles.feedbackModal}>
            <View style={styles.feedbackIconContainer}>
              <MaterialIcons name="check-circle" size={40} color="#BFFE84" />
            </View>
            <Text style={styles.feedbackTitle}>{t('success')}</Text>
            <Text style={styles.feedbackMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowSuccessModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.feedbackButtonText}>OK</Text>
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
          <View style={styles.feedbackModal}>
            <View style={[styles.feedbackIconContainer, styles.errorIconContainer]}>
              <MaterialIcons name="error" size={40} color="#FF3B30" />
            </View>
            <Text style={styles.feedbackTitle}>{t('error')}</Text>
            <Text style={styles.feedbackMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.errorButton]}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowErrorModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.feedbackButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancel Confirm Modal */}
=======
>>>>>>> origin/main
      <Modal
        visible={showCancelConfirmModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCancelConfirmModal(false)}
      >
        <View style={styles.centeredModalOverlay}>
<<<<<<< HEAD
          <View style={styles.feedbackModal}>
            <View style={[styles.feedbackIconContainer, styles.errorIconContainer]}>
              <MaterialIcons name="cancel" size={40} color="#FF3B30" />
            </View>
            <Text style={styles.feedbackTitle}>{t('cancelPremium')}</Text>
            <Text style={styles.feedbackMessage}>{t('cancelSubscription')}</Text>
            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                style={[styles.feedbackButton, styles.cancelConfirmButton]}
=======
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
              {language === 'de' ? 'Möchtest du dein Premium-Abo wirklich beenden?' :
               language === 'fr' ? 'Voulez-vous vraiment annuler votre abonnement Premium?' :
               language === 'es' ? '¿Realmente deseas cancelar tu suscripción Premium?' :
               'Do you really want to cancel your Premium subscription?'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.promoOkButton, { flex: 1, backgroundColor: '#2C2C2E' }]}
>>>>>>> origin/main
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowCancelConfirmModal(false);
                }}
                activeOpacity={0.8}
              >
<<<<<<< HEAD
                <Text style={[styles.feedbackButtonText, styles.cancelConfirmButtonText]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, styles.errorButton]}
                onPress={confirmCancelPremium}
                activeOpacity={0.8}
              >
                <Text style={styles.feedbackButtonText}>{t('delete')}</Text>
=======
                <Text style={[styles.promoOkButtonText, { color: '#FFFFFF' }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.promoOkButton, { flex: 1, backgroundColor: '#FF3B30' }]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowCancelConfirmModal(false);
                  try {
                    console.log('[API] Cancelling premium subscription...');
                    const success = await cancelPremium();
                    if (success) {
                      Alert.alert(t('success'), language === 'de' ? 'Premium wurde beendet.' :
                        language === 'fr' ? 'Premium a été annulé.' :
                        language === 'es' ? 'Premium ha sido cancelado.' :
                        'Premium has been cancelled.');
                    }
                  } catch (err: any) {
                    console.error('[API] Cancel premium failed:', err);
                    Alert.alert(t('error'), err?.message || t('error'));
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.promoOkButtonText}>{t('delete')}</Text>
>>>>>>> origin/main
              </TouchableOpacity>
            </View>
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
  safeZone: {
    height: 60,
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
  premiumCodeSection: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 2,
  },
  premiumCodeLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  premiumCodeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  premiumCodeInput: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  applyCodeButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCodeButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
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
    paddingTop: 60,
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
  premiumFeature: {
    marginBottom: 4,
  },
  premiumFeatureText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20,
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
<<<<<<< HEAD
  feedbackModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
  },
  feedbackIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(191, 254, 132, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIconContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  feedbackTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackMessage: {
    fontSize: 15,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  feedbackButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 100,
  },
  errorButton: {
    backgroundColor: '#FF3B30',
  },
  feedbackButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  confirmButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelConfirmButton: {
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#666666',
  },
  cancelConfirmButtonText: {
    color: '#FFFFFF',
=======
  purchaseErrorText: {
    fontSize: 13,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  purchaseSuccessText: {
    fontSize: 13,
    color: '#BFFE84',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
>>>>>>> origin/main
  },
});
