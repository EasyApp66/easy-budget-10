
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

type Language = 'de' | 'en' | 'fr' | 'es' | 'ru';

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
    twoWeeksPremium: 'Du erhältst zwei Wochen Premium',
    
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
    subscriptionCosts: 'ABOS',
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
    premiumForever: 'Premium: Ja, für immer !',
    premiumTrial: 'Testversion',
    premiumMonthly: 'Premium',
    trial: 'Testversion',
    premiumActive: 'Premium',
    daysLeft: 'Tage übrig',
    days: 'Tage',
    premium: 'Premium',
    changeLanguage: 'Sprache ändern',
    language: 'Sprache',
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
    cancelPremium: 'Premium Abo beenden',
    cancelSubscription: 'Premium Abo beenden',
    enterPremiumCode: 'Premium Code eingeben',
    premiumCodePlaceholder: 'Code eingeben',
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
    unlimitedFeatures: 'Unbegrenzte Funktionen',
    unlimitedSubscriptions: 'Unbegrenzte Abos',
    unlimitedExpenses: 'Unbegrenzte Ausgaben',
    unlimitedMonths: 'Unbegrenzte Monate',
    feature1: 'Unbegrenzte Abo Counter',
    feature2: 'Unbegrenzte Ausgabenliste',
    feature3: 'Unbegrenzte Monate',
    monthlyPrice: 'Monatlicher Preis',
    oneTimePayment: 'Einmalige Zahlung',
    monthlySubscription: 'Monatsabo',
    month: 'Monat',
    pay: 'Bezahlen',
    or: 'oder',
    subscribe: 'Abonnieren',
    restorePurchases: 'Käufe wiederherstellen',
    
    // Donation Modal
    donationTitle: 'Donation',
    donationText: 'Unterstütze die Entwicklung der App mit einer Spende. Jeder Betrag hilft!',
    supportDevelopment: 'Unterstütze die Entwicklung',
    customAmount: 'Eigener Betrag',
    donate: 'Spenden',
    thankYou: 'Vielen Dank!',
    donationThankYou: 'Danke für deine Unterstützung!',
    
    // Email
    supportSubject: 'Easy Budget - Support',
    supportBody: '',
    bugReportSubject: 'Easy Budget - Bug Report',
    bugReportBody: '',
    suggestionSubject: 'Easy Budget - Vorschlag',
    suggestionBody: '',
    emailNotAvailable: 'E-Mail ist auf diesem Gerät nicht verfügbar',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert. Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern.',
    privacyText2: 'Die App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.',
    termsText1: 'Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:',
    termsText2: '1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.\n2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.\n3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.\n4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.',
    termsText3: 'Anwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.',
    privacyText: 'Easy Budget 10 respektiert Ihre Privatsphäre. Alle Ihre Finanzdaten werden ausschliesslich lokal auf Ihrem Gerät gespeichert. Wir sammeln, übertragen oder speichern keine persönlichen Daten auf externen Servern.\n\nDie App benötigt keine Internetverbindung und sendet keine Daten an Dritte. Ihre Budgets, Ausgaben und Abonnements bleiben vollständig privat und unter Ihrer Kontrolle.',
    termsText: 'Durch die Nutzung von Easy Budget 10 erklären Sie sich mit folgenden Bedingungen einverstanden:\n\n1. Die App wird "wie besehen" bereitgestellt ohne jegliche Garantien.\n2. Sie sind selbst für die Sicherung Ihrer Daten verantwortlich.\n3. Die App dient ausschliesslich zu Informationszwecken und ersetzt keine professionelle Finanzberatung.\n4. Wir haften nicht für Verluste oder Schäden, die durch die Nutzung der App entstehen.\n\nAnwendbares Recht: Diese Bedingungen unterliegen dem Schweizer Recht. Gerichtsstand ist Zürich, Schweiz.',
    agbText: 'Allgemeine Geschäftsbedingungen:\n\n1. Geltungsbereich: Diese AGB gelten für die Nutzung der Easy Budget 10 App.\n\n2. Leistungen: Die App bietet Funktionen zur Verwaltung von Budgets, Ausgaben und Abonnements.\n\n3. Nutzungsrechte: Sie erhalten ein nicht-exklusives, nicht-übertragbares Recht zur Nutzung der App.\n\n4. Haftung: Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.\n\n5. Änderungen: Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern.\n\nBei Fragen kontaktieren Sie uns unter: ivanmirosnic006@gmail.com',
    
    // Tab Labels
    tabBudget: 'Budget',
    tabSubs: 'Abos',
    tabProfile: 'Profil',

    // Promo Code Popup
    promoCodeTitle: 'Gratis Premium!',
    promoCodeMessage: 'Erhalte einen Monat gratis Premium mit dem Code easy2',

    // Terms & Privacy
    termsAndPrivacy: 'AGB & Datenschutz',
    termsAndPrivacyView: 'AGB und Datenschutz ansehen',

    // Actions
    deleteAllData: 'Alle Daten löschen',
    deleteAllDataMessage: 'Möchtest du wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteAllDataError: 'Daten konnten nicht gelöscht werden.',
    requestAccountDeletion: 'Vollständige Kontolöschung anfragen',
    promoCode: 'Promo Code',
    copy: 'Kopieren',
    cancelInfo: 'Abo kündigen: Einstellungen → Apple ID → Abonnements → Easy Budget → Kündigen',
    appGuide: 'App Guide',
    appGuideTitle: 'App Guide — Version 1.0.0',
    appGuideBudgetTitle: '📊 Budget',
    appGuideBudgetContent: '• Tippe auf das grüne + um einen neuen Ausgabe zu erstellen\n• Langes Drücken auf eine Ausgabe öffnet das Menü: umbenennen, duplizieren, fixieren/lösen, löschen\n• Fixierte Ausgaben erscheinen immer oben\n• Tippe auf den Betrag einer Ausgabe um ihn schnell zu ändern\n• Wische eine Ausgabe nach links um sie zu löschen\n• Wechsle zwischen Listen- und Rasteransicht\n• Setze ein Gesamtbudget — der Restbetrag wird automatisch aktualisiert\n• Alle Daten werden offline auf deinem Gerät gespeichert',
    appGuideSubsTitle: '🔄 Abos',
    appGuideSubsContent: '• Tippe auf + um ein neues Abo hinzuzufügen\n• Gib Name, Betrag und nächstes Zahlungsdatum ein\n• Langes Drücken: Abo bearbeiten oder löschen\n• Der Gesamtbetrag aller Abos wird oben angezeigt\n• Abos werden nach dem nächsten Zahlungsdatum sortiert\n• Alle Daten werden offline gespeichert',
    appGuideProfileTitle: '👤 Profil',
    appGuideProfileContent: '• Ändere die App-Sprache (DE, EN, FR, ES, RU)\n• Aktiviere Premium für unbegrenzte Ausgaben, Abos und Monate\n• Käufe wiederherstellen falls du das Gerät gewechselt hast\n• Promo Code eingeben für gratis Premium\n• Support kontaktieren oder Bug melden\n• Spende um die Entwicklung zu unterstützen',
    cancelPremiumConfirmMessage: 'Dein Abo wird zum Ende des aktuellen Zeitraums gekündigt. Du behältst Premium bis dahin.',
    youHavePremium: 'Du hast Premium!',
    paywallTitle: 'Premium holen',
    paywallSubtitle: 'Unbegrenzte Funktionen',
    paywallOneTime: 'Einmalige Zahlung',
    paywallMonthly: 'Monatsabo',
    paywallPay: 'Bezahlen',
    paywallOr: 'oder',
    paywallNotAvailable: 'Nicht verfügbar',
    paywallRestore: 'Käufe wiederherstellen',
    paywallLoading: 'Laden...',
    paywallContinue: 'Weiter',
    paywallAllUnlocked: 'Alle Funktionen freigeschaltet',
    paywallLegal: 'Die Zahlung wird über dein Apple ID Konto abgerechnet. Das Abo verlängert sich automatisch um einen Monat, sofern es nicht mindestens 24 Stunden vor Ende des aktuellen Zeitraums gekündigt wird. Der Betrag wird innerhalb von 24 Stunden vor Ende des aktuellen Zeitraums abgebucht. Abos können in den Apple ID Einstellungen verwaltet werden.',
    priceNotAvailable: 'Preis nicht verfügbar',
    deleteLocalData: 'Lokale Daten löschen',
    deleteLocalDataMessage: 'Alle lokalen Daten werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
    requestAccountDeletionTitle: 'Konto löschen anfragen',
    requestAccountDeletionMessage: 'Eine E-Mail wird geöffnet, um die Kontolöschung zu beantragen.',
    glassMode: 'Apple Glass Modus',
    premiumOnly: 'Nur für Premium',
    skipConfirmationsLabel: 'Bestätigungen deaktivieren',
    premiumEndsOn: 'Dein Premium läuft bis zum {date}.',
    donationDisclaimer: 'Dies ist eine freiwillige Spende und schaltet keine App-Funktionen frei.',
    premiumCodeHint: 'Code wird beim Einlösen automatisch geprüft',
    paywallRetry: 'Erneut versuchen',
    paywallPriceUnavailableHint: 'Preise konnten nicht geladen werden. Bitte Internetverbindung prüfen.',
    paywallOneTimeDesc: 'Einmalig — kein Abo, kein Ablaufdatum',
    paywallMonthlyDesc: 'Monatlich kündbar, jederzeit',
    confirmPurchaseTitle: 'Kauf bestätigen',
    confirmLifetimePurchase: 'Einmalige Zahlung von {price}. Kein Abo, kein Ablaufdatum.',
    confirmMonthlyPurchase: 'Monatliches Abo für {price}/Monat. Jederzeit kündbar.',
    confirmDonationTitle: 'Spende bestätigen',
    confirmDonationMessage: 'Möchtest du {amount} spenden? Dies ist freiwillig und schaltet keine Funktionen frei.',
    accountDeletionTitle: 'Konto löschen',
    accountDeletionMessage: 'Alle deine Kontodaten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.\n\nEine E-Mail wird geöffnet — sende sie ab um die Löschung zu beantragen.',
    accountDeletionSendEmail: 'E-Mail senden',
    newMonth: 'Neu',
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
    twoWeeksPremium: 'You get two weeks Premium',
    
    // Budget Screen
    budget: 'BUDGET',
    total: 'TOTAL',
    remaining: 'LEFT',
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
    subscriptionCosts: 'SUBS',
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
    premiumForever: 'Premium: Yes, forever !',
    premiumTrial: 'Trial',
    premiumMonthly: 'Premium',
    trial: 'Trial',
    premiumActive: 'Premium',
    daysLeft: 'days left',
    days: 'days',
    premium: 'Premium',
    changeLanguage: 'Change Language',
    language: 'Language',
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
    cancelPremium: 'Cancel Premium Subscription',
    cancelSubscription: 'Cancel Premium Subscription',
    enterPremiumCode: 'Enter Premium Code',
    premiumCodePlaceholder: 'Enter code',
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
    unlimitedFeatures: 'Unlimited Features',
    unlimitedSubscriptions: 'Unlimited Subscriptions',
    unlimitedExpenses: 'Unlimited Expenses',
    unlimitedMonths: 'Unlimited Months',
    feature1: 'Unlimited Subscription Counter',
    feature2: 'Unlimited Expense List',
    feature3: 'Unlimited Months',
    monthlyPrice: 'Monthly Price',
    oneTimePayment: 'One-Time Payment',
    monthlySubscription: 'Monthly Subscription',
    month: 'month',
    pay: 'Pay',
    or: 'or',
    subscribe: 'Subscribe',
    restorePurchases: 'Restore Purchases',
    
    // Donation Modal
    donationTitle: 'Donation',
    donationText: 'Support the development of the app with a donation. Every amount helps!',
    supportDevelopment: 'Support Development',
    customAmount: 'Custom Amount',
    donate: 'Donate',
    thankYou: 'Thank You!',
    donationThankYou: 'Thanks for your support!',
    
    // Email
    supportSubject: 'Easy Budget - Support',
    supportBody: '',
    bugReportSubject: 'Easy Budget - Bug Report',
    bugReportBody: '',
    suggestionSubject: 'Easy Budget - Suggestion',
    suggestionBody: '',
    emailNotAvailable: 'Email is not available on this device',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respects your privacy. All your financial data is stored exclusively locally on your device. We do not collect, transmit or store any personal data on external servers.',
    privacyText2: 'The app does not require an internet connection and does not send any data to third parties. Your budgets, expenses and subscriptions remain completely private and under your control.',
    termsText1: 'By using Easy Budget 10, you agree to the following terms:',
    termsText2: '1. The app is provided "as is" without any warranties.\n2. You are responsible for backing up your data.\n3. The app is for informational purposes only and does not replace professional financial advice.\n4. We are not liable for any losses or damages arising from the use of the app.',
    termsText3: 'Applicable Law: These terms are governed by Swiss law. Place of jurisdiction is Zurich, Switzerland.',
    privacyText: 'Easy Budget 10 respects your privacy. All your financial data is stored exclusively locally on your device. We do not collect, transmit or store any personal data on external servers.\n\nThe app does not require an internet connection and does not send any data to third parties. Your budgets, expenses and subscriptions remain completely private and under your control.',
    termsText: 'By using Easy Budget 10, you agree to the following terms:\n\n1. The app is provided "as is" without any warranties.\n2. You are responsible for backing up your data.\n3. The app is for informational purposes only and does not replace professional financial advice.\n4. We are not liable for any losses or damages arising from the use of the app.\n\nApplicable Law: These terms are governed by Swiss law. Place of jurisdiction is Zurich, Switzerland.',
    agbText: 'General Terms and Conditions:\n\n1. Scope: These terms apply to the use of the Easy Budget 10 app.\n\n2. Services: The app provides features for managing budgets, expenses and subscriptions.\n\n3. Usage Rights: You receive a non-exclusive, non-transferable right to use the app.\n\n4. Liability: Liability is limited to intent and gross negligence.\n\n5. Changes: We reserve the right to change these terms at any time.\n\nFor questions, contact us at: ivanmirosnic006@gmail.com',
    
    // Tab Labels
    tabBudget: 'Budget',
    tabSubs: 'Subs',
    tabProfile: 'Profile',

    // Promo Code Popup
    promoCodeTitle: 'Free Premium!',
    promoCodeMessage: 'Get one month free Premium with code easy2',

    // Terms & Privacy
    termsAndPrivacy: 'Terms & Privacy',
    termsAndPrivacyView: 'View Terms & Privacy',

    // Actions
    deleteAllData: 'Delete All Data',
    deleteAllDataMessage: 'Do you really want to delete all data? This action cannot be undone.',
    deleteAllDataError: 'Data could not be deleted.',
    requestAccountDeletion: 'Request full account deletion',
    promoCode: 'Promo Code',
    copy: 'Copy',
    cancelInfo: 'Cancel subscription: Settings → Apple ID → Subscriptions → Easy Budget → Cancel',
    appGuide: 'App Guide',
    appGuideTitle: 'App Guide — Version 1.0.0',
    appGuideBudgetTitle: '📊 Budget',
    appGuideBudgetContent: '• Tap the green + button to create a new expense\n• Long press an expense to open the menu: rename, duplicate, pin/unpin, delete\n• Pinned expenses always appear at the top\n• Tap an expense amount to quickly change it\n• Swipe left on an expense to delete it\n• Switch between list and grid view\n• Set a total budget — the remaining amount updates automatically\n• All data is saved offline on your device',
    appGuideSubsTitle: '🔄 Subscriptions',
    appGuideSubsContent: '• Tap + to add a new subscription\n• Enter name, amount and next payment date\n• Long press: edit or delete a subscription\n• Total amount of all subscriptions shown at the top\n• Subscriptions sorted by next payment date\n• All data saved offline',
    appGuideProfileTitle: '👤 Profile',
    appGuideProfileContent: '• Change the app language (DE, EN, FR, ES, RU)\n• Activate Premium for unlimited expenses, subscriptions and months\n• Restore purchases if you changed your device\n• Enter a promo code for free Premium\n• Contact support or report a bug\n• Donate to support development',
    cancelPremiumConfirmMessage: 'Your subscription will be cancelled at the end of the current period. You keep Premium until then.',
    youHavePremium: 'You have Premium!',
    paywallTitle: 'Get Premium',
    paywallSubtitle: 'Unlimited Features',
    paywallOneTime: 'One-Time Payment',
    paywallMonthly: 'Monthly Subscription',
    paywallPay: 'Pay',
    paywallOr: 'or',
    paywallNotAvailable: 'Not available',
    paywallRestore: 'Restore Purchases',
    paywallLoading: 'Loading...',
    paywallContinue: 'Continue',
    paywallAllUnlocked: 'All features unlocked',
    paywallLegal: 'Payment will be charged to your Apple ID account. The subscription automatically renews monthly unless cancelled at least 24 hours before the end of the current period. The charge is made within 24 hours before the end of the current period. Subscriptions can be managed in your Apple ID settings.',
    priceNotAvailable: 'Price not available',
    deleteLocalData: 'Delete Local Data',
    deleteLocalDataMessage: 'All local data will be deleted. This action cannot be undone.',
    requestAccountDeletionTitle: 'Request Account Deletion',
    requestAccountDeletionMessage: 'An email will open to request account deletion.',
    glassMode: 'Apple Glass Mode',
    premiumOnly: 'Premium only',
    skipConfirmationsLabel: 'Disable confirmations',
    premiumEndsOn: 'Your Premium is active until {date}.',
    donationDisclaimer: 'This is a voluntary donation and does not unlock any app features.',
    premiumCodeHint: 'Code will be verified automatically when applied',
    paywallRetry: 'Try again',
    paywallPriceUnavailableHint: 'Prices could not be loaded. Please check your internet connection.',
    paywallOneTimeDesc: 'One-time — no subscription, no expiry',
    paywallMonthlyDesc: 'Cancel anytime, monthly',
    confirmPurchaseTitle: 'Confirm Purchase',
    confirmLifetimePurchase: 'One-time payment of {price}. No subscription, no expiry.',
    confirmMonthlyPurchase: 'Monthly subscription for {price}/month. Cancel anytime.',
    confirmDonationTitle: 'Confirm Donation',
    confirmDonationMessage: 'Would you like to donate {amount}? This is voluntary and does not unlock any features.',
    accountDeletionTitle: 'Delete Account',
    accountDeletionMessage: 'All your account data will be permanently deleted. This action cannot be undone.\n\nAn email will open — send it to request deletion.',
    accountDeletionSendEmail: 'Send Email',
    newMonth: 'New',
  },
  fr: {
    // Welcome Screen
    hiIAm: 'SALUT JE SUIS',
    easyBudget: 'EASY BUDGET',
    keepTrack: 'Gardez une trace de toutes',
    expenses: 'Dépenses',
    and: 'et',
    subscriptions: 'Abonnements',
    inOneGlance: 'en un coup d\'œil.',
    go: 'ALLER',
    privacy: 'Confidentialité',
    terms: 'Conditions d\'utilisation',
    agb: 'CGV',
    twoWeeksPremium: 'Vous obtenez deux semaines Premium',
    
    // Budget Screen
    budget: 'BUDGET',
    total: 'TOTAL',
    remaining: 'RESTE',
    newExpense: 'Nouvelle Dépense',
    nameExample: 'Nom (ex. NOURRITURE)',
    amount: 'Montant',
    add: 'Ajouter',
    cancel: 'Annuler',
    save: 'Enregistrer',
    rename: 'Renommer',
    duplicate: 'Dupliquer',
    pin: 'Épingler',
    unpin: 'Détacher',
    delete: 'Supprimer',
    editExpense: 'Modifier la Dépense',
    changeView: 'Changer la Vue',
    adjustNumber: 'Ajuster le Montant',
    
    // Subscriptions Screen
    subscriptionCosts: 'ABONNEMENTS',
    newSubscription: 'Nouvel Abonnement',
    subscriptionNameExample: 'Nom (ex. NETFLIX)',
    editSubscription: 'Modifier l\'Abonnement',
    
    // Profile Screen
    profile: 'Profil',
    premiumStatus: 'Statut Premium',
    status: 'Statut',
    premiumYes: 'Premium: Oui',
    premiumNo: 'Non',
    premiumExpired: 'Expiré',
    premiumForever: 'Premium: Oui, pour toujours !',
    premiumTrial: 'Essai',
    premiumMonthly: 'Premium',
    trial: 'Essai',
    premiumActive: 'Premium',
    daysLeft: 'jours restants',
    days: 'jours',
    premium: 'Premium',
    changeLanguage: 'Changer la Langue',
    language: 'Langue',
    termsOfUse: 'Conditions d\'utilisation',
    privacyPolicy: 'Politique de Confidentialité',
    imprint: 'Mentions Légales',
    impressum: 'Mentions Légales',
    support: 'Support',
    reportBug: 'Signaler un Bug',
    suggestion: 'Suggestion',
    donation: 'Don',
    legal: 'Légal',
    close: 'Fermer',
    getPremium: 'Obtenir Premium',
    cancelPremium: 'Annuler l\'Abonnement Premium',
    cancelSubscription: 'Annuler l\'Abonnement Premium',
    enterPremiumCode: 'Entrer le Code Premium',
    premiumCodePlaceholder: 'Entrer le code',
    codePlaceholder: 'Entrer le code',
    apply: 'Appliquer',
    success: 'Succès',
    error: 'Erreur',
    premiumActivated: 'Premium a été activé!',
    invalidCode: 'Code invalide',
    enterCode: 'Veuillez entrer le code',
    
    // Premium Modal
    premiumTitle: 'Obtenir Premium',
    premiumSubtitle: 'Obtenez des fonctionnalités illimitées',
    unlimitedFeatures: 'Fonctionnalités Illimitées',
    unlimitedSubscriptions: 'Abonnements Illimités',
    unlimitedExpenses: 'Dépenses Illimitées',
    unlimitedMonths: 'Mois Illimités',
    feature1: 'Compteur d\'Abonnements Illimité',
    feature2: 'Liste de Dépenses Illimitée',
    feature3: 'Mois Illimités',
    monthlyPrice: 'Prix Mensuel',
    oneTimePayment: 'Paiement Unique',
    monthlySubscription: 'Abonnement Mensuel',
    month: 'mois',
    pay: 'Payer',
    or: 'ou',
    subscribe: 'S\'abonner',
    restorePurchases: 'Restaurer les Achats',
    
    // Donation Modal
    donationTitle: 'Don',
    donationText: 'Soutenez le développement de l\'application avec un don. Chaque montant aide!',
    supportDevelopment: 'Soutenir le Développement',
    customAmount: 'Montant Personnalisé',
    donate: 'Faire un Don',
    thankYou: 'Merci!',
    donationThankYou: 'Merci pour votre soutien!',
    
    // Email
    supportSubject: 'Easy Budget - Support',
    supportBody: '',
    bugReportSubject: 'Easy Budget - Rapport de Bug',
    bugReportBody: '',
    suggestionSubject: 'Easy Budget - Suggestion',
    suggestionBody: '',
    emailNotAvailable: 'L\'email n\'est pas disponible sur cet appareil',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respecte votre vie privée. Toutes vos données financières sont stockées exclusivement localement sur votre appareil. Nous ne collectons, ne transmettons ni ne stockons aucune donnée personnelle sur des serveurs externes.',
    privacyText2: 'L\'application ne nécessite pas de connexion Internet et n\'envoie aucune donnée à des tiers. Vos budgets, dépenses et abonnements restent complètement privés et sous votre contrôle.',
    termsText1: 'En utilisant Easy Budget 10, vous acceptez les conditions suivantes:',
    termsText2: '1. L\'application est fournie "telle quelle" sans aucune garantie.\n2. Vous êtes responsable de la sauvegarde de vos données.\n3. L\'application est à des fins d\'information uniquement et ne remplace pas les conseils financiers professionnels.\n4. Nous ne sommes pas responsables des pertes ou dommages résultant de l\'utilisation de l\'application.',
    termsText3: 'Droit Applicable: Ces conditions sont régies par le droit suisse. Le lieu de juridiction est Zurich, Suisse.',
    privacyText: 'Easy Budget 10 respecte votre vie privée. Toutes vos données financières sont stockées exclusivement localement sur votre appareil. Nous ne collectons, ne transmettons ni ne stockons aucune donnée personnelle sur des serveurs externes.\n\nL\'application ne nécessite pas de connexion Internet et n\'envoie aucune donnée à des tiers. Vos budgets, dépenses et abonnements restent complètement privés et sous votre contrôle.',
    termsText: 'En utilisant Easy Budget 10, vous acceptez les conditions suivantes:\n\n1. L\'application est fournie "telle quelle" sans aucune garantie.\n2. Vous êtes responsable de la sauvegarde de vos données.\n3. L\'application est à des fins d\'information uniquement et ne remplace pas les conseils financiers professionnels.\n4. Nous ne sommes pas responsables des pertes ou dommages résultant de l\'utilisation de l\'application.\n\nDroit Applicable: Ces conditions sont régies par le droit suisse. Le lieu de juridiction est Zurich, Suisse.',
    agbText: 'Conditions Générales:\n\n1. Portée: Ces conditions s\'appliquent à l\'utilisation de l\'application Easy Budget 10.\n\n2. Services: L\'application fournit des fonctionnalités pour gérer les budgets, les dépenses et les abonnements.\n\n3. Droits d\'Utilisation: Vous recevez un droit non exclusif et non transférable d\'utiliser l\'application.\n\n4. Responsabilité: La responsabilité est limitée à l\'intention et à la négligence grave.\n\n5. Modifications: Nous nous réservons le droit de modifier ces conditions à tout moment.\n\nPour toute question, contactez-nous à: ivanmirosnic006@gmail.com',
    
    // Tab Labels
    tabBudget: 'Budget',
    tabSubs: 'Abos',
    tabProfile: 'Profil',

    // Promo Code Popup
    promoCodeTitle: 'Premium Gratuit!',
    promoCodeMessage: 'Obtenez un mois de Premium gratuit avec le code easy2',

    // Terms & Privacy
    termsAndPrivacy: 'CGV & Confidentialité',
    termsAndPrivacyView: 'Voir CGV & Confidentialité',

    // Actions
    deleteAllData: 'Supprimer toutes les données',
    deleteAllDataMessage: 'Voulez-vous vraiment supprimer toutes les données ? Cette action est irréversible.',
    deleteAllDataError: 'Les données n\'ont pas pu être supprimées.',
    requestAccountDeletion: 'Demander la suppression complète du compte',
    promoCode: 'Code Promo',
    copy: 'Copier',
    cancelInfo: "Annuler l'abonnement: Réglages → Identifiant Apple → Abonnements → Easy Budget → Annuler",
    appGuide: 'Guide App',
    appGuideTitle: 'Guide App — Version 1.0.0',
    appGuideBudgetTitle: '📊 Budget',
    appGuideBudgetContent: '• Appuyez sur le + vert pour créer une nouvelle dépense\n• Appui long sur une dépense: renommer, dupliquer, épingler/détacher, supprimer\n• Les dépenses épinglées apparaissent toujours en haut\n• Appuyez sur le montant pour le modifier rapidement\n• Glissez vers la gauche pour supprimer une dépense\n• Basculez entre vue liste et grille\n• Définissez un budget total — le reste se met à jour automatiquement\n• Toutes les données sont sauvegardées hors ligne sur votre appareil',
    appGuideSubsTitle: '🔄 Abonnements',
    appGuideSubsContent: '• Appuyez sur + pour ajouter un nouvel abonnement\n• Entrez le nom, le montant et la prochaine date de paiement\n• Appui long: modifier ou supprimer un abonnement\n• Le montant total de tous les abonnements est affiché en haut\n• Abonnements triés par prochaine date de paiement\n• Toutes les données sauvegardées hors ligne',
    appGuideProfileTitle: '👤 Profil',
    appGuideProfileContent: '• Changez la langue de l\'application (DE, EN, FR, ES, RU)\n• Activez Premium pour des dépenses, abonnements et mois illimités\n• Restaurez les achats si vous avez changé d\'appareil\n• Entrez un code promo pour Premium gratuit\n• Contactez le support ou signalez un bug\n• Faites un don pour soutenir le développement',
    cancelPremiumConfirmMessage: 'Votre abonnement sera annulé à la fin de la période en cours. Vous gardez Premium jusque-là.',
    youHavePremium: 'Vous avez Premium!',
    paywallTitle: 'Obtenir Premium',
    paywallSubtitle: 'Fonctionnalités Illimitées',
    paywallOneTime: 'Paiement Unique',
    paywallMonthly: 'Abonnement Mensuel',
    paywallPay: 'Payer',
    paywallOr: 'ou',
    paywallNotAvailable: 'Non disponible',
    paywallRestore: 'Restaurer les Achats',
    paywallLoading: 'Chargement...',
    paywallContinue: 'Continuer',
    paywallAllUnlocked: 'Toutes les fonctionnalités débloquées',
    paywallLegal: "Le paiement sera débité de votre compte Apple ID. L'abonnement se renouvelle automatiquement chaque mois, sauf annulation au moins 24 heures avant la fin de la période en cours. Le montant est prélevé dans les 24 heures précédant la fin de la période. Les abonnements peuvent être gérés dans les paramètres Apple ID.",
    priceNotAvailable: 'Prix non disponible',
    deleteLocalData: 'Supprimer les données locales',
    deleteLocalDataMessage: 'Toutes les données locales seront supprimées. Cette action est irréversible.',
    requestAccountDeletionTitle: 'Demander la suppression du compte',
    requestAccountDeletionMessage: "Un e-mail s'ouvrira pour demander la suppression du compte.",
    glassMode: 'Mode Apple Glass',
    premiumOnly: 'Premium uniquement',
    skipConfirmationsLabel: 'Désactiver les confirmations',
    premiumEndsOn: "Votre Premium est actif jusqu'au {date}.",
    donationDisclaimer: "Il s'agit d'un don volontaire et ne débloque aucune fonctionnalité de l'application.",
    premiumCodeHint: "Le code sera vérifié automatiquement lors de l'application",
    paywallRetry: 'Réessayer',
    paywallPriceUnavailableHint: 'Les prix n\'ont pas pu être chargés. Veuillez vérifier votre connexion.',
    paywallOneTimeDesc: "Unique — pas d'abonnement, pas d'expiration",
    paywallMonthlyDesc: 'Résiliable à tout moment, mensuel',
    confirmPurchaseTitle: "Confirmer l'achat",
    confirmLifetimePurchase: "Paiement unique de {price}. Pas d'abonnement, pas d'expiration.",
    confirmMonthlyPurchase: 'Abonnement mensuel pour {price}/mois. Résiliable à tout moment.',
    confirmDonationTitle: 'Confirmer le don',
    confirmDonationMessage: "Voulez-vous faire un don de {amount}? C'est volontaire et ne débloque aucune fonctionnalité.",
    accountDeletionTitle: 'Supprimer le compte',
    accountDeletionMessage: "Toutes vos données de compte seront définitivement supprimées. Cette action est irréversible.\n\nUn e-mail s'ouvrira — envoyez-le pour demander la suppression.",
    accountDeletionSendEmail: "Envoyer l'e-mail",
    newMonth: 'Nouveau',
  },
  es: {
    // Welcome Screen
    hiIAm: 'HOLA SOY',
    easyBudget: 'EASY BUDGET',
    keepTrack: 'Mantén un registro de todos',
    expenses: 'Gastos',
    and: 'y',
    subscriptions: 'Suscripciones',
    inOneGlance: 'de un vistazo.',
    go: 'IR',
    privacy: 'Privacidad',
    terms: 'Términos de Uso',
    agb: 'Términos',
    twoWeeksPremium: 'Obtienes dos semanas Premium',
    
    // Budget Screen
    budget: 'BUDGET',
    total: 'TOTAL',
    remaining: 'QUEDA',
    newExpense: 'Nuevo Gasto',
    nameExample: 'Nombre (ej. COMIDA)',
    amount: 'Cantidad',
    add: 'Añadir',
    cancel: 'Cancelar',
    save: 'Guardar',
    rename: 'Renombrar',
    duplicate: 'Duplicar',
    pin: 'Fijar',
    unpin: 'Desfijar',
    delete: 'Eliminar',
    editExpense: 'Editar Gasto',
    changeView: 'Cambiar Vista',
    adjustNumber: 'Ajustar Cantidad',
    
    // Subscriptions Screen
    subscriptionCosts: 'SUSCRIPCIONES',
    newSubscription: 'Nueva Suscripción',
    subscriptionNameExample: 'Nombre (ej. NETFLIX)',
    editSubscription: 'Editar Suscripción',
    
    // Profile Screen
    profile: 'Perfil',
    premiumStatus: 'Estado Premium',
    status: 'Estado',
    premiumYes: 'Premium: Sí',
    premiumNo: 'No',
    premiumExpired: 'Expirado',
    premiumForever: 'Premium: Sí, para siempre !',
    premiumTrial: 'Prueba',
    premiumMonthly: 'Premium',
    trial: 'Prueba',
    premiumActive: 'Premium',
    daysLeft: 'días restantes',
    days: 'días',
    premium: 'Premium',
    changeLanguage: 'Cambiar Idioma',
    language: 'Idioma',
    termsOfUse: 'Términos de Uso',
    privacyPolicy: 'Política de Privacidad',
    imprint: 'Aviso Legal',
    impressum: 'Aviso Legal',
    support: 'Soporte',
    reportBug: 'Reportar Error',
    suggestion: 'Sugerencia',
    donation: 'Donación',
    legal: 'Legal',
    close: 'Cerrar',
    getPremium: 'Obtener Premium',
    cancelPremium: 'Cancelar Suscripción Premium',
    cancelSubscription: 'Cancelar Suscripción Premium',
    enterPremiumCode: 'Ingresar Código Premium',
    premiumCodePlaceholder: 'Ingresar código',
    codePlaceholder: 'Ingresar código',
    apply: 'Aplicar',
    success: 'Éxito',
    error: 'Error',
    premiumActivated: '¡Premium ha sido activado!',
    invalidCode: 'Código inválido',
    enterCode: 'Por favor ingrese el código',
    
    // Premium Modal
    premiumTitle: 'Obtener Premium',
    premiumSubtitle: 'Obtén funciones ilimitadas',
    unlimitedFeatures: 'Funciones Ilimitadas',
    unlimitedSubscriptions: 'Suscripciones Ilimitadas',
    unlimitedExpenses: 'Gastos Ilimitados',
    unlimitedMonths: 'Meses Ilimitados',
    feature1: 'Contador de Suscripciones Ilimitado',
    feature2: 'Lista de Gastos Ilimitada',
    feature3: 'Meses Ilimitados',
    monthlyPrice: 'Precio Mensual',
    oneTimePayment: 'Pago Único',
    monthlySubscription: 'Suscripción Mensual',
    month: 'mes',
    pay: 'Pagar',
    or: 'o',
    subscribe: 'Suscribirse',
    restorePurchases: 'Restaurar Compras',
    
    // Donation Modal
    donationTitle: 'Donación',
    donationText: 'Apoya el desarrollo de la aplicación con una donación. ¡Cada cantidad ayuda!',
    supportDevelopment: 'Apoyar el Desarrollo',
    customAmount: 'Cantidad Personalizada',
    donate: 'Donar',
    thankYou: '¡Gracias!',
    donationThankYou: '¡Gracias por tu apoyo!',
    
    // Email
    supportSubject: 'Easy Budget - Soporte',
    supportBody: '',
    bugReportSubject: 'Easy Budget - Reporte de Error',
    bugReportBody: '',
    suggestionSubject: 'Easy Budget - Sugerencia',
    suggestionBody: '',
    emailNotAvailable: 'El correo electrónico no está disponible en este dispositivo',
    
    // Legal Texts
    privacyText1: 'Easy Budget 10 respeta su privacidad. Todos sus datos financieros se almacenan exclusivamente de forma local en su dispositivo. No recopilamos, transmitimos ni almacenamos ningún dato personal en servidores externos.',
    privacyText2: 'La aplicación no requiere conexión a Internet y no envía ningún dato a terceros. Sus presupuestos, gastos y suscripciones permanecen completamente privados y bajo su control.',
    termsText1: 'Al usar Easy Budget 10, acepta los siguientes términos:',
    termsText2: '1. La aplicación se proporciona "tal cual" sin ninguna garantía.\n2. Usted es responsable de hacer copias de seguridad de sus datos.\n3. La aplicación es solo para fines informativos y no reemplaza el asesoramiento financiero profesional.\n4. No somos responsables de ninguna pérdida o daño que surja del uso de la aplicación.',
    termsText3: 'Ley Aplicable: Estos términos se rigen por la ley suiza. El lugar de jurisdicción es Zúrich, Suiza.',
    privacyText: 'Easy Budget 10 respeta su privacidad. Todos sus datos financieros se almacenan exclusivamente de forma local en su dispositivo. No recopilamos, transmitimos ni almacenamos ningún dato personal en servidores externos.\n\nLa aplicación no requiere conexión a Internet y no envía ningún dato a terceros. Sus presupuestos, gastos y suscripciones permanecen completamente privados y bajo su control.',
    termsText: 'Al usar Easy Budget 10, acepta los siguientes términos:\n\n1. La aplicación se proporciona "tal cual" sin ninguna garantía.\n2. Usted es responsable de hacer copias de seguridad de sus datos.\n3. La aplicación es solo para fines informativos y no reemplaza el asesoramiento financiero profesional.\n4. No somos responsables de ninguna pérdida o daño que surja del uso de la aplicación.\n\nLey Aplicable: Estos términos se rigen por la ley suiza. El lugar de jurisdicción es Zúrich, Suiza.',
    agbText: 'Términos y Condiciones Generales:\n\n1. Alcance: Estos términos se aplican al uso de la aplicación Easy Budget 10.\n\n2. Servicios: La aplicación proporciona funciones para administrar presupuestos, gastos y suscripciones.\n\n3. Derechos de Uso: Recibe un derecho no exclusivo e intransferible para usar la aplicación.\n\n4. Responsabilidad: La responsabilidad se limita a la intención y negligencia grave.\n\n5. Cambios: Nos reservamos el derecho de cambiar estos términos en cualquier momento.\n\nPara preguntas, contáctenos en: ivanmirosnic006@gmail.com',
    
    // Tab Labels
    tabBudget: 'Budget',
    tabSubs: 'Subs',
    tabProfile: 'Perfil',

    // Promo Code Popup
    promoCodeTitle: '¡Premium Gratis!',
    promoCodeMessage: 'Obtén un mes de Premium gratis con el código easy2',

    // Terms & Privacy
    termsAndPrivacy: 'Términos & Privacidad',
    termsAndPrivacyView: 'Ver Términos & Privacidad',

    // Actions
    deleteAllData: 'Eliminar todos los datos',
    deleteAllDataMessage: '¿Realmente deseas eliminar todos los datos? Esta acción no se puede deshacer.',
    deleteAllDataError: 'Los datos no se pudieron eliminar.',
    requestAccountDeletion: 'Solicitar eliminación completa de la cuenta',
    promoCode: 'Código Promocional',
    copy: 'Copiar',
    cancelInfo: 'Cancelar suscripción: Ajustes → Apple ID → Suscripciones → Easy Budget → Cancelar',
    appGuide: 'Guía App',
    appGuideTitle: 'Guía App — Versión 1.0.0',
    appGuideBudgetTitle: '📊 Presupuesto',
    appGuideBudgetContent: '• Toca el + verde para crear un nuevo gasto\n• Mantén presionado un gasto para abrir el menú: renombrar, duplicar, fijar/desfijar, eliminar\n• Los gastos fijados siempre aparecen arriba\n• Toca el monto de un gasto para cambiarlo rápidamente\n• Desliza a la izquierda para eliminar un gasto\n• Cambia entre vista de lista y cuadrícula\n• Establece un presupuesto total — el monto restante se actualiza automáticamente\n• Todos los datos se guardan sin conexión en tu dispositivo',
    appGuideSubsTitle: '🔄 Suscripciones',
    appGuideSubsContent: '• Toca + para agregar una nueva suscripción\n• Ingresa nombre, monto y próxima fecha de pago\n• Mantén presionado: editar o eliminar una suscripción\n• El monto total de todas las suscripciones se muestra arriba\n• Suscripciones ordenadas por próxima fecha de pago\n• Todos los datos guardados sin conexión',
    appGuideProfileTitle: '👤 Perfil',
    appGuideProfileContent: '• Cambia el idioma de la aplicación (DE, EN, FR, ES, RU)\n• Activa Premium para gastos, suscripciones y meses ilimitados\n• Restaura compras si cambiaste de dispositivo\n• Ingresa un código promocional para Premium gratis\n• Contacta soporte o reporta un error\n• Dona para apoyar el desarrollo',
    cancelPremiumConfirmMessage: 'Tu suscripción se cancelará al final del período actual. Mantienes Premium hasta entonces.',
    youHavePremium: '¡Tienes Premium!',
    paywallTitle: 'Obtener Premium',
    paywallSubtitle: 'Funciones Ilimitadas',
    paywallOneTime: 'Pago Único',
    paywallMonthly: 'Suscripción Mensual',
    paywallPay: 'Pagar',
    paywallOr: 'o',
    paywallNotAvailable: 'No disponible',
    paywallRestore: 'Restaurar Compras',
    paywallLoading: 'Cargando...',
    paywallContinue: 'Continuar',
    paywallAllUnlocked: 'Todas las funciones desbloqueadas',
    paywallLegal: 'El pago se cargará a tu cuenta de Apple ID. La suscripción se renueva automáticamente cada mes, a menos que se cancele al menos 24 horas antes del final del período actual. El cargo se realiza dentro de las 24 horas anteriores al final del período. Las suscripciones se pueden gestionar en la configuración de Apple ID.',
    priceNotAvailable: 'Precio no disponible',
    deleteLocalData: 'Eliminar datos locales',
    deleteLocalDataMessage: 'Todos los datos locales serán eliminados. Esta acción no se puede deshacer.',
    requestAccountDeletionTitle: 'Solicitar eliminación de cuenta',
    requestAccountDeletionMessage: 'Se abrirá un correo para solicitar la eliminación de la cuenta.',
    glassMode: 'Modo Apple Glass',
    premiumOnly: 'Solo Premium',
    skipConfirmationsLabel: 'Desactivar confirmaciones',
    premiumEndsOn: 'Tu Premium está activo hasta el {date}.',
    donationDisclaimer: 'Esta es una donación voluntaria y no desbloquea ninguna función de la aplicación.',
    premiumCodeHint: 'El código se verificará automáticamente al aplicarlo',
    paywallRetry: 'Intentar de nuevo',
    paywallPriceUnavailableHint: 'No se pudieron cargar los precios. Por favor verifica tu conexión.',
    paywallOneTimeDesc: 'Único — sin suscripción, sin vencimiento',
    paywallMonthlyDesc: 'Cancelable en cualquier momento, mensual',
    confirmPurchaseTitle: 'Confirmar compra',
    confirmLifetimePurchase: 'Pago único de {price}. Sin suscripción, sin vencimiento.',
    confirmMonthlyPurchase: 'Suscripción mensual por {price}/mes. Cancelable en cualquier momento.',
    confirmDonationTitle: 'Confirmar donación',
    confirmDonationMessage: '¿Deseas donar {amount}? Esto es voluntario y no desbloquea ninguna función.',
    accountDeletionTitle: 'Eliminar cuenta',
    accountDeletionMessage: 'Todos tus datos de cuenta se eliminarán permanentemente. Esta acción no se puede deshacer.\n\nSe abrirá un correo electrónico — envíalo para solicitar la eliminación.',
    accountDeletionSendEmail: 'Enviar correo',
    newMonth: 'Nuevo',
  },
  ru: {
    // Welcome Screen
    hiIAm: 'ПРИВЕТ Я',
    easyBudget: 'EASY BUDGET',
    keepTrack: 'Следи за всеми',
    expenses: 'Расходами',
    and: 'и',
    subscriptions: 'Подписками',
    inOneGlance: 'с первого взгляда.',
    go: 'ВПЕРЁД',
    privacy: 'Конфиденциальность',
    terms: 'Условия использования',
    agb: 'Условия',
    twoWeeksPremium: 'Вы получаете две недели Premium',

    // Budget Screen
    budget: 'БЮДЖЕТ',
    total: 'ИТОГО',
    remaining: 'ОСТАТОК',
    newExpense: 'Новый расход',
    nameExample: 'Название (напр. ЕДА)',
    amount: 'Сумма',
    add: 'Добавить',
    cancel: 'Отмена',
    save: 'Сохранить',
    rename: 'Переименовать',
    duplicate: 'Дублировать',
    pin: 'Закрепить',
    unpin: 'Открепить',
    delete: 'Удалить',
    editExpense: 'Редактировать расход',
    changeView: 'Изменить вид',
    adjustNumber: 'Изменить сумму',

    // Subscriptions Screen
    subscriptionCosts: 'ПОДПИСКИ',
    newSubscription: 'Новая подписка',
    subscriptionNameExample: 'Название (напр. NETFLIX)',
    editSubscription: 'Редактировать подписку',

    // Profile Screen
    profile: 'Профиль',
    premiumStatus: 'Статус Premium',
    status: 'Статус',
    premiumYes: 'Premium: Да',
    premiumNo: 'Нет',
    premiumExpired: 'Истёк',
    premiumForever: 'Premium: Да, навсегда!',
    premiumTrial: 'Пробный период',
    premiumMonthly: 'Premium',
    trial: 'Пробный период',
    premiumActive: 'Premium',
    daysLeft: 'дней осталось',
    days: 'дней',
    premium: 'Premium',
    changeLanguage: 'Изменить язык',
    language: 'Язык',
    termsOfUse: 'Условия использования',
    privacyPolicy: 'Политика конфиденциальности',
    imprint: 'Выходные данные',
    impressum: 'Выходные данные',
    support: 'Поддержка',
    reportBug: 'Сообщить об ошибке',
    suggestion: 'Предложение',
    donation: 'Пожертвование',
    legal: 'Правовая информация',
    close: 'Закрыть',
    getPremium: 'Получить Premium',
    cancelPremium: 'Отменить подписку Premium',
    cancelSubscription: 'Отменить подписку Premium',
    enterPremiumCode: 'Ввести код Premium',
    premiumCodePlaceholder: 'Введите код',
    codePlaceholder: 'Введите код',
    apply: 'Применить',
    success: 'Успех',
    error: 'Ошибка',
    premiumActivated: 'Premium активирован!',
    invalidCode: 'Неверный код',
    enterCode: 'Пожалуйста, введите код',

    // Premium Modal
    premiumTitle: 'Получить Premium',
    premiumSubtitle: 'Получите неограниченные функции приложения',
    unlimitedFeatures: 'Неограниченные функции',
    unlimitedSubscriptions: 'Неограниченные подписки',
    unlimitedExpenses: 'Неограниченные расходы',
    unlimitedMonths: 'Неограниченные месяцы',
    feature1: 'Неограниченный счётчик подписок',
    feature2: 'Неограниченный список расходов',
    feature3: 'Неограниченные месяцы',
    monthlyPrice: 'Ежемесячная цена',
    oneTimePayment: 'Единовременный платёж',
    monthlySubscription: 'Ежемесячная подписка',
    month: 'месяц',
    pay: 'Оплатить',
    or: 'или',
    subscribe: 'Подписаться',
    restorePurchases: 'Восстановить покупки',

    // Donation Modal
    donationTitle: 'Пожертвование',
    donationText: 'Поддержите разработку приложения пожертвованием. Любая сумма поможет!',
    supportDevelopment: 'Поддержать разработку',
    customAmount: 'Произвольная сумма',
    donate: 'Пожертвовать',
    thankYou: 'Спасибо!',
    donationThankYou: 'Спасибо за вашу поддержку!',

    // Email
    supportSubject: 'Easy Budget - Поддержка',
    supportBody: '',
    bugReportSubject: 'Easy Budget - Сообщение об ошибке',
    bugReportBody: '',
    suggestionSubject: 'Easy Budget - Предложение',
    suggestionBody: '',
    emailNotAvailable: 'Электронная почта недоступна на этом устройстве',

    // Legal Texts
    privacyText1: 'Easy Budget 10 уважает вашу конфиденциальность. Все ваши финансовые данные хранятся исключительно локально на вашем устройстве. Мы не собираем, не передаём и не храним личные данные на внешних серверах.',
    privacyText2: 'Приложение не требует подключения к интернету и не отправляет данные третьим лицам. Ваши бюджеты, расходы и подписки остаются полностью конфиденциальными и под вашим контролем.',
    termsText1: 'Используя Easy Budget 10, вы соглашаетесь со следующими условиями:',
    termsText2: '1. Приложение предоставляется "как есть" без каких-либо гарантий.\n2. Вы несёте ответственность за резервное копирование своих данных.\n3. Приложение предназначено только для информационных целей и не заменяет профессиональные финансовые консультации.\n4. Мы не несём ответственности за убытки или ущерб, возникшие в результате использования приложения.',
    termsText3: 'Применимое право: Настоящие условия регулируются швейцарским законодательством. Место юрисдикции — Цюрих, Швейцария.',
    privacyText: 'Easy Budget 10 уважает вашу конфиденциальность. Все ваши финансовые данные хранятся исключительно локально на вашем устройстве. Мы не собираем, не передаём и не храним личные данные на внешних серверах.\n\nПриложение не требует подключения к интернету и не отправляет данные третьим лицам. Ваши бюджеты, расходы и подписки остаются полностью конфиденциальными и под вашим контролем.',
    termsText: 'Используя Easy Budget 10, вы соглашаетесь со следующими условиями:\n\n1. Приложение предоставляется "как есть" без каких-либо гарантий.\n2. Вы несёте ответственность за резервное копирование своих данных.\n3. Приложение предназначено только для информационных целей и не заменяет профессиональные финансовые консультации.\n4. Мы не несём ответственности за убытки или ущерб, возникшие в результате использования приложения.\n\nПрименимое право: Настоящие условия регулируются швейцарским законодательством. Место юрисдикции — Цюрих, Швейцария.',
    agbText: 'Общие условия:\n\n1. Область применения: Настоящие условия применяются к использованию приложения Easy Budget 10.\n\n2. Услуги: Приложение предоставляет функции для управления бюджетами, расходами и подписками.\n\n3. Права использования: Вы получаете неисключительное, непередаваемое право на использование приложения.\n\n4. Ответственность: Ответственность ограничена умыслом и грубой халатностью.\n\n5. Изменения: Мы оставляем за собой право изменять настоящие условия в любое время.\n\nПо вопросам обращайтесь: ivanmirosnic006@gmail.com',

    // Tab Labels
    tabBudget: 'Бюджет',
    tabSubs: 'Подписки',
    tabProfile: 'Профиль',

    // Promo Code Popup
    promoCodeTitle: 'Бесплатный Premium!',
    promoCodeMessage: 'Получите один месяц Premium бесплатно с кодом easy2',

    // Terms & Privacy
    termsAndPrivacy: 'Условия и конфиденциальность',
    termsAndPrivacyView: 'Просмотреть условия и конфиденциальность',

    // Actions
    deleteAllData: 'Удалить все данные',
    deleteAllDataMessage: 'Вы действительно хотите удалить все данные? Это действие нельзя отменить.',
    deleteAllDataError: 'Данные не удалось удалить.',
    requestAccountDeletion: 'Запросить полное удаление аккаунта',
    promoCode: 'Промокод',
    copy: 'Копировать',
    cancelInfo: 'Отменить подписку: Настройки → Apple ID → Подписки → Easy Budget → Отменить',

    // App Guide
    appGuide: 'App Guide',
    appGuideTitle: 'App Guide — Version 1.0.0',
    appGuideBudgetTitle: '📊 Бюджет',
    appGuideBudgetContent: '• Нажмите зелёную кнопку + чтобы создать новый расход\n• Долгое нажатие на расход открывает меню: переименовать, дублировать, закрепить/открепить, удалить\n• Закреплённые расходы всегда отображаются вверху\n• Нажмите на сумму расхода чтобы быстро изменить её\n• Проведите пальцем влево по расходу чтобы удалить\n• Переключайте вид между списком и сеткой\n• Установите общий бюджет — остаток обновляется автоматически\n• Все данные сохраняются офлайн на вашем устройстве',
    appGuideSubsTitle: '🔄 Подписки',
    appGuideSubsContent: '• Нажмите + чтобы добавить новую подписку\n• Введите название, сумму и дату следующего платежа\n• Долгое нажатие: редактировать или удалить подписку\n• Общая сумма всех подписок отображается вверху\n• Подписки сортируются по дате следующего платежа\n• Все данные сохраняются офлайн',
    appGuideProfileTitle: '👤 Профиль',
    appGuideProfileContent: '• Смените язык приложения (DE, EN, FR, ES, RU)\n• Активируйте Premium для неограниченных расходов, подписок и месяцев\n• Восстановите покупки если сменили устройство\n• Введите промокод для бесплатного Premium\n• Свяжитесь с поддержкой или сообщите об ошибке\n• Сделайте пожертвование чтобы поддержать разработку',
    cancelPremiumConfirmMessage: 'Ваша подписка будет отменена в конце текущего периода. До этого момента Premium остаётся активным.',
    youHavePremium: 'У вас Premium!',
    paywallTitle: 'Получить Premium',
    paywallSubtitle: 'Неограниченные функции',
    paywallOneTime: 'Единовременный платёж',
    paywallMonthly: 'Ежемесячная подписка',
    paywallPay: 'Оплатить',
    paywallOr: 'или',
    paywallNotAvailable: 'Недоступно',
    paywallRestore: 'Восстановить покупки',
    paywallLoading: 'Загрузка...',
    paywallContinue: 'Продолжить',
    paywallAllUnlocked: 'Все функции разблокированы',
    paywallLegal: 'Оплата будет списана с вашего аккаунта Apple ID. Подписка автоматически продлевается ежемесячно, если не отменена как минимум за 24 часа до окончания текущего периода. Списание происходит в течение 24 часов до окончания периода. Управление подписками доступно в настройках Apple ID.',
    priceNotAvailable: 'Цена недоступна',
    deleteLocalData: 'Удалить локальные данные',
    deleteLocalDataMessage: 'Все локальные данные будут удалены. Это действие нельзя отменить.',
    requestAccountDeletionTitle: 'Запросить удаление аккаунта',
    requestAccountDeletionMessage: 'Откроется письмо для запроса удаления аккаунта.',
    glassMode: 'Режим Apple Glass',
    premiumOnly: 'Только для Premium',
    skipConfirmationsLabel: 'Отключить подтверждения',
    premiumEndsOn: 'Ваш Premium активен до {date}.',
    donationDisclaimer: 'Это добровольное пожертвование и не открывает никаких функций приложения.',
    premiumCodeHint: 'Код будет автоматически проверен при применении',
    paywallRetry: 'Попробовать снова',
    paywallPriceUnavailableHint: 'Не удалось загрузить цены. Проверьте подключение к интернету.',
    paywallOneTimeDesc: 'Единоразово — без подписки, без срока действия',
    paywallMonthlyDesc: 'Отмена в любое время, ежемесячно',
    confirmPurchaseTitle: 'Подтвердить покупку',
    confirmLifetimePurchase: 'Единоразовый платёж {price}. Без подписки, без срока действия.',
    confirmMonthlyPurchase: 'Ежемесячная подписка за {price}/месяц. Отмена в любое время.',
    confirmDonationTitle: 'Подтвердить пожертвование',
    confirmDonationMessage: 'Хотите пожертвовать {amount}? Это добровольно и не открывает никаких функций.',
    accountDeletionTitle: 'Удалить аккаунт',
    accountDeletionMessage: 'Все данные вашего аккаунта будут удалены навсегда. Это действие нельзя отменить.\n\nОткроется письмо — отправьте его, чтобы запросить удаление.',
    accountDeletionSendEmail: 'Отправить письмо',
    newMonth: 'Новый',
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
        const deviceLanguageCode = locales[0]?.languageCode || 'de';
        let detectedLanguage: Language = 'de';
        
        if (deviceLanguageCode.startsWith('en')) {
          detectedLanguage = 'en';
        } else if (deviceLanguageCode.startsWith('fr')) {
          detectedLanguage = 'fr';
        } else if (deviceLanguageCode.startsWith('es')) {
          detectedLanguage = 'es';
        } else if (deviceLanguageCode.startsWith('de')) {
          detectedLanguage = 'de';
        } else if (deviceLanguageCode.startsWith('ru')) {
          detectedLanguage = 'ru';
        }
        
        setLanguageState(detectedLanguage);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage);
        console.log('Auto-detected language based on device locale:', detectedLanguage);
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
