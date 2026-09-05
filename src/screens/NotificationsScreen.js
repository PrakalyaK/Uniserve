import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';
import { getLocalizedNotifications } from '../utils/i18nHelper';

export const NotificationsScreen = () => {
  const { t, language } = useUser();
  const notifications = getLocalizedNotifications(language?.code);

  const getIconForType = (type) => {
    switch (type) {
      case 'warranty':
        return { icon: 'shield-checkmark', color: colors.success };
      case 'payment':
        return { icon: 'cash-outline', color: colors.primary };
      case 'security':
        return { icon: 'lock-closed', color: colors.cooperativePurple };
      default:
        return { icon: 'notifications', color: colors.warningDark };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={t('tabNotifications') || 'Notifications'} />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const { icon, color } = getIconForType(item.type);
          return (
            <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
              <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
              </View>
              <View style={styles.contentCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.itemMessage}>{item.message}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
            </View>
          );
        }}
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
    paddingBottom: 30
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  unreadCard: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySubtle
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  contentCol: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight
  },
  itemMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 17
  },
  itemTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6
  }
});

export default NotificationsScreen;
