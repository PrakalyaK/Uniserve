/**
 * UniServ Trade Questions, Bulk Configurations & Edge Case Localization Dictionary
 * High-precision multilingual translations for all 10 trades, Seva Suraksha, and Complaints.
 */

export const TRADE_QUESTIONS_TRANSLATIONS = {
  s1: { // Plumber
    cardTitle: {
      en: "PLUMBING SPECIFIC DETAILS (WORKER & USER POV)",
      ta: "பிளம்பிங் விவரங்கள் (பணியாளர் மற்றும் பயனர் கண்ணோட்டம்)",
      hi: "प्लंबिंग विशिष्ट विवरण (कारीगर एवं उपभोक्ता दृष्टिकोण)"
    },
    q1Label: {
      en: "1. Specific Plumbing Issue",
      ta: "1. குறிப்பிட்ட பிளம்பிங் பிரச்சனை",
      hi: "1. विशिष्ट प्लंबिंग समस्या"
    },
    q1Chips: {
      en: [
        'Leaking Tap / Spindle',
        'Drainage / Bottle Trap Block',
        'Flush Tank / Cistern Fault',
        'Shower Mixer / Diverter',
        'Pipe Joint Burst (SOS)',
        'Water Tank Overflow / Ball Valve',
        'Other / Custom Issue'
      ],
      ta: [
        'குழாய் கசிவு / சுழல் பழுது',
        'வடிகால் / பாட்டில் டிராப் அடைப்பு',
        'பிளஷ் தொட்டி / சிஸ்டர்ன் பழுது',
        'ஷவர் மிக்சர் / டைவர்ட்டர்',
        'குழாய் இணைப்பு உடைப்பு (SOS)',
        'தண்ணீர் தொட்டி வழிதல் / பால் வால்வு',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'नल का रिसाव / स्पिंडल',
        'ड्रेनेज / बोतल ट्रैप रुकावट',
        'फ्लश टैंक / सिस्टर्न खराबी',
        'शॉवर मिक्सर / डायवर्टर',
        'पाइप जोड़ फटना (SOS)',
        'पानी की टंकी ओवरफ्लो / बॉल वाल्व',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Fixture Location",
      ta: "2. பொருத்தும் இடம்",
      hi: "2. फिटिंग का स्थान"
    },
    q2Chips: {
      en: ['Kitchen Sink', 'Master Bathroom', 'Common Washroom', 'Terrace / Overhead Tank', 'Main Inlet Pipeline'],
      ta: ['சமையலறை சிங்க்', 'முக்கிய குளியலறை', 'பொது கழிப்பறை', 'மாடி / மேல்நிலை தொட்டி', 'முக்கிய உள்வரும் குழாய்'],
      hi: ['रसोई का सिंक', 'मास्टर बाथरूम', 'सामान्य शौचालय', 'छत / ओवरहेड टैंक', 'मुख्य इनलेट पाइपलाइन']
    },
    q3Label: {
      en: "3. Existing Pipe Material & Setup",
      ta: "3. தற்போதைய குழாய் வகை & அமைப்பு",
      hi: "3. मौजूदा पाइप सामग्री और सेटअप"
    },
    q3Chips: {
      en: ['CPVC / UPVC (Plastic)', 'GI Metal (Older Threaded)', 'SWR Drainage PVC', 'Concealed Inside Wall'],
      ta: ['CPVC / UPVC (பிளாஸ்டிக்)', 'GI உலோகம் (பழைய த்ரெட்)', 'SWR வடிகால் PVC', 'சுவருக்குள் மறைக்கப்பட்ட குழாய்'],
      hi: ['CPVC / UPVC (प्लास्टिक)', 'जीआई मेटल (पुराना थ्रेडेड)', 'SWR ड्रेनेज PVC', 'दीवार के अंदर छुपा पाइप']
    }
  },

  s2: { // Electrician
    cardTitle: {
      en: "ELECTRICAL SETUP & SAFETY DETAILS (WORKER & USER POV)",
      ta: "மின் அமைப்பு மற்றும் பாதுகாப்பு விவரங்கள் (பணியாளர் & பயனர்)",
      hi: "विद्युत सेटअप एवं सुरक्षा विवरण (कारीगर एवं उपभोक्ता)"
    },
    q1Label: {
      en: "1. Specific Electrical Fault / Requirement",
      ta: "1. குறிப்பிட்ட மின் பழுது / தேவை",
      hi: "1. विशिष्ट विद्युत खराबी / आवश्यकता"
    },
    q1Chips: {
      en: [
        'Switchboard / Socket Spark',
        'MCB / RCCB Frequent Tripping',
        'Fan / Chandelier Fitting',
        'Heavy AC/Geyser Power Line',
        'Inverter Backup / Battery Fuse',
        'Total Power Outage (SOS)',
        'Other / Custom Issue'
      ],
      ta: [
        'சுவிட்ச்போர்டு / சாக்கெட் தீப்பொறி',
        'MCB / RCCB அடிக்கடி ஆஃப் ஆகுதல்',
        'மின்விசிறி / சரவிளக்கு பொருத்துதல்',
        'ஏசி/கீசர் ஹெவி பவர் லைன்',
        'இன்வெர்ட்டர் பேக்கப் / பேட்டரி ஃபியூஸ்',
        'முழு மின் தடை (SOS)',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'स्विचबोर्ड / सॉकेट स्पार्क',
        'MCB / RCCB बार-बार ट्रिप होना',
        'पंखा / झूमर फिटिंग',
        'भारी एसी/गीजर पावर लाइन',
        'इन्वर्टर बैकअप / बैटरी फ्यूज',
        'पूरी बिजली गुल (SOS)',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Installation Area / Room",
      ta: "2. நிறுவும் பகுதி / அறை",
      hi: "2. स्थापना क्षेत्र / कमरा"
    },
    q2Chips: {
      en: ['Living Room / Hall', 'Master Bedroom', 'Kitchen Power Board', 'Main DB / Meter Box', 'Balcony / Exterior'],
      ta: ['வரவேற்பறை / ஹால்', 'முக்கிய படுக்கையறை', 'சமையலறை பவர் போர்டு', 'மெயின் டிபி / மீட்டர் பாக்ஸ்', 'பால்கனி / வெளிப்புறம்'],
      hi: ['लिविंग रूम / हॉल', 'मास्टर बेडरूम', 'रसोई पावर बोर्ड', 'मुख्य डीबी / मीटर बॉक्स', 'बालकनी / बाहरी']
    },
    q3Label: {
      en: "3. Power Phase & Safety Earthing",
      ta: "3. மின் கட்டம் & எர்த்திங் பாதுகாப்பு",
      hi: "3. पावर फेज और सुरक्षा अर्थिंग"
    },
    q3Chips: {
      en: ['Single Phase 220V (Domestic)', '3-Phase 415V (Heavy Load)', 'Inverter Dedicated Loop', 'No Earth Wire Present'],
      ta: ['சிங்கிள் பேஸ் 220V (வீட்டுப் பயன்பாடு)', '3-பேஸ் 415V (ஹெவி லோடு)', 'இன்வெர்ட்டர் பிரத்யேக லூப்', 'எர்த் கம்பி இல்லை'],
      hi: ['सिंगल फेज 220V (घरेलू)', '3-फेज 415V (भारी लोड)', 'इन्वर्टर समर्पित लूप', 'अर्थिंग वायर मौजूद नहीं']
    }
  },

  s3: { // Cleaner
    cardTitle: {
      en: "CLEANING FOCUS & SOIL DETAILS (WORKER & USER POV)",
      ta: "சுத்தம் செய்யும் பகுதி மற்றும் அழுக்கு விவரங்கள்",
      hi: "सफाई क्षेत्र और गंदगी का विवरण"
    },
    q1Label: {
      en: "1. Specific Cleaning Focus Area",
      ta: "1. குறிப்பிட்ட சுத்தம் செய்யும் பகுதி",
      hi: "1. विशिष्ट सफाई क्षेत्र"
    },
    q1Chips: {
      en: [
        'Bathroom Scrub & Descaling',
        'Kitchen Degreasing & Chimney',
        'Sofa / Carpet Wet Shampoo',
        'Balcony Scrub & Pigeon Net',
        'Window Tracks & Glass Buffing',
        'Full Floor Rotary Machine Scrub',
        'Other / Custom Issue'
      ],
      ta: [
        'குளியலறை ஸ்க்ரப் & உப்புக்கறை நீக்கம்',
        'சமையலறை எண்ணெய் பசை & சிம்னி சுத்தம்',
        'சோபா / கார்பெட் வெட் ஷாம்பு',
        'பால்கனி ஸ்க்ரப் & புறா வலை',
        'ஜன்னல் டிராக்குகள் & கண்ணாடி பாலிஷ்',
        'முழு தரை ரோட்டரி மெஷின் ஸ்க்ரப்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'बाथरूम स्क्रब एवं स्केलिंग हटाना',
        'रसोई की चिकनाई एवं चिमनी सफाई',
        'सोफा / कालीन गीला शैम्पू',
        'बालकनी स्क्रब एवं कबूतर जाली',
        'खिड़की के ट्रैक एवं शीशा पॉलिश',
        'पूरा फर्श रोटरी मशीन स्क्रब',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Soil & Stain Intensity",
      ta: "2. அழுக்கு மற்றும் கறையின் தீவிரம்",
      hi: "2. गंदगी और दाग की तीव्रता"
    },
    q2Chips: {
      en: ['Standard Dust / Routine Soil', 'Hard Water Yellow Scaling', 'Heavy Oil & Grease Sludge', 'Post-Paint / Cement Marks'],
      ta: ['வழக்கமான தூசி / எளிய அழுக்கு', 'கடின நீர் மஞ்சள் கறை', 'கடுமையான எண்ணெய் & கிரீஸ் பசை', 'பெயிண்ட் / சிமெண்ட் கறைகள்'],
      hi: ['सामान्य धूल / नियमित गंदगी', 'खारे पानी के पीले दाग', 'भारी तेल और ग्रीस की गंदगी', 'पेंट / सीमेंट के निशान']
    },
    q3Label: {
      en: "3. Eco & Chemical Formulation",
      ta: "3. சுற்றுச்சூழல் & ரசாயன வகை",
      hi: "3. पर्यावरण एवं रासायनिक फॉर्मूलेशन"
    },
    q3Chips: {
      en: ['TASKI Eco-Certified (Child & Pet Safe)', 'Acid-Free Heavy Descaling', 'Hospital Grade Steam Sterilization'],
      ta: ['TASKI சான்றளிக்கப்பட்ட (குழந்தை & செல்லப்பிராணிக்கு பாதுகாப்பானது)', 'அமிலமில்லாத கடின கறை நீக்கி', 'மருத்துவமனை தர நீராவி கிருமி நீக்கம்'],
      hi: ['TASKI इको-प्रमाणित (बच्चों और पालतू जानवरों के लिए सुरक्षित)', 'एसिड-मुक्त भारी डीस्केलिंग', 'अस्पताल स्तर की स्टीम स्टेरिलाइज़ेशन']
    }
  },

  s4: { // Carpenter
    cardTitle: {
      en: "CARPENTRY & HARDWARE SPECS (WORKER & USER POV)",
      ta: "மரவேலை மற்றும் பூட்டு/ஹார்டுவேர் விவரங்கள்",
      hi: "बढ़ईगीरी और हार्डवेयर विनिर्देश"
    },
    q1Label: {
      en: "1. Specific Carpentry Scope",
      ta: "1. குறிப்பிட்ட மரவேலை தேவை",
      hi: "1. विशिष्ट बढ़ईगीरी कार्य"
    },
    q1Chips: {
      en: [
        'Door Lock / Mortise Latch Repair',
        'Hydraulic Soft-Close Hinge',
        'Drawer Telescopic Slider Channel',
        'Door Bottom Planing / Floor Rub',
        'Wood Sanding & Touch-Up Polish',
        'Bed / Wardrobe Assembly & Align',
        'Other / Custom Issue'
      ],
      ta: [
        'கதவு பூட்டு / மோர்டிஸ் லாட்ச் பழுது',
        'ஹைட்ராலிக் சாப்ட்-க்ளோஸ் ஹிஞ்ச்',
        'டிராயர் டெலஸ்கோபிக் ஸ்லைடர் சேனல்',
        'கதவு கீழ் பகுதி இழைத்தல் / தரை உரசலை சரிசெய்தல்',
        'மர சாண்டிங் & டச்-அப் பாலிஷ்',
        'படுக்கை / அலமாரி அசெம்பிளி & சரிசெய்தல்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'दरवाजे का ताला / मोर्टिज़ लैच मरम्मत',
        'हाइड्रोलिक सॉफ्ट-क्लोज कब्जा',
        'दराज टेलीस्कोपिक स्लाइडर चैनल',
        'दरवाजे का निचला हिस्सा घिसना/समतल करना',
        'लकड़ी की सैंडिंग और टच-अप पॉलिश',
        'बिस्तर / अलमारी असेंबली एवं संरेखण',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Wood Material Type",
      ta: "2. மரத்தின் வகை",
      hi: "2. लकड़ी की सामग्री का प्रकार"
    },
    q2Chips: {
      en: ['Engineered Plywood / MDF', 'Solid Teak / Sheesham Wood', 'UPVC / Waterproof Board', 'Modular Metal Frame'],
      ta: ['பிளைவுட் / MDF பலகை', 'தேக்கு / ரோஸ்வுட் மரம்', 'UPVC / நீர்ப்புகா பலகை', 'மாடுலர் மெட்டல் பிரேம்'],
      hi: ['इंजीनियर प्लाइवुड / MDF', 'सागौन / शीशम की ठोस लकड़ी', 'UPVC / वाटरप्रूफ बोर्ड', 'मॉड्यूलर मेटल फ्रेम']
    },
    q3Label: {
      en: "3. Hardware Sourcing & Brand",
      ta: "3. ஹார்டுவேர் மற்றும் பிராண்ட்",
      hi: "3. हार्डवेयर सोर्सिंग और ब्रांड"
    },
    q3Chips: {
      en: ['Customer Supplies Hardware', 'ISI Ebco 3D Clip-on Hinges', 'German Hettich / Hafele Fitting'],
      ta: ['வாடிக்கையாளர் ஹார்டுவேர் வழங்குகிறார்', 'ISI எப்கோ 3D ஹிஞ்ச்கள்', 'ஜெர்மன் ஹெட்டிக் / ஹேஃபெலே பிட்டிங்'],
      hi: ['ग्राहक हार्डवेयर प्रदान करेगा', 'ISI एबको 3D क्लिप-ऑन कब्जे', 'जर्मन हेटिच / हेफेल फिटिंग']
    }
  },

  s5: { // Painter
    cardTitle: {
      en: "PAINTING & SURFACE RESTORATION SPECS",
      ta: "பெயிண்டிங் மற்றும் சுவர் சீரமைப்பு விவரங்கள்",
      hi: "पेंटिंग और सतह पुनरुद्धार विनिर्देश"
    },
    q1Label: {
      en: "1. Specific Painting Need",
      ta: "1. குறிப்பிட்ட பெயிண்டிங் தேவை",
      hi: "1. विशिष्ट पेंटिंग आवश्यकता"
    },
    q1Chips: {
      en: [
        'Water Dampness & Putty Patch',
        'Door / Window Polish & Enamel',
        'Single Accent Wall Paint',
        'Ceiling Stain Whitewash',
        'Full Room Repainting',
        'Exterior Weatherproof Touchup',
        'Other / Custom Issue'
      ],
      ta: [
        'ஈரப்பதம் மற்றும் புட்டி ஒட்டுவேலை',
        'கதவு / ஜன்னல் பாலிஷ் & எனாமல்',
        'ஒரு பிரத்யேக சுவர் பெயிண்ட்',
        'மேற்கூரை கறை & வெள்ளை பூச்சு',
        'முழு அறை மறுபெயிண்டிங்',
        'வெளிப்புற வெதர்-ப்ரூப் டச்-அப்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'नमी और पुट्टी पैच का काम',
        'दरवाजा / खिड़की पॉलिश और इनेमल',
        'एक एक्सेंट दीवार पेंट',
        'छत के दाग और सफेदी',
        'पूरे कमरे की दोबारा पेंटिंग',
        'बाहरी वेदरप्रूफ टचअप',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Wall Condition & Preparation",
      ta: "2. சுவரின் நிலை மற்றும் தயாரிப்பு",
      hi: "2. दीवार की स्थिति और तैयारी"
    },
    q2Chips: {
      en: ['Smooth Surface (Direct Paint)', 'Minor Flaking & Putty Fill', 'Deep Moisture & Peeling Wall', 'Fresh Unplastered Wall'],
      ta: ['மென்மையான சுவர் (நேரடி பெயிண்ட்)', 'சிறிய உதிர்தல் & புட்டி நிரப்புதல்', 'ஆழமான ஈரப்பதம் & பெயரும் சுவர்', 'புதிய பிளாஸ்டர் செய்யப்படாத சுவர்'],
      hi: ['चिकनी सतह (सीधा पेंट)', 'हल्का छिलना और पुट्टी भरना', 'गहरी नमी और पपड़ीदार दीवार', 'ताजा बिना प्लास्टर वाली दीवार']
    },
    q3Label: {
      en: "3. Paint Sheen & Formulation",
      ta: "3. பெயிண்ட் வகை & பளபளப்பு",
      hi: "3. पेंट चमक और फॉर्मूलेशन"
    },
    q3Chips: {
      en: ['Tractor Emulsion (Matte)', 'Premium Satin / Silk Sheen', 'Royale Luxury Anti-Bacterial', 'Waterproof Exterior Damp-Block'],
      ta: ['டிராக்டர் எமல்ஷன் (மேட்)', 'பிரீமியம் சாட்டின் / பட்டு பளபளப்பு', 'ராயல் ஆடம்பர பாக்டீரியா எதிர்ப்பு', 'நீர்ப்புகா வெளிப்புற டேம்ப்-பிளாக்'],
      hi: ['ट्रैक्टर इमल्शन (मैट)', 'प्रीमियम साटन / सिल्क चमक', 'रॉयल लक्जरी एंटी-बैक्टीरियल', 'वाटरप्रूफ बाहरी नमी-रोधी']
    }
  },

  s6: { // Caregiver
    cardTitle: {
      en: "PATIENT PROFILE & ASSISTANCE PROTOCOLS",
      ta: "நோயாளி விவரம் மற்றும் பராமரிப்பு நெறிமுறைகள்",
      hi: "रोगी प्रोफाइल और देखभाल प्रोटोकॉल"
    },
    q1Label: {
      en: "1. Specific Care Requirement",
      ta: "1. குறிப்பிட்ட பராமரிப்பு தேவை",
      hi: "1. विशिष्ट देखभाल आवश्यकता"
    },
    q1Chips: {
      en: [
        'Doctor Visit / OPD Mobility Escort',
        'Elderly Companionship & Feeding',
        'Vitals Check (BP, Sugar, SpO2)',
        'Post-Operative Recovery Support',
        'Bedridden Sponge Bath & Hygiene',
        'Night-Time Bedside Vigil',
        'Other / Custom Issue'
      ],
      ta: [
        'மருத்துவமனை / ஓபிடி உதவித் துணை',
        'முதியோர் கவனிப்பு & உணவு ஊட்டுதல்',
        'உடல் பரிசோதனை (பிபி, சுகர், ஆக்சிஜன்)',
        'அறுவை சிகிச்சைக்குப் பின் குணமடைதல் உதவி',
        'படுக்கையில் உள்ளோருக்கு பஞ்சு குளியல் & சுகாதாரம்',
        'இரவு நேர படுக்கை அருகிருப்பு',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'डॉक्टर विजिट / ओपीडी सहायता',
        'बुजुर्गों का साथ और भोजन कराना',
        'महत्वपूर्ण जांच (बीपी, शुगर, SpO2)',
        'सर्जरी के बाद रिकवरी सहायता',
        'बिस्तर पर स्पंज बाथ और स्वच्छता',
        'रात के समय बिस्तर के पास निगरानी',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Patient Mobility Level",
      ta: "2. நோயாளியின் நடமாட்ட நிலை",
      hi: "2. रोगी की गतिशीलता का स्तर"
    },
    q2Chips: {
      en: ['Fully Independent / Mobile', 'Assisted Walking (Walker/Stick)', 'Wheelchair Dependent', 'Completely Bedridden'],
      ta: ['சுயமாக நடப்பவர்', 'ஊன்றுகோல்/வாக்கர் உதவி தேவைப்படுவோர்', 'வீல்சேர் பயன்படுத்துவோர்', 'முழுமையாக படுக்கையில் உள்ளவர்'],
      hi: ['पूरी तरह स्वतंत्र / चलने में सक्षम', 'सहायक के साथ चलना (वॉकर/छड़ी)', 'व्हीलचेयर पर निर्भर', 'पूरी तरह बिस्तर पर']
    },
    q3Label: {
      en: "3. Specialized Medical Protocols",
      ta: "3. சிறப்பு மருத்துவ நெறிமுறைகள்",
      hi: "3. विशेष चिकित्सा प्रोटोकॉल"
    },
    q3Chips: {
      en: ['General Non-Medical Senior Care', 'Catheter & Ryle Tube Care', 'Oxygen & Nebulizer Support', 'Tracheostomy & Critical Care'],
      ta: ['பொதுவான முதியோர் கவனிப்பு', 'கேதீட்டர் & உணவு குழாய் பராமரிப்பு', 'ஆக்சிஜன் & நெபுலைசர் உதவி', 'டிரக்கியோஸ்டமி & தீவிர கவனிப்பு'],
      hi: ['सामान्य गैर-चिकित्सीय वरिष्ठ देखभाल', 'कैथेटर और राइल्स ट्यूब की देखभाल', 'ऑक्सीजन और नेबुलाइजर सहायता', 'ट्रेकियोस्टॉमी और क्रिटिकल केयर']
    }
  },

  s7: { // Technician
    cardTitle: {
      en: "APPLIANCE DIAGNOSTICS & SYMPTOM SPECS",
      ta: "சாதன பழுது மற்றும் அறிகுறி விவரங்கள்",
      hi: "उपकरण निदान और लक्षण विनिर्देश"
    },
    q1Label: {
      en: "1. Specific Appliance Breakdown",
      ta: "1. குறிப்பிட்ட பழுதான சாதனம்",
      hi: "1. विशिष्ट उपकरण खराबी"
    },
    q1Chips: {
      en: [
        'Split / Inverter AC',
        'Refrigerator (Single/Double Door)',
        'Washing Machine (Front/Top Load)',
        'RO Water Purifier',
        'Storage Geyser / Water Heater',
        'Microwave Oven / OTG',
        'Other / Custom Issue'
      ],
      ta: [
        'ஸ்பிளிட் / இன்வெர்ட்டர் ஏசி',
        'பிரிட்ஜ் (சிங்கிள்/டபுள் டோர்)',
        'வாஷிங் மெஷின் (முன்/மேல் லோடு)',
        'ஆர்ஓ குடிநீர் சுத்திகரிப்பான்',
        'கீசர் / வாட்டர் ஹீட்டர்',
        'மைக்ரோவேவ் ஓவன்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'स्प्लिट / इन्वर्टर एसी',
        'रेफ्रिजरेटर (सिंगल/डबल डोर)',
        'वाशिंग मशीन (फ्रंट/टॉप लोड)',
        'आरओ वाटर प्यूरीफायर',
        'गीजर / वाटर हीटर',
        'माइक्रोवेव ओवन',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Observed Malfunction / Symptom",
      ta: "2. காணப்படும் குறைபாடு / அறிகுறி",
      hi: "2. देखी गई खराबी / लक्षण"
    },
    q2Chips: {
      en: ['No Power / Not Turning On', 'Not Cooling / Not Heating', 'Water Leaking from Unit', 'Unusual Loud Vibration / Noise', 'Error Code on Digital Display'],
      ta: ['பவர் வரவில்லை / ஆன் ஆகவில்லை', 'குளிர்ச்சி / சூடு ஆகவில்லை', 'சாதனத்திலிருந்து தண்ணீர் கசிகிறது', 'அசாதாரண சத்தம் / அதிர்வு', 'டிஜிட்டல் திரையில் எரர் கோட்'],
      hi: ['बिजली नहीं आ रही / चालू नहीं हो रहा', 'ठंडा / गर्म नहीं कर रहा', 'यूनिट से पानी का रिसाव', 'असामान्य तेज आवाज / कंपन', 'डिजिटल डिस्प्ले पर एरर कोड']
    },
    q3Label: {
      en: "3. Diagnostic Suspicions",
      ta: "3. பழுது பற்றிய சந்தேகம்",
      hi: "3. नैदानिक संदेह"
    },
    q3Chips: {
      en: ['Standard Filter / Jet Service', 'Suspected Gas Leak & Brazing Repair', 'PCB Circuit Board Diagnostics', 'Motor / Compressor Breakdown'],
      ta: ['வழக்கமான பில்டர் / ஜெட் வாஷ்', 'கேஸ் கசிவு & பிரேசிங் பழுது', 'பிசிபி சர்க்யூட் போர்டு பரிசோதனை', 'மோட்டார் / கம்ப்ரசர் பழுது'],
      hi: ['मानक फिल्टर / जेट सर्विस', 'गैस रिसाव और ब्रेजिंग मरम्मत का संदेह', 'पीसीबी सर्किट बोर्ड निदान', 'मोटर / कंप्रेसर खराबी']
    }
  },

  s8: { // Domestic Helper
    cardTitle: {
      en: "HOUSEHOLD & MEAL ASSISTANCE SPECS",
      ta: "வீட்டு வேலை மற்றும் சமையல் உதவி விவரங்கள்",
      hi: "घरेलू और भोजन सहायता विनिर्देश"
    },
    q1Label: {
      en: "1. Specific Task Requirement",
      ta: "1. குறிப்பிட்ட பணித் தேவை",
      hi: "1. विशिष्ट कार्य आवश्यकता"
    },
    q1Chips: {
      en: [
        'Clothes Ironing & Wardrobe Fold',
        'Party Utensils Mass Washing',
        'Post-Event Kitchen Slab Degrease',
        'One-Time Meal Cooking (Lunch/Dinner)',
        'Emergency Substitute Cook (SOS)',
        'Deep Balcony & Window Mesh Wash',
        'Other / Custom Issue'
      ],
      ta: [
        'துணி அயர்ன் செய்தல் & மடித்தல்',
        'விசேஷ பாத்திரங்கள் மொத்தமாக கழுவுதல்',
        'விசேஷத்திற்குப் பின் சமையலறை சுத்தம்',
        'ஒரு வேளை சமையல் (மதியம்/இரவு)',
        'அவசர மாற்று சமையலர் (SOS)',
        'பால்கனி & ஜன்னல் வலை ஆழமான சுத்தம்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'कपड़े इस्त्री करना और अलमारी में रखना',
        'पार्टी के बर्तनों की बड़ी धुलाई',
        'इवेंट के बाद रसोई स्लैब की सफाई',
        'एक समय का खाना बनाना (दोपहर/रात)',
        'आपातकालीन वैकल्पिक रसोइया (SOS)',
        'गहरी बालकनी और खिड़की की जाली की धुलाई',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Meal / Cuisine Preference",
      ta: "2. உணவு / சமையல் விருப்பம்",
      hi: "2. भोजन / व्यंजन प्राथमिकता"
    },
    q2Chips: {
      en: ['North Indian (Roti, Sabzi, Dal)', 'South Indian (Idli, Dosa, Rice)', 'Light Diet / Jain (No Onion/Garlic)', 'Multi-Cuisine Buffet Preparation'],
      ta: ['வட இந்திய உணவு (ரொட்டி, சப்ஜி, பருப்பு)', 'தென்னிந்திய உணவு (இட்லி, தோசை, சாதம்)', 'எளிய உணவு / ஜெயின் (வெங்காயம்/பூண்டு இன்றி)', 'பல்வகை உணவு பஃபே தயாரிப்பு'],
      hi: ['उत्तर भारतीय (रोटी, सब्जी, दाल)', 'दक्षिण भारतीय (इडली, डोसा, चावल)', 'हल्का आहार / जैन (बिना प्याज/लहसुन)', 'मल्टी-क्युज़ीन बुफे तैयारी']
    },
    q3Label: {
      en: "3. Household Size / Headcount",
      ta: "3. குடும்ப நபர்களின் எண்ணிக்கை",
      hi: "3. परिवार का आकार / सदस्यों की संख्या"
    },
    q3Chips: {
      en: ['1–2 Persons (Bachelor/Couple)', '3–5 Persons (Nuclear Family)', '6+ Large Joint Family', 'Small House Party (10–15 Guests)'],
      ta: ['1–2 நபர்கள் (தனியாக/தம்பதியர்)', '3–5 நபர்கள் (சிறிய குடும்பம்)', '6+ நபர்கள் (பெரிய கூட்டுக் குடும்பம்)', 'சிறிய வீட்டு விருந்து (10–15 விருந்தினர்கள்)'],
      hi: ['1–2 व्यक्ति (अविवाहित/दंपति)', '3–5 व्यक्ति (छोटा परिवार)', '6+ बड़ा संयुक्त परिवार', 'छोटी हाउस पार्टी (10–15 मेहमान)']
    }
  },

  s9: { // Driver
    cardTitle: {
      en: "CHAUFFEUR & VEHICLE SPECIFICATIONS",
      ta: "ஓட்டுநர் மற்றும் வாகன விவரங்கள்",
      hi: "ड्राइवर और वाहन विनिर्देश"
    },
    q1Label: {
      en: "1. Select Trip Plan",
      ta: "1. பயணத் திட்டத்தைத் தேர்ந்தெடுக்கவும்",
      hi: "1. यात्रा योजना चुनें"
    },
    q1Chips: {
      en: ['City Commute (2 hrs)', 'Full Day City (8 hrs)', 'Airport Transfer', 'Outstation Round-Trip'],
      ta: ['நகரப் பயணம் (2 மணி நேரம்)', 'முழு நாள் பயணம் (8 மணி நேரம்)', 'விமான நிலைய டிராப்/பிக்கப்', 'வெளியூர் சென்று திரும்புதல்'],
      hi: ['शहर में आवागमन (2 घंटे)', 'पूरे दिन का शहर दौरा (8 घंटे)', 'हवाई अड्डा स्थानांतरण', 'बाहरी यात्रा (राउंड ट्रिप)']
    },
    q2Label: {
      en: "2. Vehicle Transmission Type",
      ta: "2. வாகன கியர் வகை",
      hi: "2. वाहन ट्रांसमिशन प्रकार"
    },
    q2Chips: {
      en: ['Manual (MT)', 'Automatic (AT/CVT)', 'Heavy SUV / 4x4', 'Electric Vehicle (EV)'],
      ta: ['மேனுவல் (MT)', 'ஆட்டோமேட்டிக் (AT/CVT)', 'ஹெவி SUV / 4x4', 'மின்சார வாகனம் (EV)'],
      hi: ['मैनुअल (MT)', 'ऑटोमैटिक (AT/CVT)', 'भारी एसयूवी / 4x4', 'इलेक्ट्रिक वाहन (EV)']
    },
    q3Label: {
      en: "3. Booking Mode",
      ta: "3. முன்பதிவு முறை",
      hi: "3. बुकिंग मोड"
    },
    q3Chips: {
      en: ['Driver Only (Your Car)', 'Car with Chauffeur (Cab)'],
      ta: ['ஓட்டுநர் மட்டும் (உங்கள் கார்)', 'காரோடு ஓட்டுநர் (கேப்)'],
      hi: ['केवल ड्राइवर (आपकी कार)', 'कार और ड्राइवर (कैब)']
    }
  },

  s10: { // Gardener
    cardTitle: {
      en: "GARDEN CARE & HORTICULTURE SPECS",
      ta: "தோட்டப் பராமரிப்பு மற்றும் தோட்டக்கலை விவரங்கள்",
      hi: "बगीचे की देखभाल और बागवानी विनिर्देश"
    },
    q1Label: {
      en: "1. Specific Gardening Scope",
      ta: "1. குறிப்பிட்ட தோட்டப் பணி",
      hi: "1. विशिष्ट बागवानी कार्य"
    },
    q1Chips: {
      en: [
        'Balcony Pot Aeration & Soil Refresh',
        'Indoor Plant Repotting & Fertilizer',
        'Organic Pest Spray (Neem/Bio)',
        'Lawn De-weeding & Mowing',
        'Automated Drip Tube Unclogging',
        'Tree Canopy Lopping & Branch Trim',
        'Other / Custom Issue'
      ],
      ta: [
        'பால்கனி தொட்டி மண் கிளறி புத்துயிரூட்டல்',
        'உட்புற செடி மறுதொட்டி & உரம் இடுதல்',
        'இயற்கை பூச்சி விரட்டி (வேம்பு/பயோ)',
        'புல்வெளி களை எடுத்தல் & வெட்டுதல்',
        'சொட்டு நீர் பாசனக் குழாய் அடைப்பு நீக்கம்',
        'மரக்கிளை கவாத்து & வெட்டுதல்',
        'மற்றவை / தனிப்பயன் பிரச்சனை'
      ],
      hi: [
        'बालकनी गमलों की मिट्टी की गुड़ाई व खाद',
        'इनडोर पौधों की रिपोटिंग और खाद',
        'जैविक कीट स्प्रे (नीम/बायो)',
        'लॉन की निराई और कटाई',
        'स्वचालित ड्रिप ट्यूब की रुकावट हटाना',
        'पेड़ की छंटाई और शाखाएं काटना',
        'अन्य / कस्टम समस्या'
      ]
    },
    q2Label: {
      en: "2. Garden Space & Layout",
      ta: "2. தோட்டப் பரப்பளவு & அமைப்பு",
      hi: "2. बगीचे का स्थान और लेआउट"
    },
    q2Chips: {
      en: ['Balcony / Terrace Pots (10–30)', 'Villa Lawn / Yard (~1,000 sq.ft)', 'Large Estate / Society Green Area', 'Vertical Living Wall Grid'],
      ta: ['பால்கனி / மாடித் தொட்டிகள் (10–30)', 'வில்லா புல்வெளி / முற்றம் (~1,000 சதுர அடி)', 'பெரிய எஸ்டேட் / அப்பார்ட்மென்ட் தோட்டம்', 'செங்குத்து சுவர் தோட்டம்'],
      hi: ['बालकनी / छत के गमले (10–30)', 'विला लॉन / आंगन (~1,000 वर्ग फुट)', 'बड़ा एस्टेट / सोसाइटी ग्रीन एरिया', 'वर्टिकल लिविंग वॉल']
    },
    q3Label: {
      en: "3. Organic Manure & Sourcing",
      ta: "3. இயற்கை உரம் & மூலப்பொருட்கள்",
      hi: "3. जैविक खाद और सोर्सिंग"
    },
    q3Chips: {
      en: ['Labour Only (Customer Tools)', 'Fortified Vermicompost & Neem Blend', 'Coco-Peat & Perlite Aeration Mix', 'Exotic Flowering Plants Nursery Addon'],
      ta: ['பணியாளர் மட்டும் (வாடிக்கையாளர் கருவிகள்)', 'செறிவூட்டப்பட்ட மண்புழு உரம் & வேம்பு கலவை', 'தேங்காய் நார் & பெர்லைட் கலவை', 'அலங்கார பூச்செடிகள் நர்சரி சேர்த்தல்'],
      hi: ['केवल मजदूरी (ग्राहक के उपकरण)', 'फोर्टिफाइड वर्मीकम्पोस्ट और नीम मिश्रण', 'कोको-पीट और परलाइट मिश्रण', 'विदेशी फूलों के पौधे नर्सरी ऐडऑन']
    }
  }
};

/**
 * Bulk Configuration Multilingual Content (Scales and Material Packs)
 */
export const BULK_CONFIG_TRANSLATIONS = {
  scaleHeading: {
    en: "1. Select Project Scope / Units",
    ta: "1. திட்டத்தின் அளவு / அலகுகளைத் தேர்ந்தெடுக்கவும்",
    hi: "1. प्रोजेक्ट का दायरा / इकाइयां चुनें"
  },
  materialHeading: {
    en: "2. Material Sourcing & Specification Tier",
    ta: "2. மூலப்பொருள் கொள்முதல் & தரத் தேர்வு",
    hi: "2. सामग्री सोर्सिंग और विनिर्देश स्तर"
  },
  s1: { // Plumber Bulk
    scales: [
      { id: 'sc0', label: { en: '1 Bathroom', ta: '1 குளியலறை', hi: '1 बाथरूम' }, sub: { en: '~15–20 Concealed Fittings', ta: '~15–20 மறைமுக இணைப்புகள்', hi: '~15–20 कंसील्ड फिटिंग्स' } },
      { id: 'sc1', label: { en: '2 Baths + Kitchen', ta: '2 குளியலறை + சமையலறை', hi: '2 बाथरूम + रसोई' }, sub: { en: '~40 Fittings & Diverters', ta: '~40 இணைப்புகள் & டைவர்ட்டர்கள்', hi: '~40 फिटिंग्स और डायवर्टर' } },
      { id: 'sc2', label: { en: '3 Baths + Tank Grid', ta: '3 குளியலறை + தொட்டி அமைப்பு', hi: '3 बाथरूम + टैंक ग्रिड' }, sub: { en: '~65 Fittings & Manifold', ta: '~65 இணைப்புகள் & மேனிஃபோல்ட்', hi: '~65 फिटिंग्स और मैनिफोल्ड' } },
      { id: 'sc3', label: { en: 'Full Villa / Society Grid', ta: 'முழு வில்லா / அப்பார்ட்மென்ட்', hi: 'पूरी विला / सोसाइटी ग्रिड' }, sub: { en: '~100+ Fittings & Booster Pumps', ta: '~100+ இணைப்புகள் & பூஸ்டர் பம்புகள்', hi: '~100+ फिटिंग्स और बूस्टर पंप' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Plumbing Tools Only)', ta: 'பணியாளர் மட்டும் (கருவிகள் மட்டும்)', hi: 'केवल मजदूरी (केवल प्लंबिंग उपकरण)' }, sub: { en: 'Customer provides all CPVC pipes, diverters & valves', ta: 'வாடிக்கையாளர் அனைத்து குழாய்களையும் வழங்குகிறார்', hi: 'ग्राहक सभी सीपीवीसी पाइप और वाल्व प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Standard ISI CPVC & Brass Valves', ta: 'பணியாளர் + ISI CPVC & பித்தளை வால்வுகள்', hi: 'मजदूरी + मानक ISI CPVC और ब्रास वाल्व' }, sub: { en: 'Co-op supplies Astral/Ashirvad SDR-11 CPVC pipes', ta: 'கூட்டுறவு சங்கம் ஆஸ்ட்ரல்/ஆஷிர்வாட் CPVC குழாய்களை வழங்குகிறது', hi: 'सहकारी समिति एस्ट्रल/आशीर्वाद CPVC पाइप प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Premium Concealed Diverter Grid', ta: 'பணியாளர் + பிரீமியம் மறைமுக டைவர்ட்டர் அமைப்பு', hi: 'मजदूरी + प्रीमियम कंसील्ड डायवर्टर ग्रिड' }, sub: { en: 'Thermostatic concealed diverters, multi-flow showers', ta: 'தெர்மோஸ்டாடிக் மறைமுக டைவர்ட்டர்கள், மல்டி-ப்ளோ ஷவர்கள்', hi: 'थर्मोस्टेटिक कंसील्ड डायवर्टर, मल्टी-फ्लो शॉवर' } }
    ]
  },
  s2: { // Electrician Bulk
    scales: [
      { id: 'sc0', label: { en: '1 BHK Rewiring', ta: '1 BHK முழு வயரிங்', hi: '1 BHK रीवायरिंग' }, sub: { en: '~25–35 Points + 1 AC Loop', ta: '~25–35 பாயிண்ட்டுகள் + 1 ஏசி லூப்', hi: '~25–35 पॉइंट + 1 एसी लूप' } },
      { id: 'sc1', label: { en: '2 BHK Rewiring', ta: '2 BHK முழு வயரிங்', hi: '2 BHK रीवायरिंग' }, sub: { en: '~55–70 Points + 2 AC Lines', ta: '~55–70 பாயிண்ட்டுகள் + 2 ஏசி லைன்கள்', hi: '~55–70 पॉइंट + 2 एसी लाइन' } },
      { id: 'sc2', label: { en: '3 BHK Full Grid', ta: '3 BHK முழு கிரிட்', hi: '3 BHK फुल ग्रिड' }, sub: { en: '~90–120 Points + Inverter', ta: '~90–120 பாயிண்ட்டுகள் + இன்வெர்ட்டர்', hi: '~90–120 पॉइंट + इन्वर्टर' } },
      { id: 'sc3', label: { en: '4 BHK / Villa 3-Phase', ta: '4 BHK / வில்லா 3-பேஸ்', hi: '4 BHK / विला 3-फेज' }, sub: { en: '~150+ Points + Dual DB', ta: '~150+ பாயிண்ட்டுகள் + இரட்டை டிபி', hi: '~150+ point + ड्यूल डीबी' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Electrical Tools Only)', ta: 'பணியாளர் மட்டும் (மின் கருவிகள் மட்டும்)', hi: 'केवल मजदूरी (केवल विद्युत उपकरण)' }, sub: { en: 'Customer provides all wires, conduits, DB & MCBs', ta: 'வாடிக்கையாளர் அனைத்து ஒயர்கள் & MCBகளை வழங்குகிறார்', hi: 'ग्राहक सभी तार, पाइप, डीबी और एमसीबी प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Standard ISI FRLS Wires & MCBs', ta: 'பணியாளர் + ISI தீப்பிடிக்காத FRLS ஒயர்கள் & MCB', hi: 'मजदूरी + मानक ISI FRLS तार और MCB' }, sub: { en: 'Co-op supplies Havells/Polycab FRLS copper wires', ta: 'கூட்டுறவு சங்கம் ஹேவல்ஸ்/பாலிகேப் ஒயர்களை வழங்குகிறது', hi: 'सहकारी समिति हैवेल्स/पॉलीकैब एफआरएलएस कॉपर वायर प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Premium Smart Modular IoT Grid', ta: 'பணியாளர் + பிரீமியம் ஸ்மார்ட் மாடுலர் சுவிட்சுகள்', hi: 'मजदूरी + प्रीमियम स्मार्ट मॉड्यूलर IoT ग्रिड' }, sub: { en: 'Schneider/Legrand feather-touch smart switches', ta: 'ஷ்னைடர்/லெக்ராண்ட் டச் சுவிட்சுகள் & கெமிக்கல் எர்த்திங்', hi: 'श्नाइडर/लेग्रैंड फेदर-टच स्मार्ट स्विच और केमिकल अर्थिंग' } }
    ]
  },
  s3: { // Cleaner Bulk
    scales: [
      { id: 'sc0', label: { en: '1 BHK Deep Clean', ta: '1 BHK ஆழமான சுத்தம்', hi: '1 BHK डीप क्लीन' }, sub: { en: '~450–600 sq.ft (1 Bath + Kitchen)', ta: '~450–600 சதுர அடி (1 கழிப்பறை + சமையலறை)', hi: '~450–600 वर्ग फुट (1 बाथरूम + रसोई)' } },
      { id: 'sc1', label: { en: '2 BHK Deep Clean', ta: '2 BHK ஆழமான சுத்தம்', hi: '2 BHK डीप क्लीन' }, sub: { en: '~800–1,100 sq.ft (2 Baths + Sofa)', ta: '~800–1,100 சதுர அடி (2 கழிப்பறை + சோபா)', hi: '~800–1,100 वर्ग फुट (2 बाथरूम + सोफा)' } },
      { id: 'sc2', label: { en: '3 BHK Intensive Clean', ta: '3 BHK முழுமையான சுத்தம்', hi: '3 BHK गहन सफाई' }, sub: { en: '~1,300–1,800 sq.ft (3 Baths + Steam)', ta: '~1,300–1,800 சதுர அடி (3 கழிப்பறை + நீராவி)', hi: '~1,300–1,800 वर्ग फुट (3 बाथरूम + स्टीम)' } },
      { id: 'sc3', label: { en: '4 BHK / Villa Move-In', ta: '4 BHK / வில்லா குடிபுகுதல் சுத்தம்', hi: '4 BHK / विला मूव-इन' }, sub: { en: '~2,500–4,500+ sq.ft (Full Crew)', ta: '~2,500–4,500+ சதுர அடி (முழு குழு)', hi: '~2,500–4,500+ वर्ग फुट (पूरी टीम)' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Basic Equipment Only)', ta: 'பணியாளர் மட்டும் (அடிப்படை கருவிகள் மட்டும்)', hi: 'केवल मजदूरी (केवल बुनियादी उपकरण)' }, sub: { en: 'Customer provides all detergents & vacuum machine', ta: 'வாடிக்கையாளர் கிளீனிங் திரவங்களை வழங்குகிறார்', hi: 'ग्राहक सभी डिटर्जेंट और वैक्यूम प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + TASKI Eco-Certified Chemical Squad', ta: 'பணியாளர் + TASKI சுற்றுச்சூழல் சான்றளிக்கப்பட்ட பொருட்கள்', hi: 'मजदूरी + TASKI पर्यावरण-प्रमाणित रसायन' }, sub: { en: 'Co-op supplies TASKI R1-R7 chemicals & scrubbers', ta: 'கூட்டுறவு சங்கம் TASKI R1-R7 கெமிக்கல்களை வழங்குகிறது', hi: 'सहकारी समिति TASKI R1-R7 रसायन और स्क्रबर प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Premium Hospital-Grade Steam Sanitization', ta: 'பணியாளர் + மருத்துவமனை தர நீராவி கிருமி நீக்கம்', hi: 'मजदूरी + अस्पताल ग्रेड स्टीम सैनिटाइजेशन' }, sub: { en: '130°C steam sterilization, floor buffing & 30L wet vacuum', ta: '130°C நீராவி கிருமி நீக்கம் & தரை பாலிஷிங்', hi: '130°C स्टीम नसबंदी, फ्लोर बफिंग और 30L वेट वैक्यूम' } }
    ]
  },
  s4: { // Carpenter Bulk
    scales: [
      { id: 'sc0', label: { en: 'Modular Kitchen Overhaul', ta: 'மாடுலர் சமையலறை சீரமைப்பு', hi: 'मॉड्यूलर किचन ओवरहाल' }, sub: { en: '15–20 Shutters & Tandem Drawers', ta: '15–20 கதவுகள் & இழுப்பறைகள்', hi: '15–20 शटर एवं दराज' } },
      { id: 'sc1', label: { en: '2 Wardrobes + Bed Storage', ta: '2 அலமாரிகள் + படுக்கை சேமிப்பு', hi: '2 वार्डरोब + बेड स्टोरेज' }, sub: { en: '35–50 Hardware Points & Lifters', ta: '35–50 ஹார்டுவேர் பாயிண்ட்டுகள்', hi: '35–50 हार्डवेयर पॉइंट' } },
      { id: 'sc2', label: { en: 'Full House Joinery', ta: 'முழு வீட்டு மரவேலைகள்', hi: 'पूरे घर की बढ़ईगीरी' }, sub: { en: '70–100 Points (Doors, Beds, Kitchen)', ta: '70–100 பாயிண்ட்டுகள் (கதவு, படுக்கை, சமையலறை)', hi: '70–100 पॉइंट (दरवाजे, बिस्तर, रसोई)' } },
      { id: 'sc3', label: { en: 'Full Villa Luxury Joinery', ta: 'வில்லா சொகுசு மரவேலைகள்', hi: 'विला लक्जरी बढ़ईगीरी' }, sub: { en: '130+ Points (Teak Framing & Polish)', ta: '130+ பாயிண்ட்டுகள் (தேக்கு & பாலிஷ்)', hi: '130+ पॉइंट (सागौन फ्रेमिंग और पॉलिश)' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Precision Tools Only)', ta: 'பணியாளர் மட்டும் (கருவிகள் மட்டும்)', hi: 'केवल मजदूरी (केवल उपकरण)' }, sub: { en: 'Customer provides all hinges, slides & locks', ta: 'வாடிக்கையாளர் அனைத்து பூட்டுகள் & ஹிஞ்ச்களை வழங்குகிறார்', hi: 'ग्राहक सभी कब्जे, स्लाइड और ताले प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Standard ISI Soft-Close Hardware', ta: 'பணியாளர் + ISI சாப்ட்-க்ளோஸ் ஹார்டுவேர்', hi: 'मजदूरी + मानक ISI सॉफ्ट-क्लोज हार्डवेयर' }, sub: { en: 'Co-op supplies Ebco 3D clip-on soft-close hinges & Godrej locks', ta: 'கூட்டுறவு சங்கம் எப்கோ ஹிஞ்ச்கள் & காத்ரெஜ் பூட்டுகளை வழங்குகிறது', hi: 'सहकारी समिति एबको 3D कब्जे और गोदरेज ताले प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Premium German Silent Hardware', ta: 'பணியாளர் + ஜெர்மன் சைலண்ட் ஹார்டுவேர்', hi: 'मजदूरी + प्रीमियम जर्मन साइलेंट हार्डवेयर' }, sub: { en: 'Hettich Sensys silent damping hinges & PU polish', ta: 'ஹெட்டிக் சைலண்ட் ஹிஞ்ச்கள் & PU பாலிஷ்', hi: 'हेटिच सेंसिस साइलेंट डैम्पिंग कब्जे और पीयू पॉलिश' } }
    ]
  },
  s5: { // Painter Bulk
    scales: [
      { id: 'sc0', label: { en: '1 BHK Interior', ta: '1 BHK உட்புற பெயிண்டிங்', hi: '1 BHK इंटीरियर' }, sub: { en: '~1,500 sq.ft Wall Area', ta: '~1,500 சதுர அடி சுவர் பரப்பளவு', hi: '~1,500 वर्ग फुट दीवार क्षेत्र' } },
      { id: 'sc1', label: { en: '2 BHK Full House', ta: '2 BHK முழு வீடு', hi: '2 BHK पूरा घर' }, sub: { en: '~2,800 sq.ft Wall Area', ta: '~2,800 சதுர அடி சுவர் பரப்பளவு', hi: '~2,800 वर्ग फुट दीवार क्षेत्र' } },
      { id: 'sc2', label: { en: '3 BHK Full House', ta: '3 BHK முழு வீடு', hi: '3 BHK पूरा घर' }, sub: { en: '~4,500 sq.ft Wall Area', ta: '~4,500 சதுர அடி சுவர் பரப்பளவு', hi: '~4,500 वर्ग फुट दीवार क्षेत्र' } },
      { id: 'sc3', label: { en: '4 BHK / Villa Exterior', ta: '4 BHK / வில்லா வெளிப்புறம்', hi: '4 BHK / विला एक्सटीरियर' }, sub: { en: '~6,500+ sq.ft Scaffolding', ta: '~6,500+ சதுர அடி சாரம் கட்டி அடித்தல்', hi: '~6,500+ वर्ग फुट पाड़ और पेंट' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only', ta: 'பணியாளர் மட்டும்', hi: 'केवल मजदूरी' }, sub: { en: 'Customer provides all paint, primer & putty cans', ta: 'வாடிக்கையாளர் அனைத்து பெயிண்ட் & புட்டிகளை வழங்குகிறார்', hi: 'ग्राहक सभी पेंट, प्राइमर और पुट्टी प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Standard Co-op Paint & Primer', ta: 'பணியாளர் + கூட்டுறவு பெயிண்ட் & பிரைமர்', hi: 'मजदूरी + मानक सहकारी पेंट और प्राइमर' }, sub: { en: 'Co-op supplies Asian Paints/Berger emulsion & Birla putty', ta: 'கூட்டுறவு சங்கம் ஏசியன் பெயிண்ட்ஸ் & பிர்லா புட்டியை வழங்குகிறது', hi: 'सहकारी समिति एशियन पेंट्स/बर्जर इमल्शन और बिड़ला पुट्टी प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Premium Luxury Anti-Damp Paint', ta: 'பணியாளர் + பிரீமியம் சொகுசு ஈரப்பதம் எதிர்ப்பு பெயிண்ட்', hi: 'मजदूरी + प्रीमियम लक्जरी एंटी-डैम्प पेंट' }, sub: { en: 'Royale luxury washable paint & anti-fungal seal', ta: 'ராயல் சொகுசு வாஷபிள் பெயிண்ட் & பூஞ்சை எதிர்ப்பு பூச்சு', hi: 'रॉयल लक्जरी वॉशेबल पेंट और एंटी-फंगल सील' } }
    ]
  },
  s6: { // Caregiver Bulk
    scales: [
      { id: 'sc0', label: { en: 'Weekly Post-Op Support', ta: 'வாராந்திர அறுவைசிகிச்சை ஆதரவு', hi: 'साप्ताहिक सर्जरी-पश्चात सहायता' }, sub: { en: '4 Hours Daily (7 Days)', ta: 'தினமும் 4 மணி நேரம் (7 நாட்கள்)', hi: 'प्रतिदिन 4 घंटे (7 दिन)' } },
      { id: 'sc1', label: { en: 'Monthly 12-Hour Shift', ta: 'மாதாந்திர 12 மணி நேர ஷிப்ட்', hi: 'मासिक 12-घंटे की शिफ्ट' }, sub: { en: 'Day/Night Senior Care (30 Days)', ta: 'பகல்/இரவு முதியோர் கவனிப்பு (30 நாட்கள்)', hi: 'दिन/रात वरिष्ठ देखभाल (30 दिन)' } },
      { id: 'sc2', label: { en: 'Monthly 24x7 Dual Relay', ta: 'மாதாந்திர 24x7 இரட்டை பணியாளர்', hi: 'मासिक 24x7 दोहरी रिले' }, sub: { en: 'Continuous 2-Caregiver Team (30 Days)', ta: '2 பராமரிப்பாளர்கள் சுழற்சி முறை (30 நாட்கள்)', hi: 'निरंतर 2-देखभालकर्ता टीम (30 दिन)' } },
      { id: 'sc3', label: { en: 'Specialized ICU Step-Down', ta: 'சிறப்பு ஐசியூ தொடர் கவனிப்பு', hi: 'विशेष आईसीयू स्टेप-डाउन' }, sub: { en: 'Tracheostomy & Critical Care (30 Days)', ta: 'டிரக்கியோஸ்டமி & தீவிர கவனிப்பு (30 நாட்கள்)', hi: 'ट्रेकियोस्टॉमी और क्रिटिकल केयर (30 दिन)' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Basic Companionship & Mobility', ta: 'அடிப்படை தோழமை & இயக்கம்', hi: 'बुनियादी साथ और गतिशीलता' }, sub: { en: 'Assisted walking, feeding, oral medication reminders', ta: 'நடை உதவி, உணவளித்தல், மருந்து நினைவூட்டல்', hi: 'सहायक चलना, भोजन कराना, दवा अनुस्मारक' } },
      { id: 'm1', label: { en: 'Bedridden & Semi-Mobile Nursing Care', ta: 'படுக்கை நோயாளி நர்சிங் கவனிப்பு', hi: 'बिस्तर पर पड़े रोगी की नर्सिंग देखभाल' }, sub: { en: 'Bed sore prevention, sponge bath, catheter bag care', ta: 'படுக்கை புண் தடுப்பு, பஞ்சு குளியல், கேதீட்டர் பராமரிப்பு', hi: 'बेड सोर रोकथाम, स्पंज बाथ, कैथेटर बैग की देखभाल' } },
      { id: 'm2', label: { en: 'Critical Post-Op & Physio Support', ta: 'தீவிர அறுவைசிகிச்சை & பிசியோ ஆதரவு', hi: 'गंभीर ऑपरेशन-पश्चात और फिजियो सपोर्ट' }, sub: { en: 'Nebulization, oxygen monitoring, passive physiotherapy', ta: 'நெபுலைசேஷன், ஆக்சிஜன் கண்காணிப்பு, பிசியோதெரபி', hi: 'नेबुलाइजेशन, ऑक्सीजन निगरानी, फिजियोथेरेपी' } }
    ]
  },
  s7: { // Technician Bulk
    scales: [
      { id: 'sc0', label: { en: 'Single Flat Multi-Appliance', ta: 'வீட்டு பல சாதனங்கள் சர்வீஸ்', hi: 'सिंगल फ्लैट मल्टी-उपकरण' }, sub: { en: '3–5 AC / Fridge / Washing Units', ta: '3–5 ஏசி / பிரிட்ஜ் / வாஷிங் மெஷின்', hi: '3–5 एसी / फ्रिज / वाशिंग यूनिट' } },
      { id: 'sc1', label: { en: 'Duplex / Villa HVAC Grid', ta: 'வில்லா ஏசி & குளிர்சாதன கிரிட்', hi: 'डुप्लेक्स / विला एचवीएसी ग्रिड' }, sub: { en: '6–10 Units & Inverter Circuits', ta: '6–10 ஏசி யூனிட்டுகள் & சர்க்யூட்', hi: '6–10 यूनिट और इन्वर्टर सर्किट' } },
      { id: 'sc2', label: { en: 'Society Pre-Summer Camp', ta: 'அப்பார்ட்மென்ட் கோடைக்கால முகாம்', hi: 'सोसाइटी प्री-समर कैंप' }, sub: { en: '15–30 AC Jet-Wash Units', ta: '15–30 ஏசி ஜெட் வாஷ் யூனிட்டுகள்', hi: '15–30 एसी जेट-वॉश यूनिट' } },
      { id: 'sc3', label: { en: 'RWA Commercial Infrastructure', ta: 'வணிக வளாக ஏசி கட்டமைப்பு', hi: 'आरडब्ल्यूए वाणिज्यिक बुनियादी ढांचा' }, sub: { en: '40+ Units & Chiller Systems', ta: '40+ ஏசி யூனிட்டுகள் & சில்லர்கள்', hi: '40+ यूनिट और चिलर सिस्टम' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Diagnostics & Jet Wash)', ta: 'பணியாளர் மட்டும் (பரிசோதனை & ஜெட் வாஷ்)', hi: 'केवल मजदूरी (निदान एवं जेट वॉश)' }, sub: { en: 'Customer pays extra for any replacement spare parts', ta: 'மாற்று உதிரிபாகங்களுக்கு தனி கட்டணம்', hi: 'अतिरिक्त पुर्जों के लिए ग्राहक भुगतान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Standard OEM Capacitors & Gas', ta: 'பணியாளர் + அசல் கெபாசிட்டர் & கேஸ் டாப்-அப்', hi: 'मजदूरी + मानक ओईएम कैपेसिटर और गैस' }, sub: { en: 'Co-op supplies heavy-duty starting capacitors & R32/R410A gas', ta: 'கூட்டுறவு சங்கம் கெபாசிட்டர் & R32 கேஸ் வழங்குகிறது', hi: 'सहकारी समिति कैपेसिटर और R32/R410A गैस प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Complete Chemical Coil Wash & PCB', ta: 'பணியாளர் + முழு கெமிக்கல் வாஷ் & பிசிபி வாரண்டி', hi: 'मजदूरी + पूर्ण रासायनिक कॉइल वॉश और पीसीबी' }, sub: { en: 'Copper coil descaling, high-pressure foam wash & PCB warranty', ta: 'காப்பர் காயில் சுத்தம் & பிசிபி போர்டு வாரண்டி', hi: 'कॉपर कॉइल स्केलिंग, हाई-प्रेशर फोम वॉश और पीसीबी वारंटी' } }
    ]
  },
  s8: { // Domestic Helper Bulk
    scales: [
      { id: 'sc0', label: { en: 'Single Event Kitchen Squad', ta: 'ஒரு விசேஷ சமையலறை குழு', hi: 'एकल इवेंट किचन स्क्वॉड' }, sub: { en: '3–4 Helpers (4 Hours Gathering)', ta: '3–4 உதவியாளர்கள் (4 மணி நேரம்)', hi: '3–4 सहायक (4 घंटे का कार्यक्रम)' } },
      { id: 'sc1', label: { en: 'Multi-Day Event / Wedding', ta: 'திருமணம் / பல நாள் விசேஷம்', hi: 'बहु-दिवसीय कार्यक्रम / शादी' }, sub: { en: '5–8 Helpers (2 Full Days)', ta: '5–8 உதவியாளர்கள் (2 முழு நாட்கள்)', hi: '5–8 सहायक (2 पूरे दिन)' } },
      { id: 'sc2', label: { en: 'Monthly 2-Slot Household', ta: 'மாதாந்திர காலை+மாலை பணி', hi: 'मासिक 2-स्लॉट घरेलू सहायक' }, sub: { en: 'Daily Morning + Evening (30 Days)', ta: 'தினமும் காலை + மாலை (30 நாட்கள்)', hi: 'दैनिक सुबह + शाम (30 दिन)' } },
      { id: 'sc3', label: { en: 'Monthly Full-Day Housekeeping', ta: 'மாதாந்திர முழு நாள் வீட்டுப் பணி', hi: 'मासिक पूर्ण-दिवसीय हाउसकीपिंग' }, sub: { en: '8 Hours Daily Cooking & Chores (30 Days)', ta: 'தினமும் 8 மணி நேர சமையல் & வேலைகள்', hi: 'प्रतिदिन 8 घंटे खाना पकाना और काम (30 दिन)' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Standard Household Chores', ta: 'வழக்கமான வீட்டு வேலைகள்', hi: 'मानक घरेलू काम' }, sub: { en: 'Sweeping, mopping, utensil washing & laundry folding', ta: 'கூட்டுதல், துடைத்தல், பாத்திரம் கழுவுதல், துணி மடித்தல்', hi: 'झाड़ू, पोंछा, बर्तन धोना और कपड़े तह करना' } },
      { id: 'm1', label: { en: 'Full 3-Course Cooking + Deep Kitchen', ta: '3 வேளை சமையல் + சமையலறை சுத்தம்', hi: 'पूर्ण 3-कोर्स खाना पकाना + गहरी रसोई सफाई' }, sub: { en: 'Vegetable chopping, multi-cuisine cooking & slab degreasing', ta: 'காய்கறி நறுக்குதல், சமையல் & மேடை சுத்தம்', hi: 'सब्जी काटना, खाना पकाना और स्लैब की सफाई' } },
      { id: 'm2', label: { en: 'All-Inclusive Event Buffet & Party Squad', ta: 'முழு விசேஷ பஃபே & பார்ட்டி குழு', hi: 'ऑल-इनक्लूसिव इवेंट बुफे और पार्टी टीम' }, sub: { en: 'Live food serving, party dishwashing & sanitization', ta: 'உணவு பரிமாறுதல், பாத்திரம் கழுவுதல் & தூய்மை', hi: 'भोजन परोसना, बर्तन धोना और स्वच्छता' } }
    ]
  },
  s9: { // Driver Bulk
    scales: [
      { id: 'sc0', label: { en: 'Single Event Valet Squad', ta: 'விசேஷ வாலட் பார்க்கிங் குழு', hi: 'सिंगल इवेंट वैले स्क्वॉड' }, sub: { en: '4 Uniformed Chauffeurs (6 Hours)', ta: '4 சீருடை ஓட்டுநர்கள் (6 மணி நேரம்)', hi: '4 वर्दीधारी ड्राइवर (6 घंटे)' } },
      { id: 'sc1', label: { en: 'Corporate Delegate Fleet', ta: 'கார்ப்பரேட் பிரதிநிதிகள் குழு', hi: 'कॉर्पोरेट प्रतिनिधि फ्लीट' }, sub: { en: '6 Luxury Chauffeurs (Full Day)', ta: '6 சொகுசு ஓட்டுநர்கள் (முழு நாள்)', hi: '6 लक्जरी ड्राइवर (पूरा दिन)' } },
      { id: 'sc2', label: { en: 'Outstation Multi-Day Relay', ta: 'வெளியூர் பல நாள் சுழற்சி', hi: 'बाहरी मल्टी-डे रिले' }, sub: { en: '3–5 Drivers (3 Days Tour)', ta: '3–5 ஓட்டுநர்கள் (3 நாட்கள்)', hi: '3–5 ड्राइवर (3 दिन का दौरा)' } },
      { id: 'sc3', label: { en: 'Monthly Dedicated Chauffeur', ta: 'மாதாந்திர பிரத்யேக ஓட்டுநர்', hi: 'मासिक समर्पित ड्राइवर' }, sub: { en: '26 Working Days (8 hrs/day)', ta: '26 வேலை நாட்கள் (8 மணி நேரம்/நாள்)', hi: '26 कार्य दिवस (8 घंटे/दिन)' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Standard Commercial DL Chauffeur', ta: 'வணிக உரிமம் பெற்ற ஓட்டுநர்', hi: 'मानक वाणिज्यिक डीएल ड्राइवर' }, sub: { en: 'Manual transmission sedans and hatchbacks with GPS', ta: 'மேனுவல் கியர் கார்கள் & ஜிபிஎஸ் வழிகாட்டல்', hi: 'मैनुअल सेडान और हैचबैक के साथ जीपीएस' } },
      { id: 'm1', label: { en: 'Automatic & Large SUV / MUV Chauffeur', ta: 'ஆட்டோமேட்டிக் & பெரிய SUV/MUV ஓட்டுநர்', hi: 'ऑटोमैटिक और बड़ी एसयूवी / एमयूवी ड्राइवर' }, sub: { en: 'Automatic transmission, Innova/Fortuner/EV certified', ta: 'ஆட்டோமேட்டிக், இன்னோவா/பார்ச்சூனர்/EV சான்றளிக்கப்பட்டவர்', hi: 'ऑटोमैटिक, इनोवा/फॉर्च्यूनर/ईवी प्रमाणित' } },
      { id: 'm2', label: { en: 'VIP Executive Luxury & Armoured Squad', ta: 'விஐபி சொகுசு மற்றும் எக்ஸிகியூட்டிவ் குழு', hi: 'वीआईपी कार्यकारी लक्जरी स्क्वॉड' }, sub: { en: 'Uniformed bilingual luxury chauffeurs (Mercedes/BMW/Audi)', ta: 'இருமொழி பேசும் சீருடை சொகுசு கார் ஓட்டுநர்கள்', hi: 'द्विभाषी लक्जरी ड्राइवर (मर्सिडीज/बीएमडब्ल्यू/ऑडी)' } }
    ]
  },
  s10: { // Gardener Bulk
    scales: [
      { id: 'sc0', label: { en: 'Balcony / Terrace Garden', ta: 'பால்கனி / மாடித் தோட்டம்', hi: 'बालकनी / छत का बगीचा' }, sub: { en: '15–35 Pots Soil Aeration', ta: '15–35 தொட்டிகள் மண் கிளறுதல்', hi: '15–35 गमलों की मिट्टी गुड़ाई' } },
      { id: 'sc1', label: { en: 'Lawn & Boundary Hedges', ta: 'புல்வெளி & எல்லை வேலி செடிகள்', hi: 'लॉन और सीमा की झाड़ियां' }, sub: { en: '~500–1,200 sq.ft Grass & Hedges', ta: '~500–1,200 சதுர அடி புல் & வேலிகள்', hi: '~500–1,200 वर्ग फुट घास और झाड़ियां' } },
      { id: 'sc2', label: { en: 'Large Villa Landscape', ta: 'பெரிய வில்லா நிலத்தோட்டம்', hi: 'बड़ा विला लैंडस्केप' }, sub: { en: '~2,000–5,000 sq.ft & Tree Pruning', ta: '~2,000–5,000 சதுர அடி & மரக்கவாத்து', hi: '~2,000–5,000 वर्ग फुट और पेड़ की छंटाई' } },
      { id: 'sc3', label: { en: 'Society Green Belt & Parks', ta: 'அப்பார்ட்மென்ட் பூங்காக்கள் & பசுமைப் பகுதி', hi: 'सोसाइटी ग्रीन बेल्ट और पार्क' }, sub: { en: '10,000+ sq.ft Community Overhaul', ta: '10,000+ சதுர அடி சமூகம் புனரமைப்பு', hi: '10,000+ वर्ग फुट सामुदायिक नवीनीकरण' } }
    ],
    materials: [
      { id: 'm0', label: { en: 'Labour Only (Horticulture Tools Only)', ta: 'பணியாளர் மட்டும் (கருவிகள் மட்டும்)', hi: 'केवल मजदूरी (केवल बागवानी उपकरण)' }, sub: { en: 'Customer supplies all soil, manure & fertilizer', ta: 'வாடிக்கையாளர் மண் & உரங்களை வழங்குகிறார்', hi: 'ग्राहक सभी मिट्टी, खाद और उर्वरक प्रदान करेगा' } },
      { id: 'm1', label: { en: 'Labour + Organic Vermicompost & Neem Care', ta: 'பணியாளர் + இயற்கை மண்புழு உரம் & வேம்பு', hi: 'मजदूरी + जैविक वर्मीकम्पोस्ट और नीम देखभाल' }, sub: { en: 'Co-op supplies fortified vermicompost & neem pest spray', ta: 'கூட்டுறவு சங்கம் மண்புழு உரம் & வேம்பு பூச்சி விரட்டி தருகிறது', hi: 'सहकारी समिति वर्मीकम्पोस्ट और नीम स्प्रे प्रदान करती है' } },
      { id: 'm2', label: { en: 'Labour + Fresh Lawn Sodding & Drip Grid', ta: 'பணியாளர் + புதிய புல்வெளி & சொட்டு நீர் பாசனம்', hi: 'मजदूरी + ताजा लॉन घास और ड्रिप ग्रिड' }, sub: { en: 'Fresh Mexican lawn sods & automated drip lines', ta: 'மெக்சிகன் புல்வெளிகள் & தானியங்கி சொட்டு நீர் லைன்', hi: 'मैक्सिकन लॉन घास और स्वचालित ड्रिप लाइनें' } }
    ]
  }
};

/**
 * Seva Suraksha 9 Scenarios Multilingual Dictionary
 */
export const SEVA_SURAKSHA_TRANSLATIONS = [
  {
    id: 1,
    icon: 'search',
    problem: {
      en: 'No worker available nearby',
      ta: 'அருகில் பணியாளர்கள் கிடைக்கவில்லை',
      hi: 'आसपास कोई कारीगर उपलब्ध नहीं है'
    },
    solution: {
      en: 'Searches partner cooperative network, schedules earliest available slot, or auto-assigns priority waitlist.',
      ta: 'கூட்டுறவு கூட்டமைப்பு நெட்வொர்க்கில் தேடுகிறது, ஆரம்ப நேரத்தை ஒதுக்குகிறது அல்லது முன்னுரிமை காத்திருப்பில் சேர்க்கிறது.',
      hi: 'साझेदार सहकारी नेटवर्क में खोज करता है, निकटतम स्लॉट शेड्यूल करता है या प्राथमिकता प्रतीक्षा सूची में जोड़ता है।'
    },
    tag: {
      en: 'Network Auto-Expand',
      ta: 'தானியங்கி நெட்வொர்க் விரிவாக்கம்',
      hi: 'नेटवर्क ऑटो-विस्तार'
    }
  },
  {
    id: 2,
    icon: 'close-circle',
    problem: {
      en: 'Worker cancels booking',
      ta: 'பணியாளர் முன்பதிவை ரத்து செய்கிறார்',
      hi: 'कारीगर द्वारा बुकिंग रद्द करना'
    },
    solution: {
      en: 'Instant automatic priority replacement search with zero cancellation penalty for customer.',
      ta: 'வாடிக்கையாளருக்கு பூஜ்ஜிய அபராதத்துடன் உடனடி மாற்று பணியாளர் ஒதுக்கீடு செய்யப்படுகிறார்.',
      hi: 'ग्राहक पर शून्य रद्दीकरण शुल्क के साथ तत्काल स्वचालित प्राथमिकता प्रतिस्थापन।'
    },
    tag: {
      en: 'Auto Replacement',
      ta: 'தானியங்கி மாற்று பணியாளர்',
      hi: 'स्वचालित प्रतिस्थापन'
    }
  },
  {
    id: 3,
    icon: 'time',
    problem: {
      en: 'Worker is running late',
      ta: 'பணியாளர் வர தாமதமாகிறது',
      hi: 'कारीगर के आने में देरी'
    },
    solution: {
      en: 'Live revised ETA updates with 1-tap option to switch to another nearby available artisan.',
      ta: 'நேரலை வருகை நேரம் புதுப்பிக்கப்பட்டு, அருகிலுள்ள மற்றொரு கைவினைஞருக்கு மாற 1-தட்டல் வசதி உண்டு.',
      hi: 'लाइव संशोधित ईटीए अपडेट और पास के अन्य उपलब्ध कारीगर पर स्विच करने के लिए 1-टैप विकल्प।'
    },
    tag: {
      en: 'Dynamic ETA',
      ta: 'நேரலை வருகை நேரம்',
      hi: 'डायनेमिक ईटीए'
    }
  },
  {
    id: 4,
    icon: 'person-remove',
    problem: {
      en: 'Wrong person arrives at doorstep',
      ta: 'வேறு நபர் வீட்டு வாசலுக்கு வருகிறார்',
      hi: 'घर पर गलत व्यक्ति का आना'
    },
    solution: {
      en: 'Do not share Start OTP! 1-tap identity mismatch report triggers immediate cooperative inspection.',
      ta: 'தொடக்க OTP-யை பகிர வேண்டாம்! 1-தட்டல் அடையாளம் பொருந்தாமை புகார் உடனடி கூட்டுறவு ஆய்வைத் தூண்டுகிறது.',
      hi: 'स्टार्ट ओटीपी साझा न करें! 1-टैप पहचान बेमेल रिपोर्ट तत्काल सहकारी निरीक्षण शुरू करती है।'
    },
    tag: {
      en: 'OTP Shield',
      ta: 'OTP பாதுகாப்பு கவசம்',
      hi: 'ओटीपी शील्ड'
    }
  },
  {
    id: 5,
    icon: 'calculator',
    problem: {
      en: 'Work cost increases during job',
      ta: 'வேலையின் போது கூடுதல் கட்டணம் கோரப்படுகிறது',
      hi: 'काम के दौरान लागत में वृद्धि'
    },
    solution: {
      en: 'Worker cannot charge extra unilaterally. Customer explicit in-app approval is strictly required.',
      ta: 'பணியாளர் தன்னிச்சையாக கூடுதல் கட்டணம் வசூலிக்க முடியாது. செயலியில் உங்கள் ஒப்புதல் கட்டாயம்.',
      hi: 'कारीगर मनमाने ढंग से अतिरिक्त शुल्क नहीं ले सकता। ऐप में उपभोक्ता की स्पष्ट स्वीकृति अनिवार्य है।'
    },
    tag: {
      en: 'In-App Approval',
      ta: 'செயலி ஒப்புதல் கட்டாயம்',
      hi: 'इन-ऐप स्वीकृति'
    }
  },
  {
    id: 6,
    icon: 'card',
    problem: {
      en: 'Payment transaction fails',
      ta: 'பணப்பரிவர்த்தனை தோல்வியடைகிறது',
      hi: 'भुगतान लेनदेन विफल होना'
    },
    solution: {
      en: 'Automatic payment retry gateway, switch to cash on delivery, or instantaneous support escalation.',
      ta: 'தானியங்கி கட்டண மறுமுயற்சி, கேஷ் ஆன் டெலிவரி முறைக்கு மாறுதல் அல்லது உடனடி உதவி.',
      hi: 'स्वचालित भुगतान पुनः प्रयास, कैश ऑन डिलीवरी पर स्विच या तत्काल सहायता।'
    },
    tag: {
      en: 'Zero-Lock Payment',
      ta: 'தடையற்ற பணப்பரிவர்த்தனை',
      hi: 'जीरो-लॉक भुगतान'
    }
  },
  {
    id: 7,
    icon: 'refresh-circle',
    problem: {
      en: 'Poor work quality / recurring leak',
      ta: 'மோசமான வேலைத்தரம் / மீண்டும் ஏற்படும் கசிவு',
      hi: 'खराब काम की गुणवत्ता / दोबारा रिसाव'
    },
    solution: {
      en: '7-Day Seva Suraksha Warranty: Free re-inspection & rework by a senior master artisan.',
      ta: '7 நாள் சேவை பாதுகாப்பு உத்தரவாதம்: மூத்த தலைமை கைவினைஞரால் இலவச மறுபரிசோதனை மற்றும் மறுவேலை.',
      hi: '7-दिवसीय सेवा सुरक्षा वारंटी: वरिष्ठ मास्टर कारीगर द्वारा मुफ्त पुनः निरीक्षण और पुनः कार्य।'
    },
    tag: {
      en: '7-Day Warranty',
      ta: '7 நாள் உத்தரவாதம்',
      hi: '7-दिवसीय वारंटी'
    }
  },
  {
    id: 8,
    icon: 'shield-alert',
    problem: {
      en: 'Safety concern or dispute',
      ta: 'பாதுகாப்பு கவலை அல்லது தகராறு',
      hi: 'सुरक्षा चिंता या विवाद'
    },
    solution: {
      en: 'Direct 24/7 Cooperative Organiser hotline intervention and field supervisor escalation.',
      ta: '24/7 கூட்டுறவு அமைப்பாளர் நேரடி உதவி எண் தலையீடு மற்றும் கள மேற்பார்வையாளர் ஆய்வு.',
      hi: 'सीधा 24/7 सहकारी आयोजक हेल्पलाइन हस्तक्षेप और फील्ड पर्यवेक्षक द्वारा निवारण।'
    },
    tag: {
      en: 'Field Arbitration',
      ta: 'கள நடுவர் தீர்வு',
      hi: 'फील्ड मध्यस्थता'
    }
  },
  {
    id: 9,
    icon: 'alert-circle',
    problem: {
      en: 'Worker no-show after confirmation',
      ta: 'உறுதிசெய்த பிறகு பணியாளர் வராமை',
      hi: 'पुष्टि के बाद कारीगर का न आना'
    },
    solution: {
      en: 'Priority reassignment within 5 minutes + cooperative disciplinary review for delinquent worker.',
      ta: '5 நிமிடங்களுக்குள் முன்னுரிமை மறுஒதுக்கீடு + வராத பணியாளர் மீது ஒழுங்கு நடவடிக்கை.',
      hi: '5 मिनट के भीतर प्राथमिकता पुनरावंटन + अनुपस्थित कारीगर के खिलाफ सहकारी अनुशासनात्मक समीक्षा।'
    },
    tag: {
      en: 'Disciplinary Trust',
      ta: 'ஒழுங்கு நடவடிக்கை நம்பிக்கை',
      hi: 'अनुशासनात्मक विश्वास'
    }
  }
];

/**
 * Grievance / Complaint Categories Multilingual List
 */
export const COMPLAINT_CATEGORIES_TRANSLATIONS = [
  {
    id: 'c1',
    label: {
      en: 'Worker did not show up (No-show)',
      ta: 'பணியாளர் வரவில்லை (நோ-ஷோ)',
      hi: 'कारीगर नहीं आया (अनुपस्थित)'
    }
  },
  {
    id: 'c2',
    label: {
      en: 'Worker arrived >30 mins late',
      ta: 'பணியாளர் 30 நிமிடங்களுக்கு மேல் தாமதமாக வந்தார்',
      hi: 'कारीगर 30 मिनट से अधिक देर से आया'
    }
  },
  {
    id: 'c3',
    label: {
      en: 'Poor work quality / recurring leak',
      ta: 'மோசமான வேலைத்தரம் / மீண்டும் கசிவு',
      hi: 'खराब काम की गुणवत्ता / दोबारा रिसाव'
    }
  },
  {
    id: 'c4',
    label: {
      en: 'Worker demanded extra unapproved cash',
      ta: 'பணியாளர் ஒப்புதல் இல்லாத கூடுதல் பணம் கோரினார்',
      hi: 'कारीगर ने अतिरिक्त अनाधिकृत नकदी की मांग की'
    }
  },
  {
    id: 'c5',
    label: {
      en: 'Payment or billing dispute',
      ta: 'கட்டணம் அல்லது பில்லிங் தகராறு',
      hi: 'भुगतान या बिलिंग विवाद'
    }
  },
  {
    id: 'c6',
    label: {
      en: 'Safety concern / identity mismatch',
      ta: 'பாதுகாப்பு கவலை / ஆள் மாறாட்டம்',
      hi: 'सुरक्षा चिंता / पहचान बेमेल'
    }
  }
];

/**
 * Rating Tags Multilingual List
 */
export const RATING_TAGS_TRANSLATIONS = [
  { id: 't1', text: { en: 'On time', ta: 'நேரத்திற்கு வந்தார்', hi: 'समय पर पहुंचे' } },
  { id: 't2', text: { en: 'Skilled & Clean', ta: 'திறமையான & சுத்தமான பணி', hi: 'कुशल और साफ कार्य' } },
  { id: 't3', text: { en: 'Professional', ta: 'தொழில்முறை ஒழுங்கு', hi: 'पेशेवर व्यवहार' } },
  { id: 't4', text: { en: 'Fair pricing', ta: 'நியாயமான கட்டணம்', hi: 'उचित मूल्य' } },
  { id: 't5', text: { en: 'Wore Safety Gear', ta: 'பாதுகாப்பு கவசம் அணிந்தார்', hi: 'सुरक्षा उपकरण पहने' } },
  { id: 't6', text: { en: 'Friendly', ta: 'நட்பான அணுகுமுறை', hi: 'विनम्र एवं मित्रवत' } },
  { id: 't7', text: { en: 'Good advice', ta: 'நல்ல ஆலோசனை தந்தார்', hi: 'अच्छी सलाह दी' } }
];
