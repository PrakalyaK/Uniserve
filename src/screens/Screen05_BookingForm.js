import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import MediaCaptureModal from '../components/MediaCaptureModal';
import PermissionsModal from '../components/PermissionsModal';
import AudioVoiceRecorder from '../components/AudioVoiceRecorder';
import { fetchRealDoorstepLocation, getHyperLocalCooperative } from '../utils/locationService';
import cooperativesData from '../data/cooperatives.json';
import {
  getLocalizedServiceName,
  getLocalizedService,
  getLocalizedTradeQuestions,
  getLocalizedTradeBulkConfig
} from '../utils/i18nHelper';

export const getDynamicSoloPrice = (
  serviceId,
  tradeSubtype,
  tradeScope2,
  tradeScope3,
  tripType,
  transmissionType,
  defaultStartPrice = 149,
  driverBookingMode = 'driver_only',
  carSeaterType = '5_seater'
) => {
  let price = Number(defaultStartPrice) || 149;

  switch (serviceId) {
    case 's1': // Plumber
      price = 149;
      if (tradeSubtype?.includes('Leaking Tap') || tradeSubtype?.includes('குழாய் கசிவு') || tradeSubtype?.includes('नल का रिसाव')) price = 149;
      else if (tradeSubtype?.includes('Drainage') || tradeSubtype?.includes('வடிகால்') || tradeSubtype?.includes('ड्रेनेज')) price = 249;
      else if (tradeSubtype?.includes('Flush Tank') || tradeSubtype?.includes('பிளஷ்') || tradeSubtype?.includes('फ्लश')) price = 299;
      else if (tradeSubtype?.includes('Shower') || tradeSubtype?.includes('ஷவர்') || tradeSubtype?.includes('शॉवर')) price = 349;
      else if (tradeSubtype?.includes('Burst') || tradeSubtype?.includes('உடைப்பு') || tradeSubtype?.includes('फटना')) price = 399;
      else if (tradeSubtype?.includes('Tank Overflow') || tradeSubtype?.includes('வழிதல்') || tradeSubtype?.includes('ओवरफ्लो')) price = 349;

      if (tradeScope3?.includes('Concealed') || tradeScope3?.includes('மறைக்கப்பட்ட') || tradeScope3?.includes('छुपा')) price += 100;
      break;

    case 's2': // Electrician
      price = 149;
      if (tradeSubtype?.includes('Switchboard') || tradeSubtype?.includes('சுவிட்ச்போர்டு') || tradeSubtype?.includes('स्विचबोर्ड')) price = 149;
      else if (tradeSubtype?.includes('Fan') || tradeSubtype?.includes('மின்விசிறி') || tradeSubtype?.includes('पंखा')) price = 199;
      else if (tradeSubtype?.includes('MCB') || tradeSubtype?.includes('டிரிப்') || tradeSubtype?.includes('ट्रिप')) price = 249;
      else if (tradeSubtype?.includes('AC') || tradeSubtype?.includes('ஏசி') || tradeSubtype?.includes('एसी')) price = 349;
      else if (tradeSubtype?.includes('Inverter') || tradeSubtype?.includes('இன்வெர்ட்டர்') || tradeSubtype?.includes('इन्वर्टर')) price = 299;
      else if (tradeSubtype?.includes('Outage') || tradeSubtype?.includes('மின் தடை') || tradeSubtype?.includes('बिजली गुल')) price = 399;

      if (tradeScope3?.includes('3-Phase') || tradeScope3?.includes('3-பேஸ்') || tradeScope3?.includes('3-फेज')) price += 100;
      break;

    case 's3': // Cleaner
      price = 199;
      if (tradeSubtype?.includes('Balcony') || tradeSubtype?.includes('பால்கனி') || tradeSubtype?.includes('बालकनी')) price = 199;
      else if (tradeSubtype?.includes('Window') || tradeSubtype?.includes('ஜன்னல்') || tradeSubtype?.includes('खिड़की')) price = 249;
      else if (tradeSubtype?.includes('Bathroom') || tradeSubtype?.includes('குளியலறை') || tradeSubtype?.includes('बाथरूम')) price = 299;
      else if (tradeSubtype?.includes('Kitchen') || tradeSubtype?.includes('சமையலறை') || tradeSubtype?.includes('रसोई')) price = 399;
      else if (tradeSubtype?.includes('Sofa') || tradeSubtype?.includes('சோபா') || tradeSubtype?.includes('सोफा')) price = 499;
      else if (tradeSubtype?.includes('Floor') || tradeSubtype?.includes('தரை') || tradeSubtype?.includes('फर्श')) price = 599;

      if (tradeScope2?.includes('Paint') || tradeScope2?.includes('பெயிண்ட்') || tradeScope2?.includes('पेंट') || tradeScope2?.includes('Oil') || tradeScope2?.includes('எண்ணெய்')) price += 100;
      if (tradeScope3?.includes('Steam') || tradeScope3?.includes('நீராவி') || tradeScope3?.includes('स्टीम')) price += 150;
      break;

    case 's4': // Carpenter
      price = 149;
      if (tradeSubtype?.includes('Lock') || tradeSubtype?.includes('பூட்டு') || tradeSubtype?.includes('ताला')) price = 149;
      else if (tradeSubtype?.includes('Hinge') || tradeSubtype?.includes('ஹிஞ்ச்') || tradeSubtype?.includes('कब्जा')) price = 199;
      else if (tradeSubtype?.includes('Slider') || tradeSubtype?.includes('ஸ்லைடர்') || tradeSubtype?.includes('दराज')) price = 249;
      else if (tradeSubtype?.includes('Planing') || tradeSubtype?.includes('இழைத்தல்') || tradeSubtype?.includes('घिसना')) price = 299;
      else if (tradeSubtype?.includes('Polish') || tradeSubtype?.includes('பாலிஷ்') || tradeSubtype?.includes('पॉलिश')) price = 349;
      else if (tradeSubtype?.includes('Assembly') || tradeSubtype?.includes('அசெம்பிளி') || tradeSubtype?.includes('असेंबली')) price = 399;

      if (tradeScope2?.includes('Teak') || tradeScope2?.includes('தேக்கு') || tradeScope2?.includes('सागौन')) price += 100;
      break;

    case 's5': // Painter
      price = 249;
      if (tradeSubtype?.includes('Putty') || tradeSubtype?.includes('புட்டி') || tradeSubtype?.includes('पुट्टी')) price = 249;
      else if (tradeSubtype?.includes('Polish') || tradeSubtype?.includes('பாலிஷ்') || tradeSubtype?.includes('पॉलिश')) price = 349;
      else if (tradeSubtype?.includes('Accent') || tradeSubtype?.includes('பிரத்யேக') || tradeSubtype?.includes('एक्सेंट')) price = 499;
      break;

    case 's6': // Caregiver
      price = 249;
      if (tradeSubtype?.includes('Doctor') || tradeSubtype?.includes('மருத்துவமனை') || tradeSubtype?.includes('डॉक्टर')) price = 249;
      else if (tradeSubtype?.includes('Companionship') || tradeSubtype?.includes('கவனிப்பு') || tradeSubtype?.includes('साथ')) price = 299;
      else if (tradeSubtype?.includes('Vitals') || tradeSubtype?.includes('பரிசோதனை') || tradeSubtype?.includes('जांच')) price = 349;
      else if (tradeSubtype?.includes('Recovery') || tradeSubtype?.includes('குணமடைதல்') || tradeSubtype?.includes('रिकवरी')) price = 399;
      else if (tradeSubtype?.includes('Sponge') || tradeSubtype?.includes('பஞ்சு') || tradeSubtype?.includes('स्पंज')) price = 449;
      else if (tradeSubtype?.includes('Night') || tradeSubtype?.includes('இரவு') || tradeSubtype?.includes('रात')) price = 599;

      if (tradeScope3 && (tradeScope3.includes('Oxygen') || tradeScope3.includes('ஆக்சிஜன்') || tradeScope3.includes('Tracheostomy') || tradeScope3.includes('டிரக்கியோஸ்டமி'))) price += 150;
      break;

    case 's7': // Technician
      price = 199;
      if (tradeSubtype?.includes('Microwave') || tradeSubtype?.includes('Geyser') || tradeSubtype?.includes('மைக்ரோவேவ்') || tradeSubtype?.includes('கீசர்')) price = 249;
      else if (tradeSubtype?.includes('RO') || tradeSubtype?.includes('ஆர்ஓ') || tradeSubtype?.includes('आरओ')) price = 299;
      else if (tradeSubtype?.includes('Washing') || tradeSubtype?.includes('வாஷிங்') || tradeSubtype?.includes('वाशिंग')) price = 349;
      else if (tradeSubtype?.includes('Refrigerator') || tradeSubtype?.includes('பிரிட்ஜ்') || tradeSubtype?.includes('रेफ्रिजरेटर')) price = 399;
      else if (tradeSubtype?.includes('AC') || tradeSubtype?.includes('ஏசி') || tradeSubtype?.includes('एसी')) price = 449;

      if (tradeScope3?.includes('Gas') || tradeScope3?.includes('கேஸ்') || tradeScope3?.includes('गैस') || tradeScope3?.includes('PCB') || tradeScope3?.includes('பிசிபி') || tradeScope3?.includes('पीसीबी')) price += 150;
      break;

    case 's8': // Domestic Helper
      price = 149;
      if (tradeSubtype?.includes('Ironing') || tradeSubtype?.includes('அயர்ன்') || tradeSubtype?.includes('इस्त्री')) price = 149;
      else if (tradeSubtype?.includes('Utensils') || tradeSubtype?.includes('பாத்திரங்கள்') || tradeSubtype?.includes('बर्तन')) price = 249;
      else if (tradeSubtype?.includes('Degrease') || tradeSubtype?.includes('Mesh') || tradeSubtype?.includes('சுத்தம்') || tradeSubtype?.includes('धुलाई')) price = 299;
      else if (tradeSubtype?.includes('Meal') || tradeSubtype?.includes('சமையல்') || tradeSubtype?.includes('खाना')) price = 349;
      else if (tradeSubtype?.includes('Substitute') || tradeSubtype?.includes('மாற்று') || tradeSubtype?.includes('वैकल्पिक')) price = 399;

      if (tradeScope3?.includes('6+') || tradeScope3?.includes('பெரிய') || tradeScope3?.includes('बड़ा')) price += 100;
      break;

    case 's9': // Driver (Solo)
      if (driverBookingMode === 'car_with_driver') {
        if (carSeaterType === '7_seater') {
          if (tripType?.includes('City') || tripType?.includes('நகர') || tripType?.includes('शहर')) price = tripType?.includes('Full') || tripType?.includes('முழு') || tripType?.includes('पूरे') ? 2499 : 899;
          else if (tripType?.includes('Airport') || tripType?.includes('விமான') || tripType?.includes('हवाई')) price = 1199;
          else if (tripType?.includes('Outstation') || tripType?.includes('வெளியூர்') || tripType?.includes('बाहरी')) price = 3799;
          else price = 899;
        } else {
          if (tripType?.includes('City') || tripType?.includes('நகர') || tripType?.includes('शहर')) price = tripType?.includes('Full') || tripType?.includes('முழு') || tripType?.includes('पूरे') ? 1799 : 599;
          else if (tripType?.includes('Airport') || tripType?.includes('விமான') || tripType?.includes('हवाई')) price = 799;
          else if (tripType?.includes('Outstation') || tripType?.includes('வெளியூர்') || tripType?.includes('बाहरी')) price = 2799;
          else price = 599;
        }
      } else {
        if (tripType?.includes('City') || tripType?.includes('நகர') || tripType?.includes('शहर')) price = tripType?.includes('Full') || tripType?.includes('முழு') || tripType?.includes('पूरे') ? 699 : 199;
        else if (tripType?.includes('Airport') || tripType?.includes('விமான') || tripType?.includes('हवाई')) price = 299;
        else if (tripType?.includes('Outstation') || tripType?.includes('வெளியூர்') || tripType?.includes('बाहरी')) price = 1199;
        else price = 199;

        if (carSeaterType === '7_seater') price += 100;
        if (transmissionType?.includes('SUV') || transmissionType?.includes('Automatic') || transmissionType?.includes('ஆட்டோமேட்டிக்') || transmissionType?.includes('ऑटोमैटिक') || transmissionType?.includes('EV')) price += 100;
      }
      break;

    case 's10': // Gardener
      price = 149;
      if (tradeSubtype?.includes('Balcony') || tradeSubtype?.includes('பால்கனி') || tradeSubtype?.includes('बालकनी')) price = 149;
      else if (tradeSubtype?.includes('Indoor') || tradeSubtype?.includes('உட்புற') || tradeSubtype?.includes('इनडोर')) price = 199;
      else if (tradeSubtype?.includes('Pest') || tradeSubtype?.includes('பூச்சி') || tradeSubtype?.includes('कीट')) price = 249;
      else if (tradeSubtype?.includes('Lawn') || tradeSubtype?.includes('புல்வெளி') || tradeSubtype?.includes('लॉन') || tradeSubtype?.includes('Drip') || tradeSubtype?.includes('சொட்டு')) price = 349;
      else if (tradeSubtype?.includes('Tree') || tradeSubtype?.includes('மரக்கிளை') || tradeSubtype?.includes('पेड़')) price = 399;

      if (tradeScope3?.includes('Vermicompost') || tradeScope3?.includes('மண்புழு') || tradeScope3?.includes('वर्मीकम्पोस्ट') || tradeScope3?.includes('Perlite') || tradeScope3?.includes('பெர்லைட்')) price += 100;
      break;

    default:
      price = Number(defaultStartPrice) || 149;
  }

  return price;
};

export const Screen05_BookingForm = ({ route, navigation }) => {
  const { service, bookingType = 'now', emergencyIssue } = route.params || {};
  const { user, language, t, permissions, grantAllPermissions, updatePermission } = useUser();
  const { createBooking, isFirstTimeUser, FIRST_TIME_DISCOUNT, submitCommunityBulkRequest, pendingCancellationFee } = useBooking();
  const serviceId = service?.id || 's1';
  const isDriverService = serviceId === 's9';

  // Multilingual dynamic configurations
  const localizedBulkConfig = useMemo(() => getLocalizedTradeBulkConfig(serviceId, language?.code), [serviceId, language?.code]);
  const localizedQuestions = useMemo(() => getLocalizedTradeQuestions(serviceId, language?.code), [serviceId, language?.code]);
  const localizedServiceName = useMemo(() => getLocalizedServiceName(service, t, language?.code), [service, t, language?.code]);

  // Scale Mode: 'solo' (Retail household 1-2 workers) vs 'bulk' (Full Property / Multi-Worker Community Fleet)
  const [scaleMode, setScaleMode] = useState('solo');

  // Bulk Project Customization State by Index
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(1);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(1);

  const [callModalVisible, setCallModalVisible] = useState(false);
  const [inspectionSuccessModal, setInspectionSuccessModal] = useState(false);
  const [inspectionTicket, setInspectionTicket] = useState(null);

  // Permissions & Media Attachments State
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState([]);
  const [voiceNote, setVoiceNote] = useState(null);

  // Standard address vs Driver Pickup & Drop
  const [address, setAddress] = useState(user?.address || 'Flat 302, Palm Heights, Block B, Lajpat Nagar, New Delhi');
  const [pickupAddress, setPickupAddress] = useState(user?.address || 'Flat 302, Palm Heights, Block B, Lajpat Nagar, New Delhi');
  const [dropAddress, setDropAddress] = useState('IGI Airport Terminal 3, New Delhi');
  const [landmark, setLandmark] = useState(user?.landmark || 'Near Metro Gate No. 2');
  const [userCoords, setUserCoords] = useState(user?.coords || null);

  const matchedCoop = useMemo(() => getHyperLocalCooperative(address || user?.address), [address, user?.address]);

  // Auto-acquire live GPS on mount if supported
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ latitude, longitude });
        },
        (err) => {},
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
      );
    }
  }, []);

  // Trade-Specific Dynamic State
  const [tradeSubtype, setTradeSubtype] = useState('');
  const [tradeScope2, setTradeScope2] = useState('');
  const [tradeScope3, setTradeScope3] = useState('');

  // Auto-select first chip when language or trade changes if not set
  useEffect(() => {
    if (localizedQuestions?.q1Chips?.length > 0 && !tradeSubtype) {
      setTradeSubtype(localizedQuestions.q1Chips[0]);
    }
    if (localizedQuestions?.q2Chips?.length > 0 && !tradeScope2) {
      setTradeScope2(localizedQuestions.q2Chips[0]);
    }
    if (localizedQuestions?.q3Chips?.length > 0 && !tradeScope3) {
      setTradeScope3(localizedQuestions.q3Chips[0]);
    }
  }, [localizedQuestions]);

  // Driver Service Config
  const [driverBookingMode, setDriverBookingMode] = useState('driver_only');
  const [carSeaterType, setCarSeaterType] = useState('5_seater');
  const [tripType, setTripType] = useState('City Commute (2 hrs)');
  const [transmissionType, setTransmissionType] = useState('Manual (MT)');

  const driverTripPlans = useMemo(() => {
    if (driverBookingMode === 'car_with_driver') {
      if (carSeaterType === '7_seater') {
        return [
          { id: 't1', label: 'City Commute (2 hrs)', price: 899, sub: '20 km included • 7 Seater' },
          { id: 't2', label: 'Full Day City (8 hrs)', price: 2499, sub: '80 km included • 7 Seater' },
          { id: 't3', label: 'Airport Transfer', price: 1199, sub: 'Toll & AC included • 7 Seater' },
          { id: 't4', label: 'Outstation Round-Trip', price: 3799, sub: 'Per day / 250 km • 7 Seater' }
        ];
      }
      return [
        { id: 't1', label: 'City Commute (2 hrs)', price: 599, sub: '20 km included • 5 Seater' },
        { id: 't2', label: 'Full Day City (8 hrs)', price: 1799, sub: '80 km included • 5 Seater' },
        { id: 't3', label: 'Airport Transfer', price: 799, sub: 'Toll & AC included • 5 Seater' },
        { id: 't4', label: 'Outstation Round-Trip', price: 2799, sub: 'Per day / 250 km • 5 Seater' }
      ];
    }
    const extraSuv = carSeaterType === '7_seater' ? 100 : 0;
    const extraTrans = (transmissionType?.includes('Automatic') || transmissionType?.includes('EV')) ? 100 : 0;
    return [
      { id: 't1', label: 'City Commute (2 hrs)', price: 199 + extraSuv + extraTrans, sub: 'Labour only' },
      { id: 't2', label: 'Full Day City (8 hrs)', price: 699 + extraSuv + extraTrans, sub: 'Labour only' },
      { id: 't3', label: 'Airport Transfer', price: 299 + extraSuv + extraTrans, sub: 'Labour only' },
      { id: 't4', label: 'Outstation Round-Trip', price: 1199 + extraSuv + extraTrans, sub: 'Labour only' }
    ];
  }, [driverBookingMode, carSeaterType, transmissionType]);

  const POPULAR_DROP_LOCATIONS = [
    'IGI Airport Terminal 3',
    'Cyber Hub, Gurugram',
    'Max Super Speciality Hospital, Saket',
    'New Delhi Railway Station',
    'Select Citywalk, Saket'
  ];

  const [description, setDescription] = useState(
    emergencyIssue
      ? `Emergency SOS: ${emergencyIssue} requiring immediate priority dispatch.`
      : ''
  );

  const [pickedImage, setPickedImage] = useState(null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [type, setType] = useState(bookingType);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Multi-Worker Selection for Cleaner (s3) and Gardener (s10) in Solo Mode (1 to 3 workers)
  const [workerCount, setWorkerCount] = useState(1);

  // First-Time Automatic Permissions Consent Prompt
  useEffect(() => {
    if (permissions && !permissions.hasRequestedFirstTime) {
      const timer = setTimeout(() => {
        setPermissionsModalVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [permissions?.hasRequestedFirstTime]);

  const handleOpenMediaModal = () => {
    if (permissions && (!permissions.camera || !permissions.media)) {
      setPermissionsModalVisible(true);
      return;
    }
    setMediaModalVisible(true);
  };

  const handleAddMedia = (newMedia) => {
    const item = {
      id: 'media_' + Date.now(),
      ...newMedia
    };
    setMediaAttachments((prev) => [...prev, item]);
    if (newMedia.type === 'photo') {
      setPickedImage(newMedia.uri);
    }
  };

  const handleRemoveMedia = (id) => {
    setMediaAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveVoiceNote = (note) => {
    setVoiceNote(note);
    if (!description.trim() && note.transcription) {
      setDescription(note.transcription);
    }
  };

  const handleDeleteVoiceNote = () => {
    setVoiceNote(null);
  };

  // Separate Date & Time selectors
  const DATES = [
    { id: 'd1', label: 'Today (31 Aug)', day: 'Today' },
    { id: 'd2', label: 'Tomorrow (1 Sep)', day: 'Tomorrow' },
    { id: 'd3', label: 'Wed (2 Sep)', day: 'Wed' },
    { id: 'd4', label: 'Sat (5 Sep)', day: 'Sat' }
  ];

  const TIMES = [
    '09:30 AM',
    '11:30 AM',
    '02:00 PM',
    '04:30 PM',
    '06:30 PM'
  ];

  const [selectedDate, setSelectedDate] = useState(DATES[0].label);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  // Bulk Cost Estimation Algorithm
  const bulkEstimation = useMemo(() => {
    let crewSize = 3;
    let days = 2;
    let minCost = 3500;
    let maxCost = 5500;
    let desc = '';

    const isLabourOnly = selectedMaterialIndex === 0;
    const isPremium = selectedMaterialIndex === 2;

    switch (serviceId) {
      case 's1':
        if (selectedScaleIndex === 0) {
          crewSize = isLabourOnly ? 2 : 3; days = 2;
          minCost = isLabourOnly ? 3500 : isPremium ? 12500 : 7500;
          maxCost = isLabourOnly ? 5000 : isPremium ? 16500 : 10500;
          desc = '1 Bathroom Overhaul: Concealed CPVC hot & cold line, angle valves & diverter pressure test.';
        } else if (selectedScaleIndex === 1) {
          crewSize = 3; days = 3;
          minCost = isLabourOnly ? 7000 : isPremium ? 24000 : 15000;
          maxCost = isLabourOnly ? 9500 : isPremium ? 32000 : 20000;
          desc = '2 Bathrooms + Kitchen: Complete repiping with ISI Astral/Ashirvad CPVC & brass valves.';
        } else if (selectedScaleIndex === 2) {
          crewSize = 5; days = 4;
          minCost = isLabourOnly ? 12000 : isPremium ? 38000 : 25000;
          maxCost = isLabourOnly ? 16000 : isPremium ? 48000 : 34000;
          desc = '3 Bathrooms + Kitchen + Tank: Multi-port manifold, booster pumps and risers.';
        } else {
          crewSize = 7; days = 6;
          minCost = isLabourOnly ? 22000 : isPremium ? 65000 : 45000;
          maxCost = isLabourOnly ? 30000 : isPremium ? 85000 : 58000;
          desc = 'Full Villa / Society Water Infrastructure: Multi-floor risers & booster pumps.';
        }
        break;

      case 's2':
        if (selectedScaleIndex === 0) {
          crewSize = isLabourOnly ? 2 : 3; days = 2;
          minCost = isLabourOnly ? 4500 : isPremium ? 18000 : 9500;
          maxCost = isLabourOnly ? 6500 : isPremium ? 24000 : 13500;
          desc = '1 BHK Complete Rewiring: FRLS copper wire pulling, DB dressing with RCCB & load balancing.';
        } else if (selectedScaleIndex === 1) {
          crewSize = 3; days = 3;
          minCost = isLabourOnly ? 8500 : isPremium ? 32000 : 18000;
          maxCost = isLabourOnly ? 11500 : isPremium ? 42000 : 24000;
          desc = '2 BHK Complete Rewiring: Dedicated AC lines, Havells/Polycab FRLS cables & 6-Way DB.';
        } else if (selectedScaleIndex === 2) {
          crewSize = 5; days = 4;
          minCost = isLabourOnly ? 14000 : isPremium ? 52000 : 30000;
          maxCost = isLabourOnly ? 19000 : isPremium ? 68000 : 38000;
          desc = '3 BHK Full Electrical Grid: Double door DB, 3 AC loops & inverter dual circuit.';
        } else {
          crewSize = 7; days = 6;
          minCost = isLabourOnly ? 24000 : isPremium ? 85000 : 48000;
          maxCost = isLabourOnly ? 32000 : isPremium ? 115000 : 62000;
          desc = 'Full Villa / Society 3-Phase: 3-Phase 415V distribution, dual DB & chemical earthing pit.';
        }
        break;

      default:
        crewSize = 3; days = 2; minCost = 4500; maxCost = 7500;
        desc = 'Multi-Artisan Cooperative Project Deployment under District Ward Coordinator.';
    }

    const midCost = Math.round((minCost + maxCost) / 2);
    const workerWage = Math.round(midCost * 0.8);
    const welfare = Math.round(midCost * 0.1);
    const coopOps = Math.round(midCost * 0.06);
    const platform = Math.round(midCost * 0.04);

    const advancePercent = isLabourOnly ? 25 : isPremium ? 50 : 40;
    const advanceMin = Math.round(minCost * (advancePercent / 100));
    const advanceMax = Math.round(maxCost * (advancePercent / 100));
    const advanceMid = Math.round(midCost * (advancePercent / 100));
    const midMilestone = Math.round(midCost * 0.35);
    const finalMilestone = Math.max(midCost - advanceMid - midMilestone, 0);

    return {
      crewSize,
      days,
      minCost,
      maxCost,
      midCost,
      workerWage,
      welfare,
      coopOps,
      platform,
      advancePercent,
      advanceMin,
      advanceMax,
      advanceMid,
      midMilestone,
      finalMilestone,
      desc
    };
  }, [serviceId, selectedScaleIndex, selectedMaterialIndex]);

  const handleGpsAutoFill = async (isPickup = false) => {
    if (permissions && !permissions.location) {
      setPermissionsModalVisible(true);
      return;
    }
    setIsGpsLoading(true);
    try {
      const loc = await fetchRealDoorstepLocation();
      if (loc.success) {
        const detectedAddress = loc.formattedAddress || `${loc.locality}, ${loc.city}, ${loc.stateName} - ${loc.pincode}`;
        setUserCoords({ latitude: loc.latitude, longitude: loc.longitude });
        if (isPickup || isDriverService) {
          setPickupAddress(detectedAddress);
          setAddress(detectedAddress);
        } else {
          setAddress(detectedAddress);
        }
        if (loc.landmark) {
          setLandmark(loc.landmark);
        }
        setIsGpsLoading(false);
        Alert.alert(
          'Live GPS Location Locked 📍',
          `Detected: ${loc.locality}, ${loc.city} (Accuracy ±${loc.accuracy}m).\nAddress updated automatically.`
        );
      }
    } catch (err) {
      setIsGpsLoading(false);
      console.warn('GPS location fetch error:', err);
      Alert.alert(
        'Location Access Required',
        'Please enable Location / GPS permission in your browser or device so UniServ can automatically fetch your exact doorstep address.'
      );
    }
  };

  const isEmergency = type === 'emergency';
  const isMultiWorkerEligible = serviceId === 's3' || serviceId === 's10';
  const extraWorkerRate = serviceId === 's3' ? 199 : 149;
  const extraWorkerCost = (isMultiWorkerEligible && scaleMode === 'solo' && workerCount > 1)
    ? (workerCount - 1) * extraWorkerRate
    : 0;

  const singleWorkerBaseRate = getDynamicSoloPrice(
    serviceId,
    tradeSubtype,
    tradeScope2,
    tradeScope3,
    tripType,
    transmissionType,
    service?.start_price || 149,
    driverBookingMode,
    carSeaterType
  );
  const baseRate = singleWorkerBaseRate + extraWorkerCost;
  const emergencySurge = isEmergency ? 100 : 0;
  const welcomeDiscount = isFirstTimeUser ? FIRST_TIME_DISCOUNT : 0;
  const cancellationPenalty = pendingCancellationFee > 0 ? Number(pendingCancellationFee) : 0;
  const finalPayable = Math.max(baseRate + emergencySurge + cancellationPenalty - welcomeDiscount, 49);

  const selectedScaleObj = localizedBulkConfig.scales[selectedScaleIndex] || localizedBulkConfig.scales[0];
  const selectedMaterialObj = localizedBulkConfig.materials[selectedMaterialIndex] || localizedBulkConfig.materials[0];

  const handleScheduleInspection = () => {
    const ticket = submitCommunityBulkRequest({
      society_name: user?.name ? `${user.name}'s Property (${selectedScaleObj.label})` : `Residential Project (${selectedScaleObj.label})`,
      service_title: `${localizedServiceName} Bulk Project: ${selectedScaleObj.label} (${selectedMaterialObj.label})`,
      cooperative: matchedCoop.name,
      contact_person: user?.name || 'Priya Sharma',
      phone: user?.phone || '9876543210',
      target_date: type === 'scheduled' ? selectedDate : 'Tomorrow, 10:00 AM',
      units_estimate: `${selectedScaleObj.label} • Est ₹${bulkEstimation.minCost.toLocaleString()} - ₹${bulkEstimation.maxCost.toLocaleString()}`
    });
    setInspectionTicket(ticket);
    setInspectionSuccessModal(true);
  };

  const handleBookBulkWithAdvance = () => {
    if (isDriverService && (!pickupAddress.trim() || !dropAddress.trim())) {
      Alert.alert('Incomplete Route', 'Please enter both Pickup and Drop locations for the fleet.');
      return;
    }

    const compiledNotes = isDriverService
      ? `Bulk Fleet Route: ${pickupAddress} to ${dropAddress} (${selectedScaleObj.label}, ${selectedMaterialObj.label})`
      : `Bulk Project Scope: ${selectedScaleObj.label} (${selectedMaterialObj.label}). ${description || bulkEstimation.desc}`;

    createBooking({
      service,
      is_bulk_project: true,
      scale_mode: 'bulk',
      base_amount: bulkEstimation.advanceMid,
      advance_amount: bulkEstimation.advanceMid,
      total_project_cost: bulkEstimation.midCost,
      min_cost: bulkEstimation.minCost,
      max_cost: bulkEstimation.maxCost,
      advance_percent: bulkEstimation.advancePercent,
      mid_milestone: bulkEstimation.midMilestone,
      final_milestone: bulkEstimation.finalMilestone,
      crew_size: bulkEstimation.crewSize,
      estimated_days: bulkEstimation.days,
      scale_label: selectedScaleObj.label,
      scale_sub: selectedScaleObj.sub,
      material_label: selectedMaterialObj.label,
      material_sub: selectedMaterialObj.sub,
      trade_subtype: `Bulk: ${selectedScaleObj.label}`,
      trade_scope: selectedMaterialObj.label,
      trade_details: `${selectedMaterialObj.sub} • ${bulkEstimation.crewSize} Artisans for ${bulkEstimation.days} Days`,
      address: isDriverService ? `Pickup: ${pickupAddress} → Drop: ${dropAddress}` : address,
      pickup_address: isDriverService ? pickupAddress : address,
      drop_address: isDriverService ? dropAddress : null,
      trip_type: isDriverService ? selectedScaleObj.label : null,
      transmission: isDriverService ? selectedMaterialObj.label : null,
      landmark,
      description: compiledNotes,
      photo: mediaAttachments.find(m => m.type === 'photo')?.uri || pickedImage,
      video_clip: mediaAttachments.find(m => m.type === 'video') || null,
      voice_note: voiceNote,
      attachments: [
        ...mediaAttachments,
        ...(voiceNote ? [voiceNote] : [])
      ],
      booking_type: type,
      scheduled_date: type === 'scheduled' ? selectedDate : 'Tomorrow',
      scheduled_time: type === 'scheduled' ? selectedTime : '10:00 AM - 12:00 PM',
    });

    navigation.navigate('BulkPayment');
  };

  const handleFindWorker = () => {
    if (isDriverService && (!pickupAddress.trim() || !dropAddress.trim())) {
      Alert.alert('Incomplete Route', 'Please enter both Pickup and Drop locations for the driver.');
      return;
    }

    if (scaleMode === 'bulk') {
      handleBookBulkWithAdvance();
      return;
    }

    const compiledNotes = isDriverService
      ? `Driver Mode: ${driverBookingMode === 'car_with_driver' ? `Car with Driver (${carSeaterType === '5_seater' ? '5 Seater AC Sedan' : '7 Seater SUV/MUV'})` : `Driver Only (${transmissionType})`} | Route: ${pickupAddress} to ${dropAddress} (${tripType})`
      : `${tradeSubtype ? `Category Focus: ${tradeSubtype}. ` : ''}${tradeScope2 ? `Setup: ${tradeScope2}. ` : ''}${description || 'Standard repair request.'}`;

    createBooking({
      service,
      is_bulk_project: false,
      scale_mode: 'solo',
      worker_count: isMultiWorkerEligible ? workerCount : 1,
      single_worker_base: singleWorkerBaseRate,
      extra_worker_cost: extraWorkerCost,
      extra_worker_rate: extraWorkerRate,
      address: isDriverService ? `Pickup: ${pickupAddress} → Drop: ${dropAddress}` : address,
      pickup_address: isDriverService ? pickupAddress : address,
      drop_address: isDriverService ? dropAddress : null,
      user_coords: userCoords,
      driver_booking_mode: isDriverService ? driverBookingMode : null,
      car_seater_type: isDriverService ? carSeaterType : null,
      car_seater_label: isDriverService
        ? (carSeaterType === '5_seater'
            ? (driverBookingMode === 'car_with_driver' ? '5 Seater AC Sedan (Swift Dzire / Etios)' : '5 Seater Car (Hatchback/Sedan)')
            : (driverBookingMode === 'car_with_driver' ? '7 Seater SUV / MUV (Ertiga / Innova)' : '7 Seater SUV / MUV'))
        : null,
      trip_type: isDriverService ? tripType : null,
      transmission: isDriverService && driverBookingMode === 'driver_only' ? transmissionType : null,
      landmark,
      trade_subtype: isDriverService
        ? (driverBookingMode === 'car_with_driver'
            ? `Car + Driver (${carSeaterType === '5_seater' ? '5 Seater AC Sedan' : '7 Seater SUV/MUV'})`
            : `Driver Only (${carSeaterType === '5_seater' ? '5 Seater' : '7 Seater SUV'} • ${transmissionType})`)
        : tradeSubtype,
      trade_scope: isDriverService ? tripType : tradeScope2,
      trade_details: isDriverService
        ? (driverBookingMode === 'car_with_driver'
            ? `Commercial AC Cab (${carSeaterType === '5_seater' ? '5 Seater' : '7 Seater'}) with Fuel & Toll`
            : `Customer Vehicle (${carSeaterType === '5_seater' ? '5 Seater' : '7 Seater SUV'})`)
        : tradeScope3,
      description: compiledNotes,
      photo: mediaAttachments.find(m => m.type === 'photo')?.uri || pickedImage,
      video_clip: mediaAttachments.find(m => m.type === 'video') || null,
      voice_note: voiceNote,
      attachments: [
        ...mediaAttachments,
        ...(voiceNote ? [voiceNote] : [])
      ],
      booking_type: type,
      scheduled_date: type === 'scheduled' ? selectedDate : null,
      scheduled_time: type === 'scheduled' ? selectedTime : null,
      base_amount: baseRate,
      emergency_surge: emergencySurge,
      discount_applied: welcomeDiscount
    });

    navigation.navigate('WorkerMatch', { service, bookingType: type, isBulkProject: false });
  };

  // Render trade-specific diagnosis fields for SOLO mode
  const renderTradeSpecificFields = () => {
    if (isDriverService) return null;
    return (
      <View style={styles.tradeCard}>
        <Text style={styles.tradeCardTitle}>{localizedQuestions.cardTitle}</Text>
        
        {/* Question 1: Specific Issue */}
        <Text style={styles.tradeSubLabel}>
          {localizedQuestions.q1Label} <Text style={styles.requiredStar}>* (Mandatory)</Text>
        </Text>
        <View style={styles.chipsRow}>
          {(localizedQuestions.q1Chips || []).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tradeChip, tradeSubtype === item && styles.tradeChipActive]}
              onPress={() => setTradeSubtype(item)}
            >
              <Text style={[styles.tradeChipText, tradeSubtype === item && styles.tradeChipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tradeSubtype && (tradeSubtype.includes('Other') || tradeSubtype.includes('மற்றவை') || tradeSubtype.includes('अन्य')) && (
          <View style={styles.otherRequiredBanner}>
            <Ionicons name="information-circle" size={16} color={colors.primary} />
            <Text style={styles.otherRequiredText}>
              Please describe your custom problem below in the <Text style={{ fontWeight: '800' }}>Work Description</Text> box or record a <Text style={{ fontWeight: '800' }}>Voice Note</Text>.
            </Text>
          </View>
        )}

        {/* Question 2 */}
        {localizedQuestions.q2Label && localizedQuestions.q2Chips && (
          <>
            <Text style={[styles.tradeSubLabel, { marginTop: 10 }]}>{localizedQuestions.q2Label}</Text>
            <View style={styles.chipsRow}>
              {localizedQuestions.q2Chips.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.tradeChip, tradeScope2 === loc && styles.tradeChipActive]}
                  onPress={() => setTradeScope2(loc)}
                >
                  <Text style={[styles.tradeChipText, tradeScope2 === loc && styles.tradeChipTextActive]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Question 3 */}
        {localizedQuestions.q3Label && localizedQuestions.q3Chips && (
          <>
            <Text style={[styles.tradeSubLabel, { marginTop: 10 }]}>{localizedQuestions.q3Label}</Text>
            <View style={styles.chipsRow}>
              {localizedQuestions.q3Chips.map((mat) => (
                <TouchableOpacity
                  key={mat}
                  style={[styles.tradeChip, tradeScope3 === mat && styles.tradeChipActive]}
                  onPress={() => setTradeScope3(mat)}
                >
                  <Text style={[styles.tradeChipText, tradeScope3 === mat && styles.tradeChipTextActive]}>{mat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={`${localizedServiceName} • ${t('bookingRequest') || 'Booking'}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Work Scale Selector Tabs */}
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleHeading}>{t('chooseWorkScale')}</Text>
          <View style={styles.scaleTabsRow}>
            <TouchableOpacity
              style={[styles.scaleTab, scaleMode === 'solo' && styles.scaleTabActive]}
              onPress={() => setScaleMode('solo')}
              activeOpacity={0.8}
            >
              <View style={[styles.scaleIconCircle, scaleMode === 'solo' && styles.scaleIconCircleActive]}>
                <Ionicons
                  name="person"
                  size={15}
                  color={scaleMode === 'solo' ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.scaleTextCol}>
                <Text style={[styles.scaleTabText, scaleMode === 'solo' && styles.scaleTabTextActive]} numberOfLines={1}>
                  {isDriverService ? 'Solo / City Route' : t('soloMinorRepair')}
                </Text>
                <Text style={styles.scaleTabSub} numberOfLines={1}>
                  {isDriverService ? 'Single trip / 2–8 hrs' : t('singleFixtureHours')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.scaleTab, scaleMode === 'bulk' && styles.scaleTabActive]}
              onPress={() => setScaleMode('bulk')}
              activeOpacity={0.8}
            >
              <View style={[styles.scaleIconCircle, scaleMode === 'bulk' && styles.scaleIconCircleActive]}>
                <Ionicons
                  name="people"
                  size={16}
                  color={scaleMode === 'bulk' ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.scaleTextCol}>
                <Text style={[styles.scaleTabText, scaleMode === 'bulk' && styles.scaleTabTextActive]} numberOfLines={1}>
                  {isDriverService ? 'Valet & Fleet Squad' : t('fullPropertyBulk')}
                </Text>
                <Text style={styles.scaleTabSub} numberOfLines={1}>
                  {isDriverService ? 'Multi-driver (3–6 fleet)' : t('multiArtisanCrew')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Dynamic Bulk Project Estimator */}
        {scaleMode === 'bulk' ? (
          <View style={styles.bulkProjectCard}>
            <View style={styles.bulkProjectHeader}>
              <View style={styles.bulkIconBadge}>
                <Ionicons name="calculator" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.bulkTag}>{t('aiBulkEstimator')}</Text>
                <Text style={styles.bulkTitle}>
                  {localizedServiceName} {t('bulkCalculatorTitle')}
                </Text>
              </View>
            </View>

            {/* Dynamic Step 1: Trade Specific Scale Chips */}
            <Text style={styles.bulkInputLabel}>{localizedBulkConfig.scaleHeading}</Text>
            <View style={styles.scaleChipsGrid}>
              {localizedBulkConfig.scales.map((sc, idx) => {
                const isSelected = selectedScaleIndex === idx;
                return (
                  <TouchableOpacity
                    key={sc.id}
                    style={[styles.tradeScaleCard, isSelected && styles.tradeScaleCardActive]}
                    onPress={() => setSelectedScaleIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tradeScaleLabel, isSelected && styles.tradeScaleLabelActive]}>
                      {sc.label}
                    </Text>
                    <Text style={[styles.tradeScaleSub, isSelected && styles.tradeScaleSubActive]}>
                      {sc.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dynamic Step 2: Trade Specific Material / Supply Options */}
            <Text style={[styles.bulkInputLabel, { marginTop: 14 }]}>
              {localizedBulkConfig.materialHeading}
            </Text>
            <View style={styles.materialCol}>
              {localizedBulkConfig.materials.map((m, idx) => {
                const isSelected = selectedMaterialIndex === idx;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.materialOptionCard, isSelected && styles.materialOptionCardActive]}
                    onPress={() => setSelectedMaterialIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.materialOptionTitle, isSelected && styles.materialOptionTitleActive]}>
                        {m.label}
                      </Text>
                      <Text style={styles.materialOptionSub}>{m.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Real-time Math Estimation Summary Box */}
            <View style={styles.mathSummaryCard}>
              <Text style={styles.mathSummaryTitle}>ESTIMATED COOPERATIVE DEPLOYMENT METRICS</Text>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Ionicons name="people" size={18} color={colors.primary} />
                  <Text style={styles.metricVal}>{bulkEstimation.crewSize} Artisans</Text>
                  <Text style={styles.metricLabel}>Assigned Crew Size</Text>
                </View>

                <View style={styles.metricBox}>
                  <Ionicons name="time" size={18} color={colors.primary} />
                  <Text style={styles.metricVal}>{bulkEstimation.days} Days</Text>
                  <Text style={styles.metricLabel}>Estimated Duration</Text>
                </View>
              </View>

              <Text style={styles.mathDesc}>{bulkEstimation.desc}</Text>

              {/* Price Estimate Range Banner */}
              <View style={styles.costRangeBanner}>
                <View>
                  <Text style={styles.costRangeLabel}>APPROXIMATE ESTIMATED COST</Text>
                  <Text style={styles.costRangeVal}>
                    ₹{bulkEstimation.minCost.toLocaleString()} – ₹{bulkEstimation.maxCost.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.estimateBadge}>
                  <Text style={styles.estimateBadgeText}>Cooperative Rate</Text>
                </View>
              </View>

              {/* 80/10/6/4 Transparent Breakdown */}
              <View style={styles.splitBox}>
                <Text style={styles.splitHeader}>FAIR WAGE ALLOCATION BREAKDOWN (MIDPOINT ₹{bulkEstimation.midCost})</Text>
                <View style={styles.splitRow}>
                  <Text style={styles.splitKey}>• Direct Artisan Team Wages (80%):</Text>
                  <Text style={[styles.splitVal, { color: colors.successDark }]}>₹{bulkEstimation.workerWage.toLocaleString()}</Text>
                </View>
                <View style={styles.splitRow}>
                  <Text style={styles.splitKey}>• Worker Healthcare &amp; Accident Fund (10%):</Text>
                  <Text style={styles.splitVal}>₹{bulkEstimation.welfare.toLocaleString()}</Text>
                </View>
                <View style={styles.splitRow}>
                  <Text style={styles.splitKey}>• District Co-op Reserve &amp; Tool Depot (6%):</Text>
                  <Text style={styles.splitVal}>₹{bulkEstimation.coopOps.toLocaleString()}</Text>
                </View>
                <View style={styles.splitRow}>
                  <Text style={styles.splitKey}>• Platform &amp; Seva Suraksha Pool (4%):</Text>
                  <Text style={styles.splitVal}>₹{bulkEstimation.platform.toLocaleString()}</Text>
                </View>
              </View>

              {/* Direct Instant Booking with Milestone 1 Advance Escrow Box */}
              <View style={styles.directBulkBookingCard}>
                <View style={styles.directBulkHeader}>
                  <View style={styles.directBulkIconCircle}>
                    <Ionicons name="flash" size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.directBulkTag}>INSTANT PROJECT CONFIRMATION</Text>
                    <Text style={styles.directBulkTitle}>Book Project &amp; Lock Milestone 1 Advance</Text>
                  </View>
                </View>

                <Text style={styles.directBulkDesc}>
                  Directly dispatch Master Contractor &amp; {bulkEstimation.crewSize} Artisans for {bulkEstimation.days} days by locking Milestone 1 Advance into Govt SBI MSCS Escrow.
                </Text>

                <TouchableOpacity
                  style={styles.directBulkPayBtn}
                  onPress={handleBookBulkWithAdvance}
                  activeOpacity={0.85}
                >
                  <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.directBulkPayBtnText}>
                    Book Project &amp; Deposit Advance (₹{bulkEstimation.advanceMid.toLocaleString()})
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {/* Solo Trade Specific Diagnosis */}
        {scaleMode === 'solo' && !isDriverService && renderTradeSpecificFields()}

        {/* Multi-Worker Squad Selector (Only for Cleaner and Gardener) */}
        {scaleMode === 'solo' && isMultiWorkerEligible && (
          <View style={styles.multiWorkerCard}>
            <View style={styles.multiWorkerHeader}>
              <View style={styles.multiWorkerIconCircle}>
                <Ionicons name="people" size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.multiWorkerTagRow}>
                  <Text style={styles.multiWorkerTag}>COOPERATIVE SQUAD SIZE</Text>
                  <View style={styles.speedPill}>
                    <Ionicons name="flash" size={10} color="#D97706" />
                    <Text style={styles.speedPillText}>
                      {workerCount === 1 ? 'Standard Speed' : workerCount === 2 ? '2x Faster Work' : '3x Rapid Power Clean'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.multiWorkerTitle}>
                  {serviceId === 's3' ? 'Select Cleaning Artisans (Up to 3)' : 'Select Gardeners (Up to 3)'}
                </Text>
              </View>
            </View>

            {/* Selectable Worker Count Cards */}
            <View style={styles.workerCardsRow}>
              {[1, 2, 3].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.workerSelectCard, workerCount === num && styles.workerSelectCardActive]}
                  onPress={() => setWorkerCount(num)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.workerNumCircle, workerCount === num && styles.workerNumCircleActive]}>
                    <Ionicons name={num === 1 ? 'person' : 'people'} size={16} color={workerCount === num ? '#FFFFFF' : colors.textSecondary} />
                  </View>
                  <Text style={[styles.workerCardCount, workerCount === num && styles.workerCardCountActive]}>
                    {num} {num === 1 ? 'Worker' : 'Workers'}
                  </Text>
                  <Text style={styles.workerCardSpeed}>{num === 1 ? 'Standard Pace' : `⚡ ${num}x Speed`}</Text>
                  <View style={[styles.workerPricePill, workerCount === num && styles.workerPricePillActive]}>
                    <Text style={[styles.workerPriceText, workerCount === num && styles.workerPriceTextActive]}>
                      {num === 1 ? 'Base Rate' : `+₹${extraWorkerRate * (num - 1)}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Driver Solo Booking Section */}
        {scaleMode === 'solo' && isDriverService && (
          <View style={styles.routeCard}>
            <Text style={styles.driverSectionHeading}>1. {t('chooseServiceType') || 'CHOOSE SERVICE TYPE'}</Text>
            <View style={styles.driverModeTabsRow}>
              <TouchableOpacity
                style={[styles.driverModeTab, driverBookingMode === 'driver_only' && styles.driverModeTabActive]}
                onPress={() => setDriverBookingMode('driver_only')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={driverBookingMode === 'driver_only' ? colors.primary : colors.textSecondary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.driverModeTitle, driverBookingMode === 'driver_only' && styles.driverModeTitleActive]}>
                  {t('driverModeDriverOnly')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.driverModeTab, driverBookingMode === 'car_with_driver' && styles.driverModeTabActive]}
                onPress={() => setDriverBookingMode('car_with_driver')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="car"
                  size={16}
                  color={driverBookingMode === 'car_with_driver' ? colors.primary : colors.textSecondary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.driverModeTitle, driverBookingMode === 'car_with_driver' && styles.driverModeTitleActive]}>
                  {t('driverModeCarWithDriver')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Vehicle Capacity Selector (5 / 7 Seater) */}
            <View style={{ marginTop: 14, marginBottom: 8 }}>
              <View style={styles.seaterSectionHeader}>
                <Text style={styles.driverSectionHeading}>2. {t('vehicleTypeSelector') || 'SELECT VEHICLE CAPACITY'}</Text>
                <View style={styles.seaterBadge}>
                  <Text style={styles.seaterBadgeText}>
                    {carSeaterType === '5_seater' ? (t('seater5') || '5 Seater') : (t('seater7') || '7 Seater')}
                  </Text>
                </View>
              </View>

              <View style={styles.seaterTabsRow}>
                {/* 5 Seater */}
                <TouchableOpacity
                  style={[styles.seaterCard, carSeaterType === '5_seater' && styles.seaterCardActive]}
                  onPress={() => setCarSeaterType('5_seater')}
                  activeOpacity={0.8}
                >
                  <View style={styles.seaterCardTop}>
                    <View style={[styles.seaterIconWrap, carSeaterType === '5_seater' && styles.seaterIconWrapActive]}>
                      <Ionicons name="car-sport" size={20} color={carSeaterType === '5_seater' ? '#FFFFFF' : colors.primary} />
                    </View>
                    <View style={[styles.seaterRadio, carSeaterType === '5_seater' && styles.seaterRadioActive]}>
                      {carSeaterType === '5_seater' && <View style={styles.seaterRadioInner} />}
                    </View>
                  </View>
                  <Text style={[styles.seaterTitle, carSeaterType === '5_seater' && styles.seaterTitleActive]}>
                    {t('seater5') || '5 Seater'}
                  </Text>
                  <Text style={styles.seaterSub}>
                    {driverBookingMode === 'car_with_driver'
                      ? (t('seater5Sub') || 'Sedan / Hatchback (Dzire / Etios)')
                      : 'Hatchback / Sedan (Own Car)'}
                  </Text>
                  <View style={[styles.seaterPriceTag, carSeaterType === '5_seater' && styles.seaterPriceTagActive]}>
                    <Text style={[styles.seaterPriceTagText, carSeaterType === '5_seater' && styles.seaterPriceTagTextActive]}>
                      {driverBookingMode === 'car_with_driver' ? 'From ₹599' : 'Standard Rate'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 7 Seater */}
                <TouchableOpacity
                  style={[styles.seaterCard, carSeaterType === '7_seater' && styles.seaterCardActive]}
                  onPress={() => setCarSeaterType('7_seater')}
                  activeOpacity={0.8}
                >
                  <View style={styles.seaterCardTop}>
                    <View style={[styles.seaterIconWrap, carSeaterType === '7_seater' && styles.seaterIconWrapActive]}>
                      <Ionicons name="bus" size={20} color={carSeaterType === '7_seater' ? '#FFFFFF' : colors.primary} />
                    </View>
                    <View style={[styles.seaterRadio, carSeaterType === '7_seater' && styles.seaterRadioActive]}>
                      {carSeaterType === '7_seater' && <View style={styles.seaterRadioInner} />}
                    </View>
                  </View>
                  <Text style={[styles.seaterTitle, carSeaterType === '7_seater' && styles.seaterTitleActive]}>
                    {t('seater7') || '7 Seater'}
                  </Text>
                  <Text style={styles.seaterSub}>
                    {driverBookingMode === 'car_with_driver'
                      ? (t('seater7Sub') || 'SUV / MUV (Ertiga / Innova / Carens)')
                      : 'SUV / MUV (+₹100 Heavy Car)'}
                  </Text>
                  <View style={[styles.seaterPriceTag, carSeaterType === '7_seater' && styles.seaterPriceTagActive]}>
                    <Text style={[styles.seaterPriceTagText, carSeaterType === '7_seater' && styles.seaterPriceTagTextActive]}>
                      {driverBookingMode === 'car_with_driver' ? 'From ₹899' : '+₹100 SUV Surcharge'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Trip Package Selection */}
            <View style={{ marginTop: 12, marginBottom: 8 }}>
              <Text style={styles.driverSectionHeading}>3. {t('selectTripPlan') || 'SELECT TRIP PACKAGE'}</Text>
              <View style={styles.tripPlansGrid}>
                {driverTripPlans.map((plan) => {
                  const isPlanSelected = tripType === plan.label;
                  return (
                    <TouchableOpacity
                      key={plan.id}
                      style={[styles.tripPlanCard, isPlanSelected && styles.tripPlanCardActive]}
                      onPress={() => setTripType(plan.label)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.tripPlanLabel, isPlanSelected && styles.tripPlanLabelActive]}>
                          {plan.label}
                        </Text>
                        <Text style={styles.tripPlanSub}>{plan.sub}</Text>
                      </View>
                      <View style={[styles.tripPlanPriceBadge, isPlanSelected && styles.tripPlanPriceBadgeActive]}>
                        <Text style={[styles.tripPlanPriceText, isPlanSelected && styles.tripPlanPriceTextActive]}>
                          ₹{plan.price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Vehicle Transmission (If driver_only) */}
            {driverBookingMode === 'driver_only' && (
              <View style={{ marginTop: 12, marginBottom: 8 }}>
                <Text style={styles.driverSectionHeading}>4. {t('vehicleTransmission') || 'VEHICLE TRANSMISSION'}</Text>
                <View style={styles.transRow}>
                  {['Manual (MT)', 'Automatic (AT)', 'Electric (EV)'].map((trans) => {
                    const isSelected = transmissionType === trans;
                    return (
                      <TouchableOpacity
                        key={trans}
                        style={[styles.transChip, isSelected && styles.transChipActive]}
                        onPress={() => setTransmissionType(trans)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={trans.includes('Manual') ? 'git-commit-outline' : trans.includes('Automatic') ? 'speedometer-outline' : 'flash-outline'}
                          size={14}
                          color={isSelected ? colors.primary : colors.textSecondary}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.transChipText, isSelected && styles.transChipTextActive]}>
                          {trans}
                        </Text>
                        {(trans.includes('Automatic') || trans.includes('Electric')) && (
                          <Text style={[styles.transExtraText, isSelected && styles.transExtraTextActive]}>+₹100</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 5. Trip Route (Pickup & Drop) */}
            <View style={[styles.routeCardHeader, { marginTop: 14 }]}>
              <Text style={styles.routeCardTitle}>
                {driverBookingMode === 'driver_only' ? '5.' : '4.'} {t('pickupAddress')} &amp; {t('dropAddress')}
              </Text>
              <TouchableOpacity style={styles.gpsSmallBtn} onPress={() => handleGpsAutoFill(true)} disabled={isGpsLoading}>
                <Ionicons name="navigate" size={12} color={colors.successDark} />
                <Text style={styles.gpsSmallBtnText}>GPS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.routeTimeline}>
              <View style={styles.timelineInputBox}>
                <Text style={styles.timelineLabel}>{t('pickupAddress')}</Text>
                <TextInput
                  style={styles.timelineInput}
                  value={pickupAddress}
                  onChangeText={setPickupAddress}
                  placeholder="Enter pickup house/building, street"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={[styles.timelineInputBox, { marginTop: 10 }]}>
                <Text style={[styles.timelineLabel, { color: '#EF4444' }]}>{t('dropAddress')}</Text>
                <TextInput
                  style={styles.timelineInput}
                  value={dropAddress}
                  onChangeText={setDropAddress}
                  placeholder="Enter destination, landmark or airport"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Popular Drop Suggestions */}
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.timelineLabel, { color: colors.textSecondary, marginBottom: 6 }]}>
                POPULAR QUICK DESTINATIONS:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {POPULAR_DROP_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={{
                      backgroundColor: colors.surfaceSecondary,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: colors.border
                    }}
                    onPress={() => setDropAddress(loc)}
                  >
                    <Text style={{ fontSize: 10, color: colors.textPrimary, fontWeight: '600' }}>
                      📍 {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Booking Type Selector (Immediate vs Scheduled) */}
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typePill, type === 'now' && styles.typePillActive]}
            onPress={() => setType('now')}
            activeOpacity={0.8}
          >
            <Ionicons name="time" size={14} color={type === 'now' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.typeText, type === 'now' && styles.typeTextActive]}>
              {scaleMode === 'bulk' ? 'Schedule Site Inspection' : t('bookImmediate')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typePill, type === 'scheduled' && styles.typePillActive]}
            onPress={() => setType('scheduled')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={14} color={type === 'scheduled' ? colors.primary : colors.textSecondary} />
            <Text style={[styles.typeText, type === 'scheduled' && styles.typeTextActive]}>
              {t('scheduleLater')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date & Time Selectors */}
        {type === 'scheduled' && (
          <View style={styles.formSection}>
            <View style={styles.scheduleHeaderRow}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={[styles.sectionLabel, { marginLeft: 6 }]}>Select Target Date</Text>
            </View>
            <View style={styles.datesRow}>
              {DATES.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.dateChip, selectedDate === d.label && styles.dateChipSelected]}
                  onPress={() => setSelectedDate(d.label)}
                >
                  <Text style={[styles.dateChipText, selectedDate === d.label && styles.dateChipTextSelected]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Address Fields (For Non-Driver Services) */}
        {!isDriverService && (
          <View style={styles.formSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>
                {scaleMode === 'bulk' ? 'Site / Property Inspection Address' : t('serviceAddress')}
              </Text>
              <TouchableOpacity style={styles.gpsSmallBtn} onPress={() => handleGpsAutoFill(false)} disabled={isGpsLoading}>
                <Ionicons name="navigate" size={12} color={colors.successDark} />
                <Text style={styles.gpsSmallBtnText}>Use GPS</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={18} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="House/Flat number, building, area"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 12 }]}>{t('landmarkLabel')}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="navigate-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={landmark}
                onChangeText={setLandmark}
                placeholder="e.g. Near Metro Gate 2, 3rd Floor"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        )}

        {/* Multimodal Incident Description & Attachments */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>
              {scaleMode === 'bulk'
                ? 'Project Requirements & Issue Description'
                : t('describeProblem')}
            </Text>
            <TouchableOpacity style={styles.permissionBadgeBtn} onPress={() => setPermissionsModalVisible(true)}>
              <Ionicons name="shield-checkmark" size={12} color={colors.successDark} />
              <Text style={styles.permissionBadgeText}>Permissions Active</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder={t('describePlaceholder')}
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Voice Note Recorder */}
          <View style={{ marginTop: 10 }}>
            <AudioVoiceRecorder
              voiceNote={voiceNote}
              onSaveVoiceNote={handleSaveVoiceNote}
              onDeleteVoiceNote={handleDeleteVoiceNote}
              serviceName={localizedServiceName}
              serviceId={serviceId}
            />
          </View>

          {/* Media Attachments Hub */}
          <View style={styles.mediaHubBox}>
            <View style={styles.mediaHubHeader}>
              <Text style={styles.mediaHubTitle}>ATTACHED PHOTOS &amp; VIDEOS ({mediaAttachments.length})</Text>
              <TouchableOpacity style={styles.addMediaBtn} onPress={handleOpenMediaModal}>
                <Ionicons name="camera" size={14} color={colors.primary} />
                <Text style={styles.addMediaBtnText}>+ Add Photo/Video</Text>
              </TouchableOpacity>
            </View>

            {mediaAttachments.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaThumbScroll}>
                {mediaAttachments.map((item) => (
                  <View key={item.id} style={styles.mediaThumbCard}>
                    <Image source={{ uri: item.uri }} style={styles.mediaThumbImg} />
                    <TouchableOpacity style={styles.removeMediaBtn} onPress={() => handleRemoveMedia(item.id)}>
                      <Ionicons name="close-circle" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Rate Card Summary for Solo */}
        {scaleMode === 'solo' && (
          <View style={styles.estimateBreakdownCard}>
            <Text style={styles.estimateTitle}>{t('priceBreakdown')}</Text>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateKey}>{t('baseServiceRate')}</Text>
              <Text style={styles.estimateVal}>₹{singleWorkerBaseRate}</Text>
            </View>
            {isDriverService && (
              <View style={styles.estimateRow}>
                <Text style={[styles.estimateKey, { color: colors.textSecondary }]}>
                  {driverBookingMode === 'car_with_driver'
                    ? `Car + Driver (${carSeaterType === '5_seater' ? '5 Seater Sedan' : '7 Seater SUV'})`
                    : `Driver Only (${carSeaterType === '5_seater' ? '5 Seater' : '7 Seater'} • ${transmissionType})`}
                </Text>
                <Text style={[styles.estimateVal, { fontWeight: '700' }]}>{tripType}</Text>
              </View>
            )}
            {isMultiWorkerEligible && workerCount > 1 && (
              <View style={styles.estimateRow}>
                <Text style={[styles.estimateKey, { color: colors.primary, fontWeight: '700' }]}>
                  +{workerCount - 1} Extra Artisans
                </Text>
                <Text style={[styles.estimateVal, { color: colors.primary, fontWeight: '800' }]}>
                  +₹{extraWorkerCost}
                </Text>
              </View>
            )}
            {isEmergency && (
              <View style={styles.estimateRow}>
                <Text style={[styles.estimateKey, { color: colors.danger }]}>{t('emergencySurgeFee')}</Text>
                <Text style={[styles.estimateVal, { color: colors.danger }]}>+₹100</Text>
              </View>
            )}
            {isFirstTimeUser && (
              <View style={styles.estimateRow}>
                <Text style={[styles.estimateKey, { color: colors.successDark }]}>{t('firstTimeDiscount')}</Text>
                <Text style={[styles.estimateVal, { color: colors.successDark }]}>-₹{FIRST_TIME_DISCOUNT}</Text>
              </View>
            )}
            {cancellationPenalty > 0 && (
              <View style={styles.estimateRow}>
                <Text style={[styles.estimateKey, { color: colors.danger, fontWeight: '700' }]}>
                  {t('previousCancellationPenalty') || 'Previous Cancellation Fee'}
                </Text>
                <Text style={[styles.estimateVal, { color: colors.danger, fontWeight: '800' }]}>
                  +₹{cancellationPenalty}
                </Text>
              </View>
            )}
            <View style={styles.estimateDivider} />
            <View style={styles.estimateRow}>
              <Text style={styles.estimateTotalKey}>{t('finalPayableAmount')}</Text>
              <Text style={styles.estimateTotalVal}>₹{finalPayable}</Text>
            </View>
          </View>
        )}

        {/* Assurance Banner */}
        <View style={styles.assuranceFooterCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <View style={styles.assuranceTextCol}>
            <Text style={styles.assuranceTitle}>
              {scaleMode === 'bulk' ? 'Cooperative Federation Project Guarantee' : t('coopAssurance')}
            </Text>
            <Text style={styles.assuranceSub}>
              80% direct artisan compensation. Guaranteed Seva Suraksha protection.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Permissions Modal */}
      <PermissionsModal
        visible={permissionsModalVisible}
        onClose={() => setPermissionsModalVisible(false)}
        permissions={permissions}
        onGrantAll={async () => {
          await grantAllPermissions();
          setPermissionsModalVisible(false);
          Alert.alert('Permissions Active 🛡️', 'Device access granted for seamless cooperative service.');
        }}
        onTogglePermission={(key, val) => updatePermission(key, val)}
      />

      {/* Media Capture Modal */}
      <MediaCaptureModal
        visible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        onMediaSelected={handleAddMedia}
      />

      {/* Sticky Bottom Action */}
      <View style={styles.bottomBar}>
        {pendingCancellationFee > 0 && scaleMode !== 'bulk' && (
          <View style={styles.cancellationPenaltyBanner}>
            <Ionicons name="alert-circle" size={15} color="#B91C1C" />
            <Text style={styles.cancellationPenaltyBannerText}>
              Previous cancellation fee (+₹{pendingCancellationFee}) will be added to this booking's final settlement.
            </Text>
          </View>
        )}

        {scaleMode === 'bulk' ? (
          <View style={styles.bulkDualButtonRow}>
            <TouchableOpacity style={styles.bulkInspectBtn} onPress={handleScheduleInspection} activeOpacity={0.8}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.bulkInspectBtnText}>Free Inspection</Text>
                <Text style={styles.bulkInspectBtnSub}>Zero Advance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bulkDirectBookBtn} onPress={handleBookBulkWithAdvance} activeOpacity={0.85}>
              <Text style={styles.bulkDirectBookBtnText}>
                Book Project (₹{bulkEstimation.advanceMid.toLocaleString()})
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.findWorkerBtn} onPress={handleFindWorker} activeOpacity={0.85}>
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.findWorkerBtnText}>
              {t('findVerifiedWorkerBtn') || 'Find Verified Worker'} • ₹{finalPayable}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingTop: 14,
    paddingBottom: 100
  },
  scaleContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  scaleHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  scaleTabsRow: {
    flexDirection: 'row',
    gap: 10
  },
  scaleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  scaleTabActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  scaleIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  scaleIconCircleActive: {
    backgroundColor: colors.primarySubtle
  },
  scaleTextCol: {
    flex: 1
  },
  scaleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  scaleTabTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  scaleTabSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  tradeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  tradeCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  tradeSubLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6
  },
  requiredStar: {
    color: colors.danger,
    fontWeight: '700'
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  tradeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border
  },
  tradeChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  tradeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary
  },
  tradeChipTextActive: {
    color: colors.primary,
    fontWeight: '700'
  },
  otherRequiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6
  },
  otherRequiredText: {
    fontSize: 11,
    color: colors.primary,
    flex: 1
  },
  multiWorkerCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  multiWorkerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  multiWorkerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  multiWorkerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  multiWorkerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary
  },
  speedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3
  },
  speedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309'
  },
  multiWorkerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  workerCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  workerSelectCard: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  workerSelectCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  workerNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  workerNumCircleActive: {
    backgroundColor: colors.primary
  },
  workerCardCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  workerCardCountActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  workerCardSpeed: {
    fontSize: 10,
    color: colors.textSecondary,
    marginVertical: 4
  },
  workerPricePill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  workerPricePillActive: {
    backgroundColor: colors.primarySubtle
  },
  workerPriceText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary
  },
  workerPriceTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  routeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  driverSectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  driverModeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  driverModeTab: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  driverModeTabActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  driverModeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  driverModeTitleActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  seaterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  seaterBadge: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  seaterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  seaterTabsRow: {
    flexDirection: 'row',
    gap: 10
  },
  seaterCard: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  seaterCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  seaterCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  seaterIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  seaterIconWrapActive: {
    backgroundColor: colors.primary
  },
  seaterRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  seaterRadioActive: {
    borderColor: colors.primary
  },
  seaterRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  seaterTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2
  },
  seaterTitleActive: {
    color: colors.primary
  },
  seaterSub: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    marginBottom: 8,
    minHeight: 28
  },
  seaterPriceTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  seaterPriceTagActive: {
    backgroundColor: colors.primary
  },
  seaterPriceTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary
  },
  seaterPriceTagTextActive: {
    color: '#FFFFFF'
  },
  tripPlansGrid: {
    gap: 8
  },
  tripPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  tripPlanCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  tripPlanLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  tripPlanLabelActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  tripPlanSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  tripPlanPriceBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  tripPlanPriceBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  tripPlanPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  tripPlanPriceTextActive: {
    color: '#FFFFFF'
  },
  transRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  transChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  transChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  transChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary
  },
  transChipTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  transExtraText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 4
  },
  transExtraTextActive: {
    color: colors.primary
  },

  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  routeCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  routeTimeline: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 10
  },
  timelineInputBox: {
    flex: 1
  },
  timelineLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2
  },
  timelineInput: {
    fontSize: 13,
    color: colors.textPrimary,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  typePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6
  },
  typePillActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  typeTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  formSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase'
  },
  gpsSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4
  },
  gpsSmallBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successDark
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4
  },
  inputIcon: {
    marginRight: 8
  },
  textInput: {
    flex: 1,
    height: 42,
    fontSize: 13,
    color: colors.textPrimary
  },
  textArea: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70
  },
  permissionBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4
  },
  permissionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark
  },
  mediaHubBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10
  },
  mediaHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  mediaHubTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary
  },
  addMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4
  },
  addMediaBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  mediaThumbScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4
  },
  mediaThumbCard: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden'
  },
  mediaThumbImg: {
    width: '100%',
    height: '100%'
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 9
  },
  estimateBreakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  estimateTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 10
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  estimateKey: {
    fontSize: 13,
    color: colors.textSecondary
  },
  estimateVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary
  },
  estimateDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8
  },
  estimateTotalKey: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  estimateTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary
  },
  assuranceFooterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 12,
    borderRadius: 12,
    gap: 10
  },
  assuranceTextCol: {
    flex: 1
  },
  assuranceTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.successDark
  },
  assuranceSub: {
    fontSize: 11,
    color: colors.successDark,
    marginTop: 2
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
  findWorkerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8
  },
  findWorkerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  bulkDualButtonRow: {
    flexDirection: 'row',
    gap: 10
  },
  bulkInspectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border
  },
  bulkInspectBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  bulkInspectBtnSub: {
    fontSize: 10,
    color: colors.textSecondary
  },
  bulkDirectBookBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12
  },
  bulkDirectBookBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  bulkProjectCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  bulkProjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  bulkIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bulkTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary
  },
  bulkTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  bulkInputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8
  },
  scaleChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  tradeScaleCard: {
    width: '48%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  tradeScaleCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  tradeScaleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  tradeScaleLabelActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  tradeScaleSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  tradeScaleSubActive: {
    color: colors.primary
  },
  materialCol: {
    gap: 8,
    marginBottom: 14
  },
  materialOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  materialOptionCardActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleActive: {
    borderColor: colors.primary
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },
  materialOptionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  materialOptionTitleActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  materialOptionSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  mathSummaryCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12
  },
  mathSummaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textSecondary
  },
  mathDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginVertical: 6
  },
  costRangeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primarySubtle,
    padding: 10,
    borderRadius: 8,
    marginVertical: 8
  },
  costRangeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary
  },
  costRangeVal: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary
  },
  estimateBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  estimateBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  splitBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8,
    marginTop: 8
  },
  splitHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 6
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  splitKey: {
    fontSize: 10,
    color: colors.textSecondary
  },
  splitVal: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary
  },
  directBulkBookingCard: {
    marginTop: 10,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 8
  },
  directBulkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  directBulkIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  directBulkTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary
  },
  directBulkTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  directBulkDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 8
  },
  directBulkPayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8
  },
  directBulkPayBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  datesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border
  },
  dateChipSelected: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary
  },
  dateChipTextSelected: {
    color: colors.primary,
    fontWeight: '800'
  },
  cancellationPenaltyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8
  },
  cancellationPenaltyBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
    lineHeight: 16
  }
});

export default Screen05_BookingForm;
