import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import PaymentBreakdown from '../components/PaymentBreakdown';
import Screen12_BulkPaymentScreen from './Screen12_BulkPaymentScreen';

export const Screen12_PaymentScreen = ({ navigation }) => {
  const { activeBooking, totalAmount, completePayment, isFirstTimeUser, FIRST_TIME_DISCOUNT, computeTotal } = useBooking();
  const { user, t } = useUser();

  // If bulk project is active, delegate directly to dedicated Bulk Payment Screen
  if (activeBooking?.is_bulk_project) {
    return <Screen12_BulkPaymentScreen navigation={navigation} />;
  }

  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('priya.sharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const PAYMENT_METHODS = [
    { id: 'UPI', label: t('instantUpi') || 'Instant UPI (GPay, PhonePe, Paytm)', icon: 'flash', badge: t('fastest') || 'Fastest' },
    { id: 'Card', label: t('cardPayment') || 'Credit / Debit Card', icon: 'card', badge: null },
    { id: 'Wallet', label: t('coopWallet') || 'Cooperative Citizen Wallet', icon: 'wallet', badge: `₹500 ${t('balance') || 'Balance'}` },
    { id: 'Cash', label: t('codPayment') || 'Cash on Delivery', icon: 'cash', badge: null }
  ];

  // Dynamic final amount calculation for solo service
  const amountToPay = computeTotal ? computeTotal(activeBooking) : (totalAmount || activeBooking?.total_amount || 350);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        if (typeof completePayment === 'function') {
          completePayment(selectedMethod);
        }
      } catch (err) {
        console.error('Payment completion err:', err);
      } finally {
        setIsProcessing(false);
        navigation.navigate('PaymentSuccess');
      }
    }, 1000);
  };

  const isExtraApproved = activeBooking?.extra_work?.approved;
  const isHelperApproved = activeBooking?.second_worker || activeBooking?.helper_request?.status === 'approved';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('paymentSettlement') || 'Payment Settlement'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Payable Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>{t('totalPayable')}</Text>
          <Text style={styles.amountVal}>₹{amountToPay}</Text>
          <View style={styles.bookingRefRow}>
            <Text style={styles.bookingRefText}>{t('bookingId') || 'Booking ID'}: {activeBooking?.booking_id || 'BK84920'}</Text>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={12} color={colors.successDark} />
              <Text style={styles.verifiedTagText}>{t('workVerified') || 'Work Verified'}</Text>
            </View>
          </View>
        </View>

        {/* Itemized Cost Breakdown Card */}
        <View style={styles.itemizedCard}>
          <Text style={styles.itemizedHeader}>{t('itemizedServiceCharges') || 'ITEMIZED SERVICE CHARGES'}</Text>
          
          {/* Base Service Rate (Lead Artisan) */}
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>
              {activeBooking?.service?.name || t('homeService') || 'Home Service'} ({activeBooking?.worker_count > 1 ? `${t('leadArtisan') || 'Lead Artisan'}: ` : ''}{activeBooking?.trade_subtype || t('baseDiagnostic') || 'Base Diagnostic'})
            </Text>
            <Text style={styles.itemVal}>
              ₹{activeBooking?.worker_count > 1 ? (activeBooking?.single_worker_base || (activeBooking?.base_amount - (activeBooking?.extra_worker_cost || 0))) : (activeBooking?.base_amount || activeBooking?.service?.start_price || 299)}
            </Text>
          </View>

          {/* Additional Multi-Artisans (Cleaner & Gardener up to 3) */}
          {activeBooking?.worker_count > 1 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                <Ionicons name="people" size={13} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.itemLabel, { color: colors.primary, fontWeight: '700' }]} numberOfLines={1}>
                  +{activeBooking.worker_count - 1} {t('additionalCoopArtisans') || 'Additional Cooperative Artisans'} ({activeBooking.worker_count}x {t('speed') || 'Speed'})
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.primary, fontWeight: '800' }]}>
                +₹{activeBooking?.extra_worker_cost || ((activeBooking.worker_count - 1) * 199)}
              </Text>
            </View>
          )}

          {/* Emergency Priority Surge */}
          {activeBooking?.emergency_surge > 0 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="flash" size={13} color={colors.error} style={{ marginRight: 4 }} />
                <Text style={[styles.itemLabel, { color: colors.error }]}>{t('emergencySurgeFee') || 'Emergency Priority Surge'} (&lt;15 min)</Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.error }]}>+₹{activeBooking.emergency_surge}</Text>
            </View>
          )}

          {/* Approved Extra Spare Parts */}
          {isExtraApproved && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                <Ionicons name="construct" size={13} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {activeBooking?.extra_work?.title || t('spares') || 'Approved Spare Parts'}
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.primary }]}>
                +₹{activeBooking?.extra_work?.amount}
              </Text>
            </View>
          )}

          {/* Procured Spare Part / Component (Phase I) */}
          {activeBooking?.part_order?.part_cost > 0 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                <Ionicons name="cog" size={13} color={colors.successDark} style={{ marginRight: 4 }} />
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {activeBooking?.part_order?.part_name || 'Procured Replacement Component'}
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.successDark, fontWeight: '800' }]}>
                +₹{activeBooking.part_order.part_cost}
              </Text>
            </View>
          )}

          {/* Approved 2nd Assistant Artisan */}
          {isHelperApproved && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                <Ionicons name="people" size={13} color={colors.cooperativePurple} style={{ marginRight: 4 }} />
                <Text style={styles.itemLabel} numberOfLines={1}>
                  {t('secondAssistant') || '2nd Assistant Artisan'} ({activeBooking?.second_worker?.name || 'Amit Verma'})
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.cooperativePurple }]}>
                +₹{activeBooking?.helper_request?.amount || activeBooking?.service?.helper_request?.amount || 200}
              </Text>
            </View>
          )}

          {/* Overtime Surcharge (>2 Hours - Phase II) */}
          {activeBooking?.overtime_charge > 0 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time" size={13} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={[styles.itemLabel, { color: '#B45309', fontWeight: '700' }]}>
                  {t('overtimeCharge') || 'Extended Duration Overtime (>2 hrs)'}
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: '#B45309', fontWeight: '800' }]}>
                +₹{activeBooking.overtime_charge}
              </Text>
            </View>
          )}

          {/* Previous Booking Cancellation Penalty (Phase III) */}
          {activeBooking?.cancellation_penalty_fee > 0 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="alert-circle" size={13} color={colors.danger} style={{ marginRight: 4 }} />
                <Text style={[styles.itemLabel, { color: colors.danger, fontWeight: '700' }]}>
                  {t('previousCancellationPenalty') || 'Previous Booking Cancellation Fee'}
                </Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.danger, fontWeight: '800' }]}>
                +₹{activeBooking.cancellation_penalty_fee}
              </Text>
            </View>
          )}

          {/* Welcome Discount */}
          {activeBooking?.discount_applied > 0 && (
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="gift" size={13} color={colors.successDark} style={{ marginRight: 4 }} />
                <Text style={[styles.itemLabel, { color: colors.successDark }]}>{t('firstTimeDiscount') || 'First-Time User Welcome Discount'}</Text>
              </View>
              <Text style={[styles.itemVal, { color: colors.successDark }]}>-₹{activeBooking.discount_applied}</Text>
            </View>
          )}

          {/* Net Total Row */}
          <View style={styles.netTotalRow}>
            <Text style={styles.netTotalLabel}>{t('netAmountPayable') || 'Net Amount Payable'}</Text>
            <Text style={styles.netTotalVal}>₹{amountToPay}</Text>
          </View>
        </View>

        {/* WHERE YOUR MONEY GOES: Fair Wage Breakdown (Calculated directly on amountToPay) */}
        <View style={styles.breakdownContainer}>
          <Text style={styles.sectionHeading}>{t('whereMoneyGoes') || 'WHERE YOUR MONEY GOES (TRANSPARENT 80/10/6/4 SPLIT)'}</Text>
          <PaymentBreakdown totalAmount={amountToPay} />
        </View>

        {/* Payment Methods Selection */}
        <Text style={[styles.sectionHeading, { marginTop: 8 }]}>{t('selectPayment')}</Text>
        <View style={styles.methodsList}>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.75}
              >
                <View style={styles.methodLeft}>
                  <View style={[styles.methodIconBox, isSelected && styles.methodIconBoxSelected]}>
                    <Ionicons
                      name={method.icon}
                      size={20}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                      {method.label}
                    </Text>
                    {method.badge && (
                      <Text style={styles.methodBadge}>{method.badge}</Text>
                    )}
                  </View>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* If UPI is selected, show UPI ID field */}
        {selectedMethod === 'UPI' && (
          <View style={styles.upiInputCard}>
            <Text style={styles.upiInputLabel}>{t('enterVpa') || 'Enter Virtual Payment Address (VPA)'}</Text>
            <View style={styles.upiInputWrap}>
              <Ionicons name="at" size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.upiTextInput}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="username@bank"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
              <View style={styles.upiVerifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.successDark} />
                <Text style={styles.upiVerifiedText}>{t('autoVerified') || 'Auto-Verified'}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Pay Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePay}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.payBtnRow}>
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
              <Text style={styles.payBtnText}>
                {t('payNow')} • ₹{amountToPay}
              </Text>
            </View>
          )}
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
  amountCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  amountVal: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginVertical: 2
  },
  bookingRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  bookingRefText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 3
  },
  itemizedCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  itemizedHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },
  itemLabel: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500'
  },
  itemVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  netTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  netTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  netTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary
  },
  breakdownContainer: {
    marginBottom: 14
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8
  },
  methodsList: {
    gap: 10,
    marginBottom: 14
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  methodCardSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySubtle
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  methodIconBoxSelected: {
    backgroundColor: colors.surface
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary
  },
  methodLabelSelected: {
    color: colors.primary,
    fontWeight: '800'
  },
  methodBadge: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSelected: {
    borderColor: colors.primary
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  upiInputCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  upiInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8
  },
  upiInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border
  },
  upiTextInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    height: '100%'
  },
  upiVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upiVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 3
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
  payBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  payBtnRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  }
});

export default Screen12_PaymentScreen;
