/**
 * Paywall Screen
 *
 * Shows subscription options and handles purchases.
 * On web, displays features and prompts user to download the app.
 */

import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PurchasesPackage } from "react-native-purchases";

import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLanguage } from "@/contexts/LanguageContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GREEN = "#BFFE84";
const BG = "#0D0D0D";
const CARD_DARK = "#111111";
const CARD_MID = "#1A1A1A";

export default function PaywallScreen() {
  const router = useRouter();

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
    mockNativePurchase,
  } = useSubscription();

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

  const lifetimePrice = lifetimePkg?.product?.priceString ?? "CHF 10.00";
  const monthlyPrice = monthlyPkg?.product?.priceString
    ? `${monthlyPkg.product.priceString}/Monat`
    : "CHF 1.00/Monat";

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

  // Already subscribed
  if (isSubscribed) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.payButton} onPress={handleClose}>
              <Text style={styles.payButtonText}>{t('paywallContinue')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
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
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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

          {/* Lifetime card */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>{t('paywallOneTime')}</Text>
            <Text style={styles.pricingPrice}>{lifetimePrice}</Text>
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
            <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/6f7b7674-e830-468a-9f48-24a723dd62e9')} style={{ marginTop: 6, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <Text style={styles.orText}>{t('paywallOr')}</Text>

          {/* Monthly card */}
          <View style={styles.pricingCard}>
            <Text style={styles.pricingLabel}>{t('paywallMonthly')}</Text>
            <Text style={styles.pricingPrice}>{monthlyPrice}</Text>
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
            <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/6f7b7674-e830-468a-9f48-24a723dd62e9')} style={{ marginTop: 6, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacy')}</Text>
            </TouchableOpacity>
          </View>

          {/* Dev mock button */}
          {!isWeb && noPackages && __DEV__ && (
            <TouchableOpacity
              style={styles.devMockButton}
              onPress={async () => {
                console.log("[Paywall] Dev: Simulate Purchase pressed");
                await mockNativePurchase();
                router.replace("/(tabs)");
              }}
            >
              <Text style={styles.devMockButtonText}>Dev: Kauf simulieren</Text>
            </TouchableOpacity>
          )}

          {/* Restore */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator size="small" color="#888888" />
            ) : (
              <Text style={styles.restoreButtonText}>{t('paywallRestore')}</Text>
            )}
          </TouchableOpacity>

          {/* Legal */}
          <Text style={styles.legalText}>
            {isWeb
              ? "Vorschaumodus — Käufe sind in der mobilen App verfügbar"
              : t('paywallLegal')}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/6f7b7674-e830-468a-9f48-24a723dd62e9')} style={{ marginTop: 4, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#BFFE84', textDecorationLine: 'underline' }}>{t('termsAndPrivacyView')}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: '#555555', textAlign: 'center', lineHeight: 16, marginTop: 12, paddingHorizontal: 8 }}>
            {t('cancelInfo')}
          </Text>
        </ScrollView>
      </SafeAreaView>

      {/* Web Mock Purchase Dialog */}
      {isWeb && webMockDialogState !== "hidden" && (
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
    top: 56,
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
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  restoreButtonText: {
    fontSize: 13,
    color: "#888888",
    textDecorationLine: "underline",
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
