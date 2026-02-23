
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

type Language = 'de' | 'en' | 'fr' | 'es';

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
    
    // Promo Code Popup
    promoCodeTitle: 'Gratis Premium!',
    promoCodeMessage: 'Erhalte einen Monat gratis Premium mit dem Code easy2',
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
    
    // Promo Code Popup
    promoCodeTitle: 'Free Premium!',
    promoCodeMessage: 'Get one month free Premium with code easy2',
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
    subscriptionCosts: 'ABOS',
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
    
    // Promo Code Popup
    promoCodeTitle: 'Premium Gratuit!',
    promoCodeMessage: 'Obtenez un mois de Premium gratuit avec le code easy2',
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
    budget: 'PRESUPUESTO',
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
    subscriptionCosts: 'SUBS',
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
    
    // Promo Code Popup
    promoCodeTitle: '¡Premium Gratis!',
    promoCodeMessage: 'Obtén un mes de Premium gratis con el código easy2',
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
