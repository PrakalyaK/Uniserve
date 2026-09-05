import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import SevaSurakshaTable from '../components/SevaSurakshaTable';

export const Screen17_SevaSurakshaScreen = ({ navigation }) => {
  const { t } = useUser();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('sevaSurakshaPolicy') || 'Seva Suraksha Policy'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Core Guarantee Hero */}
        <View style={styles.heroBox}>
          <View style={styles.shieldEmblem}>
            <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>{t('hundredPercentGuarantee') || 'The 100% Service Guarantee'}</Text>
          <Text style={styles.heroSubtitle}>
            {t('guaranteeSubtitle') || 'UniServ combines cooperative accountability and automated software protocols to eliminate every common gig-work frustration.'}
          </Text>
        </View>

        {/* 9 Scenarios Interactive Table Component */}
        <SevaSurakshaTable
          onReportIssue={() => navigation.navigate('Complaint')}
        />

        {/* Bottom Contact / Hotline Box */}
        <View style={styles.hotlineBox}>
          <Ionicons name="headset" size={22} color={colors.primary} />
          <View style={styles.hotlineTextCol}>
            <Text style={styles.hotlineTitle}>{t('helpdesk247') || '24/7 Cooperative Helpdesk'}</Text>
            <Text style={styles.hotlineDesc}>
              {t('hotlineDesc') || 'Immediate phone escalation to designated Ward Supervisors across all municipal zones.'}
            </Text>
          </View>
        </View>

        {/* Back Home CTA */}
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.backHomeText}>{t('returnToHome') || 'Return to Home Screen'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40
  },
  heroBox: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3
  },
  shieldEmblem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#EFF6FF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    maxWidth: '90%'
  },
  hotlineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 14,
    marginBottom: 14
  },
  hotlineTextCol: {
    marginLeft: 12,
    flex: 1
  },
  hotlineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  hotlineDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  backHomeBtn: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  backHomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  }
});

export default Screen17_SevaSurakshaScreen;
