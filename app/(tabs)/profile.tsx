
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileScreen() {
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalSection, setLegalSection] = useState<'terms' | 'privacy' | 'imprint'>('terms');
  const { language, setLanguage, t } = useLanguage();

  const handleLegalPress = async (section: 'terms' | 'privacy' | 'imprint') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLegalSection(section);
    setShowLegalModal(true);
  };

  const handleSupportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = 'ivanmirosnic006@gmail.com';
    const subject = t('supportSubject');
    const body = t('supportBody');
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening email:', error);
    }
  };

  const handleBugReportPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = 'ivanmirosnic006@gmail.com';
    const subject = t('bugReportSubject');
    const body = t('bugReportBody');
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening email:', error);
    }
  };

  const handleLanguageToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
  };

  const currentLanguageText = language === 'de' ? 'Deutsch' : 'English';

  return (
    <View style={styles.container}>
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
          <Text style={styles.premiumBadge}>{t('premiumYes')}</Text>
        </View>

        <View style={styles.menuSection}>
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
            onPress={() => handleLegalPress('terms')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="description" ios_icon_name="doc.text" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('termsOfUse')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleLegalPress('privacy')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="lock" ios_icon_name="lock.fill" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('privacyPolicy')}</Text>
            </View>
            <IconSymbol android_material_icon_name="chevron-right" ios_icon_name="chevron.right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleLegalPress('imprint')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <IconSymbol android_material_icon_name="info" ios_icon_name="info.circle" size={24} color="#BFFE84" />
              <Text style={styles.menuItemText}>{t('imprint')}</Text>
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
            {legalSection === 'imprint' && (
              <>
                <Text style={styles.sectionTitle}>{t('imprint')}</Text>
                <Text style={styles.sectionText}>
                  Easy Budget 10{'\n'}
                  Ivan Mirosnic{'\n'}
                  Ahornstrasse{'\n'}
                  8600 Dübendorf{'\n'}
                  CH - Switzerland
                </Text>
              </>
            )}

            {legalSection === 'privacy' && (
              <>
                <Text style={styles.sectionTitle}>{t('privacyPolicy')}</Text>
                <Text style={styles.sectionText}>
                  {t('privacyText1')}
                </Text>
                <Text style={styles.sectionText}>
                  {t('privacyText2')}
                </Text>
              </>
            )}

            {legalSection === 'terms' && (
              <>
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
              </>
            )}
          </ScrollView>
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
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
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
});
