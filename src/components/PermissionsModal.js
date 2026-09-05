import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const PermissionsModal = ({
  visible,
  onClose,
  onGrantAll,
  permissions = {},
  onTogglePermission
}) => {
  const { t } = useUser();

  const PERMISSION_ITEMS = [
    {
      id: 'location',
      icon: 'location',
      color: '#3B82F6',
      title: t('permLocationTitle') || 'Precise Location Access',
      tag: t('permLocationTag') || 'DISPATCH & GPS',
      desc: t('permLocationDesc') || 'Dispatches the closest KYC-verified cooperative artisan to your exact doorstep and enables live tracking.'
    },
    {
      id: 'camera',
      icon: 'camera',
      color: '#10B981',
      title: t('permCameraTitle') || 'Camera Access',
      tag: t('permCameraTag') || 'INCIDENT CAPTURE',
      desc: t('permCameraDesc') || 'Take instant diagnostic photos and short video clips of the leaking pipe, spark, stain, or repair area.'
    },
    {
      id: 'microphone',
      icon: 'mic',
      color: '#F59E0B',
      title: t('permMicTitle') || 'Microphone Access',
      tag: t('permMicTag') || 'VOICE NOTES',
      desc: t('permMicDesc') || 'Record audio voice notes to clearly describe complex household problems with live AI transcription.'
    },
    {
      id: 'media',
      icon: 'images',
      color: '#8B5CF6',
      title: t('permMediaTitle') || 'Media & Photo Library Access',
      tag: t('permMediaTag') || 'ATTACHMENTS',
      desc: t('permMediaDesc') || 'Select and attach existing photos, videos, or architectural blueprints from your phone gallery.'
    }
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.shieldIconCircle}>
              <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.govTagRow}>
                <Text style={styles.govTag}>{t('ministryCooperationTag') || 'MINISTRY OF COOPERATION • NCCT'}</Text>
              </View>
              <Text style={styles.title}>{t('hardwarePermissionsTitle') || 'Service & Hardware Permissions'}</Text>
              <Text style={styles.subtitle}>
                {t('hardwarePermissionsSub') || 'UniServ requires standard device access to deliver certified cooperative doorstep assistance.'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
            {PERMISSION_ITEMS.map((item) => {
              const isEnabled = Boolean(permissions?.[item.id]);
              return (
                <View key={item.id} style={styles.permRow}>
                  <View style={[styles.permIconBox, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <View style={styles.permTextCol}>
                    <View style={styles.permHeaderRow}>
                      <Text style={styles.permTitle}>{item.title}</Text>
                      <View style={[styles.permTagPill, { backgroundColor: item.color + '15' }]}>
                        <Text style={[styles.permTagText, { color: item.color }]}>{item.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.permDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={(val) => onTogglePermission && onTogglePermission(item.id, val)}
                    trackColor={{ false: colors.border, true: colors.primaryLight }}
                    thumbColor={isEnabled ? colors.primary : '#FFFFFF'}
                  />
                </View>
              );
            })}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.grantAllBtn}
              onPress={onGrantAll}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.grantAllBtnText}>{t('allowAllPermissions') || 'Allow All Permissions & Continue'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.customBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.customBtnText}>{t('savePreferencesContinue') || 'Save Preferences / Continue'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end'
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  shieldIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  govTagRow: {
    marginBottom: 2
  },
  govTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginTop: 3
  },
  itemsList: {
    marginVertical: 4
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  permIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  permTextCol: {
    flex: 1,
    marginRight: 8
  },
  permHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  permTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  permTagPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  permTagText: {
    fontSize: 8,
    fontWeight: '800'
  },
  permDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    marginTop: 2
  },
  actionButtons: {
    marginTop: 10,
    gap: 8
  },
  grantAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  grantAllBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  customBtn: {
    alignItems: 'center',
    paddingVertical: 10
  },
  customBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  }
});

export default PermissionsModal;
