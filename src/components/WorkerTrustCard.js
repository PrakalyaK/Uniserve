import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const WorkerTrustCard = ({
  worker,
  showMatchReason = true,
  showActions = true,
  onConfirm,
  onFindAnother,
  confirmLabel,
  findAnotherLabel
}) => {
  const { t } = useUser();

  if (!worker) return null;

  const finalConfirmLabel = confirmLabel || t('confirmTrack');
  const finalFindAnotherLabel = findAnotherLabel || t('showNextWorker');

  return (
    <View style={styles.card}>
      {/* Top Profile Row */}
      <View style={styles.topRow}>
        <Image source={{ uri: worker.photo }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{worker.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{worker.rating}</Text>
              <Text style={styles.ratingCount}>({worker.rating_count || 200}+)</Text>
            </View>
          </View>
          <Text style={styles.skillExp}>
            {worker.skill} • {worker.experience}
          </Text>
          <Text style={styles.cooperative}>{worker.cooperative}</Text>
        </View>
      </View>

      {/* Trust Badges */}
      <View style={styles.badgesRow}>
        {worker.kyc_verified && (
          <View style={[styles.badge, styles.badgeSuccess]}>
            <Ionicons name="checkmark-circle" size={12} color={colors.successDark} />
            <Text style={styles.badgeSuccessText}>{t('kycVerified')}</Text>
          </View>
        )}
        {worker.insurance && (
          <View style={[styles.badge, styles.badgePrimary]}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
            <Text style={styles.badgePrimaryText}>{t('insured')}</Text>
          </View>
        )}
        {worker.badge && (
          <View style={[styles.badge, styles.badgePurple]}>
            <Ionicons name="ribbon" size={12} color={colors.cooperativePurple} />
            <Text style={styles.badgePurpleText}>{worker.badge}</Text>
          </View>
        )}
      </View>

      {/* Proximity & ETA Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statVal}>{worker.distance_km} km</Text>
          <Text style={styles.statLabel}>{t('distance') || 'Distance'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statVal}>{worker.eta_minutes} mins</Text>
          <Text style={styles.statLabel}>{t('estimatedArrival') || 'Estimated Arrival'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Ionicons name="construct-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statVal}>{worker.jobs_completed || 210}+</Text>
          <Text style={styles.statLabel}>{t('completedJobs') || 'Completed'}</Text>
        </View>
      </View>

      {/* Nearest Stand & Vehicle Plate Row */}
      {worker.current_location && (
        <View style={styles.standLocationRow}>
          <View style={styles.standIconWrap}>
            <Ionicons name="navigate" size={12} color="#16A34A" />
          </View>
          <Text style={styles.standLocationText} numberOfLines={1}>
            <Text style={{ fontWeight: '800' }}>{t('liveStand') || 'Live Stand:'}</Text> {worker.current_location}
          </Text>
          {worker.vehicle_plate && (
            <View style={styles.plateBadge}>
              <Text style={styles.plateText}>{worker.vehicle_plate}</Text>
            </View>
          )}
        </View>
      )}

      {/* AI Match Rationale Box */}
      {showMatchReason && worker.match_reason && (
        <View style={styles.matchReasonBox}>
          <Ionicons name="sparkles" size={16} color={colors.primary} style={styles.sparkleIcon} />
          <Text style={styles.matchReasonText}>
            <Text style={{ fontWeight: '800' }}>{t('algorithmMatch') || 'Algorithm Match:'}</Text> {worker.match_reason}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actionContainer}>
          {onConfirm && (
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmButtonText}>{finalConfirmLabel}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
          {onFindAnother && (
            <TouchableOpacity style={styles.findAnotherButton} onPress={onFindAnother} activeOpacity={0.75}>
              <Ionicons name="refresh" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.findAnotherText}>{finalFindAnotherLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.primarySubtle
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 6
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 3
  },
  ratingCount: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 2
  },
  skillExp: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2
  },
  cooperative: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeSuccess: {
    backgroundColor: colors.successLight
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 4
  },
  badgePrimary: {
    backgroundColor: colors.primarySubtle
  },
  badgePrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4
  },
  badgePurple: {
    backgroundColor: '#F3E8FF'
  },
  badgePurpleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.cooperativePurple,
    marginLeft: 4
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundLight,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12
  },
  statCol: {
    alignItems: 'center',
    flex: 1
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border
  },
  standLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7'
  },
  standIconWrap: {
    marginRight: 6
  },
  standLocationText: {
    fontSize: 11,
    color: '#166534',
    flex: 1
  },
  plateBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginLeft: 6
  },
  plateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534'
  },
  matchReasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primarySubtle,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12
  },
  sparkleIcon: {
    marginRight: 6,
    marginTop: 1
  },
  matchReasonText: {
    fontSize: 12,
    color: colors.primary,
    flex: 1,
    lineHeight: 16
  },
  actionContainer: {
    gap: 8,
    marginTop: 4
  },
  confirmButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 12
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  findAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.backgroundLight
  },
  findAnotherText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  }
});

export default WorkerTrustCard;
