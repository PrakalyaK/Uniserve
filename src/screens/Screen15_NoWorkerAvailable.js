import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export const Screen15_NoWorkerAvailable = ({ route, navigation }) => {
  const { service } = route.params || {};
  const { t } = useUser();

  const handleExpandRadius = () => {
    navigation.navigate('WorkerMatch', { service, expandedRadius: true });
  };

  const handleScheduleSlot = () => {
    navigation.navigate('BookingForm', {
      service,
      bookingType: 'scheduled'
    });
  };

  const handleJoinWaitlist = () => {
    Alert.alert(
      'Priority Waitlist Joined',
      'You are #2 in line for South Delhi Ward. You will receive an instant priority push notification as soon as an artisan finishes their current job.'
    );
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('sevaSurakshaDispatch') || 'Seva Suraksha Dispatch'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Status Hero */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="search" size={32} color={colors.warningDark} />
          </View>
          <Text style={styles.title}>{t('noWorkerAvailable') || 'All Local Artisans Currently Engaged'}</Text>
          <Text style={styles.subtitle}>
            {t('noWorkerSub') || `There are currently no verified ${service?.name || 'specialists'} free within your 1.5 km ward.`}
          </Text>
        </View>

        {/* 3 Resolution Options */}
        <Text style={styles.sectionHeader}>{t('resolutionOptions') || 'PROACTIVE RESOLUTION OPTIONS'}</Text>

        {/* Option 1: Expand Radius */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleExpandRadius}
          activeOpacity={0.8}
        >
          <View style={styles.optionIconCircle}>
            <Ionicons name="map" size={22} color={colors.primary} />
          </View>
          <View style={styles.optionTextCol}>
            <Text style={styles.optionTitle}>{t('expandRadius') || 'Expand Search to 5.0 km'}</Text>
            <Text style={styles.optionDesc}>
              {t('expandRadiusDesc') || 'Search adjacent cooperative clusters (Lajpat Nagar & Nehru Place). ETA ~20–25 mins.'}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* Option 2: Schedule for Later */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleScheduleSlot}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIconCircle, { backgroundColor: colors.successLight }]}>
            <Ionicons name="calendar" size={22} color={colors.successDark} />
          </View>
          <View style={styles.optionTextCol}>
            <Text style={styles.optionTitle}>{t('schedulePrioritySlot') || 'Schedule for Later Today / Tomorrow'}</Text>
            <Text style={styles.optionDesc}>
              {t('schedulePrioritySlotDesc') || 'Lock in guaranteed next available appointment (e.g. Today 05:30 PM).'}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.successDark} />
        </TouchableOpacity>

        {/* Option 3: Priority Waitlist */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleJoinWaitlist}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIconCircle, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="notifications" size={22} color={colors.cooperativePurple} />
          </View>
          <View style={styles.optionTextCol}>
            <Text style={styles.optionTitle}>{t('joinWaitlist') || 'Join Priority Dispatch Waitlist'}</Text>
            <Text style={styles.optionDesc}>
              {t('joinWaitlistDesc') || 'We alert the local cooperative ward supervisor to dispatch the next freed worker immediately.'}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={colors.cooperativePurple} />
        </TouchableOpacity>

        {/* Ward Alert Notice */}
        <View style={styles.wardAlertCard}>
          <Ionicons name="megaphone" size={18} color={colors.primary} />
          <Text style={styles.wardAlertText}>
            {t('wardNoticeText') || 'Notice sent to Local Ward Organiser: High demand detected in local sector.'}
          </Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: '90%'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 12
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  optionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  optionTextCol: {
    flex: 1,
    marginRight: 8
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  optionDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  wardAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10
  },
  wardAlertText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  }
});

export default Screen15_NoWorkerAvailable;
