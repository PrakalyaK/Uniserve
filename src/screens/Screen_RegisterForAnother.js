import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { fetchRealDoorstepLocation, getHyperLocalCooperative } from '../utils/locationService';

const INDIAN_LANGUAGES = [
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil' },
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi' },
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi' }
];

export const Screen_RegisterForAnother = ({ navigation }) => {
  const { user, registerAnotherUser, t } = useUser();

  // Wizard Steps: 1 = Mobile & OTP, 2 = Citizen Details & Address, 3 = Success & Toll-Free Card
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Mobile & OTP State
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputsRef = useRef([]);

  // Step 2: Citizen Details & Address State
  const [name, setName] = useState('');
  const [selectedLang, setSelectedLang] = useState(INDIAN_LANGUAGES[0]); // Default Tamil
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 3: Success Registered Profile Data
  const [registeredCitizen, setRegisteredCitizen] = useState(null);

  // Handle Send OTP
  const handleSendOtp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number for the citizen.');
      return;
    }

    // Generate simulated 4-digit OTP
    const mockOtp = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(mockOtp);
    setIsOtpSent(true);
    setEnteredOtp(['', '', '', '']);
  };

  // Handle OTP Digit Input
  const handleOtpChange = (text, index) => {
    const newOtp = [...enteredOtp];
    newOtp[index] = text;
    setEnteredOtp(newOtp);

    // Auto focus next box
    if (text && index < 3 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Auto-Fill Demo OTP
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setEnteredOtp(digits);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    const entered = enteredOtp.join('');
    if (entered.length !== 4) {
      Alert.alert('Incomplete OTP', 'Please enter all 4 digits of the OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      if (entered === generatedOtp || entered === '1234') {
        setCurrentStep(2);
      } else {
        Alert.alert('Incorrect OTP', 'The OTP entered does not match. Please check or tap Auto-Fill for demo.');
      }
    }, 600);
  };

  // Auto-fill GPS address
  const handleGpsAutoFill = async () => {
    setIsGpsLoading(true);
    try {
      const loc = await fetchRealDoorstepLocation();
      if (loc.success) {
        setLocality(loc.locality || '');
        setCity(loc.city || '');
        setDistrict(loc.district || loc.city || '');
        setStateName(loc.stateName || 'Tamil Nadu');
        setPincode(loc.pincode || '');
        if (loc.landmark) {
          setLandmark(loc.landmark);
        }
        setIsGpsLoading(false);
        Alert.alert('GPS Location Locked 📍', `Detected: ${loc.locality}, ${loc.city}`);
      }
    } catch (err) {
      setIsGpsLoading(false);
      Alert.alert('GPS Notice', 'Unable to auto-acquire GPS. Please type the village / town address manually.');
    }
  };

  // Handle Step 2 Complete Registration
  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', "Please enter the citizen's full name.");
      return;
    }
    if (!locality.trim() || !city.trim()) {
      Alert.alert('Address Required', 'Please provide the village/locality and town/city for accurate artisan dispatch.');
      return;
    }

    setIsSubmitting(true);

    const fullAddress = [
      house.trim(),
      street.trim(),
      locality.trim(),
      city.trim(),
      district.trim() && district.trim() !== city.trim() ? district.trim() : null,
      stateName.trim(),
      pincode.trim() ? `- ${pincode.trim()}` : null
    ].filter(Boolean).join(', ');

    const citizenData = {
      phone: phone.replace(/[^0-9]/g, ''),
      name: name.trim(),
      language: selectedLang.code,
      languageName: `${selectedLang.name} (${selectedLang.englishName})`,
      address: fullAddress,
      house: house.trim(),
      street: street.trim(),
      locality: locality.trim(),
      city: city.trim(),
      district: district.trim() || city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      landmark: landmark.trim()
    };

    const res = await registerAnotherUser(citizenData);

    setIsSubmitting(false);

    if (res.success) {
      setRegisteredCitizen(res.citizen);
      setCurrentStep(3);
    } else {
      Alert.alert('Registration Failed', res.error || 'Please check the details and try again.');
    }
  };

  // Reset to register another person
  const handleResetForAnother = () => {
    setCurrentStep(1);
    setPhone('');
    setGeneratedOtp('');
    setEnteredOtp(['', '', '', '']);
    setIsOtpSent(false);
    setName('');
    setHouse('');
    setStreet('');
    setLocality('');
    setCity('');
    setDistrict('');
    setPincode('');
    setLandmark('');
    setRegisteredCitizen(null);
  };

  // Matched cooperative for the registered citizen
  const citizenCoop = registeredCitizen ? getHyperLocalCooperative(registeredCitizen.address) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>{t('registerAnotherCitizen')}</Text>
          <Text style={styles.headerSub}>{t('esevaiPortalSub')}</Text>
        </View>
        <View style={styles.esevaiBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#10B981" />
          <Text style={styles.esevaiBadgeText}>E-Sevai</Text>
        </View>
      </View>

      {/* Wizard Progress Stepper */}
      <View style={styles.stepperContainer}>
        <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, currentStep >= 1 && styles.stepDotTextActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, currentStep >= 2 && styles.stepDotTextActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
        <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, currentStep >= 3 && styles.stepDotTextActive]}>3</Text>
        </View>
      </View>
      <View style={styles.stepLabelsRow}>
        <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>{t('stepMobileOtp')}</Text>
        <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>{t('stepCitizenDetails')}</Text>
        <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>{t('stepIvrsCard')}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ========================================================================= */}
          {/* STEP 1: MOBILE & OTP VERIFICATION */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <View style={styles.stepBox}>
              {/* Mission Banner */}
              <View style={styles.infoBanner}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="call" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.infoBannerTitle}>{t('assistingBannerTitle') || 'Assisting a Button Phone / Rural User'}</Text>
                  <Text style={styles.infoBannerText}>
                    {t('assistingBannerText') || 'Register their mobile number & doorstep address once. Afterwards, they can simply call Toll-Free 1800-890-UNISERV from their button mobile to book certified artisans without an app!'}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionHeader}>{t('enterCitizenMobile') || "Enter Citizen's Mobile Number"}</Text>
              <Text style={styles.inputHelper}>{t('buttonMobileHelper') || 'The phone number on their basic button mobile'}</Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.flagText}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="98421 54321"
                  placeholderTextColor={colors.textLight}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  editable={!isOtpSent}
                />
                {isOtpSent && (
                  <TouchableOpacity
                    style={styles.changePhoneBtn}
                    onPress={() => setIsOtpSent(false)}
                  >
                    <Text style={styles.changePhoneText}>{t('changeNumber') || 'Change'}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {!isOtpSent ? (
                <TouchableOpacity
                  style={[styles.primaryBtn, phone.length < 10 && styles.btnDisabled]}
                  onPress={handleSendOtp}
                  disabled={phone.length < 10}
                  activeOpacity={0.85}
                >
                  <Ionicons name="paper-plane" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryBtnText}>{t('sendOtp') || 'Send Verification OTP'}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.otpSection}>
                  {/* Simulated SMS Alert Banner */}
                  <View style={styles.mockSmsCard}>
                    <View style={styles.mockSmsHeader}>
                      <Ionicons name="chatbox-ellipses" size={16} color="#059669" />
                      <Text style={styles.mockSmsTitle}>{t('simulatedSmsTitle') || "Simulated SMS Received on Citizen's Phone"}</Text>
                    </View>
                    <Text style={styles.mockSmsBody}>
                      "UniServ: Your registration OTP is <Text style={{ fontWeight: '900', color: '#059669' }}>{generatedOtp}</Text>. Valid for 10 minutes."
                    </Text>
                    <TouchableOpacity style={styles.autoFillBtn} onPress={handleAutoFillOtp}>
                      <Ionicons name="flash" size={14} color="#059669" />
                      <Text style={styles.autoFillText}>{t('autoFillOtpPrompt') || 'Tap to Auto-Fill OTP'}: {generatedOtp}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.otpLabel}>{t('enterOtp') || 'Enter 4-Digit OTP'}</Text>
                  <View style={styles.otpInputsRow}>
                    {[0, 1, 2, 3].map((idx) => (
                      <TextInput
                        key={idx}
                        ref={(ref) => (otpInputsRef.current[idx] = ref)}
                        style={[styles.otpBox, enteredOtp[idx] && styles.otpBoxFilled]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={enteredOtp[idx]}
                        onChangeText={(text) => handleOtpChange(text, idx)}
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleVerifyOtp}
                    disabled={isVerifyingOtp}
                    activeOpacity={0.85}
                  >
                    {isVerifyingOtp ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryBtnText}>{t('verifyOtpContinue') || 'Verify OTP & Continue'}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CITIZEN PROFILE & DOORSTEP ADDRESS */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <View style={styles.stepBox}>
              <View style={styles.verifiedNumberBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.verifiedNumberText}>Verified Number: +91 {phone}</Text>
              </View>

              <Text style={styles.sectionHeader}>{t('citizenDetailsTitle') || 'Citizen Details'}</Text>

              <Text style={styles.fieldLabel}>{t('citizenFullNameLabel') || 'Full Name of the Citizen *'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Muthuvel K. / Saraswathi Ammal"
                placeholderTextColor={colors.textLight}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.fieldLabel}>{t('voiceLanguagePrefLabel') || 'Preferred Language for Voice IVRS *'}</Text>
              <Text style={styles.inputHelper}>{t('voiceBotSpeaksHelper') || 'The Toll-Free voice bot will speak to them in this language'}</Text>
              <View style={styles.langGrid}>
                {INDIAN_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[styles.langChip, isSelected && styles.langChipActive]}
                      onPress={() => setSelectedLang(lang)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.langChipNative, isSelected && styles.langChipTextActive]}>
                        {lang.name}
                      </Text>
                      <Text style={[styles.langChipEnglish, isSelected && styles.langChipTextActive]}>
                        {lang.englishName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.divider} />

              <View style={styles.addressHeaderRow}>
                <View>
                  <Text style={styles.sectionHeader}>{t('doorstepAddressTitle') || 'Doorstep Service Address'}</Text>
                  <Text style={styles.inputHelper}>{t('artisanArrivalHelper') || 'Where the cooperative artisan should arrive'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.gpsButton}
                  onPress={handleGpsAutoFill}
                  disabled={isGpsLoading}
                  activeOpacity={0.8}
                >
                  {isGpsLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Ionicons name="navigate" size={14} color={colors.primary} />
                      <Text style={styles.gpsButtonText}>{t('autoGps') || 'Auto GPS'}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>{t('flatDoorLabel') || 'House / Door No. & Building'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Door No. 14 / Plot 22"
                placeholderTextColor={colors.textLight}
                value={house}
                onChangeText={setHouse}
              />

              <Text style={styles.fieldLabel}>{t('streetLabel') || 'Street / Ward / Area'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Middle Street / Gandhi Nagar 2nd Cross"
                placeholderTextColor={colors.textLight}
                value={street}
                onChangeText={setStreet}
              />

              <View style={styles.twoColRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.fieldLabel}>{t('villageLocalityLabel') || 'Village / Locality *'}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Alanganallur"
                    placeholderTextColor={colors.textLight}
                    value={locality}
                    onChangeText={setLocality}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.fieldLabel}>{t('townCityLabel') || 'Town / City *'}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Madurai"
                    placeholderTextColor={colors.textLight}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
              </View>

              <View style={styles.twoColRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.fieldLabel}>{t('districtLabel') || 'District'}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Madurai District"
                    placeholderTextColor={colors.textLight}
                    value={district}
                    onChangeText={setDistrict}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.fieldLabel}>{t('pincodeLabel') || 'Pincode'}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 625501"
                    placeholderTextColor={colors.textLight}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>{t('landmarkHelperLabel') || 'Nearby Landmark (Crucial for rural navigation)'}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Opposite Mariamman Temple / Near Panchayat Office"
                placeholderTextColor={colors.textLight}
                value={landmark}
                onChangeText={setLandmark}
              />

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleCompleteRegistration}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnText}>{t('saveGenerateIvrsCard') || 'Save & Generate Citizen IVRS Card'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: SUCCESS & TOLL-FREE CITIZEN CARD */}
          {/* ========================================================================= */}
          {currentStep === 3 && registeredCitizen && (
            <View style={styles.stepBox}>
              <View style={styles.successCelebration}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-done" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>{t('citizenRegSuccessTitle') || 'Citizen Registration Successful! 🎉'}</Text>
                <Text style={styles.successSub}>
                  {registeredCitizen.name} {t('citizenRegSuccessSub') || 'is now registered in the National Cooperative Database.'}
                </Text>
              </View>

              {/* 🪪 Digital Citizen IVRS Toll-Free Card */}
              <View style={styles.citizenCard}>
                <View style={styles.citizenCardHeader}>
                  <View style={styles.cardGovIcon}>
                    <Ionicons name="ribbon" size={18} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.cardGovTitle}>{t('uniservCoopFederation') || 'UNISERV COOPERATIVE FEDERATION'}</Text>
                    <Text style={styles.cardGovSub}>{t('nationalRuralCardSub') || 'National Rural & Urban Voice Booking Card'}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardFieldRow}>
                    <Text style={styles.cardLabel}>{t('citizenNameTag') || 'CITIZEN NAME:'}</Text>
                    <Text style={styles.cardValBold}>{registeredCitizen.name}</Text>
                  </View>

                  <View style={styles.cardFieldRow}>
                    <Text style={styles.cardLabel}>{t('regMobileTag') || 'REGISTERED MOBILE:'}</Text>
                    <Text style={styles.cardValBold}>+91 {registeredCitizen.phone}</Text>
                  </View>

                  <View style={styles.cardFieldRow}>
                    <Text style={styles.cardLabel}>{t('doorstepAddressTag') || 'DOORSTEP ADDRESS:'}</Text>
                    <Text style={styles.cardValAddress} numberOfLines={2}>
                      {registeredCitizen.address}
                    </Text>
                  </View>

                  <View style={styles.cardFieldRow}>
                    <Text style={styles.cardLabel}>{t('voiceLanguageTag') || 'VOICE LANGUAGE:'}</Text>
                    <Text style={styles.cardValBold}>{registeredCitizen.languageName}</Text>
                  </View>

                  <View style={styles.cardFieldRow}>
                    <Text style={styles.cardLabel}>{t('wardCoopHubTag') || 'WARD CO-OP HUB:'}</Text>
                    <Text style={styles.cardValSmall}>
                      {citizenCoop?.shortName || `${registeredCitizen.city} Cooperative Hub`}
                    </Text>
                  </View>
                </View>

                {/* 📞 Prominent Toll-Free Dialing Instruction Box */}
                <View style={styles.tollFreeHighlightBox}>
                  <View style={styles.tfIconCircle}>
                    <Ionicons name="call" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.tfLabel}>{t('howToBookButtonMobile') || 'HOW TO BOOK FROM BUTTON MOBILE:'}</Text>
                    <Text style={styles.tfNumber}>1800-890-UNISERV</Text>
                    <Text style={styles.tfNumberDigits}>(1800-890-8647 • Toll-Free)</Text>
                    <Text style={styles.tfHelper}>
                      {t('citizenDialsFrom') || 'Citizen dials from'} <Text style={{ fontWeight: '800' }}>+91 {registeredCitizen.phone}</Text> {t('addressRecognizedAuto') || '➔ Address is recognized automatically!'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.85}
              >
                <Ionicons name="home" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>{t('doneReturnHome') || 'Done • Return to My Home Screen'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleResetForAnother}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryBtnText}>{t('registerAnotherCitizen') || 'Register Another Citizen'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  headerTitleCol: {
    flex: 1
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 1
  },
  esevaiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  esevaiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 4
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF'
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepDotActive: {
    backgroundColor: colors.primary
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary
  },
  stepDotTextActive: {
    color: '#FFFFFF'
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8
  },
  stepLineActive: {
    backgroundColor: colors.primary
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  stepBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF'
  },
  infoBannerText: {
    fontSize: 11.5,
    color: '#1E3A8A',
    lineHeight: 16,
    marginTop: 2
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4
  },
  inputHelper: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 4
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8
  },
  flagText: {
    fontSize: 16,
    marginRight: 4
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  phoneInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  changePhoneBtn: {
    position: 'absolute',
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 6
  },
  changePhoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  textInput: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: colors.textPrimary
  },
  twoColRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  langChip: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center'
  },
  langChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  langChipNative: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  langChipEnglish: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  langChipTextActive: {
    color: '#FFFFFF'
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  gpsButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 4
  },
  otpSection: {
    marginTop: 8
  },
  mockSmsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16
  },
  mockSmsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  mockSmsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 6
  },
  mockSmsBody: {
    fontSize: 11.5,
    color: '#047857',
    fontStyle: 'italic',
    lineHeight: 16
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  autoFillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 4
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center'
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16
  },
  otpBox: {
    width: 50,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF'
  },
  verifiedNumberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  verifiedNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
    marginLeft: 6
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    marginTop: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    height: 44,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary
  },
  btnDisabled: {
    opacity: 0.5
  },
  successCelebration: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 14
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
    textAlign: 'center'
  },
  successSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4
  },
  citizenCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  citizenCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
    marginBottom: 12
  },
  cardGovIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardGovTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5
  },
  cardGovSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '600'
  },
  cardBody: {
    gap: 8
  },
  cardFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    width: 120
  },
  cardValBold: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'right'
  },
  cardValAddress: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#CBD5E1',
    textAlign: 'right'
  },
  cardValSmall: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    textAlign: 'right'
  },
  tollFreeHighlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#3B82F6'
  },
  tfIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tfLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 0.5
  },
  tfNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  tfNumberDigits: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
    marginTop: 1
  },
  tfHelper: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 3,
    lineHeight: 14
  }
});

export default Screen_RegisterForAnother;
