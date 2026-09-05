import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

export const ProfileScreen = ({ navigation }) => {
  const { user, language, setLanguage, logout, t } = useUser();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('profileSettings') || 'Profile & Settings'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{user?.name ? user.name[0] : 'P'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Priya Sharma'}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone || '9876543210'}</Text>

          <View style={styles.tierBadge}>
            <Ionicons name="ribbon" size={14} color={colors.primary} />
            <Text style={styles.tierText}>{t('silverMember') || 'Cooperative Silver Member'}</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionTitle}>{t('appPreferences') || 'APP PREFERENCES'}</Text>

          {/* Language Selector */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLangModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="globe-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('appLanguage') || 'App Language'}</Text>
                <Text style={styles.menuItemSub}>
                  {language?.name} ({language?.nativeName})
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Edit Profile / Address */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Registration', { phone: user?.phone })}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.menuItemTitle}>{t('savedAddress') || 'Saved Service Address'}</Text>
                <Text style={styles.menuItemSub} numberOfLines={2}>
                  {user?.address || 'Flat 302, Palm Heights, Lajpat Nagar'}
                </Text>
              </View>
            </View>
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Cooperative Assurance Section */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionTitle}>{t('cooperativeAssurance') || 'COOPERATIVE ASSURANCE'}</Text>

          {/* Seva Suraksha Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('SevaSuraksha')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
                <Ionicons name="shield-checkmark" size={18} color={colors.successDark} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('sevaSurakshaGuaranteeHub') || 'Seva Suraksha Guarantee Hub'}</Text>
                <Text style={styles.menuItemSub}>{t('viewResolutionPolicies') || 'View 9 resolution policies'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Grievance Redressal */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Complaint')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>{t('reportIssue') || 'Report a Service Issue'}</Text>
                <Text style={styles.menuItemSub}>{t('coopArbitrationCell') || 'Cooperative arbitration cell'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleOpenLogoutModal}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>{t('signOut') || 'Sign Out of UniServ'}</Text>
        </TouchableOpacity>

        {/* Footer info */}
        <Text style={styles.versionText}>{t('appVersionNote') || 'UniServ Customer App v1.0.0 • Cooperative Certified'}</Text>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        currentLanguage={language}
        onSelectLanguage={(l) => setLanguage(l)}
      />

      {/* Real In-App Logout Confirmation Modal (Works 100% on Web and Native) */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Ionicons name="log-out" size={28} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>{t('signOutModalTitle') || 'Sign Out of UniServ?'}</Text>
            <Text style={styles.modalSub}>
              {t('signOutModalDesc') || 'You will be signed out from this device. Your saved profile, address, and booking history remain securely saved under your mobile number.'}
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelBtnText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmLogout}
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
                <Text style={styles.modalConfirmBtnText}>{t('yesSignOut') || 'Yes, Sign Out'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary
  },
  userPhone: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  menuSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  menuItemSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.dangerLight,
    marginTop: 8,
    marginBottom: 16
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
    marginLeft: 6
  },
  versionText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center'
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modalConfirmBtn: {
    flex: 1.3,
    flexDirection: 'row',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  modalConfirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  }
});

export default ProfileScreen;
