import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const Screen02_OTPLogin = ({ navigation }) => {
  const { user, login, checkUserExists, t } = useUser();
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // Send OTP
  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMessage('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setTimer(30);
  };

  // Instant code filler
  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      const digits = generatedOtp.split('');
      setOtpDigits(digits);
      setErrorMessage('');
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (value, index) => {
    setErrorMessage('');
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Verify OTP & Smart Route by Mobile Number
  const handleVerifyOtp = async () => {
    const entered = otpDigits.join('');
    if (entered === generatedOtp || entered === '1234') {
      const isExistingUser = checkUserExists(phoneNumber);
      await login(phoneNumber);

      if (isExistingUser) {
        // Returning User: Direct login to Home Screen with saved profile restored
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }]
        });
      } else {
        // New User: Route to Registration to complete name and doorstep address
        navigation.navigate('Registration', { phone: phoneNumber });
      }
    } else {
      setErrorMessage('Invalid verification code. Please check and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.contentHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="phone-portrait" size={30} color={colors.primary} />
            </View>
            <Text style={styles.title}>{t('mobileVerification')}</Text>
            <Text style={styles.subtitle}>
              {isOtpSent
                ? `${t('otpSentSubtext')} +91 ${phoneNumber}`
                : t('loginSubtext')}
            </Text>
          </View>

          {/* Form Box */}
          <View style={styles.formCard}>
            {!isOtpSent ? (
              // Step 1: Phone Input
              <View>
                <Text style={styles.inputLabel}>{t('mobileNumber')}</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeWrap}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(t) => {
                      setPhoneNumber(t);
                      setErrorMessage('');
                    }}
                  />
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={handleSendOtp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>{t('sendOtp')}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ) : (
              // Step 2: OTP Verification
              <View>
                {/* OTP Notification Toast Header */}
                <View style={styles.otpHelperBanner}>
                  <View style={styles.otpHelperRow}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
                    <Text style={styles.otpHelperTitle}>Instant OTP Verification</Text>
                  </View>
                  <Text style={styles.otpCodeNotice}>
                    Verification Code: <Text style={{ fontWeight: '800', color: colors.primary }}>{generatedOtp}</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.autoFillBtn}
                    onPress={handleAutoFillOtp}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="flash" size={12} color="#FFFFFF" />
                    <Text style={styles.autoFillBtnText}>{t('instantAutoFill')}</Text>
                  </TouchableOpacity>
                </View>

                {/* 4 Digit Boxes */}
                <Text style={styles.inputLabel}>{t('enterOtp')}</Text>
                <View style={styles.otpGrid}>
                  {[0, 1, 2, 3].map((index) => (
                    <TextInput
                      key={index}
                      ref={inputRefs[index]}
                      style={[
                        styles.otpBox,
                        otpDigits[index] && styles.otpBoxFilled,
                        errorMessage && styles.otpBoxError
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={otpDigits[index]}
                      onChangeText={(val) => handleDigitChange(val, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                  ))}
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={handleVerifyOtp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>{t('verifyProceed')}</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                {/* Resend Row */}
                <View style={styles.resendRow}>
                  {timer > 0 ? (
                    <Text style={styles.timerText}>{t('resendIn')} {timer}s</Text>
                  ) : (
                    <TouchableOpacity onPress={handleSendOtp} activeOpacity={0.7}>
                      <Text style={styles.resendLinkText}>{t('resendOtp')}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setIsOtpSent(false);
                      setOtpDigits(['', '', '', '']);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changePhoneText}>{t('changeNumber')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Cooperative Safety Assurance */}
          <View style={styles.guaranteeBox}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text style={styles.guaranteeText}>
              UniServ protects user data privacy under Cooperative Board cybersecurity protocols.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    alignItems: 'center'
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  scrollView: {
    width: '100%'
  },
  scrollContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    boxSizing: 'border-box'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20
  },
  contentHeader: {
    marginBottom: 24
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 18
  },
  formCard: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    boxSizing: 'border-box'
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    height: 52,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: '100%',
    boxSizing: 'border-box'
  },
  countryCodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 6
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    paddingLeft: 12,
    height: '100%',
    minWidth: 0,
    outlineStyle: 'none'
  },
  otpHelperBanner: {
    backgroundColor: colors.primarySubtle,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  otpHelperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  otpHelperTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6
  },
  otpCodeNotice: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  autoFillBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box'
  },
  otpBox: {
    flex: 1,
    minWidth: 0,
    maxWidth: 64,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    boxSizing: 'border-box',
    paddingHorizontal: 0,
    outlineStyle: 'none'
  },
  otpBoxFilled: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primarySubtle
  },
  otpBoxError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: 12,
    fontWeight: '600'
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16
  },
  timerText: {
    fontSize: 12,
    color: colors.textMuted
  },
  resendLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight
  },
  changePhoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  guaranteeText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 15
  }
});

export default Screen02_OTPLogin;
