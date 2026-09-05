import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import { getFallbackWorkerForTrade } from '../utils/locationService';

export const Screen08_StartOTP = ({ route, navigation }) => {
  const { activeBooking, verifyStartOtp } = useBooking();
  const { t } = useUser();
  const fallbackWorker = getFallbackWorkerForTrade(activeBooking?.service || route.params?.service);
  const worker = activeBooking?.worker || route.params?.worker || fallbackWorker;

  const startOtp = activeBooking?.start_otp || '4829';

  const handleWorkerEnteredOtp = () => {
    verifyStartOtp();
    navigation.navigate('JobInProgress', { worker });
  };

  const handleReportMismatch = () => {
    navigation.navigate('Complaint', {
      preselectedCategory: 'Safety concern / identity mismatch',
      bookingId: activeBooking?.booking_id
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('startServicePinTitle') || 'Start Service PIN'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Instruction Header */}
        <View style={styles.heroHeader}>
          <View style={styles.keyIconCircle}>
            <Ionicons name="key" size={30} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t('startHandshake')}</Text>
          <Text style={styles.subtitle}>{t('shareOtpInstruction')}</Text>
        </View>

        {/* Large 4-Digit OTP Card */}
        <View style={styles.otpCard}>
          <Text style={styles.otpCardLabel}>{t('startOtpLabel')}</Text>
          <View style={styles.otpBoxesRow}>
            {startOtp.split('').map((digit, index) => (
              <View key={index} style={styles.digitBox}>
                <Text style={styles.digitText}>{digit}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.otpExpiresText}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} /> {t('validActiveSession') || 'Valid for this active session'}
          </Text>
        </View>

        {/* Worker Verification Check Card */}
        <View style={styles.workerSummaryCard}>
          <Text style={styles.workerCardLabel}>{t('verifyBeforeShare')}</Text>
          <View style={styles.workerRow}>
            <Image
              source={{ uri: worker?.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&q=80' }}
              style={styles.workerPhoto}
            />
            <View style={styles.workerInfoCol}>
              <Text style={styles.workerName}>{worker?.name || 'Cooperative Artisan'}</Text>
              <Text style={styles.workerSkill}>{worker?.skill || 'Certified Artisan'} • {worker?.cooperative || t('delhiLabourCooperative') || 'Labour Cooperative'}</Text>
              <View style={styles.badgeRow}>
                <Ionicons name="shield-checkmark" size={12} color={colors.successDark} />
                <Text style={styles.badgeText}>{t('photoKycVerifiedMatch') || 'Photo & KYC Verified Match'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Upgraded Service Fare & Transparent Wage Card */}
        <View style={styles.fareSummaryCard}>
          <View style={styles.fareHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fareServiceTitle}>
                {activeBooking?.service?.name || t('cooperativeService') || 'Cooperative Service'}
              </Text>
              <Text style={styles.fareSubtypeText} numberOfLines={1}>
                {activeBooking?.trade_subtype || t('standardDiagnosisService') || 'Standard Diagnosis & Service'}
              </Text>
            </View>
            <View style={styles.farePriceBadge}>
              <Text style={styles.farePriceLabel}>{t('currentFareLabel') || 'CURRENT FARE'}</Text>
              <Text style={styles.farePriceAmount}>₹{activeBooking?.total_amount || activeBooking?.base_amount || 299}</Text>
            </View>
          </View>
          <View style={styles.fareDivider} />
          <View style={styles.fareWageNoteRow}>
            <Ionicons name="heart" size={13} color={colors.successDark} />
            <Text style={styles.fareWageNoteText}>
              80% (₹{((activeBooking?.total_amount || activeBooking?.base_amount || 299) * 0.8).toFixed(0)}) {t('directlyCompensates') || `directly compensates ${worker?.name || 'the artisan'}.`}
            </Text>
          </View>
        </View>

        {/* Safety Warning */}
        <View style={styles.safetyBox}>
          <Ionicons name="warning" size={18} color={colors.danger} />
          <View style={styles.safetyTextCol}>
            <Text style={styles.safetyTitle}>{t('neverShareBeforeArrival') || 'Never share OTP before physical arrival!'}</Text>
            <Text style={styles.safetyDesc}>
              {t('reportMismatchDesc') || 'If a different person arrived, do not share this OTP and report an identity mismatch below.'}
            </Text>
          </View>
        </View>

        {/* Identity Mismatch CTA */}
        <TouchableOpacity
          style={styles.mismatchBtn}
          onPress={handleReportMismatch}
          activeOpacity={0.75}
        >
          <Ionicons name="person-remove-outline" size={15} color={colors.danger} />
          <Text style={styles.mismatchBtnText}>{t('wrongPersonPrompt')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Handshake Trigger Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.handshakeBtn}
          onPress={handleWorkerEnteredOtp}
          activeOpacity={0.85}
        >
          <Ionicons name="finger-print" size={20} color="#FFFFFF" />
          <Text style={styles.handshakeBtnText}>{t('confirmStart')}</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 16,
    paddingBottom: 90
  },
  heroHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  keyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: '85%'
  },
  otpCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16
  },
  otpCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 14
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14
  },
  digitBox: {
    width: 56,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.primarySubtle,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  digitText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary
  },
  otpExpiresText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  workerSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  workerCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  workerPhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceSecondary,
    marginRight: 12
  },
  workerInfoCol: {
    flex: 1
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  workerSkill: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 4
  },
  fareSummaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  fareHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fareServiceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  fareSubtypeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  farePriceBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border
  },
  farePriceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  farePriceAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 1
  },
  fareDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12
  },
  fareWageNoteRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  fareWageNoteText: {
    fontSize: 11,
    color: colors.successDark,
    fontWeight: '600',
    marginLeft: 6
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dangerLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12
  },
  safetyTextCol: {
    marginLeft: 10,
    flex: 1
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.dangerDark
  },
  safetyDesc: {
    fontSize: 11,
    color: colors.dangerDark,
    marginTop: 2,
    lineHeight: 15
  },
  mismatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  mismatchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
    marginLeft: 6
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  handshakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  handshakeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  }
});

export default Screen08_StartOTP;
