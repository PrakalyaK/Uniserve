import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import RealLiveTrackingMap from '../components/RealLiveTrackingMap';
import BookingStatusStepper from '../components/BookingStatusStepper';
import AudioVoiceRecorder from '../components/AudioVoiceRecorder';
import { getFallbackWorkerForTrade } from '../utils/locationService';

export const TRADE_TOOLKITS = {
  s1: {
    tradeName: 'Plumbing Service',
    description: 'Arriving with pressure joint wrenches, Teflon thread seal tape, basin wrench, heavy pipe clamps & spare rubber gaskets.',
    tools: [
      { name: 'Pipe Wrenches (10" & 12")', icon: 'build' },
      { name: 'Teflon Thread Seal Tape', icon: 'ribbon' },
      { name: 'Basin Wrench & Tap Spanner', icon: 'construct' },
      { name: 'Heavy Pipe Clamps', icon: 'hardware-chip' },
      { name: 'Spare Gaskets & O-Rings', icon: 'disc' },
      { name: 'Rotary Drain Snake Auger', icon: 'sync' }
    ]
  },
  s2: {
    tradeName: 'Electrical Service',
    description: 'Arriving with digital multimeter, 10kV insulated safety gloves, wire strippers, C-Curve MCBs & continuity tester.',
    tools: [
      { name: 'Digital Multimeter (CAT III)', icon: 'speedometer' },
      { name: '10kV Insulated VDE Pliers', icon: 'shield-checkmark' },
      { name: 'Automatic Wire Strippers', icon: 'cut' },
      { name: 'C-Curve MCBs (6A–32A)', icon: 'toggle' },
      { name: 'Neon Voltage Tester Pen', icon: 'flashlight' },
      { name: 'Circuit Continuity Probe', icon: 'pulse' }
    ]
  },
  s3: {
    tradeName: 'Deep Cleaning Service',
    description: 'Arriving with high-pressure rotary scrub buffers, color-coded microfiber pads, pet-safe eco formulations & wet/dry squeegees.',
    tools: [
      { name: 'High-Pressure Rotary Buffer', icon: 'disc' },
      { name: 'Microfiber Color-Coded Pads', icon: 'layers' },
      { name: 'Pet-Safe Eco Formulations', icon: 'leaf' },
      { name: 'Telescopic Window Squeegee', icon: 'scan' },
      { name: 'Wet & Dry Extraction Nozzle', icon: 'funnel' },
      { name: 'Anti-Bacterial Mist Sprayer', icon: 'water' }
    ]
  },
  s4: {
    tradeName: 'Carpentry Service',
    description: 'Arriving with precision carpentry tenon saw, soft-close hydraulic channels, wood chisels, adhesive fillers & level meters.',
    tools: [
      { name: 'Precision Tenon & Hand Saw', icon: 'cut' },
      { name: 'Hydraulic Soft-Close Hinges', icon: 'git-commit' },
      { name: 'Hardened Wood Chisel Set', icon: 'hardware-chip' },
      { name: 'Wood Adhesive & Crack Fillers', icon: 'color-fill' },
      { name: 'Digital Spirit Level Meter', icon: 'locate' },
      { name: 'Magnetic Screw & Bit Driver', icon: 'build' }
    ]
  },
  s5: {
    tradeName: 'Painting Service',
    description: 'Arriving with low-VOC paint rollers, anti-damp putty scrapers, sandpaper sheets (80–220 grit) & floor masking sheets.',
    tools: [
      { name: '9-Inch Low-VOC Roller & Tray', icon: 'brush' },
      { name: 'Anti-Damp Putty Scrapers', icon: 'shapes' },
      { name: 'Sandpaper Sheets (80/120/220)', icon: 'file-tray' },
      { name: 'Floor Masking Film (50m)', icon: 'shield' },
      { name: 'Angular Sash Detail Brushes', icon: 'color-filter' },
      { name: 'Moisture Detection Meter', icon: 'speedometer' }
    ]
  },
  s6: {
    tradeName: 'Elder & Patient Care',
    description: 'Arriving with digital BP/sugar monitor, patient mobility support transfer belt, pulse oximeter & geriatric first-aid kit.',
    tools: [
      { name: 'Digital BP & Pulse Monitor', icon: 'heart-circle' },
      { name: 'Infrared Forehead Thermometer', icon: 'thermometer' },
      { name: 'Fingertip Pulse Oximeter', icon: 'fitness' },
      { name: 'Ergonomic Mobility Transfer Belt', icon: 'walk' },
      { name: 'Certified Geriatric First-Aid Kit', icon: 'medkit' },
      { name: 'Medical-Grade Hand Sanitizer', icon: 'sparkles' }
    ]
  },
  s7: {
    tradeName: 'Technician & Appliance Repair',
    description: 'Arriving with digital refrigerant manifold, starting capacitor test meter, multi-brand PCB diagnostic tools & fin comb.',
    tools: [
      { name: 'Digital Refrigerant Manifold', icon: 'speedometer' },
      { name: 'Capacitor Microfarad Tester', icon: 'battery-charging' },
      { name: 'Inverter PCB Diagnostic Probe', icon: 'barcode' },
      { name: 'Portable Brazing Torch Kit', icon: 'flame' },
      { name: 'Aluminum Condenser Fin Comb', icon: 'grid' },
      { name: 'HVAC Clamp Ampere Meter', icon: 'hardware-chip' }
    ]
  },
  s8: {
    tradeName: 'Domestic Help & Cooking',
    description: 'Arriving with verified Mahila Shramik identity card, sanitized kitchen apron, non-scratch scrub pads & hygiene checklist.',
    tools: [
      { name: 'Mahila Shramik Verified ID', icon: 'id-card' },
      { name: 'Sanitized Kitchen Apron & Cap', icon: 'shirt' },
      { name: 'Non-Scratch Utensil Pads', icon: 'disc' },
      { name: 'Food-Grade Vegetable Sanitizer', icon: 'leaf' },
      { name: 'Standard Recipe & Diet Chart', icon: 'clipboard' },
      { name: 'Household Safety Checklist', icon: 'checkbox' }
    ]
  },
  s9: {
    tradeName: 'Chauffeur & Driver',
    description: 'Commercial DL verified • Equipped with FastTag, zero-alcohol breathalyzer clearance & route GPS navigation.',
    tools: [
      { name: 'Commercial PSV Driver Badge', icon: 'ribbon' },
      { name: 'Zero-Alcohol Breathalyzer Cert', icon: 'checkmark-done-circle' },
      { name: 'Live GPS Satellite Navigator', icon: 'navigate' },
      { name: 'Active FastTag Vehicle Sensor', icon: 'card' },
      { name: 'Emergency Tyre Inflator Pump', icon: 'speedometer' },
      { name: 'Heavy-Duty Jump Starter Cables', icon: 'flash' }
    ]
  },
  s10: {
    tradeName: 'Gardening & Horticulture',
    description: 'Arriving with electric hedge shears, ergonomic hand trowels, root soil aerators & organic neem-based vermicompost.',
    tools: [
      { name: 'Heavy Electric Hedge Shears', icon: 'cut' },
      { name: 'Ergonomic Trowels & Forks', icon: 'hand-left' },
      { name: 'Manual Root Soil Aerator', icon: 'git-network' },
      { name: 'Cold-Pressed Neem Oil Spray', icon: 'water' },
      { name: 'Enriched Organic Vermicompost', icon: 'cube' },
      { name: 'High-Carbon Steel Secateurs', icon: 'scissors' }
    ]
  }
};

export const Screen07_LiveTracking = ({ route, navigation }) => {
  const {
    activeBooking,
    updateBookingStatus,
    triggerWorkerDelay,
    acceptWorkerDelay,
    findReplacementWorker,
    cancelBookingWithPenalty
  } = useBooking();
  const { t, user } = useUser();

  const fallbackWorker = getFallbackWorkerForTrade(activeBooking?.service || route.params?.service);
  const worker = activeBooking?.worker || route.params?.worker || fallbackWorker;
  const bookingId = activeBooking?.booking_id || 'BK84920';

  const serviceId = activeBooking?.service?.id || route.params?.service?.id || 's1';
  const currentToolkit = TRADE_TOOLKITS[serviceId] || TRADE_TOOLKITS.s1;

  const [etaMinutes, setEtaMinutes] = useState(worker?.eta_minutes || 8);
  const [hasArrived, setHasArrived] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const isScheduledOrAdvance = activeBooking?.booking_type === 'scheduled' || !!activeBooking?.is_bulk_project || activeBooking?.scale_mode === 'bulk';

  // Trigger simulated delay only for IMMEDIATE / NOW bookings (after 4 seconds)
  useEffect(() => {
    if (isScheduledOrAdvance) return;
    const delayTimer = setTimeout(() => {
      if (!hasArrived && !activeBooking?.worker_delayed) {
        triggerWorkerDelay(10, 'Heavy traffic congestion near Ring Road junction');
        setShowDelayModal(true);
      }
    }, 4500);
    return () => clearTimeout(delayTimer);
  }, [isScheduledOrAdvance]);

  const handleArrival = () => {
    setHasArrived(true);
    setEtaMinutes(0);
    updateBookingStatus(3); // Worker Arrived
  };

  const handleProceedToOtp = () => {
    navigation.navigate('StartOTP', { worker });
  };

  const handleAcceptDelay = () => {
    acceptWorkerDelay();
    setEtaMinutes((prev) => prev + 10);
    setShowDelayModal(false);
    Alert.alert('Delay Accepted', 'Thank you for your patience. The artisan has been notified of your confirmation.');
  };

  const handleFindReplacement = () => {
    const replacement = findReplacementWorker();
    setShowDelayModal(false);
    Alert.alert(
      'Replacement Artisan Dispatched',
      `${replacement.name} (Nearby Cooperative Artisan, ETA 6 mins) has been assigned to your booking with zero penalty.`
    );
  };

  const handleConfirmCancelBooking = () => {
    setCancelModalVisible(false);
    cancelBookingWithPenalty(25);
    Alert.alert(
      'Booking Cancelled',
      'Your booking has been cancelled. Under the Cooperative Fair-Wage Agreement, a cancellation charge of ₹25 will be added to your next booking.'
    );
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={isScheduledOrAdvance ? `${t('scheduledBooking') || 'Scheduled Booking'} • ${bookingId}` : `${t('liveTracking') || 'Live Tracking'} • ${bookingId}`}
        showBack
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Render Live Moving Map ONLY for immediate NOW / Emergency bookings. For Scheduled / Advance, render Scheduled Booking Appointment Hub Card */}
        {!isScheduledOrAdvance ? (
          <View style={styles.mapContainer}>
            <RealLiveTrackingMap
              worker={worker}
              workerName={worker?.name}
              userAddress={activeBooking?.address || user?.address}
              pickupAddress={activeBooking?.pickup_address}
              dropAddress={activeBooking?.drop_address}
              userCoords={activeBooking?.user_coords || user?.coords}
              service={activeBooking?.service}
              vehicleType={
                activeBooking?.driver_booking_mode === 'car_with_driver'
                  ? 'car'
                  : activeBooking?.service?.id === 's9'
                  ? 'car'
                  : 'bike'
              }
              onArrival={handleArrival}
              durationSeconds={16}
            />
          </View>
        ) : (
          <View style={styles.scheduledHubHeroCard}>
            <View style={styles.scheduledHubHeader}>
              <View style={styles.scheduledHubIconCircle}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.scheduledHubTag}>{t('officialAppointmentHub')}</Text>
                <Text style={styles.scheduledHubTitle}>
                  {activeBooking?.is_bulk_project
                    ? `${activeBooking?.scale_label || t('bulkProject') || 'Bulk Project'} ${t('confirmed') || 'Confirmed'}`
                    : `${activeBooking?.service?.name || t('service')} ${t('appointmentConfirmed')}`}
                </Text>
                <Text style={styles.scheduledHubSub}>
                  {t('assignedTo') || 'Assigned to'} {worker?.cooperative || t('districtCooperativeFederation') || 'District Cooperative Federation'}
                </Text>
              </View>
            </View>

            <View style={styles.scheduledHubDivider} />

            <View style={styles.scheduledHubGrid}>
              <View style={styles.scheduledHubGridItem}>
                <Ionicons name="time" size={16} color={colors.primary} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.scheduledHubKey}>{t('targetDateTimeSlot')}</Text>
                  <Text style={styles.scheduledHubVal}>
                    {activeBooking?.scheduled_date || t('tomorrow') || 'Tomorrow'}, {activeBooking?.scheduled_time || '10:00 AM - 12:00 PM'}
                  </Text>
                </View>
              </View>

              <View style={styles.scheduledHubGridItem}>
                <Ionicons name="location" size={16} color={colors.primary} />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={styles.scheduledHubKey}>{t('serviceLocation')}</Text>
                  <Text style={styles.scheduledHubVal} numberOfLines={2}>
                    {activeBooking?.address || t('customerPremises') || 'Customer Premises'}
                  </Text>
                </View>
              </View>

              <View style={styles.scheduledHubGridItem}>
                <Ionicons name="people" size={16} color={colors.primary} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.scheduledHubKey}>{t('assignedCrew')}</Text>
                  <Text style={styles.scheduledHubVal}>
                    {activeBooking?.is_bulk_project
                      ? `${activeBooking?.crew_size || 4} ${t('masterArtisansSquad') || 'Master Artisans Squad'} (${activeBooking?.estimated_days || 2} ${t('days') || 'Days'})`
                      : `1 ${t('verifiedArtisan') || 'Verified Artisan'} (${worker?.name || 'Assigned Lead'})`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Worker Delay Notification Card (ONLY FOR IMMEDIATE BOOKINGS) */}
        {!isScheduledOrAdvance && activeBooking?.worker_delayed && (
          <View style={styles.delayBanner}>
            <View style={styles.delayHeaderRow}>
              <Ionicons name="time" size={20} color={colors.warningDark} />
              <Text style={styles.delayTitle}>{t('artisanRunningLate') || 'Artisan Running 10 Mins Late'}</Text>
            </View>
            <Text style={styles.delayDesc}>
              {worker?.name ? `${worker.name} ` : ''}{t('delayDescText') || 'is held up due to traffic. Would you like to wait or instantly switch to another nearby cooperative artisan?'}
            </Text>

            <View style={styles.delayActionButtons}>
              <TouchableOpacity
                style={styles.waitBtn}
                onPress={handleAcceptDelay}
                activeOpacity={0.8}
              >
                <Ionicons name="hourglass-outline" size={14} color="#FFFFFF" />
                <Text style={styles.waitBtnText}>{t('wait10Mins') || 'Wait (+10 mins)'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reassignBtn}
                onPress={handleFindReplacement}
                activeOpacity={0.8}
              >
                <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
                <Text style={styles.reassignBtnText}>{t('findAnotherWorker') || 'Find Another Worker'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Status Card: SCHEDULED / ADVANCE vs IMMEDIATE NOW */}
        {isScheduledOrAdvance ? (
          <View style={styles.statusHeroCardScheduled}>
            <View style={styles.statusHeaderRow}>
              <View style={styles.statusScheduledIcon}>
                <Ionicons name="shield-checkmark" size={20} color={colors.successDark} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.statusScheduledTag}>{t('advanceStatusConfirmed') || 'ADVANCE STATUS CONFIRMED'}</Text>
                <Text style={styles.statusScheduledTitle}>
                  {activeBooking?.is_bulk_project ? (t('escrowProtectedProject') || 'Escrow Protected Project') : (t('appointmentConfirmed') || 'Appointment Confirmed')}
                </Text>
              </View>
            </View>

            <View style={styles.scheduledInfoBox}>
              <View style={styles.scheduledRow}>
                <Ionicons name="notifications-outline" size={15} color={colors.successDark} />
                <Text style={styles.scheduledNoticeText}>
                  {t('coordinatorNotice') || 'Our cooperative team will contact you 2 hours before arrival to coordinate entry.'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.statusHeroCard}>
            <View style={styles.statusHeaderRow}>
              <View style={[styles.statusPulseDot, hasArrived && styles.statusDotArrived]} />
              <Text style={styles.statusMainText}>
                {hasArrived ? t('arrivedAtDoorstep') : t('artisanOnWay')}
              </Text>
            </View>
            <Text style={styles.statusSubText}>
              {hasArrived
                ? t('shareStartOtp')
                : `${t('arrivingInMins') || 'Arriving in'} ~${etaMinutes} ${t('minutes') || 'mins'}.`}
            </Text>

            {/* Quick Skip to Arrival button */}
            {!hasArrived && (
              <TouchableOpacity style={styles.skipArrivalBtn} onPress={handleArrival}>
                <Ionicons name="play-forward" size={12} color={colors.primary} />
                <Text style={styles.skipArrivalText}>{t('skipToArrival')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Pre-Arrival Team Contact & Coordinator Details Card (FOR SCHEDULED & ADVANCE BOOKINGS) */}
        {isScheduledOrAdvance && (
          <View style={styles.teamContactCard}>
            <View style={styles.teamContactHeader}>
              <View style={styles.teamContactIconCircle}>
                <Ionicons name="call" size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.teamContactTag}>{t('officialDispatchDesk') || 'OFFICIAL COOPERATIVE DISPATCH DESK'}</Text>
                <Text style={styles.teamContactTitle}>{t('teamContactTitle') || 'Our Team Will Contact You Before Arrival'}</Text>
              </View>
            </View>

            <Text style={styles.teamContactDesc}>
              {t('teamContactDesc') || 'Our cooperative squad and Ward Coordinator will call you 2 hours prior to the scheduled slot to confirm site entry, gate passes, and raw material unloading.'}
            </Text>

            {/* Assigned Coordinator / Supervisor Box */}
            <View style={styles.coordinatorBox}>
              <View style={styles.coordinatorAvatarCircle}>
                <Ionicons name="person" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.coordinatorName}>
                  {worker?.ward_head ? `${worker.ward_head} (${t('wardCoordinator') || 'Ward Coordinator'})` : (worker?.name ? `${worker.name} (${t('leadSupervisor') || 'Lead Supervisor'})` : (t('districtCooperativeFederation') || 'District Ward Coordinator'))}
                </Text>
                <Text style={styles.coordinatorSub}>
                  {worker?.cooperative_short || activeBooking?.service?.name || t('cooperative') || 'Cooperative'} • {worker?.ward_phone || '+91 98101 23456'}
                </Text>
              </View>
            </View>

            <View style={styles.teamContactActionsRow}>
              <TouchableOpacity
                style={styles.callCoordBtn}
                onPress={() => setCallModalVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="call" size={14} color="#FFFFFF" />
                <Text style={styles.callCoordBtnText}>{t('callCoordinator') || 'Call Coordinator / Lead'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatCoordBtn}
                onPress={() => setChatModalVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="chatbubble-ellipses" size={14} color={colors.primary} />
                <Text style={styles.chatCoordBtnText}>{t('chatWithTeam') || 'Chat with Team'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Uber/Rapido Artisan & Vehicle Trust Card */}
        <View style={styles.workerDetailCard}>
          <View style={styles.workerMainRow}>
            <Image
              source={{ uri: worker?.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&q=80' }}
              style={styles.workerPhoto}
            />
            <View style={styles.workerInfoCol}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.workerName}>{worker?.name || fallbackWorker?.name || 'Cooperative Artisan'}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color="#F59E0B" />
                  <Text style={styles.ratingText}>{worker?.rating || '4.8'}</Text>
                </View>
              </View>

              <Text style={styles.coopNameText}>
                {activeBooking?.is_bulk_project
                  ? `${t('leadContractor') || 'Lead Contractor'} • ${activeBooking?.crew_size || 4} ${t('artisansSquad') || 'Artisans Squad'}`
                  : (worker?.cooperative || t('delhiLabourCooperative') || 'Delhi Labour Cooperative')}
              </Text>

              <View style={styles.vehicleInfoRow}>
                <Ionicons name={activeBooking?.is_bulk_project ? 'bus' : (serviceId === 's9' ? 'car' : 'bicycle')} size={14} color={colors.primary} />
                <Text style={styles.vehicleText}>
                  {activeBooking?.is_bulk_project
                    ? `${t('cooperativeFleetVan') || 'Cooperative Fleet Van'} • ${worker?.vehicle_plate || 'Local Co-op Van'}`
                    : (serviceId === 's9'
                        ? `${activeBooking?.car_seater_label || (activeBooking?.car_seater_type === '7_seater' ? '7 Seater SUV/MUV' : '5 Seater Sedan')} • ${worker?.vehicle_plate || 'DL 1Y CA 9042'}`
                        : `${t('electricScooter') || 'Service EV Scooter'} • ${worker?.vehicle_plate || 'DL 3S CD 8492'}`)}
                </Text>
              </View>

              <View style={styles.distanceInfoRow}>
                <Ionicons name="navigate-circle" size={14} color={Number(worker?.distance_km || activeBooking?.distance_km || 0) > 7 ? '#0369A1' : colors.successDark} />
                <Text style={[styles.distanceInfoText, Number(worker?.distance_km || activeBooking?.distance_km || 0) > 7 && { color: '#0369A1', fontWeight: '700' }]}>
                  {worker?.distance_km || activeBooking?.distance_km || '1.2'} km dispatch
                  {Number(worker?.distance_km || activeBooking?.distance_km || 0) > 7
                    ? ` • +₹${Math.round((Number(worker?.distance_km || activeBooking?.distance_km || 0) - 7) * 7)} Travel Surcharge (>7 km @ ₹7/km)`
                    : ' • Standard Local Zone (≤7 km: ₹0 extra travel)'}
                </Text>
              </View>
            </View>
          </View>

          {/* Safety PIN & Verification Code */}
          <View style={styles.safetyPinRow}>
            <View style={styles.pinBox}>
              <Text style={styles.pinLabel}>{t('safetyPin')}</Text>
              <Text style={styles.pinValue}>{activeBooking?.start_otp || '4821'}</Text>
            </View>
            <View style={styles.pinExplanation}>
              <Ionicons name="shield-checkmark" size={14} color={colors.successDark} />
              <Text style={styles.pinText}>{t('sharePinExplain') || 'Share this 4-digit code after physical arrival to begin'}</Text>
            </View>
          </View>

          {/* Action Buttons: Masked Call & Chat */}
          <View style={styles.workerActionsRow}>
            <TouchableOpacity
              style={styles.actionBtnCall}
              onPress={() => setCallModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnCallText}>{t('callArtisan')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnChat}
              onPress={() => setChatModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
              <Text style={styles.actionBtnChatText}>{t('chatArtisan')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Specialized Trade Arrival Toolkit Card (360-degree Trade Insight) */}
        <View style={styles.toolkitCard}>
          <View style={styles.toolkitHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="bag-check" size={17} color={colors.primary} />
              <Text style={styles.toolkitTitle}>{t('certifiedToolkitTitle') || 'CERTIFIED ON-SITE TOOLKIT & READINESS'}</Text>
            </View>
            <View style={styles.readinessBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.successDark} />
              <Text style={styles.readinessBadgeText}>{t('toolkitReadinessBadge') || '100% Prepared'}</Text>
            </View>
          </View>

          <Text style={styles.toolkitText}>
            {t(`toolkit_${serviceId}`) || currentToolkit.description}
          </Text>

          {/* Explicit Itemized Tool Chips */}
          <View style={styles.toolsGrid}>
            {currentToolkit.tools.map((tool, idx) => (
              <View key={idx} style={styles.toolItemChip}>
                <Ionicons name={tool.icon || 'construct'} size={13} color={colors.primary} />
                <Text style={styles.toolItemName}>{tool.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.toolkitFooterRow}>
            <Ionicons name="shield-checkmark" size={13} color={colors.successDark} />
            <Text style={styles.toolkitFooterText}>
              Cooperative Inspected & Sanitized Prior to Dispatch
            </Text>
          </View>
        </View>

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

        {/* Vertical Lifecycle Stepper */}
        <View style={styles.stepperCard}>
          <Text style={styles.stepperCardTitle}>{t('serviceLifecycle') || 'Service Lifecycle Stage'}</Text>
          <BookingStatusStepper currentStep={hasArrived ? 3 : 2} compact={false} />
        </View>
      </ScrollView>

      {/* Masked Call Dialog Modal */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.callModalCard}>
            <View style={styles.callAvatarCircle}>
              <Ionicons name="call" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.callTitle}>{t('callingMaskedLine') || 'Calling Masked Cooperative Line'}</Text>
            <Text style={styles.callWorkerName}>{worker?.name || fallbackWorker?.name || 'Cooperative Artisan'}</Text>
            <Text style={styles.callSub}>{t('numberMaskedDesc') || 'Number is masked for customer privacy (+91 11-4089-XXXX)'}</Text>

            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => setCallModalVisible(false)}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
              <Text style={styles.endCallText}>{t('endCall') || 'End Call'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chat Simulation Modal */}
      <Modal visible={chatModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.chatModalCard}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>{(t('chatWithWorker') || 'Chat with')} {worker?.name}</Text>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.chatBubble}>
              <Text style={styles.chatMessage}>
                "{t('chatSampleMsg') || 'Namaste! I am on my way with the official toolkit. I am near the metro station signal.'}"
              </Text>
              <Text style={styles.chatTime}>{t('justNow') || 'Just now'}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatReplyBtn}
              onPress={() => {
                Alert.alert(t('messageSent') || 'Message Sent', t('messageSentDesc') || 'Your message has been sent to the artisan.');
                setChatModalVisible(false);
              }}
            >
              <Text style={styles.chatReplyText}>{t('chatReplyBtn') || 'Quick Reply: "Please come to Flat 302 directly."'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cancellation Warning Modal (Phase III) */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalCard}>
            <View style={styles.cancelAlertIconCircle}>
              <Ionicons name="warning" size={32} color={colors.danger} />
            </View>
            <Text style={styles.cancelModalTitle}>{t('cancelBookingTitle') || 'Cancel Service Booking?'}</Text>
            
            <View style={styles.penaltyNoticeBox}>
              <Ionicons name="information-circle" size={20} color={colors.danger} style={{ marginTop: 2 }} />
              <Text style={styles.penaltyNoticeText}>
                Artisan <Text style={{ fontWeight: '800' }}>{worker?.name}</Text> is already en-route under the Cooperative Fair-Wage Agreement.{'\n\n'}
                <Text style={{ fontWeight: '800', color: colors.danger }}>
                  If you cancel now, an extra fee of ₹25 will be charged on your next booking
                </Text> to support artisan transit fuel and cooperative allocation.
              </Text>
            </View>

            <View style={styles.cancelModalButtonsRow}>
              <TouchableOpacity
                style={styles.stayWithServiceBtn}
                onPress={() => setCancelModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.stayWithServiceBtnText}>{t('stayWithService') || 'Keep Booking'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={handleConfirmCancelBooking}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmCancelBtnText}>{t('confirmCancelPenalty') || 'Yes, Cancel (+₹25 Next)'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomActionsStack}>
          <TouchableOpacity
            style={[styles.startOtpBtn, !hasArrived && !isScheduledOrAdvance && styles.startOtpBtnDisabled]}
            onPress={handleProceedToOtp}
            disabled={!hasArrived && !isScheduledOrAdvance}
            activeOpacity={0.85}
          >
            <Ionicons name={isScheduledOrAdvance ? "shield-checkmark" : "key"} size={18} color="#FFFFFF" />
            <Text style={styles.startOtpBtnText}>
              {isScheduledOrAdvance
                ? (t('viewScheduledOtpPin') || 'View Scheduled Job Handshake PIN')
                : (hasArrived ? t('viewStartOtp') : `${t('arrivingInMins') || 'Arriving in'} ~${etaMinutes} ${t('minutes') || 'mins'}...`)}
            </Text>
          </TouchableOpacity>

          {/* Cancel Service Button (Phase III) */}
          <TouchableOpacity
            style={styles.cancelBookingTriggerBtn}
            onPress={() => setCancelModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={15} color={colors.danger} />
            <Text style={styles.cancelBookingTriggerText}>
              {t('cancelService') || 'Cancel Booking'} (₹25 on Next Booking)
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 90
  },
  scheduledHubHeroCard: {
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
  scheduledHubHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  scheduledHubIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scheduledHubTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  scheduledHubTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  scheduledHubSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  scheduledHubDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14
  },
  scheduledHubGrid: {
    gap: 12
  },
  scheduledHubGridItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  scheduledHubKey: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  scheduledHubVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1
  },
  mapContainer: {
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  delayBanner: {
    backgroundColor: colors.warningLight,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.warning,
    marginBottom: 14
  },
  delayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  delayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.warningDark,
    marginLeft: 6
  },
  delayDesc: {
    fontSize: 11,
    color: colors.warningDark,
    lineHeight: 16,
    marginBottom: 10
  },
  delayActionButtons: {
    flexDirection: 'row',
    gap: 8
  },
  waitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningDark,
    paddingVertical: 9,
    borderRadius: 10
  },
  waitBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 4
  },
  reassignBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 9,
    borderRadius: 10
  },
  reassignBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 4
  },
  statusHeroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  statusPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginRight: 8
  },
  statusDotArrived: {
    backgroundColor: colors.success
  },
  statusMainText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  statusSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  skipArrivalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10
  },
  skipArrivalText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 4
  },
  workerDetailCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  workerMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  workerPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceSecondary,
    marginRight: 12
  },
  workerInfoCol: {
    flex: 1
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  workerName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.warningDark,
    marginLeft: 3
  },
  coopNameText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  distanceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  distanceInfoText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600'
  },
  vehicleText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4
  },
  safetyPinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14
  },
  pinBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12
  },
  pinLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary
  },
  pinValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1
  },
  pinExplanation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pinText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
    lineHeight: 15
  },
  workerActionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  actionBtnCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    borderRadius: 12
  },
  actionBtnCallText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6
  },
  actionBtnChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 12
  },
  actionBtnChatText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6
  },
  toolkitCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 14
  },
  toolkitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  toolkitTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginLeft: 6
  },
  readinessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  readinessBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
    marginLeft: 4
  },
  toolkitText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 10
  },
  toolItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  toolItemName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 5
  },
  toolkitFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 4
  },
  toolkitFooterText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5
  },
  stepperCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  stepperCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
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
  startOtpBtn: {
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
  startOtpBtnDisabled: {
    backgroundColor: colors.borderDark,
    shadowOpacity: 0,
    elevation: 0
  },
  startOtpBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  callModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center'
  },
  callAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  callTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  callWorkerName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4
  },
  callSub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20
  },
  endCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16
  },
  endCallText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  },
  chatModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  chatBubble: {
    backgroundColor: colors.surfaceSecondary,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  chatMessage: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18
  },
  chatTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right'
  },
  chatReplyBtn: {
    backgroundColor: colors.primarySubtle,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  chatReplyText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  statusHeroCardScheduled: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.success,
    marginBottom: 14
  },
  statusScheduledIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusScheduledTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
    letterSpacing: 0.5
  },
  statusScheduledTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  scheduledInfoBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  scheduledRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  scheduledTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 8
  },
  scheduledNoticeText: {
    fontSize: 11,
    color: colors.successDark,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15,
    fontWeight: '600'
  },
  teamContactCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 14
  },
  teamContactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  teamContactIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamContactTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  teamContactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  teamContactDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginVertical: 8
  },
  coordinatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  coordinatorAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  coordinatorName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  coordinatorSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  teamContactActionsRow: {
    flexDirection: 'row',
    gap: 8
  },
  callCoordBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10
  },
  callCoordBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  chatCoordBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10
  },
  chatCoordBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 6
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
  bottomActionsStack: {
    width: '100%',
    gap: 8
  },
  cancelBookingTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 6
  },
  cancelBookingTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger
  },
  cancelModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center'
  },
  cancelAlertIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  cancelModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12
  },
  penaltyNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 10
  },
  penaltyNoticeText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    flex: 1
  },
  cancelModalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10
  },
  stayWithServiceBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stayWithServiceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  confirmCancelBtn: {
    flex: 1.2,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmCancelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen07_LiveTracking;
