import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import WorkerTrustCard from '../components/WorkerTrustCard';
import AudioVoiceRecorder from '../components/AudioVoiceRecorder';
import { getHyperLocalCooperative, getWorkersForTrade } from '../utils/locationService';

export const Screen06_WorkerMatch = ({ route, navigation }) => {
  const { service: routeService, bookingType } = route.params || {};
  const { activeBooking, assignWorker } = useBooking();
  const { user, t } = useUser();
  const service = routeService || activeBooking?.service;

  const [isSearching, setIsSearching] = useState(true);
  const [workerIndex, setWorkerIndex] = useState(0);

  const userAddress = activeBooking?.address || user?.address;
  const regionalCoop = useMemo(() => getHyperLocalCooperative(userAddress), [userAddress]);
  const pool = useMemo(
    () => getWorkersForTrade(service, userAddress),
    [service, userAddress]
  );
  const currentWorker = pool[workerIndex % pool.length];

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [workerIndex]);

  const handleConfirmBooking = () => {
    assignWorker(currentWorker);
    navigation.navigate('LiveTracking', {
      worker: currentWorker,
      service
    });
  };

  const handleFindAnother = () => {
    setWorkerIndex((prev) => prev + 1);
  };

  const handleSimulateNoWorker = () => {
    navigation.navigate('NoWorkerAvailable', { service });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('workerMatchingTitle') || 'Worker Matching'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notice Bar */}
        <View style={styles.noticeBar}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={styles.noticeText}>
            {t('coopMatchingNotice')}
          </Text>
        </View>

        {isSearching ? (
          <View style={styles.searchingCard}>
            <View style={styles.radarCircle}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={styles.searchingTitle}>
              {activeBooking?.is_bulk_project
                ? 'Deploying Project Contractor & Squad'
                : t('findingArtisan')}
            </Text>
            <Text style={styles.searchingSubtitle}>
              {activeBooking?.is_bulk_project
                ? `Matching Master Contractor and ${activeBooking?.crew_size || 4} Certified Artisans for ${activeBooking?.scale_label || 'Full Property Project'}`
                : t('findingSub')}
            </Text>

            <View style={styles.checklist}>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.checkText}>
                  {activeBooking?.is_bulk_project
                    ? `Squad of ${activeBooking?.crew_size || 4} Master Artisans Assigned`
                    : t('kycVerifiedItem')}
                </Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.checkText}>
                  {activeBooking?.is_bulk_project
                    ? `Milestone 1 Advance (₹${activeBooking?.advance_amount?.toLocaleString()}) Escrow Secured`
                    : t('insuranceValidItem')}
                </Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.checkText}>
                  {activeBooking?.is_bulk_project
                    ? 'Wholesale Co-op Depot Toolkits & Materials Verified'
                    : t('toolkitEquippedItem')}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.matchedSuccessHeader}>
              <View style={[styles.matchedBadge, activeBooking?.is_bulk_project && { backgroundColor: '#EDE9FE' }]}>
                <Ionicons
                  name={activeBooking?.is_bulk_project ? 'people' : 'checkmark-done'}
                  size={16}
                  color={activeBooking?.is_bulk_project ? colors.cooperativePurple : colors.successDark}
                />
                <Text style={[styles.matchedBadgeText, activeBooking?.is_bulk_project && { color: colors.cooperativePurple }]}>
                  {activeBooking?.is_bulk_project ? 'MASTER CONTRACTOR & SQUAD READY' : t('optimalMatch')}
                </Text>
              </View>
              <Text style={styles.matchedHeading}>
                {activeBooking?.is_bulk_project ? 'Lead Project Contractor Assigned' : t('verifiedArtisanReady')}
              </Text>
              <Text style={styles.matchedSubtext}>
                {activeBooking?.is_bulk_project
                  ? `Review lead contractor profile, ${activeBooking?.crew_size} crew artisans, and transparent milestone advance.`
                  : 'Review artisan profile, credentials, and transparent cooperative rate.'}
              </Text>
            </View>

            {/* Bulk Project Milestone Header Card if Bulk */}
            {activeBooking?.is_bulk_project && (
              <View style={styles.bulkMatchCard}>
                <View style={styles.bulkMatchHeader}>
                  <Text style={styles.bulkMatchTitle}>{activeBooking?.scale_label || 'Project Scope'}</Text>
                  <View style={styles.bulkMatchBadge}>
                    <Text style={styles.bulkMatchBadgeText}>Advance Milestone 1</Text>
                  </View>
                </View>
                <Text style={styles.bulkMatchSub}>{activeBooking?.material_label || 'Standard Co-op'}</Text>
                <View style={styles.bulkMatchMetricsRow}>
                  <View style={styles.bulkMatchMetric}>
                    <Text style={styles.bulkMatchKey}>CREW</Text>
                    <Text style={styles.bulkMatchVal}>{activeBooking?.crew_size} Artisans</Text>
                  </View>
                  <View style={styles.bulkMatchMetric}>
                    <Text style={styles.bulkMatchKey}>DURATION</Text>
                    <Text style={styles.bulkMatchVal}>{activeBooking?.estimated_days} Days</Text>
                  </View>
                  <View style={styles.bulkMatchMetric}>
                    <Text style={styles.bulkMatchKey}>ADVANCE PAYABLE</Text>
                    <Text style={[styles.bulkMatchVal, { color: colors.primary }]}>₹{activeBooking?.advance_amount?.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Multi-Artisan Squad Card for Cleaner / Gardener if worker_count > 1 */}
            {!activeBooking?.is_bulk_project && activeBooking?.worker_count > 1 && (
              <View style={styles.multiArtisanSquadCard}>
                <View style={styles.multiArtisanHeader}>
                  <View style={styles.multiArtisanIconCircle}>
                    <Ionicons name="people" size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.multiArtisanTag}>MULTI-ARTISAN COOPERATIVE DISPATCH</Text>
                    <Text style={styles.multiArtisanTitle}>
                      {activeBooking.worker_count} Certified Artisans Dispatched
                    </Text>
                  </View>
                  <View style={styles.speedBadge}>
                    <Text style={styles.speedBadgeText}>{activeBooking.worker_count}x Faster</Text>
                  </View>
                </View>

                <View style={styles.squadMembersList}>
                  {/* Lead Artisan */}
                  <View style={styles.squadMemberRow}>
                    <View style={[styles.squadAvatarCircle, { backgroundColor: colors.primary }]}>
                      <Text style={styles.squadAvatarText}>1</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.squadMemberName}>{currentWorker?.name || 'Lead Artisan'} (Lead)</Text>
                      <Text style={styles.squadMemberSkill}>{currentWorker?.skill} • Primary Lead</Text>
                    </View>
                    <Text style={styles.squadMemberRate}>₹{activeBooking?.single_worker_base || 199}</Text>
                  </View>

                  {/* 2nd Assistant */}
                  <View style={styles.squadMemberRow}>
                    <View style={[styles.squadAvatarCircle, { backgroundColor: colors.successDark }]}>
                      <Text style={styles.squadAvatarText}>2</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.squadMemberName}>Amit Verma (Co-op Assistant)</Text>
                      <Text style={styles.squadMemberSkill}>Certified Guild Member • 2nd Artisan</Text>
                    </View>
                    <Text style={styles.squadMemberRate}>+₹{activeBooking?.extra_worker_rate || 199}</Text>
                  </View>

                  {/* 3rd Assistant if worker_count === 3 */}
                  {activeBooking?.worker_count === 3 && (
                    <View style={styles.squadMemberRow}>
                      <View style={[styles.squadAvatarCircle, { backgroundColor: colors.cooperativePurple }]}>
                        <Text style={styles.squadAvatarText}>3</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.squadMemberName}>Sunil Sharma (Co-op Assistant)</Text>
                        <Text style={styles.squadMemberSkill}>Certified Guild Member • 3rd Artisan</Text>
                      </View>
                      <Text style={styles.squadMemberRate}>+₹{activeBooking?.extra_worker_rate || 199}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Customer Incident Diagnostic Media Briefing */}
            {(activeBooking?.description || activeBooking?.photo || activeBooking?.video_clip || activeBooking?.voice_note || activeBooking?.attachments?.length > 0) && (
              <View style={styles.briefingCard}>
                <View style={styles.briefingHeader}>
                  <Ionicons name="document-attach" size={16} color={colors.primary} />
                  <Text style={styles.briefingTitle}>CUSTOMER ISSUE BRIEFING &amp; ATTACHMENTS</Text>
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

            {/* Worker Trust Card */}
            <WorkerTrustCard
              worker={currentWorker}
              showMatchReason={true}
              showActions={true}
              onConfirm={handleConfirmBooking}
              onFindAnother={pool.length > 1 ? handleFindAnother : null}
              confirmLabel={
                activeBooking?.is_bulk_project
                  ? `Confirm Squad & Pay Advance (₹${activeBooking?.advance_amount?.toLocaleString()})`
                  : activeBooking?.worker_count > 1
                  ? `Dispatch ${activeBooking.worker_count} Artisans • ₹${activeBooking?.base_amount}`
                  : t('confirmTrack')
              }
              findAnotherLabel={t('showNextWorker')}
            />

            {/* Seva Suraksha Assurance */}
            <View style={styles.guaranteeCard}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <View style={styles.guaranteeTextCol}>
                <Text style={styles.guaranteeTitle}>
                  {activeBooking?.is_bulk_project ? 'Govt SBI MSCS Escrow Protection' : 'Price & Quality Protection'}
                </Text>
                <Text style={styles.guaranteeSub}>
                  {activeBooking?.is_bulk_project
                    ? '100% Advance is held in Govt SBI MSCS Cooperative Trust Escrow and disbursed only in verified stages.'
                    : 'No payment is processed until work is completed and verified with your OTP.'}
                </Text>
              </View>
            </View>

            {/* No Worker Nearby Fallback trigger */}
            <TouchableOpacity
              style={styles.noWorkerFallbackBtn}
              onPress={handleSimulateNoWorker}
              activeOpacity={0.7}
            >
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.noWorkerFallbackText}>
                Need assistance if artisan is delayed? View Resolution Options
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 30
  },
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6
  },
  searchingCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: 20
  },
  radarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  searchingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  searchingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: '90%'
  },
  checklist: {
    marginTop: 24,
    gap: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceSecondary,
    padding: 14,
    borderRadius: 14
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8
  },
  matchedSuccessHeader: {
    marginBottom: 12
  },
  matchedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  matchedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
    marginLeft: 4
  },
  matchedHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary
  },
  matchedSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16
  },
  guaranteeTextCol: {
    marginLeft: 10,
    flex: 1
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  guaranteeSub: {
    fontSize: 11,
    color: colors.primaryText,
    marginTop: 1,
    lineHeight: 15
  },
  bulkMatchCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  bulkMatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bulkMatchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  bulkMatchBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  bulkMatchBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.cooperativePurple
  },
  bulkMatchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  bulkMatchMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    padding: 8,
    borderRadius: 10,
    marginTop: 10
  },
  bulkMatchMetric: {
    alignItems: 'center'
  },
  bulkMatchKey: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary
  },
  bulkMatchVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1
  },
  noWorkerFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  noWorkerFallbackText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6
  },
  multiArtisanSquadCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  multiArtisanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  multiArtisanIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  multiArtisanTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  multiArtisanTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1
  },
  speedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  speedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark
  },
  squadMembersList: {
    gap: 8
  },
  squadMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  squadAvatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  squadAvatarText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  squadMemberName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  squadMemberSkill: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  squadMemberRate: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  briefingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
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
  }
});

export default Screen06_WorkerMatch;
