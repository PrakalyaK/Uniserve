import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export const Screen12_BulkPaymentScreen = ({ navigation }) => {
  const { activeBooking, processBulkPayment, completeBulkProject, setPaymentMethod } = useBooking();
  const { t } = useUser();

  const totalProjectCost = Number(activeBooking?.total_project_cost || 24000);
  const advanceAmount = Number(activeBooking?.advance_amount || Math.round(totalProjectCost * 0.4));
  const midMilestone = Number(activeBooking?.mid_milestone || Math.round(totalProjectCost * 0.35));
  const finalMilestone = Number(activeBooking?.final_milestone || (totalProjectCost - advanceAmount - midMilestone));
  const advancePercent = activeBooking?.advance_percent || 40;
  const crewSize = activeBooking?.crew_size || 4;
  const estimatedDays = activeBooking?.estimated_days || 2;
  const scaleLabel = activeBooking?.scale_label || 'Bulk Project';
  const materialLabel = activeBooking?.material_label || 'Standard Co-op Sourcing';

  const paidAmount = Number(activeBooking?.paid_amount || 0);
  const remainingAmount = Number(
    activeBooking?.remaining_amount !== undefined
      ? activeBooking.remaining_amount
      : (activeBooking?.payment_status === 'full_paid'
        ? 0
        : (activeBooking?.payment_status === 'advance_paid' ? Math.max(0, totalProjectCost - advanceAmount) : totalProjectCost))
  );
  const isFullyPaid = activeBooking?.payment_status === 'full_paid' || remainingAmount <= 0;
  const isAdvanceAlreadyPaid = !isFullyPaid && (activeBooking?.payment_status === 'advance_paid' || activeBooking?.milestone1_paid || paidAmount > 0);

  const [paymentOption, setPaymentOption] = useState(isAdvanceAlreadyPaid ? 'remaining_full' : 'milestone1');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  let amountToPay = 0;
  if (isFullyPaid) {
    amountToPay = 0;
  } else if (isAdvanceAlreadyPaid) {
    amountToPay = paymentOption === 'milestone2' ? midMilestone : remainingAmount;
  } else {
    amountToPay = paymentOption === 'full' ? totalProjectCost : advanceAmount;
  }

  const handlePayEscrow = () => {
    setIsProcessing(true);
    let methodTitle = 'SBI MSCS Direct NEFT/RTGS Transfer';
    if (selectedMethod === 'upi') methodTitle = 'SBI MSCS Escrow Instant UPI';
    else if (selectedMethod === 'card') methodTitle = 'SBI MSCS Escrow Corporate Card';
    else if (selectedMethod === 'netbanking') methodTitle = 'SBI MSCS Escrow NetBanking';

    const isFullOption = paymentOption === 'full' || paymentOption === 'remaining_full' || amountToPay >= remainingAmount;

    try {
      if (typeof processBulkPayment === 'function') {
        processBulkPayment({
          payment_option: isFullOption ? 'full' : 'advance',
          amount: amountToPay,
          method: methodTitle
        });
      }
      if (typeof setPaymentMethod === 'function') {
        setPaymentMethod(methodTitle);
      }
    } catch (e) {
      console.warn('Set payment method fallback:', e);
    }

    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('BulkProjectSuccess');
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('projectEscrowDeposit') || 'Project Escrow Deposit'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Bulk Project Hero Card */}
        <View style={styles.projectHeroCard}>
          <View style={styles.projectHeaderRow}>
            <View style={[styles.projectIconCircle, activeBooking?.client_type === 'institutional' && { backgroundColor: colors.primary }]}>
              <Ionicons name={activeBooking?.client_type === 'institutional' ? 'school' : 'business'} size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                <View style={styles.escrowBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.successDark} />
                  <Text style={styles.escrowBadgeText}>{t('sbiMscsEscrowProtected') || 'SBI MSCS ESCROW PROTECTED'}</Text>
                </View>
                {activeBooking?.statutory_compliance && (
                  <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: colors.primaryLight }}>
                    <Text style={{ fontSize: 8, fontWeight: '800', color: colors.primary }}>
                      {typeof activeBooking.statutory_compliance === 'object'
                        ? activeBooking.statutory_compliance.code
                        : activeBooking.statutory_compliance}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.projectTitle}>
                {activeBooking?.institution_name || scaleLabel}
              </Text>
              <Text style={styles.projectSub}>
                {activeBooking?.department_office ? activeBooking.department_office + ' • ' : ''}{activeBooking?.officer_name || materialLabel}
              </Text>
            </View>
          </View>

          <View style={styles.projectMetricsRow}>
            <View style={styles.projectMetricItem}>
              <Text style={styles.projectMetricLabel}>{t('squadSize') || 'SQUAD SIZE'}</Text>
              <Text style={styles.projectMetricVal}>{crewSize} {t('masterArtisans') || 'Master Artisans'}</Text>
            </View>
            <View style={styles.projectMetricDivider} />
            <View style={styles.projectMetricItem}>
              <Text style={styles.projectMetricLabel}>{t('duration') || 'DURATION'}</Text>
              <Text style={styles.projectMetricVal}>{estimatedDays} {t('daysDeployment') || 'Days Deployment'}</Text>
            </View>
            <View style={styles.projectMetricDivider} />
            <View style={styles.projectMetricItem}>
              <Text style={styles.projectMetricLabel}>{t('totalEstimate') || 'TOTAL ESTIMATE'}</Text>
              <Text style={[styles.projectMetricVal, { color: colors.primary }]}>₹{totalProjectCost.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Institutional Tax Invoice & Compliance Card */}
        {activeBooking?.client_type === 'institutional' && (
          <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="receipt" size={16} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 0.5, marginLeft: 6 }}>
                INSTITUTIONAL GST BILLING & COMPLIANCE
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 11, color: colors.textPrimary }}>
                🏛️ <Text style={{ fontWeight: '700' }}>Entity:</Text> {activeBooking.institution_name || 'Educational Institution'}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textPrimary }}>
                📑 <Text style={{ fontWeight: '700' }}>GSTIN / Tax ID:</Text> {activeBooking.gstin || '07AAAAA0000A1Z5 (Included on invoice)'}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textPrimary }}>
                🏷️ <Text style={{ fontWeight: '700' }}>SAC Classification:</Text> 9987 / 9985 (Cooperative Labour & Facility Services)
              </Text>
              <Text style={{ fontSize: 11, color: colors.textPrimary }}>
                👤 <Text style={{ fontWeight: '700' }}>Sign-off Officer:</Text> {activeBooking.officer_name || user?.name} ({activeBooking.officer_designation || 'Estate Officer'})
              </Text>
            </View>
          </View>
        )}

        {/* Payment Choice Selector */}
        {isFullyPaid ? (
          <View style={[styles.choiceCard, { borderColor: colors.successDark, borderWidth: 1.5, backgroundColor: '#F0FDF4' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={24} color={colors.successDark} />
              <Text style={[styles.sectionTitle, { color: colors.successDark, marginLeft: 8, marginBottom: 0 }]}>
                100% PROJECT ESCROW FUNDED & SECURED
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 19 }}>
              Total Project Escrow of <Text style={{ fontWeight: '800' }}>₹{totalProjectCost.toLocaleString()}</Text> is fully deposited into the Central SBI MSCS Escrow Trust. All milestone disbursements are pre-funded.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.successDark }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.successDark }}>✓ Advance (40%) Funded</Text>
              </View>
              <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.successDark }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.successDark }}>✓ Mid-Stage (35%) Funded</Text>
              </View>
              <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: colors.successDark }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.successDark }}>✓ Handover (25%) Funded</Text>
              </View>
            </View>
          </View>
        ) : isAdvanceAlreadyPaid ? (
          <View style={styles.choiceCard}>
            <View style={{ backgroundColor: '#ECFDF5', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.successDark, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.successDark} />
                <Text style={{ fontSize: 13, fontWeight: '800', color: colors.successDark, marginLeft: 6 }}>
                  MILESTONE 1 ADVANCE DEPOSITED: ₹{paidAmount.toLocaleString()}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                Raw material depot reserve is active. Outstanding escrow balance: <Text style={{ fontWeight: '800', color: colors.primary }}>₹{remainingAmount.toLocaleString()}</Text>.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>SELECT REMAINING ESCROW DISBURSEMENT</Text>

            {/* Option A: Pay Remaining Full Balance */}
            <TouchableOpacity
              style={[styles.choiceOption, paymentOption === 'remaining_full' && styles.choiceOptionSelected]}
              onPress={() => setPaymentOption('remaining_full')}
              activeOpacity={0.85}
            >
              <View style={[styles.radioCircle, paymentOption === 'remaining_full' && styles.radioCircleSelected]}>
                {paymentOption === 'remaining_full' && <View style={styles.radioInnerDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.choiceOptionHeader}>
                  <Text style={styles.choiceOptionTitle}>Pay Remaining Full Balance</Text>
                  <View style={styles.recommendedPill}>
                    <Text style={styles.recommendedPillText}>RECOMMENDED</Text>
                  </View>
                </View>
                <Text style={styles.choiceOptionSub}>
                  Covers Milestone 2 (Mid-Stage 35%) & Milestone 3 (Final 25%). Fully completes project funding.
                </Text>
              </View>
              <Text style={styles.choiceOptionAmount}>₹{remainingAmount.toLocaleString()}</Text>
            </TouchableOpacity>

            {/* Option B: Pay Milestone 2 Only */}
            <TouchableOpacity
              style={[styles.choiceOption, paymentOption === 'milestone2' && styles.choiceOptionSelected]}
              onPress={() => setPaymentOption('milestone2')}
              activeOpacity={0.85}
            >
              <View style={[styles.radioCircle, paymentOption === 'milestone2' && styles.radioCircleSelected]}>
                {paymentOption === 'milestone2' && <View style={styles.radioInnerDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.choiceOptionHeader}>
                  <Text style={styles.choiceOptionTitle}>Milestone 2: Mid-Stage Quality Audit (35%)</Text>
                </View>
                <Text style={styles.choiceOptionSub}>
                  Deposits next milestone stage. Released upon physical inspection sign-off.
                </Text>
              </View>
              <Text style={styles.choiceOptionAmount}>₹{midMilestone.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.choiceCard}>
            <Text style={styles.sectionTitle}>{t('selectEscrowOption') || 'SELECT ESCROW DEPOSIT OPTION'}</Text>

            <TouchableOpacity
              style={[styles.choiceOption, paymentOption === 'milestone1' && styles.choiceOptionSelected]}
              onPress={() => setPaymentOption('milestone1')}
              activeOpacity={0.85}
            >
              <View style={[styles.radioCircle, paymentOption === 'milestone1' && styles.radioCircleSelected]}>
                {paymentOption === 'milestone1' && <View style={styles.radioInnerDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.choiceOptionHeader}>
                  <Text style={styles.choiceOptionTitle}>{t('milestone1Advance') || 'Milestone 1 Advance'} ({advancePercent}%)</Text>
                  <View style={styles.recommendedPill}>
                    <Text style={styles.recommendedPillText}>{t('recommended') || 'RECOMMENDED'}</Text>
                  </View>
                </View>
                <Text style={styles.choiceOptionSub}>
                  {t('milestone1Sub') || 'Locks artisan squad & funds wholesale raw material depot reserve.'}
                </Text>
              </View>
              <Text style={styles.choiceOptionAmount}>₹{advanceAmount.toLocaleString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choiceOption, paymentOption === 'full' && styles.choiceOptionSelected]}
              onPress={() => setPaymentOption('full')}
              activeOpacity={0.85}
            >
              <View style={[styles.radioCircle, paymentOption === 'full' && styles.radioCircleSelected]}>
                {paymentOption === 'full' && <View style={styles.radioInnerDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.choiceOptionHeader}>
                  <Text style={styles.choiceOptionTitle}>{t('fullProjectEscrow') || 'Full Project Escrow (100%)'}</Text>
                </View>
                <Text style={styles.choiceOptionSub}>
                  {t('fullEscrowSub') || 'Total amount held in SBI Escrow. Released automatically as each stage is verified.'}
                </Text>
              </View>
              <Text style={styles.choiceOptionAmount}>₹{totalProjectCost.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3-Stage Milestone Escrow Schedule Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneCardHeader}>
            <Ionicons name="list" size={16} color={colors.primary} />
            <Text style={styles.milestoneCardTitle}>{t('milestoneScheduleTitle') || '3-STAGE ESCROW DISBURSEMENT SCHEDULE'}</Text>
          </View>

          <View style={styles.milestoneList}>
            {/* Stage 1 */}
            <View style={styles.milestoneRow}>
              <View style={[styles.milestoneNumCircle, { backgroundColor: (isAdvanceAlreadyPaid || isFullyPaid) ? colors.successDark : colors.primary }]}>
                {(isAdvanceAlreadyPaid || isFullyPaid) ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={styles.milestoneNumText}>1</Text>
                )}
              </View>
              <View style={styles.milestoneContent}>
                <View style={styles.milestoneHeaderRow}>
                  <Text style={styles.milestoneName}>{t('milestone1Title') || 'Milestone 1: Advance & Procurement'} ({advancePercent}%)</Text>
                  <Text style={[styles.milestoneVal, { color: (isAdvanceAlreadyPaid || isFullyPaid) ? colors.successDark : colors.primary }]}>
                    ₹{advanceAmount.toLocaleString()} {(isAdvanceAlreadyPaid || isFullyPaid) ? '(DEPOSITED ✓)' : ''}
                  </Text>
                </View>
                <Text style={styles.milestoneDetail}>
                  {(isAdvanceAlreadyPaid || isFullyPaid)
                    ? 'Deposited & secured in SBI Escrow. Wholesale material reserve unlocked.'
                    : (t('milestone1Payable') || 'Payable now into SBI Escrow. Unlocks wholesale material sourcing and crew blocking.')}
                </Text>
              </View>
            </View>

            {/* Stage 2 */}
            <View style={styles.milestoneRow}>
              <View style={[styles.milestoneNumCircle, { backgroundColor: isFullyPaid ? colors.successDark : '#F59E0B' }]}>
                {isFullyPaid ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={styles.milestoneNumText}>2</Text>
                )}
              </View>
              <View style={styles.milestoneContent}>
                <View style={styles.milestoneHeaderRow}>
                  <Text style={styles.milestoneName}>{t('milestone2Title') || 'Milestone 2: Mid-Stage Quality Audit'} (35%)</Text>
                  <Text style={[styles.milestoneVal, isFullyPaid && { color: colors.successDark }]}>
                    ₹{midMilestone.toLocaleString()} {isFullyPaid ? '(DEPOSITED ✓)' : ''}
                  </Text>
                </View>
                <Text style={styles.milestoneDetail}>
                  {isFullyPaid
                    ? 'Pre-funded in SBI Escrow. Released automatically upon physical progress check.'
                    : (t('milestone2Disbursed') || 'Disbursed only after physical progress check by Ward Coordinator.')}
                </Text>
              </View>
            </View>

            {/* Stage 3 */}
            <View style={styles.milestoneRow}>
              <View style={[styles.milestoneNumCircle, { backgroundColor: isFullyPaid ? colors.successDark : colors.textMuted }]}>
                {isFullyPaid ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text style={styles.milestoneNumText}>3</Text>
                )}
              </View>
              <View style={styles.milestoneContent}>
                <View style={styles.milestoneHeaderRow}>
                  <Text style={styles.milestoneName}>{t('milestone3Title') || 'Milestone 3: Final Sign-off'} ({100 - advancePercent - 35}%)</Text>
                  <Text style={[styles.milestoneVal, isFullyPaid && { color: colors.successDark }]}>
                    ₹{finalMilestone.toLocaleString()} {isFullyPaid ? '(DEPOSITED ✓)' : ''}
                  </Text>
                </View>
                <Text style={styles.milestoneDetail}>
                  {isFullyPaid
                    ? 'Pre-funded in SBI Escrow. Released strictly after customer completion OTP handshake.'
                    : (t('milestone3Released') || 'Released strictly after customer completion OTP handshake & 7-day warranty activation.')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Govt SBI MSCS Escrow Account Trust Card */}
        <View style={styles.trustCard}>
          <View style={styles.trustHeader}>
            <Ionicons name="lock-closed" size={16} color={colors.successDark} />
            <Text style={styles.trustTitle}>{t('govtEscrowAccountTitle') || 'GOVERNMENT SBI MSCS ESCROW TRUST ACCOUNT'}</Text>
          </View>
          <Text style={styles.trustDesc}>
            {t('govtEscrowDesc') || 'Funds are deposited into the Central Multi-State Cooperative Society (MSCS) Trust Escrow Account at State Bank of India (SBI). Artisans are compensated strictly upon verified milestone sign-offs.'}
          </Text>
          <View style={styles.trustAccountBox}>
            <Text style={styles.trustAccountKey}>{t('escrowBeneficiary') || 'ESCROW TRUST BENEFICIARY:'}</Text>
            <Text style={styles.trustAccountVal}>SBI-MSCS-COOP-SERVICES-ESCROW-8839</Text>
          </View>
        </View>

        {/* Payment Gateway Options */}
        <View style={styles.methodCard}>
          <Text style={styles.sectionTitle}>{t('selectPayment') || 'SELECT PAYMENT METHOD'}</Text>

          {/* UPI */}
          <TouchableOpacity
            style={[styles.methodOption, selectedMethod === 'upi' && styles.methodOptionSelected]}
            onPress={() => setSelectedMethod('upi')}
            activeOpacity={0.8}
          >
            <View style={styles.methodIconBox}>
              <Ionicons name="phone-portrait" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>{t('instantUpi') || 'Instant UPI (GPay / PhonePe / Paytm / BHIM)'}</Text>
              <Text style={styles.methodSub}>{t('zeroFeeInstantCredit') || 'Zero transaction fees • Instant Escrow Credit'}</Text>
            </View>
            <Ionicons
              name={selectedMethod === 'upi' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selectedMethod === 'upi' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Corporate / Personal Cards */}
          <TouchableOpacity
            style={[styles.methodOption, selectedMethod === 'card' && styles.methodOptionSelected]}
            onPress={() => setSelectedMethod('card')}
            activeOpacity={0.8}
          >
            <View style={styles.methodIconBox}>
              <Ionicons name="card" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>{t('cardPayment') || 'Credit / Debit Cards (RuPay, Visa, Mastercard)'}</Text>
              <Text style={styles.methodSub}>{t('corpCardGstSupported') || 'Corporate card & GST invoice supported'}</Text>
            </View>
            <Ionicons
              name={selectedMethod === 'card' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selectedMethod === 'card' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>

          {/* NetBanking */}
          <TouchableOpacity
            style={[styles.methodOption, selectedMethod === 'netbanking' && styles.methodOptionSelected]}
            onPress={() => setSelectedMethod('netbanking')}
            activeOpacity={0.8}
          >
            <View style={styles.methodIconBox}>
              <Ionicons name="globe" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.methodTitle}>{t('netbankingNeftTransfer') || 'NetBanking / Direct NEFT Escrow Transfer'}</Text>
              <Text style={styles.methodSub}>{t('netbankingBanksList') || 'SBI, HDFC, ICICI, Axis, PNB & Co-op Banks'}</Text>
            </View>
            <Ionicons
              name={selectedMethod === 'netbanking' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selectedMethod === 'netbanking' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Cooperative Bulk Wage & Material Allocation */}
        <View style={styles.allocationCard}>
          <Text style={styles.allocationTitle}>{t('coopProjectFundAlloc') || 'COOPERATIVE PROJECT FUND ALLOCATION'}</Text>
          <View style={styles.allocationBar}>
            <View style={[styles.allocSegment, { width: '50%', backgroundColor: colors.primary }]} />
            <View style={[styles.allocSegment, { width: '38%', backgroundColor: colors.successDark }]} />
            <View style={[styles.allocSegment, { width: '8%', backgroundColor: '#F59E0B' }]} />
            <View style={[styles.allocSegment, { width: '4%', backgroundColor: colors.cooperativePurple }]} />
          </View>
          <View style={styles.allocLegendGrid}>
            <View style={styles.allocLegendItem}>
              <View style={[styles.allocDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.allocLegendText}>{t('alloc50Material') || '50% Wholesale Material Depot'}</Text>
            </View>
            <View style={styles.allocLegendItem}>
              <View style={[styles.allocDot, { backgroundColor: colors.successDark }]} />
              <Text style={styles.allocLegendText}>{t('alloc38Wages') || '38% Master Artisan Squad Wages'}</Text>
            </View>
            <View style={styles.allocLegendItem}>
              <View style={[styles.allocDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.allocLegendText}>{t('alloc8Warranty') || '8% Ward Quality & Warranty Fund'}</Text>
            </View>
            <View style={styles.allocLegendItem}>
              <View style={[styles.allocDot, { backgroundColor: colors.cooperativePurple }]} />
              <Text style={styles.allocLegendText}>{t('alloc4Tax') || '4% Co-op Infrastructure & Tax'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Deposit / Handover Action */}
      <View style={styles.bottomBar}>
        {isFullyPaid ? (
          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <TouchableOpacity
              style={[styles.payBtn, { flex: 1, backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('BulkProjectSuccess')}
              activeOpacity={0.85}
            >
              <View style={styles.payBtnRow}>
                <Ionicons name="document-text" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={[styles.payBtnText, { fontSize: 13 }]}>Project & Gate Pass</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.payBtn, { flex: 1, backgroundColor: colors.successDark }]}
              onPress={() => {
                if (typeof completeBulkProject === 'function') completeBulkProject();
                navigation.navigate('Rating', { booking: activeBooking });
              }}
              activeOpacity={0.85}
            >
              <View style={styles.payBtnRow}>
                <Ionicons name="star" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={[styles.payBtnText, { fontSize: 13 }]}>Complete & Rate</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePayEscrow}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <View style={styles.payBtnRow}>
                <Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.payBtnText}>
                  {isAdvanceAlreadyPaid ? 'Pay Remaining Escrow' : (t('depositEscrow') || 'Deposit Escrow')} • ₹{amountToPay.toLocaleString()}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>
        )}
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
    paddingTop: 14,
    paddingBottom: 100
  },
  projectHeroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  projectIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  escrowBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successDark,
    marginLeft: 4
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  projectSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  projectMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    marginTop: 14
  },
  projectMetricItem: {
    flex: 1,
    alignItems: 'center'
  },
  projectMetricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  projectMetricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  projectMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  choiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 12
  },
  choiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10
  },
  choiceOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: colors.primary
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSelected: {
    borderColor: colors.primary
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  choiceOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  choiceOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  recommendedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6
  },
  recommendedPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.successDark
  },
  choiceOptionSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14
  },
  choiceOptionAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
    marginLeft: 8
  },
  milestoneCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  milestoneCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  milestoneCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginLeft: 6
  },
  milestoneList: {
    gap: 14
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  milestoneNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12
  },
  milestoneNumText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  milestoneContent: {
    flex: 1
  },
  milestoneHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  milestoneName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  milestoneVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  milestoneDetail: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14
  },
  trustCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.success,
    marginBottom: 14
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  trustTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
    letterSpacing: 0.5,
    marginLeft: 6
  },
  trustDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10
  },
  trustAccountBox: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  trustAccountKey: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary
  },
  trustAccountVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2
  },
  methodCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10
  },
  methodOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF'
  },
  methodIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  methodSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  allocationCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  allocationTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  allocationBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12
  },
  allocSegment: {
    height: '100%'
  },
  allocLegendGrid: {
    gap: 6
  },
  allocLegendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  allocDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  allocLegendText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600'
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
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  payBtnRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen12_BulkPaymentScreen;
