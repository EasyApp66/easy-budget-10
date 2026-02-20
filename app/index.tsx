
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useBudget } from '@/contexts/BudgetContext';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasSeenWelcome, setHasSeenWelcome } = useBudget();
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
  }, [hasSeenWelcome]);

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
  }, [showLoading]);

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

  const ausgabenText = 'Ausgaben';
  const abosText = 'Abos';
  const fullText = 'Behalte alle Ausgaben und Abos in einem Blick.';
  const beforeAusgaben = 'Behalte alle ';
  const afterAusgaben = ' und ';
  const afterAbos = ' in einem Blick.';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>Hi ich bin </Text>
          <Text style={styles.titleGreen}>EASY BUDGET</Text>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {beforeAusgaben}
            <Text style={styles.subtitleGreen}>{ausgabenText}</Text>
            {afterAusgaben}
            <Text style={styles.subtitleGreen}>{abosText}</Text>
            {afterAbos}
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.goButton} 
          onPress={handleGoPress}
          activeOpacity={0.8}
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLegalPress} activeOpacity={0.7}>
          <Text style={styles.legalText}>
            Datenschutz · Nutzungsbedingungen · AGB
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
            <Text style={styles.modalTitle}>Rechtliches</Text>
            <TouchableOpacity onPress={closeLegalModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Schliessen</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Datenschutzerklärung</Text>
            <Text style={styles.sectionText}>
              Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert. Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern.
            </Text>
            <Text style={styles.sectionText}>
              Die App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.
            </Text>

            <Text style={styles.sectionTitle}>Nutzungsbedingungen</Text>
            <Text style={styles.sectionText}>
              Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:
            </Text>
            <Text style={styles.sectionText}>
              1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.{'\n'}
              2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.{'\n'}
              3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.{'\n'}
              4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.
            </Text>

            <Text style={styles.sectionTitle}>Allgemeine Geschäftsbedingungen</Text>
            <Text style={styles.sectionText}>
              Easy Budget 10 ist eine kostenlose Anwendung zur persönlichen Budgetverwaltung. Die Nutzung erfolgt auf eigene Verantwortung.
            </Text>
            <Text style={styles.sectionText}>
              Änderungen: Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen werden in der App bekannt gegeben.
            </Text>
            <Text style={styles.sectionText}>
              Anwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.
            </Text>

            <Text style={styles.sectionTitle}>Datensammlung</Text>
            <Text style={styles.sectionText}>
              Easy Budget 10 sammelt keine personenbezogenen Daten. Die App:
            </Text>
            <Text style={styles.sectionText}>
              • Speichert alle Daten lokal auf Ihrem Gerät{'\n'}
              • Verwendet keine Analyse- oder Tracking-Tools{'\n'}
              • Sendet keine Daten an externe Server{'\n'}
              • Benötigt keine Registrierung oder Anmeldung{'\n'}
              • Greift nicht auf Ihre Kontakte, Fotos oder andere persönliche Informationen zu
            </Text>
            <Text style={styles.sectionText}>
              Ihre Finanzdaten bleiben vollständig privat und werden niemals mit Dritten geteilt.
            </Text>

            <Text style={styles.sectionTitle}>Kontakt</Text>
            <Text style={styles.sectionText}>
              Bei Fragen zu diesen Bedingungen kontaktieren Sie uns bitte über den App Store.
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  titleWhite: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 58,
  },
  titleGreen: {
    fontSize: 48,
    color: '#BFFE84',
    fontWeight: 'bold',
    lineHeight: 58,
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 38,
  },
  subtitleGreen: {
    color: '#BFFE84',
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: 'center',
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
    fontSize: 13,
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
    fontSize: 56,
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
