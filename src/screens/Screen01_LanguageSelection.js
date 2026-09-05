import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

export const Screen01_LanguageSelection = ({ navigation }) => {
  const { language, setLanguage, t } = useUser();
  const [modalVisible, setModalVisible] = useState(false);

  const POPULAR_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' }
  ];

  const handleContinue = () => {
    navigation.navigate('OTPLogin');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>{t('appName')}</Text>
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>{t('tagline')}</Text>
          </View>
          <Text style={styles.subtitle}>{t('trustedTagline')}</Text>
        </View>

        {/* Language Selection Card */}
        <View style={styles.selectionCard}>
          <Text style={styles.cardHeading}>{t('selectLanguageTitle')}</Text>
          <Text style={styles.cardSubtext}>{t('selectLanguageSub')}</Text>

          {/* Quick Select Popular Languages */}
          <View style={styles.quickGrid}>
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = language?.code === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.quickCard, isSelected && styles.quickCardSelected]}
                  onPress={() => setLanguage(lang)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.quickLangName, isSelected && styles.quickLangNameSelected]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.quickNativeName, isSelected && styles.quickNativeNameSelected]}>
                    {lang.nativeName}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search All Indian Languages Button */}
          <TouchableOpacity
            style={styles.moreLanguagesBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.moreLeft}>
              <View style={styles.globeCircle}>
                <Ionicons name="globe-outline" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.moreTitle}>{t('searchAllLanguages')}</Text>
                <Text style={styles.moreSubtitle}>
                  {t('currentLanguage')}: <Text style={{ fontWeight: '700', color: colors.primary }}>{language?.name} ({language?.nativeName})</Text>
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Cooperative Trust Highlight */}
        <View style={styles.trustBox}>
          <Ionicons name="people" size={18} color={colors.success} />
          <Text style={styles.trustText}>{t('coopWageGuarantee')}</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>{t('continue')}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Searchable Modal Dropdown */}
      <LanguageSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={(selected) => setLanguage(selected)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 30,
    justifyContent: 'space-between',
    minHeight: '100%'
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 14
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5
  },
  taglineBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: '85%'
  },
  selectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4
  },
  cardSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 14
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
  },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative'
  },
  quickCardSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryLight
  },
  quickLangName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  quickLangNameSelected: {
    color: colors.primary
  },
  quickNativeName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  quickNativeNameSelected: {
    color: colors.primaryLight,
    fontWeight: '600'
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  moreLanguagesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  moreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  globeCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  moreTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  moreSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  trustBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 14,
    marginBottom: 18
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.successDark,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen01_LanguageSelection;
