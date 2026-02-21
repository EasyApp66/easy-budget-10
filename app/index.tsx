
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useBudget } from '@/contexts/BudgetContext';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasSeenWelcome, setHasSeenWelcome } = useBudget();
  const { t } = useLanguage();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    console.log('WelcomeScreen mounted, hasSeenWelcome:', hasSeenWelcome);
    if (hasSeenWelcome) {
      console.log('User has seen welcome, redirecting to budget...');
      router.replace('/(tabs)/budget');
    }
  }, [hasSeenWelcome, router]);

  useEffect(() => {
    if (showLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        setHasSeenWelcome(true);
        router.replace('/(tabs)/budget');
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [showLoading, fadeAnim, scaleAnim, router, setHasSeenWelcome]);

  const handleGoPress = async () => {
    console.log('Go button pressed');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLoading(true);
  };

  const handleLegalPress = async () => {
    console.log('Legal link pressed');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLegalModal(true);
  };

  const closeLegalModal = async () => {
    console.log('Legal modal closed');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowLegalModal(false);
  };

  if (showLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.loadingContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.loadingText}>EASY BUDGET</Text>
        </Animated.View>
      </View>
    );
  }

  const hiIAmText = t('hiIAm');
  const easyBudgetText = t('easyBudget');
  const keepTrackText = t('keepTrack');
  const expensesText = t('expenses');
  const andText = t('and');
  const subscriptionsText = t('subscriptions');
  const inOneGlanceText = t('inOneGlance');
  const goText = t('go');
  const privacyText = t('privacy');
  const termsText = t('terms');
  const agbText = t('agb');
  const twoWeeksPremiumText = t('twoWeeksPremium');

  return (
    <View style={styles.container}>
      <View style={styles.safeZone} />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>{hiIAmText} </Text>
          <Text style={styles.titleGreen}>{easyBudgetText}</Text>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {keepTrackText} <Text style={styles.subtitleGreen}>{expensesText}</Text> {andText} <Text style={styles.subtitleGreen}>{subscriptionsText}</Text> {inOneGlanceText}
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.premiumText}>{twoWeeksPremiumText}</Text>
        
        <TouchableOpacity 
          style={styles.goButton} 
          onPress={handleGoPress}
          activeOpacity={0.8}
        >
          <Text style={styles.goButtonText}>{goText}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLegalPress} activeOpacity={0.7}>
          <Text style={styles.legalText}>
            {privacyText} · {termsText} · {agbText}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showLegalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeLegalModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('legal')}</Text>
            <TouchableOpacity onPress={closeLegalModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  safeZone: {
    height: 20,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  titleWhite: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 50,
  },
  titleGreen: {
    fontSize: 40,
    color: '#BFFE84',
    fontWeight: 'bold',
    lineHeight: 50,
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 36,
  },
  subtitleGreen: {
    color: '#BFFE84',
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
  },
  premiumText: {
    fontSize: 14,
    color: '#BFFE84',
    marginBottom: 12,
    textAlign: 'center',
  },
  goButton: {
    backgroundColor: '#BFFE84',
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  goButtonText: {
    fontSize: 28,
    color: '#000000',
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 9,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 28,
    color: '#BFFE84',
    fontWeight: 'bold',
    letterSpacing: 2,
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
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
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
