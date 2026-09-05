import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import BookingStatusStepper from '../components/BookingStatusStepper';
import PaymentBreakdown from '../components/PaymentBreakdown';
import AudioVoiceRecorder from '../components/AudioVoiceRecorder';
import { getFallbackWorkerForTrade } from '../utils/locationService';

export const Screen09_JobInProgress = ({ route, navigation }) => {
  const {
    activeBooking,
    totalAmount,
    verifyStartOtp,
    approveExtraWork,
    declineExtraWork,
    approveSecondWorker,
    declineSecondWorker,
    completeBulkProject,
    requestPartProcurement,
    resumeWorkWithOtp,
    applyOvertimeCharge
  } = useBooking();
  const { t } = useUser();

  const fallbackWorker = getFallbackWorkerForTrade(activeBooking?.service || route.params?.service);
  const worker = activeBooking?.worker || route.params?.worker || fallbackWorker;
  const secondWorker = activeBooking?.second_worker;
  const service = activeBooking?.service;
  const extraWorkDef = service?.extra_work;
  const helperDef = service?.helper_request;
  const helperAllowed = helperDef?.allowed !== false;

  // Phase I eligibility: Electrician (s2) and Technician (s7) solo services only
  const isPartPauseEligible = !activeBooking?.is_bulk_project && (
    ['s2', 's7'].includes(service?.id) ||
    ['electrician', 'technician'].includes((service?.name || '').toLowerCase())
  );

  // Part Procurement & Resume OTP Modal States (Phase I)
  const [procurementModalVisible, setProcurementModalVisible] = useState(false);
  const [partNameInput, setPartNameInput] = useState(
    service?.id === 's2' ? '32A C-Curve MCB & Fire-Retardant Conduit' : 'Dual-Run Compressor Capacitor & Gas Valve'
  );
  const [partCostInput, setPartCostInput] = useState(service?.id === 's2' ? '220' : '400');
  const [deliveryEstInput, setDeliveryEstInput] = useState('1-2 Business Days (Warehouse Transit)');

  const [resumeOtpModalVisible, setResumeOtpModalVisible] = useState(false);
  const [resumeOtpInput, setResumeOtpInput] = useState('');
  const [resumeOtpError, setResumeOtpError] = useState('');

  const calculateCurrentSeconds = () => {
    if (activeBooking?.is_bulk_project) return 0;
    if (activeBooking?.is_procurement_paused) {
      return Number(activeBooking?.accumulated_work_seconds || 0);
    }
    if (activeBooking?.work_session_resumed_at) {
      const base = Number(activeBooking?.accumulated_work_seconds || 0);
      const resumedDiff = Math.floor((Date.now() - activeBooking.work_session_resumed_at) / 1000);
      return Math.max(0, base + resumedDiff);
    }
    if (activeBooking?.work_started_at) {
      const diff = Math.floor((Date.now() - activeBooking.work_started_at) / 1000);
      return Math.max(0, diff);
    }
    return 0;
  };

  const [secondsElapsed, setSecondsElapsed] = useState(calculateCurrentSeconds);
  const [isDispatchingHelper, setIsDispatchingHelper] = useState(false);

  useEffect(() => {
    if (!activeBooking?.work_started_at) {
      verifyStartOtp();
    }

    // Multi-day bulk contracts span days/weeks — no runtime stopwatch timer needed
    if (activeBooking?.is_bulk_project) return;

    if (activeBooking?.is_procurement_paused) {
      setSecondsElapsed(Number(activeBooking?.accumulated_work_seconds || 0));
      return;
    }

    const timer = setInterval(() => {
      const current = calculateCurrentSeconds();
      setSecondsElapsed(current);

      // Phase II: Automatic Overtime Detection (> 7200 seconds / 2 hours)
      if (current >= 7200 && (!activeBooking?.overtime_charge || activeBooking.overtime_charge < 100)) {
        applyOvertimeCharge(100);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    activeBooking?.work_started_at,
    activeBooking?.is_bulk_project,
    activeBooking?.is_procurement_paused,
    activeBooking?.work_session_resumed_at,
    activeBooking?.accumulated_work_seconds
  ]);

  const handleRequestPartOrder = () => {
    setProcurementModalVisible(false);
    const generatedOtp = requestPartProcurement({
      part_name: partNameInput,
      estimated_delivery: deliveryEstInput,
      part_cost: Number(partCostInput) || 250,
      current_seconds: secondsElapsed
    });
    Alert.alert(
      '⏸️ Work Timer Paused',
      `Worker request approved for "${partNameInput}". Work timer has been paused.\n\nRESUME OTP: ${generatedOtp}\n\nShare this 4-digit code with the artisan when they return with the spare part to resume work.`
    );
  };

  const handleVerifyResumeOtp = () => {
    if (!resumeOtpInput || resumeOtpInput.trim().length !== 4) {
      setResumeOtpError('Please enter a valid 4-digit OTP.');
      return;
    }
    const res = resumeWorkWithOtp(resumeOtpInput.trim());
    if (res.success) {
      setResumeOtpModalVisible(false);
      setResumeOtpInput('');
      setResumeOtpError('');
      Alert.alert(
        '▶️ Work Timer Resumed',
        'Spare part received & verified! Work timer has resumed from where it paused. Zero minutes were billed during procurement.'
      );
    } else {
      setResumeOtpError(res.error || 'Incorrect OTP. Please check the code shown on your screen.');
    }
  };

  const handleSimulateOvertime = () => {
    applyOvertimeCharge(100);
    setSecondsElapsed(7205);
    Alert.alert(
      '⏱️ 2-Hour Overtime Activated',
      'Work duration fast-forwarded past 2 hours (120 mins). Automatic overtime surcharge of +₹100 has been applied under Cooperative Fair-Wage Rules.'
    );
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishJob = () => {
    if (activeBooking?.is_bulk_project) {
      if (typeof completeBulkProject === 'function') completeBulkProject();
      navigation.navigate('Rating', { booking: activeBooking });
      return;
    }
    navigation.navigate('CompletionOTP', { worker });
  };

  const handleApproveExtraParts = () => {
    approveExtraWork({
      title: extraWorkDef?.title || 'Component Replacement',
      amount: extraWorkDef?.amount || 150,
      description: extraWorkDef?.description || 'Additional spare parts approved by user',
      photo: extraWorkDef?.photo
    });
  };

  const handleDeclineExtraParts = () => {
    declineExtraWork();
  };

  const handleApproveHelper = () => {
    setIsDispatchingHelper(true);
    setTimeout(() => {
      approveSecondWorker({
        id: 'h2',
        name: 'Amit Verma',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
        role: helperDef?.role || 'Cooperative Assistant Artisan',
        rating: 4.8,
        phone: '+91 98112 34567',
        cooperative: 'Delhi Labour Cooperative Union'
      });
      setIsDispatchingHelper(false);
    }, 1000);
  };

  const handleDeclineHelper = () => {
    declineSecondWorker();
  };

  const isExtraApproved = activeBooking?.extra_work?.approved;
  const isExtraDeclined = activeBooking?.extra_work?.declined;
  const isHelperApproved = secondWorker || activeBooking?.helper_request?.status === 'approved';
  const isHelperDeclined = activeBooking?.helper_request?.status === 'declined';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={`${t('workInProgress')} • ${activeBooking?.booking_id || 'BK84920'}`}
        showBack
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Header: Multi-Day Project Deployment for Bulk/Community (NO stopwatch timer) vs Solo Live Stopwatch Timer */}
        {activeBooking?.is_bulk_project ? (
          <View style={[styles.timerHeader, { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: '#F8FAFC' }]}>
            <View style={[styles.livePulseRow, { backgroundColor: activeBooking?.client_type === 'institutional' ? '#EFF6FF' : '#F0FDF4' }]}>
              <Ionicons
                name={activeBooking?.client_type === 'institutional' ? 'school' : 'business'}
                size={13}
                color={colors.primary}
              />
              <Text style={[styles.livePulseText, { color: colors.primary, marginLeft: 5 }]}>
                {activeBooking?.client_type === 'institutional'
                  ? 'CAMPUS INFRASTRUCTURE CONTRACT • ACTIVE DEPLOYMENT'
                  : 'COMMUNITY BULK PROJECT • ACTIVE DEPLOYMENT'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <Ionicons name="calendar" size={26} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.timerValue, { fontSize: 22, color: colors.primary }]}>
                {activeBooking?.estimated_days
                  ? `${activeBooking.estimated_days} Days Scheduled Deployment`
                  : 'Multi-Day Project Deployment'}
              </Text>
            </View>
            <Text style={[styles.timerSubtext, { textAlign: 'center', maxWidth: '92%' }]}>
              {activeBooking?.crew_size || 4} Certified Master Artisans Squad deployed on-site • Milestone & Escrow Managed (Multi-day schedule)
            </Text>
          </View>
        ) : (
          <View style={styles.timerHeader}>
            <View style={[styles.livePulseRow, activeBooking?.is_procurement_paused && { backgroundColor: '#FEF3C7' }]}>
              <View style={[styles.pulseDot, activeBooking?.is_procurement_paused && { backgroundColor: '#D97706' }]} />
              <Text style={[styles.livePulseText, activeBooking?.is_procurement_paused && { color: '#B45309', fontWeight: '800' }]}>
                {activeBooking?.is_procurement_paused ? '⏸️ WORK TIMER PAUSED • AWAITING PART PROCUREMENT' : t('workInProgress')}
              </Text>
            </View>
            <Text style={[styles.timerValue, activeBooking?.is_procurement_paused && { color: '#B45309' }]}>
              {formatTimer(secondsElapsed)} {activeBooking?.is_procurement_paused ? '(FROZEN)' : ''}
            </Text>
            <Text style={styles.timerSubtext}>
              {activeBooking?.is_procurement_paused
                ? 'Work stopwatch is completely frozen. Zero extra minutes are billed while waiting for part arrival.'
                : (t('activeServiceInProgress') || 'Active service in progress at your address')}
            </Text>

            {/* Overtime Surcharge Badge if >= 7200s or overtime applied (Phase II) */}
            {(secondsElapsed >= 7200 || activeBooking?.overtime_charge > 0) && (
              <View style={styles.overtimeBanner}>
                <Ionicons name="time" size={16} color="#92400E" />
                <Text style={styles.overtimeBannerText}>
                  ⏱️ Extended Service (&gt;2 hrs): +₹100 Overtime Charge Added (Cooperative Fair-Wage Clause)
                </Text>
              </View>
            )}

            {/* Phase I: Resume OTP Display Banner (When procurement paused) */}
            {activeBooking?.is_procurement_paused && activeBooking?.part_resume_otp && (
              <View style={styles.resumeOtpCard}>
                <Text style={styles.resumeOtpLabel}>RESUME OTP (SHARE WITH ARTISAN WHEN THEY RETURN WITH PART):</Text>
                <Text style={styles.resumeOtpCode}>{activeBooking.part_resume_otp}</Text>
                <Text style={styles.resumeOtpSub}>
                  Part: {activeBooking.part_order?.part_name || 'ISI Spare Part'} (₹{activeBooking.part_order?.part_cost || 0}) • {activeBooking.part_order?.estimated_delivery || '1-2 Days'}
                </Text>
                <TouchableOpacity
                  style={styles.resumeWorkBtn}
                  onPress={() => setResumeOtpModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play" size={14} color="#FFFFFF" />
                  <Text style={styles.resumeWorkBtnText}>Artisan Returned with Part? Enter Resume OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Phase I: Part Procurement Pause Button (Electrician & Technician Only) */}
        {isPartPauseEligible && !activeBooking?.is_procurement_paused && (
          <View style={styles.partProcurementBox}>
            <View style={styles.procurementHeaderRow}>
              <Ionicons name="hardware-chip" size={18} color={colors.primary} />
              <Text style={styles.procurementHeaderTitle}>Specialized Part Procurement (Timer Pause)</Text>
            </View>
            <Text style={styles.procurementSubtext}>
              Need an out-of-stock component (MCB, capacitor, motor, compressor)? Request procurement to freeze the work stopwatch until the part arrives.
            </Text>
            <TouchableOpacity
              style={styles.orderPartBtn}
              onPress={() => setProcurementModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="cart" size={16} color="#FFFFFF" />
              <Text style={styles.orderPartBtnText}>Order Required Part & Pause Work Timer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Rapid Testing: Simulation Bar */}
        <View style={styles.simulationBar}>
          <TouchableOpacity
            style={styles.simulationBtn}
            onPress={handleSimulateOvertime}
            activeOpacity={0.7}
          >
            <Ionicons name="speedometer" size={14} color="#D97706" />
            <Text style={styles.simulationBtnText}>Simulate +2 Hours (Test ₹100 Overtime)</Text>
          </TouchableOpacity>
        </View>

        {/* Current Service Details & Dynamic Total Badge */}
        <View style={styles.serviceStatusCard}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconCircle}>
              <Text style={styles.serviceEmoji}>{service?.icon || '🔧'}</Text>
            </View>
            <View style={styles.serviceCol}>
              <Text style={styles.serviceName}>{service?.name || t('homeService') || 'Home Service'}</Text>
              <Text style={styles.serviceAddress} numberOfLines={1}>
                {activeBooking?.address || 'Flat 302, Palm Heights'}
              </Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceTagLabel}>{t('currentTotal') || 'CURRENT TOTAL'}</Text>
              <Text style={styles.priceTagText}>₹{totalAmount || activeBooking?.total_amount || 350}</Text>
            </View>
          </View>

          {/* Dynamic Itemized Badges */}
          <View style={styles.pillsRow}>
            <View style={styles.basePill}>
              <Text style={styles.basePillText}>
                {t('base') || 'Base'}: ₹{activeBooking?.worker_count > 1 ? (activeBooking?.single_worker_base || (activeBooking?.base_amount - (activeBooking?.extra_worker_cost || 0))) : (activeBooking?.base_amount || service?.start_price || 299)}
              </Text>
            </View>
            {activeBooking?.worker_count > 1 && (
              <View style={[styles.basePill, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.basePillText, { color: colors.primary, fontWeight: '800' }]}>
                  +₹{activeBooking?.extra_worker_cost || ((activeBooking.worker_count - 1) * 199)} Squad ({activeBooking.worker_count}x)
                </Text>
              </View>
            )}
            {activeBooking?.emergency_surge > 0 && (
              <View style={[styles.basePill, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.basePillText, { color: colors.error }]}>+₹100 {t('emergencySurge') || 'SOS Surge'}</Text>
              </View>
            )}
            {isExtraApproved && (
              <View style={[styles.basePill, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.basePillText, { color: colors.successDark }]}>
                  +₹{activeBooking?.extra_work?.amount || extraWorkDef?.amount} {t('spares') || 'Spares'}
                </Text>
              </View>
            )}
            {activeBooking?.part_order?.part_cost > 0 && (
              <View style={[styles.basePill, { backgroundColor: '#F0FDF4', borderColor: colors.success, borderWidth: 1 }]}>
                <Text style={[styles.basePillText, { color: colors.successDark, fontWeight: '800' }]}>
                  +₹{activeBooking.part_order.part_cost} Component ({activeBooking.part_order.part_name})
                </Text>
              </View>
            )}
            {isHelperApproved && (
              <View style={[styles.basePill, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.basePillText, { color: colors.cooperativePurple }]}>
                  +₹{helperDef?.amount || 200} {t('helper') || 'Helper'}
                </Text>
              </View>
            )}
            {activeBooking?.overtime_charge > 0 && (
              <View style={[styles.basePill, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.basePillText, { color: '#B45309', fontWeight: '800' }]}>
                  +₹{activeBooking.overtime_charge} Overtime (&gt;2h)
                </Text>
              </View>
            )}
            {activeBooking?.cancellation_penalty_fee > 0 && (
              <View style={[styles.basePill, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.basePillText, { color: colors.danger, fontWeight: '800' }]}>
                  +₹{activeBooking.cancellation_penalty_fee} Prev Cancel Fee
                </Text>
              </View>
            )}
            {activeBooking?.discount_applied > 0 && (
              <View style={[styles.basePill, { backgroundColor: '#DCFCE7' }]}>
                <Text style={[styles.basePillText, { color: colors.successDark }]}>-₹50 {t('discount') || 'Discount'}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Lead Worker Info Card */}
        <View style={styles.workerCard}>
          <Image
            source={{ uri: worker?.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&q=80' }}
            style={styles.workerPhoto}
          />
          <View style={styles.workerInfoCol}>
            <View style={styles.workerNameRow}>
              <Text style={styles.workerName}>{worker?.name || fallbackWorker?.name || 'Cooperative Artisan'}</Text>
              <View style={styles.leadBadge}>
                <Text style={styles.leadBadgeText}>{t('leadArtisan') || 'Lead Artisan'}</Text>
              </View>
            </View>
            <Text style={styles.workerSociety}>{worker?.cooperative || t('delhiLabourCooperative') || 'Delhi Labour Cooperative'}</Text>
            <View style={styles.safetyVerifiedRow}>
              <Ionicons name="shield-checkmark" size={12} color={colors.successDark} />
              <Text style={styles.safetyVerifiedText}>{t('equippedSafetyGear') || 'Equipped with Certified Safety Gear'}</Text>
            </View>
          </View>
        </View>

        {/* Second Worker Card (Visible when approved) */}
        {secondWorker && (
          <View style={[styles.workerCard, { borderColor: colors.cooperativePurple, borderWidth: 1.5 }]}>
            <Image
              source={{ uri: secondWorker.photo }}
              style={styles.workerPhoto}
            />
            <View style={styles.workerInfoCol}>
              <View style={styles.workerNameRow}>
                <Text style={styles.workerName}>{secondWorker.name}</Text>
                <View style={[styles.leadBadge, { backgroundColor: '#EDE9FE' }]}>
                  <Text style={[styles.leadBadgeText, { color: colors.cooperativePurple }]}>{t('secondAssistant') || '2nd Assistant'}</Text>
                </View>
              </View>
              <Text style={styles.workerSociety}>{secondWorker.role}</Text>
              <View style={styles.safetyVerifiedRow}>
                <Ionicons name="checkmark-circle" size={12} color={colors.successDark} />
                <Text style={styles.safetyVerifiedText}>{t('coopCertifiedHelper') || 'Cooperative Certified Helper • On Site'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bulk Project 3-Stage Escrow Milestone Tracker Card */}
        {activeBooking?.is_bulk_project && (
          <View style={styles.bulkEscrowLiveCard}>
            <View style={styles.bulkEscrowLiveHeader}>
              <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
              <Text style={styles.bulkEscrowLiveTitle}>{t('milestoneTrackerTitle') || 'GOVT SBI MSCS ESCROW MILESTONE TRACKER'}</Text>
            </View>

            <Text style={styles.bulkEscrowLiveSub}>
              {t('projectScope') || 'Project Scope'}: {activeBooking?.scale_label} ({activeBooking?.material_label}) • {t('totalEst') || 'Total Est'}: ₹{activeBooking?.total_project_cost?.toLocaleString()}
            </Text>

            <View style={styles.milestoneProgressList}>
              {/* Milestone 1 */}
              <View style={styles.milestoneProgressItem}>
                <View style={styles.milestoneStatusDotDone}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
                <View style={styles.milestoneProgressContent}>
                  <View style={styles.milestoneProgressRow}>
                    <Text style={styles.milestoneProgressName}>{t('milestone1Title') || 'Milestone 1: Advance & Mobilization'}</Text>
                    <Text style={[styles.milestoneProgressAmount, { color: colors.successDark }]}>
                      ₹{activeBooking?.advance_amount?.toLocaleString()} ({t('disbursed') || 'Disbursed'})
                    </Text>
                  </View>
                  <Text style={styles.milestoneProgressDetail}>
                    {t('milestone1Desc') || `Wholesale material depot purchase & ${activeBooking?.crew_size} artisans crew reserve.`}
                  </Text>
                </View>
              </View>

              {/* Milestone 2 */}
              <View style={styles.milestoneProgressItem}>
                <View style={styles.milestoneStatusDotActive} />
                <View style={styles.milestoneProgressContent}>
                  <View style={styles.milestoneProgressRow}>
                    <Text style={styles.milestoneProgressName}>{t('milestone2Title') || 'Milestone 2: Mid-Progress Rough Work'}</Text>
                    <Text style={[styles.milestoneProgressAmount, { color: colors.warningDark }]}>
                      ₹{activeBooking?.mid_milestone?.toLocaleString()} (35% {t('escrow') || 'Escrow'})
                    </Text>
                  </View>
                  <Text style={styles.milestoneProgressDetail}>
                    {t('milestone2Desc') || 'In Progress: Base layer, pipe/wiring roughing, surface prepping.'}
                  </Text>
                </View>
              </View>

              {/* Milestone 3 */}
              <View style={styles.milestoneProgressItem}>
                <View style={styles.milestoneStatusDotPending} />
                <View style={styles.milestoneProgressContent}>
                  <View style={styles.milestoneProgressRow}>
                    <Text style={styles.milestoneProgressName}>{t('milestone3Title') || 'Milestone 3: Final Sign-off & Warranty'}</Text>
                    <Text style={[styles.milestoneProgressAmount, { color: colors.textSecondary }]}>
                      ₹{activeBooking?.final_milestone?.toLocaleString()} ({t('locked') || 'Locked'})
                    </Text>
                  </View>
                  <Text style={styles.milestoneProgressDetail}>
                    {t('milestone3Desc') || 'Released only upon completion OTP handshake and quality audit.'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Customer Diagnostic Briefing & Attachments (Audio & Photos) */}
        {(activeBooking?.description || activeBooking?.photo || activeBooking?.video_clip || activeBooking?.voice_note || activeBooking?.attachments?.length > 0) && (
          <View style={styles.briefingCard}>
            <View style={styles.briefingHeader}>
              <Ionicons name="document-attach" size={16} color={colors.primary} />
              <Text style={styles.briefingTitle}>{t('customerBriefingTitle') || 'CUSTOMER ISSUE BRIEFING & ATTACHMENTS'}</Text>
            </View>

            {activeBooking?.description ? (
              <Text style={styles.briefingText}>"{activeBooking.description}"</Text>
            ) : null}

            {/* Voice Note Player if attached */}
            {activeBooking?.voice_note && (
              <View style={{ marginTop: 8 }}>
                <AudioVoiceRecorder
                  voiceNote={activeBooking.voice_note}
                  serviceName={activeBooking?.service?.name}
                  serviceId={activeBooking?.service?.id}
                  readOnly={true}
                />
              </View>
            )}

            {/* Media Thumbnails Row */}
            {(activeBooking?.attachments?.filter(a => a.type !== 'audio').length > 0 || activeBooking?.photo) && (
              <View style={styles.briefingMediaRow}>
                {activeBooking?.attachments?.filter(a => a.type !== 'audio').map((item) => (
                  <View key={item.id} style={styles.briefingMediaThumb}>
                    <Image source={{ uri: item.uri }} style={styles.briefingImg} />
                    {item.type === 'video' && (
                      <View style={styles.briefingVideoBadge}>
                        <Ionicons name="play" size={10} color="#FFFFFF" />
                        <Text style={styles.briefingVideoDuration}>{item.duration || '0:15'}</Text>
                      </View>
                    )}
                  </View>
                )) || (
                  activeBooking?.photo ? (
                    <View style={styles.briefingMediaThumb}>
                      <Image source={{ uri: activeBooking.photo }} style={styles.briefingImg} />
                    </View>
                  ) : null
                )}
              </View>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* 1. EXTRA SPARE PARTS / SCOPE CARD (VIEWED DIRECTLY WITHOUT CLICKING PLUS) */}
        {/* ========================================================================= */}
        {extraWorkDef && (
          <View style={[styles.requestCard, isExtraApproved && styles.requestCardApproved]}>
            <View style={styles.requestHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="construct" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.incomingBadgeRow}>
                  <Text style={styles.incomingBadgeText}>{t('workerDiagnosis') || 'WORKER ON-SITE DIAGNOSIS'}</Text>
                  <Text style={styles.extraAmountBadge}>+₹{extraWorkDef.amount}</Text>
                </View>
                <Text style={styles.requestTitle}>{extraWorkDef.title}</Text>
              </View>
            </View>

            <Text style={styles.requestDesc}>{extraWorkDef.description}</Text>

            {/* Photo Thumbnail if available */}
            {extraWorkDef.photo && (
              <View style={styles.photoThumbWrap}>
                <Image source={{ uri: extraWorkDef.photo }} style={styles.photoThumb} />
                <View style={styles.photoTag}>
                  <Ionicons name="camera" size={10} color="#FFFFFF" />
                  <Text style={styles.photoTagText}>{t('liveInspectionProof') || 'Live Inspection Proof'}</Text>
                </View>
              </View>
            )}

            {/* Action States */}
            {isExtraApproved ? (
              <View style={styles.approvedStatusBox}>
                <Ionicons name="checkmark-circle" size={18} color={colors.successDark} />
                <Text style={styles.approvedStatusText}>
                  {t('approved') || 'Approved'}: +₹{extraWorkDef.amount} {t('addedToInvoiceLedger') || 'added to invoice & transparent wage ledger.'}
                </Text>
                <TouchableOpacity onPress={handleDeclineExtraParts} style={styles.undoTouch}>
                  <Text style={styles.undoTouchText}>{t('undo') || 'Undo'}</Text>
                </TouchableOpacity>
              </View>
            ) : isExtraDeclined ? (
              <View style={styles.declinedStatusBox}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                <Text style={styles.declinedStatusText}>
                  {t('declinedBaseRepairOnly') || 'Declined: Proceeding with standard base repair only.'}
                </Text>
                <TouchableOpacity onPress={handleApproveExtraParts} style={styles.undoTouch}>
                  <Text style={[styles.undoTouchText, { color: colors.primary }]}>{t('approve') || 'Approve'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={handleApproveExtraParts}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>{(t('approveSpareBtn') || 'Approve Spare')} (+₹{extraWorkDef.amount})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={handleDeclineExtraParts}
                  activeOpacity={0.7}
                >
                  <Text style={styles.declineBtnText}>{t('decline') || 'Decline'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* 2. ADDITIONAL ASSISTANT / HELPER REQUEST (REQUESTED BY WORKER, ACCEPTED BY USER) */}
        {/* ========================================================================= */}
        {helperAllowed && helperDef && (
          <View style={[styles.requestCard, isHelperApproved && styles.requestCardApproved]}>
            <View style={styles.requestHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="people" size={20} color={colors.cooperativePurple} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.incomingBadgeRow}>
                  <Text style={[styles.incomingBadgeText, { color: colors.cooperativePurple }]}>
                    {t('workerIncomingRequest') || 'WORKER INCOMING REQUEST'}
                  </Text>
                  <Text style={[styles.extraAmountBadge, { color: colors.cooperativePurple }]}>
                    +₹{helperDef.amount || 200}
                  </Text>
                </View>
                <Text style={styles.requestTitle}>
                  {worker?.name || t('leadArtisan') || 'Lead Artisan'} {t('isRequestingHelper') || `is requesting a ${helperDef.role || '2nd Assistant'}`}
                </Text>
              </View>
            </View>

            <Text style={styles.requestDesc}>{helperDef.reason}</Text>

            {/* Helper Action States */}
            {isDispatchingHelper ? (
              <View style={styles.loadingHelperBox}>
                <ActivityIndicator size="small" color={colors.cooperativePurple} />
                <Text style={styles.loadingHelperText}>{t('dispatchingAssistantWard') || 'Dispatching closest assistant from municipal ward...'}</Text>
              </View>
            ) : isHelperApproved ? (
              <View style={[styles.approvedStatusBox, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="checkmark-circle" size={18} color={colors.cooperativePurple} />
                <Text style={[styles.approvedStatusText, { color: colors.cooperativePurple }]}>
                  {t('secondWorkerAssigned') || '2nd Worker Assigned'} (Amit Verma) • +₹{helperDef.amount || 200} {t('addedToInvoice') || 'added to invoice.'}
                </Text>
                <TouchableOpacity onPress={handleDeclineHelper} style={styles.undoTouch}>
                  <Text style={styles.undoTouchText}>{t('remove') || 'Remove'}</Text>
                </TouchableOpacity>
              </View>
            ) : isHelperDeclined ? (
              <View style={styles.declinedStatusBox}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                <Text style={styles.declinedStatusText}>
                  {t('declinedSoloTask') || 'Declined: Lead artisan will complete task solo.'}
                </Text>
                <TouchableOpacity onPress={handleApproveHelper} style={styles.undoTouch}>
                  <Text style={[styles.undoTouchText, { color: colors.cooperativePurple }]}>{t('approve') || 'Approve'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.approveBtn, { backgroundColor: colors.cooperativePurple }]}
                  onPress={handleApproveHelper}
                  activeOpacity={0.85}
                >
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>
                    {(t('approveSecondWorkerBtn') || 'Approve 2nd Worker')} (+₹{helperDef.amount || 200})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={handleDeclineHelper}
                  activeOpacity={0.7}
                >
                  <Text style={styles.declineBtnText}>{t('decline') || 'Decline'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Real-time Fair Wage Allocation Breakdown */}
        <View style={{ marginBottom: 16 }}>
          <PaymentBreakdown totalAmount={totalAmount || activeBooking?.total_amount || 350} />
        </View>

        {/* Lifecycle Stepper */}
        <View style={styles.stepperContainer}>
          <Text style={styles.stepperTitle}>{t('serviceStage') || 'Service Stage'}</Text>
          <BookingStatusStepper currentStep={4} compact={false} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        {activeBooking?.is_bulk_project ? (
          <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
            <TouchableOpacity
              style={[styles.finishBtn, { flex: 1, backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('BulkProjectSuccess')}
              activeOpacity={0.85}
            >
              <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={[styles.finishBtnText, { fontSize: 13 }]}>Milestones & Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.finishBtn, { flex: 1, backgroundColor: colors.successDark }]}
              onPress={handleFinishJob}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={[styles.finishBtnText, { fontSize: 13 }]}>Complete & Rate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={handleFinishJob}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
            <Text style={styles.finishBtnText}>{t('finishJob')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 1. Modal: Worker Requests Spare Part Procurement (Timer Pause - Phase I) */}
      <Modal visible={procurementModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.procurementModalCard}>
            <View style={styles.modalHeaderIconRow}>
              <View style={[styles.modalIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="cart" size={24} color={colors.primary} />
              </View>
              <TouchableOpacity onPress={() => setProcurementModalVisible(false)} style={styles.modalCloseTouch}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Spare Part Order & Timer Pause</Text>
            <Text style={styles.modalSub}>
              Worker {worker?.name} has identified an out-of-stock component required to complete the repair. The timer will be stopped immediately until delivery.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Required Spare Part Name / Specifications</Text>
              <TextInput
                style={styles.modalTextInput}
                value={partNameInput}
                onChangeText={setPartNameInput}
                placeholder="e.g. Dual-Run Capacitor 45uF / 32A MCB"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Part Delivery Timeline</Text>
              <TextInput
                style={styles.modalTextInput}
                value={deliveryEstInput}
                onChangeText={setDeliveryEstInput}
                placeholder="e.g. 1-2 Days from Local Cooperative Depot"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Component Cost (₹)</Text>
              <TextInput
                style={styles.modalTextInput}
                value={partCostInput}
                onChangeText={setPartCostInput}
                keyboardType="numeric"
                placeholder="250"
              />
            </View>

            <View style={styles.timerPauseGuaranteeBox}>
              <Ionicons name="shield-checkmark" size={16} color={colors.successDark} />
              <Text style={styles.timerPauseGuaranteeText}>
                Cooperative Fair-Wage Guarantee: The work stopwatch will freeze. Zero waiting hours or delivery delays will be added to your bill.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmProcureBtn}
              onPress={handleRequestPartOrder}
              activeOpacity={0.85}
            >
              <Ionicons name="pause-circle" size={18} color="#FFFFFF" />
              <Text style={styles.confirmProcureBtnText}>Approve Order & Freeze Work Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. Modal: Resume Work with OTP Confirmation (Phase I) */}
      <Modal visible={resumeOtpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.procurementModalCard}>
            <View style={styles.modalHeaderIconRow}>
              <View style={[styles.modalIconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="key" size={24} color={colors.successDark} />
              </View>
              <TouchableOpacity onPress={() => { setResumeOtpModalVisible(false); setResumeOtpError(''); }} style={styles.modalCloseTouch}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Enter Resume Work OTP</Text>
            <Text style={styles.modalSub}>
              Artisan has returned with the spare part. Enter the 4-digit Resume OTP shown on your screen to resume the work stopwatch.
            </Text>

            <View style={styles.otpInputRow}>
              <TextInput
                style={styles.otpInputField}
                value={resumeOtpInput}
                onChangeText={(val) => { setResumeOtpInput(val); setResumeOtpError(''); }}
                keyboardType="numeric"
                maxLength={4}
                placeholder="• • • •"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {resumeOtpError ? (
              <Text style={styles.otpErrorText}>{resumeOtpError}</Text>
            ) : null}

            <View style={styles.expectedOtpHelper}>
              <Text style={styles.expectedOtpHelperText}>
                Active Handshake OTP: <Text style={{ fontWeight: '800', color: colors.primary }}>{activeBooking?.part_resume_otp}</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.verifyResumeBtn}
              onPress={handleVerifyResumeOtp}
              activeOpacity={0.85}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.verifyResumeBtnText}>Verify OTP & Resume Work Timer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  timerHeader: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  livePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warningDark,
    marginRight: 6
  },
  livePulseText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.warningDark,
    letterSpacing: 0.5
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 1
  },
  timerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4
  },
  serviceStatusCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  serviceEmoji: {
    fontSize: 22
  },
  serviceCol: {
    flex: 1
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  serviceAddress: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  priceTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-end'
  },
  priceTagLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  priceTagText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  basePill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  basePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  workerPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    marginRight: 12
  },
  workerInfoCol: {
    flex: 1
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  leadBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  leadBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary
  },
  workerSociety: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  safetyVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3
  },
  safetyVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 4
  },
  requestCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  requestCardApproved: {
    borderColor: colors.successLight,
    backgroundColor: '#F0FDF4'
  },
  requestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  incomingBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  incomingBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  extraAmountBadge: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  requestDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10
  },
  photoThumbWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative'
  },
  photoThumb: {
    width: '100%',
    height: 120,
    backgroundColor: colors.surfaceSecondary
  },
  photoTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  photoTagText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 4
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  declineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  approvedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 4
  },
  approvedStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 6,
    flex: 1
  },
  declinedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 4
  },
  declinedStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1
  },
  undoTouch: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  undoTouchText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.error
  },
  loadingHelperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12
  },
  loadingHelperText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.cooperativePurple,
    marginLeft: 8
  },
  stepperContainer: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  stepperTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10
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
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  finishBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  bulkEscrowLiveCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 16
  },
  bulkEscrowLiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  bulkEscrowLiveTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginLeft: 6
  },
  bulkEscrowLiveSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12
  },
  milestoneProgressList: {
    gap: 10
  },
  milestoneProgressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  milestoneStatusDotDone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10
  },
  milestoneStatusDotActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.warningDark,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    marginTop: 2,
    marginRight: 10
  },
  milestoneStatusDotPending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    marginTop: 2,
    marginRight: 10
  },
  milestoneProgressContent: {
    flex: 1
  },
  milestoneProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  milestoneProgressName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  milestoneProgressAmount: {
    fontSize: 11,
    fontWeight: '800'
  },
  milestoneProgressDetail: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14
  },
  briefingCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  briefingTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 6,
    letterSpacing: 0.5
  },
  briefingText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
    fontStyle: 'italic'
  },
  briefingMediaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  briefingMediaThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: colors.surfaceSecondary
  },
  briefingImg: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  briefingVideoBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3
  },
  briefingVideoDuration: {
    fontSize: 7,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 2
  },
  overtimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    gap: 8,
    width: '100%'
  },
  overtimeBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    flex: 1
  },
  resumeOtpCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    alignItems: 'center',
    width: '100%'
  },
  resumeOtpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 6
  },
  resumeOtpCode: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 8,
    marginBottom: 6
  },
  resumeOtpSub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10
  },
  resumeWorkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successDark,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6
  },
  resumeWorkBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  partProcurementBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  procurementHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  procurementHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  procurementSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12
  },
  orderPartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 8
  },
  orderPartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  simulationBar: {
    marginBottom: 12,
    alignItems: 'center'
  },
  simulationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6
  },
  simulationBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309'
  },
  procurementModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    width: '92%',
    maxWidth: 400
  },
  modalHeaderIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  modalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseTouch: {
    padding: 4
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 14
  },
  inputGroup: {
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6
  },
  modalTextInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary
  },
  timerPauseGuaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    gap: 8
  },
  timerPauseGuaranteeText: {
    fontSize: 11,
    color: colors.successDark,
    lineHeight: 15,
    flex: 1,
    fontWeight: '600'
  },
  confirmProcureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8
  },
  confirmProcureBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  otpInputRow: {
    alignItems: 'center',
    marginVertical: 14
  },
  otpInputField: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 16,
    color: colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    width: 200,
    textAlign: 'center',
    paddingVertical: 6
  },
  otpErrorText: {
    fontSize: 12,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600'
  },
  expectedOtpHelper: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  expectedOtpHelperText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  verifyResumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDark,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8
  },
  verifyResumeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen09_JobInProgress;
