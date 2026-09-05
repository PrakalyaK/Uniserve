import React, { useState } from 'react';
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
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export const Screen11_CompletionOTP = ({ navigation }) => {
  const { activeBooking, verifyCompletionOtp, computeTotal } = useBooking();
  const { t } = useUser();

  const completionOtp = activeBooking?.completion_otp || '7294';
  const hasWarranty = activeBooking?.service?.has_seva_suraksha !== false;
  const isExtraApproved = activeBooking?.extra_work?.approved;
  const isHelperApproved = activeBooking?.second_worker || activeBooking?.helper_request?.status === 'approved';
  const finalPayable = computeTotal ? computeTotal(activeBooking) : (activeBooking?.total_amount || 350);

  const [checklist, setChecklist] = useState([
    { id: 1, text: t('checkInspectRepair') || 'Repair inspected and tested in your presence', checked: true },
    { id: 2, text: t('checkAreaCleaned') || 'Work area cleaned and debris removed', checked: true },
    { id: 3, text: hasWarranty ? (t('checkWarrantyVerified') || '7-Day Seva Suraksha warranty terms verified') : (t('serviceQualityVerified') || 'Service completion and quality verified'), checked: true }
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleConfirmCompletion = () => {
    verifyCompletionOtp();
    if (activeBooking?.is_bulk_project) {
      if (activeBooking?.payment_status === 'full_paid' || Number(activeBooking?.remaining_amount) <= 0) {
        navigation.navigate('Rating', { booking: activeBooking });
      } else {
        navigation.navigate('BulkPayment');
      }
    } else {
      navigation.navigate('Payment');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('completionSignOff') || 'Completion Sign-Off'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Instruction Header */}
        <View style={styles.heroHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-done" size={32} color={colors.success} />
          </View>
          <Text style={styles.title}>{t('completionSignOff')}</Text>
          <Text style={styles.subtitle}>
            {t('completionDesc') || 'Only share this completion code after you have inspected the finished repair.'}
          </Text>
        </View>

        {/* 4-Digit Completion OTP Card */}
        <View style={styles.otpCard}>
          <Text style={styles.otpCardLabel}>{t('completionOtpLabel')}</Text>
          <View style={styles.otpBoxesRow}>
            {completionOtp.split('').map((digit, index) => (
              <View key={index} style={styles.digitBox}>
                <Text style={styles.digitText}>{digit}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.otpDesc}>
            {t('sharingCompletionOtpDesc') || 'Sharing this OTP verifies satisfactory completion and unlocks final invoice settlement.'}
          </Text>
        </View>

        {/* Final Invoice Settlement Summary */}
        <View style={styles.settlementCard}>
          <View style={styles.settlementHeaderRow}>
            <Text style={styles.settlementTitle}>{t('finalInvoiceSettlement') || 'FINAL INVOICE SETTLEMENT'}</Text>
            <Text style={styles.settlementTotalAmount}>₹{finalPayable}</Text>
          </View>
          
          <View style={styles.settlementDivider} />

          <View style={styles.settlementRow}>
            <Text style={styles.settlementKey}>
              {activeBooking?.service?.name || t('service') || 'Service'} ({activeBooking?.trade_subtype || t('baseScope') || 'Base Scope'})
            </Text>
            <Text style={styles.settlementVal}>
              ₹{activeBooking?.worker_count > 1 ? (activeBooking?.single_worker_base || (activeBooking?.base_amount - (activeBooking?.extra_worker_cost || 0))) : (activeBooking?.base_amount || activeBooking?.service?.start_price || 299)}
            </Text>
          </View>

          {activeBooking?.worker_count > 1 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.primary, fontWeight: '700' }]}>
                • +{activeBooking.worker_count - 1} {t('additionalCoopArtisans') || 'Extra Cooperative Artisans'} ({activeBooking.worker_count}x Speed)
              </Text>
              <Text style={[styles.settlementVal, { color: colors.primary, fontWeight: '800' }]}>
                +₹{activeBooking?.extra_worker_cost || ((activeBooking.worker_count - 1) * 199)}
              </Text>
            </View>
          )}

          {activeBooking?.emergency_surge > 0 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.error }]}>• {t('emergencySurgeFee') || 'Priority Emergency Surge'}</Text>
              <Text style={[styles.settlementVal, { color: colors.error }]}>+₹{activeBooking.emergency_surge}</Text>
            </View>
          )}

          {isExtraApproved && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.primary }]}>
                • {activeBooking?.extra_work?.title || t('spares') || 'Spare Parts'}
              </Text>
              <Text style={[styles.settlementVal, { color: colors.primary }]}>
                +₹{activeBooking?.extra_work?.amount}
              </Text>
            </View>
          )}

          {activeBooking?.part_order?.part_cost > 0 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.successDark, fontWeight: '700' }]}>
                • Procured Component ({activeBooking.part_order.part_name})
              </Text>
              <Text style={[styles.settlementVal, { color: colors.successDark, fontWeight: '800' }]}>
                +₹{activeBooking.part_order.part_cost}
              </Text>
            </View>
          )}

          {isHelperApproved && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.cooperativePurple }]}>
                • {t('secondAssistant') || '2nd Assistant Artisan'} ({activeBooking?.second_worker?.name || 'Amit Verma'})
              </Text>
              <Text style={[styles.settlementVal, { color: colors.cooperativePurple }]}>
                +₹{activeBooking?.helper_request?.amount || 200}
              </Text>
            </View>
          )}

          {activeBooking?.overtime_charge > 0 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: '#B45309', fontWeight: '700' }]}>
                • {t('overtimeCharge') || 'Extended Duration Overtime (>2 hrs)'}
              </Text>
              <Text style={[styles.settlementVal, { color: '#B45309', fontWeight: '800' }]}>
                +₹{activeBooking.overtime_charge}
              </Text>
            </View>
          )}

          {activeBooking?.cancellation_penalty_fee > 0 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.danger, fontWeight: '700' }]}>
                • {t('previousCancellationPenalty') || 'Previous Cancellation Fee'}
              </Text>
              <Text style={[styles.settlementVal, { color: colors.danger, fontWeight: '800' }]}>
                +₹{activeBooking.cancellation_penalty_fee}
              </Text>
            </View>
          )}

          {activeBooking?.discount_applied > 0 && (
            <View style={styles.settlementRow}>
              <Text style={[styles.settlementKey, { color: colors.successDark }]}>• {t('firstTimeDiscount') || 'First-Time Welcome Discount'}</Text>
              <Text style={[styles.settlementVal, { color: colors.successDark }]}>-₹{activeBooking.discount_applied}</Text>
            </View>
          )}
        </View>

        {/* Quality Sign-off Checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>{t('qualityChecklist')}</Text>
          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkRow}
              onPress={() => toggleCheck(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.checked ? 'checkbox' : 'square-outline'}
                size={22}
                color={item.checked ? colors.success : colors.textMuted}
              />
              <Text style={[styles.checkLabel, item.checked && styles.checkLabelChecked]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conditional Warranty Notice */}
        {hasWarranty ? (
          <View style={styles.warrantyBox}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <View style={styles.warrantyTextCol}>
              <Text style={styles.warrantyTitle}>{t('warrantyActivated')}</Text>
              <Text style={styles.warrantySub}>
                {t('warrantyDesc') || 'If any technical defect occurs within 7 days, a senior cooperative supervisor will revisit and rectify it for free.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.warrantyBox, { backgroundColor: colors.primarySubtle }]}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <View style={styles.warrantyTextCol}>
              <Text style={[styles.warrantyTitle, { color: colors.primary }]}>{t('coopServiceSignOff') || 'Cooperative Service Sign-Off'}</Text>
              <Text style={[styles.warrantySub, { color: colors.primaryText }]}>
                {t('coopSignOffDesc') || 'Mutual completion handshake safeguards fair compensation and transparent cooperative records.'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Handshake Trigger Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmCompletion}
          activeOpacity={0.85}
        >
          <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.confirmBtnText}>
            {t('confirmCompletion')} (₹{finalPayable})
          </Text>
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
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.successLight,
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
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16
  },
  otpCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successDark,
    letterSpacing: 0.8,
    marginBottom: 14
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  digitBox: {
    width: 56,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center'
  },
  digitText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.successDark
  },
  otpDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 4
  },
  settlementCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  settlementHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settlementTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  settlementTotalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary
  },
  settlementDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10
  },
  settlementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 3
  },
  settlementKey: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8
  },
  settlementVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  checklistCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  checklistTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 12
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  checkLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 10,
    flex: 1
  },
  checkLabelChecked: {
    color: colors.textPrimary,
    fontWeight: '600'
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10
  },
  warrantyTextCol: {
    marginLeft: 10,
    flex: 1
  },
  warrantyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  warrantySub: {
    fontSize: 11,
    color: colors.primaryText,
    marginTop: 2,
    lineHeight: 15
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
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  }
});

export default Screen11_CompletionOTP;
