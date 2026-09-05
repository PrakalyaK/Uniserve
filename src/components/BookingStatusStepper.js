import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { BOOKING_STATUSES } from '../context/BookingContext';
import { useUser } from '../context/UserContext';

const STATUS_KEYS = [
  'status_requested',
  'status_assigned',
  'status_on_the_way',
  'status_arrived',
  'status_work_started',
  'status_completed'
];

const STATUS_DESC_KEYS = [
  'status_desc_requested',
  'status_desc_assigned',
  'status_desc_on_the_way',
  'status_desc_arrived',
  'status_desc_work_started',
  'status_desc_completed'
];

const STATUS_DESCRIPTIONS_DEFAULT = [
  'Request broadcasted to verified cooperative workers',
  'Artisan assigned & acknowledged the job',
  'Worker in transit to your registered address',
  'Worker reached doorstep — share Start OTP',
  'Service active & covered under Seva Suraksha',
  'Mutual sign-off & warranty protection activated'
];

export const BookingStatusStepper = ({ currentStep = 0, compact = false }) => {
  const { t } = useUser();

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {BOOKING_STATUSES.map((status, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isFuture = index > currentStep;
        const isLast = index === BOOKING_STATUSES.length - 1;

        const localizedTitle = t(STATUS_KEYS[index]) || status;
        const localizedDesc = t(STATUS_DESC_KEYS[index]) || STATUS_DESCRIPTIONS_DEFAULT[index];

        return (
          <View key={status} style={styles.stepRow}>
            {/* Indicator Column */}
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.nodeCircle,
                  isCompleted && styles.nodeCompleted,
                  isCurrent && styles.nodeCurrent,
                  isFuture && styles.nodeFuture
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : isCurrent ? (
                  <View style={styles.currentInnerDot} />
                ) : (
                  <View style={styles.futureInnerDot} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.connectorLine,
                    isCompleted ? styles.connectorCompleted : styles.connectorFuture
                  ]}
                />
              )}
            </View>

            {/* Label Column */}
            <View style={[styles.labelCol, !isLast && styles.labelColPadding]}>
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.stepTitle,
                    isCompleted && styles.stepTitleCompleted,
                    isCurrent && styles.stepTitleCurrent,
                    isFuture && styles.stepTitleFuture
                  ]}
                >
                  {localizedTitle}
                </Text>
                {isCurrent && (
                  <View style={styles.liveTag}>
                    <Text style={styles.liveTagText}>{t('currentStatusBadge') || 'CURRENT'}</Text>
                  </View>
                )}
              </View>

              {!compact && (
                <Text
                  style={[
                    styles.stepDesc,
                    isCurrent ? styles.stepDescCurrent : styles.stepDescMuted
                  ]}
                >
                  {localizedDesc}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  compactContainer: {
    padding: 12
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  indicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 14
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  nodeCompleted: {
    backgroundColor: colors.success
  },
  nodeCurrent: {
    backgroundColor: colors.primarySubtle,
    borderWidth: 2,
    borderColor: colors.primary
  },
  nodeFuture: {
    backgroundColor: colors.backgroundDark,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  currentInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  futureInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted
  },
  connectorLine: {
    width: 2,
    minHeight: 28,
    flex: 1,
    marginVertical: 2
  },
  connectorCompleted: {
    backgroundColor: colors.success
  },
  connectorFuture: {
    backgroundColor: colors.border
  },
  labelCol: {
    flex: 1
  },
  labelColPadding: {
    paddingBottom: 16
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  stepTitleCompleted: {
    color: colors.successDark,
    fontWeight: '700'
  },
  stepTitleCurrent: {
    color: colors.primary,
    fontWeight: '800'
  },
  stepTitleFuture: {
    color: colors.textMuted
  },
  liveTag: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16
  },
  stepDescCurrent: {
    color: colors.textSecondary
  },
  stepDescMuted: {
    color: colors.textMuted
  }
});

export default BookingStatusStepper;
