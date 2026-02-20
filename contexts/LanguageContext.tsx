
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@easy_budget_language';

const translations = {
  de: {
    // Welcome Screen
    hiIAm: 'HI ICH BIN',
    easyBudget: 'EASY BUDGET',
    keepTrack: 'Behalte alle',
    expenses: 'Ausgaben',
    and: 'und',
    subscriptions: 'Abos',
    inOneGlance: 'in einem Blick.',
    go: 'GO',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    agb: 'AGB',
    
    // Budget Screen
    budget: 'BUDGET',
    total: 'TOTAL',
    remaining: 'BLEIBT',
    newExpense: 'Neue Ausgabe',
    nameExample: 'Name (z.B. ESSEN)',
    amount: 'Betrag',
    add: 'Hinzufügen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    rename: 'Namen anpassen',
    duplicate: 'Duplizieren',
    pin: 'Fixieren',
    unpin: 'Lösen',
    delete: 'Löschen',
    editExpense: 'Ausgabe bearbeiten',
    changeView: 'Ansicht ändern',
    adjustNumber: 'Zahl anpassen',
    
    // Subscriptions Screen
    subscriptionCosts: 'ABO KOSTEN',
    newSubscription: 'Neues Abo',
    subscriptionNameExample: 'Name (z.B. NETFLIX)',
    editSubscription: 'Abo bearbeiten',
    
    // Profile Screen
    profile: 'Profil',
    premiumStatus: 'Premium Status',
    status: 'Status',
    premiumYes: 'Premium: Ja',
    premiumNo: 'Nein',
    premiumExpired: 'Abgelaufen',
    premiumForever: 'Für Immer',
    trial: 'Testversion',
    premiumActive: 'Premium',
    daysLeft: 'Tage übrig',
    premium: 'Premium',
    changeLanguage: 'Sprache ändern',
    termsOfUse: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutz',
    imprint: 'Impressum',
    impressum: 'Impressum',
    support: 'Support',
    reportBug: 'Bug Melden',
    suggestion: 'Vorschlag',
    donation: 'Donation',
    legal: 'Rechtliches',
    close: 'Schliessen',
    getPremium: 'Premium holen',
    cancelSubscription: 'Premium Abo beenden',
    enterPremiumCode: 'Premium Code eingeben',
    codePlaceholder: 'Code eingeben',
    apply: 'Einlösen',
    success: 'Erfolg',
    error: 'Fehler',
    premiumActivated: 'Premium wurde aktiviert!',
    invalidCode: 'Ungültiger Code',
    enterCode: 'Bitte Code eingeben',
    
    // Premium Modal
    premiumTitle: 'Premium holen',
    premiumSubtitle: 'Erhalte unbegrenzte App-Funktionen',
    feature1: 'Unbegrenzte Abo Counter',
    feature2: 'Unbegrenzte Ausgabenliste',
    feature3: 'Unbegrenzte Monate',
    monthlyPrice: 'Monatlicher Preis',
    subscribe: 'Abonnieren',
    restorePurchases: 'Käufe wiederherstellen',
    
    // Donation Modal
    donationTitle: 'Donation',
    donationText: 'Unterstütze die Entwicklung der App mit einer Spende. Jeder Betrag hilft!',
    thankYou: 'Vielen Dank!',
    donationThankYou: 'Danke für deine Unterstützung!',
    
    // Legal Texts
    privacyText: 'Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert. Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern.\n\nDie App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.',
    termsText: 'Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:\n\n1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.\n2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.\n3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.\n4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.\n\nAnwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.',
    agbText: 'Allgemeine Geschäftsbedingungen:\n\n1. Geltungsbereich: Diese AGB gelten für die Nutzung der Easy Budget 10 App.\n\n2. Leistungen: Die App bietet Funktionen zur Verwaltung von Budgets, Ausgaben und Abonnements.\n\n3. Nutzungsrechte: Sie erhalten ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der App.\n\n4. Haftung: Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.\n\n5. Änderungen: Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern.\n\nBei Fragen kontaktieren Sie uns unter: ivanmirosnic006@gmail.com',
  },
  en: {
    // Welcome Screen
    hiIAm: 'HI I AM',
    easyBudget: 'EASY BUDGET',
    keepTrack: 'Keep track of all',
    expenses: 'Expenses',
    and: 'and',
    subscriptions: 'Subscriptions',
    inOneGlance: 'at a glance.',
    go: 'GO',
    privacy: 'Privacy',
    terms: 'Terms of Use',
    agb: 'Terms',
    
    // Budget Screen
    budget: 'BUDGET',
    total: 'TOTAL',
    remaining: 'REMAINING',
    newExpense: 'New Expense',
    nameExample: 'Name (e.g. FOOD)',
    amount: 'Amount',
    add: 'Add',
    cancel: 'Cancel',
    save: 'Save',
    rename: 'Rename',
    duplicate: 'Duplicate',
    pin: 'Pin',
    unpin: 'Unpin',
    delete: 'Delete',
    editExpense: 'Edit Expense',
    changeView: 'Change View',
    adjustNumber: 'Adjust Amount',
    
    // Subscriptions Screen
    subscriptionCosts: 'SUBSCRIPTION COSTS',
    newSubscription: 'New Subscription',
    subscriptionNameExample: 'Name (e.g. NETFLIX)',
    editSubscription: 'Edit Subscription',
    
    // Profile Screen
    profile: 'Profile',
    premiumStatus: 'Premium Status',
    status: 'Status',
    premiumYes: 'Premium: Yes',
    premiumNo: 'No',
    premiumExpired: 'Expired',
    premiumForever: 'Forever',
    trial: 'Trial',
    premiumActive: 'Premium',
    daysLeft: 'days left',
    premium: 'Premium',
    changeLanguage: 'Change Language',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    imprint: 'Imprint',
    impressum: 'Imprint',
    support: 'Support',
    reportBug: 'Report Bug',
    suggestion: 'Suggestion',
    donation: 'Donation',
    legal: 'Legal',
    close: 'Close',
    getPremium: 'Get Premium',
    cancelSubscription: 'Cancel Premium Subscription',
    enterPremiumCode: 'Enter Premium Code',
    codePlaceholder: 'Enter code',
    apply: 'Apply',
    success: 'Success',
    error: 'Error',
    premiumActivated: 'Premium has been activated!',
    invalidCode: 'Invalid code',
    enterCode: 'Please enter code',
    
    // Premium Modal
    premiumTitle: 'Get Premium',
    premiumSubtitle: 'Get unlimited app features',
    feature1: 'Unlimited Subscription Counter',
    feature2: 'Unlimited Expense List',
    feature3: 'Unlimited Months',
    monthlyPrice: 'Monthly Price',
    subscribe: 'Subscribe',
    restorePurchases: 'Restore Purchases',
    
    // Donation Modal
    donationTitle: 'Donation',
    donationText: 'Support the development of the app with a donation. Every amount helps!',
    thankYou: 'Thank You!',
    donationThankYou: 'Thanks for your support!',
    
    // Legal Texts
    privacyText: 'Easy Budget 10 respects your privacy. All your financial data is stored exclusively locally on your device. We do not collect, transmit or store any personal data on external servers.\n\nThe app does not require an internet connection and does not send any data to third parties. Your budgets, expenses and subscriptions remain completely private and under your control.',
    termsText: 'By using Easy Budget 10, you agree to the following terms:\n\n1. The app is provided "as is" without any warranties.\n2. You are responsible for backing up your data.\n3. The app is for informational purposes only and does not replace professional financial advice.\n4. We are not liable for any losses or damages arising from the use of the app.\n\nApplicable Law: These terms are governed by Swiss law. Place of jurisdiction is Zurich, Switzerland.',
    agbText: 'General Terms and Conditions:\n\n1. Scope: These terms apply to the use of the Easy Budget 10 app.\n\n2. Services: The app provides features for managing budgets, expenses and subscriptions.\n\n3. Usage Rights: You receive a non-exclusive, non-transferable right to use the app.\n\n4. Liability: Liability is limited to intent and gross negligence.\n\n5. Changes: We reserve the right to change these terms at any time.\n\nFor questions, contact us at: ivanmirosnic006@gmail.com',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
        console.log('Loaded saved language:', savedLanguage);
      } else {
        const locales = getLocales();
        const deviceLanguage = locales[0]?.languageCode?.startsWith('de') ? 'de' : 'en';
        setLanguageState(deviceLanguage);
        console.log('Using device language:', deviceLanguage);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading language:', error);
      setIsLoaded(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      console.log('Language saved:', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['de']];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
