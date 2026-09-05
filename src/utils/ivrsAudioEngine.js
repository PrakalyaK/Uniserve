/**
 * UniServ National Cooperative IVRS Audio & Telephony Engine
 * 
 * - English: High-Clarity Indian / Global Female Voice (Heera / Neerja / Zira / Jenny / Samantha)
 * - Hindi: Fluent Natural Female Voice (Swara / Kalpana / Google हिन्दी / Lekha)
 * - Tamil: High-Fluency Voice (Google தமிழ் / Valluvar)
 * - Dual Tone Multi-Frequency (DTMF) Sound Synthesizer
 */

// All 10 Services mapped to dialpad digits (1-9, 0)
export const IVRS_SERVICES_MAP = {
  '1': {
    id: 's2',
    name: 'Electrician',
    icon: '⚡',
    tamil: 'மின்சார பழுது (Electrician)',
    hindi: 'इलेक्ट्रीशियन सेवा (Electrician)'
  },
  '2': {
    id: 's1',
    name: 'Plumber',
    icon: '🔧',
    tamil: 'பிளம்பிங் பழுது (Plumber)',
    hindi: 'प्लंबर सेवा (Plumber)'
  },
  '3': {
    id: 's4',
    name: 'Carpentry',
    icon: '🪚',
    tamil: 'தச்சு வேலை (Carpenter)',
    hindi: 'बढ़ई सेवा (Carpenter)'
  },
  '4': {
    id: 's3',
    name: 'Home Cleaning',
    icon: '🧹',
    tamil: 'வீடு சுத்தம் (Cleaning)',
    hindi: 'गृह सफाई सेवा (Cleaning)'
  },
  '5': {
    id: 's5',
    name: 'Painting',
    icon: '🎨',
    tamil: 'வர்ணம் பூசுதல் (Painting)',
    hindi: 'पेंटिंग सेवा (Painting)'
  },
  '6': {
    id: 's6',
    name: 'Caregiver',
    icon: '🤝',
    tamil: 'பராமரிப்பாளர் (Caregiver)',
    hindi: 'देखभालकर्ता सेवा (Caregiver)'
  },
  '7': {
    id: 's7',
    name: 'Technician',
    icon: '🔌',
    tamil: 'டெக்னீசியன் (Technician)',
    hindi: 'तकनीशियन सेवा (Technician)'
  },
  '8': {
    id: 's8',
    name: 'Domestic Helper',
    icon: '🧑‍🍳',
    tamil: 'வீட்டு உதவியாளர் (Domestic Helper)',
    hindi: 'घरेलू सहायक सेवा (Domestic Helper)'
  },
  '9': {
    id: 's9',
    name: 'Driver & Cab',
    icon: '🚗',
    tamil: 'டிரைவர் சேவை (Driver)',
    hindi: 'ड्राइवर सेवा (Driver)'
  },
  '0': {
    id: 's10',
    name: 'Gardening',
    icon: '🌱',
    tamil: 'தோட்ட வேலை (Gardening)',
    hindi: 'बागवानी सेवा (Gardening)'
  }
};

// DTMF Frequencies in Hertz (ITU-T standard)
const DTMF_FREQS = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477]
};

let audioCtx = null;
let cachedVoices = [];

// Pre-load available system voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Plays authentic telephone DTMF tone using Web Audio API
 */
export const playDtmfTone = (digit = '1', durationMs = 150) => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const freqs = DTMF_FREQS[digit] || DTMF_FREQS['1'];
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freqs[0], now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freqs[1], now);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + durationMs / 1000);
    osc2.stop(now + durationMs / 1000);
  } catch (e) {
    console.warn('DTMF sound error:', e);
  }
};

/**
 * Stage 1: Initial Tri-lingual Language Selection Prompt
 */
export const LANGUAGE_SELECTION_PROMPT = {
  displayText:
    "📞 UniServ National Cooperative IVRS Gateway (1800-890-UNISERV)\n\n" +
    "🌐 For English, Press 1.\n" +
    "🇮🇳 தமிழுக்கு எண் இரண்டை அழுத்தவும் (Press 2 for Tamil).\n" +
    "🇮🇳 हिंदी के लिए तीन दबाएं (Press 3 for Hindi).\n" +
    "🔁 To Repeat, Press Star (*).",
  segments: [
    { text: "Welcome to UniServ National Cooperative Toll Free Helpline. For English, press 1.", lang: "en" },
    { text: "யூனிசெர்வ் தேசிய கூட்டுறவு உதவி மையத்திற்கு தங்களை வரவேற்கிறோம். தமிழுக்கு எண் இரண்டை அழுத்தவும்.", lang: "ta" },
    { text: "यूनिसर्व राष्ट्रीय सहकारी हेल्पलाइन में आपका स्वागत है। हिंदी के लिए तीन दबाएं।", lang: "hi" },
    { text: "To repeat this menu, press Star.", lang: "en" }
  ]
};

/**
 * Phonetically fluent, grammatically accurate native scripts
 */
export const IVRS_PROMPTS = {
  en: {
    langLabel: 'English (Female)',
    voiceLocale: 'en-IN',
    greetingRegistered: (name, address) => ({
      displayText: `Welcome, ${name}! Welcome to the UniServ National Cooperative Helpline.\n📍 Registered Address: ${address}`,
      spokenText: `Welcome, ${name}! Welcome to the UniServ National Cooperative Helpline. Your registered address is: ${address}.`
    }),
    servicesMenu: () => ({
      displayText:
        `Select Required Trade Service:\n` +
        `1: Electrician | 2: Plumber | 3: Carpenter | 4: Cleaning | 5: Painting\n` +
        `6: Caregiver | 7: Technician | 8: Domestic Helper | 9: Driver | 0: Gardening\n` +
        `Press Star (*) to repeat. Press Hash (#) to change language.`,
      spokenText:
        `To choose a service: Press 1 for Electrician, 2 for Plumber, 3 for Carpentry, 4 for Home Cleaning, 5 for Painting, 6 for Caregiver, 7 for Technician, 8 for Domestic Helper, 9 for Driver and Cab, and 0 for Gardening. To repeat this menu, press Star. To change language, press Hash.`
    }),
    confirmSelection: (serviceItem, address) => ({
      displayText: `You selected: ${serviceItem.name}.\nPress '1' to confirm dispatch to ${address}.\nPress '*' to repeat. Press '#' to go back.`,
      spokenText: `You have selected: ${serviceItem.name}. Press 1 to confirm dispatch to your registered address at ${address}. To repeat, press Star. To go back, press Hash.`
    }),
    bookingSuccess: (bookingId, workerName, otp) => ({
      displayText: `✅ Booking Confirmed: ${bookingId}\nCooperative Artisan: ${workerName}\nStart OTP: ${otp}\nSMS delivered to your phone.`,
      spokenText: `Thank you! Your booking ${bookingId} is confirmed. Nearest cooperative artisan ${workerName} has been dispatched. Your arrival start OTP is ${otp}. Details sent via SMS. Thank you!`
    }),
    repeatNotice: () => ({
      displayText: `Repeating options for you...`,
      spokenText: `Repeating options for you...`
    }),
    unregisteredGreeting: (phone) => ({
      displayText: `Welcome! Your number ${phone} is not yet registered in UniServ database. Please register at your nearest E-Sevai Maiyam or with a neighbour. Press 9 for live assistance.`,
      spokenText: `Welcome to UniServ. Your mobile number ${phone} is not yet registered. Please register once at your nearest E-Sevai Maiyam or with a neighbour. Press 9 for live assistance.`
    })
  },

  ta: {
    langLabel: 'தமிழ் (Tamil)',
    voiceLocale: 'ta-IN',
    greetingRegistered: (name, address) => ({
      displayText: `வணக்கம் ${name} அவர்களே! யூனிசெர்வ் தேசிய கூட்டுறவு உதவி மையத்திற்கு தங்களை வரவேற்கிறோம்.\n📍 பதிவு செய்யப்பட்ட முகவரி: ${address}`,
      spokenText: `வணக்கம் ${name} அவர்களே! யூனிசெர்வ் தேசிய கூட்டுறவு உதவி மையத்திற்கு தங்களை வரவேற்கிறோம். உங்கள் பதிவு செய்யப்பட்ட முகவரி: ${address}.`
    }),
    servicesMenu: () => ({
      displayText:
        `சேவையை தேர்வு செய்யவும்:\n` +
        `1: மின்சாரம் | 2: பிளம்பிங் | 3: தச்சு | 4: துப்புரவு | 5: பெயிண்டிங்\n` +
        `6: பராமரிப்பாளர் | 7: டெக்னீசியன் | 8: வீட்டு உதவியாளர் | 9: டிரைவர் | 0: தோட்டம்\n` +
        `மீண்டும் கேட்க ஸ்டார் (*) அழுத்தவும். மொழியை மாற்ற (#) அழுத்தவும்.`,
      spokenText:
        `சேவையை தேர்வு செய்யவும்: மின்சார வேலைக்கு ஒன்று, பிளம்பிங் வேலைக்கு இரண்டு, தச்சு வேலைக்கு மூன்று, வீடு சுத்தம் செய்ய நான்கு, பெயிண்டிங் வேலைக்கு ஐந்து, பராமரிப்பாளர் சேவைக்கு ஆறு, டெக்னீசியன் வேலைக்கு ஏழு, வீட்டு உதவியாளருக்கு எட்டு, டிரைவர் சேவைக்கு ஒன்பது, மற்றும் தோட்ட வேலைக்கு பூஜ்ஜியம் அழுத்தவும். இந்த மெனுவை மீண்டும் கேட்க ஸ்டார் (*) அழுத்தவும். மொழியை மாற்ற ஹேஷ்டேக் (#) அழுத்தவும்.`
    }),
    confirmSelection: (serviceItem, address) => ({
      displayText: `நீங்கள் தேர்ந்தெடுத்தது: ${serviceItem.tamil}.\nஉங்கள் முகவரியான ${address} க்கு கைவினைஞரை அனுப்ப '1' அழுத்தவும்.\nமீண்டும் கேட்க '*' அழுத்தவும். பின்செல்ல '#' அழுத்தவும்.`,
      spokenText: `நீங்கள் தேர்ந்தெடுத்த சேவை: ${serviceItem.tamil}. உங்கள் பதிவு செய்யப்பட்ட முகவரியான ${address} க்கு கூட்டுறவு கைவினைஞரை அனுப்ப ஒன்று அழுத்தவும். மீண்டும் கேட்க ஸ்டார் (*) அழுத்தவும். பின்செல்ல ஹேஷ்டேக் (#) அழுத்தவும்.`
    }),
    bookingSuccess: (bookingId, workerName, otp) => ({
      displayText: `✅ முன்பதிவு எண் ${bookingId} உறுதி செய்யப்பட்டது!\nகூட்டுறவு கைவினைஞர்: ${workerName}\nவருகை OTP: ${otp}\nSMS உங்கள் மொபைலுக்கு அனுப்பப்பட்டுள்ளது.`,
      spokenText: `நன்றி! உங்கள் முன்பதிவு எண் ${bookingId} வெற்றிகரமாக உறுதி செய்யப்பட்டது. உங்கள் பகுதி கூட்டுறவு கைவினைஞர் ${workerName} அனுப்பப்பட்டுள்ளார். வருகைக்கான தொடக்க ஓடிபி எண் ${otp}. எஸ்எம்எஸ் உங்கள் மொபைலுக்கு அனுப்பப்பட்டுள்ளது. நன்றி!`
    }),
    repeatNotice: () => ({
      displayText: `விருப்பங்களை மீண்டும் கூறுகிறேன்...`,
      spokenText: `விருப்பங்களை மீண்டும் கூறுகிறேன்...`
    }),
    unregisteredGreeting: (phone) => ({
      displayText: `வணக்கம்! உங்கள் எண் ${phone} பதிவு செய்யப்படவில்லை. இ-சேவை மையம் அல்லது அண்டை வீட்டார் மூலம் பதிவு செய்யவும். உதவிக்கு 9 அழுத்தவும்.`,
      spokenText: `வணக்கம்! உங்கள் மொபைல் எண் ${phone} இன்னும் பதிவு செய்யப்படவில்லை. உங்கள் அருகிலுள்ள இ-சேவை மையம் அல்லது அண்டை வீட்டார் மூலம் பதிவு செய்து எளிதாக முன்பதிவு செய்யலாம். நேரடி உதவிக்கு ஒன்பது அழுத்தவும்.`
    })
  },

  hi: {
    langLabel: 'हिंदी (Hindi Female)',
    voiceLocale: 'hi-IN',
    greetingRegistered: (name, address) => ({
      displayText: `नमस्ते ${name} जी! यूनिसर्व राष्ट्रीय सहकारी हेल्पलाइन में आपका स्वागत है।\n📍 पंजीकृत पता: ${address}`,
      spokenText: `नमस्ते ${name} जी! यूनिसर्व राष्ट्रीय सहकारी हेल्पलाइन में आपका स्वागत है। आपका पंजीकृत पता है: ${address}।`
    }),
    servicesMenu: () => ({
      displayText:
        `सेवा चुनने के लिए:\n` +
        `1: इलेक्ट्रीशियन | 2: प्लंबर | 3: बढ़ई | 4: सफाई | 5: पेंटिंग\n` +
        `6: केयरगिवर | 7: तकनीशियन | 8: घरेलू सहायक | 9: ड्राइवर | 0: बागवानी\n` +
        `दोबारा सुनने के लिए (*) दबाएं। भाषा बदलने के लिए (#) दबाएं।`,
      spokenText:
        `सेवा चुनने के लिए: इलेक्ट्रीशियन के लिए एक, प्लंबर के लिए दो, बढ़ई के लिए तीन, घर की सफाई के लिए चार, पेंटिंग के लिए पांच, केयरगिवर के लिए छह, तकनीशियन के लिए सात, घरेलू सहायक के लिए आठ, ड्राइवर के लिए नौ, और बागवानी के लिए शून्य दबाएं। दोबारा सुनने के लिए स्टार (*) दबाएं। भाषा बदलने के लिए हैश (#) दबाएं।`
    }),
    confirmSelection: (serviceItem, address) => ({
      displayText: `आपने चुना है: ${serviceItem.hindi}.\nअपने पते ${address} पर कारीगर भेजने के लिए '1' दबाएं।\nदोबारा सुनने के लिए '*' दबाएं। पीछे जाने के लिए '#' दबाएं।`,
      spokenText: `आपने चुना है: ${serviceItem.hindi}। अपने पंजीकृत पते ${address} पर सहकारी कारीगर भेजने के लिए एक दबाएं। दोबारा सुनने के लिए स्टार (*) दबाएं। पीछे जाने के लिए हैश (#) दबाएं।`
    }),
    bookingSuccess: (bookingId, workerName, otp) => ({
      displayText: `✅ बुकिंग संख्या ${bookingId} सफल हुई!\nसहकारी कारीगर: ${workerName}\nआगमन OTP: ${otp}\nSMS आपके मोबाइल पर भेज दिया गया है।`,
      spokenText: `धन्यवाद! आपकी बुकिंग संख्या ${bookingId} सफलतापूर्वक दर्ज हो गई है। आपके निकटतम सहकारी कारीगर ${workerName} को भेजा गया है। आगमन ओटीपी ${otp} है। एसएमएस आपके मोबाइल पर भेज दिया गया है। धन्यवाद!`
    }),
    repeatNotice: () => ({
      displayText: `विकल्पों को दोबारा दोहरा रही हूँ...`,
      spokenText: `विकल्पों को दोबारा दोहरा रही हूँ...`
    }),
    unregisteredGreeting: (phone) => ({
      displayText: `नमस्ते! आपका नंबर ${phone} पंजीकृत नहीं है। ई-सेवा केंद्र या पड़ोसी से पंजीकरण करवाएं। सहायता के लिए 9 दबाएं।`,
      spokenText: `नमस्ते! आपका मोबाइल नंबर ${phone} अभी पंजीकृत नहीं है। कृपया नजदीकी ई-सेवा केंद्र या अपने पड़ोसी की मदद से पंजीकरण करवाएं। सीधे सहायता के लिए नौ दबाएं।`
    })
  }
};

/**
 * Explicit list of male voice names to strictly reject when selecting female voices
 */
const MALE_VOICE_NAMES = ['david', 'george', 'mark', 'guy', 'richard', 'ravi', 'male', 'stefan', 'daniel', 'hemant', 'valluvar'];

/**
 * Finds the highest quality native female voice for English & Hindi, and native voice for Tamil
 */
export const getBestVoice = (langCode = 'en') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const code = (langCode || 'en').toLowerCase();

  // 1. ENGLISH (Strict Female Priority)
  if (code.startsWith('en')) {
    // 1A. Known Indian Female Names
    const indianFemale = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return (
        lang.startsWith('en') &&
        (name.includes('heera') || name.includes('neerja') || name.includes('veena') || (lang.startsWith('en-in') && !MALE_VOICE_NAMES.some(m => name.includes(m))))
      );
    });
    if (indianFemale) return indianFemale;

    // 1B. Known Global Female Names (Zira, Jenny, Aria, Samantha, Google UK/US Female, Karen, Victoria)
    const globalFemale = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return (
        lang.startsWith('en') &&
        (name.includes('zira') ||
          name.includes('jenny') ||
          name.includes('aria') ||
          name.includes('samantha') ||
          name.includes('female') ||
          name.includes('karen') ||
          name.includes('victoria') ||
          name.includes('moira') ||
          name.includes('tessa'))
      );
    });
    if (globalFemale) return globalFemale;

    // 1C. Any English voice that does NOT contain male markers
    const nonMale = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('en') && !MALE_VOICE_NAMES.some(m => name.includes(m));
    });
    if (nonMale) return nonMale;

    return voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || null;
  }

  // 2. HINDI (Strict Female Priority)
  if (code.startsWith('hi')) {
    const hiFemale = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      const isHi = lang.startsWith('hi') || name.includes('hindi');
      const isFemale =
        name.includes('swara') ||
        name.includes('kalpana') ||
        name.includes('lekha') ||
        name.includes('female') ||
        name.includes('google');
      return isHi && isFemale && !MALE_VOICE_NAMES.some(m => name.includes(m));
    });
    if (hiFemale) return hiFemale;

    return voices.find(v => (v.lang || '').toLowerCase().startsWith('hi') || (v.name || '').toLowerCase().includes('hindi')) || null;
  }

  // 3. TAMIL
  if (code.startsWith('ta')) {
    const taVoice = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('ta') || name.includes('tamil') || name.includes('valluvar');
    });
    if (taVoice) return taVoice;
  }

  return null;
};

let currentSpeechId = 0;

/**
 * Speaks an IVRS prompt out loud with fluent pronunciation and female voice calibration
 */
export const speakIvrsPrompt = (spokenContent, langCode = 'en', onEnd) => {
  stopIvrsSpeech();

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  const thisSpeechId = ++currentSpeechId;

  // If content has multiple language segments (e.g. Stage 1 Language Selection)
  if (typeof spokenContent === 'object' && Array.isArray(spokenContent.segments)) {
    let segIdx = 0;
    const playNextSegment = () => {
      if (thisSpeechId !== currentSpeechId) return; // Speech was cancelled
      if (segIdx >= spokenContent.segments.length) {
        if (onEnd) onEnd();
        return;
      }
      const segment = spokenContent.segments[segIdx];
      segIdx++;
      speakSingleUtterance(segment.text, segment.lang, playNextSegment, thisSpeechId);
    };
    playNextSegment();
    return;
  }

  const textToSpeak = typeof spokenContent === 'object' ? spokenContent.spokenText : spokenContent;
  speakSingleUtterance(textToSpeak, langCode, onEnd, thisSpeechId);
};

const speakSingleUtterance = (text, langCode, callback, speechId) => {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = langCode.startsWith('ta') ? 'ta-IN' : langCode.startsWith('hi') ? 'hi-IN' : 'en-IN';

    utterance.lang = targetLang;
    utterance.rate = 0.90; // Calm, steady telephony pace
    
    // Female pitch calibration: 1.15 produces a crisp, clear, natural female assistant voice
    utterance.pitch = langCode.startsWith('en') || langCode.startsWith('hi') ? 1.15 : 1.0;
    utterance.volume = 1.0;

    const bestVoice = getBestVoice(langCode);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      if (speechId && speechId !== currentSpeechId) return;
      if (callback) callback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis utterance error:', e);
      if (speechId && speechId !== currentSpeechId) return;
      if (callback) callback();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (callback) callback();
  }
};

/**
 * Stops ongoing speech immediately
 */
export const stopIvrsSpeech = () => {
  currentSpeechId++;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

export default {
  IVRS_SERVICES_MAP,
  LANGUAGE_SELECTION_PROMPT,
  IVRS_PROMPTS,
  playDtmfTone,
  speakIvrsPrompt,
  stopIvrsSpeech
};
