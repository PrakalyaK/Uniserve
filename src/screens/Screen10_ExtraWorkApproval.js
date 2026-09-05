import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export const Screen10_ExtraWorkApproval = ({ navigation }) => {
  const { activeBooking, approveExtraWork, declineExtraWork } = useBooking();
  const { t } = useUser();

  const serviceExtra = activeBooking?.service?.extra_work || {
    title: 'Precision Component Replacement',
    amount: 150,
    description: 'The technician identified an internal part needing replacement during physical inspection.',
    photo: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80'
  };

  const basePrice = activeBooking?.base_amount || activeBooking?.total_amount || 350;
  const extraAmount = serviceExtra.amount;
  const newTotal = basePrice + extraAmount;

  const handleApprove = () => {
    approveExtraWork({
      title: serviceExtra.title,
      description: serviceExtra.description,
      amount: extraAmount,
      photo: serviceExtra.photo
    });
    navigation.navigate('JobInProgress');
  };

  const handleDecline = () => {
    declineExtraWork();
    navigation.navigate('JobInProgress');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('scopeAdditionReview') || 'Scope Addition Review'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Urgent Scope Addition Alert Header */}
        <View style={styles.alertHeader}>
          <View style={styles.alertIconCircle}>
            <Ionicons name="construct" size={26} color={colors.warningDark} />
          </View>
          <Text style={styles.alertTitle}>{t('extraWorkTitle')}</Text>
          <Text style={styles.alertSub}>{t('extraWorkSub')}</Text>
        </View>

        {/* Category-Specific Requested Add-on Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>{t('requestedAddon')}</Text>
          <View style={styles.addonTitleRow}>
            <Text style={styles.addonTitle}>{serviceExtra.title}</Text>
            <Text style={styles.addonCost}>+₹{extraAmount}</Text>
          </View>
          <Text style={styles.addonDesc}>{serviceExtra.description}</Text>

          {/* Inspection Proof Image */}
          <Text style={[styles.cardSectionLabel, { marginTop: 14 }]}>{t('artisanInspectionPhoto') || 'ARTISAN INSPECTION PHOTO'}</Text>
          <View style={styles.photoBox}>
            <Image
              source={{ uri: serviceExtra.photo }}
              style={styles.inspectionPhoto}
            />
            <View style={styles.verifiedPhotoBadge}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
              <Text style={styles.verifiedPhotoText}>{t('capturedOnSite') || 'Captured on-site during inspection'}</Text>
            </View>
          </View>
        </View>

        {/* Revised Pricing Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>{t('revisedBreakdown')}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('baseServiceDiagnosis') || 'Base Service & Diagnosis'}</Text>
            <Text style={styles.priceVal}>₹{basePrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{serviceExtra.title}</Text>
            <Text style={[styles.priceVal, { color: colors.warningDark }]}>+₹{extraAmount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('newRevisedTotal') || 'New Revised Total'}</Text>
            <Text style={styles.totalVal}>₹{newTotal}</Text>
          </View>
        </View>

        {/* Cooperative Transparency Rule */}
        <View style={styles.ruleBanner}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
          <Text style={styles.ruleText}>
            <Text style={{ fontWeight: '800' }}>{t('coopTransparencyRule') || 'Cooperative Transparency Rule'}:</Text> {t('transparencyRuleDesc') || 'Artisans are prohibited from requesting offline cash. All additional scope must be authorized through the UniServ app.'}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={handleApprove}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.approveBtnText}>
            {t('approveContinue')} (₹{newTotal})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declineBtn}
          onPress={handleDecline}
          activeOpacity={0.8}
        >
          <Text style={styles.declineBtnText}>{t('declineScope')}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 130
  },
  alertHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  alertIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  alertSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    maxWidth: '90%'
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
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
  cardSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8
  },
  addonTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  addonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1
  },
  addonCost: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.warningDark
  },
  addonDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17
  },
  photoBox: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4
  },
  inspectionPhoto: {
    width: '100%',
    height: 140,
    borderRadius: 12
  },
  verifiedPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  verifiedPhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  priceLabel: {
    fontSize: 13,
    color: colors.textSecondary
  },
  priceVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  ruleText: {
    fontSize: 11,
    color: colors.primary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  approveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  declineBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  }
});

export default Screen10_ExtraWorkApproval;
