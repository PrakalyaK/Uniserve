import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import workersData from '../data/workers.json';
import servicesData from '../data/services.json';
import cooperativesData from '../data/cooperatives.json';
import { getWorkersForTrade, getFallbackWorkerForTrade } from '../utils/locationService';

const BookingContext = createContext();

export const BOOKING_STATUSES = [
  'Booking Confirmed',
  'Worker Assigned',
  'Worker is on the way',
  'Worker Arrived',
  'Work Started',
  'Work Completed'
];

const INITIAL_PAST_BOOKINGS = [
  {
    booking_id: 'BK92841',
    service: { id: 's2', name: 'Electrician', icon: '⚡' },
    worker: workersData.find(w => w.id === 'w3') || workersData[0],
    date: '24 Aug 2026',
    status: 'Work Completed',
    total_amount: 349,
    payment_method: 'UPI',
    rating: 5
  }
];

export const BookingProvider = ({ children }) => {
  const [activeBooking, setActiveBookingState] = useState(null);
  const [pastBookings, setPastBookingsState] = useState(INITIAL_PAST_BOOKINGS);
  const [communityRequests, setCommunityRequestsState] = useState([]);
  const [pendingCancellationFee, setPendingCancellationFeeState] = useState(0);

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
  const generateBookingId = () => 'BK' + Math.floor(10000 + Math.random() * 90000).toString();

  // Load persisted bookings on launch
  useEffect(() => {
    const loadStoredBookings = async () => {
      try {
        const storedActive = await AsyncStorage.getItem('@uniserv_active_booking');
        if (storedActive) {
          setActiveBookingState(JSON.parse(storedActive));
        }
        const storedPast = await AsyncStorage.getItem('@uniserv_past_bookings');
        if (storedPast) {
          setPastBookingsState(JSON.parse(storedPast));
        }
        const storedComm = await AsyncStorage.getItem('@uniserv_community_requests');
        if (storedComm) {
          setCommunityRequestsState(JSON.parse(storedComm));
        }
        const storedCancelFee = await AsyncStorage.getItem('@uniserv_pending_cancellation_fee');
        if (storedCancelFee) {
          setPendingCancellationFeeState(Number(storedCancelFee) || 0);
        }
      } catch (e) {
        console.warn('Error loading stored bookings:', e);
      }
    };
    loadStoredBookings();
  }, []);

  const setPendingCancellationFee = (fee) => {
    const num = Number(fee) || 0;
    setPendingCancellationFeeState(num);
    if (num > 0) {
      AsyncStorage.setItem('@uniserv_pending_cancellation_fee', String(num)).catch((e) =>
        console.warn('Error saving cancellation fee:', e)
      );
    } else {
      AsyncStorage.removeItem('@uniserv_pending_cancellation_fee').catch((e) =>
        console.warn('Error clearing cancellation fee:', e)
      );
    }
  };

  // Helper to persist active booking state
  const setActiveBooking = (updater) => {
    setActiveBookingState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      if (updated) {
        AsyncStorage.setItem('@uniserv_active_booking', JSON.stringify(updated)).catch((e) =>
          console.warn('Error saving active booking:', e)
        );
      } else {
        AsyncStorage.removeItem('@uniserv_active_booking').catch((e) =>
          console.warn('Error clearing active booking:', e)
        );
      }
      return updated;
    });
  };

  const setPastBookings = (updater) => {
    setPastBookingsState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      AsyncStorage.setItem('@uniserv_past_bookings', JSON.stringify(updated)).catch((e) =>
        console.warn('Error saving past bookings:', e)
      );
      return updated;
    });
  };

  const setCommunityRequests = (updater) => {
    setCommunityRequestsState((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      AsyncStorage.setItem('@uniserv_community_requests', JSON.stringify(updated)).catch((e) =>
        console.warn('Error saving community requests:', e)
      );
      return updated;
    });
  };

  // Check if first-time user
  const isFirstTimeUser = pastBookings.length === 0 || !pastBookings.some(b => b.status === 'Work Completed');
  const FIRST_TIME_DISCOUNT = 50; // ₹50 Welcome Discount

  // Helper to accurately compute total from all line items (Including distance & overtime rules)
  const computeTotal = (booking) => {
    if (!booking) return 350;
    const base = Number(booking.base_amount || booking.service?.start_price || 299);
    const surge = Number(booking.emergency_surge || 0);
    const distKm = Number(booking.distance_km ?? booking.worker?.distance_km ?? 0);
    // Cooperative Fair-Wage Distance Rule: <= 7 km is free/base included; > 7 km charges ₹7 per additional km
    const distanceCharge = distKm > 7 ? Math.round((distKm - 7) * 7) : 0;
    const extra = (booking.extra_work && booking.extra_work.approved) ? Number(booking.extra_work.amount || 0) : 0;
    const helper = (booking.second_worker && (booking.helper_request?.status === 'approved' || booking.second_worker))
      ? Number(booking.helper_request?.amount || booking.service?.helper_request?.amount || 200)
      : 0;
    const partCost = (booking.part_order && booking.part_order.part_cost) ? Number(booking.part_order.part_cost || 0) : 0;
    const overtime = Number(booking.overtime_charge || 0);
    const cancelPenalty = Number(booking.cancellation_penalty_fee || 0);
    const discount = Number(booking.discount_applied || 0);
    return Math.max(base + surge + distanceCharge + extra + helper + partCost + overtime + cancelPenalty - discount, 49);
  };

  // 1. Initialize Booking with Emergency Surge & First-Time Discount
  const createBooking = (bookingData) => {
    const startOtp = generateOTP();
    const completionOtp = generateOTP();
    const serviceDef = servicesData.find(s => s.id === bookingData.service?.id) || bookingData.service;
    const isEmergency = bookingData.booking_type === 'emergency';
    
    const cancellationPenaltyFee = pendingCancellationFee > 0 ? pendingCancellationFee : 0;
    const rawBasePrice = Number(bookingData.base_amount || serviceDef?.start_price || 299);
    const emergencySurge = isEmergency ? 100 : 0; // Emergency surge +₹100
    const discount = isFirstTimeUser ? FIRST_TIME_DISCOUNT : 0;
    const computedTotal = Math.max(rawBasePrice + emergencySurge + cancellationPenaltyFee - discount, 49);

    const initialBooking = {
      booking_id: generateBookingId(),
      service: serviceDef,
      address: bookingData.address,
      landmark: bookingData.landmark || '',
      description: bookingData.description || '',
      photo: bookingData.photo || null,
      attachments: bookingData.attachments || [],
      voice_note: bookingData.voice_note || null,
      booking_type: bookingData.booking_type || 'now',
      scheduled_date: bookingData.scheduled_date || null,
      scheduled_time: bookingData.scheduled_time || null,
      is_bulk_project: !!bookingData.is_bulk_project,
      client_type: bookingData.client_type || (bookingData.institution_name ? 'institutional' : 'residential'),
      institution_type: bookingData.institution_type || null,
      institution_name: bookingData.institution_name || null,
      department_office: bookingData.department_office || null,
      officer_name: bookingData.officer_name || null,
      officer_designation: bookingData.officer_designation || null,
      gstin: bookingData.gstin || null,
      official_email: bookingData.official_email || null,
      campus_scale: bookingData.campus_scale || null,
      gate_pass_code: bookingData.gate_pass_code || ('GP-' + Math.floor(1000 + Math.random() * 9000)),
      artisan_squad: bookingData.artisan_squad || [],
      statutory_compliance: bookingData.statutory_compliance || null,
      cooperative_name: bookingData.cooperative_name || null,
      scale_mode: bookingData.scale_mode || 'solo',
      worker_count: bookingData.worker_count || 1,
      single_worker_base: bookingData.single_worker_base || rawBasePrice,
      extra_worker_cost: bookingData.extra_worker_cost !== undefined
        ? Number(bookingData.extra_worker_cost)
        : ((Number(bookingData.worker_count || 1) - 1) * Number(bookingData.extra_worker_rate || (bookingData.service?.id === 's3' ? 199 : 149))),
      extra_worker_rate: bookingData.extra_worker_rate || (bookingData.service?.id === 's3' ? 199 : 149),
      advance_amount: bookingData.advance_amount || 0,
      total_project_cost: bookingData.total_project_cost || computedTotal,
      min_cost: bookingData.min_cost || computedTotal,
      max_cost: bookingData.max_cost || computedTotal,
      advance_percent: bookingData.advance_percent || 40,
      mid_milestone: bookingData.mid_milestone || 0,
      final_milestone: bookingData.final_milestone || 0,
      paid_amount: 0,
      remaining_amount: bookingData.is_bulk_project
        ? Number(bookingData.total_project_cost || computedTotal)
        : Number(computedTotal),
      crew_size: bookingData.crew_size || 1,
      estimated_days: bookingData.estimated_days || 1,
      scale_label: bookingData.scale_label || '',
      scale_sub: bookingData.scale_sub || '',
      material_label: bookingData.material_label || '',
      material_sub: bookingData.material_sub || '',
      trade_subtype: bookingData.trade_subtype || '',
      trade_scope: bookingData.trade_scope || '',
      trade_details: bookingData.trade_details || '',
      milestone_stage: bookingData.is_bulk_project ? 1 : null,
      escrow_status: bookingData.is_bulk_project ? 'Milestone 1 Advance Locked' : 'Standard Payment',
      worker: null,
      second_worker: null,
      helper_request: null,
      status: BOOKING_STATUSES[0],
      statusIndex: 0,
      start_otp: startOtp,
      completion_otp: completionOtp,
      base_amount: rawBasePrice,
      emergency_surge: emergencySurge,
      discount_applied: discount,
      total_amount: computedTotal,
      overtime_charge: 0,
      distance_km: 0,
      distance_charge: 0,
      cancellation_penalty_fee: cancellationPenaltyFee,
      is_procurement_paused: false,
      accumulated_work_seconds: 0,
      part_order: null,
      part_resume_otp: null,
      extra_work: null,
      payment_method: null,
      payment_status: 'pending',
      payment_option: null,
      milestone1_paid: false,
      milestone2_paid: false,
      milestone3_paid: false,
      worker_delayed: false,
      delay_minutes: 0,
      created_at: new Date().toISOString()
    };
    setActiveBooking(initialBooking);
    return initialBooking;
  };

  // 2. Assign Primary Worker
  const assignWorker = (worker) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const distKm = Number(worker?.distance_km ?? prev.distance_km ?? 0);
      const distanceCharge = distKm > 7 ? Math.round((distKm - 7) * 7) : 0;
      const updated = {
        ...prev,
        worker,
        distance_km: distKm,
        distance_charge: distanceCharge,
        status: BOOKING_STATUSES[1],
        statusIndex: 1
      };
      updated.total_amount = computeTotal(updated);
      return updated;
    });
  };

  // 3. Worker Delay Notification & Handling
  const triggerWorkerDelay = (delayMins = 10, reason = 'Heavy traffic at Ring Road flyover') => {
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        worker_delayed: true,
        delay_minutes: delayMins,
        delay_reason: reason
      };
    });
  };

  const acceptWorkerDelay = () => {
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        worker_delayed: false,
        worker: {
          ...prev.worker,
          eta_minutes: (prev.worker?.eta_minutes || 8) + (prev.delay_minutes || 10)
        }
      };
    });
  };

  const findReplacementWorker = () => {
    const currentId = activeBooking?.worker?.id;
    const tradeWorkers = getWorkersForTrade(activeBooking?.service, activeBooking?.address);
    const replacement = tradeWorkers.find(w => w.id !== currentId) || tradeWorkers[0];

    setActiveBooking(prev => {
      if (!prev) return null;
      const distKm = 0.9;
      const distanceCharge = distKm > 7 ? Math.round((distKm - 7) * 7) : 0;
      const updated = {
        ...prev,
        worker: {
          ...replacement,
          eta_minutes: 6,
          distance_km: distKm
        },
        distance_km: distKm,
        distance_charge: distanceCharge,
        worker_delayed: false,
        status: BOOKING_STATUSES[1],
        statusIndex: 1
      };
      updated.total_amount = computeTotal(updated);
      return updated;
    });
    return replacement;
  };

  // Cancel service en-route with ₹25 penalty on next booking (Phase III)
  const cancelBookingWithPenalty = (penaltyAmount = 25) => {
    setPendingCancellationFee(penaltyAmount);
    if (activeBooking) {
      const cancelledBooking = {
        ...activeBooking,
        status: 'Cancelled by User',
        statusIndex: -1,
        cancellation_penalty_assessed: penaltyAmount,
        cancelled_at: new Date().toISOString()
      };
      setPastBookings(prev => [cancelledBooking, ...prev]);
      setActiveBooking(null);
    }
  };

  // 4. Update Status
  const updateBookingStatus = (statusIndex) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const validIndex = Math.min(Math.max(statusIndex, 0), BOOKING_STATUSES.length - 1);
      return {
        ...prev,
        status: BOOKING_STATUSES[validIndex],
        statusIndex: validIndex
      };
    });
  };

  // 5. Start OTP Handshake
  const verifyStartOtp = () => {
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'Work Started',
        statusIndex: 4,
        work_started_at: prev.work_started_at || Date.now()
      };
    });
  };

  // 5.b Request Part Procurement & Pause Timer (Electrician & Technician solo only - Phase I)
  const requestPartProcurement = ({ part_name, estimated_delivery, part_cost, current_seconds }) => {
    const resumeOtp = generateOTP();
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        is_procurement_paused: true,
        accumulated_work_seconds: Number(current_seconds || 0),
        paused_at: Date.now(),
        part_order: {
          part_name: part_name || 'ISI Certified Electrical/Appliance Spare Part',
          estimated_delivery: estimated_delivery || '1-2 Days / Local Warehouse Transit',
          part_cost: Number(part_cost || 0),
          requested_at: new Date().toISOString()
        },
        part_resume_otp: resumeOtp
      };
      updated.total_amount = computeTotal(updated);
      return updated;
    });
    return resumeOtp;
  };

  // 5.c Resume Work Handshake with OTP (Phase I)
  const resumeWorkWithOtp = (enteredOtp) => {
    if (!activeBooking) return { success: false, error: 'No active booking' };
    const validOtp = String(activeBooking.part_resume_otp || '').trim();
    if (String(enteredOtp || '').trim() !== validOtp) {
      return { success: false, error: 'Invalid Resume OTP. Please enter the 4-digit code shown on your screen.' };
    }

    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        is_procurement_paused: false,
        work_session_resumed_at: Date.now(),
        part_resume_otp: null
      };
    });
    return { success: true };
  };

  // 5.d Apply Overtime Charge for Extended Services (>2 Hours - Phase II: ₹20 standard)
  const applyOvertimeCharge = (chargeAmount = 20) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      if (prev.overtime_charge === chargeAmount) return prev;
      const updated = {
        ...prev,
        overtime_charge: chargeAmount
      };
      updated.total_amount = computeTotal(updated);
      return updated;
    });
  };

  // 6. Request Extra Work
  const requestExtraWork = (customDetails) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const serviceExtra = prev.service?.extra_work || {
        title: 'Component Replacement',
        description: 'Replacement of worn internal seal & valve.',
        amount: 150
      };

      const extra = {
        requested: true,
        title: customDetails?.title || serviceExtra.title,
        description: customDetails?.description || serviceExtra.description,
        amount: Number(customDetails?.amount || serviceExtra.amount),
        photo: customDetails?.photo || serviceExtra.photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80',
        approved: false
      };

      return {
        ...prev,
        extra_work: extra
      };
    });
  };

  // 7. Approve Extra Work (Accurately re-computes total)
  const approveExtraWork = (customData) => {
    setActiveBooking(prev => {
      if (!prev) return prev;
      const serviceExtra = prev.service?.extra_work;
      const extraAmount = Number(customData?.amount || serviceExtra?.amount || prev.extra_work?.amount || 150);
      const extraTitle = customData?.title || serviceExtra?.title || prev.extra_work?.title || 'Component Replacement';
      const extraDesc = customData?.description || serviceExtra?.description || prev.extra_work?.description || 'Additional repair parts';
      const extraPhoto = customData?.photo || serviceExtra?.photo || prev.extra_work?.photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80';

      const updatedBooking = {
        ...prev,
        extra_work: {
          requested: true,
          title: extraTitle,
          description: extraDesc,
          amount: extraAmount,
          photo: extraPhoto,
          approved: true,
          declined: false
        }
      };

      updatedBooking.total_amount = computeTotal(updatedBooking);
      return updatedBooking;
    });
  };

  // 8. Decline Extra Work
  const declineExtraWork = () => {
    setActiveBooking(prev => {
      if (!prev) return prev;
      const updatedBooking = {
        ...prev,
        extra_work: {
          ...(prev.extra_work || prev.service?.extra_work),
          requested: false,
          approved: false,
          declined: true
        }
      };
      updatedBooking.total_amount = computeTotal(updatedBooking);
      return updatedBooking;
    });
  };

  // 9. 2nd Worker / Helper Request
  const requestSecondWorker = (helperData) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const helperDef = prev.service?.helper_request || {
        role: 'Cooperative Assistant Artisan',
        reason: 'Heavy material handling & dual coordination.',
        amount: 200
      };

      return {
        ...prev,
        helper_request: {
          role: helperData?.role || helperDef.role,
          reason: helperData?.reason || helperDef.reason,
          amount: Number(helperData?.amount || helperDef.amount),
          status: 'pending'
        }
      };
    });
  };

  // 10. Approve 2nd Worker (Accurately re-computes total)
  const approveSecondWorker = (workerData) => {
    const assistantWorker = workerData || {
      id: 'h2',
      name: 'Amit Verma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80',
      role: activeBooking?.service?.helper_request?.role || 'Cooperative Assistant Artisan',
      rating: 4.8,
      phone: '+91 98112 34567',
      cooperative: 'Delhi Labour Cooperative Union'
    };

    setActiveBooking(prev => {
      if (!prev) return null;
      const helperCost = Number(prev.helper_request?.amount || prev.service?.helper_request?.amount || 200);
      const updatedBooking = {
        ...prev,
        second_worker: assistantWorker,
        helper_request: {
          role: prev.service?.helper_request?.role || 'Cooperative Assistant Artisan',
          reason: prev.service?.helper_request?.reason || 'Heavy equipment support & dual coordination.',
          amount: helperCost,
          status: 'approved',
          assigned_worker: assistantWorker
        }
      };
      updatedBooking.total_amount = computeTotal(updatedBooking);
      return updatedBooking;
    });
    return assistantWorker;
  };

  // 11. Decline 2nd Worker
  const declineSecondWorker = () => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const updatedBooking = {
        ...prev,
        second_worker: null,
        helper_request: {
          ...prev.helper_request,
          status: 'declined'
        }
      };
      updatedBooking.total_amount = computeTotal(updatedBooking);
      return updatedBooking;
    });
  };

  // 12. Completion OTP Handshake
  const verifyCompletionOtp = () => {
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'Work Completed',
        statusIndex: 5
      };
    });
  };

  // 13. Process Payment & Settlement
  const completePayment = (method) => {
    if (pendingCancellationFee > 0) {
      setPendingCancellationFee(0);
    }
    setActiveBooking(prev => {
      if (!prev) return null;
      const finalPaidTotal = computeTotal(prev);
      return {
        ...prev,
        paid_amount: finalPaidTotal,
        total_amount: finalPaidTotal,
        payment_method: method || 'UPI',
        payment_status: 'success',
        paid_at: new Date().toISOString()
      };
    });
  };

  // 13.b Process Bulk & Milestone Escrow Payment
  const processBulkPayment = ({ payment_option, amount, method }) => {
    setActiveBooking(prev => {
      if (!prev) return null;
      const prevPaid = Number(prev.paid_amount || 0);
      const payAmt = Number(amount || 0);
      const newPaidAmount = prevPaid + payAmt;
      const totalCost = Number(prev.total_project_cost || newPaidAmount);
      const newRemaining = Math.max(0, totalCost - newPaidAmount);
      const isFull = newRemaining <= 0 || payment_option === 'full' || payment_option === 'remaining_full';

      const m1Paid = true;
      const m2Paid = isFull || newPaidAmount >= ((prev.advance_amount || 0) + (prev.mid_milestone || 0));
      const m3Paid = isFull;

      return {
        ...prev,
        payment_option: isFull ? 'full' : (prev.payment_option || 'advance'),
        payment_status: isFull ? 'full_paid' : 'advance_paid',
        payment_method: method || prev.payment_method || 'SBI MSCS Escrow Instant UPI',
        paid_amount: newPaidAmount,
        remaining_amount: newRemaining,
        milestone_stage: isFull ? 3 : (m2Paid ? 2 : 1),
        escrow_status: isFull
          ? '100% Escrow Funded & Protected'
          : `Milestone 1 Advance Deposited (₹${newPaidAmount.toLocaleString()})`,
        status: isFull
          ? 'Project 100% Funded - Ready for Handover'
          : 'Advance Paid - Work In Progress',
        statusIndex: isFull ? 4 : 2,
        milestone1_paid: m1Paid,
        milestone2_paid: m2Paid,
        milestone3_paid: m3Paid,
        last_payment_at: new Date().toISOString()
      };
    });
  };

  // 13.c Complete Bulk Project & Release Escrow
  const completeBulkProject = () => {
    setActiveBooking(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'Work Completed',
        statusIndex: 5,
        escrow_status: '100% Escrow Settled & Completed',
        completed_at: new Date().toISOString()
      };
    });
  };

  // 13.d Archive Bulk Booking (Direct close or bypass)
  const archiveBulkBooking = (rating = 5, reviewText = '') => {
    if (activeBooking) {
      const finished = {
        ...activeBooking,
        status: 'Work Completed',
        statusIndex: 5,
        rating: typeof rating === 'object' ? rating.rating || 5 : rating,
        review_text: typeof rating === 'object' ? rating.review || '' : reviewText,
        escrow_status: '100% Escrow Settled & Completed',
        completed_at: new Date().toISOString()
      };
      setPastBookings(prev => [finished, ...prev]);
      setActiveBooking(null);
    }
  };

  // 14. Submit Rating & Complete Flow
  const submitRating = (ratingScore, tags = [], reviewText = '') => {
    const score = typeof ratingScore === 'object' ? ratingScore.rating || 5 : ratingScore;
    const finalTags = typeof ratingScore === 'object' ? ratingScore.tags || [] : tags;
    const text = typeof ratingScore === 'object' ? ratingScore.review || '' : reviewText;

    if (activeBooking) {
      const finishedBooking = {
        ...activeBooking,
        status: 'Work Completed',
        statusIndex: 5,
        rating: score,
        review_tags: finalTags,
        review_text: text,
        escrow_status: activeBooking.is_bulk_project ? '100% Escrow Settled & Completed' : (activeBooking.escrow_status || 'Released'),
        completed_at: new Date().toISOString()
      };
      setPastBookings(prev => [finishedBooking, ...prev]);
      setActiveBooking(null); // Clear active order once reviewed and archived
    } else {
      // If already archived, attach rating to the top completed project
      setPastBookings(prev => {
        if (!prev || prev.length === 0) return prev;
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          rating: score,
          review_tags: finalTags,
          review_text: text
        };
        return updated;
      });
    }
  };

  // 15. File Complaint
  const fileComplaint = (complaintData) => {
    const complaintRecord = {
      ...complaintData,
      id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Complaint Received',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    if (activeBooking) {
      setActiveBooking(prev => ({
        ...prev,
        complaint: complaintRecord
      }));
    }
    return complaintRecord;
  };

  // 16. Community & Institutional Bulk Service Inquiry / Quote Request
  const submitCommunityBulkRequest = (requestData) => {
    const isInst = requestData.client_type === 'institutional' || !!requestData.institution_name;
    const prefix = isInst ? 'INST-' : 'COMM-';
    const newReq = {
      id: prefix + Math.floor(10000 + Math.random() * 90000),
      client_type: isInst ? 'institutional' : 'residential',
      institution_type: requestData.institution_type || null,
      institution_name: requestData.institution_name || requestData.society_name || 'Delhi Technical Campus',
      society_name: requestData.society_name || requestData.institution_name || 'Palm Heights RWA',
      department_office: requestData.department_office || null,
      officer_name: requestData.officer_name || requestData.contact_person || 'Estate Officer',
      officer_designation: requestData.officer_designation || null,
      contact_person: requestData.contact_person || requestData.officer_name || 'Authorized Representative',
      phone: requestData.phone,
      official_email: requestData.official_email || null,
      gstin: requestData.gstin || null,
      campus_scale: requestData.campus_scale || null,
      service_title: requestData.service_title,
      service_id: requestData.service_id || null,
      cooperative: requestData.cooperative,
      target_date: requestData.target_date,
      units_estimate: requestData.units_estimate,
      crew_size: requestData.crew_size || null,
      days: requestData.days || null,
      estimated_cost_min: requestData.estimated_cost_min || null,
      estimated_cost_max: requestData.estimated_cost_max || null,
      statutory_compliance: requestData.statutory_compliance || null,
      gate_pass_code: requestData.gate_pass_code || ('GP-' + Math.floor(1000 + Math.random() * 9000)),
      artisan_squad: requestData.artisan_squad || [],
      status: 'Inspection Scheduled',
      submitted_at: new Date().toISOString()
    };
    setCommunityRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  // Always compute dynamic total as single source of truth
  const totalAmount = computeTotal(activeBooking);

  return (
    <BookingContext.Provider
      value={{
        activeBooking,
        pastBookings,
        communityRequests,
        totalAmount,
        isFirstTimeUser,
        FIRST_TIME_DISCOUNT,
        computeTotal,
        createBooking,
        assignWorker,
        triggerWorkerDelay,
        acceptWorkerDelay,
        findReplacementWorker,
        updateBookingStatus,
        verifyStartOtp,
        requestExtraWork,
        approveExtraWork,
        declineExtraWork,
        requestSecondWorker,
        approveSecondWorker,
        declineSecondWorker,
        verifyCompletionOtp,
        completePayment,
        processPayment: completePayment,
        setPaymentMethod: completePayment,
        processBulkPayment,
        completeBulkProject,
        archiveBulkBooking,
        submitRating,
        fileComplaint,
        submitCommunityBulkRequest,
        setActiveBooking,
        pendingCancellationFee,
        setPendingCancellationFee,
        cancelBookingWithPenalty,
        requestPartProcurement,
        resumeWorkWithOtp,
        applyOvertimeCharge
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
export default BookingContext;
