
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, TextInput, Alert, Animated } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBudget } from '@/contexts/BudgetContext';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_NAME_KEY = '@easy_budget_username';

export default function ProfileScreen() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [premiumCode, setPremiumCode] = useState('');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(5);
  const [customDonationAmount, setCustomDonationAmount] = useState('');
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  
  const { language, setLanguage, t } = useLanguage();
  const { premiumStatus, applyPremiumCode } = useBudget();

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
    setShowLegalModal(true);
  };

  const handlePremiumPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPremiumModal(true);
  };

  const handleDonationPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDonationModal(true);
  };

  const handleSupportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['ivanmirosnic006@gmail.com'],
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
        recipients: ['ivanmirosnic006@gmail.com'],
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
        recipients: ['ivanmirosnic006@gmail.com'],
        subject: t('suggestionSubject'),
        body: t('suggestionBody'),
      });
    } else {
      Alert.alert(t('error'), t('emailNotAvailable'));
    }
  };

  const handleLanguageToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
  };

  const handleApplyCode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (premiumCode.trim()) {
      const success = await applyPremiumCode(premiumCode.trim());
      if (success) {
        Alert.alert(t('success'), t('premiumActivated'));
        setPremiumCode('');
      } else {
        Alert.alert(t('error'), t('invalidCode'));
      }
    }
  };

  const handleDonation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const amount = customDonationAmount ? parseFloat(customDonationAmount) : selectedDonationAmount;
    console.log('Donation amount:', amount);
    Alert.alert(t('thankYou'), t('donationThankYou'));
    setShowDonationModal(false);
  };

  const getPremiumStatusText = () => {
    if (premiumStatus.type === 'Lifetime') {
      return t('premiumForever');
    } else if (premiumStatus.type === 'Trial' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const daysText = t('days');
      return `${t('premiumTrial')}: ${daysLeft} ${daysText}`;
    } else if (premiumStatus.type === 'Monthly' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const daysText = t('days');
      return `${t('premiumMonthly')}: ${daysLeft} ${daysText}`;
    } else if (premiumStatus.type === 'Expired') {
      return t('premiumExpired');
    } else {
      return t('premiumNo');
    }
  };

  const currentLanguageText = language === 'de' ? 'Deutsch' : 'English';
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
            <IconSymbol android_material_icon_name="person" ios_icon_name="person.fill" size={60} color="#000000" />
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
              value={premiumCode}
              onChangeText={setPremiumCode}
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
              <IconSymbol android_material_icon_name="star" ios_icon_name="star.fill" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('getPremium')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          {premiumStatus.hasAppleSubscription && (
            <TouchableOpacity 
              style={styles.menuItem} 
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol android_material_icon_name="cancel" ios_icon_name="xmark.circle" size={24} color="#FF3B30" />
                <Text style={styles.menuItemText}>{t('cancelPremium')}</Text>
              </View>
              <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleLanguageToggle}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="language" ios_icon_name="globe" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('language')}: {currentLanguageText}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleLegalPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="description" ios_icon_name="doc.text" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('legal')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleSupportPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="help" ios_icon_name="questionmark.circle" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('support')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleBugReportPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="bug-report" ios_icon_name="ant" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('reportBug')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleSuggestionPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="lightbulb" ios_icon_name="lightbulb" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('suggestion')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleDonationPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="favorite" ios_icon_name="heart.fill" size={24} color="#FF3B30" />
              <Text style={styles.menuItemText}>{t('donation')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
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
              <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.premiumIconContainer}>
              <IconSymbol android_material_icon_name="star" ios_icon_name="star.fill" size={32} color="#BFFE84" />
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
                <Text style={styles.pricingAmount}>CHF 10.00</Text>
                <TouchableOpacity 
                  style={styles.pricingButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.pricingButtonText}>{t('pay')}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.orText}>{t('or')}</Text>

              <View style={styles.pricingOption}>
                <Text style={styles.pricingTitle}>{t('monthlySubscription')}</Text>
                <Text style={styles.pricingAmount}>CHF 1.00/{t('month')}</Text>
                <TouchableOpacity 
                  style={styles.pricingButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.pricingButtonText}>{t('pay')}</Text>
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
              <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.donationIconContainer}>
              <IconSymbol android_material_icon_name="favorite" ios_icon_name="heart.fill" size={32} color="#FF3B30" />
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
              <IconSymbol android_material_icon_name="favorite" ios_icon_name="heart.fill" size={14} color="#FFFFFF" />
              <Text style={styles.donateButtonText}>
                {t('donate')} CHF {customDonationAmount || selectedDonationAmount}.00
              </Text>
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
  safeZone: {
    height: 60,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 0,
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
    marginHorizontal: 0,
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
    marginHorizontal: 0,
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
    padding: 18,
    width: '100%',
    maxWidth: 360,
    maxHeight: '60%',
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
    marginBottom: 10,
  },
  premiumModalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  premiumModalSubtitle: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 14,
  },
  premiumFeatures: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  premiumFeatureText: {
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 16,
    marginBottom: 3,
  },
  premiumPricing: {
    gap: 10,
  },
  pricingOption: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  pricingTitle: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 3,
  },
  pricingAmount: {
    fontSize: 15,
    color: '#BFFE84',
    fontWeight: 'bold',
    marginBottom: 7,
  },
  pricingButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 10,
    padding: 9,
    alignItems: 'center',
  },
  pricingButtonText: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '600',
  },
  donationModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 18,
    width: '100%',
    maxWidth: 360,
    maxHeight: '58%',
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
    marginBottom: 10,
  },
  donationModalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  donationModalSubtitle: {
    fontSize: 11,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 14,
  },
  donationAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 5,
  },
  donationAmountButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  donationAmountButtonSelected: {
    backgroundColor: '#BFFE84',
  },
  donationAmountText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  donationAmountTextSelected: {
    color: '#000000',
  },
  customAmountContainer: {
    marginBottom: 14,
  },
  customAmountLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 7,
    fontWeight: '600',
  },
  customAmountInput: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  donateButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  donateButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
