/**
 * UniServ Deep Multi-Language Service Catalog
 * Provides full translations for all 10 services (What's Included, Step-by-Step, Safety Protocols, Trust Notes)
 */

export const serviceTranslations = {
  // =========================================================================
  // ENGLISH (en)
  // =========================================================================
  en: {
    s1: {
      name: "Plumber",
      description: "Certified cooperative plumbers for leak repairs, tap fitting, pipeline blockages, and sanitary installations.",
      duration: "30–60 mins",
      included: [
        "Complete inspection & issue diagnosis",
        "Minor leak fixing & gasket replacement",
        "Water pressure & flow testing",
        "Clean-up & sanitization after repair",
        "7-day Seva Suraksha service warranty"
      ],
      sample_steps: [
        "Worker inspects source of leakage or blockage",
        "Explains repair work & any required spares",
        "Completes precision plumbing repair",
        "Tests water flow & ensures zero leakage",
        "Customer verifies completion via OTP"
      ],
      safety_note: "Workers carry insulated tools and sanitised equipment. Main water supply will be temporarily turned off during high-pressure line repairs.",
      trust_note: "All plumbers are verified through registered Labour Cooperative Societies and carry active accidental insurance.",
      coop_warranty_title: "Cooperative Assurance (Seva Suraksha)",
      coop_warranty_desc: "Includes 7-day free rework warranty. Standard rate card fixed by Government Registered Cooperative Society.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "Standardized fair wages fixed by local Labour Cooperative. 80% direct artisan compensation."
    },
    s2: {
      name: "Electrician",
      description: "Licensed electrical technicians for switchboard repairs, short circuits, MCB fixing, wiring, and appliance connections.",
      duration: "30–45 mins",
      included: [
        "Voltage & safety earth testing",
        "Switchboard / MCB diagnosing",
        "Short-circuit isolation & wire jointing",
        "Load test with active appliances",
        "7-day Seva Suraksha service warranty"
      ],
      sample_steps: [
        "Safety checks & power supply isolation",
        "Fault detection using digital multi-meter",
        "Component repair / ISI replacement",
        "Load test with active appliances",
        "Mutual OTP sign-off"
      ],
      safety_note: "100% adherence to electrical safety protocol. Main MCB will be tripped before handling live load wires.",
      trust_note: "Certified by State Electrical Licensing Board & supported by Cooperative Welfare Fund.",
      coop_warranty_title: "Cooperative Assurance (Seva Suraksha)",
      coop_warranty_desc: "Includes 7-day free rework warranty. Standard rate card fixed by Government Registered Cooperative Society.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "Standardized fair wages fixed by local Labour Cooperative. 80% direct artisan compensation."
    },
    s3: {
      name: "Home Cleaning",
      description: "Deep home & kitchen cleaning, bathroom sanitisation, floor scrubbing, and post-event dusting by cooperative teams.",
      duration: "60–120 mins",
      included: [
        "Deep floor scrub & stain removal",
        "Bathroom tiles & fixture descaling",
        "Kitchen grease & exhaust cleanup",
        "Eco-friendly TASKI sanitisation",
        "High-touch surface disinfection"
      ],
      sample_steps: [
        "Area walkthrough with customer",
        "Dry vacuuming and dust removal",
        "Chemical-safe scrubbing & wiping",
        "Final disinfectant spray",
        "Customer inspection & sign-off"
      ],
      safety_note: "Eco-friendly, non-toxic cleaning agents used. Mask and gloves worn throughout the cleaning session.",
      trust_note: "Conducted by registered Women's Self-Help Cooperatives with 100% background verification.",
      coop_warranty_title: "Cooperative Cleaning Assurance",
      coop_warranty_desc: "Rigorous quality inspection before sign-off. Free touch-up if any area is missed.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "Direct artisan welfare with 80% wage share to women cooperative members."
    },
    s4: {
      name: "Carpentry",
      description: "Expert carpenters for door latch fixing, furniture assembly, hinge replacement, modular kitchen adjustments, and bespoke woodwork.",
      duration: "45–90 mins",
      included: [
        "Hardware & alignment diagnosis",
        "Door, window & cabinet hinge adjustment",
        "Precision wood cutting & screw tightening",
        "Smooth sanding & cleanup",
        "7-day Seva Suraksha service warranty"
      ],
      sample_steps: [
        "Inspection of wood damage or misalignment",
        "Measurement and hardware estimation",
        "Precision carpentry repair & fitting",
        "Functional testing of latches & drawers",
        "Customer verification via OTP"
      ],
      safety_note: "Carpenters carry dust extraction tools and eye protection gear during wood cutting.",
      trust_note: "Backed by National Cooperative Carpentry Guild with standardized pricing.",
      coop_warranty_title: "Cooperative Assurance (Seva Suraksha)",
      coop_warranty_desc: "7-day warranty on all joinery and fitting work.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "80% direct artisan compensation guaranteed."
    },
    s5: {
      name: "Painting",
      description: "Professional wall painters for touch-ups, moisture dampness treatment, single room painting, and exterior weather-proofing.",
      duration: "60–180 mins",
      included: [
        "Wall dampness & crack inspection",
        "Surface scraping & putty application",
        "Dual-coat precision roller application",
        "Floor & furniture masking protection",
        "1-Year Cooperative Paint Warranty"
      ],
      sample_steps: [
        "Shade selection & wall inspection",
        "Floor masking & putty preparation",
        "Primer and double coat application",
        "Masking removal and clean-up",
        "Sign-off via Completion OTP"
      ],
      safety_note: "Low-VOC, odourless, non-toxic paints used with drop cloth protection for furniture.",
      trust_note: "Executed by Certified Cooperative Painters Federation with genuine brand warranty.",
      coop_warranty_title: "Cooperative Paint Assurance",
      coop_warranty_desc: "1-Year anti-peeling warranty backed by Painters Cooperative Society.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "80% direct daily wage paid directly into painter cooperative accounts."
    },
    s6: {
      name: "Caregiver",
      description: "Compassionate elder assistance, patient mobility support, vital monitoring, and companion care by trained workers.",
      duration: "2–4 hours",
      included: [
        "Mobility & walking assistance",
        "Medicine scheduling & reminders",
        "Basic vital checks (BP / Sugar / Pulse)",
        "Nutritious meal serving assistance",
        "Comfort companionship"
      ],
      sample_steps: [
        "Introduction & patient health briefing",
        "Medication and routine schedule review",
        "Assisted mobility & personal care",
        "Vital recording & family update",
        "Safe handover"
      ],
      safety_note: "Police-verified and background-checked caregivers trained in geriatric first aid.",
      trust_note: "Operated through Healthcare Worker Cooperative Alliance.",
      coop_warranty_title: "Cooperative Caregiver Assurance",
      coop_warranty_desc: "Certified & verified companion care with dedicated healthcare supervisor oversight.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "80% direct daily compensation disbursed to care workers."
    },
    s7: {
      name: "Technician",
      description: "Expert electro-mechanical diagnosis and repair for ACs, washing machines, refrigerators, inverters, RO purifiers & motors.",
      duration: "45–60 mins",
      included: [
        "Multi-point diagnostic test",
        "Component repair & gas pressure check",
        "Filter cleaning & power testing",
        "Genuine spare part recommendation",
        "7-day Seva Suraksha warranty"
      ],
      sample_steps: [
        "Diagnostic run & error code check",
        "Fault explanation with transparent pricing",
        "Parts replacement / service",
        "Performance benchmarking",
        "OTP completion"
      ],
      safety_note: "Certified technicians with surge protection gear and refrigerant recovery bags.",
      trust_note: "Standardised cooperative rate card ensures zero hidden or inflated charges.",
      coop_warranty_title: "Cooperative Technician Assurance (Seva Suraksha)",
      coop_warranty_desc: "7-day comprehensive warranty on repairs and genuine cooperative spares.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "Standardized fair wages fixed by local Labour Cooperative. 80% direct technician compensation."
    },
    s8: {
      name: "Domestic Helper",
      description: "Verified household support for daily chores, dishwashing, meal prep assistance, laundry folding, and kitchen upkeep.",
      duration: "1–2 hours",
      included: [
        "Utensil washing & kitchen sink sanitisation",
        "Vegetable chopping & basic meal preparation",
        "Floor dusting, sweeping & surface wiping",
        "Laundry washing & folding assistance",
        "Disposal of sorted household waste"
      ],
      sample_steps: [
        "Task list briefing with homeowner",
        "Kitchen counter prep & dish washing",
        "Household sweeping and surface dusting",
        "Trash disposal & sanitisation",
        "Mutual sign-off"
      ],
      safety_note: "100% background and police verified through Women Labour Cooperatives with photo identity cards.",
      trust_note: "Guaranteed fair living wages with zero middleman deductions under Mahila Labour Union.",
      coop_warranty_title: "Cooperative Household Assurance",
      coop_warranty_desc: "Reliable doorstep service with rigorous quality check and supervisor support.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "80% direct daily wage share to women cooperative members."
    },
    s9: {
      name: "Driver & Cab",
      description: "Police-verified cooperative chauffeurs for city commutes, airport transfers, outstation round-trips, and commercial cabs.",
      duration: "As per trip (2–8 hrs)",
      included: [
        "Police-verified & commercial license driver",
        "Safe route navigation via GPS",
        "Vehicle sanitization & luggage assistance",
        "Zero surge pricing & transparent hourly rates",
        "Cooperative Travel Safety Shield"
      ],
      sample_steps: [
        "Driver arrives at pickup location on time",
        "Start OTP handshake to commence trip",
        "Safe and smooth driving via optimal route",
        "Trip completion at drop destination",
        "Final fare calculation & OTP sign-off"
      ],
      safety_note: "Strict adherence to speed limits and zero-distraction driving policies.",
      trust_note: "Members of the Auto & Taxi Drivers Cooperative Welfare Federation.",
      coop_warranty_title: "Cooperative Travel Assurance",
      coop_warranty_desc: "Fixed cooperative rate card with 24/7 SOS safety monitoring.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "Direct 85% trip fare disbursed into driver's cooperative account."
    },
    s10: {
      name: "Gardening",
      description: "Experienced horticulturists and gardeners for lawn mowing, plant pruning, organic fertilizing, and terrace garden setup.",
      duration: "60–120 mins",
      included: [
        "Plant health inspection & pest detection",
        "Lawn mowing & hedge trimming",
        "Organic vermicompost soil enrichment",
        "Weed removal & root aeration",
        "Green waste clearance & clean-up"
      ],
      sample_steps: [
        "Garden inspection with customer",
        "Pruning, trimming & hedge shaping",
        "Soil tilling & fertilizer application",
        "Watering & green waste composting setup",
        "Completion inspection & OTP sign-off"
      ],
      safety_note: "100% organic fertilizers and bio-pesticides safe for children and pets.",
      trust_note: "Supported by Farmers & Horticulturists Cooperative Society.",
      coop_warranty_title: "Cooperative Garden Assurance",
      coop_warranty_desc: "Healthy plant growth guarantee with organic soil enrichment.",
      coop_fairwage_title: "Cooperative Fair Wage Guarantee",
      coop_fairwage_desc: "80% direct compensation to skilled rural gardeners."
    }
  },

  // =========================================================================
  // TAMIL (தமிழ்)
  // =========================================================================
  ta: {
    s1: {
      name: "குழாய் பழுது (Plumber)",
      description: "குழாய் கசிவு சரிசெய்தல், புதிய குழாய் பொருத்துதல், அடைப்பு நீக்குதல் மற்றும் சானிட்டரி பணிகளுக்கான சான்றளிக்கப்பட்ட கூட்டுறவு பிளம்பர்கள்.",
      duration: "30–60 நிமிடங்கள்",
      included: [
        "முழுமையான ஆய்வு & பிரச்சனை கண்டறிதல்",
        "சிறிய கசிவு சரிசெய்தல் & வாஷர் மாற்றுதல்",
        "நீர் அழுத்த சோதனை & கசிவின்மை உறுதி",
        "பணி முடிந்ததும் இடத்தை சுத்தம் செய்தல்",
        "7-நாள் சேவா சுரக்ஷா இலவச சேவை உத்தரவாதம்"
      ],
      sample_steps: [
        "தொழிலாளர் கசிவு அல்லது அடைப்பின் மூலத்தை ஆய்வு செய்வார்",
        "பழுதுபார்க்கும் முறை மற்றும் தேவைப்படும் உதிரிபாகங்களை விளக்குவார்",
        "துல்லியமான பிளம்பிங் பழுதுபார்க்கும் பணியை முடிப்பார்",
        "நீர் ஓட்டத்தை சோதித்து கசிவு இல்லை என்பதை உறுதி செய்வார்",
        "வாடிக்கையாளர் OTP மூலம் பணியை சரிபார்த்து நிறைவு செய்வார்"
      ],
      safety_note: "தொழிலாளர்கள் காப்பிடப்பட்ட கருவிகள் மற்றும் கிருமிநாசினி செய்யப்பட்ட உபகரணங்களை கொண்டு வருவார்கள். பிரதான நீர் இணைப்பு தற்காலிகமாக நிறுத்தப்படலாம்.",
      trust_note: "அனைத்து பிளம்பர்களும் அரசு பதிவுபெற்ற தொழிலாளர் கூட்டுறவு சங்கம் மூலம் சரிபார்க்கப்பட்டு காப்பீடு செய்யப்பட்டுள்ளனர்.",
      coop_warranty_title: "கூட்டுறவு உத்தரவாதம் (சேவா சுரக்ஷா)",
      coop_warranty_desc: "7-நாள் இலவச மறுவேலை உத்தரவாதம் உண்டு. அரசு பதிவுபெற்ற கூட்டுறவு சங்கத்தால் நிர்ணயிக்கப்பட்ட நிலையான கட்டண அட்டை.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "உள்ளூர் தொழிலாளர் கூட்டுறவு சங்கத்தின் நிலையான கூலி. 80% நேரடி வருமானம் தொழிலாளிக்கு செல்கிறது."
    },
    s2: {
      name: "மின்சார பழுது (Electrician)",
      description: "சுவிட்ச்போர்டு பழுது, ஷார்ட் சர்க்யூட், MCB சரிசெய்தல், வயரிங் மற்றும் சாதன இணைப்புகளுக்கான உரிமம் பெற்ற எலக்ட்ரீஷியன்கள்.",
      duration: "30–45 நிமிடங்கள்",
      included: [
        "மின்னழுத்தம் & பூமி இணைப்பு (Earth) சோதனை",
        "சுவிட்ச்போர்டு / MCB குறைபாடு கண்டறிதல்",
        "ஷார்ட் சர்க்யூட் நீக்குதல் & பாதுகாப்பான வயரிங்",
        "மின் சாதனங்களை இயக்கி சுமை சோதனை செய்தல்",
        "7-நாள் சேவா சுரக்ஷா சேவை உத்தரவாதம்"
      ],
      sample_steps: [
        "பாதுகாப்பு சோதனை & பிரதான மின் இணைப்பை துண்டித்தல்",
        "டிஜிட்டல் மல்டி-மீட்டர் மூலம் கோளாறை துல்லியமாக கண்டறிதல்",
        "ISI தர உதிரிபாகங்களை கொண்டு பழுதுபார்த்தல்",
        "மின் சாதனங்களை இயக்கி சுமை சோதனை செய்தல்",
        "இருதரப்பு OTP மூலம் பணி நிறைவு உறுதி செய்தல்"
      ],
      safety_note: "100% மின் பாதுகாப்பு நெறிமுறைகள் பின்பற்றப்படும். உயிருள்ள மின் கம்பிகளை கையாளுவதற்கு முன் பிரதான MCB அணைக்கப்படும்.",
      trust_note: "மாநில மின்சார உரிம வாரியத்தால் சான்றளிக்கப்பட்டு, தொழிலாளர் நல நிதியால் ஆதரிக்கப்படுகிறது.",
      coop_warranty_title: "கூட்டுறவு உத்தரவாதம் (சேவா சுரக்ஷா)",
      coop_warranty_desc: "7-நாள் இலவச மறுவேலை உத்தரவாதம். அரசு கூட்டுறவு சங்க நிலையான விலை அட்டை.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி வருமானம் எலக்ட்ரீஷியன் கூட்டுறவு கணக்கிற்கு செலுத்தப்படுகிறது."
    },
    s3: {
      name: "வீடு சுத்தம் (Cleaning)",
      description: "வீடு & சமையலறை முழுமையான சுத்தம், குளியலறை கிருமிநாசினி, தரை மெருகூட்டுதல் மற்றும் மகளிர் கூட்டுறவு குழுக்களின் சேவை.",
      duration: "60–120 நிமிடங்கள்",
      included: [
        "தரை முழு ஆழ்துடைப்பு & கறை நீக்குதல்",
        "குளியலறை டைல்ஸ் & குழாய்கள் உப்புக்கறை நீக்கம்",
        "சமையலறை எண்ணெய் பிசுக்கு & எக்ஸாஸ்ட் சுத்தம்",
        "சுற்றுச்சூழலுக்கு பாதுகாப்பான TASKI கிருமிநாசினி",
        "கதவு கைப்பிடிகள் மற்றும் மேற்பரப்பு தூய்மைப்படுத்துதல்"
      ],
      sample_steps: [
        "வாடிக்கையாளருடன் சுத்தம் செய்ய வேண்டிய இடத்தை பார்வையிடுதல்",
        "உலர் வாக்யூம் மூலம் தூசி மற்றும் அழுக்கை நீக்குதல்",
        "பாதுகாப்பான திரவங்களை கொண்டு தேய்த்து துடைத்தல்",
        "இறுதி கிருமிநாசினி தெளிப்பு",
        "வாடிக்கையாளர் ஆய்வு செய்து OTP உறுதி செய்தல்"
      ],
      safety_note: "நச்சுத்தன்மையற்ற, இயற்கைக்கு உகந்த பொருட்கள் பயன்படுத்தப்படும். ஊழியர்கள் முகக்கவசம் மற்றும் கையுறைகள் அணிவர்.",
      trust_note: "அரசு மகளிர் சுயஉதவி கூட்டுறவு சங்கங்களால் நடத்தப்படும் 100% பின்னணி சரிபார்க்கப்பட்ட தொழிலாளர்கள்.",
      coop_warranty_title: "கூட்டுறவு தூய்மை உத்தரவாதம்",
      coop_warranty_desc: "பணி நிறைவுக்கு முன் முழு ஆய்வு. ஏதேனும் விடுபட்டிருந்தால் உடனடியாக இலவசமாக சுத்தம் செய்யப்படும்.",
      coop_fairwage_title: "கூட்டுறவு மகளிர் கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி வருமானம் மகளிர் கூட்டுறவு சங்க உறுப்பினர்களுக்கு வழங்கப்படுகிறது."
    },
    s4: {
      name: "தச்சு வேலை (Carpenter)",
      description: "கதவு பூட்டு பொருத்துதல், மரச்சாமான்கள் பழுது, கீல் மாற்றுதல் மற்றும் மாடுலர் கிச்சன் தச்சு வேலைகளுக்கான அனுபவமிக்க தச்சர்கள்.",
      duration: "45–90 நிமிடங்கள்",
      included: [
        "மரச்சாமான்கள் & கதவு சீரமைப்பு ஆய்வு",
        "கதவு, ஜன்னல் & அலமாரி கீல்கள் சரிசெய்தல்",
        "துல்லியமான மரம் வெட்டுதல் & திருகுகளை இறுக்குதல்",
        "மென்மையான சாண்டிங் & இடத்தை சுத்தம் செய்தல்",
        "7-நாள் சேவா சுரக்ஷா சேவை உத்தரவாதம்"
      ],
      sample_steps: [
        "மரச் சேதம் அல்லது விலகலை ஆய்வு செய்தல்",
        "அளவீடு எடுத்து தேவைப்படும் பாகங்களை தெரிவித்தல்",
        "துல்லியமான தச்சு பழுது மற்றும் பொருத்துதல்",
        "பூட்டுகள் மற்றும் இழுப்பறைகளை இயக்கி பார்த்தல்",
        "OTP மூலம் வாடிக்கையாளர் சரிபார்த்தல்"
      ],
      safety_note: "மரம் வெட்டும் போது தூசி பரவாமல் தடுக்க உறிஞ்சும் கருவிகள் மற்றும் கண் பாதுகாப்பு உபகரணங்கள் பயன்படுத்தப்படும்.",
      trust_note: "தேசிய தச்சு கூட்டுறவு சங்கத்தின் அங்கீகாரம் பெற்ற தொழிலாளர்கள்.",
      coop_warranty_title: "கூட்டுறவு தச்சு உத்தரவாதம்",
      coop_warranty_desc: "அனைத்து தச்சு மற்றும் பொருத்துதல் வேலைகளுக்கும் 7-நாள் உத்தரவாதம்.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி கூலி தச்சரின் வங்கிக் கணக்கிற்கு நேரடியாக செலுத்தப்படுகிறது."
    },
    s5: {
      name: "வர்ணம் பூசுதல் (Painting)",
      description: "சுவர் ஈரப்பதம் நீக்குதல், விரிசல் அடைத்தல், ஒற்றை அறை பெயிண்டிங் மற்றும் முழு வீட்டு வண்ணப் பூச்சு வேலைகள்.",
      duration: "60–180 நிமிடங்கள்",
      included: [
        "சுவர் ஈரப்பதம் & விரிசல் ஆய்வு",
        "பழைய பூச்சை சுரண்டி புட்டி பூசுதல்",
        "ரோலர் மூலம் இரு அடுக்கு துல்லிய பெயிண்டிங்",
        "தரை மற்றும் மரச்சாமான்களுக்கு பிளாஸ்டிக் பாதுகாப்பு",
        "1-ஆண்டு கூட்டுறவு பெயிண்ட் உத்தரவாதம்"
      ],
      sample_steps: [
        "வண்ணத் தேர்வு & சுவர்களை ஆய்வு செய்தல்",
        "தரை பாதுகாப்பு விரிப்பு & புட்டி தயார் செய்தல்",
        "பிரைமர் மற்றும் இரு அடுக்கு வண்ணப் பூச்சு",
        "பாதுகாப்பு விரிப்புகளை அகற்றி சுத்தம் செய்தல்",
        "நிறைவு OTP மூலம் உறுதி செய்தல்"
      ],
      safety_note: "துர்நாற்றமற்ற, நச்சுத்தன்மையற்ற பிராண்டட் வண்ணங்கள் மட்டுமே பயன்படுத்தப்படும்.",
      trust_note: "சான்றளிக்கப்பட்ட கூட்டுறவு பெயிண்டர்ஸ் சம்மேளனம் மூலம் நேரடி சேவை.",
      coop_warranty_title: "கூட்டுறவு வண்ண உத்தரவாதம்",
      coop_warranty_desc: "பெயிண்ட் உதிராமல் இருக்க 1-ஆண்டு கூட்டுறவு உத்தரவாதம்.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி தினசரி கூலி தொழிலாளருக்கு வழங்கப்படுகிறது."
    },
    s6: {
      name: "பராமரிப்பாளர் (Caregiver)",
      description: "முதியோர் உதவி, நோயாளி நடமாட்ட ஆதரவு, முக்கிய உடல் நலம் கண்காணிப்பு மற்றும் பயிற்சி பெற்ற தோழமை பராமரிப்பு.",
      duration: "2–4 மணி நேரம்",
      included: [
        "நடமாட்டம் & நடைப்பயிற்சி உதவி",
        "மருந்து அட்டவணை & நினைவூட்டல்கள்",
        "அடிப்படை உடல் பரிசோதனை (பிபி / சர்க்கரை / நாடி)",
        "சத்தான உணவு பரிமாறும் உதவி",
        "தோழமை & ஆதரவு பராமரிப்பு"
      ],
      sample_steps: [
        "அறிமுகம் & நோயாளி உடல்நிலை விவரம் கேட்டறிதல்",
        "மருந்து மற்றும் தினசரி அட்டவணையை ஆய்வு செய்தல்",
        "உதவி நடமாட்டம் & தனிப்பட்ட கவனிப்பு",
        "உடல் பரிசோதனை அளவீடு & குடும்பத்தினருக்கு தெரிவித்தல்",
        "பாதுகாப்பான ஒப்படைப்பு"
      ],
      safety_note: "முதியோர் முதலுதவி பயிற்சி பெற்ற மற்றும் காவல்துறை சரிபார்க்கப்பட்ட பராமரிப்பாளர்கள்.",
      trust_note: "சுகாதார பணியாளர் கூட்டுறவு கூட்டணி மூலம் நேரடி சேவை.",
      coop_warranty_title: "கூட்டுறவு பராமரிப்பு உத்தரவாதம்",
      coop_warranty_desc: "அர்ப்பணிப்பு மேற்பார்வையாளர் ஆதரவுடன் சான்றளிக்கப்பட்ட தோழமை சேவை.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி வருமானம் பராமரிப்பு தொழிலாளர்களுக்கு வழங்கப்படுகிறது."
    },
    s7: {
      name: "டெக்னீசியன் (Technician)",
      description: "ஏசி, வாஷிங் மெஷின், குளிர்சாதன பெட்டி, இன்வெர்ட்டர், ஆர்ஓ மற்றும் மோட்டார்களுக்கான எலக்ட்ரோ மெக்கானிக்கல் ஆய்வு மற்றும் பழுதுநீக்கம்.",
      duration: "45–60 நிமிடங்கள்",
      included: [
        "பலமுனை சாதன ஆய்வு பட்டியல்",
        "உதிரிபாக பழுது & எரிவாயு அழுத்த சோதனை",
        "பில்டர் சுத்தம் & மின் சுமை சோதனை",
        "அசல் உதிரிபாக பரிந்துரை",
        "7-நாள் சேவா சுரக்ஷா சேவை உத்தரவாதம்"
      ],
      sample_steps: [
        "கோளாறு கண்டறிதல் & எரர் கோட் ஆய்வு",
        "வெளிப்படையான கட்டணத்துடன் பழுது விளக்கம்",
        "பாகங்கள் மாற்றுதல் / சர்வீஸ்",
        "செயல்திறன் மதிப்பீடு",
        "OTP நிறைவு உறுதிப்படுத்தல்"
      ],
      safety_note: "உயர் மின்னழுத்த பாதுகாப்பு மற்றும் சான்றளிக்கப்பட்ட உபகரணங்களுடன் கூடிய தொழில்நுட்ப வல்லுநர்கள்.",
      trust_note: "அரசு பதிவுபெற்ற கூட்டுறவு சங்கத்தின் நிலையான கட்டண முறை.",
      coop_warranty_title: "கூட்டுறவு உத்தரவாதம் (சேவா சுரக்ஷா)",
      coop_warranty_desc: "அனைத்து பழுது மற்றும் உதிரிபாகங்களுக்கு 7-நாள் முழு உத்தரவாதம்.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி வருமானம் தொழில்நுட்ப கலைஞர்களுக்கு வழங்கப்படுகிறது."
    },
    s8: {
      name: "வீட்டு உதவியாளர் (Domestic Helper)",
      description: "வீட்டு வேலைகள், பாத்திரம் கழுவுதல், சமையல் உதவி, துணி மடித்தல் மற்றும் சமையலறை தூய்மைக்கான சரிபார்க்கப்பட்ட உதவி.",
      duration: "1–2 மணி நேரம்",
      included: [
        "பாத்திரம் கழுவுதல் & சிங்க் சுத்தம்",
        "காய்கறி நறுக்குதல் & எளிய சமையல் உதவி",
        "தரை பெருக்குதல் & மேற்பரப்பு துடைத்தல்",
        "துணி துவைத்தல் & மடித்தல் உதவி",
        "வீட்டுக் கழிவுகளை தரம் பிரித்து அகற்றுதல்"
      ],
      sample_steps: [
        "வாடிக்கையாளருடன் வேலை பட்டியல் ஆலோசனை",
        "சமையலறை மேடை & பாத்திரங்கள் சுத்தம்",
        "வீடு கூட்டுதல் மற்றும் தூசிகள் துடைத்தல்",
        "கழிவுகள் அகற்றுதல் & சுகாதாரம் உறுதி செய்தல்",
        "இருதரப்பு நிறைவு உறுதி"
      ],
      safety_note: "மகளிர் தொழிலாளர் கூட்டுறவு சங்கம் மூலம் 100% காவல்துறை சரிபார்க்கப்பட்ட அடையாள அட்டை பெற்றவர்கள்.",
      trust_note: "இடைத்தரகர் கமிஷன் இல்லாத நேரடி நியாயமான கூலி உத்தரவாதம்.",
      coop_warranty_title: "கூட்டுறவு வீட்டு உதவி உத்தரவாதம்",
      coop_warranty_desc: "நம்பகமான வீட்டு சேவை மற்றும் மேற்பார்வையாளர் வழிகாட்டுதல்.",
      coop_fairwage_title: "கூட்டுறவு மகளிர் கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி தினசரி கூலி மகளிர் கூட்டுறவு உறுப்பினர்களுக்கு வழங்கப்படுகிறது."
    },
    s9: {
      name: "டிரைவர் சேவை (Driver)",
      description: "நகரப் பயணம், விமான நிலைய பயணம், வெளியூர் சுற்றுப்பயணங்களுக்கான காவல்துறை சரிபார்க்கப்பட்ட கூட்டுறவு ஓட்டுநர்கள்.",
      duration: "பயண நேரத்திற்கு ஏற்ப (2–8 மணி நேரம்)",
      included: [
        "காவல்துறை சரிபார்க்கப்பட்ட வணிக உரிமம் கொண்ட ஓட்டுநர்",
        "GPS மூலம் பாதுகாப்பான மற்றும் குறுகிய வழிப் பயணம்",
        "வாகனம் சுத்தம் செய்தல் & லக்கேஜ் உதவி",
        "கூடுதல் கட்டண உயர்வு இல்லாத வெளிப்படையான கட்டணம்",
        "கூட்டுறவு பயண பாதுகாப்பு காப்பீடு"
      ],
      sample_steps: [
        "ஓட்டுநர் குறித்த நேரத்திற்கு அழைத்த இடத்திற்கு வருவார்",
        "பயணத்தை தொடங்க Start OTP-ஐ சரிபார்த்தல்",
        "பாதுகாப்பான மற்றும் அமைதியான முறையில் வாகனம் ஓட்டுதல்",
        "இலக்கை அடைந்ததும் பயணத்தை முடித்தல்",
        "இறுதி கட்டணம் சரிபார்த்து நிறைவு OTP பகிர்தல்"
      ],
      safety_note: "வேக வரம்புகள் மற்றும் கவனச்சிதறல் இல்லாத ஓட்டுநர் கொள்கைகள் கண்டிப்பாக பின்பற்றப்படும்.",
      trust_note: "ஆட்டோ மற்றும் டாக்ஸி ஓட்டுநர்கள் கூட்டுறவு சம்மேளனத்தின் உறுப்பினர்கள்.",
      coop_warranty_title: "கூட்டுறவு பயண பாதுகாப்பு உத்தரவாதம்",
      coop_warranty_desc: "24/7 SOS அவசர கண்காணிப்புடன் கூடிய நிலையான கட்டண முறை.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "பயணக் கட்டணத்தில் 85% நேரடியாக ஓட்டுநரின் கூட்டுறவு கணக்கிற்கு செல்கிறது."
    },
    s10: {
      name: "தோட்ட வேலை (Gardening)",
      description: "புல்வெளி வெட்டுதல், செடிகளை கவாத்து செய்தல், இயற்கை உரம் இடுதல் மற்றும் மாடித் தோட்டம் அமைக்கும் தோட்டக்கலை நிபுணர்கள்.",
      duration: "60–120 நிமிடங்கள்",
      included: [
        "செடிகளின் ஆரோக்கிய ஆய்வு & பூச்சி தாக்குதல் கண்டறிதல்",
        "புல்வெளி வெட்டுதல் & செடி சீரமைத்தல்",
        "இயற்கை மண்புழு உரம் இடுதல்",
        "களை எடுத்தல் & வேர்களுக்கு காற்று புகுதல்",
        "தோட்டக் கழிவுகளை அகற்றி சுத்தம் செய்தல்"
      ],
      sample_steps: [
        "வாடிக்கையாளருடன் தோட்டத்தை பார்வையிடுதல்",
        "செடிகளை கவாத்து செய்து வடிவமைப்பு செய்தல்",
        "மண்ணை கிளறி இயற்கை உரம் இடுதல்",
        "தண்ணீர் பாய்ச்சுதல் & கழிவுகளை அகற்றுதல்",
        "இறுதி ஆய்வு செய்து OTP உறுதி செய்தல்"
      ],
      safety_note: "100% இயற்கை உரங்கள் மற்றும் உயிரி பூச்சிக்கொல்லிகள் மட்டுமே பயன்படுத்தப்படும்.",
      trust_note: "விவசாயிகள் மற்றும் தோட்டக்கலை கூட்டுறவு சங்கத்தின் ஆதரவு பெற்ற தொழிலாளர்கள்.",
      coop_warranty_title: "கூட்டுறவு தோட்ட உத்தரவாதம்",
      coop_warranty_desc: "ஆரோக்கியமான செடி வளர்ச்சி மற்றும் இயற்கை மண் செறிவூட்டல் உத்தரவாதம்.",
      coop_fairwage_title: "கூட்டுறவு நேரடி கூலி உத்தரவாதம்",
      coop_fairwage_desc: "80% நேரடி கூலி கிராமப்புற தோட்டக்கலைஞர்களுக்கு வழங்கப்படுகிறது."
    }
  },

  // =========================================================================
  // HINDI (हिन्दी)
  // =========================================================================
  hi: {
    s1: {
      name: "प्लंबर (नलसाज)",
      description: "पानी का रिसाव, नया नल लगाना, पाइपलाइन रुकावट और सेनेटरी कार्य हेतु प्रमाणित सहकारी प्लंबर।",
      duration: "30–60 मिनट",
      included: [
        "संपूर्ण निरीक्षण एवं समस्या का सटीक निदान",
        "छोटा रिसाव ठीक करना एवं वॉशर बदलना",
        "पानी के दबाव की जांच एवं रिसाव-मुक्त परीक्षण",
        "मरम्मत के बाद कार्यस्थल की सफाई",
        "7-दिवसीय सेवा सुरक्षा निःशुल्क वारंटी"
      ],
      sample_steps: [
        "कारीगर रिसाव या रुकावट के स्रोत की जांच करता है",
        "मरम्मत कार्य एवं आवश्यक स्पेयर पार्ट्स की व्याख्या करता है",
        "सटीक प्लंबिंग मरम्मत कार्य पूर्ण करता है",
        "पानी का प्रवाह जांचकर शून्य रिसाव सुनिश्चित करता है",
        "ग्राहक OTP द्वारा कार्य का सत्यापन करता है"
      ],
      safety_note: "कारीगर इंसुलेटेड टूल्स और सैनिटाइज्ड उपकरण लाते हैं। उच्च दबाव वाली लाइनों की मरम्मत के दौरान मुख्य जल आपूर्ति अस्थायी रूप से बंद की जाएगी।",
      trust_note: "सभी प्लंबर सरकारी पंजीकृत श्रम सहकारी समितियों द्वारा सत्यापित हैं और सक्रिय दुर्घटना बीमा धारक हैं।",
      coop_warranty_title: "सहकारी गारंटी (सेवा सुरक्षा)",
      coop_warranty_desc: "7-दिवसीय निःशुल्क दोबारा मरम्मत वारंटी शामिल है। सरकार पंजीकृत सहकारी समिति द्वारा तय मानकीकृत दरें।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "80% सीधा वेतन कारीगर के सहकारी खाते में जमा होता है।"
    },
    s2: {
      name: "इलेक्ट्रीशियन",
      description: "स्विचबोर्ड मरम्मत, शॉर्ट सर्किट, एमसीबी ठीक करना, वायरिंग और उपकरणों के कनेक्शन हेतु लाइसेंस प्राप्त इलेक्ट्रीशियन।",
      duration: "30–45 मिनट",
      included: [
        "वोल्टेज एवं अर्थिंग सुरक्षा परीक्षण",
        "स्विचबोर्ड / MCB दोष का निदान",
        "शॉर्ट सर्किट अलग करना एवं सुरक्षित वायरिंग",
        "सक्रिय उपकरणों के साथ लोड परीक्षण",
        "7-दिवसीय सेवा सुरक्षा वारंटी"
      ],
      sample_steps: [
        "सुरक्षा जांच एवं मुख्य बिजली आपूर्ति बंद करना",
        "डिजिटल मल्टी-मीटर से खराबी का सटीक पता लगाना",
        "ISI प्रमाणित घटकों से मरम्मत या प्रतिस्थापन",
        "उपकरणों के साथ लोड परीक्षण",
        "पारस्परिक OTP द्वारा कार्य पूर्णता सत्यापन"
      ],
      safety_note: "100% विद्युत सुरक्षा नियमों का पालन। लोड तारों को छूने से पहले मुख्य MCB ट्रिप की जाएगी।",
      trust_note: "राज्य विद्युत लाइसेंसिंग बोर्ड द्वारा प्रमाणित एवं श्रम कल्याण कोष द्वारा समर्थित।",
      coop_warranty_title: "सहकारी गारंटी (सेवा सुरक्षा)",
      coop_warranty_desc: "7-दिवसीय निःशुल्क दोबारा कार्य वारंटी। सहकारी समिति द्वारा तय पारदर्शी दरें।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "80% सीधा वेतन कारीगर के सहकारी खाते में जमा होता है।"
    },
    s3: {
      name: "गृह सफाई (Cleaning)",
      description: "गहन गृह एवं रसोई सफाई, बाथरूम कीटाणुशोधन, फर्श स्क्रबिंग और महिला सहकारी समितियों द्वारा सेवाएं।",
      duration: "60–120 मिनट",
      included: [
        "गहन फर्श स्क्रबिंग एवं दाग हटाना",
        "बाथरूम टाइल्स एवं फिटिंग्स की सफाई",
        "रसोई के तेल-चिकनाई और एग्जॉस्ट की सफाई",
        "पर्यावरण-अनुकूल TASKI कीटाणुशोधन",
        "दरवाजों के हैंडल और सतहों की सफाई"
      ],
      sample_steps: [
        "ग्राहक के साथ क्षेत्र का निरीक्षण",
        "ड्राई वैक्यूमिंग और धूल हटाना",
        "सुरक्षित रसायनों से स्क्रबिंग और पोंछा",
        "अंतिम कीटाणुनाशक स्प्रे",
        "ग्राहक निरीक्षण एवं OTP सत्यापन"
      ],
      safety_note: "गैर-विषैले, पर्यावरण के अनुकूल रसायनों का उपयोग। पूरे कार्य के दौरान मास्क और दस्ताने अनिवार्य।",
      trust_note: "पंजीकृत महिला स्वयं सहायता सहकारी समितियों द्वारा संचालित 100% सत्यापित कार्य।",
      coop_warranty_title: "सहकारी स्वच्छता गारंटी",
      coop_warranty_desc: "यदि कोई स्थान छूट जाए तो तुरंत निःशुल्क दोबारा सफाई।",
      coop_fairwage_title: "सहकारी महिला कल्याण गारंटी",
      coop_fairwage_desc: "80% सीधा पारिश्रमिक महिला सदस्यों के खाते में।"
    },
    s4: {
      name: "बढ़ई कार्य (Carpenter)",
      description: "दरवाजे के लॉक, फर्नीचर मरम्मत, कब्जे बदलना, मॉड्यूलर किचन समायोजन और लकड़ी के काम हेतु कुशल बढ़ई।",
      duration: "45–90 मिनट",
      included: [
        "फर्नीचर एवं लॉक संरेखण का निरीक्षण",
        "दरवाजे, खिड़की एवं अलमारी के कब्जों की मरम्मत",
        "सटीक लकड़ी कटाई एवं पेच कसना",
        "सैंडिंग एवं कार्यस्थल की सफाई",
        "7-दिवसीय सेवा सुरक्षा वारंटी"
      ],
      sample_steps: [
        "लकड़ी की खराबी का निरीक्षण",
        "माप लेना और आवश्यक सामान बताना",
        "सटीक बढ़ईगीरी मरम्मत एवं फिटिंग",
        "लॉक और दराजों का परीक्षण",
        "OTP द्वारा ग्राहक सत्यापन"
      ],
      safety_note: "लकड़ी काटने के दौरान धूल न फैले इसके लिए सक्शन टूल्स और सुरक्षा चश्मे का उपयोग।",
      trust_note: "राष्ट्रीय बढ़ई सहकारी संघ द्वारा समर्थित।",
      coop_warranty_title: "सहकारी बढ़ई गारंटी",
      coop_warranty_desc: "सभी फिटिंग और मरम्मत पर 7-दिन की वारंटी।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "80% सीधा वेतन कारीगर को।"
    },
    s5: {
      name: "पेंटिंग (Painting)",
      description: "दीवार की नमी का उपचार, दरारें भरना, एक कमरे की पेंटिंग और संपूर्ण गृह सज्जा हेतु पेशेवर पेंटर।",
      duration: "60–180 मिनट",
      included: [
        "दीवार की नमी और दरारों का निरीक्षण",
        "पुरानी पपड़ी खुरचना और पुट्टी लगाना",
        "रोलर द्वारा दोहरा कोट पेंट लगाना",
        "फर्श और फर्नीचर की प्लास्टिक सुरक्षा",
        "1-वर्षीय सहकारी पेंट वारंटी"
      ],
      sample_steps: [
        "रंग चयन और दीवारों का निरीक्षण",
        "फर्श ढंकना और पुट्टी की तैयारी",
        "प्राइमर और डबल कोट पेंटिंग",
        "सुरक्षा कवर हटाना और सफाई",
        "समाप्ति OTP द्वारा सत्यापन"
      ],
      safety_note: "गंधहीन, गैर-विषैले और पर्यावरण-सुरक्षित ब्रांडेड पेंट का उपयोग।",
      trust_note: "प्रमाणित सहकारी पेंटर्स फेडरेशन द्वारा समर्थित।",
      coop_warranty_title: "सहकारी पेंट गारंटी",
      coop_warranty_desc: "पेंट न छूटने की 1-वर्षीय सहकारी वारंटी।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "80% सीधा दैनिक वेतन पेंटर को।"
    },
    s6: {
      name: "केयरगिवर (देखभालकर्ता)",
      description: "प्रशिक्षित कर्मियों द्वारा बुजुर्गों की सहायता, गतिशीलता समर्थन, महत्वपूर्ण स्वास्थ्य जांच और पारिवारिक देखभाल।",
      duration: "2–4 घंटे",
      included: [
        "चलने-फिरने में सहायता",
        "दवा समय सारणी और याद दिलाना",
        "बुनियादी स्वास्थ्य जांच (बीपी / शुगर / पल्स)",
        "पौष्टिक भोजन परोसने में सहायता",
        "स्नेहपूर्ण पारिवारिक संगति"
      ],
      sample_steps: [
        "परिचय और रोगी स्वास्थ्य विवरण समीक्षा",
        "दवा और दिनचर्या की जांच",
        "सहायता प्राप्त गतिशीलता और व्यक्तिगत देखभाल",
        "स्वास्थ्य रिकॉर्डिंग और परिवार को अपडेट",
        "सुरक्षित हैंडओवर"
      ],
      safety_note: "बुजुर्गों के प्राथमिक उपचार में प्रशिक्षित और पुलिस-सत्यापित देखभालकर्ता।",
      trust_note: "हेल्थकेयर वर्कर कोऑपरेटिव एलायंस द्वारा संचालित।",
      coop_warranty_title: "सहकारी देखभाल आश्वासन",
      coop_warranty_desc: "समर्पित पर्यवेक्षक की देखरेख में प्रमाणित एवं विश्वसनीय सेवा।",
      coop_fairwage_title: "सहकारी उचित पारिश्रमिक गारंटी",
      coop_fairwage_desc: "80% प्रत्यक्ष दैनिक वेतन देखभालकर्ताओं को वितरित।"
    },
    s7: {
      name: "तकनीशियन (Technician)",
      description: "एसी, वाशिंग मशीन, रेफ्रिजरेटर, इन्वर्टर, आरओ प्यूरीफायर और मोटरों की विशेषज्ञ इलेक्ट्रो-मैकेनिकल जांच और मरम्मत।",
      duration: "45–60 मिनट",
      included: [
        "मल्टी-पॉइंट डायग्नोस्टिक टेस्ट",
        "घटक मरम्मत और गैस दबाव जांच",
        "फिल्टर सफाई और पावर टेस्टिंग",
        "असली स्पेयर पार्ट सिफारिश",
        "7-दिवसीय सेवा सुरक्षा वारंटी"
      ],
      sample_steps: [
        "डायग्नोस्टिक टेस्ट और एरर कोड जांच",
        "पारदर्शी दरों के साथ खराबी की व्याख्या",
        "पार्ट्स बदलना / सर्विस",
        "प्रदर्शन बेंचमार्किंग",
        "ओटीपी द्वारा कार्य समापन"
      ],
      safety_note: "प्रमाणित तकनीशियन सर्ज सुरक्षा गियर और गैस रिकवरी किट के साथ आते हैं।",
      trust_note: "मानकीकृत सहकारी दर सूची में कोई गुप्त या बढ़ा हुआ शुल्क नहीं।",
      coop_warranty_title: "सहकारी तकनीशियन आश्वासन (सेवा सुरक्षा)",
      coop_warranty_desc: "मरम्मत और प्रामाणिक सहकारी स्पेयर पार्ट्स पर 7-दिवसीय वारंटी।",
      coop_fairwage_title: "सहकारी उचित पारिश्रमिक गारंटी",
      coop_fairwage_desc: "80% प्रत्यक्ष पारिश्रमिक स्थानीय श्रम सहकारी समिति द्वारा कारीगर को।"
    },
    s8: {
      name: "घरेलू सहायक (Domestic Helper)",
      description: "दैनिक घरेलू कार्य, बर्तन धोने, भोजन पकाने में सहायता, कपड़े समेटने और रसोई की देखभाल के लिए सत्यापित सहायता।",
      duration: "1–2 घंटे",
      included: [
        "बर्तन धोना और सिंक की सफाई",
        "सब्जी काटना और बुनियादी भोजन तैयारी",
        "फर्श झाड़ना और सतह पोंछना",
        "कपड़े धोना और समेटना",
        "घरेलू कचरे का निपटान"
      ],
      sample_steps: [
        "घर के सदस्य के साथ कार्य सूची पर चर्चा",
        "रसोई काउंटर और बर्तनों की सफाई",
        "घर में झाड़ू-पोंछा और धूल हटाना",
        "कचरा निपटान और स्वच्छता",
        "आपसी ओटीपी सत्यापन"
      ],
      safety_note: "महिला श्रम सहकारी समितियों के माध्यम से 100% पुलिस-सत्यापित और फोटो पहचान पत्र धारक।",
      trust_note: "बिना किसी बिचौलिए की कटौती के सीधे उचित पारिश्रमिक।",
      coop_warranty_title: "सहकारी घरेलू सहायता आश्वासन",
      coop_warranty_desc: "गुणवत्ता नियंत्रण और पर्यवेक्षक सहायता के साथ विश्वसनीय सेवा।",
      coop_fairwage_title: "सहकारी महिला श्रमिक गारंटी",
      coop_fairwage_desc: "80% सीधा दैनिक वेतन महिला सहकारी सदस्यों के खाते में।"
    },
    s9: {
      name: "ड्राइवर सेवा (Driver)",
      description: "शहर की यात्रा, हवाई अड्डा आवागमन और बाहरी यात्राओं हेतु पुलिस-सत्यापित सहकारी ड्राइवर।",
      duration: "यात्रा के अनुसार (2–8 घंटे)",
      included: [
        "पुलिस-सत्यापित एवं लाइसेंसधारी ड्राइवर",
        "GPS द्वारा सुरक्षित और छोटा मार्ग",
        "वाहन सफाई और सामान में सहायता",
        "शून्य सर्ज मूल्य और पारदर्शी प्रति घंटा दर",
        "सहकारी यात्रा सुरक्षा कवच"
      ],
      sample_steps: [
        "ड्राइवर समय पर पिकअप स्थान पर पहुंचेगा",
        "यात्रा शुरू करने हेतु Start OTP सत्यापन",
        "सुरक्षित और सुगम ड्राइविंग",
        "गंतव्य पर यात्रा समाप्ति",
        "अंतिम किराया सत्यापन एवं OTP साझा करना"
      ],
      safety_note: "गति सीमा का पूर्ण पालन और ध्यान भटकाने वाली गतिविधियों पर शून्य सहनशीलता।",
      trust_note: "ऑटो और टैक्सी चालक सहकारी संघ के सदस्य।",
      coop_warranty_title: "सहकारी यात्रा सुरक्षा गारंटी",
      coop_warranty_desc: "24/7 SOS सुरक्षा निगरानी के साथ निर्धारित दरें।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "85% सीधा किराया ड्राइवर के सहकारी खाते में।"
    },
    s10: {
      name: "बागवानी (Gardening)",
      description: "लॉन घास कटाई, पौधों की छंटाई, जैविक खाद डालना और छत का बगीचा तैयार करने हेतु विशेषज्ञ माली।",
      duration: "60–120 मिनट",
      included: [
        "पौधों के स्वास्थ्य की जांच और कीट पहचान",
        "लॉन कटाई और झाड़ियों की छंटाई",
        "जैविक केंचुआ खाद द्वारा मिट्टी का पोषण",
        "खरपतवार हटाना और जड़ों को हवा देना",
        "कचरे की सफाई और निपटान"
      ],
      sample_steps: [
        "ग्राहक के साथ बगीचे का निरीक्षण",
        "पौधों की छंटाई और आकार देना",
        "मिट्टी की गुड़ाई और जैविक खाद डालना",
        "पानी देना और कचरा साफ करना",
        "अंतिम निरीक्षण और OTP पुष्टि"
      ],
      safety_note: "100% जैविक खाद और बच्चों/पालतू जानवरों के लिए सुरक्षित कीटनाशक।",
      trust_note: "किसान एवं बागवानी सहकारी समिति द्वारा समर्थित।",
      coop_warranty_title: "सहकारी उद्यान गारंटी",
      coop_warranty_desc: "स्वस्थ पौधों के विकास की गारंटी।",
      coop_fairwage_title: "सहकारी सीधा वेतन गारंटी",
      coop_fairwage_desc: "80% सीधा वेतन ग्रामीण मालियों को।"
    }
  }
};

/**
 * Universal localized service resolver
 */
export const getLocalizedServiceData = (serviceId, langCode = 'en') => {
  const lang = (langCode || 'en').toLowerCase();
  const langData = serviceTranslations[lang] || serviceTranslations.en;
  const serviceObj = langData[serviceId] || serviceTranslations.en[serviceId] || {};
  return serviceObj;
};

export default {
  serviceTranslations,
  getLocalizedServiceData
};
