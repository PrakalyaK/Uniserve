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
  const [tankCapacity, setTankCapacity] = useState('15,000 – 25,000 Litres');
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

  // Dynamic Math Calculator for Institutional & Society Bulk Services
  const bulkMath = useMemo(() => {
    let crew = 6;
    let days = 2;
    let minCost = 8500;
    let maxCost = 14500;

    const servId = selectedService?.id;

    if (activeTab === 'institutional') {
      let scaleMult = 1;
      if (campusScale.includes('Department')) scaleMult = 0.8;
      else if (campusScale.includes('Hostel')) scaleMult = 1.3;
      else if (campusScale.includes('Academic')) scaleMult = 1.8;
      else if (campusScale.includes('Full University')) scaleMult = 2.6;

      if (servId === 'inst_1') {
        crew = Math.round(6 * scaleMult); days = Math.round(2 * scaleMult); minCost = Math.round(9500 * scaleMult); maxCost = Math.round(16500 * scaleMult);
      } else if (servId === 'inst_2') {
        crew = Math.round(5 * scaleMult); days = Math.round(3 * scaleMult); minCost = Math.round(14500 * scaleMult); maxCost = Math.round(24500 * scaleMult);
      } else if (servId === 'inst_3') {
        crew = Math.round(10 * scaleMult); days = Math.round(3 * scaleMult); minCost = Math.round(18000 * scaleMult); maxCost = Math.round(32000 * scaleMult);
      } else if (servId === 'inst_4') {
        crew = Math.round(5 * scaleMult); days = Math.round(2 * scaleMult); minCost = Math.round(10500 * scaleMult); maxCost = Math.round(18500 * scaleMult);
      } else if (servId === 'inst_5') {
        crew = Math.round(6 * scaleMult); days = Math.round(3 * scaleMult); minCost = Math.round(8500 * scaleMult); maxCost = Math.round(15500 * scaleMult);
      } else if (servId === 'inst_6') {
        crew = Math.round(12 * scaleMult); days = Math.round(5 * scaleMult); minCost = Math.round(25000 * scaleMult); maxCost = Math.round(48000 * scaleMult);
      } else if (servId === 'inst_7') {
        crew = Math.round(8 * scaleMult); days = Math.round(3 * scaleMult); minCost = Math.round(11500 * scaleMult); maxCost = Math.round(21000 * scaleMult);
      } else {
        crew = Math.round(4 * scaleMult); days = Math.round(2 * scaleMult); minCost = Math.round(6500 * scaleMult); maxCost = Math.round(12000 * scaleMult);
      }
    } else {
      if (servId === 'bs1') {
        if (tankCapacity.includes('5,000')) { crew = 3; days = 1; minCost = 2999; maxCost = 4500; }
        else if (tankCapacity.includes('15,000')) { crew = 5; days = 1; minCost = 5500; maxCost = 8500; }
        else { crew = 8; days = 2; minCost = 11000; maxCost = 16500; }
      } else if (servId === 'bs2') { crew = 4; days = 2; minCost = 8500; maxCost = 14500; }
      else if (servId === 'bs3') { crew = 6; days = 2; minCost = 12000; maxCost = 22000; }
      else if (servId === 'bs4') { crew = 4; days = 1; minCost = 3500; maxCost = 6500; }
      else if (servId === 'bs5') { crew = 8; days = 1; minCost = 7500; maxCost = 13500; }
      else { crew = 10; days = 5; minCost = 35000; maxCost = 65000; }
    }

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
  }, [selectedService, activeTab, campusScale, societyScale, tankCapacity]);

  const handleOpenQuoteModal = (service) => {
    setSelectedService(service);
    setConfirmedRequest(null);
    setQuoteModalVisible(true);
  };

  // 1. Direct Milestone Escrow Booking Flow
  const handleDirectEscrowBooking = () => {
    setQuoteModalVisible(false);

    const isInstitutional = activeTab === 'institutional';
    const clientName = isInstitutional ? institutionName : societyName;
    const scaleTitle = isInstitutional ? campusScale : societyScale;

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
      material_label: 'Standard Cooperative Bulk Sourcing',
      material_sub: 'Central Labour Wholesale Reserve',
      address: isInstitutional ? (institutionName + ', ' + departmentOffice) : (societyName + ', Main Gate'),
      description: (isInstitutional ? 'Institutional Campus Contract' : 'Residential Society Project') + ': ' + selectedService.title + ' for ' + clientName + '. Scale: ' + scaleTitle + '. Compliance: ' + (selectedService.statutory_compliance || 'Standard Cooperative Assurance') + '.',
      scheduled_date: targetDate,
      scheduled_time: '09:30 AM - 01:30 PM',
      cooperative_name: selectedCoop.name,
      artisan_squad: selectedCoop.artisan_squad_roster || [],
      statutory_compliance: selectedService.statutory_compliance || 'AICTE / UGC / MSCS Certified'
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
      cooperative: selectedCoop.name,
      contact_person: isInstitutional ? officerName : user?.name,
      phone: contactPhone,
      target_date: targetDate,
      units_estimate: (isInstitutional ? campusScale : societyScale) + ' • Est ₹' + bulkMath.minCost.toLocaleString() + ' - ₹' + bulkMath.maxCost.toLocaleString(),
      crew_size: bulkMath.crew,
      days: bulkMath.days,
      estimated_cost_min: bulkMath.minCost,
      estimated_cost_max: bulkMath.maxCost,
      statutory_compliance: selectedService.statutory_compliance,
      artisan_squad: selectedCoop.artisan_squad_roster || []
    });

    setConfirmedRequest(req);
  };

  // 3. Download Official Proposal PDF (Web printable HTML generator)
  const handleDownloadProposalPdf = () => {
    const req = confirmedRequest;
    if (!req) return;

    if (Platform.OS === 'web') {
      try {
        const proposalHtml = '<!DOCTYPE html><html><head><title>UniServ Cooperative Institutional Proposal - ' + req.id + '</title><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1E293B; } .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; } .title { font-size: 24px; font-weight: 800; color: #1E3A8A; margin: 0; } .sub { font-size: 14px; color: #64748B; margin: 4px 0 0; } .badge { background: #ECFDF5; color: #047857; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #059669; } .table { width: 100%; border-collapse: collapse; margin: 20px 0; } .table th, .table td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; font-size: 13px; } .table th { background: #F8FAFC; color: #1E3A8A; font-weight: 700; } .section-title { font-size: 16px; font-weight: 800; color: #1E3A8A; margin: 20px 0 10px; } .footer { margin-top: 40px; font-size: 12px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 14px; text-align: center; }</style></head><body><div class="header"><div><h1 class="title">Ministry of Cooperation • NCCT Affiliated</h1><h2 style="font-size: 18px; color: #475569; margin: 4px 0 0;">' + selectedCoop.name + '</h2><p class="sub">Reg No: ' + selectedCoop.registration_no + ' • Ward Coordination Desk</p><p class="sub">Ref: COOP-INST-PROP-' + req.id + '-2026</p></div><div><span class="badge">OFFICIAL INSTITUTIONAL PROPOSAL</span></div></div><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 20px;"><p><strong>To:</strong> ' + (req.officer_name || 'The Estate Officer') + ', ' + (req.department_office || 'Maintenance Wing') + '</p><p><strong>Institution:</strong> ' + (req.institution_name || req.society_name) + '</p><p><strong>Scope / Facility:</strong> ' + req.service_title + '</p><p><strong>Proposed Inspection / Deployment:</strong> ' + req.target_date + '</p>' + (req.gstin ? '<p><strong>Institutional GSTIN:</strong> ' + req.gstin + '</p>' : '') + '</div><div class="section-title">Cooperative Multi-Artisan Squad & Quotation Breakdown</div><table class="table"><tr><th>Service Scope</th><th>Artisan Squad</th><th>Duration</th><th>Estimated Cost Bracket</th><th>Statutory Certification</th></tr><tr><td>' + selectedService.title + '</td><td>' + bulkMath.crew + ' Certified Master Artisans</td><td>' + bulkMath.days + ' Deployment Days</td><td><strong>₹' + bulkMath.minCost.toLocaleString() + ' – ₹' + bulkMath.maxCost.toLocaleString() + '</strong></td><td>' + (selectedService.statutory_compliance || 'AICTE/UGC Certified') + '</td></tr></table><div class="section-title">3-Stage Milestone Escrow Allocation</div><table class="table"><tr><th>Milestone Stage</th><th>Disbursement Condition</th><th>Escrow Amount (Approx 40/35/25)</th></tr><tr><td>Milestone 1: Mobilization & Wholesale Material Reserve</td><td>Deposited into SBI MSCS Escrow on work order award</td><td>₹' + bulkMath.advanceAmount.toLocaleString() + '</td></tr><tr><td>Milestone 2: Mid-Stage Quality Audit</td><td>Ward Coordinator & Estate Officer physical inspection sign-off</td><td>₹' + bulkMath.midMilestone.toLocaleString() + '</td></tr><tr><td>Milestone 3: Final Handover & 30-Day Warranty Activation</td><td>Authorized Officer OTP handshake</td><td>₹' + bulkMath.finalMilestone.toLocaleString() + '</td></tr></table><div class="footer"><p>100% Transparent Cooperative Labor Platform • 80% Direct Artisan Wage Allocation • Central MSCS Trust Protected</p><p>🛡️ Active Seva Suraksha Workmanship & Statutory Rework Warranty</p></div><script>window.print();</script></body></html>';
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

  // 4. Download Campus Security Gate Pass (Web printable HTML generator)
  const handleDownloadGatePassPdf = () => {
    const squad = selectedCoop.artisan_squad_roster || [];
    const clientTitle = activeTab === 'institutional' ? institutionName : societyName;

    if (Platform.OS === 'web') {
      try {
        let rosterRows = '';
        squad.forEach((art, idx) => {
          rosterRows += '<tr><td>' + (idx + 1) + '</td><td><strong>' + art.name + '</strong><br><span style="font-size: 11px; color: #64748B;">' + art.role + '</span></td><td>' + art.trade + '</td><td><code>' + art.kyc_id + '</code></td><td><span style="color: #047857; font-weight: bold;">' + art.police_clearance_no + '</span></td><td><span style="background: #ECFDF5; color: #047857; padding: 2px 6px; border-radius: 4px; font-size: 11px;">VERIFIED</span></td></tr>';
        });

        const gatePassHtml = '<!DOCTYPE html><html><head><title>UniServ Campus Security Entry Gate Pass - ' + clientTitle + '</title><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1E293B; } .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; } .title { font-size: 22px; font-weight: 800; color: #1E3A8A; margin: 0; } .badge { background: #FEF3C7; color: #B45309; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #D97706; } .table { width: 100%; border-collapse: collapse; margin: 20px 0; } .table th, .table td { border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; font-size: 12px; } .table th { background: #F8FAFC; color: #1E3A8A; font-weight: 700; } .footer { margin-top: 30px; font-size: 11px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 12px; }</style></head><body><div class="header"><div><h1 class="title">CAMPUS SECURITY ENTRY GATE PASS</h1><p style="margin: 4px 0 0; color: #475569;"><strong>Authorized Institution:</strong> ' + clientTitle + '</p><p style="margin: 2px 0 0; color: #64748B;">Issuing Federation: ' + selectedCoop.name + ' (Reg: ' + selectedCoop.registration_no + ')</p><p style="margin: 2px 0 0; color: #64748B;">Gate Pass ID: GP-' + Math.floor(10000 + Math.random() * 90000) + ' • Scheduled Date: ' + targetDate + '</p></div><div><span class="badge">POLICE VERIFIED SQUAD</span></div></div><p style="font-size: 12px; color: #334155;"><strong>Security Protocol Notice:</strong> The following certified artisan personnel have passed government biometric KYC, cooperative skill certification, and local police verification. They are authorized for tool entry and infrastructure maintenance within the campus perimeter.</p><table class="table"><tr><th>#</th><th>Artisan Name & Role</th><th>Trade Designation</th><th>Government KYC ID Token</th><th>Police Clearance Certificate No.</th><th>Status</th></tr>' + rosterRows + '</table><div class="footer"><p>Certified by: <strong>' + selectedCoop.head_name + '</strong>, Federation President & Ward Coordinator (' + selectedCoop.phone + ')</p><p>For campus gate verification queries, dial the National Cooperative Helpline: <strong>1800-202-COOP</strong></p></div><script>window.print();</script></body></html>';
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
                ? (t('institutionalHeroTitle') || 'Deploy Certified Cooperative Artisan Squads for Campuses')
                : (t('deployCoopFleets') || 'Deploy Certified Cooperative Fleets')}
            </Text>
            <Text style={styles.heroSub}>
              {activeTab === 'institutional'
                ? (t('institutionalHeroSub') || 'Statutory audits, high-capacity water reservoirs, student hostel deep cleans, and multi-artisan maintenance for educational institutes.')
                : (t('communityFleetSub') || 'Direct connection with Government-Registered Labour Cooperative Federations for society-wide infrastructure and maintenance.')}
            </Text>
          </View>
        </View>

        {/* Institutional Trust Highlights Pill Bar */}
        {activeTab === 'institutional' && (
          <View style={styles.trustPillBar}>
            <View style={styles.trustPillItem}>
              <Ionicons name="shield-checkmark" size={14} color={colors.successDark} />
              <Text style={styles.trustPillText}>AICTE / UGC Audit Compliant</Text>
            </View>
            <View style={styles.trustPillItem}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} />
              <Text style={styles.trustPillText}>SBI Escrow Protected</Text>
            </View>
            <View style={styles.trustPillItem}>
              <Ionicons name="id-card" size={14} color={colors.successDark} />
              <Text style={styles.trustPillText}>Gate Pass KYC Ready</Text>
            </View>
          </View>
        )}

        {/* Matched Cooperative Federation Card */}
        <View style={styles.coopCard}>
          <View style={styles.coopHeaderRow}>
            <View style={styles.coopAvatarBox}>
              <Ionicons name="people-circle" size={32} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.verifiedRow}>
                <Text style={styles.coopName}>{selectedCoop.name}</Text>
              </View>
              <Text style={styles.regNoText}>Reg: {selectedCoop.registration_no}</Text>
            </View>
          </View>

          {/* Federation Community Head / Ward Coordinator */}
          <View style={styles.headProfileCard}>
            <Image source={{ uri: selectedCoop.head_photo }} style={styles.headPhoto} />
            <View style={styles.headInfoCol}>
              <Text style={styles.headLabel}>
                {activeTab === 'institutional' ? 'INSTITUTIONAL LIAISON & WARD COORDINATOR' : (t('communityHeadLabel') || 'COMMUNITY HEAD / WARD COORDINATOR')}
              </Text>
              <Text style={styles.headName}>{selectedCoop.head_name}</Text>
              <Text style={styles.headDesignation}>{selectedCoop.head_designation}</Text>

              <View style={styles.fleetRow}>
                <Ionicons name="shield-checkmark" size={14} color={colors.successDark} />
                <Text style={styles.fleetText}>{selectedCoop.fleet_size}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.fleetText}>{selectedCoop.completed_bulk_contracts}+ {t('contractsDone') || 'Contracts Done'}</Text>
              </View>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.contactDetailsBox}>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={14} color={colors.primary} />
              <Text style={styles.contactText}>{selectedCoop.phone} (Official Liaison Desk)</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location" size={14} color={colors.textSecondary} />
              <Text style={styles.contactText} numberOfLines={1}>{selectedCoop.office_address}</Text>
            </View>
          </View>

          {/* Actions: Call Head & View Security Roster */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.callBtn} onPress={() => setCallModalVisible(true)} activeOpacity={0.85}>
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call Ward Officer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quoteBtn}
              onPress={() => setGatePassModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="id-card" size={16} color={colors.primary} />
              <Text style={styles.quoteBtnText}>Campus Gate Pass</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'institutional'
              ? (t('availableCampusServices') || 'Institutional & Campus Bulk Services')
              : (t('availableSocietyServices') || 'Available Society Bulk Services')}
          </Text>
          <Text style={styles.sectionSub}>
            {activeTab === 'institutional'
              ? 'Standardized cooperative quotes with multi-artisan deployment & statutory compliance'
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
          <View style={styles.modalCard}>
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

                {/* Scale Customizer */}
                {activeTab === 'institutional' ? (
                  <>
                    <Text style={styles.calcLabel}>1. Select Institution Category</Text>
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

                    <Text style={styles.calcLabel}>2. Select Campus Scale / Infrastructure Size</Text>
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
                  </>
                ) : (
                  <>
                    <Text style={styles.calcLabel}>1. Select Scale / Capacity</Text>
                    {selectedService?.id === 'bs1' ? (
                      <View style={styles.chipsRow}>
                        {['5,000 – 10,000 L', '15,000 – 25,000 Litres', '30,000 – 50,000 L'].map((cap) => (
                          <TouchableOpacity
                            key={cap}
                            style={[styles.calcChip, tankCapacity === cap && styles.calcChipActive]}
                            onPress={() => setTankCapacity(cap)}
                          >
                            <Text style={[styles.calcChipText, tankCapacity === cap && styles.calcChipTextActive]}>
                              {cap}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
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
                    )}
                  </>
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
                {(selectedCoop.artisan_squad_roster || []).map((artisan, index) => (
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
                      <Text style={styles.squadRole}>{artisan.role}</Text>
                      <Text style={styles.squadTrade}>Trade: {artisan.trade}</Text>
                      <View style={styles.policeRow}>
                        <Ionicons name="document-lock" size={12} color={colors.textSecondary} />
                        <Text style={styles.policeText}>{artisan.police_clearance_no}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
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
    gap: 6
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  tabButtonTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  heroTextCol: {
    flex: 1
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2
  },
  heroBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.5
  },
  ncctPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primaryLight
  },
  ncctPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  heroSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  trustPillBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14
  },
  trustPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4
  },
  trustPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary
  },
  coopCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 20
  },
  coopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  coopAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  coopName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  regNoText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  headProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12
  },
  headPhoto: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.border,
    marginRight: 12
  },
  headInfoCol: {
    flex: 1
  },
  headLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  headName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1
  },
  headDesignation: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  fleetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  fleetText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 3
  },
  dot: {
    marginHorizontal: 4,
    color: colors.textMuted
  },
  contactDetailsBox: {
    gap: 4,
    marginBottom: 14
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 12,
    borderRadius: 12
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 4
  },
  quoteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySubtle,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 12
  },
  quoteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 4
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
  servicesGrid: {
    gap: 12
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  serviceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center'
  },
  capacityBadge: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  capacityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary
  },
  serviceDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 4
  },
  statutoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4
  },
  statutoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successDark
  },
  serviceBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight
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
    borderRadius: 10
  },
  bookBulkBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    maxHeight: '92%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  modalSub: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2
  },
  calcLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 6
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  calcChip: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  calcChipActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: colors.primary
  },
  calcChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary
  },
  calcChipTextActive: {
    color: colors.primary,
    fontWeight: '800'
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
    marginTop: 6
  },
  doneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  gatePassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
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
    backgroundColor: colors.surfaceSecondary,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10
  },
  squadList: {
    gap: 10,
    marginBottom: 16
  },
  squadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  squadPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border
  },
  squadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  squadName: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  kycVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
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
    fontWeight: '700',
    color: colors.primary,
    marginTop: 1
  },
  squadTrade: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  policeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4
  },
  policeText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  printGatePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6
  },
  printGatePassBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  callRingCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  callingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  callingName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4
  },
  callingDesignation: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600'
  },
  callingNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8
  },
  callingSafetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 12
  },
  callingSafetyText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.successDark,
    marginLeft: 4
  },
  endCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 20
  },
  endCallText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  }
});

export default Screen18_CommunityScreen;
