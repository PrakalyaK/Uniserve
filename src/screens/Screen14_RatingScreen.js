import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

import { getLocalizedRatingTags } from '../utils/i18nHelper';
import { getFallbackWorkerForTrade } from '../utils/locationService';

export const Screen14_RatingScreen = ({ route, navigation }) => {
  const { activeBooking, pastBookings, submitRating } = useBooking();
  const { language, t } = useUser();
  const booking = activeBooking || route?.params?.booking || pastBookings?.[0];
  const fallbackWorker = getFallbackWorkerForTrade(booking?.service);
  const worker = booking?.worker || fallbackWorker;

  const TAGS = getLocalizedRatingTags(language?.code || language);

  const [rating, setRating] = useState(5);
  const [selectedTagIds, setSelectedTagIds] = useState(TAGS.slice(0, 2).map((tg) => tg.id));
  const [reviewText, setReviewText] = useState(t('sampleReview') || 'Excellent work. Solved the issue cleanly.');

  const toggleTag = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = () => {
    try {
      const selectedLabels = TAGS.filter((tg) => selectedTagIds.includes(tg.id)).map((tg) => tg.text);
      if (typeof submitRating === 'function') {
        submitRating(rating, selectedLabels, reviewText);
      }
    } catch (err) {
      console.warn('Rating submit error:', err);
    }

    Alert.alert(
      t('ratingSuccessTitle') || 'Rating & Handover Completed',
      booking?.is_bulk_project
        ? 'Thank you! The cooperative artisan squad has received your official handover rating. 30-Day Seva Suraksha warranty is active.'
        : 'Thank you for rating your cooperative artisan!'
    );
    
    // Cleanly redirect back to Home Tab
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }]
    });
  };

  const getRatingLabel = (stars) => {
    switch (stars) {
      case 5:
        return t('rating5') || 'Outstanding Service! 🌟';
      case 4:
        return t('rating4') || 'Great Experience! 👍';
      case 3:
        return t('rating3') || 'Average Service 😐';
      case 2:
        return t('rating2') || 'Needs Improvement ⚠️';
      default:
        return t('rating1') || 'Poor Experience ❌';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('rateReview') || 'Rate & Review'}
        showBack
        onBack={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Worker Summary Hero */}
        <View style={styles.workerHero}>
          {booking?.is_bulk_project && (
            <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={booking?.client_type === 'institutional' ? 'school' : 'business'} size={14} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, marginLeft: 5 }}>
                {booking?.client_type === 'institutional' ? 'CAMPUS CONTRACT SIGN-OFF' : 'COMMUNITY BULK SIGN-OFF'}
              </Text>
            </View>
          )}
          <Image
            source={{
              uri: booking?.is_bulk_project
                ? (booking?.artisan_squad?.[0]?.photo || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=300&q=80')
                : (worker?.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&q=80')
            }}
            style={styles.workerPhoto}
          />
          <Text style={styles.workerName}>
            {booking?.is_bulk_project
              ? (booking.institution_name || booking.society_name || booking.scale_label || 'Campus Infrastructure Squad')
              : (worker?.name || fallbackWorker?.name || 'Cooperative Artisan')}
          </Text>
          <Text style={styles.workerSociety}>
            {booking?.is_bulk_project
              ? `${booking.service?.name || 'Bulk Service'} • ${booking.cooperative_name || 'Labour Cooperative'} • ${booking.crew_size || 4} Certified Master Artisans`
              : (worker?.cooperative || t('delhiLabourCooperative') || 'Delhi Labour Cooperative')}
          </Text>
        </View>

        {/* 5-Star Selector Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingCardTitle}>{t('howWasExperience') || 'How was your service experience?'}</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={star <= rating ? '#F59E0B' : colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingLabelText}>{getRatingLabel(rating)}</Text>
        </View>

        {/* Compliment Tags Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('whatDidYouLikeMost') || 'WHAT DID YOU LIKE MOST?'}</Text>
          <View style={styles.tagsContainer}>
            {TAGS.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.tagPill, isSelected && styles.tagPillSelected]}
                  onPress={() => toggleTag(tag.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                    {tag.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Written Review */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('writeReview')}</Text>
          <TextInput
            style={styles.textArea}
            value={reviewText}
            onChangeText={setReviewText}
            placeholder={t('shareExperiencePlaceholder') || 'Share your experience to help the cooperative...'}
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>{t('submitReview')}</Text>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
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
    paddingBottom: 110
  },
  workerHero: {
    alignItems: 'center',
    marginBottom: 18
  },
  workerPhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceSecondary,
    marginBottom: 10
  },
  workerName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary
  },
  workerSociety: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  ratingCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10
  },
  starTouch: {
    padding: 2
  },
  ratingLabelText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tagPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  tagPillSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryLight
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  tagTextSelected: {
    color: colors.primary,
    fontWeight: '700'
  },
  textArea: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen14_RatingScreen;
