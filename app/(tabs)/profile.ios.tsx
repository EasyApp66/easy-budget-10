
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
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import * as MailComposer from 'expo-mail-composer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBudget } from '@/contexts/BudgetContext';

export default function ProfileScreen() {
  const { premiumStatus, applyPremiumCode } = useBudget();
  const { language, setLanguage, t } = useLanguage();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(5);
  const [customDonationAmount, setCustomDonationAmount] = useState('');

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
    const newLang = language === 'de' ? 'en' : 'de';
    console.log('Language toggle pressed, switching to:', newLang);
    setLanguage(newLang);
  };

  const handleApplyCode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Applying premium code:', codeInput);
    
    if (!codeInput.trim()) {
      Alert.alert(t('error'), t('enterCode'));
      return;
    }

    const success = await applyPremiumCode(codeInput.trim());
    
    if (success) {
      Alert.alert(t('success'), t('premiumActivated'));
      setCodeInput('');
    } else {
      Alert.alert(t('error'), t('invalidCode'));
    }
  };

  const handleDonation = async (amount: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Donation selected:', amount);
    Alert.alert(t('thankYou'), t('donationThankYou'));
    setShowDonationModal(false);
  };

  const getPremiumStatusText = () => {
    if (premiumStatus.type === 'Lifetime') {
      return t('premiumForever');
    } else if (premiumStatus.type === 'Trial' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `${t('trial')} (${daysLeft} ${t('daysLeft')})`;
    } else if (premiumStatus.type === 'Monthly' && premiumStatus.endDate) {
      const daysLeft = Math.ceil((new Date(premiumStatus.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `${t('premiumActive')} (${daysLeft} ${t('daysLeft')})`;
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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol android_material_icon_name="person" ios_icon_name="person.fill" size={60} color="#000000" />
          </View>
          <Text style={styles.username}>mirosnic.ivan</Text>
          <Text style={styles.premiumBadge}>{premiumStatusText}</Text>
        </View>

        <View style={styles.premiumCodeSection}>
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
        </View>

        <View style={styles.menuSection}>
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
              <Text style={styles.menuItemText}>{t('changeLanguage')}: {currentLanguageText}</Text>
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
        </View>

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
              {t('privacyText1')}
            </Text>
            <Text style={styles.sectionText}>
              {t('privacyText2')}
            </Text>

            <Text style={styles.sectionTitle}>{t('termsOfUse')}</Text>
            <Text style={styles.sectionText}>
              {t('termsText1')}
            </Text>
            <Text style={styles.sectionText}>
              {t('termsText2')}
            </Text>
            <Text style={styles.sectionText}>
              {t('termsText3')}
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
              <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.premiumIconContainer}>
              <IconSymbol android_material_icon_name="star" ios_icon_name="star.fill" size={60} color="#BFFE84" />
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
              <IconSymbol android_material_icon_name="close" ios_icon_name="xmark" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.donationIconContainer}>
              <IconSymbol android_material_icon_name="favorite" ios_icon_name="heart.fill" size={60} color="#FF3B30" />
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
              onPress={() => handleDonation(customDonationAmount || selectedDonationAmount.toString())}
              activeOpacity={0.8}
            >
              <IconSymbol android_material_icon_name="favorite" ios_icon_name="heart.fill" size={20} color="#FFFFFF" />
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
    height: 20,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
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
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
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
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeModalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(191, 254, 132, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  premiumModalTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  premiumModalSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  premiumFeatures: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  premiumFeature: {
    marginBottom: 12,
  },
  premiumFeatureText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  premiumPricing: {
    gap: 20,
  },
  pricingOption: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#BFFE84',
  },
  pricingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  pricingAmount: {
    fontSize: 24,
    color: '#BFFE84',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  pricingButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  pricingButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '600',
  },
  donationModal: {
    backgroundColor: '#2C2C2E',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  donationIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  donationModalTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  donationModalSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  donationAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  donationAmountButton: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  donationAmountButtonSelected: {
    backgroundColor: '#BFFE84',
  },
  donationAmountText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  donationAmountTextSelected: {
    color: '#000000',
  },
  customAmountContainer: {
    marginBottom: 24,
  },
  customAmountLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  customAmountInput: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  donateButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  donateButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
