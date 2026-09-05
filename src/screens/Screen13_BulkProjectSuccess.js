import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import Header from '../components/Header';

export const Screen13_BulkProjectSuccess = ({ navigation }) => {
  const { activeBooking, completeBulkProject, archiveBulkBooking } = useBooking();
  const { t } = useUser();
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);

  const bookingId = activeBooking?.booking_id || 'BK84920';
  const scaleLabel = activeBooking?.scale_label || 'Full Property Bulk Project';
  const materialLabel = activeBooking?.material_label || 'Standard Cooperative Sourcing';
  const totalProjectCost = Number(activeBooking?.total_project_cost || 24000);
  const advanceAmount = Number(activeBooking?.advance_amount || activeBooking?.base_amount || Math.round(totalProjectCost * 0.4));
  const midMilestone = Number(activeBooking?.mid_milestone || Math.round(totalProjectCost * 0.35));
  const finalMilestone = Number(activeBooking?.final_milestone || (totalProjectCost - advanceAmount - midMilestone));
  const crewSize = activeBooking?.crew_size || 4;
  const estimatedDays = activeBooking?.estimated_days || 2;
  const supervisorName = activeBooking?.worker?.name || 'Manoj Verma (Master Contractor)';
  const scheduledDate = activeBooking?.scheduled_date || 'Tomorrow';
  const scheduledTime = activeBooking?.scheduled_time || '10:00 AM - 12:00 PM';
  const serviceName = activeBooking?.service?.name || 'Home Service';

  const paidAmount = Number(
    activeBooking?.paid_amount || (activeBooking?.payment_status === 'full_paid' ? totalProjectCost : advanceAmount)
  );
  const remainingAmount = Number(
    activeBooking?.remaining_amount !== undefined
      ? activeBooking.remaining_amount
      : (activeBooking?.payment_status === 'full_paid' ? 0 : Math.max(0, totalProjectCost - paidAmount))
  );
  const isFullyPaid = remainingAmount <= 0 || activeBooking?.payment_status === 'full_paid';
  const isAdvancePaid = activeBooking?.milestone1_paid || activeBooking?.payment_status === 'advance_paid' || paidAmount > 0;
  const isMidPaid = activeBooking?.milestone2_paid || isFullyPaid;
  const isFinalPaid = activeBooking?.milestone3_paid || isFullyPaid;

  const isInstitutional = activeBooking?.client_type === 'institutional' || !!activeBooking?.institution_name;
  const institutionTitle = activeBooking?.institution_name || scaleLabel;
  const departmentTitle = activeBooking?.department_office || 'Campus Maintenance & Estate Wing';
  const officerTitle = activeBooking?.officer_name || 'Dr. R.K. Nair (Estate Officer)';
  const complianceTitle = typeof activeBooking?.statutory_compliance === 'object'
    ? (activeBooking?.statutory_compliance?.code || 'AICTE / UGC / MSCS Certified')
    : (activeBooking?.statutory_compliance || 'AICTE / UGC / MSCS Certified');
  const gstinNumber = activeBooking?.gstin || '07AAAAA0000A1Z5';

  const handleDownloadContractPdf = () => {
    if (Platform.OS === 'web') {
      try {
        const contractHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>UniServ ${isInstitutional ? 'Institutional Infrastructure Agreement' : 'Cooperative Project Agreement'} - ${bookingId}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1E293B; }
              .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .title { font-size: 24px; font-weight: 800; color: #1E3A8A; margin: 0; }
              .badge { background: #ECFDF5; color: #047857; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #059669; }
              .grid { margin: 20px 0; line-height: 1.8; }
              .milestones { background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; padding: 16px; margin: 20px 0; }
              .milestone-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #E2E8F0; }
              .milestone-item:last-child { border-bottom: none; }
              .total { font-size: 20px; font-weight: 900; color: #1E3A8A; border-top: 2px solid #1E3A8A; padding-top: 14px; margin-top: 14px; }
              .footer { margin-top: 40px; font-size: 12px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 14px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">Ministry of Cooperation • NCCT Affiliated</h1>
                <h2 style="font-size: 18px; color: #475569; margin: 4px 0 0;">
                  ${isInstitutional ? 'Institutional Campus Infrastructure Milestone Escrow Agreement' : 'Multi-Artisan Project Milestone Escrow Agreement'}
                </h2>
                <p style="margin: 4px 0 0; color: #64748B;">Contract Ref: COOP-PROJ-${bookingId}-2026</p>
              </div>
              <div>
                <span class="badge">MILESTONE 1 ADVANCE DEPOSITED</span>
              </div>
            </div>

            <div class="grid">
              ${isInstitutional ? `
                <p><strong>Authorized Entity / Institution:</strong> ${institutionTitle}</p>
                <p><strong>Department / Maintenance Cell:</strong> ${departmentTitle}</p>
                <p><strong>Authorized Signatory Officer:</strong> ${officerTitle}</p>
                <p><strong>Institutional GSTIN / Tax ID:</strong> ${gstinNumber}</p>
                <p><strong>Statutory Compliance Standard:</strong> ${complianceTitle}</p>
                <p><strong>Service SAC Classification:</strong> 9987 / 9985 (Cooperative Labour & Facility Services)</p>
              ` : `
                <p><strong>Customer Name:</strong> Priya Sharma</p>
                <p><strong>Project Classification:</strong> ${scaleLabel} (${materialLabel})</p>
              `}
              <p><strong>Primary Service:</strong> ${serviceName} Cooperative Federation</p>
              <p><strong>Assigned Master Contractor:</strong> ${supervisorName}</p>
              <p><strong>Allocated Artisan Squad:</strong> ${crewSize} Certified Master Artisans (${estimatedDays} Days Deployment)</p>
              <p><strong>Scheduled Target Window:</strong> ${scheduledDate} • ${scheduledTime}</p>
              <p><strong>Escrow Trust Account:</strong> SBI Multi-State Cooperative Escrow Trust (SBI-MSCS-8839)</p>
              ${activeBooking?.trade_name ? `<p><strong>Specialized Trade Discipline:</strong> ${activeBooking.trade_name}</p>` : ''}
              ${activeBooking?.deliverables?.length > 0 ? `
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin: 12px 0;">
                  <strong style="color: #1E3A8A;">Itemized Scope Deliverables:</strong>
                  <ul style="margin: 6px 0; padding-left: 20px; font-size: 12px;">
                    ${activeBooking.deliverables.map(d => `<li>✓ ${d}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${activeBooking?.machinery_roster?.length > 0 ? `
                <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin: 12px 0;">
                  <strong style="color: #1E3A8A;">Certified Equipment & Machinery Deployed:</strong>
                  <ul style="margin: 6px 0; padding-left: 20px; font-size: 12px;">
                    ${activeBooking.machinery_roster.map(m => `<li><strong>${m.name}</strong>: ${m.spec} (${m.safety_grade})</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>

            <div class="milestones">
              <h3 style="margin-top: 0; color: #1E3A8A;">3-Stage Escrow Milestone Schedule</h3>
              <div class="milestone-item">
                <span><strong>Milestone 1 (Advance & Wholesale Material Reserve - 40%):</strong></span>
                <span style="color: #047857; font-weight: bold;">₹${advanceAmount.toLocaleString()}.00 (${isAdvancePaid ? 'DEPOSITED & SECURED' : 'PENDING'})</span>
              </div>
              <div class="milestone-item">
                <span><strong>Milestone 2 (Mid-Stage Rough Work & Quality Audit - 35%):</strong></span>
                <span style="${isMidPaid ? 'color: #047857; font-weight: bold;' : ''}">₹${midMilestone.toLocaleString()}.00 (${isMidPaid ? 'DEPOSITED & SECURED' : 'Due on Physical Audit'})</span>
              </div>
              <div class="milestone-item">
                <span><strong>Milestone 3 (Final Sign-off & 30-Day Warranty - 25%):</strong></span>
                <span style="${isFinalPaid ? 'color: #047857; font-weight: bold;' : ''}">₹${finalMilestone.toLocaleString()}.00 (${isFinalPaid ? 'DEPOSITED & SECURED' : 'Due on Customer OTP Handshake'})</span>
              </div>
            </div>

            <div class="total">
              <div>Total Contract Project Value: ₹${totalProjectCost.toLocaleString()}.00</div>
              <div style="font-size: 14px; margin-top: 6px; color: ${isFullyPaid ? '#047857' : '#D97706'}; font-weight: 700;">
                ${isFullyPaid ? '✓ 100% Escrow Funded & Deposited' : `Deposited to Date: ₹${paidAmount.toLocaleString()}.00 • Outstanding Balance: ₹${remainingAmount.toLocaleString()}.00`}
              </div>
            </div>

            <div class="footer">
              <p>100% Transparent Cooperative Labor Platform • 80% Direct Artisan Wage Allocation • Central MSCS Trust Protected</p>
              <p>🛡️ Active 30-Day Seva Suraksha Workmanship & Statutory Defect Warranty</p>
            </div>
            <script>window.print();</script>
          </body>
          </html>
        `;
        const blob = new Blob([contractHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = `UniServ_Project_Contract_${bookingId}.html`;
          a.click();
        }
      } catch (err) {
        console.warn('PDF export fallback:', err);
      }
    }
    Alert.alert('Contract Downloaded', `Official cooperative escrow project agreement for ${bookingId} is ready.`);
  };

  const handleDownloadGatePassPdf = () => {
    const squad = activeBooking?.artisan_squad?.length > 0
      ? activeBooking.artisan_squad
      : [
          {
            name: "Manoj Kumar Verma",
            role: "Master Contractor & Lead Electrical Supervisor",
            trade: "Industrial Electrical & Substation Audits",
            kyc_id: "AADHAAR-XXXX-XXXX-9481",
            police_clearance_no: "DL-POLICE-VERIF-2026-88419"
          },
          {
            name: "Ramesh Chandra",
            role: "Master Plumber & Pipeline Engineer",
            trade: "Mega Reservoir & Commercial Hydraulics",
            kyc_id: "AADHAAR-XXXX-XXXX-3829",
            police_clearance_no: "DL-POLICE-VERIF-2026-55120"
          },
          {
            name: "Mohammad Arif",
            role: "Chief Furniture & Structural Carpenter",
            trade: "Lecture Hall & Hostel Woodwork",
            kyc_id: "AADHAAR-XXXX-XXXX-7164",
            police_clearance_no: "DL-POLICE-VERIF-2026-99321"
          },
          {
            name: "Sunita Devi",
            role: "Sanitation Guild Supervisor",
            trade: "Hostel & Industrial Kitchen Hygiene",
            kyc_id: "AADHAAR-XXXX-XXXX-4412",
            police_clearance_no: "DL-POLICE-VERIF-2026-22481"
          }
        ];

    if (Platform.OS === 'web') {
      try {
        const rosterRows = squad.map((art, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${art.name}</strong><br><span style="font-size: 11px; color: #64748B;">${art.role}</span></td>
            <td>${art.trade}</td>
            <td><code>${art.kyc_id}</code></td>
            <td><span style="color: #047857; font-weight: bold;">${art.police_clearance_no}</span></td>
            <td><span style="background: #ECFDF5; color: #047857; padding: 2px 6px; border-radius: 4px; font-size: 11px;">VERIFIED</span></td>
          </tr>
        `).join('');

        const gatePassHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>UniServ Campus Security Entry Gate Pass - ${institutionTitle}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1E293B; }
              .header { border-bottom: 3px solid #1E3A8A; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .title { font-size: 22px; font-weight: 800; color: #1E3A8A; margin: 0; }
              .badge { background: #FEF3C7; color: #B45309; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #D97706; }
              .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .table th, .table td { border: 1px solid #E2E8F0; padding: 8px 10px; text-align: left; font-size: 12px; }
              .table th { background: #F8FAFC; color: #1E3A8A; font-weight: 700; }
              .footer { margin-top: 30px; font-size: 11px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">CAMPUS SECURITY ENTRY GATE PASS</h1>
                <p style="margin: 4px 0 0; color: #475569;"><strong>Authorized Institution:</strong> ${institutionTitle}</p>
                <p style="margin: 2px 0 0; color: #64748B;">Contract Ref: COOP-PROJ-${bookingId} • Gate Pass ID: GP-${Math.floor(10000 + Math.random() * 90000)}</p>
                <p style="margin: 2px 0 0; color: #64748B;">Target Deployment Window: ${scheduledDate} • ${scheduledTime}</p>
              </div>
              <div>
                <span class="badge">POLICE VERIFIED SQUAD</span>
              </div>
            </div>

            <p style="font-size: 12px; color: #334155;">
              <strong>Campus Security Check-post Protocol:</strong> The following certified cooperative personnel have completed biometric Aadhaar KYC and verified local police clearance. They are authorized to enter with tools, test equipment, and raw materials for the designated contract.
            </p>

            <table class="table">
              <tr>
                <th>#</th>
                <th>Artisan Name & Role</th>
                <th>Trade Designation</th>
                <th>Government KYC ID Token</th>
                <th>Police Clearance Certificate No.</th>
                <th>Status</th>
              </tr>
              ${rosterRows}
            </table>

            ${activeBooking?.machinery_roster?.length > 0 ? `
              <h3 style="font-size: 14px; color: #1E3A8A; margin-top: 18px;">Authorized Heavy Machinery & Specialized Equipment</h3>
              <table class="table">
                <tr>
                  <th>#</th>
                  <th>Equipment / Tool Name</th>
                  <th>Engineering Specification</th>
                  <th>Safety Rating</th>
                  <th>Gate Status</th>
                </tr>
                ${activeBooking.machinery_roster.map((m, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.spec}</td>
                    <td>${m.safety_grade}</td>
                    <td><span style="color: #047857; font-weight: bold;">PERMITTED</span></td>
                  </tr>
                `).join('')}
              </table>
            ` : ''}

            <div class="footer">
              <p>Certified by: <strong>Master Contractor ${supervisorName}</strong> & District Ward Coordinator</p>
              <p>National Cooperative Security Helpdesk: <strong>1800-202-COOP</strong> (Toll Free)</p>
            </div>
            <script>window.print();</script>
          </body>
          </html>
        `;
        const blob = new Blob([gatePassHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      } catch (err) {
        console.warn('Gate pass export error:', err);
      }
    }
    Alert.alert('Security Gate Pass Generated', `Official police-verified artisan gate pass for ${institutionTitle} is ready for campus main gate security.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={t('projectEscrowConfirmed') || 'Project Escrow Confirmed'}
        showBack
        onBack={() => navigation.navigate('Home')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Hero Header */}
        <View style={styles.successHero}>
          <View style={styles.successIconCircle}>
            <Ionicons name="shield-checkmark" size={42} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>{t('projectAdvanceDeposited') || 'Project Advance Escrow Deposited'}</Text>
          <Text style={styles.paidAmountText}>₹{advanceAmount.toLocaleString()}</Text>
          <View style={styles.escrowStatusPill}>
            <Ionicons name="lock-closed" size={12} color={colors.successDark} />
            <Text style={styles.escrowStatusPillText}>{t('heldInGovtEscrow') || 'Held in Govt SBI MSCS Escrow Account'}</Text>
          </View>
          <Text style={styles.bookingRefText}>{t('contractId') || 'Contract ID'}: COOP-PROJ-{bookingId}</Text>
        </View>

        {/* Pre-Arrival Team Contact Promise Card */}
        <View style={styles.teamPromiseCard}>
          <View style={styles.teamPromiseHeader}>
            <View style={styles.teamPromiseIconCircle}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.teamPromiseTag}>{t('coopPreArrivalGuarantee') || 'COOPERATIVE PRE-ARRIVAL GUARANTEE'}</Text>
              <Text style={styles.teamPromiseTitle}>{t('teamContactTitle') || 'Our Team Will Contact You Before Arrival'}</Text>
            </View>
          </View>

          <Text style={styles.teamPromiseDesc}>
            {t('leadSupervisorDesc') || `Our Lead Supervisor (${supervisorName}) and District Ward Coordinator will call you 2 hours before the scheduled time on your registered mobile number to coordinate site access, gate entry permits, and material depot unloading.`}
          </Text>

          <View style={styles.supervisorDetailBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&q=80' }}
              style={styles.supervisorPhoto}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.supervisorName}>{supervisorName}</Text>
              <Text style={styles.supervisorRole}>{t('assignedMasterContractor') || 'Assigned Master Contractor'} • {crewSize} {t('artisansSquad') || 'Artisans Squad'}</Text>
              <Text style={styles.supervisorContact}>{t('helpline') || 'Helpline'}: +91 98765 43210</Text>
            </View>
          </View>

          <View style={styles.supervisorActionRow}>
            <TouchableOpacity
              style={styles.callSupervisorBtn}
              onPress={() => setCallModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={15} color="#FFFFFF" />
              <Text style={styles.callSupervisorBtnText}>{t('callProjectLead') || 'Call Project Lead'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatSupervisorBtn}
              onPress={() => setChatModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses" size={15} color={colors.primary} />
              <Text style={styles.chatSupervisorBtnText}>{t('chatWithTeam') || 'Chat with Team'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirmed Project Overview Card */}
        <View style={styles.projectOverviewCard}>
          <Text style={styles.sectionHeaderTitle}>{t('projectSpecsDispatch') || 'PROJECT SPECIFICATIONS & DISPATCH'}</Text>

          <View style={styles.specGrid}>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{isInstitutional ? 'Institution' : (t('projectScope') || 'Project Scope')}:</Text>
              <Text style={styles.specVal}>{isInstitutional ? institutionTitle : scaleLabel}</Text>
            </View>
            {isInstitutional && (
              <>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Department / Wing:</Text>
                  <Text style={styles.specVal}>{departmentTitle}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Sign-off Officer:</Text>
                  <Text style={styles.specVal}>{officerTitle}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specKey}>Statutory Standard:</Text>
                  <Text style={[styles.specVal, { color: colors.successDark }]}>{complianceTitle}</Text>
                </View>
              </>
            )}
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{t('sourcingOption') || 'Sourcing Option'}:</Text>
              <Text style={styles.specVal}>{materialLabel}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{t('scheduledSlot') || 'Scheduled Slot'}:</Text>
              <Text style={[styles.specVal, { color: colors.primary }]}>{scheduledDate} • {scheduledTime}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{t('artisanSquad') || 'Artisan Squad'}:</Text>
              <Text style={styles.specVal}>{crewSize} {t('masterArtisans') || 'Master Artisans'} ({estimatedDays} {t('daysTour') || 'Days Tour'})</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{t('materialSourcing') || 'Material Sourcing'}:</Text>
              <Text style={[styles.specVal, { color: colors.successDark }]}>{t('wholesaleDepotReserved') || 'Wholesale Depot Stock Reserved'} 📦</Text>
            </View>
            {activeBooking?.trade_name && (
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Trade Discipline:</Text>
                <Text style={[styles.specVal, { color: colors.primary, fontWeight: '800' }]}>{activeBooking.trade_name}</Text>
              </View>
            )}
            {activeBooking?.deliverables?.length > 0 && (
              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 4 }}>
                  Itemized Work Deliverables ({activeBooking.deliverables.length}):
                </Text>
                {activeBooking.deliverables.slice(0, 4).map((d, i) => (
                  <Text key={i} style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>
                    ✓ {d}
                  </Text>
                ))}
              </View>
            )}
            {activeBooking?.machinery_roster?.length > 0 && (
              <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 4 }}>
                  Specialized Heavy Machinery Deployed:
                </Text>
                {activeBooking.machinery_roster.slice(0, 3).map((m, i) => (
                  <Text key={i} style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 2 }}>
                    ⚙️ {m.name} ({m.safety_grade})
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 3-Stage Milestone Escrow Tracker Card */}
        <View style={styles.escrowTrackerCard}>
          <View style={styles.escrowTrackerHeader}>
            <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
            <Text style={styles.escrowTrackerTitle}>{t('milestoneTrackerTitle') || '3-STAGE ESCROW MILESTONE TRACKER'}</Text>
          </View>

          <View style={styles.milestoneList}>
            {/* Stage 1 */}
            <View style={styles.milestoneItem}>
              <View style={[styles.milestoneIconCircle, { backgroundColor: colors.successDark }]}>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
              <View style={styles.milestoneTextBox}>
                <View style={styles.milestoneTopRow}>
                  <Text style={styles.milestoneTitle}>{t('milestone1Title') || 'Milestone 1: Advance & Sourcing'}</Text>
                  <Text style={[styles.milestoneAmount, { color: colors.successDark }]}>
                    ₹{advanceAmount.toLocaleString()} ({t('deposited') || 'Deposited ✓'})
                  </Text>
                </View>
                <Text style={styles.milestoneSub}>
                  {t('milestone1Unlocked') || `Wholesale raw material reserve unlocked & ${crewSize} artisans blocked.`}
                </Text>
              </View>
            </View>

            {/* Stage 2 */}
            <View style={styles.milestoneItem}>
              <View style={[styles.milestoneIconCircle, { backgroundColor: isMidPaid ? colors.successDark : '#F59E0B' }]}>
                {isMidPaid ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.milestoneNumText}>2</Text>
                )}
              </View>
              <View style={styles.milestoneTextBox}>
                <View style={styles.milestoneTopRow}>
                  <Text style={styles.milestoneTitle}>{t('milestone2Title') || 'Milestone 2: Mid-Stage Quality Audit'}</Text>
                  <Text style={[styles.milestoneAmount, isMidPaid && { color: colors.successDark }]}>
                    ₹{midMilestone.toLocaleString()} {isMidPaid ? '(Deposited ✓)' : ''}
                  </Text>
                </View>
                <Text style={styles.milestoneSub}>
                  {isMidPaid
                    ? 'Funded in SBI Escrow. Released automatically upon physical progress check.'
                    : (t('milestone2Scheduled') || 'Scheduled for release after physical mid-way audit by Ward Coordinator.')}
                </Text>
              </View>
            </View>

            {/* Stage 3 */}
            <View style={styles.milestoneItem}>
              <View style={[styles.milestoneIconCircle, { backgroundColor: isFinalPaid ? colors.successDark : colors.textMuted }]}>
                {isFinalPaid ? (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                ) : (
                  <Text style={styles.milestoneNumText}>3</Text>
                )}
              </View>
              <View style={styles.milestoneTextBox}>
                <View style={styles.milestoneTopRow}>
                  <Text style={styles.milestoneTitle}>{t('milestone3Title') || 'Milestone 3: Final Sign-off & Handover'}</Text>
                  <Text style={[styles.milestoneAmount, isFinalPaid && { color: colors.successDark }]}>
                    ₹{finalMilestone.toLocaleString()} {isFinalPaid ? '(Deposited ✓)' : ''}
                  </Text>
                </View>
                <Text style={styles.milestoneSub}>
                  {isFinalPaid
                    ? 'Funded in SBI Escrow. Released upon customer completion sign-off.'
                    : (t('milestone3Released') || 'Released only upon customer completion OTP & 7-day warranty activation.')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Remaining Balance or Handover Action Card */}
        {!isFullyPaid && remainingAmount > 0 ? (
          <View style={{ backgroundColor: '#FEF3C7', padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: '#D97706', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="card" size={20} color="#D97706" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#92400E', marginLeft: 8 }}>
                OUTSTANDING ESCROW BALANCE: ₹{remainingAmount.toLocaleString()}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#78350F', marginTop: 4, lineHeight: 18 }}>
              Milestone 1 Advance (₹{paidAmount.toLocaleString()}) has been funded in SBI Escrow. You can deposit the remaining balance to allow seamless milestone audit disbursements.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={{ flex: 1.2, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                onPress={() => navigation.navigate('BulkPayment')}
                activeOpacity={0.85}
              >
                <Ionicons name="lock-closed" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>
                  Pay Balance (₹{remainingAmount.toLocaleString()})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 0.8, backgroundColor: colors.successDark, paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                onPress={() => {
                  if (typeof completeBulkProject === 'function') completeBulkProject();
                  navigation.navigate('Rating', { booking: activeBooking });
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="star" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>Rate Squad</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: '#ECFDF5', padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: colors.successDark, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={22} color={colors.successDark} />
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.successDark, marginLeft: 8 }}>
                100% ESCROW FUNDED & SECURED
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: colors.textPrimary, marginTop: 4, lineHeight: 18 }}>
              Total project sum of ₹{totalProjectCost.toLocaleString()} is safely locked in the Central SBI MSCS Escrow Trust. Once satisfied with the service, sign-off to complete handover and rate the artisan squad.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: colors.successDark, paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}
              onPress={() => {
                if (typeof completeBulkProject === 'function') completeBulkProject();
                navigation.navigate('Rating', { booking: activeBooking });
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="star" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>
                Complete Handover & Rate Artisans
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.downloadPdfBtn}
          onPress={handleDownloadContractPdf}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text" size={18} color={colors.primary} />
          <Text style={styles.downloadPdfBtnText}>{t('downloadProjectAgreement') || 'Download Project Escrow Agreement (PDF)'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadGatePassBtn}
          onPress={handleDownloadGatePassPdf}
          activeOpacity={0.8}
        >
          <Ionicons name="id-card" size={18} color="#FFFFFF" />
          <Text style={styles.downloadGatePassBtnText}>Download Campus Security Gate Pass (PDF)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Ionicons name="home" size={18} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>{t('returnToHomeHub') || 'Return to Home Hub'}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {/* Close & Archive Project Button (Cleans active booking and avoids loops) */}
        <TouchableOpacity
          style={[styles.homeBtn, { backgroundColor: '#475569', marginTop: 10 }]}
          onPress={() => {
            if (typeof archiveBulkBooking === 'function') {
              archiveBulkBooking(5, 'Project completed and archived');
            }
            navigation.navigate('Home');
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
          <Text style={styles.homeBtnText}>Close & Archive Project</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Masked Call Dialog Modal */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.callRingCircle}>
              <Ionicons name="call" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.callingTitle}>{t('callingProjectSupervisor') || 'Calling Project Supervisor'}</Text>
            <Text style={styles.callingName}>{supervisorName}</Text>
            <Text style={styles.callingSub}>{serviceName} Cooperative Federation • +91 98765 43210</Text>

            <TouchableOpacity
              style={styles.endCallBtn}
              onPress={() => setCallModalVisible(false)}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
              <Text style={styles.endCallText}>{t('endCall') || 'End Call'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Simulated Chat Modal */}
      <Modal visible={chatModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>{(t('chatWithWorker') || 'Chat with')} {supervisorName}</Text>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.chatBubble}>
              <Text style={styles.chatMessage}>
                "Namaste! Your project advance has been received in SBI Escrow. Our squad and material van are scheduled to arrive at your site on {scheduledDate} at {scheduledTime}."
              </Text>
              <Text style={styles.chatTime}>{t('justNow') || 'Just now'}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatReplyBtn}
              onPress={() => {
                Alert.alert(t('messageSent') || 'Message Sent', t('messageSentDesc') || 'Your query has been dispatched to the Lead Supervisor.');
                setChatModalVisible(false);
              }}
            >
              <Text style={styles.chatReplyText}>{t('chatReplyPrompt') || 'Quick Reply: "Please call 2 hours prior to arrival."'}</Text>
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
  successHero: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.success,
    marginBottom: 14,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center'
  },
  paidAmountText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    marginVertical: 4
  },
  escrowStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6
  },
  escrowStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successDark,
    marginLeft: 6
  },
  bookingRefText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  teamPromiseCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.success,
    marginBottom: 14
  },
  teamPromiseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  teamPromiseIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamPromiseTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successDark,
    letterSpacing: 0.5
  },
  teamPromiseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  teamPromiseDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12
  },
  supervisorDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  supervisorPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  supervisorName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  supervisorRole: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  supervisorContact: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2
  },
  supervisorActionRow: {
    flexDirection: 'row',
    gap: 10
  },
  callSupervisorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDark,
    paddingVertical: 11,
    borderRadius: 12
  },
  callSupervisorBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  chatSupervisorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 11,
    borderRadius: 12
  },
  chatSupervisorBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 6
  },
  projectOverviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 12
  },
  specGrid: {
    gap: 8
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  specKey: {
    fontSize: 11,
    color: colors.textSecondary
  },
  specVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  escrowTrackerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 14
  },
  escrowTrackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  escrowTrackerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginLeft: 6
  },
  milestoneList: {
    gap: 12
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  milestoneIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 10
  },
  milestoneNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  milestoneTextBox: {
    flex: 1
  },
  milestoneTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  milestoneTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  milestoneAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary
  },
  milestoneSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginBottom: 12
  },
  downloadPdfBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 8
  },
  downloadGatePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDark,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: colors.successDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  downloadGatePassBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  homeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center'
  },
  callRingCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  callingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  callingName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4
  },
  callingSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 18
  },
  endCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14
  },
  endCallText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary
  },
  chatBubble: {
    backgroundColor: colors.surfaceSecondary,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    width: '100%'
  },
  chatMessage: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 17
  },
  chatTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'right'
  },
  chatReplyBtn: {
    backgroundColor: colors.primarySubtle,
    padding: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  chatReplyText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  }
});

export default Screen13_BulkProjectSuccess;
