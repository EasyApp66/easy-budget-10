
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  premiumStatus: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  premiumLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  premiumValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BFFE84',
  },
  codeInputContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  codeInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  menuItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalText: {
    fontSize: 15,
    color: '#E5E5E7',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BFFE84',
    marginTop: 20,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  premiumModalContent: {
    alignItems: 'center',
  },
  premiumIcon: {
    marginBottom: 20,
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BFFE84',
    marginBottom: 12,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 30,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  priceContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginVertical: 24,
    width: '100%',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BFFE84',
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  restoreButton: {
    marginTop: 16,
    padding: 12,
  },
  restoreButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  donationModalContent: {
    alignItems: 'center',
  },
  donationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BFFE84',
    marginBottom: 16,
    textAlign: 'center',
  },
  donationText: {
    fontSize: 16,
    color: '#E5E5E7',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  donationButton: {
    backgroundColor: '#BFFE84',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  donationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default function ProfileScreen() {
  const { premiumStatus, applyPremiumCode } = useBudget();
  const { language, setLanguage, t } = useLanguage();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('premiumStatus')}</Text>
          <View style={styles.premiumStatus}>
            <Text style={styles.premiumLabel}>{t('status')}</Text>
            <Text style={styles.premiumValue}>{getPremiumStatusText()}</Text>
          </View>

          <View style={styles.codeInputContainer}>
            <Text style={styles.codeLabel}>{t('enterPremiumCode')}</Text>
            <View style={styles.codeInputRow}>
              <TextInput
                style={styles.codeInput}
                value={codeInput}
                onChangeText={setCodeInput}
                placeholder={t('codePlaceholder')}
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyCode}>
                <Text style={styles.applyButtonText}>{t('apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('premium')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handlePremiumPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('getPremium')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>

          {premiumStatus.hasAppleSubscription && (
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  ios_icon_name="xmark.circle"
                  android_material_icon_name="cancel"
                  size={24}
                  color="#FF3B30"
                />
                <Text style={styles.menuItemText}>{t('cancelSubscription')}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color="#8E8E93"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleSupportPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="questionmark.circle"
                android_material_icon_name="help"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('support')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleBugReportPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="ant.circle"
                android_material_icon_name="bug-report"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('reportBug')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSuggestionPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="lightbulb"
                android_material_icon_name="lightbulb"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('suggestion')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleDonationPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('donation')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguageToggle}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="globe"
                android_material_icon_name="language"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>
                {t('changeLanguage')} ({language === 'de' ? 'Deutsch' : 'English'})
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('legal')}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleLegalPress}>
            <View style={styles.menuItemLeft}>
              <IconSymbol
                ios_icon_name="doc.text"
                android_material_icon_name="description"
                size={24}
                color="#BFFE84"
              />
              <Text style={styles.menuItemText}>{t('legal')}</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLegalModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLegalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('legal')}</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalSectionTitle}>{t('impressum')}</Text>
              <Text style={styles.modalText}>
                Ivan Mirosnic{'\n'}
                Ahornstrasse{'\n'}
                8600 Dübendorf{'\n'}
                CH - Switzerland{'\n\n'}
                E-Mail: ivanmirosnic006@gmail.com
              </Text>

              <Text style={styles.modalSectionTitle}>{t('privacy')}</Text>
              <Text style={styles.modalText}>
                {t('privacyText')}
              </Text>

              <Text style={styles.modalSectionTitle}>{t('terms')}</Text>
              <Text style={styles.modalText}>
                {t('termsText')}
              </Text>

              <Text style={styles.modalSectionTitle}>{t('agb')}</Text>
              <Text style={styles.modalText}>
                {t('agbText')}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowLegalModal(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPremiumModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.premiumModalContent}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={64}
                color="#BFFE84"
                style={styles.premiumIcon}
              />
              <Text style={styles.premiumTitle}>{t('premiumTitle')}</Text>
              <Text style={styles.premiumSubtitle}>{t('premiumSubtitle')}</Text>

              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24}
                  color="#BFFE84"
                />
                <Text style={styles.featureText}>{t('feature1')}</Text>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24}
                  color="#BFFE84"
                />
                <Text style={styles.featureText}>{t('feature2')}</Text>
              </View>

              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check-circle"
                  size={24}
                  color="#BFFE84"
                />
                <Text style={styles.featureText}>{t('feature3')}</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>{t('monthlyPrice')}</Text>
                <Text style={styles.priceValue}>CHF 4.99</Text>
              </View>

              <TouchableOpacity style={styles.subscribeButton} onPress={() => setShowPremiumModal(false)}>
                <Text style={styles.subscribeButtonText}>{t('subscribe')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.restoreButton} onPress={() => setShowPremiumModal(false)}>
                <Text style={styles.restoreButtonText}>{t('restorePurchases')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDonationModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDonationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.donationModalContent}>
              <Text style={styles.donationTitle}>{t('donationTitle')}</Text>
              <Text style={styles.donationText}>{t('donationText')}</Text>

              <TouchableOpacity style={styles.donationButton} onPress={() => handleDonation('CHF 2')}>
                <Text style={styles.donationButtonText}>CHF 2</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.donationButton} onPress={() => handleDonation('CHF 5')}>
                <Text style={styles.donationButtonText}>CHF 5</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.donationButton} onPress={() => handleDonation('CHF 10')}>
                <Text style={styles.donationButtonText}>CHF 10</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDonationModal(false)}>
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
