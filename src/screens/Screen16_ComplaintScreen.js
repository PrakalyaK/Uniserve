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
import MediaCaptureModal from '../components/MediaCaptureModal';

import { getLocalizedComplaintCategories } from '../utils/i18nHelper';

export const Screen16_ComplaintScreen = ({ route, navigation }) => {
  const { preselectedCategory, bookingId } = route.params || {};
  const { fileComplaint } = useBooking();
  const { language, t } = useUser();

  const COMPLAINT_CATEGORIES = getLocalizedComplaintCategories(language?.code || language);

  const [selectedCategory, setSelectedCategory] = useState(
    preselectedCategory || COMPLAINT_CATEGORIES[2]?.label || 'Poor work quality / recurring leak'
  );
  const [explanation, setExplanation] = useState(
    t('sampleComplaintExp') || 'The issue is still persisting after the repair was completed.'
  );
  const [proofImage, setProofImage] = useState(null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = () => {
    if (!explanation.trim()) {
      Alert.alert(t('detailsRequired') || 'Details Required', t('provideExplanation') || 'Please provide a brief explanation for the dispute officer.');
      return;
    }

    const complaint = fileComplaint({
      category: selectedCategory,
      explanation,
      photo: proofImage,
      booking_id: bookingId || 'BK84920'
    });

    setSubmittedTicket(complaint);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('grievanceCell') || 'Grievance Cell'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!submittedTicket ? (
          <View>
            {/* Header Box */}
            <View style={styles.headerHero}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-alert" size={28} color={colors.danger} />
              </View>
              <Text style={styles.title}>{t('submitComplaint')}</Text>
              <Text style={styles.subtitle}>
                {t('guaranteedResolution') || 'Assigned directly to an impartial Cooperative Ward Officer. 24-hour guaranteed resolution.'}
              </Text>
            </View>

            {/* Complaint Categories */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>{t('selectDisputeCategory') || 'SELECT DISPUTE CATEGORY'}</Text>
              <View style={styles.categoriesList}>
                {COMPLAINT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catRow, isSelected && styles.catRowSelected]}
                      onPress={() => setSelectedCategory(cat.label)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.catText, isSelected && styles.catTextSelected]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Explanation Area */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>{t('detailedExplanation') || 'DETAILED EXPLANATION'}</Text>
              <TextInput
                style={styles.textArea}
                value={explanation}
                onChangeText={setExplanation}
                placeholder={t('describeWhatHappened') || 'Describe what happened so the arbitration board can review...'}
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Attach Evidence */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>{t('attachPhotoEvidence') || 'ATTACH PHOTO EVIDENCE (OPTIONAL)'}</Text>
              {proofImage ? (
                <View style={styles.imageWrap}>
                  <Image source={{ uri: proofImage }} style={styles.previewImg} />
                  <TouchableOpacity
                    style={styles.removeImgBtn}
                    onPress={() => setProofImage(null)}
                  >
                    <Ionicons name="close-circle" size={24} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() => setMediaModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="camera-outline" size={22} color={colors.primary} />
                  <Text style={styles.uploadBtnText}>{t('captureUploadEvidence') || 'Capture or Upload Photo Evidence'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 7-Day Free Rework Assurance */}
            <View style={styles.warrantyBox}>
              <Ionicons name="shield-checkmark" size={18} color={colors.success} />
              <Text style={styles.warrantyText}>
                {t('sevaSurakshaAssurance') || 'Under Seva Suraksha, valid workmanship complaints receive a free revisit by a senior technician or 100% refund.'}
              </Text>
            </View>

            {/* Submit Action */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>{t('submitComplaintBtn') || 'Submit Complaint to Cooperative'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Live Grievance Redressal Status Tracker */
          <View style={styles.trackerCard}>
            <View style={styles.ticketSuccessHeader}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.trackerTitle}>{t('complaintRegistered') || 'Complaint Registered Successfully'}</Text>
              <Text style={styles.trackerTicketId}>{t('ticket') || 'Ticket'} #{submittedTicket.id}</Text>
            </View>

            {/* 5-Step Grievance Timeline */}
            <Text style={styles.timelineLabel}>{t('grievanceTimeline')}</Text>
            <View style={styles.timelineList}>
              {[
                { title: t('complaintReceived') || 'Complaint Received', done: true, desc: t('loggedCoopLedger') || 'Logged on cooperative ledger' },
                { title: t('arbitrationOfficerAssigned') || 'Arbitration Officer Assigned', done: true, desc: t('officerAssignedDesc') || 'Officer: Ramesh Varma (South Delhi Ward)' },
                { title: t('verificationReview') || 'Artisan & Customer Verification', done: false, desc: t('evidenceReviewDesc') || 'Evidence under review' },
                { title: t('resolutionOffered') || 'Resolution Offered', done: false, desc: t('resolutionOfferedDesc') || 'Free doorstep rework or refund' },
                { title: t('ticketClosed') || 'Ticket Closed', done: false, desc: t('pendingResolutionDesc') || 'Pending resolution acceptance' }
              ].map((step, index) => (
                <View key={index} style={styles.timelineStepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View style={[styles.stepCircle, step.done && styles.stepCircleDone]}>
                      <Ionicons
                        name={step.done ? 'checkmark' : 'ellipse'}
                        size={step.done ? 12 : 6}
                        color={step.done ? '#FFFFFF' : colors.textMuted}
                      />
                    </View>
                    {index < 4 && <View style={[styles.stepLine, step.done && styles.stepLineDone]} />}
                  </View>
                  <View style={styles.stepInfoCol}>
                    <Text style={[styles.stepTitle, step.done && styles.stepTitleDone]}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>{t('returnToHomeHub') || 'Return to Home'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Camera / Gallery Modal */}
      <MediaCaptureModal
        visible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        onImageSelected={(uri) => setProofImage(uri)}
      />
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
  headerHero: {
    alignItems: 'center',
    marginBottom: 20
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  subtitle: {
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
    marginBottom: 14
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  categoriesList: {
    gap: 8
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border
  },
  catRowSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primaryLight
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  radioCircleSelected: {
    borderColor: colors.primary
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  catText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1
  },
  catTextSelected: {
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
    minHeight: 80
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden'
  },
  previewImg: {
    width: '100%',
    height: 140,
    borderRadius: 12
  },
  removeImgBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    borderStyle: 'dashed'
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 16
  },
  warrantyText: {
    fontSize: 11,
    color: colors.successDark,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  },
  trackerCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  ticketSuccessHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  trackerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary
  },
  trackerTicketId: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 14
  },
  timelineList: {
    gap: 4,
    marginBottom: 20
  },
  timelineStepRow: {
    flexDirection: 'row'
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 28,
    marginRight: 10
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepCircleDone: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  stepLine: {
    width: 2,
    height: 34,
    backgroundColor: colors.border
  },
  stepLineDone: {
    backgroundColor: colors.success
  },
  stepInfoCol: {
    flex: 1,
    paddingBottom: 16
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  stepTitleDone: {
    color: colors.textPrimary
  },
  stepDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});

export default Screen16_ComplaintScreen;
