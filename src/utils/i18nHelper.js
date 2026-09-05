/**
 * UniServ Universal Localization Helper Utility
 * Resolves full localized service objects, descriptions, step-by-step checklists,
 * form components, trade questions, bulk scales, and edge cases across all Indian languages.
 */
import { getLocalizedServiceData } from '../i18n/serviceTranslations.js';
import {
  TRADE_QUESTIONS_TRANSLATIONS,
  BULK_CONFIG_TRANSLATIONS,
  SEVA_SURAKSHA_TRANSLATIONS,
  COMPLAINT_CATEGORIES_TRANSLATIONS,
  RATING_TAGS_TRANSLATIONS
} from '../i18n/tradeQuestionsTranslations.js';

export const SERVICE_NAME_KEY_MAP = {
  s1: 'service_plumber',
  s2: 'service_electrician',
  s3: 'service_cleaner',
  s4: 'service_carpenter',
  s5: 'service_painter',
  s6: 'service_caregiver',
  s7: 'service_technician',
  s8: 'service_domestic_helper',
  s9: 'service_driver',
  s10: 'service_gardener'
};

/**
 * Returns localized service name based on active language function `t` and language code
 */
export const getLocalizedServiceName = (service, t, langCode = 'en') => {
  if (!service) return '';
  const key = SERVICE_NAME_KEY_MAP[service.id];
  if (key && t) {
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  const code = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const localizedData = getLocalizedServiceData(service.id, code);
  if (localizedData?.name) return localizedData.name;

  return service.name || '';
};

/**
 * Returns a fully localized service object merging original IDs and properties
 * with rich translated arrays (What's Included, Step-by-Step, Safety Protocols, Trust Notes)
 */
export const getLocalizedService = (service, t, langCode = 'en') => {
  if (!service) return null;
  const code = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const locData = getLocalizedServiceData(service.id, code);

  return {
    ...service,
    name: locData?.name || (t && SERVICE_NAME_KEY_MAP[service.id] ? t(SERVICE_NAME_KEY_MAP[service.id]) : service.name),
    description: locData?.description || service.description,
    duration: locData?.duration || service.duration,
    included: locData?.included && locData.included.length > 0 ? locData.included : service.included,
    sample_steps: locData?.sample_steps && locData.sample_steps.length > 0 ? locData.sample_steps : service.sample_steps,
    safety_note: locData?.safety_note || service.safety_note,
    trust_note: locData?.trust_note || service.trust_note,
    coop_warranty_title: locData?.coop_warranty_title || 'Cooperative Assurance (Seva Suraksha)',
    coop_warranty_desc: locData?.coop_warranty_desc || 'Includes 7-day free rework warranty. Standard rate card fixed by Government Registered Cooperative Society.',
    coop_fairwage_title: locData?.coop_fairwage_title || 'Cooperative Fair Wage Guarantee',
    coop_fairwage_desc: locData?.coop_fairwage_desc || 'Standardized fair wages fixed by local Labour Cooperative. 80% direct artisan compensation.'
  };
};

/**
 * Resolves trade-specific questions and option chips in chosen language
 */
export const getLocalizedTradeQuestions = (serviceId = 's1', langCode = 'en') => {
  const rawCode = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const code = (rawCode === 'ta' || rawCode === 'hi') ? rawCode : 'en';
  const tradeDef = TRADE_QUESTIONS_TRANSLATIONS[serviceId] || TRADE_QUESTIONS_TRANSLATIONS.s1;

  return {
    cardTitle: tradeDef.cardTitle?.[code] || tradeDef.cardTitle?.en,
    q1Label: tradeDef.q1Label?.[code] || tradeDef.q1Label?.en,
    q1Chips: tradeDef.q1Chips?.[code] || tradeDef.q1Chips?.en,
    q2Label: tradeDef.q2Label?.[code] || tradeDef.q2Label?.en,
    q2Chips: tradeDef.q2Chips?.[code] || tradeDef.q2Chips?.en,
    q3Label: tradeDef.q3Label?.[code] || tradeDef.q3Label?.en,
    q3Chips: tradeDef.q3Chips?.[code] || tradeDef.q3Chips?.en
  };
};

/**
 * Resolves bulk config scale and materials in chosen language
 */
export const getLocalizedTradeBulkConfig = (serviceId = 's1', langCode = 'en') => {
  const rawCode = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const code = (rawCode === 'ta' || rawCode === 'hi') ? rawCode : 'en';
  const rawBulk = BULK_CONFIG_TRANSLATIONS[serviceId] || BULK_CONFIG_TRANSLATIONS.s1;

  return {
    scaleHeading: BULK_CONFIG_TRANSLATIONS.scaleHeading?.[code] || BULK_CONFIG_TRANSLATIONS.scaleHeading?.en,
    materialHeading: BULK_CONFIG_TRANSLATIONS.materialHeading?.[code] || BULK_CONFIG_TRANSLATIONS.materialHeading?.en,
    scales: (rawBulk.scales || []).map((s) => ({
      id: s.id,
      label: s.label?.[code] || s.label?.en,
      sub: s.sub?.[code] || s.sub?.en
    })),
    materials: (rawBulk.materials || []).map((m) => ({
      id: m.id,
      label: m.label?.[code] || m.label?.en,
      sub: m.sub?.[code] || m.sub?.en
    }))
  };
};

/**
 * Resolves Seva Suraksha 9 scenarios in chosen language
 */
export const getLocalizedSevaSurakshaScenarios = (langCode = 'en') => {
  const rawCode = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const code = (rawCode === 'ta' || rawCode === 'hi') ? rawCode : 'en';

  return SEVA_SURAKSHA_TRANSLATIONS.map((sc) => ({
    id: sc.id,
    icon: sc.icon,
    problem: sc.problem?.[code] || sc.problem?.en,
    solution: sc.solution?.[code] || sc.solution?.en,
    tag: sc.tag?.[code] || sc.tag?.en
  }));
};

/**
 * Resolves complaint categories in chosen language
 */
export const getLocalizedComplaintCategories = (langCode = 'en') => {
  const rawCode = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const code = (rawCode === 'ta' || rawCode === 'hi') ? rawCode : 'en';

  return COMPLAINT_CATEGORIES_TRANSLATIONS.map((cat) => ({
    id: cat.id,
    label: cat.label?.[code] || cat.label?.en
  }));
};

/**
 * Resolves rating tags in chosen language
 */
export const getLocalizedRatingTags = (langCode = 'en') => {
  const rawCode = typeof langCode === 'string' ? langCode : (langCode?.code || 'en');
  const code = (rawCode === 'ta' || rawCode === 'hi') ? rawCode : 'en';

  return RATING_TAGS_TRANSLATIONS.map((tag) => ({
    id: tag.id,
    text: tag.text?.[code] || tag.text?.en
  }));
};

export const NOTIFICATIONS_TRANSLATIONS = [
  {
    id: 'n1',
    type: 'warranty',
    title: {
      en: 'Seva Suraksha Active 🛡️',
      ta: 'சேவை பாதுகாப்பு செயல்படுகிறது 🛡️',
      hi: 'सेवा सुरक्षा सक्रिय 🛡️'
    },
    message: {
      en: 'Your plumbing booking #BK84920 is protected under the 7-day cooperative workmanship warranty.',
      ta: 'உங்கள் பிளம்பிங் முன்பதிவு #BK84920 7 நாள் கூட்டுறவு உத்தரவாதத்தின் கீழ் பாதுகாக்கப்பட்டுள்ளது.',
      hi: 'आपकी प्लंबिंग बुकिंग #BK84920 7-दिवसीय सहकारी कारीगरी वारंटी के तहत सुरक्षित है।'
    },
    time: {
      en: '10 mins ago',
      ta: '10 நிமிடங்களுக்கு முன்',
      hi: '10 मिनट पहले'
    },
    read: false
  },
  {
    id: 'n2',
    type: 'payment',
    title: {
      en: 'Fair Wage Transparency Notice',
      ta: 'நேரடி நியாய ஊதிய அறிவிப்பு',
      hi: 'उचित पारदर्शी मजदूरी सूचना'
    },
    message: {
      en: '80% of your previous payment was directly credited to Vikram Singh\'s cooperative account.',
      ta: 'உங்கள் முந்தைய கட்டணத்தின் 80% தொகை நேரடியாக விக்ரம் சிங்கின் கூட்டுறவு கணக்கில் வரவு வைக்கப்பட்டது.',
      hi: 'आपके पिछले भुगतान का 80% सीधे विक्रम सिंह के सहकारी खाते में जमा किया गया।'
    },
    time: {
      en: '2 hours ago',
      ta: '2 மணி நேரத்திற்கு முன்',
      hi: '2 घंटे पहले'
    },
    read: false
  },
  {
    id: 'n3',
    type: 'security',
    title: {
      en: 'Cooperative Verification Passed',
      ta: 'கூட்டுறவு சரிபார்ப்பு நிறைவு',
      hi: 'सहकारी सत्यापन उत्तीर्ण'
    },
    message: {
      en: 'All workers assigned in your locality have completed annual safety & police verification for 2026.',
      ta: 'உங்கள் பகுதியில் உள்ள அனைத்து தொழிலாளர்களும் 2026-ஆம் ஆண்டிற்கான பாதுகாப்பு & போலீஸ் சரிபார்ப்பை முடித்துள்ளனர்.',
      hi: 'आपके क्षेत्र में नियुक्त सभी कारीगरों ने 2026 के लिए वार्षिक सुरक्षा एवं पुलिस सत्यापन पूरा कर लिया है।'
    },
    time: {
      en: 'Yesterday',
      ta: 'நேற்று',
      hi: 'कल'
    },
    read: true
  },
  {
    id: 'n4',
    type: 'info',
    title: {
      en: 'Emergency Priority Network',
      ta: 'அவசர முன்னுரிமை நெட்வொர்க்',
      hi: 'आपातकालीन प्राथमिकता नेटवर्क'
    },
    message: {
      en: '24/7 on-call electrician and plumber network is operational in your municipal zone.',
      ta: 'உங்கள் நகராட்சி மண்டலத்தில் 24/7 எலக்ட்ரீஷியன் மற்றும் பிளம்பர் அவசர சேவை பயன்பாட்டில் உள்ளது.',
      hi: 'आपके नगर निगम क्षेत्र में 24/7 ऑन-कॉल इलेक्ट्रीशियन और प्लंबर नेटवर्क सक्रिय है।'
    },
    time: {
      en: '2 days ago',
      ta: '2 நாட்களுக்கு முன்',
      hi: '2 दिन पहले'
    },
    read: true
  }
];

/**
 * Resolves localized notifications list in chosen language
 */
export const getLocalizedNotifications = (langCode = 'en') => {
  const code = (langCode === 'ta' || langCode === 'hi') ? langCode : 'en';
  return NOTIFICATIONS_TRANSLATIONS.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title?.[code] || n.title?.en,
    message: n.message?.[code] || n.message?.en,
    time: n.time?.[code] || n.time?.en,
    read: n.read
  }));
};

export default {
  SERVICE_NAME_KEY_MAP,
  getLocalizedServiceName,
  getLocalizedService,
  getLocalizedTradeQuestions,
  getLocalizedTradeBulkConfig,
  getLocalizedSevaSurakshaScenarios,
  getLocalizedComplaintCategories,
  getLocalizedRatingTags,
  getLocalizedNotifications
};
