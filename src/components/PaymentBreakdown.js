import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const PaymentBreakdown = ({ totalAmount = 500 }) => {
  const { t } = useUser();

  const workerWage = (totalAmount * 0.8).toFixed(0);
  const welfare = (totalAmount * 0.1).toFixed(0);
  const coopOps = (totalAmount * 0.06).toFixed(0);
  const platform = (totalAmount * 0.04).toFixed(0);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('whereMoneyWent')}</Text>

      {/* Segmented Color Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.barSegment, { flex: 80, backgroundColor: colors.success }]} />
        <View style={[styles.barSegment, { flex: 10, backgroundColor: colors.warningDark }]} />
        <View style={[styles.barSegment, { flex: 6, backgroundColor: colors.cooperativePurple }]} />
        <View style={[styles.barSegment, { flex: 4, backgroundColor: colors.primary }]} />
      </View>

      {/* Legend Rows */}
      <View style={styles.legendContainer}>
        {/* 80% Worker Direct Wage */}
        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendLabel}>{t('workerWage')} (80%)</Text>
          </View>
          <Text style={[styles.legendAmount, { color: colors.successDark }]}>₹{workerWage}</Text>
        </View>

        {/* 10% Worker Welfare & Health Fund */}
        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: colors.warningDark }]} />
            <Text style={styles.legendLabel}>{t('workerWelfare')} (10%)</Text>
          </View>
          <Text style={styles.legendAmount}>₹{welfare}</Text>
        </View>

        {/* 6% Cooperative Society Operations */}
        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: colors.cooperativePurple }]} />
            <Text style={styles.legendLabel}>{t('coopOps')} (6%)</Text>
          </View>
          <Text style={styles.legendAmount}>₹{coopOps}</Text>
        </View>

        {/* 4% Platform & Seva Suraksha Guarantee Pool */}
        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendLabel}>{t('platformFee')} (4%)</Text>
          </View>
          <Text style={styles.legendAmount}>₹{platform}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12
  },
  progressBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16
  },
  barSegment: {
    height: '100%'
  },
  legendContainer: {
    gap: 10
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500'
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  }
});

export default PaymentBreakdown;
