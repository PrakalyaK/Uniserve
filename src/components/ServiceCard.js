import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { getLocalizedServiceName } from '../utils/i18nHelper';

export const ServiceCard = ({ service, onPress }) => {
  const { t, language } = useUser();
  const localizedName = getLocalizedServiceName(service, t, language?.code);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(service)}
      activeOpacity={0.75}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{service.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {localizedName}
        </Text>
        <Text style={styles.priceText}>
          {t('fromPrice')} <Text style={styles.priceHighlight}>₹{service.start_price}</Text>
        </Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.verifiedTag}>
          <Ionicons name="shield-checkmark" size={11} color={colors.successDark} />
          <Text style={styles.verifiedText}>{t('verified')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 140
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  iconText: {
    fontSize: 24
  },
  content: {
    marginBottom: 8
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2
  },
  priceText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  priceHighlight: {
    fontWeight: '700',
    color: colors.primary
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 3
  }
});

export default ServiceCard;
