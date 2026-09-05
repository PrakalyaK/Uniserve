import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import { getLocalizedService } from '../utils/i18nHelper';

export const Screen04_ServiceDetail = ({ route, navigation }) => {
  const { service } = route.params || {};
  const { user, language, t } = useUser();

  const currentService = useMemo(
    () => getLocalizedService(service, t, language?.code),
    [service, t, language?.code]
  );

  const hasWarranty = currentService?.has_seva_suraksha !== false;

  const handleBookNow = () => {
    navigation.navigate('BookingForm', { service: currentService, bookingType: 'now' });
  };

  const handleSchedule = () => {
    navigation.navigate('BookingForm', { service: currentService, bookingType: 'scheduled' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={currentService?.name || 'Service Detail'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.iconCircle}>
              <Text style={styles.serviceEmoji}>{currentService?.icon || '🔧'}</Text>
            </View>
            <View style={styles.heroTitleCol}>
              <Text style={styles.serviceName}>{currentService?.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>4.8</Text>
                  <Text style={styles.ratingCount}>(1.2k+ jobs)</Text>
                </View>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.durationText}>{currentService?.duration || '30-45 mins'}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.serviceDesc}>{currentService?.description}</Text>

          {/* Pricing Box */}
          <View style={styles.pricingBox}>
            <View>
              <Text style={styles.pricingLabel}>{t('standardBaseRate')}</Text>
              <Text style={styles.pricingSub}>{t('fixedPricing')}</Text>
            </View>
            <Text style={styles.pricingAmount}>₹{currentService?.start_price || 99}</Text>
          </View>
        </View>

        {/* What's Included */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('whatsIncluded')}</Text>
          <View style={styles.checklist}>
            {(currentService?.included || []).map((item, index) => (
              <View key={index} style={styles.checkRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step-by-Step Process */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t('stepByStep')}</Text>
          <View style={styles.stepsList}>
            {(currentService?.sample_steps || []).map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepNumCircle}>
                  <Text style={styles.stepNumText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Safety & Protocol */}
        <View style={styles.sectionCard}>
          <View style={styles.safetyHeader}>
            <Ionicons name="shield" size={18} color={colors.primary} />
            <Text style={styles.safetyTitle}>{t('safetyProtocol')}</Text>
          </View>
          <Text style={styles.safetyDesc}>
            {currentService?.safety_note || 'All artisans carry registered cooperative ID and follow certified safety guidelines.'}
          </Text>
        </View>

        {/* Conditional Cooperative Guarantee Card */}
        {hasWarranty ? (
          <View style={styles.coopAssuranceCard}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <View style={styles.coopAssuranceTextCol}>
              <Text style={styles.coopAssuranceTitle}>{currentService?.coop_warranty_title || t('coopAssurance')}</Text>
              <Text style={styles.coopAssuranceDesc}>
                {currentService?.coop_warranty_desc || 'Includes 7-day free rework warranty. Standard rate card fixed by Government Registered Cooperative Society.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.coopAssuranceCard, { backgroundColor: colors.primarySubtle }]}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <View style={styles.coopAssuranceTextCol}>
              <Text style={[styles.coopAssuranceTitle, { color: colors.primary }]}>{currentService?.coop_fairwage_title || t('coopAssurance')}</Text>
              <Text style={[styles.coopAssuranceDesc, { color: colors.primaryText }]}>
                {currentService?.coop_fairwage_desc || 'Standardized fair wages fixed by local Women/Labour Cooperative. 80% direct artisan compensation.'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.scheduleBtn} onPress={handleSchedule} activeOpacity={0.8}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={styles.scheduleBtnText}>{t('scheduleLater')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookNowBtn} onPress={handleBookNow} activeOpacity={0.85}>
          <Text style={styles.bookNowBtnText}>{t('bookNow')} • ₹{currentService?.start_price || 99}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 100
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  serviceEmoji: {
    fontSize: 28
  },
  heroTitleCol: {
    flex: 1
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 3
  },
  ratingCount: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 2
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: 4
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  serviceDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16
  },
  pricingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySubtle,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(30, 58, 138, 0.12)'
  },
  pricingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  pricingSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1
  },
  pricingAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12
  },
  checklist: {
    gap: 10
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  checkText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1
  },
  stepsList: {
    gap: 12
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  stepText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    flex: 1
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 8
  },
  safetyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19
  },
  coopAssuranceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.successLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)'
  },
  coopAssuranceTextCol: {
    flex: 1,
    marginLeft: 10
  },
  coopAssuranceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.successDark,
    marginBottom: 2
  },
  coopAssuranceDesc: {
    fontSize: 12,
    color: colors.successDark,
    lineHeight: 17,
    opacity: 0.9
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12
  },
  scheduleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface
  },
  scheduleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6
  },
  bookNowBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary
  },
  bookNowBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen04_ServiceDetail;
