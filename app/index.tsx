
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useBudget } from '@/contexts/BudgetContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { hasSeenWelcome, setHasSeenWelcome } = useBudget();
  const [showLegalModal, setShowLegalModal] = React.useState(false);

  useEffect(() => {
    console.log('WelcomeScreen mounted, hasSeenWelcome:', hasSeenWelcome);
    if (hasSeenWelcome) {
      console.log('User has seen welcome, redirecting to budget...');
      router.replace('/(tabs)/budget');
    }
  }, [hasSeenWelcome]);

  const handleGoPress = () => {
    console.log('Go button pressed');
    setHasSeenWelcome(true);
    router.replace('/(tabs)/budget');
  };

  const handleLegalPress = () => {
    console.log('Legal link pressed');
    setShowLegalModal(true);
  };

  const closeLegalModal = () => {
    console.log('Legal modal closed');
    setShowLegalModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.helloText}>Hallo</Text>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>Hi! Ich bin </Text>
          <Text style={styles.titleGreen}>Easy Budget</Text>
          <Text style={styles.titleWhite}>!</Text>
        </View>

        <Text style={styles.subtitle}>
          Behalte alle Ausgaben und Abos in einem Blick.
        </Text>

        <TouchableOpacity style={styles.goButton} onPress={handleGoPress}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLegalPress}>
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
          
          <ScrollView style={styles.modalContent}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  helloText: {
    fontSize: 24,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  titleWhite: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titleGreen: {
    fontSize: 42,
    color: '#34C759',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 28,
  },
  goButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 80,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 30,
  },
  goButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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
    color: '#34C759',
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
