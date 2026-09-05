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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useBooking } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import PaymentBreakdown from '../components/PaymentBreakdown';
import { getFallbackWorkerForTrade } from '../utils/locationService';

export const Screen13_PaymentSuccess = ({ navigation }) => {
  const { activeBooking, totalAmount, computeTotal } = useBooking();
  const { t } = useUser();
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  const fallbackWorker = getFallbackWorkerForTrade(activeBooking?.service);
  const amountPaid = computeTotal ? computeTotal(activeBooking) : (totalAmount || activeBooking?.total_amount || 500);
  const bookingId = activeBooking?.booking_id || 'BK84920';
  const serviceName = activeBooking?.service?.name || 'General Service';
  const workerName = activeBooking?.worker?.name || fallbackWorker?.name || 'Cooperative Artisan';
  const hasWarranty = activeBooking?.service?.has_seva_suraksha !== false;

  const baseRate = activeBooking?.worker_count > 1
    ? (activeBooking?.single_worker_base || (activeBooking?.base_amount - (activeBooking?.extra_worker_cost || 0)))
    : (activeBooking?.base_amount || activeBooking?.service?.start_price || 299);
  const workerCount = activeBooking?.worker_count || 1;
  const extraWorkerCost = activeBooking?.extra_worker_cost || ((workerCount - 1) * 199);
  const emergencySurge = Number(activeBooking?.emergency_surge || 0);
  const isExtraApproved = activeBooking?.extra_work && (activeBooking.extra_work.status === 'approved' || activeBooking.extra_work.approved);
  const extraWorkCost = isExtraApproved ? Number(activeBooking.extra_work.amount || 0) : 0;
  const partOrderCost = (activeBooking?.part_order && activeBooking.part_order.part_cost) ? Number(activeBooking.part_order.part_cost || 0) : 0;
  const isHelperApproved = activeBooking?.second_worker || activeBooking?.helper_request?.status === 'approved';
  const helperCost = isHelperApproved ? Number(activeBooking?.helper_request?.amount || activeBooking?.service?.helper_request?.amount || 200) : 0;
  const overtimeCharge = Number(activeBooking?.overtime_charge || 0);
  const cancellationPenalty = Number(activeBooking?.cancellation_penalty_fee || 0);
  const discountApplied = Number(activeBooking?.discount_applied || 0);

  const handleRateExperience = () => {
    navigation.navigate('RatingScreen');
  };

  const handleDownloadInvoicePdf = () => {
    if (Platform.OS === 'web') {
      try {
        const invoiceContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>UniServ Tax Invoice - ${bookingId}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1E293B; max-width: 720px; margin: 0 auto; }
              .header { border-bottom: 2px solid #1E3A8A; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
              .title { font-size: 24px; font-weight: 800; color: #1E3A8A; margin: 0; }
              .badge { background: #ECFDF5; color: #047857; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; border: 1px solid #A7F3D0; }
              .grid { margin: 20px 0; line-height: 1.8; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-size: 13px; }
              th { padding: 10px 8px; border-bottom: 2px solid #CBD5E1; color: #475569; text-align: left; }
              td { padding: 9px 8px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
              .total { font-size: 20px; font-weight: 900; color: #1E3A8A; border-top: 2px solid #1E3A8A; padding-top: 14px; margin-top: 14px; display: flex; justify-content: space-between; }
              .wage-banner { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-top: 20px; font-size: 12px; line-height: 1.6; }
              .footer { margin-top: 30px; font-size: 12px; color: #64748B; border-top: 1px dashed #CBD5E1; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">UniServ Cooperative Platform</h1>
                <p style="margin: 4px 0 0; color: #64748B;">Official Service & GST Tax Receipt</p>
              </div>
              <div>
                <span class="badge">PAID IN FULL</span>
              </div>
            </div>
            <div class="grid">
              <p><strong>Invoice Number:</strong> INV-${bookingId}-2026</p>
              <p><strong>Transaction Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Customer Name:</strong> Priya Sharma</p>
              <p><strong>Service Rendered:</strong> ${serviceName}</p>
              <p><strong>Lead Artisan:</strong> ${workerName}</p>
              <p><strong>Cooperative Society:</strong> Delhi Labour Cooperative Union</p>
              <p><strong>Payment Mode:</strong> ${activeBooking?.payment_method || 'Instant UPI'}</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Itemized Service / Work Description</th>
                  <th style="text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Base Service (${activeBooking?.trade_subtype || 'Standard Diagnostic & Repair'})</td>
                  <td style="text-align: right; font-weight: 600;">₹${baseRate}.00</td>
                </tr>
                ${workerCount > 1 ? `
                <tr>
                  <td>Additional Cooperative Artisans (+${workerCount - 1} workers, ${workerCount}x speed)</td>
                  <td style="text-align: right; font-weight: 600; color: #1E3A8A;">+₹${extraWorkerCost}.00</td>
                </tr>` : ''}
                ${emergencySurge > 0 ? `
                <tr>
                  <td>Emergency Priority Dispatch Surge (&lt;15 min)</td>
                  <td style="text-align: right; font-weight: 600; color: #DC2626;">+₹${emergencySurge}.00</td>
                </tr>` : ''}
                ${extraWorkCost > 0 ? `
                <tr>
                  <td>${activeBooking?.extra_work?.title || 'Approved Extra Work / Materials'}</td>
                  <td style="text-align: right; font-weight: 600; color: #1E3A8A;">+₹${extraWorkCost}.00</td>
                </tr>` : ''}
                ${partOrderCost > 0 ? `
                <tr>
                  <td>Procured Spare Part: ${activeBooking?.part_order?.part_name || 'Genuine Replacement Component'}</td>
                  <td style="text-align: right; font-weight: 600; color: #047857;">+₹${partOrderCost}.00</td>
                </tr>` : ''}
                ${helperCost > 0 ? `
                <tr>
                  <td>2nd Assistant Artisan (${activeBooking?.second_worker?.name || 'Helper'})</td>
                  <td style="text-align: right; font-weight: 600; color: #6D28D9;">+₹${helperCost}.00</td>
                </tr>` : ''}
                ${overtimeCharge > 0 ? `
                <tr>
                  <td>Extended Overtime Surcharge (&gt;2 Hours)</td>
                  <td style="text-align: right; font-weight: 600; color: #B45309;">+₹${overtimeCharge}.00</td>
                </tr>` : ''}
                ${cancellationPenalty > 0 ? `
                <tr>
                  <td>Previous Booking Cancellation Fee</td>
                  <td style="text-align: right; font-weight: 600; color: #DC2626;">+₹${cancellationPenalty}.00</td>
                </tr>` : ''}
                ${discountApplied > 0 ? `
                <tr>
                  <td>First-Time User Welcome Discount</td>
                  <td style="text-align: right; font-weight: 600; color: #047857;">-₹${discountApplied}.00</td>
                </tr>` : ''}
              </tbody>
            </table>

            <div class="total">
              <span>Total Amount Settled:</span>
              <span>₹${amountPaid}.00</span>
            </div>

            <div class="wage-banner">
              <strong>Transparent Cooperative 80/10/6/4 Split:</strong><br/>
              • 80% Direct Worker Wage: ₹${(amountPaid * 0.8).toFixed(0)}<br/>
              • 10% Artisan Welfare & Health Fund: ₹${(amountPaid * 0.1).toFixed(0)}<br/>
              • 6% Cooperative Society Operations: ₹${(amountPaid * 0.06).toFixed(0)}<br/>
              • 4% Platform & Seva Suraksha Pool: ₹${(amountPaid * 0.04).toFixed(0)}
            </div>

            <div class="footer">
              <p>Government Registered Cooperative Platform • 80% Direct Artisan Wage Guaranteed</p>
              ${hasWarranty ? '<p>🛡️ Active 7-Day Seva Suraksha Warranty Protection Included</p>' : ''}
            </div>
            <script>window.print();</script>
          </body>
          </html>
        `;
        const blob = new Blob([invoiceContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = `UniServ_Invoice_${bookingId}.html`;
          a.click();
        }
      } catch (err) {
        console.warn('PDF export fallback:', err);
      }
    }
    Alert.alert('Invoice Ready', `Official tax invoice PDF for ${bookingId} has been generated.`);
    setInvoiceModalVisible(false);
  };

  const isScheduledOrAdvance = activeBooking?.booking_type === 'scheduled' || !!activeBooking?.is_bulk_project || activeBooking?.scale_mode === 'bulk';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Checkmark Hero */}
        <View style={styles.successHero}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-done" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>
            {isScheduledOrAdvance ? (t('advancePaymentConfirmed') || 'Advance Payment Confirmed') : t('paymentSuccessful')}
          </Text>
          <Text style={styles.paidAmountText}>₹{amountPaid}</Text>
          <View style={styles.txnPill}>
            <Text style={styles.txnPillText}>
              {isScheduledOrAdvance ? `${t('escrowRef') || 'Escrow Ref'}: SBI-MSCS-${bookingId}` : `${t('txnRef') || 'Txn Ref'}: TXN-COOP-${bookingId}`}
            </Text>
          </View>
        </View>

        {/* Advance Payment Confirmation & Team Contact Assurance Banner */}
        {isScheduledOrAdvance && (
          <View style={styles.advanceContactCard}>
            <View style={styles.advanceContactHeader}>
              <View style={styles.advanceContactIconCircle}>
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.advanceContactTag}>{t('advanceMilestoneSecured') || 'ADVANCE MILESTONE ESCROW SECURED'}</Text>
                <Text style={styles.advanceContactTitle}>{t('teamContactTitle') || 'Our Team Will Contact You Before Arrival'}</Text>
              </View>
            </View>

            <Text style={styles.advanceContactDesc}>
              {t('advanceEscrowDesc') || `Your advance payment of ₹${amountPaid} is securely held in the Govt-monitored SBI MSCS Cooperative Escrow Trust Account. Our cooperative dispatch team and Lead Supervisor will call you 2 hours before the scheduled time on your registered mobile number.`}
            </Text>

            <View style={styles.contactDetailsBox}>
              <Text style={styles.contactDetailsLabel}>{t('schedulingDetailsAssistance') || 'FOR SCHEDULING DETAILS OR ASSISTANCE:'}</Text>
              <View style={styles.contactRow}>
                <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
                <Text style={styles.contactRowText}>
                  {t('contactPerson') || 'Contact Person'}: {workerName ? `${workerName} (${t('leadSupervisor') || 'Lead Supervisor'})` : (t('wardCoordinator') || 'District Ward Coordinator')}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color={colors.primary} />
                <Text style={styles.contactRowText}>
                  {t('helpline') || 'Helpline'}: +91 98765 43210 ({t('coopDispatchDesk') || 'Direct Co-op Federation Dispatch Desk'})
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <Text style={styles.contactRowText}>
                  {t('scheduledSlot') || 'Scheduled Slot'}: {activeBooking?.scheduled_date || (t('tomorrow') || 'Tomorrow')} • {activeBooking?.scheduled_time || '10:00 AM'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 7-Day Warranty ONLY if category is eligible for Seva Suraksha */}
        {hasWarranty ? (
          <View style={styles.warrantySummaryCard}>
            <View style={styles.warrantyHeaderRow}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <Text style={styles.warrantyTitle}>{t('warrantyActivated')}</Text>
            </View>
            <Text style={styles.warrantyDesc}>
              {t('sevaSurakshaDesc') || 'Your repair is fully protected under Seva Suraksha for 7 days. Free doorstep rework if any technical defect reoccurs.'}
            </Text>
          </View>
        ) : (
          <View style={[styles.warrantySummaryCard, { backgroundColor: colors.primarySubtle }]}>
            <View style={styles.warrantyHeaderRow}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={[styles.warrantyTitle, { color: colors.primary }]}>{t('coopServiceVerified') || 'Cooperative Service Delivery Verified'}</Text>
            </View>
            <Text style={[styles.warrantyDesc, { color: colors.primaryText }]}>
              {t('empoweringCoopDesc') || 'Service completed with standardized cooperative rates. Thank you for empowering local artisan cooperatives!'}
            </Text>
          </View>
        )}

        {/* The 80% Fair Wage Breakdown Card */}
        <View style={styles.breakdownWrap}>
          <PaymentBreakdown totalAmount={amountPaid} />
        </View>

        {/* Invoice Download Action */}
        <TouchableOpacity
          style={styles.invoiceBtn}
          onPress={() => setInvoiceModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <Text style={styles.invoiceBtnText}>{t('downloadInvoice')}</Text>
        </TouchableOpacity>

        {/* Rate Experience Button */}
        <TouchableOpacity
          style={styles.rateBtn}
          onPress={handleRateExperience}
          activeOpacity={0.85}
        >
          <Ionicons name="star" size={18} color="#FFFFFF" />
          <Text style={styles.rateBtnText}>{t('rateExperience')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Invoice Modal */}
      <Modal visible={invoiceModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <View>
                <Text style={styles.invoiceBrand}>UniServ Cooperative Platform</Text>
                <Text style={styles.invoiceSub}>{t('officialTaxInvoice') || 'Official Service Tax Invoice'}</Text>
              </View>
              <TouchableOpacity onPress={() => setInvoiceModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.invoiceBody}>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('invoiceNo') || 'Invoice No'}:</Text>
                <Text style={styles.invoiceVal}>INV-{bookingId}-2026</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('dateTime') || 'Date & Time'}:</Text>
                <Text style={styles.invoiceVal}>
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('serviceCategory') || 'Service Category'}:</Text>
                <Text style={styles.invoiceVal}>{serviceName}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('leadArtisan') || 'Lead Artisan'}:</Text>
                <Text style={styles.invoiceVal}>{workerName}</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('cooperativeSociety') || 'Cooperative Society'}:</Text>
                <Text style={styles.invoiceVal}>{t('delhiLabourCooperative') || 'Delhi Labour Cooperative Union'}</Text>
              </View>

              <View style={styles.invoiceDivider} />

              <Text style={styles.itemizedModalTitle}>{t('itemizedServiceCharges') || 'ITEMIZED SERVICE CHARGES'}</Text>

              {/* Base Rate */}
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceKey}>{t('baseDiagnostic') || 'Base Diagnostic / Rate'}:</Text>
                <Text style={styles.invoiceVal}>₹{baseRate}</Text>
              </View>

              {/* Additional Multi-Artisans */}
              {workerCount > 1 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: colors.primary }]}>+{workerCount - 1} {t('additionalCoopArtisans') || 'Extra Artisans'}:</Text>
                  <Text style={[styles.invoiceVal, { color: colors.primary }]}>+₹{extraWorkerCost}</Text>
                </View>
              )}

              {/* Emergency Surge */}
              {emergencySurge > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: colors.error }]}>{t('emergencySurgeFee') || 'Emergency Surge'}:</Text>
                  <Text style={[styles.invoiceVal, { color: colors.error }]}>+₹{emergencySurge}</Text>
                </View>
              )}

              {/* Approved Extra Work */}
              {extraWorkCost > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceKey} numberOfLines={1}>{activeBooking?.extra_work?.title || t('spares') || 'Extra Work / Spares'}:</Text>
                  <Text style={styles.invoiceVal}>+₹{extraWorkCost}</Text>
                </View>
              )}

              {/* Procured Spare Part */}
              {partOrderCost > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: colors.successDark }]} numberOfLines={1}>
                    {activeBooking?.part_order?.part_name || 'Procured Component'}:
                  </Text>
                  <Text style={[styles.invoiceVal, { color: colors.successDark }]}>+₹{partOrderCost}</Text>
                </View>
              )}

              {/* 2nd Assistant Artisan */}
              {helperCost > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceKey}>{t('secondAssistant') || '2nd Assistant Artisan'}:</Text>
                  <Text style={styles.invoiceVal}>+₹{helperCost}</Text>
                </View>
              )}

              {/* Overtime Surcharge */}
              {overtimeCharge > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: '#B45309' }]}>{t('overtimeCharge') || 'Overtime (>2 hrs)'}:</Text>
                  <Text style={[styles.invoiceVal, { color: '#B45309' }]}>+₹{overtimeCharge}</Text>
                </View>
              )}

              {/* Previous Cancellation Penalty */}
              {cancellationPenalty > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: colors.danger }]}>{t('previousCancellationPenalty') || 'Previous Cancel Fee'}:</Text>
                  <Text style={[styles.invoiceVal, { color: colors.danger }]}>+₹{cancellationPenalty}</Text>
                </View>
              )}

              {/* First-Time Discount */}
              {discountApplied > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceKey, { color: colors.successDark }]}>{t('firstTimeDiscount') || 'Welcome Discount'}:</Text>
                  <Text style={[styles.invoiceVal, { color: colors.successDark }]}>-₹{discountApplied}</Text>
                </View>
              )}

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceTotalKey}>{t('totalAmountSettled') || 'Total Amount Settled'}:</Text>
                <Text style={styles.invoiceTotalVal}>₹{amountPaid}.00</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.downloadPdfBtn}
              onPress={handleDownloadInvoicePdf}
            >
              <Ionicons name="download-outline" size={18} color="#FFFFFF" />
              <Text style={styles.downloadPdfText}>{t('downloadInvoice')}</Text>
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
    paddingTop: 24,
    paddingBottom: 40
  },
  successHero: {
    alignItems: 'center',
    marginBottom: 20
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary
  },
  paidAmountText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 4
  },
  txnPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  txnPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  warrantySummaryCard: {
    backgroundColor: colors.successLight,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16
  },
  warrantyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  warrantyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.successDark,
    marginLeft: 6
  },
  warrantyDesc: {
    fontSize: 11,
    color: colors.successDark,
    lineHeight: 16,
    marginTop: 2
  },
  breakdownWrap: {
    marginBottom: 16
  },
  invoiceBtn: {
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
  invoiceBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  rateBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  invoiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  invoiceBrand: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary
  },
  invoiceSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  invoiceBody: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16
  },
  itemizedModalTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 4,
    marginBottom: 6
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  invoiceKey: {
    fontSize: 12,
    color: colors.textSecondary
  },
  invoiceVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8
  },
  invoiceTotalKey: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  invoiceTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12
  },
  downloadPdfText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6
  },
  advanceContactCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.success,
    marginBottom: 16
  },
  advanceContactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  advanceContactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  advanceContactTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.successDark,
    letterSpacing: 0.5
  },
  advanceContactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary
  },
  advanceContactDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12
  },
  contactDetailsBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  contactDetailsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactRowText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1
  }
});

export default Screen13_PaymentSuccess;
