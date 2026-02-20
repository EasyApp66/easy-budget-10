
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
    premiumYes: 'Premium: Ja',
    premiumNo: 'Premium: Nein',
    premiumExpired: 'Premium: Abgelaufen',
    premiumForever: 'Premium: Für Immer',
    premiumTrial: 'Premium Trial',
    premiumMonthly: 'Premium',
    days: 'Tage',
    changeLanguage: 'Sprache ändern',
    termsOfUse: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutz',
    imprint: 'Impressum',
    support: 'Support',
    reportBug: 'Bug Melden',
    suggestion: 'Vorschlag',
    donation: 'Donation',
    legal: 'Rechtliches',
    close: 'Schliessen',
    getPremium: 'Premium holen',
    cancelPremium: 'Premium Abo beenden',
    enterPremiumCode: 'Premium Code eingeben',
    premiumCodePlaceholder: 'Code eingeben',
    apply: 'Einlösen',
    success: 'Erfolg',
    error: 'Fehler',
    premiumActivated: 'Premium wurde aktiviert!',
    invalidCode: 'Ungültiger Code',
    emailNotAvailable: 'E-Mail App nicht verfügbar',
    
    // Premium Modal
    unlimitedFeatures: 'Erhalte unbegrenzte App-Funktionen:',
    unlimitedSubscriptions: 'Unbegrenzte Abo Counter',
    unlimitedExpenses: 'Unbegrenzte Ausgabenliste',
    unlimitedMonths: 'Unbegrenzte Monate',
    oneTimePayment: 'Einmalige Zahlung',
    monthlySubscription: 'Monatliches Abo',
    pay: 'Bezahlen',
    or: 'ODER',
    month: 'Monat',
    
    // Donation Modal
    supportDevelopment: 'Unterstütze die Entwicklung der App',
    customAmount: 'Eigener Betrag',
    donate: 'Spenden',
    thankYou: 'Vielen Dank!',
    donationThankYou: 'Danke für deine Unterstützung!',
    
    // Email Templates
    supportSubject: 'Easy Budget - Support Anfrage',
    supportBody: 'Hallo,\n\nich benötige Hilfe mit:\n\n',
    bugReportSubject: 'Easy Budget - Bug Report',
    bugReportBody: 'Hallo,\n\nich möchte einen Bug melden:\n\nBeschreibung:\n\nSchritte zur Reproduktion:\n\n',
    suggestionSubject: 'Easy Budget - Vorschlag',
    suggestionBody: 'Hallo,\n\nich habe einen Vorschlag:\n\n',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert. Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern.',
    privacyText2: 'Die App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.',
    termsText1: 'Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:',
    termsText2: '1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.\n2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.\n3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.\n4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.',
    termsText3: 'Anwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.',
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
    premiumYes: 'Premium: Yes',
    premiumNo: 'Premium: No',
    premiumExpired: 'Premium: Expired',
    premiumForever: 'Premium: Forever',
    premiumTrial: 'Premium Trial',
    premiumMonthly: 'Premium',
    days: 'Days',
    changeLanguage: 'Change Language',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    imprint: 'Imprint',
    support: 'Support',
    reportBug: 'Report Bug',
    suggestion: 'Suggestion',
    donation: 'Donation',
    legal: 'Legal',
    close: 'Close',
    getPremium: 'Get Premium',
    cancelPremium: 'Cancel Premium Subscription',
    enterPremiumCode: 'Enter Premium Code',
    premiumCodePlaceholder: 'Enter code',
    apply: 'Apply',
    success: 'Success',
    error: 'Error',
    premiumActivated: 'Premium has been activated!',
    invalidCode: 'Invalid code',
    emailNotAvailable: 'Email app not available',
    
    // Premium Modal
    unlimitedFeatures: 'Get unlimited app features:',
    unlimitedSubscriptions: 'Unlimited Subscription Counter',
    unlimitedExpenses: 'Unlimited Expense List',
    unlimitedMonths: 'Unlimited Months',
    oneTimePayment: 'One-time Payment',
    monthlySubscription: 'Monthly Subscription',
    pay: 'Pay',
    or: 'OR',
    month: 'Month',
    
    // Donation Modal
    supportDevelopment: 'Support the development of the app',
    customAmount: 'Custom Amount',
    donate: 'Donate',
    thankYou: 'Thank You!',
    donationThankYou: 'Thanks for your support!',
    
    // Email Templates
    supportSubject: 'Easy Budget - Support Request',
    supportBody: 'Hello,\n\nI need help with:\n\n',
    bugReportSubject: 'Easy Budget - Bug Report',
    bugReportBody: 'Hello,\n\nI would like to report a bug:\n\nDescription:\n\nSteps to reproduce:\n\n',
    suggestionSubject: 'Easy Budget - Suggestion',
    suggestionBody: 'Hello,\n\nI have a suggestion:\n\n',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respects your privacy. All your financial data is stored exclusively locally on your device. We do not collect, transmit or store any personal data on external servers.',
    privacyText2: 'The app does not require an internet connection and does not send any data to third parties. Your budgets, expenses and subscriptions remain completely private and under your control.',
    termsText1: 'By using Easy Budget 10, you agree to the following terms:',
    termsText2: '1. The app is provided "as is" without any warranties.\n2. You are responsible for backing up your data.\n3. The app is for informational purposes only and does not replace professional financial advice.\n4. We are not liable for any losses or damages arising from the use of the app.',
    termsText3: 'Applicable Law: These terms are governed by Swiss law. Place of jurisdiction is Zurich, Switzerland.',
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
