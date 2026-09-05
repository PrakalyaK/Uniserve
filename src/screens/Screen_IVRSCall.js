import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useBooking } from '../context/BookingContext';
import {
  IVRS_SERVICES_MAP,
  LANGUAGE_SELECTION_PROMPT,
  IVRS_PROMPTS,
  playDtmfTone,
  speakIvrsPrompt,
  stopIvrsSpeech
} from '../utils/ivrsAudioEngine';
import { getHyperLocalCooperative, getWorkersForTrade } from '../utils/locationService';
import servicesData from '../data/services.json';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Screen_IVRSCall = ({ navigation, route }) => {
  const { user, usersDb } = useUser();
  const { createBooking } = useBooking();

  // Available sample test callers (Current user is always index 0 by default)
  const availableCallers = useMemo(() => {
    const list = [];

    // 1. Current logged-in active user (PRIMARY DEFAULT CALLER)
    const activeUserName = user?.name || 'Priya Sharma';
    const activeUserPhone = user?.phone ? user.phone.replace(/[^0-9]/g, '') : '9876543210';
    const activeUserAddress = user?.address || 'Lajpat Nagar, New Delhi';
    const activeUserLang = user?.language?.code === 'ta' ? 'ta' : user?.language?.code === 'hi' ? 'hi' : 'en';

    list.push({
      id: 'c_active_user',
      name: activeUserName,
      phone: activeUserPhone,
      address: activeUserAddress,
      defaultLang: activeUserLang,
      tag: 'My Account (You)'
    });

    // 2. Rural Tamil Nadu Sample Citizen (Muthuvel K.)
    list.push({
      id: 'c_muthuvel',
      name: 'Muthuvel K.',
      phone: '9842154321',
      address: 'Plot 14, Middle Street, Alanganallur, Madurai - 625501',
      defaultLang: 'ta',
      tag: 'Button Mobile (Madurai, TN)'
    });

    // 3. Rural Hindi Sample Citizen (Rameshwar Yadav)
    list.push({
      id: 'c_rameshwar',
      name: 'Rameshwar Yadav',
      phone: '9811234567',
      address: 'House 42, Gram Panchayat Road, Sohna, Gurugram - 122103',
      defaultLang: 'hi',
      tag: 'Button Mobile (Gurugram, HR)'
    });

    // 4. All assisted registered citizens from usersDb (Phase 1)
    if (usersDb) {
      Object.values(usersDb).forEach((u, idx) => {
        if (u.phone && !list.some(c => c.phone === u.phone.replace(/[^0-9]/g, ''))) {
          list.push({
            id: `c_db_${idx}`,
            name: u.name || 'Citizen',
            phone: u.phone.replace(/[^0-9]/g, ''),
            address: u.address || `${u.locality || ''}, ${u.city || ''}`,
            defaultLang: u.language || 'ta',
            tag: u.registrationSource || 'Assisted Citizen'
          });
        }
      });
    }

    // 5. Unregistered sample
    list.push({
      id: 'c_unregistered',
      name: 'Unregistered Caller',
      phone: '9123456789',
      address: '',
      defaultLang: 'en',
      tag: 'New / Unregistered SIM'
    });

    return list;
  }, [user, usersDb]);

  // Caller State
  const [selectedCaller, setSelectedCaller] = useState(availableCallers[0]);
  const [callerSelectorModal, setCallerSelectorModal] = useState(false);

  // Call Lifecycle & Telephony States
  // ivrsStage: 'SELECT_LANGUAGE' | 'SELECT_SERVICE' | 'CONFIRM_ADDRESS' | 'COMPLETED' | 'UNREGISTERED'
  const [callStatus, setCallStatus] = useState('connected');
  const [callDuration, setCallDuration] = useState(0);
  const [ivrsStage, setIvrsStage] = useState('SELECT_LANGUAGE');
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // 'en' | 'ta' | 'hi'
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);

  // Audio & Transcript
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [createdBookingData, setCreatedBookingData] = useState(null);

  // Animation
  const waveAnim = useRef(new Animated.Value(0.4)).current;
  const scrollViewRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  // Audio waveform animation
  useEffect(() => {
    if (isBotSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, { toValue: 1.0, duration: 320, useNativeDriver: true }),
          Animated.timing(waveAnim, { toValue: 0.3, duration: 320, useNativeDriver: true })
        ])
      ).start();
    } else {
      waveAnim.setValue(0.3);
    }
  }, [isBotSpeaking]);

  // Unified Speech Helper
  const speakDialogue = (promptObj, lang = selectedLanguage, callback) => {
    const displayText = typeof promptObj === 'object' ? promptObj.displayText : promptObj;
    const spokenContent = typeof promptObj === 'object' && promptObj.segments ? promptObj : (typeof promptObj === 'object' ? promptObj.spokenText : promptObj);

    setIsBotSpeaking(true);

    setDialogueHistory(prev => [
      ...prev,
      {
        sender: 'bot',
        text: displayText,
        lang: lang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);

    speakIvrsPrompt(spokenContent, lang, () => {
      setIsBotSpeaking(false);
      if (callback) callback();
    });
  };

  // Start Call -> Plays Trilingual Language Selection First!
  useEffect(() => {
    if (callStatus === 'connected') {
      startLanguageSelection();
    }
    return () => {
      stopIvrsSpeech();
    };
  }, [callStatus, selectedCaller]);

  const startLanguageSelection = () => {
    stopIvrsSpeech();
    setDialogueHistory([]);
    setCreatedBookingData(null);
    setSelectedServiceItem(null);
    setIvrsStage('SELECT_LANGUAGE');

    // Announce Language Choices: English (1), Tamil (2), Hindi (3)
    speakDialogue(LANGUAGE_SELECTION_PROMPT, 'en');
  };

  // Switch to Chosen Language & Announce 10 Services
  const selectLanguageAndProceed = (langCode) => {
    setSelectedLanguage(langCode);
    const curPrompts = IVRS_PROMPTS[langCode] || IVRS_PROMPTS.en;
    const isRegistered = Boolean(selectedCaller && selectedCaller.address && selectedCaller.name !== 'Unregistered Caller');

    if (!isRegistered) {
      setIvrsStage('UNREGISTERED');
      const unregPrompt = curPrompts.unregisteredGreeting(selectedCaller.phone);
      speakDialogue(unregPrompt, langCode);
      return;
    }

    setIvrsStage('SELECT_SERVICE');

    const greeting = curPrompts.greetingRegistered(selectedCaller.name, selectedCaller.address);
    const menu = curPrompts.servicesMenu();

    const combined = {
      displayText: `${greeting.displayText}\n\n${menu.displayText}`,
      spokenText: `${greeting.spokenText} ${menu.spokenText}`
    };

    speakDialogue(combined, langCode);
  };

  // DTMF Keypad Processor (Handles all stages)
  const handleDtmfPress = (digit) => {
    playDtmfTone(digit);
    stopIvrsSpeech();

    const curPrompts = IVRS_PROMPTS[selectedLanguage] || IVRS_PROMPTS.en;

    // -------------------------------------------------------------
    // STAGE 1: LANGUAGE SELECTION (Press 1: English, 2: Tamil, 3: Hindi)
    // -------------------------------------------------------------
    if (ivrsStage === 'SELECT_LANGUAGE') {
      if (digit === '1') {
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [1] ➔ Selected English 🌐', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        selectLanguageAndProceed('en');
        return;
      }
      if (digit === '2') {
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [2] ➔ Selected தமிழ் (Tamil) 🇮🇳', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        selectLanguageAndProceed('ta');
        return;
      }
      if (digit === '3') {
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [3] ➔ Selected हिंदी (Hindi) 🇮🇳', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        selectLanguageAndProceed('hi');
        return;
      }
      if (digit === '*') {
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [*] ➔ Repeat Language Selection', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        speakDialogue(LANGUAGE_SELECTION_PROMPT, 'en');
        return;
      }

      // Invalid key in language menu
      speakDialogue({
        displayText: "For English press 1. தமிழுக்கு 2 அழுத்தவும். हिंदी के लिए 3 दबाएं।",
        spokenText: "For English press one. Thamizhukku irandu azhuthavum. Hindi ke liye teen dabaayein."
      }, 'en');
      return;
    }

    // -------------------------------------------------------------
    // STAGE 2: 10 SERVICES SELECTION (Digits 1-9, 0, *, #)
    // -------------------------------------------------------------
    if (ivrsStage === 'SELECT_SERVICE') {
      if (digit === '*') {
        // Repeat Menu
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [*] ➔ Repeat Services Menu 🔁', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        const repeatNotice = curPrompts.repeatNotice();
        const menu = curPrompts.servicesMenu();
        speakDialogue({
          displayText: `${repeatNotice.displayText}\n\n${menu.displayText}`,
          spokenText: `${repeatNotice.spokenText} ${menu.spokenText}`
        }, selectedLanguage);
        return;
      }

      if (digit === '#') {
        // Return to Language Selection
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [#] ➔ Change Language 🌐', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        startLanguageSelection();
        return;
      }

      // Match Service
      const matched = IVRS_SERVICES_MAP[digit];
      if (matched) {
        setSelectedServiceItem(matched);
        setIvrsStage('CONFIRM_ADDRESS');

        const serviceLabel = selectedLanguage === 'ta' ? matched.tamil : selectedLanguage === 'hi' ? matched.hindi : matched.name;
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: `Pressed [${digit}] ➔ Selected ${matched.name} (${serviceLabel})`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);

        const confirmPrompt = curPrompts.confirmSelection(matched, selectedCaller.address);
        speakDialogue(confirmPrompt, selectedLanguage);
        return;
      }
    }

    // -------------------------------------------------------------
    // STAGE 3: ADDRESS CONFIRMATION (Press 1 to confirm, * repeat, # back)
    // -------------------------------------------------------------
    if (ivrsStage === 'CONFIRM_ADDRESS') {
      if (digit === '1') {
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [1] ➔ Confirmed Doorstep Dispatch ✅', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        executeAutoBooking();
        return;
      }

      if (digit === '*') {
        // Repeat Address Confirmation
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [*] ➔ Repeat Address Prompt 🔁', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        const confirmPrompt = curPrompts.confirmSelection(selectedServiceItem, selectedCaller.address);
        speakDialogue(confirmPrompt, selectedLanguage);
        return;
      }

      if (digit === '#') {
        // Back to Services Menu
        setDialogueHistory(prev => [
          ...prev,
          { sender: 'user', text: 'Pressed [#] ➔ Back to Services Menu ↩️', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
        ]);
        setIvrsStage('SELECT_SERVICE');
        const menu = curPrompts.servicesMenu();
        speakDialogue(menu, selectedLanguage);
        return;
      }
    }

    // Unregistered state
    if (ivrsStage === 'UNREGISTERED') {
      setDialogueHistory(prev => [
        ...prev,
        { sender: 'user', text: `Pressed [${digit}]`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }
      ]);
      const opText = selectedLanguage === 'ta'
        ? { displayText: 'உங்கள் அழைப்பு கூட்டுறவு உதவி அதிகாரியிடம் இணைக்கப்படுகிறது...', spokenText: 'Ungal call sahakari officer-idam inaikkappadugirathu.' }
        : selectedLanguage === 'hi'
        ? { displayText: 'आपकी कॉल सहकारी अधिकारी से जोड़ी जा रही है...', spokenText: 'Aapki call sahakari adhikari se jodi ja rahi hai.' }
        : { displayText: 'Connecting you to Ward Officer...', spokenText: 'Connecting you to Ward Officer.' };
      speakDialogue(opText, selectedLanguage);
    }
  };

  // Dispatch & Create Booking in Database
  const executeAutoBooking = () => {
    setIvrsStage('COMPLETED');

    const curPrompts = IVRS_PROMPTS[selectedLanguage] || IVRS_PROMPTS.en;
    const bookingId = `BK-IVRS-${Math.floor(1000 + Math.random() * 9000)}`;
    const startOtp = String(Math.floor(1000 + Math.random() * 9000));

    const serviceObj = servicesData.find(s => s.id === selectedServiceItem.id) || servicesData[0];
    const tradeWorkers = getWorkersForTrade(serviceObj, selectedCaller.address);
    const assignedWorker = tradeWorkers[0];

    const bookingPayload = {
      booking_id: bookingId,
      service: serviceObj,
      worker: assignedWorker,
      worker_count: 1,
      scale_mode: 'solo',
      address: selectedCaller.address,
      pickup_address: selectedCaller.address,
      user_phone: selectedCaller.phone,
      user_name: selectedCaller.name,
      start_otp: startOtp,
      booking_source: 'IVRS_TollFree_1800-890-UNISERV',
      status: 'Artisan Dispatched',
      statusIndex: 2,
      booking_type: 'now',
      base_amount: serviceObj.basePrice || 249,
      cooperative: coop.name,
      cooperative_short: coop.shortName,
      created_at: new Date().toISOString()
    };

    createBooking(bookingPayload);
    setCreatedBookingData(bookingPayload);

    const successPrompt = curPrompts.bookingSuccess(bookingId, assignedWorker.name, startOtp);
    speakDialogue(successPrompt, selectedLanguage);
  };

  const handleEndCall = () => {
    stopIvrsSpeech();
    setCallStatus('ended');
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Telephony HUD Bar */}
      <View style={styles.topHud}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            stopIvrsSpeech();
            navigation.navigate('Home');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topHudCenter}>
          <View style={styles.liveCallPill}>
            <View style={styles.liveCallGreenDot} />
            <Text style={styles.liveCallStatusText}>
              {callStatus === 'connected' ? 'CONNECTED • TOLL-FREE' : 'CALL TERMINATED'}
            </Text>
          </View>
          <Text style={styles.tollFreeBigNumber}>1800-890-UNISERV</Text>
          <Text style={styles.callTimerText}>{formatTimer(callDuration)}</Text>
        </View>

        <TouchableOpacity
          style={styles.switchCallerBtn}
          onPress={() => setCallerSelectorModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="people" size={16} color="#60A5FA" />
          <Text style={styles.switchCallerText}>Caller</Text>
        </TouchableOpacity>
      </View>

      {/* Current Flow Stage Banner */}
      <View style={styles.stageIndicatorBar}>
        <Text style={styles.stageIndicatorLabel}>
          {ivrsStage === 'SELECT_LANGUAGE' && '🌐 STAGE 1: Choose Language (Press 1 English, 2 Tamil, 3 Hindi)'}
          {ivrsStage === 'SELECT_SERVICE' && `🛠️ STAGE 2: Choose Service in ${selectedLanguage.toUpperCase()} (Press 1-9, 0)`}
          {ivrsStage === 'CONFIRM_ADDRESS' && '📍 STAGE 3: Confirm Address (Press 1 to Confirm)'}
          {ivrsStage === 'COMPLETED' && '✅ STAGE 4: Booking Dispatched & OTP Sent via SMS'}
          {ivrsStage === 'UNREGISTERED' && '⚠️ Unregistered SIM Notice'}
        </Text>
      </View>

      {/* Caller ID Strip */}
      <View style={styles.callerIdStrip}>
        <View style={styles.callerIdLeft}>
          <Ionicons name="call" size={14} color="#38BDF8" />
          <Text style={styles.callerIdText} numberOfLines={1}>
            Calling from: <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>+91 {selectedCaller.phone}</Text>{' '}
            ({selectedCaller.name})
          </Text>
        </View>
        <Text style={styles.callerLocalityTag} numberOfLines={1}>
          {selectedCaller.address ? selectedCaller.address.split(',')[0] : 'Unregistered'}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Speaking Waveform */}
        {callStatus === 'connected' && (
          <View style={styles.speakingWaveCard}>
            <View style={styles.speakingWaveHeader}>
              <Animated.View style={[styles.speakerIconCircle, { transform: [{ scale: waveAnim }] }]}>
                <Ionicons name="volume-high" size={20} color="#FFFFFF" />
              </Animated.View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.speakingStatusTitle}>
                  {isBotSpeaking ? 'IVRS Voice Bot is speaking...' : 'Listening for Keypad Input...'}
                </Text>
                <Text style={styles.speakingStatusSub}>
                  {ivrsStage === 'SELECT_LANGUAGE'
                    ? 'Trilingual Language Gateway • English / தமிழ் / हिंदी'
                    : `Active Language: ${selectedLanguage === 'ta' ? 'தமிழ்' : selectedLanguage === 'hi' ? 'हिंदी' : 'English'}`}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Live Synchronized Transcript Balloons */}
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptSectionLabel}>LIVE TELEPHONY TRANSCRIPT &amp; AUDIO LOGS</Text>
          {dialogueHistory.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.dialogueRow,
                item.sender === 'user' ? styles.dialogueRowUser : styles.dialogueRowBot
              ]}
            >
              <View
                style={[
                  styles.balloon,
                  item.sender === 'user' ? styles.balloonUser : styles.balloonBot
                ]}
              >
                <View style={styles.balloonHeader}>
                  <Ionicons
                    name={item.sender === 'user' ? 'person' : 'headset'}
                    size={12}
                    color={item.sender === 'user' ? '#FFFFFF' : '#38BDF8'}
                  />
                  <Text style={styles.balloonSender}>
                    {item.sender === 'user' ? 'Citizen (Keypad Input)' : `UniServ IVRS (${(item.lang || selectedLanguage).toUpperCase()})`}
                  </Text>
                  <Text style={styles.balloonTime}>{item.time}</Text>
                </View>
                <Text style={styles.balloonBody}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Success Banner */}
        {createdBookingData && (
          <View style={styles.bookingSuccessBanner}>
            <View style={styles.bookingSuccessHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.bookingSuccessTitle}>Booking Confirmed: {createdBookingData.booking_id}</Text>
                <Text style={styles.bookingSuccessSub}>
                  Assigned Artisan: {createdBookingData.worker?.name} (Start OTP: {createdBookingData.start_otp})
                </Text>
              </View>
            </View>

            <View style={styles.smsMockBox}>
              <Text style={styles.smsMockTitle}>📲 SMS Delivered to Button Phone (+91 {selectedCaller.phone}):</Text>
              <Text style={styles.smsMockBody}>
                "UniServ: Your booking {createdBookingData.booking_id} for {createdBookingData.service?.name} is confirmed. Artisan {createdBookingData.worker?.name} (+91 98101 23456) will arrive in 8 mins. Start OTP: {createdBookingData.start_otp}."
              </Text>
            </View>

            <TouchableOpacity
              style={styles.liveTrackingRedirectBtn}
              onPress={() => {
                stopIvrsSpeech();
                navigation.navigate('LiveTracking', { worker: createdBookingData.worker });
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="navigate" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.liveTrackingRedirectText}>View Live GPS Tracking Map</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 🎹 Interactive DTMF Dialpad & Dynamic Keypad Labels */}
      {callStatus === 'connected' && (
        <View style={styles.dialpadFooter}>
          {/* Quick Helper Bar */}
          <View style={styles.quickActionsBar}>
            <TouchableOpacity
              style={styles.repeatMenuBtn}
              onPress={() => handleDtmfPress('*')}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={14} color="#F59E0B" />
              <Text style={styles.repeatMenuText}>
                {selectedLanguage === 'ta' ? '🔁 மீண்டும் கேள் (*)' : selectedLanguage === 'hi' ? '🔁 दोबारा सुनें (*)' : '🔁 Repeat Menu (*)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeLangBtn}
              onPress={() => handleDtmfPress('#')}
              activeOpacity={0.8}
            >
              <Ionicons name="globe" size={14} color="#60A5FA" />
              <Text style={styles.changeLangText}>Change Lang (#)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endCallSmallBtn}
              onPress={handleEndCall}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* DYNAMIC KEYPAD ACCORDING TO STAGE */}
          {ivrsStage === 'SELECT_LANGUAGE' ? (
            /* Stage 1 Language Keypad */
            <View style={styles.languageKeypadContainer}>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={[styles.keypadKey, styles.keyLangActive]} onPress={() => handleDtmfPress('1')}>
                  <Text style={styles.keyDigit}>1</Text>
                  <Text style={styles.keyServiceSub}>🌐 English</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.keypadKey, styles.keyLangActive]} onPress={() => handleDtmfPress('2')}>
                  <Text style={styles.keyDigit}>2</Text>
                  <Text style={styles.keyServiceSub}>🇮🇳 தமிழ் (Tamil)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.keypadKey, styles.keyLangActive]} onPress={() => handleDtmfPress('3')}>
                  <Text style={styles.keyDigit}>3</Text>
                  <Text style={styles.keyServiceSub}>🇮🇳 हिंदी (Hindi)</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.keypadRow, { marginTop: 6 }]}>
                <TouchableOpacity style={[styles.keypadKey, styles.keyRepeat]} onPress={() => handleDtmfPress('*')}>
                  <Text style={[styles.keyDigit, { color: '#F59E0B' }]}>*</Text>
                  <Text style={[styles.keyServiceSub, { color: '#FCD34D' }]}>🔁 Repeat Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Stage 2 & 3: 10-Service Keypad */
            <View style={styles.keypadGrid}>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('1')}>
                  <Text style={styles.keyDigit}>1</Text>
                  <Text style={styles.keyServiceSub}>
                    {ivrsStage === 'CONFIRM_ADDRESS' ? '✅ Confirm' : '⚡ Electrician'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('2')}>
                  <Text style={styles.keyDigit}>2</Text>
                  <Text style={styles.keyServiceSub}>🔧 Plumber</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('3')}>
                  <Text style={styles.keyDigit}>3</Text>
                  <Text style={styles.keyServiceSub}>🪚 Carpenter</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('4')}>
                  <Text style={styles.keyDigit}>4</Text>
                  <Text style={styles.keyServiceSub}>🧹 Cleaning</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('5')}>
                  <Text style={styles.keyDigit}>5</Text>
                  <Text style={styles.keyServiceSub}>🎨 Painting</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('6')}>
                  <Text style={styles.keyDigit}>6</Text>
                  <Text style={styles.keyServiceSub}>🤝 Caregiver</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('7')}>
                  <Text style={styles.keyDigit}>7</Text>
                  <Text style={styles.keyServiceSub}>🔌 Technician</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('8')}>
                  <Text style={styles.keyDigit}>8</Text>
                  <Text style={styles.keyServiceSub}>🧑‍🍳 Domestic Helper</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('9')}>
                  <Text style={styles.keyDigit}>9</Text>
                  <Text style={styles.keyServiceSub}>🚗 Driver / Cab</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.keypadRow}>
                <TouchableOpacity style={[styles.keypadKey, styles.keyRepeat]} onPress={() => handleDtmfPress('*')}>
                  <Text style={[styles.keyDigit, { color: '#F59E0B' }]}>*</Text>
                  <Text style={[styles.keyServiceSub, { color: '#FCD34D' }]}>🔁 Repeat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadKey} onPress={() => handleDtmfPress('0')}>
                  <Text style={styles.keyDigit}>0</Text>
                  <Text style={styles.keyServiceSub}>🌱 Gardening</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.keypadKey, styles.keyCancel]} onPress={() => handleDtmfPress('#')}>
                  <Text style={[styles.keyDigit, { color: '#94A3B8' }]}>#</Text>
                  <Text style={styles.keyServiceSub}>↩️ Back / Lang</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Caller Selector Modal */}
      <Modal
        visible={callerSelectorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCallerSelectorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Caller-ID (Simulated Mobile)</Text>
              <TouchableOpacity onPress={() => setCallerSelectorModal(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Select which citizen is calling Toll-Free 1800-890-UNISERV:
            </Text>

            <ScrollView style={{ maxHeight: 320 }}>
              {availableCallers.map((caller) => {
                const isSelected = selectedCaller.phone === caller.phone;
                return (
                  <TouchableOpacity
                    key={caller.id}
                    style={[styles.callerCard, isSelected && styles.callerCardActive]}
                    onPress={() => {
                      setSelectedCaller(caller);
                      setCallerSelectorModal(false);
                      setCallStatus('connected');
                    }}
                  >
                    <View style={styles.callerIconBox}>
                      <Ionicons name="person" size={20} color={isSelected ? '#FFFFFF' : colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.callerName, isSelected && { color: '#FFFFFF' }]}>
                          {caller.name}
                        </Text>
                        <View style={styles.callerTagPill}>
                          <Text style={styles.callerTagText}>{caller.tag}</Text>
                        </View>
                      </View>
                      <Text style={[styles.callerPhone, isSelected && { color: '#93C5FD' }]}>
                        +91 {caller.phone}
                      </Text>
                      {caller.address ? (
                        <Text style={[styles.callerAddress, isSelected && { color: '#CBD5E1' }]} numberOfLines={1}>
                          📍 {caller.address}
                        </Text>
                      ) : (
                        <Text style={{ fontSize: 10.5, color: '#EF4444', fontStyle: 'italic' }}>
                          ⚠️ Unregistered in Central Registry
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16'
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topHudCenter: {
    alignItems: 'center'
  },
  liveCallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2
  },
  liveCallGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 5
  },
  liveCallStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4ADE80',
    letterSpacing: 0.5
  },
  tollFreeBigNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5
  },
  callTimerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1
  },
  switchCallerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  switchCallerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#93C5FD',
    marginLeft: 4
  },
  stageIndicatorBar: {
    backgroundColor: '#131D31',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  stageIndicatorLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
    textAlign: 'center'
  },
  callerIdStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  callerIdLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  callerIdText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 6
  },
  callerLocalityTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
    maxWidth: 120
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20
  },
  speakingWaveCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginBottom: 10
  },
  speakingWaveHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  speakerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  speakingStatusTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  speakingStatusSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 1
  },
  transcriptBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12
  },
  transcriptSectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  dialogueRow: {
    marginBottom: 10
  },
  dialogueRowBot: {
    alignItems: 'flex-start'
  },
  dialogueRowUser: {
    alignItems: 'flex-end'
  },
  balloon: {
    maxWidth: '94%',
    borderRadius: 12,
    padding: 10
  },
  balloonBot: {
    backgroundColor: '#1E293B',
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8'
  },
  balloonUser: {
    backgroundColor: colors.primary,
    borderRightWidth: 3,
    borderRightColor: '#60A5FA'
  },
  balloonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  balloonSender: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginLeft: 4,
    flex: 1
  },
  balloonTime: {
    fontSize: 9,
    color: '#64748B'
  },
  balloonBody: {
    fontSize: 12,
    color: '#F8FAFC',
    lineHeight: 17
  },
  bookingSuccessBanner: {
    backgroundColor: '#064E3B',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    marginTop: 6,
    marginBottom: 14
  },
  bookingSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  bookingSuccessTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  bookingSuccessSub: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 1
  },
  smsMockBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8
  },
  smsMockTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6EE7B7'
  },
  smsMockBody: {
    fontSize: 11,
    color: '#ECFDF5',
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 15
  },
  liveTrackingRedirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 42,
    borderRadius: 10,
    marginTop: 6
  },
  liveTrackingRedirectText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  dialpadFooter: {
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 14
  },
  quickActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  repeatMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2305',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  repeatMenuText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FCD34D',
    marginLeft: 4
  },
  changeLangBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B82F6'
  },
  changeLangText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#93C5FD',
    marginLeft: 4
  },
  endCallSmallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  languageKeypadContainer: {
    paddingVertical: 4
  },
  keyLangActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6'
  },
  keypadGrid: {
    gap: 6
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  keypadKey: {
    flex: 1,
    height: 48,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  keyRepeat: {
    borderColor: '#B45309',
    backgroundColor: '#1C1917'
  },
  keyCancel: {
    backgroundColor: '#1E293B'
  },
  keyDigit: {
    fontSize: 17,
    fontWeight: '900',
    color: '#F8FAFC'
  },
  keyServiceSub: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: -1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginBottom: 12
  },
  callerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  callerCardActive: {
    backgroundColor: colors.primary,
    borderColor: '#60A5FA'
  },
  callerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  callerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  callerTagPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6
  },
  callerTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#93C5FD'
  },
  callerPhone: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 2
  },
  callerAddress: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  }
});

export default Screen_IVRSCall;
