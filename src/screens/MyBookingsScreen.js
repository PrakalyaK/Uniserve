import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import { getLocalizedServiceName } from '../utils/i18nHelper';
import Header from '../components/Header';

export const MyBookingsScreen = ({ navigation }) => {
  const { activeBooking, pastBookings, completeBulkProject } = useBooking();
  const { language, t } = useUser();
  const [liveElapsed, setLiveElapsed] = useState(0);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('tabBookings') || 'My Bookings'} />

      <FlatList
        data={pastBookings}
        keyExtractor={(item) => item.booking_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Active Booking Card if exists */}
            {activeBooking && (
              activeBooking.is_bulk_project ? (
                <View style={[styles.activeCard, { borderColor: colors.primary, borderWidth: 1.5 }]}>
                  <View style={styles.activeTopRow}>
                    <View style={[styles.activeBadge, { backgroundColor: activeBooking.client_type === 'institutional' ? '#EFF6FF' : '#F0FDF4' }]}>
                      <Ionicons name={activeBooking.client_type === 'institutional' ? 'school' : 'business'} size={12} color={colors.primary} />
                      <Text style={[styles.activeBadgeText, { color: colors.primary, marginLeft: 4 }]}>
                        {activeBooking.client_type === 'institutional' ? 'CAMPUS INFRASTRUCTURE' : 'COMMUNITY BULK'}
                      </Text>
                    </View>
                    <Text style={styles.bookingIdText}>{activeBooking.booking_id}</Text>
                  </View>

                  <View style={styles.activeBodyRow}>
                    <View style={[styles.serviceIconWrap, { backgroundColor: colors.primary }]}>
                      <Text style={{ fontSize: 20, color: '#FFFFFF' }}>{activeBooking.service?.icon || '🏛️'}</Text>
                    </View>
                    <View style={styles.activeTextCol}>
                      <Text style={styles.activeServiceName}>
                        {activeBooking.institution_name || activeBooking.society_name || activeBooking.scale_label || activeBooking.service?.name}
                      </Text>
                      <Text style={styles.activeWorkerName}>
                        {activeBooking.service?.name} • {activeBooking.crew_size || 4} Master Artisans Squad
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text style={styles.activeStatusText}>
                          {activeBooking.payment_status === 'full_paid' || Number(activeBooking.remaining_amount) <= 0
                            ? '🟢 100% Escrow Funded'
                            : (activeBooking.payment_status === 'advance_paid'
                              ? `🟡 Adv Paid • Bal: ₹${Number(activeBooking.remaining_amount || 0).toLocaleString()}`
                              : '🟠 Escrow Deposit Pending')}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bulk Project Action Buttons */}
                  {activeBooking.payment_status === 'full_paid' || Number(activeBooking.remaining_amount) <= 0 ? (
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                      <TouchableOpacity
                        style={[styles.resumeBtn, { flex: 1, backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('BulkProjectSuccess')}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.resumeBtnText, { fontSize: 12 }]}>View Gate Pass</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.resumeBtn, { flex: 1, backgroundColor: colors.successDark }]}
                        onPress={() => {
                          if (typeof completeBulkProject === 'function') completeBulkProject();
                          navigation.navigate('Rating', { booking: activeBooking });
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.resumeBtnText, { fontSize: 12 }]}>Complete & Rate</Text>
                        <Ionicons name="star" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  ) : activeBooking.payment_status === 'advance_paid' || Number(activeBooking.paid_amount) > 0 ? (
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                      <TouchableOpacity
                        style={[styles.resumeBtn, { flex: 1.2, backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('BulkPayment')}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.resumeBtnText, { fontSize: 12 }]}>
                          Pay Bal (₹{Number(activeBooking.remaining_amount || 0).toLocaleString()})
                        </Text>
                        <Ionicons name="lock-closed" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.resumeBtn, { flex: 0.8, backgroundColor: '#1E293B' }]}
                        onPress={() => navigation.navigate('BulkProjectSuccess')}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.resumeBtnText, { fontSize: 12 }]}>Gate Pass</Text>
                        <Ionicons name="id-card" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.resumeBtn}
                      onPress={() => navigation.navigate('BulkPayment')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.resumeBtnText}>Deposit Milestone Escrow</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.activeCard}>
                  <View style={styles.activeTopRow}>
                    <View style={styles.activeBadge}>
                      <View style={styles.activePulseDot} />
                      <Text style={styles.activeBadgeText}>
                        {activeBooking.status === 'Work Started'
                          ? (t('liveJobInProgress') || 'LIVE JOB IN PROGRESS')
                          : (t('activeService') || 'ACTIVE SERVICE')}
                      </Text>
                    </View>
                    <Text style={styles.bookingIdText}>{activeBooking.booking_id}</Text>
                  </View>

                  <View style={styles.activeBodyRow}>
                    <View style={styles.serviceIconWrap}>
                      <Text style={{ fontSize: 22 }}>{activeBooking.service?.icon || '🔧'}</Text>
                    </View>
                    <View style={styles.activeTextCol}>
                      <Text style={styles.activeServiceName}>
                        {getLocalizedServiceName(activeBooking.service, t, language?.code) || activeBooking.service?.name || 'Service'}
                      </Text>
                      <Text style={styles.activeWorkerName}>
                        {t('artisanLabel') || 'Artisan:'} {activeBooking.worker?.name || 'Assigned Worker'}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text style={styles.activeStatusText}>
                          {t('statusLabel') || 'Status:'} <Text style={{ fontWeight: '700', color: colors.primary }}>{activeBooking.status}</Text>
                        </Text>
                        {activeBooking.status === 'Work Started' && !activeBooking.is_bulk_project && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySubtle, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 }}>
                            <Ionicons name="time" size={11} color={colors.primary} />
                            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, marginLeft: 3 }}>
                              {formatTimer(liveElapsed)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.resumeBtn}
                    onPress={handleResumeActive}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.resumeBtnText}>
                      {activeBooking.status === 'Work Started'
                        ? (t('resumeLiveJobSession') || 'Resume Live Job Session')
                        : (t('resumeActiveTracking') || 'Resume Active Tracking')}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              )
            )}

            <Text style={styles.pastTitle}>{t('pastCompletedBookings') || 'Past Completed Bookings'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.pastCard}>
            <View style={styles.pastTopRow}>
              <View style={styles.pastServiceInfo}>
                <Text style={styles.pastIcon}>{item.service?.icon || (item.is_bulk_project ? '🏛️' : '⚡')}</Text>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.pastServiceName}>
                    {item.is_bulk_project
                      ? (item.institution_name || item.society_name || item.scale_label || item.service?.name)
                      : (getLocalizedServiceName(item.service, t, language?.code) || item.service?.name)}
                  </Text>
                  <Text style={styles.pastDate}>
                    {item.is_bulk_project
                      ? `${item.service?.name || 'Bulk Service'} • ${item.campus_scale || 'Completed'}`
                      : (item.date || t('recent') || 'Recent')}
                  </Text>
                </View>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>
                  ₹{Number(item.total_project_cost || item.paid_amount || item.total_amount || 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.workerRow}>
              <Text style={styles.workerLabel}>
                {item.is_bulk_project ? 'Squad:' : (t('artisanLabel') || 'Artisan:')}{' '}
                <Text style={styles.workerVal}>
                  {item.is_bulk_project ? `${item.crew_size || 4} Certified Master Artisans` : (item.worker?.name || 'Master Artisan')}
                </Text>
              </Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingVal}>{item.rating || 5}.0</Text>
              </View>
            </View>

            <View style={styles.pastFooterRow}>
              <View style={styles.statusChip}>
                <Ionicons name="checkmark-circle" size={12} color={colors.successDark} />
                <Text style={styles.statusChipText}>
                  {item.is_bulk_project ? '100% Escrow Settled & Completed' : item.status}
                </Text>
              </View>
              <Text style={styles.coopSocietyText}>
                {item.cooperative_name || item.worker?.cooperative || 'Delhi Labour Cooperative'}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40
  },
  activeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  activeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 6
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  activeBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  activeTextCol: {
    flex: 1
  },
  activeServiceName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  activeWorkerName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  activeStatusText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12
  },
  resumeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  pastTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12
  },
  pastCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  pastTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  pastServiceInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pastIcon: {
    fontSize: 22
  },
  pastServiceName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  pastDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  priceBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary
  },
  workerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 10
  },
  workerLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  workerVal: {
    fontWeight: '600',
    color: colors.textPrimary
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 3
  },
  pastFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 4
  },
  coopSocietyText: {
    fontSize: 10,
    color: colors.textMuted
  }
});

export default MyBookingsScreen;
