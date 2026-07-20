/**
 * Paywall Screen
 *
 * Shows subscription options and handles purchases.
 * On web, displays features and prompts user to download the app.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  Linking,
  Animated,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PurchasesPackage } from "react-native-purchases";

import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GREEN = "#BFFE84";
const BG = "#0D0D0D";
const TERMS_URL = 'https://www.termsfeed.com/live/6f7b7674-e830-468a-9f48-24a723dd62e9';
const CARD_DARK = "#111111";
const CARD_MID = "#1A1A1A";

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Close button top offset: respect safe area on both platforms
  const closeButtonTop = (insets.top || (Platform.OS === 'android' ? 24 : 44)) + 12;

  const { t } = useLanguage();

  const FEATURES = [t('unlimitedSubscriptions'), t('unlimitedExpenses'), t('unlimitedMonths')];

  const {
    packages,
    loading,
    isSubscribed,
    isWeb,
    purchasePackage,
    restorePurchases,
    mockWebPurchase,
    checkSubscription,
  } = useSubscription();

  const [retrying, setRetrying] = useState(false);

  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [webMockDialogState, setWebMockDialogState] = useState<"hidden" | "selecting" | "failed">("hidden");
  const [webMockPkg, setWebMockPkg] = useState<PurchasesPackage | null>(null);

  const lifetimePkg = packages.find(
    (p) => p.identifier === "$rc_lifetime" || p.packageType === "LIFETIME"
  ) ?? (packages.length > 1 ? packages[packages.length - 1] : null);

  const monthlyPkg = packages.find(
    (p) => p.identifier === "$rc_monthly" || p.packageType === "MONTHLY"
  ) ?? (packages.length > 0 ? packages[0] : null);

  const lifetimePrice = lifetimePkg?.product?.priceString ?? (loading ? null : t('priceNotAvailable'));
  const monthlyPrice = monthlyPkg?.product?.priceString
    ? `${monthlyPkg.product.priceString}/${t('month')}`
    : (loading ? null : t('priceNotAvailable'));

  const handlePurchase = async (pkg: PurchasesPackage | null, label: string) => {
    console.log(`[Paywall] Bezahlen pressed — package: ${label}`);
    if (!pkg) {
      console.warn("[Paywall] No package available for purchase");
      return;
    }
    if (isWeb) {
      console.log("[Paywall] Web mock purchase flow triggered for:", pkg.identifier);
      setWebMockPkg(pkg);
      setWebMockDialogState("selecting");
      return;
    }
    const confirmMessage = label === 'lifetime'
      ? t('confirmLifetimePurchase').replace('{price}', lifetimePrice)
      : t('confirmMonthlyPurchase').replace('{price}', monthlyPrice);
    Alert.alert(
      t('confirmPurchaseTitle'),
      confirmMessage,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('paywallPay'),
          onPress: async () => {
            try {
              setPurchasing(label);
              console.log("[Paywall] Initiating purchase for:", pkg.identifier);
              const success = await purchasePackage(pkg);
              if (success) {
                console.log("[Paywall] Purchase successful for:", pkg.identifier);
                router.replace("/(tabs)");
              }
            } catch (error: any) {
              console.error("[Paywall] Purchase failed:", error);
              Alert.alert("Kauf fehlgeschlagen", error.message || "Bitte versuche es erneut.");
            } finally {
              setPurchasing(null);
            }
          },
        },
      ]
    );
  };

  const handleRestore = async () => {
    console.log("[Paywall] Käufe wiederherstellen pressed");
    try {
      setRestoring(true);
      const restored = await restorePurchases();
      if (restored) {
        console.log("[Paywall] Restore successful");
        router.replace("/(tabs)");
      } else {
        console.log("[Paywall] No purchases found to restore");
      }
    } catch (error: any) {
      console.error("[Paywall] Restore failed:", error);
      Alert.alert("Fehler", error.message || "Bitte versuche es erneut.");
    } finally {
      setRestoring(false);
    }
  };

  const handleClose = () => {
    console.log("[Paywall] Close button pressed");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  // Already subscribed — auto-dismiss after 3 seconds
  const subscribedProgressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSubscribed) return;
    console.log('[Paywall] Already subscribed — starting 3s auto-dismiss timer');
    Animated.timing(subscribedProgressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      console.log('[Paywall] Auto-dismissing subscribed screen after 3s');
      router.replace('/(tabs)/budget');
    }, 3000);
    return () => clearTimeout(timer);
  }, [isSubscribed]);

  const handleSubscribedDismiss = () => {
    console.log('[Paywall] Subscribed screen tapped — dismissing early');
    router.replace('/(tabs)/budget');
  };

  const progressBarWidth = subscribedProgressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (isSubscribed) {
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleSubscribedDismiss}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
          <View style={styles.subscribedContent}>
            <View style={styles.starCircle}>
              <Text style={styles.starIcon}>✓</Text>
            </View>
            <Text style={styles.title}>{t('youHavePremium')}</Text>
            <Text style={styles.subtitle}>{t('paywallAllUnlocked')}</Text>
            <View style={styles.featuresCard}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureText}>• {f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handleSubscribedDismiss}>
              <Text style={styles.payButtonText}>{t('paywallContinue')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
          </View>
        </SafeAreaView>
      </TouchableOpacity>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loadingText}>{t('paywallLoading')}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const noPackages = packages.length === 0;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        {/* Close button */}
        <TouchableOpacity style={[styles.closeButton, { top: closeButtonTop }]} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Star icon */}
          <View style={styles.starCircle}>
            <Text style={styles.starIcon}>★</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('paywallTitle')}</Text>
          <Text style={styles.subtitle}>{t('paywallSubtitle')}</Text>

          {/* Features card */}
          <View style={styles.featuresCard}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureText}>• {f}</Text>
              </View>
            ))}
          </View>

          {/* Restore */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator size="small" color="#BFFE84" />
            ) : (
              <Text style={styles.restoreButtonText}>{t('paywallRestore')}</Text>
            )}
          </TouchableOpacity>

          {/* Lifetime card */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>{t('paywallOneTime')}</Text>
            {lifetimePrice === null ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                <ActivityIndicator size="small" color={GREEN} />
                <Text style={[styles.pricingPrice, { fontSize: 14, color: '#888888', marginBottom: 0 }]}>Preis wird geladen...</Text>
              </View>
            ) : (
              <Text style={styles.pricingPrice}>{lifetimePrice}</Text>
            )}
            {!noPackages && lifetimePkg && (
              <Text style={{ fontSize: 11, color: '#888888', marginBottom: 8 }}>{t('paywallOneTimeDesc')}</Text>
            )}
            <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)} style={{ marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.payButton,
                (noPackages || purchasing === "lifetime") && styles.payButtonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={noPackages || purchasing !== null}
              onPress={() => handlePurchase(lifetimePkg, "lifetime")}
            >
              {purchasing === "lifetime" ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.payButtonText}>
                  {noPackages ? t('paywallNotAvailable') : t('paywallPay')}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <Text style={styles.orText}>{t('paywallOr')}</Text>

          {/* Monthly card */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>{t('paywallMonthly')}</Text>
            {monthlyPrice === null ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                <ActivityIndicator size="small" color={GREEN} />
                <Text style={[styles.pricingPrice, { fontSize: 14, color: '#888888', marginBottom: 0 }]}>Preis wird geladen...</Text>
              </View>
            ) : (
              <Text style={styles.pricingPrice}>{monthlyPrice}</Text>
            )}
            {!noPackages && monthlyPkg && (
              <Text style={{ fontSize: 11, color: '#888888', marginBottom: 8 }}>{t('paywallMonthlyDesc')}</Text>
            )}
            <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)} style={{ marginBottom: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.payButton,
                (noPackages || purchasing === "monthly") && styles.payButtonDisabled,
              ]}
              activeOpacity={0.8}
              disabled={noPackages || purchasing !== null}
              onPress={() => handlePurchase(monthlyPkg, "monthly")}
            >
              {purchasing === "monthly" ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.payButtonText}>
                  {noPackages ? t('paywallNotAvailable') : t('paywallPay')}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* No packages retry */}
          {noPackages && (
            <>
              <Text style={{ fontSize: 12, color: '#888888', textAlign: 'center', marginTop: 8, marginBottom: 4, lineHeight: 18 }}>
                {t('paywallPriceUnavailableHint')}
              </Text>
              <TouchableOpacity
                style={[styles.retryButton, { marginTop: 4 }]}
                disabled={retrying}
                onPress={async () => {
                  console.log('[Paywall] Retry loading packages pressed');
                  setRetrying(true);
                  await checkSubscription();
                  setRetrying(false);
                }}
              >
                {retrying ? (
                  <ActivityIndicator size="small" color={GREEN} />
                ) : (
                  <Text style={styles.retryButtonText}>{t('paywallRetry')}</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Legal */}
          <Text style={styles.legalText}>
            {isWeb
              ? "Vorschaumodus — Käufe sind in der mobilen App verfügbar"
              : t('paywallLegal')}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)} style={{ marginTop: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacyView')}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: '#555555', textAlign: 'center', lineHeight: 16, marginTop: 12, paddingHorizontal: 8 }}>
            {t('cancelInfo')}
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Web Mock Purchase Dialog — development only */}
      {__DEV__ && isWeb && webMockDialogState !== "hidden" && (
        <View style={styles.webDialogOverlay}>
          <View style={styles.webDialogBox}>
            {webMockDialogState === "selecting" && (
              <>
                <Text style={styles.webDialogTitle}>Test Purchase</Text>
                <Text style={styles.webDialogBody}>
                  {`⚠️ This is a test purchase for development only.\n\nPackage ID: ${webMockPkg?.identifier}\nPrice: ${webMockPkg?.product.priceString || "N/A"}`}
                </Text>
                <View style={styles.webDialogDivider} />
                <TouchableOpacity
                  style={styles.webDialogButton}
                  onPress={() => {
                    console.log("[Paywall] Web mock: Test Failed Purchase selected");
                    setWebMockDialogState("failed");
                  }}
                >
                  <Text style={[styles.webDialogButtonText, { color: "#FF3B30" }]}>
                    Test Failed Purchase
                  </Text>
                </TouchableOpacity>
                <View style={styles.webDialogDivider} />
                <TouchableOpacity
                  style={styles.webDialogButton}
                  onPress={() => {
                    console.log("[Paywall] Web mock: Test Valid Purchase selected");
                    setWebMockDialogState("hidden");
                    mockWebPurchase();
                    router.replace("/(tabs)");
                  }}
                >
                  <Text style={[styles.webDialogButtonText, { color: "#007AFF" }]}>
                    Test Valid Purchase
                  </Text>
                </TouchableOpacity>
                <View style={styles.webDialogDivider} />
                <TouchableOpacity
                  style={styles.webDialogButton}
                  onPress={() => {
                    console.log("[Paywall] Web mock: Cancel selected");
                    setWebMockDialogState("hidden");
                  }}
                >
                  <Text style={[styles.webDialogButtonText, { color: "#007AFF" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {webMockDialogState === "failed" && (
              <>
                <Text style={styles.webDialogTitle}>Purchase Failed</Text>
                <Text style={styles.webDialogBody}>
                  Test purchase failure: no real transaction occurred
                </Text>
                <View style={styles.webDialogDivider} />
                <TouchableOpacity
                  style={styles.webDialogButton}
                  onPress={() => setWebMockDialogState("hidden")}
                >
                  <Text style={[styles.webDialogButtonText, { color: "#007AFF" }]}>
                    OK
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  safeArea: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#888888",
    marginTop: 8,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
    alignItems: "center",
  },
  starCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(191, 254, 132, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 26,
    color: GREEN,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: GREEN,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  featuresCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 20,
  },
  featureRow: {
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: GREEN,
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GREEN,
    padding: 16,
    width: "100%",
  },
  pricingLabel: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 22,
    color: GREEN,
    fontWeight: "bold",
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    fontSize: 15,
    color: "#000000",
    fontWeight: "bold",
  },
  orText: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    marginVertical: 12,
  },
  devMockButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderStyle: "dashed",
    alignItems: "center",
    width: "100%",
  },
  devMockButtonText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    textAlign: "center",
  },
  restoreButton: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#BFFE84",
    width: "100%",
  },
  restoreButtonText: {
    fontSize: 14,
    color: "#BFFE84",
    fontWeight: "600",
  },
  retryButton: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#BFFE84",
    width: "100%",
  },
  retryButtonText: {
    fontSize: 14,
    color: "#BFFE84",
    fontWeight: "600",
  },
  legalText: {
    fontSize: 11,
    color: "#555555",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  subscribedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
  },
  progressBar: {
    height: 4,
    backgroundColor: GREEN,
  },

  // Web mock dialog
  webDialogOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  webDialogBox: {
    backgroundColor: "#f2f2f7",
    borderRadius: 14,
    width: "85%",
    maxWidth: 400,
    overflow: "hidden",
  },
  webDialogTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  webDialogBody: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    lineHeight: 18,
  },
  webDialogDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  webDialogButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  webDialogButtonText: {
    fontSize: 17,
  },
});
