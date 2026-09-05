import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const Header = ({
  onLocationPress,
  onEmergencyPress,
  onLanguagePress,
  showEmergency = false,
  title,
  showBack = false,
  onBack
}) => {
  const { user, language, t } = useUser();

  return (
    <View style={styles.header}>
      {showBack ? (
        <View style={styles.backRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={onLocationPress}
          activeOpacity={0.75}
        >
          <View style={styles.pinCircle}>
            <Ionicons name="location-sharp" size={18} color={colors.primary} />
          </View>
          <View style={styles.addressTextContainer}>
            <View style={styles.locationLabelRow}>
              <Text style={styles.locationLabel}>
                {user?.addressTag === 'Work' ? t('locationWork') : (user?.addressTag === 'Other' ? t('locationOther') : t('locationHome'))}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.textPrimary} />
            </View>
            <Text style={styles.addressLine} numberOfLines={1}>
              {user?.address || 'Flat 302, Palm Heights, Block B, Lajpat Nagar'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Right Actions: Language Badge & Optional Emergency Button */}
      <View style={styles.rightActions}>
        {onLanguagePress && (
          <TouchableOpacity
            style={styles.languageBadge}
            onPress={onLanguagePress}
            activeOpacity={0.75}
          >
            <Ionicons name="globe-outline" size={14} color={colors.primary} />
            <Text style={styles.languageText}>
              {language?.code?.toUpperCase() || 'EN'}
            </Text>
          </TouchableOpacity>
        )}

        {showEmergency && onEmergencyPress && (
          <TouchableOpacity
            style={styles.sosButton}
            onPress={onEmergencyPress}
            activeOpacity={0.8}
          >
            <Ionicons name="flash" size={13} color="#FFFFFF" />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  backButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  pinCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  addressTextContainer: {
    flex: 1
  },
  locationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginRight: 4
  },
  addressLine: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  languageText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 4
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  sosText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    marginLeft: 3,
    letterSpacing: 0.5
  }
});

export default Header;
