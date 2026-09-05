import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import LanguageSelectorModal from '../components/LanguageSelectorModal';
import servicesData from '../data/services.json';
import { getLocalizedServiceName } from '../utils/i18nHelper';

export const Screen03_Home = ({ navigation }) => {
  const { user, language, setLanguage, updateUserProfile, t } = useUser();
  const { createBooking, activeBooking, completeBulkProject } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const [editableAddress, setEditableAddress] = useState(user?.address || '');
  const [liveElapsed, setLiveElapsed] = useState(0);

  // Live timer for active work in progress (solo quick fixes only; multi-day bulk contracts do not use runtime stopwatches)
  useEffect(() => {
    if (!activeBooking || !activeBooking.work_started_at || activeBooking.is_bulk_project) return;
    const updateTime = () => {
      const diff = Math.floor((Date.now() - activeBooking.work_started_at) / 1000);
      setLiveElapsed(Math.max(0, diff));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activeBooking?.work_started_at, activeBooking?.is_bulk_project]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResumeActive = () => {
    if (!activeBooking) return;
    if (activeBooking.is_bulk_project) {
      if (activeBooking.status === 'Work Completed') {
        navigation.navigate('Rating', { booking: activeBooking });
      } else if (activeBooking.payment_status === 'pending') {
        navigation.navigate('BulkPayment');
      } else {
        navigation.navigate('BulkProjectSuccess');
      }
      return;
    }
    if (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') {
      navigation.navigate('RatingScreen', { booking: activeBooking });
      return;
    }
    if (activeBooking.statusIndex === 4 || activeBooking.status === 'Work Started') {
      navigation.navigate('JobInProgress', { worker: activeBooking.worker });
    } else if (activeBooking.statusIndex === 5 || activeBooking.status === 'Work Completed') {
      navigation.navigate('Payment', { worker: activeBooking.worker });
    } else if (activeBooking.statusIndex === 3 || activeBooking.status === 'Worker Arrived') {
      navigation.navigate('StartOTP', { worker: activeBooking.worker });
    } else {
      navigation.navigate('LiveTracking', { worker: activeBooking.worker });
    }
  };

  // Emergency SOS categories (Removed gas leak as requested)
  const SOS_CATEGORIES = [
    { id: 'sos1', title: t('sosPlumbing'), icon: 'water', serviceId: 's1', color: colors.primary },
    { id: 'sos2', title: t('sosElectrical'), icon: 'flash', serviceId: 's2', color: colors.warningDark },
    { id: 'sos3', title: t('sosLocksmith'), icon: 'key', serviceId: 's4', color: colors.cooperativePurple }
  ];

  // Keyword to service matching
  const KEYWORD_MAP = {
    tap: 's1',
    leak: 's1',
    plumb: 's1',
    pipe: 's1',
    flush: 's1',
    water: 's1',
    socket: 's2',
    electric: 's2',
    mcb: 's2',
    wire: 's2',
    light: 's2',
    fan: 's2',
    power: 's2',
    clean: 's3',
    dust: 's3',
    wash: 's3',
    sweep: 's3',
    wood: 's4',
    carpenter: 's4',
    door: 's4',
    table: 's4',
    lock: 's4',
    hinge: 's4',
    paint: 's5',
    wall: 's5',
    color: 's5',
    care: 's6',
    elder: 's6',
    nurse: 's6',
    patient: 's6',
    ac: 's7',
    fridge: 's7',
    machine: 's7',
    appliance: 's7',
    technician: 's7',
    tech: 's7',
    motor: 's7',
    inverter: 's7',
    tv: 's7',
    microwave: 's7',
    domestic: 's8',
    maid: 's8',
    cook: 's8',
    help: 's8',
    dish: 's8',
    vessel: 's8',
    househelp: 's8',
    laundry: 's8',
    driver: 's9',
    drive: 's9',
    car: 's9',
    chauffeur: 's9',
    trip: 's9',
    valet: 's9',
    garden: 's10',
    gardener: 's10',
    plant: 's10',
    lawn: 's10',
    grass: 's10',
    pot: 's10',
    prun: 's10',
    tree: 's10'
  };

  const filteredServices = servicesData.filter((service) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    if (service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q)) {
      return true;
    }

    for (const [kw, serviceId] of Object.entries(KEYWORD_MAP)) {
      if (q.includes(kw) && service.id === serviceId) {
        return true;
      }
    }
    return false;
  });

  const handleSelectService = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const handleSelectSosCategory = (sosItem) => {
    setSosModalVisible(false);
    const targetService = servicesData.find((s) => s.id === sosItem.serviceId) || servicesData[0];
    navigation.navigate('BookingForm', {
      service: targetService,
      bookingType: 'emergency',
      emergencyIssue: sosItem.title
    });
  };

  const handleSaveAddress = () => {
    updateUserProfile({ address: editableAddress });
    setAddressModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Universal Top Header */}
      <Header
        onLocationPress={() => {
          setEditableAddress(user?.address || '');
          setAddressModalVisible(true);
        }}
        onLanguagePress={() => setLangModalVisible(true)}
        onEmergencyPress={() => setSosModalVisible(true)}
        showEmergency={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Ongoing Booking Live Banner */}
        {/* Active Ongoing Booking Live Banner */}
        {activeBooking && (
          activeBooking.is_bulk_project ? (
            <View style={[styles.activeServiceCard, { borderColor: colors.primary, borderWidth: 1.5 }]}>
              <View style={styles.activeServiceTopRow}>
                <View style={[styles.activeBadgePill, { backgroundColor: activeBooking.client_type === 'institutional' ? '#EFF6FF' : '#F0FDF4' }]}>
                  <Ionicons name={activeBooking.client_type === 'institutional' ? 'school' : 'business'} size={12} color={colors.primary} />
                  <Text style={[styles.activeBadgePillText, { color: colors.primary, marginLeft: 4 }]}>
                    {activeBooking.client_type === 'institutional' ? 'CAMPUS BULK PROJECT' : 'COMMUNITY BULK PROJECT'}
                  </Text>
                </View>
                <Text style={styles.activeBookingId}>{activeBooking.booking_id}</Text>
              </View>

              <View style={styles.activeServiceMainRow}>
                <View style={[styles.activeServiceIconBox, { backgroundColor: colors.primary }]}>
                  <Text style={{ fontSize: 22, color: '#FFFFFF' }}>{activeBooking.service?.icon || '🏛️'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activeServiceTitle}>
                    {activeBooking.institution_name || activeBooking.society_name || activeBooking.scale_label || activeBooking.service?.name}
                  </Text>
                  <Text style={styles.activeArtisanText}>
                    {activeBooking.service?.name} • {activeBooking.crew_size || 4} Master Artisans Squad
                  </Text>
                  <Text style={[styles.activeStatusLabel, { marginTop: 2, fontSize: 11 }]}>
                    Scale: <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{activeBooking.campus_scale || activeBooking.scale_label || 'Standard'}</Text>
                  </Text>
                </View>
              </View>

              {/* Escrow Payment Status Callout */}
              {activeBooking.payment_status === 'full_paid' || Number(activeBooking.remaining_amount) <= 0 ? (
                <View style={{ backgroundColor: '#ECFDF5', padding: 8, borderRadius: 8, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.successDark} />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.successDark, marginLeft: 6 }}>
                    100% ESCROW FUNDED (₹{Number(activeBooking.total_project_cost || activeBooking.paid_amount || 0).toLocaleString()}) • ACTIVE
                  </Text>
                </View>
              ) : activeBooking.payment_status === 'advance_paid' || Number(activeBooking.paid_amount) > 0 ? (
                <View style={{ backgroundColor: '#FEF3C7', padding: 8, borderRadius: 8, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="card" size={15} color="#D97706" />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#92400E', marginLeft: 6 }}>
                      Adv Paid: ₹{Number(activeBooking.paid_amount || activeBooking.advance_amount || 0).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.danger }}>
                    Balance: ₹{Number(activeBooking.remaining_amount || 0).toLocaleString()}
                  </Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#FFF7ED', padding: 8, borderRadius: 8, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time" size={15} color="#EA580C" />
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#EA580C', marginLeft: 6 }}>
                    Escrow Deposit Pending: ₹{Number(activeBooking.advance_amount || activeBooking.total_project_cost || 0).toLocaleString()}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              {activeBooking.payment_status === 'full_paid' || Number(activeBooking.remaining_amount) <= 0 ? (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('BulkProjectSuccess')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="document-text" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Pass & Escrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.successDark, paddingVertical: 9, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => {
                      if (typeof completeBulkProject === 'function') completeBulkProject();
                      navigation.navigate('Rating', { booking: activeBooking });
                    }}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="star" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Complete & Rate</Text>
                  </TouchableOpacity>
                </View>
              ) : activeBooking.payment_status === 'advance_paid' || Number(activeBooking.paid_amount) > 0 ? (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    style={{ flex: 1.2, backgroundColor: colors.primary, paddingVertical: 9, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('BulkPayment')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="lock-closed" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>
                      Pay Balance (₹{Number(activeBooking.remaining_amount || 0).toLocaleString()})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 0.8, backgroundColor: '#1E293B', paddingVertical: 9, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    onPress={() => navigation.navigate('BulkProjectSuccess')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="id-card" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 11 }}>Gate Pass</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.resumeActionRow, { marginTop: 10 }]}
                  onPress={() => navigation.navigate('BulkPayment')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.resumeActionText}>Deposit Milestone Escrow</Text>
                  <Ionicons name="arrow-forward-circle" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.activeServiceCard}
              onPress={handleResumeActive}
              activeOpacity={0.9}
            >
              <View style={styles.activeServiceTopRow}>
                <View style={[styles.activeBadgePill, (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') && { backgroundColor: '#ECFDF5' }]}>
                  <View style={[styles.livePulseDot, (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') && { backgroundColor: colors.success }]} />
                  <Text style={[styles.activeBadgePillText, (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') && { color: colors.successDark }]}>
                    {activeBooking.payment_status === 'paid' || activeBooking.status === 'completed'
                      ? (t('paymentSettledRate') || 'PAYMENT SETTLED • RATE ARTISAN')
                      : (activeBooking.status === 'Work Started' ? 'LIVE JOB IN PROGRESS' : 'ACTIVE SERVICE ONGOING')}
                  </Text>
                </View>
                <Text style={styles.activeBookingId}>{activeBooking.booking_id}</Text>
              </View>

              <View style={styles.activeServiceMainRow}>
                <View style={styles.activeServiceIconBox}>
                  <Text style={{ fontSize: 24 }}>{activeBooking.service?.icon || '🔧'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activeServiceTitle}>
                    {getLocalizedServiceName(activeBooking.service, t, language?.code) || activeBooking.service?.name || 'Service'}
                  </Text>
                  <Text style={styles.activeArtisanText}>
                    Artisan: {activeBooking.worker?.name || 'Assigned Worker'} • {activeBooking.worker?.cooperative || 'Labour Co-op'}
                  </Text>
                  <View style={styles.activeStatusTimeRow}>
                    <Text style={styles.activeStatusLabel}>
                      Status: <Text style={{ color: (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') ? colors.successDark : colors.primary, fontWeight: '800' }}>
                        {activeBooking.payment_status === 'paid' || activeBooking.status === 'completed'
                          ? `Paid ₹${activeBooking.paid_amount || activeBooking.total_amount || 0} • Settled`
                          : activeBooking.status}
                      </Text>
                    </Text>
                    {activeBooking.status === 'Work Started' && !activeBooking.is_bulk_project && (
                      <View style={styles.timerChip}>
                        <Ionicons name="time" size={12} color="#FFFFFF" />
                        <Text style={styles.timerChipText}>{formatTimer(liveElapsed)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={[styles.resumeActionRow, (activeBooking.payment_status === 'paid' || activeBooking.status === 'completed') && { backgroundColor: colors.successDark }]}>
                <Text style={styles.resumeActionText}>
                  {activeBooking.payment_status === 'paid' || activeBooking.status === 'completed'
                    ? (t('rateExperience') || 'Rate Artisan & Complete')
                    : (activeBooking.status === 'Work Started' ? t('resumeSession') : t('resumeTracking'))}
                </Text>
                <Ionicons name={activeBooking.payment_status === 'paid' || activeBooking.status === 'completed' ? 'star' : 'arrow-forward-circle'} size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )
        )}

        {/* Emergency Assistance Hero Banner */}
        <TouchableOpacity
          style={styles.emergencyHero}
          onPress={() => setSosModalVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.emergencyLeft}>
            <View style={styles.emergencyTag}>
              <Ionicons name="flash" size={12} color="#FFFFFF" />
              <Text style={styles.emergencyTagText}>{t('urgentDispatch')}</Text>
            </View>
            <Text style={styles.emergencyTitle}>{t('emergencyHelpTitle')}</Text>
            <Text style={styles.emergencySubtitle}>
              {t('emergencyHelpSubtitle')}
            </Text>
          </View>
          <View style={styles.emergencyActionBtn}>
            <Ionicons name="shield-alert" size={16} color={colors.danger} />
            <Text style={styles.emergencyActionText}>{t('bookSosBtn')}</Text>
          </View>
        </TouchableOpacity>

        {/* 📞 Permanent National Toll-Free Helpline Banner */}
        <TouchableOpacity
          style={styles.tollFreeBanner}
          onPress={() => navigation.navigate('IVRSCall')}
          activeOpacity={0.85}
        >
          <View style={styles.tollFreeIconBox}>
            <Ionicons name="call" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.tollFreeTextCol}>
            <View style={styles.tollFreeTagRow}>
              <Text style={styles.tollFreeTag}>{t('tollFreeTag')}</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>{t('freeBadge')}</Text>
              </View>
            </View>
            <Text style={styles.tollFreeNumber}>1800-890-UNISERV</Text>
            <Text style={styles.tollFreeSub}>
              {t('tollFreeSub')}
            </Text>
          </View>
          <View style={styles.tollFreeActionBtn}>
            <Ionicons name="call" size={14} color="#FFFFFF" />
            <Text style={styles.tollFreeActionText}>{t('callBtn')}</Text>
          </View>
        </TouchableOpacity>

        {/* 🤝 Register for Another Person (E-Sevai Maiyam / Neighbour Portal) */}
        <TouchableOpacity
          style={styles.assistedRegBanner}
          onPress={() => navigation.navigate('RegisterForAnother')}
          activeOpacity={0.85}
        >
          <View style={styles.assistedLeft}>
            <View style={styles.assistedIconCircle}>
              <Ionicons name="people-circle" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.assistedTextCol}>
              <View style={styles.assistedBadgeRow}>
                <Text style={styles.assistedBadge}>{t('assistedPortalTag')}</Text>
                <View style={styles.assistedNewPill}>
                  <Text style={styles.assistedNewPillText}>{t('assistedBadge')}</Text>
                </View>
              </View>
              <Text style={styles.assistedTitle}>{t('assistedRegTitle')}</Text>
              <Text style={styles.assistedDesc}>
                {t('assistedRegDesc')}
              </Text>
            </View>
          </View>
          <View style={styles.assistedActionBtn}>
            <Text style={styles.assistedActionText}>{t('registerBtn')}</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Community & Campus Bulk Services Banner */}
        <TouchableOpacity
          style={styles.communityBanner}
          onPress={() => navigation.navigate('Community', { initialMode: 'institutional' })}
          activeOpacity={0.85}
        >
          <View style={styles.communityLeft}>
            <View style={styles.communityIconCircle}>
              <Ionicons name="school" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.communityTextCol}>
              <View style={styles.communityBadgeRow}>
                <Text style={styles.communityBadge}>COLLEGES, CAMPUSES & HOUSING SOCIETIES</Text>
                <View style={styles.ncctPill}>
                  <Text style={styles.ncctPillText}>{t('ncctVerified') || 'NCCT VERIFIED'}</Text>
                </View>
              </View>
              <Text style={styles.communityTitle}>Community & Campus Bulk Hub</Text>
              <Text style={styles.communityDesc}>
                Statutory audits, mega reservoirs, student hostel cleaning, and multi-artisan squads for colleges & RWAs.
              </Text>

              {/* Quick Mode Chips */}
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primarySubtle,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: colors.primaryLight
                  }}
                  onPress={() => navigation.navigate('Community', { initialMode: 'institutional' })}
                >
                  <Text style={{ fontSize: 9, fontWeight: '800', color: colors.primary }}>
                    🏛️ Colleges & Hostels
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.surfaceSecondary,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: colors.border
                  }}
                  onPress={() => navigation.navigate('Community', { initialMode: 'residential' })}
                >
                  <Text style={{ fontSize: 9, fontWeight: '700', color: colors.textSecondary }}>
                    🏢 Housing Societies
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('allServices')}</Text>
          <Text style={styles.sectionSubtitle}>{t('standardRates')}</Text>
        </View>

        {/* Services Grid (2 Columns) */}
        {filteredServices.length === 0 ? (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching services found</Text>
            <Text style={styles.emptySub}>Try searching "tap", "electrician", "cleaning", or "carpenter"</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredServices.map((service) => (
              <View key={service.id} style={styles.gridItem}>
                <ServiceCard service={service} onPress={handleSelectService} />
              </View>
            ))}
          </View>
        )}

        {/* Seva Suraksha Guarantee Hub Banner */}
        <TouchableOpacity
          style={styles.sevaBanner}
          onPress={() => navigation.navigate('SevaSuraksha')}
          activeOpacity={0.85}
        >
          <View style={styles.sevaLeft}>
            <View style={styles.shieldIconCircle}>
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.sevaTextCol}>
              <Text style={styles.sevaTitle}>{t('sevaSurakshaPolicy')}</Text>
              <Text style={styles.sevaDesc}>{t('sevaSurakshaSub')}</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Cooperative Fair Wage Promise */}
        <View style={styles.fairPromiseCard}>
          <View style={styles.fairIconCircle}>
            <Ionicons name="heart-circle" size={26} color={colors.success} />
          </View>
          <View style={styles.fairTextCol}>
            <Text style={styles.fairTitle}>{t('fairWageTitle')}</Text>
            <Text style={styles.fairDesc}>
              {t('fairWageDesc')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SOS Emergency Category Selection Modal */}
      <Modal visible={sosModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.sosModalCard}>
            <View style={styles.sosModalHeader}>
              <View style={styles.sosHeaderIcon}>
                <Ionicons name="flash" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.sosModalTitle}>{t('emergencySosTitle')}</Text>
                <Text style={styles.sosModalSub}>{t('emergencySosSubtitle')}</Text>
              </View>
              <TouchableOpacity onPress={() => setSosModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sosGrid}>
              {SOS_CATEGORIES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.sosOptionCard}
                  onPress={() => handleSelectSosCategory(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.sosIconBox, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={styles.sosOptionTitle}>{item.title}</Text>
                  <View style={styles.sosBadge}>
                    <Text style={styles.sosBadgeText}>&lt; 15 mins dispatch • +₹100</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Address Modal */}
      <Modal visible={addressModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Service Location</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.addressInput}
              value={editableAddress}
              onChangeText={setEditableAddress}
              placeholder="Enter full street address"
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.saveAddressBtn} onPress={handleSaveAddress}>
              <Text style={styles.saveAddressBtnText}>Update Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={(l) => setLanguage(l)}
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30
  },
  emergencyHero: {
    backgroundColor: colors.dangerDark,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  emergencyLeft: {
    flex: 1,
    marginRight: 12
  },
  emergencyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },
  emergencyTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2
  },
  emergencySubtitle: {
    fontSize: 11,
    color: '#FEE2E2',
    lineHeight: 15
  },
  emergencyActionBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  emergencyActionText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4
  },
  tollFreeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#334155'
  },
  tollFreeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  tollFreeTextCol: {
    flex: 1
  },
  tollFreeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  tollFreeTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 0.5
  },
  freeBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  freeBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  tollFreeNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  tollFreeSub: {
    fontSize: 10.5,
    color: '#CBD5E1',
    marginTop: 1,
    lineHeight: 14
  },
  tollFreeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6
  },
  tollFreeActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 4
  },
  assistedRegBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginBottom: 12
  },
  assistedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  assistedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  assistedTextCol: {
    flex: 1
  },
  assistedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  assistedBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.5
  },
  assistedNewPill: {
    backgroundColor: '#047857',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  assistedNewPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  assistedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B'
  },
  assistedDesc: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
    lineHeight: 14
  },
  assistedActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  assistedActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    marginRight: 2
  },
  communityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySubtle,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 14
  },
  communityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  communityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  communityTextCol: {
    flex: 1
  },
  communityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  communityBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  ncctPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  ncctPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.successDark
  },
  communityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  communityDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 14
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500'
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  gridItem: {
    width: '48%',
    marginBottom: 12
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8
  },
  emptySub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2
  },
  sevaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  sevaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  shieldIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  sevaTextCol: {
    flex: 1
  },
  sevaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  sevaDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  fairPromiseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20
  },
  fairIconCircle: {
    marginRight: 10
  },
  fairTextCol: {
    flex: 1
  },
  fairTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.successDark
  },
  fairDesc: {
    fontSize: 11,
    color: colors.successDark,
    marginTop: 2,
    lineHeight: 15
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  sosModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20
  },
  sosModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  sosHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sosModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  sosModalSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  closeBtn: {
    padding: 4
  },
  sosGrid: {
    gap: 10
  },
  sosOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  sosIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  sosOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1
  },
  sosBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  sosBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.danger
  },
  addressModalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  addressInput: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
    marginBottom: 14
  },
  saveAddressBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  saveAddressBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  // Active Ongoing Service Card Styles
  activeServiceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6
  },
  activeServiceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8
  },
  activeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)'
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
    marginRight: 6
  },
  activeBadgePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#60A5FA',
    letterSpacing: 0.5
  },
  activeBookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  },
  activeServiceMainRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeServiceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  activeServiceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  activeArtisanText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  },
  activeStatusTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  activeStatusLabel: {
    fontSize: 12,
    color: '#CBD5E1'
  },
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8
  },
  timerChipText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 3
  },
  resumeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    marginTop: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  resumeActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen03_Home;
