/**
 * UniServ Bulk & Community Services Specification Registry
 * 
 * Contains unique trade-specific configurations, machinery rosters, 
 * statutory compliance standards, deliverables, and dynamic math calculation
 * for all 14 Institutional Campus & Residential Society Bulk Services.
 */

export const BULK_SERVICE_CONFIGS = {
  // ==========================================
  // INSTITUTIONAL & CAMPUS SERVICES (inst_1 to inst_8)
  // ==========================================
  inst_1: {
    id: 'inst_1',
    category: 'institutional',
    title: 'Campus Mega Water Reservoir & RO Plant Sanitization',
    trade_name: 'Hydraulic Reservoir & Potability Engineering',
    tagline: 'Deep sludge dewatering, 400-bar hydro-jet descaling, and NABL potability testing for campus sumps & RO plants.',
    icon: 'water',
    custom_sections: [
      {
        id: 'reservoir_scope',
        label: '1. Select Reservoir Infrastructure Scope',
        options: [
          { id: 'res_sump', label: 'Underground RCC Mega Sump (1,00,000L+)', cost_mult: 1.35, crew_delta: 2, days_delta: 1, detail: 'Confined-space oxygen harness & sludge pump' },
          { id: 'res_hostel', label: 'Hostel Overhead Tank Clusters (10+ Wings)', cost_mult: 1.1, crew_delta: 1, days_delta: 0, detail: 'Terrace high-pressure hose feed & sterilization' },
          { id: 'res_ro_plant', label: 'Commercial Central RO Plant (2,000–5,000 LPH)', cost_mult: 1.25, crew_delta: 1, days_delta: 1, detail: 'Membrane backwash & anti-scalant CIP flush' },
          { id: 'res_integrated', label: 'Full Campus (Sump + Tanks + Fire Reserve)', cost_mult: 2.1, crew_delta: 4, days_delta: 2, detail: 'Complete campus potable network sanitization' }
        ]
      },
      {
        id: 'sterilization_grade',
        label: '2. Chemical & Antimicrobial Sterilization Grade',
        options: [
          { id: 'chem_h2o2_uv', label: 'Food-Grade H2O2 + Submersible UV-C Probe', cost_mult: 1.15, crew_delta: 0, days_delta: 0, detail: 'Zero toxic chlorine smell, instant safe fill' },
          { id: 'chem_potassium', label: 'Rotary Hydro-Jet (400 Bar) + Potassium Permanganate', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Deep wall descaling & stubborn algae stripping' },
          { id: 'chem_bio_enzyme', label: 'Bio-Enzymatic Organic Descaler & Silver Ionization', cost_mult: 1.3, crew_delta: 1, days_delta: 0, detail: 'Hospital & medical college accredited standard' }
        ]
      },
      {
        id: 'lab_certification',
        label: '3. Statutory Lab Certification Tier',
        options: [
          { id: 'cert_bis_nabl', label: 'BIS 10500 Potability Test (NABL Accredited Lab Report)', cost_mult: 1.15, crew_delta: 0, days_delta: 0, detail: 'Full pre & post coliform + TDS chemical count' },
          { id: 'cert_standard', label: 'Standard Cooperative Sanitization Compliance Certificate', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Ward coordinator physical audit sign-off' }
        ]
      }
    ],
    machinery_roster: [
      { name: '400-Bar German Rotary Hydro-Jet', spec: '15 HP 3-phase pump with oscillating ceramic turbo nozzle', safety_grade: 'Industrial High-Pressure Rated', icon: 'speedometer' },
      { name: '5 HP Submersible Mud Sludge Dewatering Pump', spec: 'Cast iron vortex impeller handling up to 35mm solids', safety_grade: 'IP68 Waterproof Submersible', icon: 'funnel' },
      { name: 'Confined-Space Oxygen Kit & 4-Gas Detector', spec: 'Multi-gas sensor (H2S, CO, O2, LEL) + safety rescue winch', safety_grade: 'ATEX Ex-Proof Confined Space', icon: 'shield-checkmark' },
      { name: 'Germicidal Submersible UV-C Radiator Probe', spec: '254nm peak wavelength ultraviolet irradiance system', safety_grade: 'CE Bio-Safe Enclosure', icon: 'sunny' },
      { name: 'Heavy Wet/Dry Industrial Slurry Siphon', spec: '80-Litre twin turbine suction extractor', safety_grade: 'Heavy Commercial Rated', icon: 'build' }
    ],
    statutory_compliance: {
      code: 'BIS 10500:2012 / AICTE Campus Health Protocol',
      issuing_body: 'NABL Accredited Testing Laboratory & NCCT Federation Health Desk',
      audit_report: 'Potable Drinking Water Test Certificate with Coliform & Heavy Metal Analysis',
      mandatory_legal: 'Mandatory statutory water compliance for NAAC/NIRF institutional accreditations'
    },
    squad_composition: [
      '1 Confined-Space Safety & Quality Engineer',
      '2 Master Hydraulics & Sump Dewatering Technicians',
      '3 High-Pressure Jetting & Chemical Sterilization Operators'
    ],
    deliverables: [
      'Deep mechanical sludge extraction and bottom silt siphon',
      'High-pressure (400 Bar) rotary wall descaling removing bio-films and lime scales',
      'Food-grade antimicrobial sterilization and fungal spore wash',
      'Commercial RO membrane inspection, sediment backwash, and pre-filter flush',
      'Digital pre/post inspection photo audit and NABL accredited potability lab certificate'
    ],
    base_math: { crew: 6, days: 2, minCost: 9500, maxCost: 16500 }
  },

  inst_2: {
    id: 'inst_2',
    category: 'institutional',
    title: 'Campus Substation, Lab Earthing & Electrical Safety Audit',
    trade_name: 'High-Voltage Electrical & Substation Engineering',
    tagline: 'Infrared thermography, transformer oil BDV breakdown tests, and CEA Form-A safety certifications.',
    icon: 'flash',
    custom_sections: [
      {
        id: 'electrical_assets',
        label: '1. Select Electrical Infrastructure Assets Audited',
        options: [
          { id: 'sub_yard', label: '11KV/33KV Substation Transformer Yard & Switchgear', cost_mult: 1.45, crew_delta: 2, days_delta: 1, detail: 'Oil BDV dielectric & busbar torque audit' },
          { id: 'sub_labs', label: 'Computer & AI Science Lab Chemical Earthing (<1 Ohm)', cost_mult: 1.2, crew_delta: 1, days_delta: 0, detail: 'Fall-of-potential test on server neutral pits' },
          { id: 'sub_dg', label: 'Campus Backup DG Synchronizer & AMF Load Bank (250+ KVA)', cost_mult: 1.3, crew_delta: 1, days_delta: 1, detail: 'Automatic load shedding & phase balance check' },
          { id: 'sub_campus_full', label: 'Integrated Campus Grid (Substation + 30+ Earth Pits + Arresters)', cost_mult: 2.2, crew_delta: 4, days_delta: 2, detail: 'Complete campus electrical statutory audit' }
        ]
      },
      {
        id: 'testing_protocols',
        label: '2. Diagnostic Testing & Scan Protocols',
        options: [
          { id: 'test_flir_megger', label: 'FLIR Infrared Thermal Scan + 5kV Digital Megger Insulation', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Reveals breaker hotspots, loose lugs & insulation drop' },
          { id: 'test_standard', label: 'Standard Earth Resistance & Breaker Continuity Check', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Digital fall-of-potential testing' },
          { id: 'test_full_cea', label: 'Full CEA Reg 2010 Audit (Thermal, BDV, Harmonics & Pits)', cost_mult: 1.4, crew_delta: 2, days_delta: 1, detail: 'Comprehensive statutory inspection report' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Fluke Ti480 PRO Industrial Thermal Camera', spec: '640x480 resolution infrared sensor with laser autofocus', safety_grade: 'CAT IV 600V Certified', icon: 'scan' },
      { name: '4-Terminal Digital Earth Resistance Tester', spec: '0.01 to 2000 Ohm measuring range with 4-stake array', safety_grade: 'IEC 61010-1 Safety Rated', icon: 'git-network' },
      { name: '60kV Automatic Transformer Oil BDV Tester', spec: 'Motorized spherical electrode oil dielectric breakdown tester', safety_grade: 'IS 6792 / IEC 60156 Standard', icon: 'nuclear' },
      { name: '5kV High-Voltage Digital Insulation Megger', spec: '5 Tera-Ohm insulation range with polarization index (PI)', safety_grade: 'CAT IV 1000V Surge Proof', icon: 'flash' },
      { name: 'Fluke 435-II Power Quality & Harmonic Analyzer', spec: '3-phase harmonic distortion & true RMS load logger', safety_grade: 'Class A EN 50160 Compliant', icon: 'analytics' }
    ],
    statutory_compliance: {
      code: 'CEA Regulations 2010 (Measures relating to Safety & Electric Supply)',
      issuing_body: 'Government Grade-A Licensed Electrical Inspectorate & NCCT',
      audit_report: 'Form-A Statutory Electrical Safety Audit Certificate',
      mandatory_legal: 'Required for college building safety, Fire NOC, and AICTE approval'
    },
    squad_composition: [
      '1 Certified Grade-A Electrical Safety Inspector',
      '2 High-Tension Substation & Switchgear Electricians',
      '2 Chemical Earthing & Megger Testing Specialists'
    ],
    deliverables: [
      'Infrared thermographic heat anomaly report for all transformer lugs and LT busbars',
      'Digital fall-of-potential earth pit resistance log (<1 Ohm lab neutral compliance)',
      'Transformer oil dielectric breakdown voltage (BDV) test certificate',
      'Campus lightning arrester protection radius verification and continuity log',
      'Official CEA Regulation 2010 Form-A Safety Compliance Document'
    ],
    base_math: { crew: 5, days: 3, minCost: 14500, maxCost: 24500 }
  },

  inst_3: {
    id: 'inst_3',
    category: 'institutional',
    title: 'Student Hostel Turnover & Campus Mega Sanitization',
    trade_name: 'Industrial Institutional Hygiene & Pest Eradication',
    tagline: '180°C dry-steam bedbug elimination, mess kitchen NFPA-96 degreasing, and ULV fogging.',
    icon: 'sparkles',
    custom_sections: [
      {
        id: 'hostel_zones',
        label: '1. Select Hostel Zones & Facility Scope',
        options: [
          { id: 'zone_rooms', label: 'Student Living Quarters (Rooms, Bedsteads, Wardrobes)', cost_mult: 1.25, crew_delta: 3, days_delta: 1, detail: 'Thermal mattress extraction & anti-pest treatment' },
          { id: 'zone_mess', label: 'Hostel Mess & Commercial Kitchen Canopy Degreasing', cost_mult: 1.3, crew_delta: 2, days_delta: 1, detail: 'NFPA-96 grease duct stripping & hot chemical bath' },
          { id: 'zone_washrooms', label: 'Multi-Floor Toilet & Shower Blocks (Heavy Descaling)', cost_mult: 1.15, crew_delta: 2, days_delta: 0, detail: 'Acid descaling of hard water deposits & uric salts' },
          { id: 'zone_full_hostel', label: 'Complete Hostel Block (Rooms + Mess + Restrooms)', cost_mult: 2.3, crew_delta: 6, days_delta: 2, detail: 'End-to-end semester turnover master package' }
        ]
      },
      {
        id: 'treatment_method',
        label: '2. Sanitization & Pest Eradication Technology',
        options: [
          { id: 'treat_steam', label: '180°C Dry-Steam Mattress Extraction (Anti-Bedbug)', cost_mult: 1.2, crew_delta: 1, days_delta: 0, detail: 'Zero chemical, kills bedbugs and larvae on contact' },
          { id: 'treat_ulv', label: 'Electrostatic ULV Cold Fogging (Hospital Grade Virucide)', cost_mult: 1.1, crew_delta: 0, days_delta: 0, detail: 'Airborne pathogen kill across study halls and corridors' },
          { id: 'treat_express', label: '48-Hour Rapid Vacation Turnover (Double-Shift Squad)', cost_mult: 1.35, crew_delta: 4, days_delta: -1, detail: 'Twin shifts to finish before re-opening date' }
        ]
      }
    ],
    machinery_roster: [
      { name: '8-Bar High-Temp Dry Steam Mattress Extractor', spec: '180°C pressurized core steam jet eliminating bedbug eggs', safety_grade: 'Non-Toxic Thermal Sanitizer', icon: 'flame' },
      { name: 'Ride-on Automatic Dual-Brush Floor Scrubber', spec: 'Twin 22-inch scrubbing decks with 120L recovery tank', safety_grade: 'Low-Noise Commercial Standard', icon: 'hardware-chip' },
      { name: 'Rotary Kitchen Exhaust Grease Scraper Rig', spec: 'Pneumatic flexible rotary shaft with brass degreasing heads', safety_grade: 'NFPA-96 Fire Safety Rated', icon: 'restaurant' },
      { name: 'Electrostatic ULV Cold Misting Fogger', spec: '5–20 micron droplet generator with positive electrostatic wrap', safety_grade: 'WHO Hygiene Fogger Class', icon: 'cloudy' },
      { name: 'Heavy Acid/Alkali Resistant Pressure Sprayers', spec: 'Viton-sealed motorized backpack sprayers for deep descaling', safety_grade: 'Industrial Chemical Grade', icon: 'shield' }
    ],
    statutory_compliance: {
      code: 'FSSAI Commercial Kitchen Hygiene Standard & Campus Public Health Protocol',
      issuing_body: 'Federation Public Health Officer & Municipal Sanitization Board',
      audit_report: 'Institutional Hostel Hygiene & Bedbug-Free Handover Clearance',
      mandatory_legal: 'Compliant with UGC student welfare guidelines and food safety standards'
    },
    squad_composition: [
      '1 Institutional Hygiene & Chemical Safety Supervisor',
      '3 Industrial Scrubber & Steam Extractor Operators',
      '6 Certified Sanitation & Bedbug Eradication Technicians'
    ],
    deliverables: [
      '180°C dry-steam thermal eradication of bedbugs, mites, and allergens from mattresses',
      'Mess kitchen grease hood, exhaust duct, and baffle filter heavy degreasing',
      'Restroom deep acid descaling and high-pressure tile steam wash',
      'Electrostatic ULV airborne cold fogging across all corridors and reading rooms',
      'Official FSSAI & Student Welfare Hygiene Clearance Certificate'
    ],
    base_math: { crew: 10, days: 3, minCost: 18000, maxCost: 32000 }
  },

  inst_4: {
    id: 'inst_4',
    category: 'institutional',
    title: 'Institutional Solar Rooftop & Streetlight Fleet Overhaul',
    trade_name: 'Solar Photovoltaic & Renewable Asset Engineering',
    tagline: 'De-ionized soft water rotary cleaning, string I-V curve tracing, and MNRE efficiency audit.',
    icon: 'sunny',
    custom_sections: [
      {
        id: 'solar_capacity',
        label: '1. Select Campus Solar PV Array Capacity',
        options: [
          { id: 'sol_100kw', label: '50 kW to 100 kW Rooftop Array', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Standard academic block rooftop installation' },
          { id: 'sol_250kw', label: '100 kW to 250 kW Multi-Building Grid', cost_mult: 1.45, crew_delta: 2, days_delta: 1, detail: 'Central string inverters and rooftop array' },
          { id: 'sol_500kw', label: '250 kW to 500 kW Mega Campus Solar Grid', cost_mult: 2.1, crew_delta: 4, days_delta: 2, detail: 'Utility-scale campus renewable power plant' },
          { id: 'sol_streetlights', label: 'Campus Perimeter Solar Streetlights (50+ Poles)', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'LiFePO4 battery health & panel realignment' }
        ]
      },
      {
        id: 'diagnostic_depth',
        label: '2. Diagnostic Depth & Maintenance Protocol',
        options: [
          { id: 'sol_di_trace', label: 'De-Ionized (<10 PPM) Soft-Water Wash + I-V Curve Tracer', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Zero mineral spots, measures actual vs rated peak wattage' },
          { id: 'sol_thermal_mc4', label: 'FLIR Hotspot Thermography + MC4 Junction Re-crimping', cost_mult: 1.35, crew_delta: 1, days_delta: 1, detail: 'Detects cracked cells, bypass diode faults & cable heating' },
          { id: 'sol_standard_wash', label: 'Standard Mechanized Rotary Wash & Inverter Check', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Dust & bird dropping removal with pure water' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Mobile De-Ionized RO Water Purification Cart', spec: 'TDS < 10 PPM multi-stage reverse osmosis filtration cart', safety_grade: 'Zero Mineral Scaling Standard', icon: 'water' },
      { name: 'Telescopic Carbon-Fiber Rotary Solar Brushes', spec: '15-meter ultralight poles with high-torque water-fed heads', safety_grade: 'Anti-Scratch Solar Glass Safe', icon: 'brush' },
      { name: 'Solar PV Array I-V Curve Tracer & Irradiance Sensor', spec: '1500V / 30A string curve tracer with wireless pyranometer', safety_grade: 'IEC 62446-1 Performance Standard', icon: 'analytics' },
      { name: 'FLIR Drone & Handheld Solar Thermography Camera', spec: 'Radiometric thermal imaging with hotspot auto-marking', safety_grade: 'IEC TS 62446-3 Aerial Standard', icon: 'scan' },
      { name: 'High-Altitude Fall-Arrest Lifeline & Roof Anchor Kit', spec: 'Dual lanyard shock absorbing harness & permanent static lines', safety_grade: 'EN 361 / IS 3521 Safety Standard', icon: 'shield-checkmark' }
    ],
    statutory_compliance: {
      code: 'Ministry of New and Renewable Energy (MNRE) Solar Safety Guidelines',
      issuing_body: 'Certified Solar PV Commissioning Engineer & State DISCOM Liaison',
      audit_report: 'MNRE Solar Generation Optimization & Efficiency Audit Certificate',
      mandatory_legal: 'Enables statutory DISCOM net-metering compliance and green campus ratings'
    },
    squad_composition: [
      '1 Solar Commissioning Engineer & Quality Lead',
      '2 High-Altitude Fall-Arrest Certified Solar Technicians',
      '2 Inverter & Switchgear Maintenance Electricians'
    ],
    deliverables: [
      'De-mineralized soft water rotary scrub across all solar strings without surface scratches',
      'I-V curve trace showing actual string output vs factory rated capacity',
      'Thermal imaging audit report identifying hotspot micro-cracks and bypass diode faults',
      'Torque check and re-crimping of DC MC4 connectors and combiner boxes',
      'Official MNRE Efficiency Gain Certificate with guaranteed 8% to 15% generation boost'
    ],
    base_math: { crew: 5, days: 2, minCost: 10500, maxCost: 18500 }
  },

  inst_5: {
    id: 'inst_5',
    category: 'institutional',
    title: 'Lecture Hall Desks, Lab Benches & Hostel Furniture Overhaul',
    trade_name: 'Institutional Metal Joinery & Ergonomic Refurbishment',
    tagline: 'Inverter arc welding, edge-banding, auditorium push-back repairs, and IS 4838 ergonomic safety.',
    icon: 'construct',
    custom_sections: [
      {
        id: 'furniture_inventory',
        label: '1. Select Furniture Inventory Classification',
        options: [
          { id: 'furn_classroom', label: 'Classroom Dual-Bench Desks (50–150 Sets)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Frame welding, bolt re-anchoring & desktop refinishing' },
          { id: 'furn_auditorium', label: 'Auditorium Push-Back Theater Chairs (200–500 Seats)', cost_mult: 1.45, crew_delta: 2, days_delta: 1, detail: 'Gas damper replacement, hinge lubrication & upholstery' },
          { id: 'furn_lab_benches', label: 'Science Lab Acid-Proof Chemical Benches & Sinks', cost_mult: 1.3, crew_delta: 1, days_delta: 1, detail: 'Epoxy resin surface patch, acid drain & gas cock tuning' },
          { id: 'furn_hostel_beds', label: 'Hostel Steel Bunk Beds & Study Wardrobes (100+ Units)', cost_mult: 1.5, crew_delta: 2, days_delta: 1, detail: 'Gusset reinforcement, ladder welding & locker hinges' }
        ]
      },
      {
        id: 'refurbishment_treatment',
        label: '2. Refurbishment & Joinery Treatment',
        options: [
          { id: 'furn_weld_pvc', label: 'Arc Welding + Hot-Melt PVC Edge-Banding + Clear Coat', cost_mult: 1.2, crew_delta: 1, days_delta: 0, detail: 'Eliminates wobble, fixes chipped edges & seals surfaces' },
          { id: 'furn_cushion', label: 'High-Density Foam (40 Density) Re-Cushioning & Fabric', cost_mult: 1.35, crew_delta: 2, days_delta: 1, detail: 'Commercial flame-retardant acoustic upholstery' },
          { id: 'furn_structural_only', label: 'Heavy Structural Re-Welding & Fastener Replacement', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'High-tensile zinc plated hardware reinforcement' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Portable IGBT Inverter Arc Welder (200A)', spec: 'Hot start & arc force welding rig for heavy steel tubular frames', safety_grade: 'IS 4559 Electrical Standard', icon: 'flash' },
      { name: 'Pneumatic Upholstery Stapler & Twin-Cylinder Compressor', spec: '16-gauge heavy staple gun with rapid cyclic recovery', safety_grade: 'CE Mechanical Safety Rated', icon: 'hammer' },
      { name: 'Automatic Hot-Melt PVC Edge-Banding Machine', spec: 'Pre-heating glue pot with automatic edge trimming guillotine', safety_grade: 'Precision Woodworking Standard', icon: 'cube' },
      { name: 'Heavy-Duty Electric Planer & Disc Grinder', spec: 'High-speed metal weld bead flush grinder and surface prep planer', safety_grade: 'Double Insulated Safety Class', icon: 'construct' },
      { name: 'Laser Precision Framing & Bench Alignment Leveler', spec: 'Cross-line 360-degree laser leveler for auditorium rake alignment', safety_grade: 'Class II Precision Laser', icon: 'locate' }
    ],
    statutory_compliance: {
      code: 'IS 4838 / IS 3663 Institutional Classroom Furniture Ergonomic Standard',
      issuing_body: 'Cooperative Guild of Master Fabricators & Carpenters',
      audit_report: 'Campus Furniture Structural Load-Bearing & Ergonomic Safety Audit',
      mandatory_legal: 'Ensures student posture safety and prevents sharp-edge injury liabilities'
    },
    squad_composition: [
      '1 Master Joinery Architect & Refurbishment Lead',
      '2 Certified Metal Arc Welders & Fabricators',
      '3 Furniture Assembly, Edge-Banding & Upholstery Craftsmen'
    ],
    deliverables: [
      'Structural re-welding of broken bench brackets and anti-wobble triangular gussets',
      'Replacement of damaged desktop laminates and hot-melt PVC edge seals',
      'Auditorium reclining chair gas-spring replacement and hinge tension calibration',
      'Science lab epoxy top resealing and acid-resistant sink drain servicing',
      'IS 4838 compliant ergonomic safety certificate with 6-month workmanship guarantee'
    ],
    base_math: { crew: 6, days: 3, minCost: 8500, maxCost: 15500 }
  },

  inst_6: {
    id: 'inst_6',
    category: 'institutional',
    title: 'Academic Block, Seminar Hall & Campus Painting',
    trade_name: 'Commercial Architecture Coatings & Waterproof Surface Defense',
    tagline: 'Airless spray coating, fiber-mesh crack waterproofing, and 10-year exterior weather shield.',
    icon: 'color-palette',
    custom_sections: [
      {
        id: 'painting_zone',
        label: '1. Select Campus Painting Zone & Scope',
        options: [
          { id: 'paint_classrooms', label: 'Academic Block Classrooms (Low-VOC Anti-Microbial)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Scrub-resistant washable acrylic for chalk/pen marks' },
          { id: 'paint_auditorium', label: 'Seminar Hall & Auditorium Acoustic Shell Polish & Coating', cost_mult: 1.35, crew_delta: 2, days_delta: 1, detail: 'Deep non-reflective finish preserving acoustic dampening' },
          { id: 'paint_facade', label: 'Multi-Storey Exterior Facade & Weatherproof Shield', cost_mult: 1.85, crew_delta: 4, days_delta: 3, detail: 'Elastomeric 10-year rain, algae and UV barrier' },
          { id: 'paint_courts', label: 'Sports Track & Synthetic Basketball Court Line Markings', cost_mult: 1.25, crew_delta: 1, days_delta: 1, detail: 'Anti-slip polyurethane rubberized marking system' }
        ]
      },
      {
        id: 'paint_specification',
        label: '2. Coating System & Surface Preparation Grade',
        options: [
          { id: 'paint_apex_protek', label: 'Asian Paints Apex Ultima Protek / Berger WeatherCoat (10-Yr Guarantee)', cost_mult: 1.3, crew_delta: 1, days_delta: 1, detail: 'Fiber-mesh crack-bridging polymer system' },
          { id: 'paint_acrylic_premium', label: 'Premium Interior Anti-Bacterial Acrylic Emulsion', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: '2 coats primer + 2 coats high-scrub paint' },
          { id: 'paint_waterproof_crack', label: 'Plaster Crack Mesh Polymer Repair + Waterproof Base Coat', cost_mult: 1.25, crew_delta: 2, days_delta: 1, detail: 'Structural polymer injection against seepage' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Graco Ultra Max 3000 PSI Airless Paint Sprayer', spec: 'High-volume commercial sprayer delivering 3.6 LPM output', safety_grade: 'Zero Overspray High Transfer', icon: 'color-wand' },
      { name: 'High-Altitude Aluminum Scaffolding Towers (12m)', spec: 'Self-locking outriggers with heavy caster lock wheels', safety_grade: 'EN 1004 Access Tower Standard', icon: 'business' },
      { name: 'Industrial Wall Sander with HEPA Dust Extractor', spec: '225mm rotary sanding disc with active 99.97% vacuum filtration', safety_grade: 'Dust-Free Clean Air Standard', icon: 'shield' },
      { name: 'Digital Concrete Moisture & Wall Crack Depth Sensor', spec: 'Non-invasive pinless moisture meter with acoustic crack scanner', safety_grade: 'Civil Engineering Diagnostic Class', icon: 'pulse' },
      { name: 'Airless High-Pressure Hydro-Surface Washer (250 Bar)', spec: 'Triplex ceramic plunger pump removing peeling paint and moss', safety_grade: 'Industrial Surface Prep Rated', icon: 'speedometer' }
    ],
    statutory_compliance: {
      code: 'National Building Code (NBC 2016) Vol 1 Architectural Coatings & VOC Limits',
      issuing_body: 'Cooperative Coatings Guild & Certified Paint Manufacturer Technical Cell',
      audit_report: '10-Year Surface Waterproofing & Color Fastness Joint Warranty Certificate',
      mandatory_legal: 'Protects structural RCC plaster from carbonation and dampness decay'
    },
    squad_composition: [
      '1 Surface Coating Architect & Project Lead',
      '4 High-Altitude Scaffolding Certified Master Painters',
      '6 Surface Preparation, Putty & Plastering Artisans'
    ],
    deliverables: [
      'High-pressure power washing of exterior walls removing black mold, fungus, and peeling paint',
      'V-cut crack filling with fiber-mesh embedded waterproofing polymer compound',
      'Application of anti-alkali moisture resistant damp-proof primer coat',
      'Double-coat airless spray finish of interior anti-bacterial emulsion / exterior protek',
      'Spotless campus handover, floor drop-sheet cleaning, and manufacturer 10-year warranty'
    ],
    base_math: { crew: 12, days: 5, minCost: 25000, maxCost: 48000 }
  },

  inst_7: {
    id: 'inst_7',
    category: 'institutional',
    title: 'Campus Botanical Grounds, Tree Pruning & Horticulture',
    trade_name: 'Arboriculture, Heavy Tree Rigging & Campus Landscaping',
    tagline: 'Pre-monsoon storm safety tree lopping, hydraulic crane rigging, and on-site wood chipping.',
    icon: 'leaf',
    custom_sections: [
      {
        id: 'grounds_scope',
        label: '1. Select Grounds & Arboriculture Scope',
        options: [
          { id: 'hort_lopping', label: 'Dangerous High-Branch Tree Lopping (Over cables & roofs)', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Eliminates storm hazard and powerline interference' },
          { id: 'hort_turf', label: 'Sports Turf & Athletic Field Aeration & Precision Mowing', cost_mult: 1.3, crew_delta: 2, days_delta: 1, detail: 'Ride-on zero-turn mowing, verticutting & organic top dressing' },
          { id: 'hort_botanical', label: 'Botanical Garden Drip Line Overhaul & Exotic Flora Care', cost_mult: 1.15, crew_delta: 1, days_delta: 0, detail: 'Micro-drip descaling and aesthetic crown pruning' },
          { id: 'hort_campus_full', label: 'Full Campus Comprehensive Forestry & Grounds Drive', cost_mult: 2.1, crew_delta: 4, days_delta: 2, detail: 'All campus trees, perimeter hedges, lawns and bio-mulch' }
        ]
      },
      {
        id: 'green_waste_disposal',
        label: '2. Green Waste Processing & Biomass Recycling',
        options: [
          { id: 'hort_mulch', label: 'On-Site High-Capacity Wood Chipping & Vermicompost Mulching', cost_mult: 1.15, crew_delta: 1, days_delta: 0, detail: 'Converts cut branches into 100% organic campus soil mulch' },
          { id: 'hort_muni_evac', label: 'Cooperative Green Waste Municipal Truck Evacuation', cost_mult: 1.25, crew_delta: 1, days_delta: 1, detail: 'Heavy tipper evacuation to municipal composting center' },
          { id: 'hort_yard_stack', label: 'Standard Sorting & Campus Disposal Yard Stacking', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Organized stacking in campus bio-waste yard' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Stihl MS 382 50cc Heavy Professional Chainsaws', spec: 'High-torque magnesium crankcase saws with anti-kickback bars', safety_grade: 'Certified Heavy Arborist Class', icon: 'hardware-chip' },
      { name: '18-Meter Hydraulic Boom Crane Truck', spec: 'Insulated aerial work platform with 360-degree boom rotation', safety_grade: 'ANSI A92.2 Aerial Device Standard', icon: 'car' },
      { name: '15 HP Heavy Bio-Waste Wood Branch Chipper', spec: 'Twin-drum reversible chipping knives processing branches up to 120mm', safety_grade: 'Emergency Stop Safety Bar Equipped', icon: 'sync' },
      { name: 'Commercial Zero-Turn Ride-on Turf Mower (60-inch)', spec: 'Twin hydrostatic transmission with floating deep-deck blades', safety_grade: 'Rollover Protection (ROPS) Certified', icon: 'leaf' },
      { name: 'Certified High-Tree Rigging Harnesses & Pulleys', spec: 'Friction lowering bollard, static arborist bull ropes & arborist spikes', safety_grade: 'EN 358 / CE Climbing Certified', icon: 'shield-checkmark' }
    ],
    statutory_compliance: {
      code: 'Municipal Tree Protection Authority Regulations & Urban Forestry Safety Code',
      issuing_body: 'Certified Municipal Arborist & Department of Forest & Wildlife Liaison',
      audit_report: 'Hazardous Tree Pruning Safety Clearance & Green Biomass Audit Certificate',
      mandatory_legal: 'Complies with municipal tree conservation laws and power grid clearance rules'
    },
    squad_composition: [
      '1 Certified Municipal Arborist & Grounds Safety Officer',
      '2 High-Tree Rigging & Aerial Canopy Climbers',
      '4 Heavy Chainsaw Operators & Horticulture Groundsmen'
    ],
    deliverables: [
      'Rigged sectional lopping of overgrown branches threatening electric lines and hostel windows',
      'Canopy crown thinning and deadwood removal improving tree balance against cyclones',
      'On-site chipping of branches into nutrient-rich mulch for campus flower beds',
      'Athletic turf deep aeration, thatch verticutting, and laser-flat mowing',
      'Municipal tree safety clearance certificate and hazard-free perimeter sign-off'
    ],
    base_math: { crew: 8, days: 3, minCost: 11500, maxCost: 21000 }
  },

  inst_8: {
    id: 'inst_8',
    category: 'institutional',
    title: 'College Transport Fleet Drivers & Event Chauffeurs',
    trade_name: 'Commercial Fleet Logistics & Executive Transport Escort',
    tagline: 'Police-verified commercial bus drivers (PSV/HMV badge), exam transit escorts, and VIP chauffeurs.',
    icon: 'car',
    custom_sections: [
      {
        id: 'transport_role',
        label: '1. Select Deployment Role & Transit Requirement',
        options: [
          { id: 'fleet_bus_route', label: 'Scheduled College Bus Route Coverage (Morning/Evening)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Heavy commercial PSV badge drivers with campus route experience' },
          { id: 'fleet_exam_transit', label: 'Confidential University Exam Paper Transit Escort', cost_mult: 1.4, crew_delta: 1, days_delta: 0, detail: 'Tamper-evident locked transit protocol with police-verified drivers' },
          { id: 'fleet_vip_pool', label: 'Convocation & International Conference VIP Chauffeur Pool', cost_mult: 1.3, crew_delta: 2, days_delta: 1, detail: 'Uniformed executive sedan/SUV chauffeurs with etiquette training' },
          { id: 'fleet_ambulance', label: 'Campus 24x7 Emergency Medical Transit Standby (3 Shifts)', cost_mult: 1.6, crew_delta: 2, days_delta: 2, detail: 'First-aid & trauma emergency response certified drivers' }
        ]
      },
      {
        id: 'squad_size',
        label: '2. Squad Size & Driver Roster Count',
        options: [
          { id: 'fleet_3', label: 'Squad of 3 Commercial Drivers', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Standard short-term event or emergency backup' },
          { id: 'fleet_6', label: 'Squad of 6 Commercial Drivers', cost_mult: 1.9, crew_delta: 3, days_delta: 1, detail: 'Multi-route bus fleet or full-day symposium pool' },
          { id: 'fleet_12', label: 'Full Campus Transport Roster (12 Commercial Drivers)', cost_mult: 3.6, crew_delta: 9, days_delta: 2, detail: 'Comprehensive university fleet route management' }
        ]
      },
      {
        id: 'screening_protocol',
        label: '3. Screening & Safety Protocol',
        options: [
          { id: 'fleet_full_police', label: '100% Police Clearance Verification Dossier + Biometric KYC', cost_mult: 1.1, crew_delta: 0, days_delta: 0, detail: 'Zero criminal record, authentic commercial RTO badges' },
          { id: 'fleet_breathalyzer', label: 'Daily Pre-Trip Digital Breathalyzer & Health Check Protocol', cost_mult: 1.15, crew_delta: 0, days_delta: 0, detail: 'Mandatory zero-tolerance 0.00% alcohol digital logging' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Fuel-Cell Professional Digital Breathalyzer', spec: 'Law-enforcement grade sensor with 0.000% BAC digital printout', safety_grade: 'DOT / NHTSA Certified Instrument', icon: 'speedometer' },
      { name: 'Smart Biometric Driver Attendance & GPS Tracker', spec: 'Cellular tamper-proof beacon logging real-time bus speed and stops', safety_grade: 'AIS-140 Compliant Device', icon: 'navigate' },
      { name: 'Commercial Heavy Passenger (PSV/HMV) Driver Uniform Kits', spec: 'Reflective high-visibility uniform with photo ID badge and epaulettes', safety_grade: 'State RTO Approved Uniform Standard', icon: 'shirt' },
      { name: 'St. John Ambulance Certified First Aid & Trauma Kit', spec: 'Automated external kit with splints, burn dressings, and tourniquets', safety_grade: 'Emergency Medical Standard', icon: 'medkit' },
      { name: 'Tamper-Evident Exam Paper Security Transit Box', spec: 'Dual digital keypad lock with tamper-evident serial seal bands', safety_grade: 'High-Security Transit Specification', icon: 'lock-closed' }
    ],
    statutory_compliance: {
      code: 'Motor Vehicles Act 1988 (Sec 9-10 Heavy Passenger Badging) & Supreme Court Guidelines',
      issuing_body: 'Transport Department RTO & District Police Commissioner Verification Cell',
      audit_report: 'Commercial Driver Verification Dossier & Medical Fitness Certificate Form-1A',
      mandatory_legal: 'Mandatory compliance with Supreme Court school/college transport safety guidelines'
    },
    squad_composition: [
      '1 Fleet Transport Operations Coordinator',
      'Commercial Heavy Bus Drivers (PSV/HMV Badged)',
      'Executive VIP Chauffeurs (LMV-Commercial)'
    ],
    deliverables: [
      'Dispatch of 100% police-cleared, licensed commercial passenger bus drivers',
      'Pre-trip digital breathalyzer alcohol screening and blood pressure logging',
      'Strict adherence to university bus routes and timetable stops',
      'Chain-of-custody sealed escort for confidential examination paper transit',
      'Comprehensive driver verification compliance binder submitted to campus transport committee'
    ],
    base_math: { crew: 4, days: 2, minCost: 6500, maxCost: 12000 }
  },

  // ==========================================
  // RESIDENTIAL SOCIETY & RWA SERVICES (bs1 to bs6)
  // ==========================================
  bs1: {
    id: 'bs1',
    category: 'residential',
    title: 'Overhead & Underground Water Tank Cleaning',
    trade_name: 'Residential Potable Reservoir Mechanized Sanitization',
    tagline: '6-stage mechanized cleaning: sludge dewatering, 400-PSI hydro-jet, vacuum siphon, UV-C wand, and potability test.',
    icon: 'water',
    custom_sections: [
      {
        id: 'tank_layout',
        label: '1. Select Tank Type & Society Reservoir Layout',
        options: [
          { id: 'rwa_tank_underground', label: 'Underground RCC Main Sump (15,000–35,000L)', cost_mult: 1.15, crew_delta: 1, days_delta: 0, detail: 'Deep sludge pump dewatering & confined-space ventilation' },
          { id: 'rwa_tank_overhead', label: 'Overhead Terrace Tanks (Multiple Wings/Towers)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'High-pressure terrace line jetting & antibacterial scrub' },
          { id: 'rwa_tank_combo', label: 'Combined Sump + All Overhead Tanks', cost_mult: 1.75, crew_delta: 3, days_delta: 1, detail: 'Complete end-to-end society water network cleaning' }
        ]
      },
      {
        id: 'water_volume',
        label: '2. Total Water Storage Volume Capacity',
        options: [
          { id: 'cap_5k', label: '5,000 – 10,000 Litres (Small Society)', cost_mult: 0.65, crew_delta: -2, days_delta: 0, detail: 'Quick 3-hour mechanized turnaround' },
          { id: 'cap_20k', label: '15,000 – 25,000 Litres (Standard RWA)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Full 6-stage mechanized cleaning cycle' },
          { id: 'cap_50k', label: '30,000 – 60,000 Litres (Multi-Tower RWA)', cost_mult: 1.8, crew_delta: 3, days_delta: 1, detail: 'Dual jetting machines & high-discharge pump' },
          { id: 'cap_100k', label: '1,00,000L+ (Mega Gated Township)', cost_mult: 2.7, crew_delta: 5, days_delta: 1, detail: 'Heavy industrial team & continuous vacuum siphoning' }
        ]
      },
      {
        id: 'sterilization_options',
        label: '3. Antimicrobial Sterilization & Testing Grade',
        options: [
          { id: 'steril_uv_nano', label: '6-Stage Mechanized (Rotary Jet + UV-C Wand + Shock Tablets)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Complete pathogen kill without lingering chlorine odor' },
          { id: 'steril_potability_lab', label: '6-Stage Mechanized + NABL Lab Water Potability Test', cost_mult: 1.25, crew_delta: 0, days_delta: 0, detail: 'Includes certified laboratory report on coliform bacteria & hardness' }
        ]
      }
    ],
    machinery_roster: [
      { name: '400 PSI Rotary Hydro-Jet Cleaner', spec: 'Ceramic rotary turbo nozzle blasting algae and mineral scaling', safety_grade: 'Industrial High-Pressure Rated', icon: 'speedometer' },
      { name: '2 HP High-Discharge Submersible Dewatering Pump', spec: 'Non-clog vortex pump emptying 15,000L in 45 minutes', safety_grade: 'IP68 Waterproof Submersible', icon: 'funnel' },
      { name: 'Heavy-Duty Wet Slurry Vacuum Siphon (60L)', spec: 'Twin motor vacuum pulling heavy sludge and bottom gravel', safety_grade: 'Commercial Siphon Rated', icon: 'build' },
      { name: 'Germicidal UV-C Radiator Wand (254nm)', spec: 'Ultraviolet light wand neutralizing bacteria, viruses, and cysts', safety_grade: 'CE Bio-Safe Enclosure', icon: 'sunny' },
      { name: 'Telescopic Anti-Bacterial Scrubbers & Squeegees', spec: 'Food-grade nylon bristle scrubbers with reach up to 5 meters', safety_grade: 'Food Contact Safe', icon: 'brush' }
    ],
    statutory_compliance: {
      code: 'Central Ground Water Board & Municipal Potable Water Hygiene Standard',
      issuing_body: 'Cooperative Water Health Wing & NABL Testing Facility',
      audit_report: 'RWA Potable Water Tank Cleaning Handover & Disinfection Certificate',
      mandatory_legal: 'Provides verified proof of clean water storage for society residents'
    },
    squad_composition: [
      '1 Hydraulics Operations Team Lead',
      '2 High-Pressure Jetting Technicians',
      '2 Tank Dewatering & Sanitization Artisans'
    ],
    deliverables: [
      'Stage 1: Complete dewatering using high-discharge submersible mud pump',
      'Stage 2: High-pressure 400 PSI hydro-jet rotary washing of ceiling, walls, and floor',
      'Stage 3: Slurry vacuum extraction of bottom sludge, rust flakes, and mud silt',
      'Stage 4: Anti-bacterial wall scrubbing using eco-friendly non-toxic cleaner',
      'Stage 5: UV-C ultraviolet radiation wand scanning for bacteria, cysts, and algae spores',
      'Stage 6: Potable water shock chlorine tablet dose & stamped RWA certificate'
    ],
    base_math: { crew: 5, days: 1, minCost: 5500, maxCost: 8500 }
  },

  bs2: {
    id: 'bs2',
    category: 'residential',
    title: 'Society Electrical Earthing & Safety Audit',
    trade_name: 'Residential High-Tension/Low-Tension Safety & Lightning Defense',
    tagline: 'Fluke thermal hotspot imaging, earth pit resistance testing (<2 Ohms), and Fire Department NOC certificate.',
    icon: 'flash',
    custom_sections: [
      {
        id: 'elec_scope',
        label: '1. Select Society Electrical Infrastructure Scope',
        options: [
          { id: 'rwa_elec_panels', label: 'Main Transformer Yard & LT Panel Boards', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Infrared thermal scan of all main breakers & busbars' },
          { id: 'rwa_elec_lifts', label: 'Elevator Motor Rooms (All Towers Phase Balance & Earthing)', cost_mult: 1.3, crew_delta: 1, days_delta: 0, detail: 'Passenger lift safety interlocks, harmonics & phase voltage' },
          { id: 'rwa_elec_lightning', label: 'Tower Rooftop Lightning Arresters & Earth Pits (<2 Ohms)', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Fall-of-potential test of copper earth electrode strips' },
          { id: 'rwa_elec_full', label: 'Complete Complex (Transformer + Lifts + DG Sets + 15+ Pits)', cost_mult: 2.1, crew_delta: 3, days_delta: 1, detail: 'Comprehensive RWA safety clearance package' }
        ]
      },
      {
        id: 'fire_noc_tier',
        label: '2. Certification & Documentation Tier',
        options: [
          { id: 'rwa_audit_fire_noc', label: 'Official Audit Certificate for Fire Department NOC Submission', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Mandatory compliance report for annual fire safety renewal' },
          { id: 'rwa_audit_standard', label: 'Standard Cooperative Preventative Safety Audit Report', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Earth resistance log & infrared heat anomaly list' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Fluke Industrial Infrared Thermal Imaging Camera', spec: 'Calibrated thermography gun detecting loose contacts and overheating breakers', safety_grade: 'CAT IV 600V Rated', icon: 'scan' },
      { name: '4-Terminal Digital Earth Resistance Tester', spec: 'Fall-of-potential precision tester with ground probe spikes', safety_grade: 'IEC 61010-1 Safety Rated', icon: 'git-network' },
      { name: 'True-RMS Digital Clamp Meter (1000A AC/DC)', spec: 'Harmonic and inrush current logging on elevator feeder lines', safety_grade: 'CAT III 1000V Certified', icon: 'speedometer' },
      { name: '1000V High-Voltage Insulation Resistance Tester', spec: 'Tests cable insulation health between conductors and earth', safety_grade: 'High-Voltage Insulation Grade', icon: 'flash' },
      { name: 'Phase Rotation & Automatic Breaker Trip Timing Meter', spec: 'Measures relay trip time in milliseconds under fault simulation', safety_grade: 'Precision Relay Grade', icon: 'time' }
    ],
    statutory_compliance: {
      code: 'National Electrical Code (NEC 2023) & CEA Safety Regulations',
      issuing_body: 'Licensed Grade-A Electrical Contractor & Fire Safety Authority Liaison',
      audit_report: 'Form B-2 Electrical Health Audit Certificate for Society Fire NOC Renewal',
      mandatory_legal: 'Required for society lift license renewal and building insurance claims'
    },
    squad_composition: [
      '1 Certified Grade-A Electrical Inspector',
      '2 Licensed Industrial Wiremen & Panel Technicians',
      '1 Earth Pit Restoration Specialist'
    ],
    deliverables: [
      'Infrared thermographic heat scan of all LT breakers, busbar joints, and capacitor banks',
      'Fall-of-potential resistance measurement of each earth pit with salt/charcoal level check',
      'Elevator motor room phase voltage balance and safety trip circuit audit',
      'DG set AMF panel automatic changeover and load shedding verification',
      'Official stamped Form B-2 electrical safety report ready for Fire Department NOC renewal'
    ],
    base_math: { crew: 4, days: 2, minCost: 8500, maxCost: 14500 }
  },

  bs3: {
    id: 'bs3',
    category: 'residential',
    title: 'Pre-Monsoon Society Drainage & Desilting',
    trade_name: 'Municipal Heavy Hydraulic Drain Jetting & Siphon Sewer De-silting',
    tagline: '150-bar sewer hydro-jetting, sludge suction tanker, and rainwater harvesting pit restoration.',
    icon: 'rainy',
    custom_sections: [
      {
        id: 'drainage_scope',
        label: '1. Select Drainage Scope & Running Length',
        options: [
          { id: 'drain_short', label: 'Perimeter Stormwater Drains (Up to 200 Running Meters)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Standard gated society perimeter trench drains' },
          { id: 'drain_medium', label: 'Perimeter Drains + Main Sewer Lines (200–500 Running Meters)', cost_mult: 1.6, crew_delta: 2, days_delta: 1, detail: 'Medium society with multi-tower manholes & culverts' },
          { id: 'drain_large', label: 'Township Mega Drains & Rainwater Pits (500+ Running Meters)', cost_mult: 2.5, crew_delta: 4, days_delta: 2, detail: 'Large society with deep underground sewer trunks' }
        ]
      },
      {
        id: 'machinery_deployed',
        label: '2. Select Heavy Machinery & Fleet Deployed',
        options: [
          { id: 'drain_jetter_truck', label: 'High-Pressure Sewer Jetting Machine Tanker (150 Bar)', cost_mult: 1.3, crew_delta: 1, days_delta: 0, detail: 'Blasts tree roots, fatbergs, and solidified mud silt' },
          { id: 'drain_suction_combo', label: 'Super-Sucker Sludge Suction Tanker + Hydro-Jetter', cost_mult: 1.65, crew_delta: 2, days_delta: 1, detail: 'Complete vacuum evacuation to municipal dumping ground' },
          { id: 'drain_manual_snaking', label: 'Mechanized Rotary Snake + Sump Mud Slurry Pump', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Standard open drain and pit de-silting' }
        ]
      }
    ],
    machinery_roster: [
      { name: '150-Bar Truck-Mounted High-Pressure Sewer Jetter', spec: 'Reciprocating triplex plunger pump with backward-firing sewer thrust nozzles', safety_grade: 'Heavy Municipal Jetting Class', icon: 'speedometer' },
      { name: '4000-Litre Vacuum Suction Slurry Tanker (Super Sucker)', spec: 'Rotary vane vacuum exhauster pulling deep sludge from 8-meter depth', safety_grade: 'Continuous Suction Heavy Duty', icon: 'funnel' },
      { name: 'Industrial Flexible Rotary Sewer Rodding Rig', spec: 'Continuous steel rod drive with rotating root cutter & corkscrew heads', safety_grade: 'Root & Obstruction Clearing Spec', icon: 'build' },
      { name: 'Heavy-Duty Mud De-watering Submersible Trash Pump', spec: 'Solids-handling pump passing up to 45mm pebbles and silt stones', safety_grade: 'IP68 Industrial Trash Pump', icon: 'construct' },
      { name: 'Combustible Gas Detector & Tripod Safety Harness', spec: 'Real-time H2S, methane, and oxygen sensor with safety manhole tripod', safety_grade: 'IS 11972 Safe Sewer Entry', icon: 'shield-checkmark' }
    ],
    statutory_compliance: {
      code: 'CPHEEO Sewerage Manual & Municipal Water-Logging Prevention Code',
      issuing_body: 'Urban Local Body (ULB) Drainage Wing & Cooperative Sanitation Desk',
      audit_report: 'Pre-Monsoon Water-Logging Prevention & Drain De-Silting Handover Certificate',
      mandatory_legal: 'Prevents society basement flooding and municipal penalties during monsoon'
    },
    squad_composition: [
      '1 Sanitation & Drainage Hydraulic Engineer',
      '2 Heavy Sewer Jetting Machine Operators',
      '3 Drain Clearing & Manhole Desilting Technicians'
    ],
    deliverables: [
      'Clearing of all choked stormwater grates and perimeter trench drains',
      'High-pressure 150-bar sewer jetting through all internal society manholes',
      'De-silting and gravel replenishment of Rainwater Harvesting (RWH) recharge pits',
      'Basement sump pump pit de-sludging and float switch health test',
      'Zero water-logging guarantee certificate before the onset of monsoon rains'
    ],
    base_math: { crew: 6, days: 2, minCost: 12000, maxCost: 22000 }
  },

  bs4: {
    id: 'bs4',
    category: 'residential',
    title: 'Society Solar Panel Array Washing & Maintenance',
    trade_name: 'Rooftop Photovoltaic Soft-Water Washing & Generation Optimization',
    tagline: 'De-mineralized water telescopic washing (<10 PPM), string voltage test, and generation gain report.',
    icon: 'sunny',
    custom_sections: [
      {
        id: 'rwa_solar_cap',
        label: '1. Select Rooftop Solar Array Capacity',
        options: [
          { id: 'rwa_sol_small', label: '10 kW – 30 kW Array (Single Tower / Clubhouse)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Standard 30 to 90 solar modules' },
          { id: 'rwa_sol_medium', label: '30 kW – 80 kW Array (Multi-Tower RWA Grid)', cost_mult: 1.7, crew_delta: 2, days_delta: 0, detail: 'Distributed rooftop arrays with multiple string inverters' },
          { id: 'rwa_sol_large', label: '100 kW+ Mega Array (Large Gated Township)', cost_mult: 2.8, crew_delta: 4, days_delta: 1, detail: 'High-capacity common area net-metering plant' }
        ]
      },
      {
        id: 'cleaning_depth',
        label: '2. Cleaning Technology & Diagnostic Depth',
        options: [
          { id: 'rwa_sol_di_wash', label: 'De-Mineralized Soft Water Wash with Microfiber Telescopic Brushes', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Zero mineral water spots, preserving 100% solar glass transmittance' },
          { id: 'rwa_sol_full_health', label: 'De-Mineralized Wash + Inverter Diagnostic + Hotspot Scan', cost_mult: 1.4, crew_delta: 1, days_delta: 0, detail: 'String voltage test, MC4 connector torque & structure anti-rust check' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Portable De-Ionized RO Water Cart (<10 PPM)', spec: 'Mobile multi-bed resin de-ionizer producing zero-mineral wash water', safety_grade: 'Glass Scratch-Free Pure Water Class', icon: 'water' },
      { name: 'Telescopic Carbon-Fiber Water-Fed Poles (10m)', spec: 'Ultralight poles with dual micro-jet rotary scratch-free brushes', safety_grade: 'Solar Module Safe Standard', icon: 'brush' },
      { name: 'Solar PV Array Diagnostic Multimeter', spec: '1000V DC Voc and Isc string diagnostic tool', safety_grade: 'CAT III 1000V Certified', icon: 'analytics' },
      { name: 'Infrared Solar Cell Surface Thermal Scanner', spec: 'Handheld thermography scanner checking for diode hotspot degradation', safety_grade: 'IEC 62446-3 Class', icon: 'scan' },
      { name: 'Rooftop Fall-Protection Static Line & Harness Kit', spec: 'Full-body safety harnesses with twin carabiner lanyards', safety_grade: 'EN 361 Fall Arrest Standard', icon: 'shield-checkmark' }
    ],
    statutory_compliance: {
      code: 'MNRE Rooftop Solar Maintenance & Safety Guidelines',
      issuing_body: 'Certified Solar PV Technician & DISCOM Net-Metering Desk',
      audit_report: 'RWA Solar Generation Optimization & Array Health Certificate',
      mandatory_legal: 'Validates optimal solar power generation for DISCOM net-metering credits'
    },
    squad_composition: [
      '1 Certified Solar PV Technician',
      '3 High-Altitude Solar Cleaning Artisans'
    ],
    deliverables: [
      'De-mineralized soft-water scrub removing stubborn bird droppings, soot, and road dust',
      'Zero mineral streak finish ensuring maximum solar photon transmission',
      'Inverter generation performance reading and string voltage comparison log',
      'Inspection of aluminum mounting structures, cable ties, and grounding bonds',
      'RWA solar generation improvement report with before/after photos and estimated kWh gain'
    ],
    base_math: { crew: 4, days: 1, minCost: 3500, maxCost: 6500 }
  },

  bs5: {
    id: 'bs5',
    category: 'residential',
    title: 'Gated Society Common Area Deep Clean Drive',
    trade_name: 'Residential Industrial Floor Buffing & Common Amenities Sanitation',
    tagline: 'Basement oil stain stripping, single-disc lobby buffing, clubhouse restoration, and eco-citrus degreasing.',
    icon: 'sparkles',
    custom_sections: [
      {
        id: 'common_zones',
        label: '1. Select Common Areas Included in Scope',
        options: [
          { id: 'clean_basement', label: 'Stilt & Basement Parking (Tyre Marks & Oil Stain Stripping)', cost_mult: 1.15, crew_delta: 1, days_delta: 0, detail: 'Industrial rotary degreasing on concrete/epoxy parking bays' },
          { id: 'clean_lobbies', label: 'Tower Lift Lobbies & Stairwells (Granite/Marble Buffing)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Single-disc buffing with diamond crystallization pads' },
          { id: 'clean_clubhouse', label: 'Clubhouse, Gym, Banquet Hall & Swimming Pool Deck', cost_mult: 1.3, crew_delta: 2, days_delta: 0, detail: 'Antiseptic scrub of tile decks and high-touch amenities' },
          { id: 'clean_full_society', label: 'Complete Society Complex (Basement + Lobbies + Clubhouse + Parks)', cost_mult: 2.2, crew_delta: 4, days_delta: 1, detail: 'Grand festival or annual deep hygiene transformation drive' }
        ]
      },
      {
        id: 'chemical_grade',
        label: '2. Chemical & Equipment Grade',
        options: [
          { id: 'clean_eco_citrus', label: 'Rotary Single-Disc Scrubbing + Eco-Citrus Bio-Degreaser', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: '100% pet and child safe non-toxic bio formulas' },
          { id: 'clean_steam_sanitize', label: 'Rotary Scrubbing + High-Temp Steam Sanitization for Kids Areas', cost_mult: 1.3, crew_delta: 1, days_delta: 0, detail: '140°C steam wash for play areas and gym equipment' }
        ]
      }
    ],
    machinery_roster: [
      { name: 'Heavy-Duty Single-Disc Rotary Floor Scrubber (17-inch)', spec: '1.5 HP motor with interchangeable diamond polishing and scrubbing pads', safety_grade: 'Low-Vibration Floor Standard', icon: 'disc' },
      { name: 'Ride-on/Walk-Behind Automatic Floor Scrubber Drier', spec: 'Twin parabolic squeegees leaving parking and pathways instantly dry', safety_grade: 'Slip-Prevention Standard', icon: 'hardware-chip' },
      { name: 'Industrial Wet & Dry Twin-Motor Vacuum Extractor (70L)', spec: 'High-lift vacuum extracting slurry and dirty water into stainless tank', safety_grade: 'Continuous Commercial Duty', icon: 'build' },
      { name: 'High-Pressure Foam Sprayer & Oil Degreasing Lance', spec: 'Dense foam application clinging to vertical surfaces and stubborn oil', safety_grade: 'Chemical Resistant Seal Class', icon: 'color-fill' },
      { name: 'High-Temperature Surface Steam Sanitizer', spec: '140°C dry steam emitter for children playground equipment and gym benches', safety_grade: 'Non-Toxic Sanitizer', icon: 'flame' }
    ],
    statutory_compliance: {
      code: 'Swachh Bharat Urban Housing Society Hygiene Guidelines & Green Building Standard',
      issuing_body: 'Cooperative Housekeeping Guild & Municipal Health Wing',
      audit_report: 'RWA Common Amenities Deep Sanitization & Safety Clearance Certificate',
      mandatory_legal: 'Ensures slip-free safe common areas and prevents bacterial build-up in amenities'
    },
    squad_composition: [
      '1 Housekeeping Operations Supervisor',
      '3 Industrial Floor Machine Operators',
      '4 Deep Cleaning & Surface Buffing Artisans'
    ],
    deliverables: [
      'Stripping of stubborn oil stains, grease, and tyre skids in basement parking',
      'Mechanized single-disc buffing and polishing of tower lobby granite/marble floors',
      'Disinfection and deep scrubbing of gym rubber flooring and clubhouse tiles',
      'High-pressure wash of swimming pool deck, walking tracks, and benches',
      'Spotless festival-ready handover inspection signed off by RWA management'
    ],
    base_math: { crew: 8, days: 1, minCost: 7500, maxCost: 13500 }
  },

  bs6: {
    id: 'bs6',
    category: 'residential',
    title: 'Perimeter Wall & Society Exterior Painting Contract',
    trade_name: 'Perimeter Barrier Coatings, Weather Defense & Society Facade Aesthetics',
    tagline: 'Power wash moss removal, plaster crack repair, Asian Paints Apex/Protek, and boom barrier reflective markings.',
    icon: 'color-palette',
    custom_sections: [
      {
        id: 'rwa_paint_scope',
        label: '1. Select Society Perimeter & Infrastructure Scope',
        options: [
          { id: 'paint_rwa_wall', label: 'Society Boundary Wall (Both Sides with Anti-Fungal Exterior Coat)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Protects perimeter against monsoon seepage and moss growth' },
          { id: 'paint_rwa_gate', label: 'Main Entrance Arch, Security Cabin & Boom Barrier Painting', cost_mult: 1.25, crew_delta: 1, days_delta: 0, detail: 'Reflective black/yellow safety markings and enamel gates' },
          { id: 'paint_rwa_clubhouse', label: 'Clubhouse & Common Amenities Exterior Walls', cost_mult: 1.4, crew_delta: 2, days_delta: 1, detail: 'Weatherproof architectural acrylic coating' },
          { id: 'paint_rwa_full', label: 'Complete Society Perimeter + Gatehouses + Clubhouse + Road Markings', cost_mult: 2.4, crew_delta: 5, days_delta: 2, detail: 'Full community beautification and protection contract' }
        ]
      },
      {
        id: 'paint_rwa_grade',
        label: '2. Paint Grade & Surface Waterproofing System',
        options: [
          { id: 'paint_rwa_apex', label: 'Asian Paints Apex / Berger WeatherCoat Exterior Emulsion (2 Coats)', cost_mult: 1.0, crew_delta: 0, days_delta: 0, detail: 'Weather-proof silicon additive prevents dampness and flaking' },
          { id: 'paint_rwa_protek', label: 'Asian Paints Apex Ultima Protek with Fiber-Mesh Waterproofing', cost_mult: 1.35, crew_delta: 2, days_delta: 1, detail: '7-Year anti-crack warranty shield against heavy monsoon rains' },
          { id: 'paint_rwa_waterproof_base', label: 'Power Wash + Plaster Crack Filling + Silicone Waterproof Primer', cost_mult: 1.2, crew_delta: 1, days_delta: 0, detail: 'Crucial for aged boundary walls with efflorescence and peeling paint' }
        ]
      }
    ],
    machinery_roster: [
      { name: '3000 PSI Airless Paint Spray System', spec: 'High-production spray rig delivering uniform exterior millage without roller marks', safety_grade: 'Low Overspray Architectural Spec', icon: 'color-wand' },
      { name: 'Heavy-Duty Mobile Rolling Aluminum Scaffolding (10m)', spec: 'Modular lockable scaffolding towers for safe boundary wall access', safety_grade: 'EN 1004 Safety Standard', icon: 'business' },
      { name: 'High-Pressure Power Jet Surface Cleaner (200 Bar)', spec: 'Removes years of algae, dust, and peeling paint prior to primer application', safety_grade: 'Heavy Surface Prep Rated', icon: 'speedometer' },
      { name: 'Concrete Crack Router & Acrylic Sealant Gun', spec: 'Precision V-groove blade router for permanent polymer crack sealing', safety_grade: 'Civil Waterproofing Grade', icon: 'hammer' },
      { name: 'Laser Distance Measurer & Wet Film Thickness Gauge', spec: 'Digital square-meter verification and paint film thickness meter', safety_grade: 'Precision Inspection Tool', icon: 'locate' }
    ],
    statutory_compliance: {
      code: 'Bureau of Indian Standards (IS 15489 Paint Formulation) & NBC Exterior Building Guidelines',
      issuing_body: 'Master Painters Cooperative Guild & Manufacturer Technical Inspector',
      audit_report: '5-Year RWA Perimeter Wall Weatherproofing & Paint Durability Warranty',
      mandatory_legal: 'Protects structural boundary wall masonry against rain decay and efflorescence'
    },
    squad_composition: [
      '1 Painting Project Lead & Master Artisan',
      '3 Scaffolding & Airless Spray Painting Artisans',
      '4 Surface Preparation, Scraping & Plastering Technicians'
    ],
    deliverables: [
      'High-pressure hydro-jet moss and efflorescence removal from boundary wall',
      'V-groove chipping and polymer seal filling of structural plaster cracks',
      'Application of anti-efflorescence penetrating damp-proof primer coat',
      'Application of 2 coats exterior weather-guard acrylic paint in approved RWA colors',
      'Reflective high-visibility paint on speed breakers and entrance boom gates'
    ],
    base_math: { crew: 10, days: 5, minCost: 35000, maxCost: 65000 }
  }
};

/**
 * Get service configuration with fallback
 */
export const getBulkServiceConfig = (serviceId) => {
  if (!serviceId) return null;
  return BULK_SERVICE_CONFIGS[serviceId] || null;
};

/**
 * Calculate dynamic math based on selected trade options
 */
export const calculateServiceMath = (serviceId, selectedOptionMap = {}, extraModifiers = {}) => {
  const config = getBulkServiceConfig(serviceId);
  if (!config) {
    // Default fallback math
    const minCost = 8500;
    const maxCost = 14500;
    const midCost = Math.round((minCost + maxCost) / 2);
    const advanceAmount = Math.round(midCost * 0.4);
    const midMilestone = Math.round(midCost * 0.35);
    const finalMilestone = midCost - advanceAmount - midMilestone;
    return {
      crew: 5,
      days: 2,
      minCost,
      maxCost,
      midCost,
      advanceAmount,
      midMilestone,
      finalMilestone,
      workerWage: Math.round(midCost * 0.8),
      materialDepot: Math.round(midCost * 0.5),
      welfare: Math.round(midCost * 0.1),
      coopOps: Math.round(midCost * 0.06),
      platform: Math.round(midCost * 0.04)
    };
  }

  let totalCostMult = 1.0;
  let totalCrewDelta = 0;
  let totalDaysDelta = 0;

  // Evaluate selected options in each section
  if (config.custom_sections && Array.isArray(config.custom_sections)) {
    config.custom_sections.forEach((sec) => {
      const selectedOptId = selectedOptionMap[sec.id];
      const option = sec.options.find((opt) => opt.id === selectedOptId) || sec.options[0];
      if (option) {
        if (option.cost_mult) totalCostMult *= option.cost_mult;
        if (option.crew_delta !== undefined) totalCrewDelta += option.crew_delta;
        if (option.days_delta !== undefined) totalDaysDelta += option.days_delta;
      }
    });
  }

  // Apply extra modifiers (e.g. campus scale or society size if provided)
  if (extraModifiers.scaleMult) {
    totalCostMult *= extraModifiers.scaleMult;
  }

  const baseCrew = config.base_math.crew;
  const baseDays = config.base_math.days;
  const baseMin = config.base_math.minCost;
  const baseMax = config.base_math.maxCost;

  const crew = Math.max(2, Math.round(baseCrew + totalCrewDelta));
  const days = Math.max(1, Math.round(baseDays + totalDaysDelta));
  const minCost = Math.round(baseMin * totalCostMult);
  const maxCost = Math.round(baseMax * totalCostMult);
  const midCost = Math.round((minCost + maxCost) / 2);

  const advanceAmount = Math.round(midCost * 0.4);
  const midMilestone = Math.round(midCost * 0.35);
  const finalMilestone = midCost - advanceAmount - midMilestone;

  const workerWage = Math.round(midCost * 0.8);
  const materialDepot = Math.round(midCost * 0.5);
  const welfare = Math.round(midCost * 0.1);
  const coopOps = Math.round(midCost * 0.06);
  const platform = Math.round(midCost * 0.04);

  return {
    crew,
    days,
    minCost,
    maxCost,
    midCost,
    advanceAmount,
    midMilestone,
    finalMilestone,
    workerWage,
    materialDepot,
    welfare,
    coopOps,
    platform
  };
};

export default BULK_SERVICE_CONFIGS;
