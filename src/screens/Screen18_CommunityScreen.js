import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import cooperativesData from '../data/cooperatives.json';
import { BULK_SERVICE_CONFIGS, calculateServiceMath, getBulkServiceConfig } from '../data/bulkServiceConfigs';

export const Screen18_CommunityScreen = ({ navigation, route }) => {
  const { user, t } = useUser();
  const { submitCommunityBulkRequest, createBooking, activeBooking, completeBulkProject } = useBooking();

  // Mode: 'institutional' (Colleges, Universities, Hostels) vs 'residential' (RWAs & Societies)
  const initialMode = route?.params?.initialMode || 'institutional';
  const [activeTab, setActiveTab] = useState(initialMode);

  const [selectedCoop, setSelectedCoop] = useState(cooperativesData[0]);
  const [selectedService, setSelectedService] = useState(
    cooperativesData[0].institutional_services?.[0] || cooperativesData[0].bulk_services[0]
  );
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [gatePassModalVisible, setGatePassModalVisible] = useState(false);

  // Trade-specific selected options: { [sectionId]: optionId }
  const [selectedTradeOptions, setSelectedTradeOptions] = useState({});

  // Institutional Customization State
  const [institutionType, setInstitutionType] = useState('College / University Campus');
  const [campusScale, setCampusScale] = useState('Hostel Block (50–150 Rooms / 500 Students)');
  const [institutionName, setInstitutionName] = useState('Delhi Technical Campus (IP University Affiliated)');
  const [departmentOffice, setDepartmentOffice] = useState('Campus Maintenance Wing & Estate Office');
  const [officerName, setOfficerName] = useState('Dr. R.K. Nair (Estate Officer)');
  const [officerDesignation, setOfficerDesignation] = useState('Chief Estate Officer & Campus Warden');
  const [contactPhone, setContactPhone] = useState(user?.phone || '98101 23456');
  const [officialEmail, setOfficialEmail] = useState('estate.office@dtc.edu.in');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');
  const [targetDate, setTargetDate] = useState('Monday, 7 Sep 2026');

  // Residential Customization State
  const [societyScale, setSocietyScale] = useState('Medium (100–250 Flats)');
  const [societyName, setSocietyName] = useState('Palm Heights Residents Welfare Association (RWA)');

  // Confirmed ticket state after inquiry
  const [confirmedRequest, setConfirmedRequest] = useState(null);

  // Switch between service lists based on tab
  const displayedServices = useMemo(() => {
    if (activeTab === 'institutional') {
      return selectedCoop.institutional_services || [];
    }
    return selectedCoop.bulk_services || [];
  }, [activeTab, selectedCoop]);

  // Active Trade Specification Config
  const activeConfig = useMemo(() => {
    return getBulkServiceConfig(selectedService?.id);
  }, [selectedService]);

  // Dynamic Math Calculator for Institutional & Society Bulk Services
  const bulkMath = useMemo(() => {
    if (!selectedService) return calculateServiceMath(null);

    let scaleMult = 1.0;
    if (activeTab === 'institutional') {
      if (campusScale.includes('Department')) scaleMult = 0.8;
      else if (campusScale.includes('Hostel')) scaleMult = 1.3;
      else if (campusScale.includes('Academic')) scaleMult = 1.8;
      else if (campusScale.includes('Full University')) scaleMult = 2.6;
    } else {
      if (societyScale.includes('Small')) scaleMult = 0.85;
      else if (societyScale.includes('Medium')) scaleMult = 1.15;
      else if (societyScale.includes('Large')) scaleMult = 1.6;
    }

    return calculateServiceMath(selectedService.id, selectedTradeOptions, { scaleMult });
  }, [selectedService, selectedTradeOptions, activeTab, campusScale, societyScale]);

  const handleOpenQuoteModal = (service) => {
    setSelectedService(service);
    setConfirmedRequest(null);
    const cfg = getBulkServiceConfig(service?.id);
    if (cfg && cfg.custom_sections && cfg.custom_sections.length > 0) {
      const defaultOpts = {};
      cfg.custom_sections.forEach((sec) => {
        if (sec.options && sec.options.length > 0) {
          defaultOpts[sec.id] = sec.options[0].id;
        }
      });
      setSelectedTradeOptions(defaultOpts);
    } else {
      setSelectedTradeOptions({});
    }
    setQuoteModalVisible(true);
  };

  // 1. Direct Milestone Escrow Booking Flow
  const handleDirectEscrowBooking = () => {
    setQuoteModalVisible(false);

    const isInstitutional = activeTab === 'institutional';
    const clientName = isInstitutional ? institutionName : societyName;
    const scaleTitle = isInstitutional ? campusScale : societyScale;

    // Collect selected trade option labels
    const selectedLabels = [];
    if (activeConfig && activeConfig.custom_sections) {
      activeConfig.custom_sections.forEach((sec) => {
        const optId = selectedTradeOptions[sec.id] || sec.options[0]?.id;
        const opt = sec.options.find((o) => o.id === optId);
        if (opt) selectedLabels.push(opt.label);
      });
    }

    createBooking({
      service: {
        id: selectedService.id,
        name: selectedService.title,
        icon: selectedService.icon === 'water' ? '💧' : selectedService.icon === 'flash' ? '⚡' : '🏢',
        start_price: bulkMath.advanceAmount
      },
      is_bulk_project: true,
      scale_mode: 'bulk',
      client_type: isInstitutional ? 'institutional' : 'residential',
      institution_type: isInstitutional ? institutionType : null,
      institution_name: isInstitutional ? institutionName : null,
      society_name: !isInstitutional ? societyName : null,
      department_office: isInstitutional ? departmentOffice : null,
      officer_name: isInstitutional ? officerName : user?.name,
      officer_designation: isInstitutional ? officerDesignation : null,
      official_email: isInstitutional ? officialEmail : null,
      gstin: isInstitutional ? gstin : null,
      campus_scale: scaleTitle,
      base_amount: bulkMath.advanceAmount,
      advance_amount: bulkMath.advanceAmount,
      total_project_cost: bulkMath.midCost,
      min_cost: bulkMath.minCost,
      max_cost: bulkMath.maxCost,
      advance_percent: 40,
      mid_milestone: bulkMath.midMilestone,
      final_milestone: bulkMath.finalMilestone,
      crew_size: bulkMath.crew,
      estimated_days: bulkMath.days,
      scale_label: clientName,
      scale_sub: scaleTitle,
      material_label: activeConfig?.trade_name || 'Standard Cooperative Bulk Sourcing',
      material_sub: 'Central Labour Wholesale Reserve',
      address: isInstitutional ? (institutionName + ', ' + departmentOffice) : (societyName + ', Main Gate'),
      description: (isInstitutional ? 'Institutional Campus Contract' : 'Residential Society Project') + ': ' + selectedService.title + ' for ' + clientName + '. ' + (selectedLabels.length > 0 ? ('Specs: ' + selectedLabels.join(' | ') + '. ') : '') + 'Compliance: ' + (activeConfig?.statutory_compliance?.code || selectedService.statutory_compliance || 'Standard Cooperative Assurance') + '.',
      scheduled_date: targetDate,
      scheduled_time: '09:30 AM - 01:30 PM',
      cooperative_name: selectedCoop.name,
      trade_name: activeConfig?.trade_name,
      trade_options: selectedTradeOptions,
      machinery_roster: activeConfig?.machinery_roster || [],
      statutory_compliance: activeConfig?.statutory_compliance?.code || selectedService.statutory_compliance || 'AICTE / UGC / MSCS Certified',
      statutory_details: activeConfig?.statutory_compliance || null,
      squad_composition: activeConfig?.squad_composition || [],
      deliverables: activeConfig?.deliverables || [],
      artisan_squad: selectedCoop.artisan_squad_roster || []
    });

    navigation.navigate('BulkPayment');
  };

  // 2. Request Official Campus Inspection & Quotation Flow
  const handleSubmitInspectionQuote = () => {
    const isInstitutional = activeTab === 'institutional';
    if (isInstitutional && !institutionName.trim()) {
      Alert.alert('Institution Name Required', 'Please enter your College, University or Hostel name.');
      return;
    }
    if (!isInstitutional && !societyName.trim()) {
      Alert.alert('Society Name Required', 'Please enter your society name.');
      return;
    }

    const selectedLabels = [];
    if (activeConfig && activeConfig.custom_sections) {
      activeConfig.custom_sections.forEach((sec) => {
        const optId = selectedTradeOptions[sec.id] || sec.options[0]?.id;
        const opt = sec.options.find((o) => o.id === optId);
        if (opt) selectedLabels.push(opt.label);
      });
    }

    const req = submitCommunityBulkRequest({
      client_type: isInstitutional ? 'institutional' : 'residential',
      institution_type: isInstitutional ? institutionType : null,
      institution_name: isInstitutional ? institutionName : null,
      society_name: !isInstitutional ? societyName : null,
      department_office: isInstitutional ? departmentOffice : null,
      officer_name: isInstitutional ? officerName : user?.name,
      officer_designation: isInstitutional ? officerDesignation : null,
      official_email: isInstitutional ? officialEmail : null,
      gstin: isInstitutional ? gstin : null,
      campus_scale: isInstitutional ? campusScale : societyScale,
      service_title: selectedService.title + ' (' + (isInstitutional ? campusScale : societyScale) + ')',
      service_id: selectedService.id,
      trade_name: activeConfig?.trade_name,
      trade_options: selectedTradeOptions,
      selected_labels: selectedLabels,
      machinery_roster: activeConfig?.machinery_roster || [],
      squad_composition: activeConfig?.squad_composition || [],
      deliverables: activeConfig?.deliverables || [],
      cooperative: selectedCoop.name,
      contact_person: isInstitutional ? officerName : user?.name,
      phone: contactPhone,
      target_date: targetDate,
      units_estimate: (isInstitutional ? campusScale : societyScale) + ' • Est ₹' + bulkMath.minCost.toLocaleString() + ' - ₹' + bulkMath.maxCost.toLocaleString(),
      crew_size: bulkMath.crew,
      days: bulkMath.days,
      estimated_cost_min: bulkMath.minCost,
      estimated_cost_max: bulkMath.maxCost,
      statutory_compliance: activeConfig?.statutory_compliance?.code || selectedService.statutory_compliance || 'Standard Cooperative Certification',
      statutory_details: activeConfig?.statutory_compliance || null,
      artisan_squad: selectedCoop.artisan_squad_roster || []
    });

    setConfirmedRequest(req);
  };

  // 3. Download Official Proposal PDF (Printable HTML Generator)
  const handleDownloadProposalPdf = () => {
    const req = confirmedRequest;
    if (!req) return;

    if (Platform.OS === 'web') {
      try {
        const tradeTitle = req.trade_name || activeConfig?.trade_name || 'Multi-Artisan Infrastructure Engineering';
        const complianceObj = req.statutory_details || activeConfig?.statutory_compliance || {
          code: req.statutory_compliance || 'AICTE / UGC / MSCS Certified',
          issuing_body: 'Government National Cooperative Federation',
          audit_report: 'Official Infrastructure Health Audit & Handover Certificate'
        };

        // Render selected parameters
        let paramsHtml = '';
        if (req.selected_labels && req.selected_labels.length > 0) {
          paramsHtml = '<div style="margin-top: 10px;"><strong>Selected Trade Parameters:</strong><ul style="margin: 6px 0; padding-left: 20px;">' +
            req.selected_labels.map((l) => '<li>' + l + '</li>').join('') +
            '</ul></div>';
        }

        // Render machinery table
        let machineryRows = '';
        const machines = req.machinery_roster && req.machinery_roster.length > 0
          ? req.machinery_roster
          : (activeConfig?.machinery_roster || []);
        machines.forEach((m, idx) => {
          machineryRows += '<tr><td>' + (idx + 1) + '</td><td><strong>' + m.name + '</strong></td><td>' + m.spec + '</td><td><span style="background:#EFF6FF;color:#1E3A8A;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">' + m.safety_grade + '</span></td></tr>';
        });

        // Render deliverables list
        let deliverablesHtml = '';
        const delivs = req.deliverables && req.deliverables.length > 0
          ? req.deliverables
          : (activeConfig?.deliverables || []);
        delivs.forEach((d) => {
          deliverablesHtml += '<li style="margin-bottom: 5px;">✓ ' + d + '</li>';
        });

        const proposalHtml = '<!DOCTYPE html><html><head><title>UniServ Cooperative Infrastructure Proposal - ' + req.id + '</title><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1E293B; line-height: 1.5; } .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; } .title { font-size: 22px; font-weight: 800; color: #1E3A8A; margin: 0; } .sub { font-size: 13px; color: #64748B; margin: 3px 0 0; } .badge { background: #ECFDF5; color: #047857; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; border: 1px solid #059669; } .table { width: 100%; border-collapse: collapse; margin: 16px 0; } .table th, .table td { border: 1px solid #E2E8F0; padding: 9px 12px; text-align: left; font-size: 12px; } .table th { background: #F8FAFC; color: #1E3A8A; font-weight: 700; } .section-title { font-size: 15px; font-weight: 800; color: #1E3A8A; margin: 22px 0 8px; } .footer { margin-top: 36px; font-size: 11px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 14px; text-align: center; } .box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 12px; line-height: 1.7; }</style></head><body>' +
          '<div class="header"><div><h1 class="title">Ministry of Cooperation • NCCT Affiliated</h1><h2 style="font-size: 16px; color: #475569; margin: 3px 0 0;">' + selectedCoop.name + '</h2><p class="sub">Reg No: ' + selectedCoop.registration_no + ' • Specialized Infrastructure Ward Desk</p><p class="sub">Ref: COOP-PROP-' + req.id + '-2026</p></div><div><span class="badge">OFFICIAL COOPERATIVE PROPOSAL</span></div></div>' +
          '<div class="box"><p><strong>To:</strong> ' + (req.officer_name || 'The Authorized Estate / RWA Officer') + (req.department_office ? (', ' + req.department_office) : '') + '</p><p><strong>Entity / Institution:</strong> ' + (req.institution_name || req.society_name) + '</p><p><strong>Specialized Trade Scope:</strong> ' + tradeTitle + ' (' + req.service_title + ')</p><p><strong>Target Deployment Window:</strong> ' + req.target_date + '</p>' + (req.gstin ? ('<p><strong>Client GSTIN:</strong> ' + req.gstin + '</p>') : '') + paramsHtml + '</div>' +
          '<div class="section-title">1. Quotation & Squad Allocation Summary</div>' +
          '<table class="table"><tr><th>Trade Classification</th><th>Artisan Squad</th><th>Duration</th><th>Estimated Value Bracket</th><th>Statutory Standards</th></tr><tr><td>' + tradeTitle + '</td><td>' + req.crew_size + ' Certified Master Artisans</td><td>' + req.days + ' Deployment Days</td><td><strong>₹' + req.estimated_cost_min.toLocaleString() + ' – ₹' + req.estimated_cost_max.toLocaleString() + '</strong></td><td>' + complianceObj.code + '</td></tr></table>' +
          '<div class="section-title">2. Contract Scope & Itemized Deliverables</div>' +
          '<div class="box"><ul style="margin: 0; padding-left: 20px;">' + deliverablesHtml + '</ul></div>' +
          (machineryRows ? ('<div class="section-title">3. Specialized Heavy Machinery & Equipment Deployed</div><table class="table"><tr><th>#</th><th>Machine / System Name</th><th>Engineering Specification</th><th>Safety Grade</th></tr>' + machineryRows + '</table>') : '') +
          '<div class="section-title">4. 3-Stage Escrow Milestone Schedule</div>' +
          '<table class="table"><tr><th>Milestone Stage</th><th>Disbursement Condition</th><th>Escrow Allocation (40% / 35% / 25%)</th></tr><tr><td>Milestone 1: Mobilization & Equipment Deployment</td><td>Deposited into SBI MSCS Escrow on work order award</td><td>₹' + bulkMath.advanceAmount.toLocaleString() + '</td></tr><tr><td>Milestone 2: Mid-Stage Quality Audit Sign-off</td><td>Ward Coordinator & Estate Officer physical verification</td><td>₹' + bulkMath.midMilestone.toLocaleString() + '</td></tr><tr><td>Milestone 3: Final Handover & Warranty Activation</td><td>Authorized Officer OTP handshake & lab report delivery</td><td>₹' + bulkMath.finalMilestone.toLocaleString() + '</td></tr></table>' +
          '<div class="box" style="background: #EFF6FF; border-color: #BFDBFE;"><p style="margin: 0; color: #1E3A8A; font-weight: 700;">🏛️ Statutory Compliance & Lab Accreditation Notice:</p><p style="margin: 4px 0 0; color: #1E293B;">This project adheres strictly to <strong>' + complianceObj.code + '</strong>. Handover includes official <em>' + complianceObj.audit_report + '</em> issued by <em>' + complianceObj.issuing_body + '</em>.</p></div>' +
          '<div class="footer"><p>100% Transparent Cooperative Labor Platform • 80% Direct Artisan Wage Allocation • Central MSCS Trust Protected</p><p>🛡️ Active Seva Suraksha Workmanship & Statutory Defect Warranty</p></div><script>window.print();</script></body></html>';

        const blob = new Blob([proposalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      } catch (e) {
        console.warn('PDF export error:', e);
      }
    }
    Alert.alert('Official Proposal Generated', 'Official cooperative quotation proposal for ' + req.id + ' is ready for submission to your accounts committee.');
  };

  // 4. Download Campus Security Gate Pass (Web Printable HTML Generator)
  const handleDownloadGatePassPdf = () => {
    const squad = selectedCoop.artisan_squad_roster || [];
    const clientTitle = activeTab === 'institutional' ? institutionName : societyName;
    const tradeTitle = activeConfig?.trade_name || 'Infrastructure Maintenance';

    if (Platform.OS === 'web') {
      try {
        let rosterRows = '';
        squad.forEach((art, idx) => {
          // Adapt squad role to trade if available
          const roleTitle = activeConfig?.squad_composition?.[idx] || art.role;
          rosterRows += '<tr><td>' + (idx + 1) + '</td><td><strong>' + art.name + '</strong><br><span style="font-size: 11px; color: #64748B;">' + roleTitle + '</span></td><td>' + tradeTitle + '</td><td><code>' + art.kyc_id + '</code></td><td><span style="color: #047857; font-weight: bold;">' + art.police_clearance_no + '</span></td><td><span style="background: #ECFDF5; color: #047857; padding: 2px 6px; border-radius: 4px; font-size: 11px;">VERIFIED</span></td></tr>';
        });

        // Machinery gate entry permits
        let toolRows = '';
        (activeConfig?.machinery_roster || []).forEach((m, idx) => {
          toolRows += '<tr><td>' + (idx + 1) + '</td><td><strong>' + m.name + '</strong></td><td>' + m.spec + '</td><td>' + m.safety_grade + '</td><td><span style="color:#047857;font-weight:bold;">PERMITTED</span></td></tr>';
        });

        const gatePassHtml = '<!DOCTYPE html><html><head><title>Campus Security Entry Gate Pass - ' + clientTitle + '</title><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1E293B; line-height: 1.5; } .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; } .title { font-size: 20px; font-weight: 800; color: #1E3A8A; margin: 0; } .badge { background: #FEF3C7; color: #B45309; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; border: 1px solid #D97706; } .table { width: 100%; border-collapse: collapse; margin: 16px 0; } .table th, .table td { border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; font-size: 11px; } .table th { background: #F8FAFC; color: #1E3A8A; font-weight: 700; } .footer { margin-top: 30px; font-size: 11px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 12px; }</style></head><body>' +
          '<div class="header"><div><h1 class="title">CAMPUS SECURITY ENTRY GATE PASS</h1><p style="margin: 4px 0 0; color: #475569;"><strong>Authorized Client / Campus:</strong> ' + clientTitle + '</p><p style="margin: 2px 0 0; color: #64748B;">Issuing Federation: ' + selectedCoop.name + ' (Reg: ' + selectedCoop.registration_no + ')</p><p style="margin: 2px 0 0; color: #64748B;">Gate Pass ID: GP-' + Math.floor(10000 + Math.random() * 90000) + ' • Scheduled Window: ' + targetDate + '</p></div><div><span class="badge">POLICE VERIFIED SQUAD</span></div></div>' +
          '<p style="font-size: 12px; color: #334155;"><strong>Campus Security Protocol:</strong> The certified artisan personnel and heavy equipment listed below are cleared for security checkpoint entry. All personnel carry Government Photo KYC IDs, verified background certificates, and formal trade equipment badges.</p>' +
          '<table class="table"><tr><th>#</th><th>Artisan Name & Assigned Trade Role</th><th>Trade Specialization</th><th>Government KYC Token</th><th>Police Clearance Certificate</th><th>Status</th></tr>' + rosterRows + '</table>' +
          (toolRows ? ('<h3 style="font-size:14px;color:#1E3A8A;margin-top:18px;">Authorized Heavy Machinery & Specialized Tools</h3><table class="table"><tr><th>#</th><th>Equipment Name</th><th>Technical Specification</th><th>Safety Rating</th><th>Gate Clearance</th></tr>' + toolRows + '</table>') : '') +
          '<div class="footer"><p>Certified by: <strong>' + selectedCoop.head_name + '</strong>, Federation President & Ward Coordinator (' + selectedCoop.phone + ')</p><p>For campus security gate verification queries, contact National Cooperative Desk: <strong>1800-202-COOP</strong></p></div><script>window.print();</script></body></html>';

        const blob = new Blob([gatePassHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      } catch (e) {
        console.warn('Gate pass export error:', e);
      }
    }
    Alert.alert('Security Gate Pass Generated', 'Official police-verified artisan gate pass for ' + clientTitle + ' is ready.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('communityTitle') || 'Community & Bulk Services'}
        showBack
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Ongoing Bulk Project Banner (Instant access to Complete & Rate) */}
        {activeBooking?.is_bulk_project && (
          <View style={{ backgroundColor: '#F8FAFC', borderRadius: 18, borderWidth: 1.5, borderColor: colors.primary, padding: 14, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ backgroundColor: activeBooking.client_type === 'institutional' ? '#EFF6FF' : '#F0FDF4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={activeBooking.client_type === 'institutional' ? 'school' : 'business'} size={12} color={colors.primary} />
                <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary, marginLeft: 4 }}>
                  {activeBooking.client_type === 'institutional' ? 'CAMPUS CONTRACT ACTIVE' : 'COMMUNITY BULK ACTIVE'}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>{activeBooking.booking_id}</Text>
            </View>

            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.textPrimary }}>
              {activeBooking.institution_name || activeBooking.society_name || activeBooking.service?.name}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
              {activeBooking.service?.name} • {activeBooking.crew_size || 4} Master Artisans Squad
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                onPress={() => navigation.navigate('BulkProjectSuccess')}
                activeOpacity={0.85}
              >
                <Ionicons name="document-text" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Pass & Milestones</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: colors.successDark, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                onPress={() => {
                  if (typeof completeBulkProject === 'function') completeBulkProject();
                  navigation.navigate('Rating', { booking: activeBooking });
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="star" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Complete & Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Top Mode Segment Switcher: Institutional vs Residential */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'institutional' && styles.tabButtonActive]}
            onPress={() => {
              setActiveTab('institutional');
              if (selectedCoop.institutional_services?.length > 0) {
                setSelectedService(selectedCoop.institutional_services[0]);
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="school"
              size={18}
              color={activeTab === 'institutional' ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabButtonText, activeTab === 'institutional' && styles.tabButtonTextActive]}>
              {t('tabInstitutional') || 'Colleges & Campuses'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'residential' && styles.tabButtonActive]}
            onPress={() => {
              setActiveTab('residential');
              if (selectedCoop.bulk_services?.length > 0) {
                setSelectedService(selectedCoop.bulk_services[0]);
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="business"
              size={18}
              color={activeTab === 'residential' ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabButtonText, activeTab === 'residential' && styles.tabButtonTextActive]}>
              {t('tabResidential') || 'Societies & RWAs'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Banner Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconCircle}>
            <Ionicons
              name={activeTab === 'institutional' ? 'school' : 'business'}
              size={26}
              color={colors.primary}
            />
          </View>
          <View style={styles.heroTextCol}>
            <View style={styles.badgeRow}>
              <Text style={styles.heroBadge}>
                {activeTab === 'institutional'
                  ? (t('institutionalHubTag') || 'COLLEGES, UNIVERSITIES & CAMPUS BULK HUB')
                  : (t('communityHubTag') || 'RWA & HOUSING SOCIETY BULK HUB')}
              </Text>
              <View style={styles.ncctPill}>
                <Text style={styles.ncctPillText}>NCCT COOPERATIVE</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>
              {activeTab === 'institutional'
                ? 'Institutional Multi-Artisan Squads'
                : (t('communityHeroTitle') || 'Residential Society & RWA Contracts')}
            </Text>
            <Text style={styles.heroDesc}>
              {activeTab === 'institutional'
                ? 'Direct government-certified cooperative multi-artisan squads for engineering colleges, campuses, hostels, and hospitals with 3-stage escrow milestones, certified heavy machinery, and statutory compliance.'
                : (t('communityHeroDesc') || 'Standardized society pricing with 6-stage mechanized water tank cleaning, FLIR electrical audits, pre-monsoon sewer jetting, and common area buffing.')}
            </Text>
          </View>
        </View>

        {/* Multi-State Cooperative Federation Selection */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'institutional'
              ? 'Authorized Campus Cooperative Federation'
              : (t('authorizedCooperativeFederation') || 'Authorized Cooperative Federation')}
          </Text>
          <Text style={styles.sectionSub}>
            {activeTab === 'institutional'
              ? 'Multi-State Co-op Societies Act (MSCS) verified contractor guilds with statutory safety accreditation'
              : (t('mscsRegisteredContractorGuilds') || 'Multi-State Co-op Societies Act (MSCS) registered contractor guilds')}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.coopScroll}>
          {cooperativesData.map((coop) => (
            <TouchableOpacity
              key={coop.id}
              style={[styles.coopCard, selectedCoop.id === coop.id && styles.coopCardActive]}
              onPress={() => setSelectedCoop(coop)}
              activeOpacity={0.85}
            >
              <View style={styles.coopTopRow}>
                <View style={styles.coopIconCircle}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>MSCS RECOGNISED</Text>
                </View>
              </View>
              <Text style={styles.coopName}>{coop.name}</Text>
              <Text style={styles.coopLoc}>{coop.location}</Text>
              <Text style={styles.coopReg}>Reg: {coop.registration_no}</Text>
              <View style={styles.coopFooter}>
                <Text style={styles.coopArtisans}>{coop.total_artisans} Certified Artisans</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color={colors.warning} />
                  <Text style={styles.ratingText}>{coop.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cooperative Federation Ward Head Liaison Card */}
        <View style={styles.coopContactBanner}>
          <View style={styles.coopOfficerCol}>
            <Text style={styles.coopOfficerLabel}>COOPERATIVE WARD LIAISON DESK</Text>
            <Text style={styles.coopOfficerName}>{selectedCoop.head_name}</Text>
            <Text style={styles.coopOfficerTitle}>{selectedCoop.head_designation} • {selectedCoop.name}</Text>
          </View>
          <View style={styles.coopActionRow}>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => setCallModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call Liaison</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gatePassBtn}
              onPress={() => setGatePassModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="id-card" size={15} color={colors.primary} />
              <Text style={styles.gatePassBtnText}>Gate Pass</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services List Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'institutional'
              ? (t('availableCampusServices') || 'Institutional & Campus Bulk Services')
              : (t('availableSocietyServices') || 'Available Society Bulk Services')}
          </Text>
          <Text style={styles.sectionSub}>
            {activeTab === 'institutional'
              ? 'Standardized cooperative quotes with multi-artisan deployment, certified machinery & statutory compliance'
              : (t('standardRatesMultiCrew') || 'Standardized cooperative rates with multi-artisan deployment')}
          </Text>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {displayedServices.map((serv) => (
            <View key={serv.id} style={styles.serviceCard}>
              <View style={styles.serviceTopRow}>
                <View style={styles.serviceIconBox}>
                  <Ionicons name={serv.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.capacityBadge}>
                  <Text style={styles.capacityText}>{serv.capacity}</Text>
                </View>
              </View>

              <Text style={styles.serviceTitle}>{serv.title}</Text>
              <Text style={styles.serviceDesc}>{serv.description}</Text>

              {serv.statutory_compliance && (
                <View style={styles.statutoryBadgeRow}>
                  <Ionicons name="ribbon" size={12} color={colors.successDark} />
                  <Text style={styles.statutoryBadgeText}>{serv.statutory_compliance}</Text>
                </View>
              )}

              <View style={styles.serviceBottomRow}>
                <Text style={styles.priceEstimate}>{serv.base_estimate}</Text>
                <TouchableOpacity
                  style={styles.bookBulkBtn}
                  onPress={() => handleOpenQuoteModal(serv)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bookBulkBtnText}>Estimate & Book</Text>
                  <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Quote / Direct Booking Calculator Modal */}
      <Modal visible={quoteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '92%' }]}>
            {!confirmedRequest ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.modalTitle}>
                      {activeTab === 'institutional'
                        ? 'Institutional Campus Calculator & Booking'
                        : (t('societyBulkQuoteTitle') || 'Society Bulk Quote & Calculator')}
                    </Text>
                    <Text style={styles.modalSub}>{selectedService?.title}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setQuoteModalVisible(false)}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Trade Badge & Tagline Banner */}
                {activeConfig && (
                  <View style={styles.tradeHeaderBanner}>
                    <View style={styles.tradeBadgeRow}>
                      <View style={styles.tradePill}>
                        <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                        <Text style={styles.tradePillText}>{activeConfig.trade_name.toUpperCase()}</Text>
                      </View>
                      <View style={styles.tradeCatPill}>
                        <Text style={styles.tradeCatText}>
                          {activeConfig.category === 'institutional' ? 'CAMPUS INFRASTRUCTURE' : 'RWA SOCIETY BULK'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.tradeTaglineText}>{activeConfig.tagline}</Text>
                  </View>
                )}

                {/* Trade-Specific Interactive Customization Sections */}
                {activeConfig?.custom_sections && activeConfig.custom_sections.length > 0 ? (
                  activeConfig.custom_sections.map((sec) => {
                    const currentSelectedId = selectedTradeOptions[sec.id] || sec.options[0]?.id;
                    return (
                      <View key={sec.id} style={styles.tradeSectionBlock}>
                        <Text style={styles.tradeSectionLabel}>{sec.label}</Text>
                        <View style={styles.tradeOptionsList}>
                          {sec.options.map((opt) => {
                            const isSelected = currentSelectedId === opt.id;
                            return (
                              <TouchableOpacity
                                key={opt.id}
                                style={[styles.tradeOptionCard, isSelected && styles.tradeOptionCardActive]}
                                onPress={() => setSelectedTradeOptions((prev) => ({ ...prev, [sec.id]: opt.id }))}
                                activeOpacity={0.85}
                              >
                                <View style={styles.tradeOptionTop}>
                                  <Ionicons
                                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                                    size={16}
                                    color={isSelected ? colors.primary : colors.textMuted}
                                  />
                                  <Text style={[styles.tradeOptionLabel, isSelected && styles.tradeOptionLabelActive]}>
                                    {opt.label}
                                  </Text>
                                </View>
                                {opt.detail && (
                                  <Text style={[styles.tradeOptionDetail, isSelected && styles.tradeOptionDetailActive]}>
                                    {opt.detail}
                                  </Text>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })
                ) : null}

                {/* Infrastructure Scale Selector */}
                {activeTab === 'institutional' ? (
                  <>
                    <View style={styles.tradeSectionBlock}>
                      <Text style={styles.tradeSectionLabel}>Select Institution Category</Text>
                      <View style={styles.chipsRow}>
                        {[
                          'College / University Campus',
                          'Student Hostel & Mess Facility',
                          'School / Polytechnic Institute',
                          'Hospital & Medical College'
                        ].map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[styles.calcChip, institutionType === type && styles.calcChipActive]}
                            onPress={() => setInstitutionType(type)}
                          >
                            <Text style={[styles.calcChipText, institutionType === type && styles.calcChipTextActive]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.tradeSectionBlock}>
                      <Text style={styles.tradeSectionLabel}>Campus Scale / Infrastructure Size</Text>
                      <View style={styles.chipsRow}>
                        {[
                          'Department / Lab Wing (10,000–25,000 sq ft)',
                          'Hostel Block (50–150 Rooms / 500 Students)',
                          'Academic Complex (3–5 Floors / 20+ Halls)',
                          'Full University Campus (50+ Acres / Mega Sump)'
                        ].map((sc) => (
                          <TouchableOpacity
                            key={sc}
                            style={[styles.calcChip, campusScale === sc && styles.calcChipActive]}
                            onPress={() => setCampusScale(sc)}
                          >
                            <Text style={[styles.calcChipText, campusScale === sc && styles.calcChipTextActive]}>
                              {sc}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.tradeSectionBlock}>
                    <Text style={styles.tradeSectionLabel}>Housing Society Scale / Flat Count</Text>
                    <View style={styles.chipsRow}>
                      {['Small (20–50 Flats)', 'Medium (100–250 Flats)', 'Large (300+ Flats)'].map((sc) => (
                        <TouchableOpacity
                          key={sc}
                          style={[styles.calcChip, societyScale === sc && styles.calcChipActive]}
                          onPress={() => setSocietyScale(sc)}
                        >
                          <Text style={[styles.calcChipText, societyScale === sc && styles.calcChipTextActive]}>
                            {sc}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Specialized Heavy Machinery & Equipment Deployed Card */}
                {activeConfig?.machinery_roster && activeConfig.machinery_roster.length > 0 && (
                  <View style={styles.machineryCard}>
                    <View style={styles.machineryHeaderRow}>
                      <Ionicons name="construct" size={16} color={colors.primary} />
                      <Text style={styles.machineryHeaderTitle}>Certified Heavy Machinery & Equipment Deployed</Text>
                    </View>
                    <Text style={styles.machineryHeaderSub}>
                      Operated exclusively by trained multi-artisan operators under cooperative safety compliance
                    </Text>
                    <View style={styles.machineryList}>
                      {activeConfig.machinery_roster.map((m, idx) => (
                        <View key={idx} style={styles.machineItem}>
                          <View style={styles.machineIconCircle}>
                            <Ionicons name={m.icon || "build"} size={14} color={colors.primary} />
                          </View>
                          <View style={{ flex: 1, marginLeft: 8 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text style={styles.machineName}>{m.name}</Text>
                              <View style={styles.safetyGradeBadge}>
                                <Text style={styles.safetyGradeText}>{m.safety_grade}</Text>
                              </View>
                            </View>
                            <Text style={styles.machineSpec}>{m.spec}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Statutory Standards & Compliance Card */}
                {activeConfig?.statutory_compliance && (
                  <View style={styles.complianceCard}>
                    <View style={styles.complianceHeaderRow}>
                      <Ionicons name="ribbon" size={16} color={colors.successDark} />
                      <Text style={styles.complianceHeaderTitle}>Statutory Compliance & Legal Certification</Text>
                    </View>
                    <Text style={styles.complianceCodeText}>{activeConfig.statutory_compliance.code}</Text>
                    <View style={styles.complianceDetailsGrid}>
                      <View style={styles.complianceDetailItem}>
                        <Text style={styles.complianceDetailLabel}>Issuing Body / Lab:</Text>
                        <Text style={styles.complianceDetailVal}>{activeConfig.statutory_compliance.issuing_body}</Text>
                      </View>
                      <View style={styles.complianceDetailItem}>
                        <Text style={styles.complianceDetailLabel}>Deliverable Document:</Text>
                        <Text style={styles.complianceDetailVal}>{activeConfig.statutory_compliance.audit_report}</Text>
                      </View>
                    </View>
                    <View style={styles.legalNoticeRow}>
                      <Ionicons name="checkmark-circle" size={13} color={colors.successDark} />
                      <Text style={styles.legalNoticeText}>{activeConfig.statutory_compliance.mandatory_legal}</Text>
                    </View>
                  </View>
                )}

                {/* Contract Scope & Itemized Deliverables */}
                {activeConfig?.deliverables && activeConfig.deliverables.length > 0 && (
                  <View style={styles.deliverablesCard}>
                    <View style={styles.deliverablesHeaderRow}>
                      <Ionicons name="clipboard" size={15} color={colors.primary} />
                      <Text style={styles.deliverablesTitle}>Contract Scope & Itemized Deliverables</Text>
                    </View>
                    {activeConfig.deliverables.map((deliv, idx) => (
                      <View key={idx} style={styles.deliverableRow}>
                        <Ionicons name="checkmark-done" size={14} color={colors.primary} />
                        <Text style={styles.deliverableText}>{deliv}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Real-time Math Output Card */}
                <View style={styles.calcResultCard}>
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Ionicons name="people" size={16} color={colors.primary} />
                      <Text style={styles.metricItemVal}>{bulkMath.crew} Artisans</Text>
                      <Text style={styles.metricItemLabel}>Squad Size</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="time" size={16} color={colors.primary} />
                      <Text style={styles.metricItemVal}>{bulkMath.days} Days</Text>
                      <Text style={styles.metricItemLabel}>Duration</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Ionicons name="wallet" size={16} color={colors.successDark} />
                      <Text style={[styles.metricItemVal, { color: colors.successDark }]}>80% Direct</Text>
                      <Text style={styles.metricItemLabel}>Fair Wage</Text>
                    </View>
                  </View>

                  <View style={styles.calcCostBanner}>
                    <Text style={styles.calcCostLabel}>ESTIMATED COOPERATIVE PROJECT VALUE</Text>
                    <Text style={styles.calcCostVal}>
                      ₹{bulkMath.minCost.toLocaleString()} – ₹{bulkMath.maxCost.toLocaleString()}
                    </Text>
                    <Text style={styles.calcAdvanceHint}>
                      Advance Milestone 1 (40%): ₹{bulkMath.advanceAmount.toLocaleString()} (Held in SBI Escrow)
                    </Text>
                    <Text style={styles.calcMilestoneBreakdown}>
                      Mid Milestone 2 (35%): ₹{bulkMath.midMilestone.toLocaleString()} • Final Handover (25%): ₹{bulkMath.finalMilestone.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Form Fields */}
                {activeTab === 'institutional' ? (
                  <>
                    <Text style={styles.fieldLabel}>College / Institution Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={institutionName}
                      onChangeText={setInstitutionName}
                      placeholder="e.g. Delhi Technical Campus"
                    />

                    <Text style={styles.fieldLabel}>Department / Maintenance Wing</Text>
                    <TextInput
                      style={styles.input}
                      value={departmentOffice}
                      onChangeText={setDepartmentOffice}
                      placeholder="e.g. Estate Office / Hostel Maintenance Cell"
                    />

                    <Text style={styles.fieldLabel}>Authorized Officer / Warden Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={officerName}
                      onChangeText={setOfficerName}
                      placeholder="Full Name & Title"
                    />

                    <Text style={styles.fieldLabel}>Officer Designation</Text>
                    <TextInput
                      style={styles.input}
                      value={officerDesignation}
                      onChangeText={setOfficerDesignation}
                      placeholder="e.g. Chief Estate Officer / Campus Warden"
                    />

                    <Text style={styles.fieldLabel}>Official Mobile Number *</Text>
                    <TextInput
                      style={styles.input}
                      value={contactPhone}
                      onChangeText={setContactPhone}
                      keyboardType="phone-pad"
                    />

                    <Text style={styles.fieldLabel}>Official Institutional Email</Text>
                    <TextInput
                      style={styles.input}
                      value={officialEmail}
                      onChangeText={setOfficialEmail}
                      keyboardType="email-address"
                    />

                    <Text style={styles.fieldLabel}>Institutional GSTIN / Tax ID (For Invoice)</Text>
                    <TextInput
                      style={styles.input}
                      value={gstin}
                      onChangeText={setGstin}
                      placeholder="e.g. 07AAAAA0000A1Z5"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.fieldLabel}>Society / RWA Name *</Text>
                    <TextInput
                      style={styles.input}
                      value={societyName}
                      onChangeText={setSocietyName}
                      placeholder="e.g. Palm Heights RWA"
                    />

                    <Text style={styles.fieldLabel}>RWA Representative Contact Name</Text>
                    <TextInput
                      style={styles.input}
                      value={officerName}
                      onChangeText={setOfficerName}
                      placeholder="Full Name"
                    />

                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                    <TextInput
                      style={styles.input}
                      value={contactPhone}
                      onChangeText={setContactPhone}
                      keyboardType="phone-pad"
                    />
                  </>
                )}

                <Text style={styles.fieldLabel}>Preferred Date for Site Inspection / Work Start</Text>
                <TextInput
                  style={styles.input}
                  value={targetDate}
                  onChangeText={setTargetDate}
                  placeholder="e.g. Monday, 7 Sep 2026"
                />

                {/* Dual Action Booking Buttons */}
                <View style={styles.modalActionsCol}>
                  {/* Action 1: Direct Milestone Escrow Booking */}
                  <TouchableOpacity
                    style={styles.directEscrowBtn}
                    onPress={handleDirectEscrowBooking}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={styles.directEscrowBtnText}>Book with Milestone Escrow Deposit</Text>
                      <Text style={styles.directEscrowSubText}>Advance ₹{bulkMath.advanceAmount.toLocaleString()} via SBI Escrow</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Action 2: Request Inspection Quote */}
                  <TouchableOpacity
                    style={styles.requestAuditBtn}
                    onPress={handleSubmitInspectionQuote}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="document-text" size={16} color={colors.primary} />
                    <Text style={styles.requestAuditBtnText}>Request Campus Audit & Formal Quotation</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              /* Confirmation Ticket */
              <View style={{ alignItems: 'center', paddingVertical: 14 }}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.confirmedTitle}>Inspection Request Registered!</Text>
                <Text style={styles.confirmedTicket}>Ticket #{confirmedRequest.id}</Text>
                <Text style={styles.confirmedDesc}>
                  Ward Coordinator <Text style={{ fontWeight: '800' }}>{selectedCoop.head_name}</Text> from {selectedCoop.name} will visit your campus for on-site inspection within 24 hours.
                </Text>

                <View style={styles.confirmedDetailsCard}>
                  <Text style={styles.detailRow}>
                    🏛️ <Text style={{ fontWeight: '700' }}>Institution:</Text> {confirmedRequest.institution_name || confirmedRequest.society_name}
                  </Text>
                  <Text style={styles.detailRow}>
                    🔧 <Text style={{ fontWeight: '700' }}>Scope:</Text> {confirmedRequest.service_title}
                  </Text>
                  {confirmedRequest.trade_name && (
                    <Text style={styles.detailRow}>
                      ⚙️ <Text style={{ fontWeight: '700' }}>Trade:</Text> {confirmedRequest.trade_name}
                    </Text>
                  )}
                  <Text style={styles.detailRow}>
                    📅 <Text style={{ fontWeight: '700' }}>Date:</Text> {confirmedRequest.target_date}
                  </Text>
                  {confirmedRequest.statutory_compliance && (
                    <Text style={styles.detailRow}>
                      🛡️ <Text style={{ fontWeight: '700' }}>Compliance:</Text> {confirmedRequest.statutory_compliance}
                    </Text>
                  )}
                </View>

                {/* Instant PDF Proposal Download */}
                <TouchableOpacity
                  style={styles.downloadPdfActionBtn}
                  onPress={handleDownloadProposalPdf}
                  activeOpacity={0.85}
                >
                  <Ionicons name="download" size={18} color="#FFFFFF" />
                  <Text style={styles.downloadPdfActionText}>Download Official Co-op Proposal (PDF)</Text>
                </TouchableOpacity>

                {/* View Security Gate Pass */}
                <TouchableOpacity
                  style={styles.viewGatePassActionBtn}
                  onPress={() => {
                    setQuoteModalVisible(false);
                    setGatePassModalVisible(true);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="id-card" size={16} color={colors.primary} />
                  <Text style={styles.viewGatePassActionText}>View Campus Security Gate Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => setQuoteModalVisible(false)}
                >
                  <Text style={styles.doneBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Campus Security Gate Pass Modal */}
      <Modal visible={gatePassModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '92%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={styles.gatePassPill}>
                    <Ionicons name="shield-checkmark" size={12} color={colors.successDark} />
                    <Text style={styles.gatePassPillText}>POLICE-VERIFIED ARTISAN SQUAD</Text>
                  </View>
                  <Text style={styles.modalTitle}>Campus Security Entry Gate Pass</Text>
                  <Text style={styles.modalSub}>
                    {activeTab === 'institutional' ? institutionName : societyName}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setGatePassModalVisible(false)}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.gatePassNotice}>
                All artisans listed below carry biometric Government Photo KYC IDs, verified background checks, and cooperative identity badges compliant with educational campus entry standards.
              </Text>

              <View style={styles.squadList}>
                {(selectedCoop.artisan_squad_roster || []).map((artisan, index) => {
                  const roleTitle = activeConfig?.squad_composition?.[index] || artisan.role;
                  return (
                    <View key={artisan.id || index} style={styles.squadCard}>
                      <Image source={{ uri: artisan.photo }} style={styles.squadPhoto} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={styles.squadNameRow}>
                          <Text style={styles.squadName}>{artisan.name}</Text>
                          <View style={styles.kycVerifiedBadge}>
                            <Ionicons name="checkmark" size={10} color={colors.successDark} />
                            <Text style={styles.kycVerifiedText}>KYC</Text>
                          </View>
                        </View>
                        <Text style={styles.squadRole}>{roleTitle}</Text>
                        <Text style={styles.squadTrade}>Trade: {activeConfig?.trade_name || artisan.trade}</Text>
                        <View style={styles.policeRow}>
                          <Ionicons name="document-lock" size={12} color={colors.textSecondary} />
                          <Text style={styles.policeText}>{artisan.police_clearance_no}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Authorized Heavy Machinery Entry Notice in Gate Pass */}
              {activeConfig?.machinery_roster && activeConfig.machinery_roster.length > 0 && (
                <View style={styles.gatePassToolsCard}>
                  <Text style={styles.gatePassToolsTitle}>Authorized Machinery & Industrial Equipment:</Text>
                  {activeConfig.machinery_roster.map((m, idx) => (
                    <View key={idx} style={styles.gatePassToolRow}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                      <Text style={styles.gatePassToolText}>{m.name} ({m.safety_grade})</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.printGatePassBtn}
                onPress={handleDownloadGatePassPdf}
                activeOpacity={0.85}
              >
                <Ionicons name="print" size={18} color="#FFFFFF" />
                <Text style={styles.printGatePassBtnText}>Print / Save Security Gate Pass (PDF)</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Simulated Call Modal */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { alignItems: 'center', paddingVertical: 24 }]}>
            <View style={styles.callRingCircle}>
              <Ionicons name="call" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.callingTitle}>Calling Cooperative Federation Head</Text>
            <Text style={styles.callingName}>{selectedCoop.head_name}</Text>
            <Text style={styles.callingDesignation}>{selectedCoop.head_designation}</Text>
            <Text style={styles.callingNumber}>{selectedCoop.phone}</Text>

            <View style={styles.callingSafetyBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.successDark} />
              <Text style={styles.callingSafetyText}>Official Verified Cooperative Liaison Desk</Text>
            </View>

            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => setCallModalVisible(false)}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
              <Text style={styles.endCallText}>End Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.primarySubtle,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  heroIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    elevation: 1
  },
  heroTextCol: {
    flex: 1
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  heroBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  ncctPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  ncctPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4
  },
  heroDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  coopScroll: {
    paddingBottom: 12,
    gap: 12
  },
  coopCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8
  },
  coopCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle
  },
  coopTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  coopIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  verifiedBadge: {
    backgroundColor: colors.successSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.successDark
  },
  coopName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2
  },
  coopLoc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2
  },
  coopReg: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 8
  },
  coopFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8
  },
  coopArtisans: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary
  },
  coopContactBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  coopOfficerCol: {
    flex: 1,
    marginRight: 8
  },
  coopOfficerLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  coopOfficerName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  coopOfficerTitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  coopActionRow: {
    flexDirection: 'row',
    gap: 6
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4
  },
  callBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  gatePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4
  },
  gatePassBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary
  },
  servicesGrid: {
    gap: 14
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  serviceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  serviceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  capacityBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  capacityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4
  },
  serviceDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 8
  },
  statutoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  statutoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark
  },
  serviceBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10
  },
  priceEstimate: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary
  },
  bookBulkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4
  },
  bookBulkBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },

  // Trade Specification Banner
  tradeHeaderBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  tradeBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  tradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4
  },
  tradePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534'
  },
  tradeCatPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  tradeCatText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary
  },
  tradeTaglineText: {
    fontSize: 11,
    color: '#14532D',
    lineHeight: 15,
    marginTop: 2
  },

  // Trade Customizer Sections
  tradeSectionBlock: {
    marginBottom: 14
  },
  tradeSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8
  },
  tradeOptionsList: {
    gap: 6
  },
  tradeOptionCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  tradeOptionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle
  },
  tradeOptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tradeOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1
  },
  tradeOptionLabelActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  tradeOptionDetail: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 24,
    marginTop: 2
  },
  tradeOptionDetailActive: {
    color: colors.primaryDark
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6
  },
  calcChip: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  calcChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySubtle
  },
  calcChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  calcChipTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },

  // Machinery Card
  machineryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginVertical: 10
  },
  machineryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  machineryHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  machineryHeaderSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 10
  },
  machineryList: {
    gap: 8
  },
  machineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  machineIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  machineName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1
  },
  safetyGradeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  safetyGradeText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary
  },
  machineSpec: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },

  // Compliance Card
  complianceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginVertical: 10
  },
  complianceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  complianceHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534'
  },
  complianceCodeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#15803D',
    marginBottom: 6
  },
  complianceDetailsGrid: {
    gap: 4,
    marginBottom: 6
  },
  complianceDetailItem: {
    flexDirection: 'row'
  },
  complianceDetailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
    width: 120
  },
  complianceDetailVal: {
    fontSize: 10,
    color: '#1E293B',
    flex: 1
  },
  legalNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#BBF7D0',
    paddingTop: 6,
    marginTop: 4
  },
  legalNoticeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
    flex: 1
  },

  // Deliverables Card
  deliverablesCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10
  },
  deliverablesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  deliverablesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  deliverableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4
  },
  deliverableText: {
    fontSize: 11,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 15
  },

  calcResultCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  metricItem: {
    alignItems: 'center',
    flex: 1
  },
  metricItemVal: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  metricItemLabel: {
    fontSize: 9,
    color: colors.textSecondary
  },
  calcCostBanner: {
    backgroundColor: colors.primarySubtle,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  calcCostLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  calcCostVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 1
  },
  calcAdvanceHint: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginTop: 2
  },
  calcMilestoneBreakdown: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    marginTop: 6
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalActionsCol: {
    gap: 10,
    marginTop: 18
  },
  directEscrowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 14
  },
  directEscrowBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  directEscrowSubText: {
    fontSize: 10,
    color: '#E0E7FF'
  },
  requestAuditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14
  },
  requestAuditBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 6
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  confirmedTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary
  },
  confirmedTicket: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2
  },
  confirmedDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 17
  },
  confirmedDetailsCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginVertical: 10,
    gap: 6
  },
  detailRow: {
    fontSize: 11,
    color: colors.textPrimary
  },
  downloadPdfActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    width: '100%',
    marginTop: 8
  },
  downloadPdfActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  viewGatePassActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    marginTop: 8
  },
  viewGatePassActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 6
  },
  doneBtn: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 6
  },
  doneBtnText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700'
  },
  gatePassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
    gap: 4
  },
  gatePassPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successDark
  },
  gatePassNotice: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 14
  },
  squadList: {
    gap: 10,
    marginBottom: 16
  },
  squadCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  squadPhoto: {
    width: 46,
    height: 46,
    borderRadius: 23
  },
  squadNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  squadName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  kycVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSubtle,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2
  },
  kycVerifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.successDark
  },
  squadRole: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 1
  },
  squadTrade: {
    fontSize: 10,
    color: colors.textSecondary
  },
  policeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  policeText: {
    fontSize: 9,
    color: colors.textMuted
  },
  gatePassToolsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  gatePassToolsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6
  },
  gatePassToolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3
  },
  gatePassToolText: {
    fontSize: 10,
    color: colors.textPrimary
  },
  printGatePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    gap: 6
  },
  printGatePassBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  callRingCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  callingTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700'
  },
  callingName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4
  },
  callingDesignation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  callingNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8
  },
  callingSafetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    marginVertical: 14
  },
  callingSafetyText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark
  },
  endCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    marginTop: 8
  },
  endCallText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  }
});

export default Screen18_CommunityScreen;
