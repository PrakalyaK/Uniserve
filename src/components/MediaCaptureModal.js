import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const MediaCaptureModal = ({
  visible,
  onClose,
  onMediaSelected,
  onStartVoiceRecord
}) => {
  const { t } = useUser();

  // Screen Mode: 'menu' | 'camera_photo' | 'camera_video' | 'preview_photo' | 'preview_video'
  const [mode, setMode] = useState('menu');
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' | 'user'
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [capturedVideoObj, setCapturedVideoObj] = useState(null);

  // Video Recording State
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoSec, setVideoSec] = useState(0);

  // Hardware Stream & MediaRecorder Refs
  const videoElementRef = useRef(null);
  const previewVideoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoTimerRef = useRef(null);

  // Reset state on modal open/close
  useEffect(() => {
    if (!visible) {
      stopCameraStream();
      setMode('menu');
      setCapturedPhotoUrl(null);
      setCapturedVideoObj(null);
      setIsRecordingVideo(false);
      setVideoSec(0);
    }
  }, [visible]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
  };

  // 1. OPEN REAL LIVE CAMERA (PHOTO OR VIDEO)
  const startLiveCamera = async (targetMode) => {
    setMode(targetMode);
    setIsCameraLoading(true);
    stopCameraStream();

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const isVideo = targetMode === 'camera_video';
        const constraints = {
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: isVideo
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // Attach stream to live video element
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
          videoElementRef.current.play().catch((e) => console.warn('Video play catch:', e));
        }
        setIsCameraLoading(false);
      } else {
        setIsCameraLoading(false);
        Alert.alert('Camera Not Supported', 'Webcam / Camera stream is not accessible in this environment.');
      }
    } catch (err) {
      console.error('Real Camera Access Error:', err);
      setIsCameraLoading(false);
      Alert.alert(
        'Camera Permission Denied',
        'Please allow camera and microphone access in your browser or device settings to capture live diagnostics.'
      );
      setMode('menu');
    }
  };

  // Toggle Front / Back Camera
  const handleToggleFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    setTimeout(() => {
      startLiveCamera(mode);
    }, 100);
  };

  // 2. SNAP PHOTO FROM LIVE CAMERA FEED
  const handleSnapPhoto = () => {
    if (videoElementRef.current) {
      const video = videoElementRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setCapturedPhotoUrl(photoDataUrl);
      setMode('preview_photo');
      stopCameraStream();
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhotoUrl && onMediaSelected) {
      onMediaSelected({
        type: 'photo',
        uri: capturedPhotoUrl,
        title: 'Live Camera Capture'
      });
      onClose();
    }
  };

  // 3. START & STOP VIDEO RECORDING
  const handleStartVideoRecording = () => {
    if (streamRef.current) {
      const stream = streamRef.current;
      videoChunksRef.current = [];

      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'video/webm';
        const blob = new Blob(videoChunksRef.current, { type: mimeType });
        const videoUrl = typeof URL !== 'undefined' ? URL.createObjectURL(blob) : null;

        setCapturedVideoObj({
          uri: videoUrl,
          blob: blob,
          duration: `0:${videoSec < 10 ? '0' : ''}${videoSec}`
        });
        setMode('preview_video');
        stopCameraStream();
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      setVideoSec(0);

      videoTimerRef.current = setInterval(() => {
        setVideoSec((prev) => {
          if (prev >= 30) {
            handleStopVideoRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleStopVideoRecording = () => {
    if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    setIsRecordingVideo(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleConfirmVideo = () => {
    if (capturedVideoObj && onMediaSelected) {
      onMediaSelected({
        type: 'video',
        uri: capturedVideoObj.uri,
        duration: capturedVideoObj.duration || '0:15',
        title: 'Diagnostic Video Clip'
      });
      onClose();
    }
  };

  // 4. PICK NATIVE PHOTO FROM OPERATING SYSTEM GALLERY
  const handlePickGalleryPhoto = () => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('uniserv-gallery-photo-input');
      if (!input) {
        input = document.createElement('input');
        input.id = 'uniserv-gallery-photo-input';
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
      }
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const photoUrl = URL.createObjectURL(file);
          onMediaSelected({
            type: 'photo',
            uri: photoUrl,
            title: file.name || 'Gallery Photo'
          });
          onClose();
        }
      };
      input.click();
    }
  };

  // 5. PICK NATIVE VIDEO FROM OPERATING SYSTEM GALLERY
  const handlePickGalleryVideo = () => {
    if (typeof document !== 'undefined') {
      let input = document.getElementById('uniserv-gallery-video-input');
      if (!input) {
        input = document.createElement('input');
        input.id = 'uniserv-gallery-video-input';
        input.type = 'file';
        input.accept = 'video/*';
        input.style.display = 'none';
        document.body.appendChild(input);
      }
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          onMediaSelected({
            type: 'video',
            uri: videoUrl,
            duration: '0:20',
            title: file.name || 'Gallery Video Clip'
          });
          onClose();
        }
      };
      input.click();
    }
  };

  const handleRecordVoice = () => {
    onClose();
    if (onStartVoiceRecord) {
      onStartVoiceRecord();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, (mode === 'camera_photo' || mode === 'camera_video' || mode === 'preview_photo' || mode === 'preview_video') && styles.cardCameraMode]}>
          
          {/* ========================================================================= */}
          {/* MODE 1: LIVE WEBCAM / PHONE CAMERA VIEWFINDER (PHOTO & VIDEO) */}
          {/* ========================================================================= */}
          {(mode === 'camera_photo' || mode === 'camera_video') && (
            <View style={styles.cameraContainer}>
              {/* Header */}
              <View style={styles.cameraHeader}>
                <TouchableOpacity
                  style={styles.backModeBtn}
                  onPress={() => {
                    stopCameraStream();
                    setMode('menu');
                  }}
                >
                  <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.cameraTitleCol}>
                  <Text style={styles.cameraTitle}>
                    {mode === 'camera_photo' ? 'Live Camera (Take Photo)' : 'Live Video (Record Clip)'}
                  </Text>
                  <Text style={styles.cameraSubtitle}>Point camera at the damage or repair area</Text>
                </View>

                <TouchableOpacity style={styles.flipBtn} onPress={handleToggleFacing}>
                  <Ionicons name="camera-reverse" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Real Video Stream Viewfinder */}
              <View style={styles.viewfinderBox}>
                {isCameraLoading ? (
                  <View style={styles.cameraLoadingBox}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.cameraLoadingText}>Initializing Camera Stream...</Text>
                  </View>
                ) : null}

                {/* HTML5 Video Element mounted to stream */}
                <div style={{ width: '100%', height: '100%', display: isCameraLoading ? 'none' : 'block' }}>
                  <video
                    ref={videoElementRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16
                    }}
                  />
                </div>

                {/* Live Video Recording Indicator Banner */}
                {isRecordingVideo && (
                  <View style={styles.liveRecordIndicator}>
                    <View style={styles.liveRecordDot} />
                    <Text style={styles.liveRecordText}>REC 0:{videoSec < 10 ? '0' : ''}{videoSec} / 0:30</Text>
                  </View>
                )}
              </View>

              {/* Bottom Camera Action Shutter */}
              <View style={styles.cameraControlsRow}>
                {mode === 'camera_photo' ? (
                  <TouchableOpacity
                    style={styles.shutterBtn}
                    onPress={handleSnapPhoto}
                    activeOpacity={0.8}
                  >
                    <View style={styles.shutterInnerCircle}>
                      <Ionicons name="camera" size={28} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.videoRecBtn, isRecordingVideo && styles.videoRecBtnActive]}
                    onPress={isRecordingVideo ? handleStopVideoRecording : handleStartVideoRecording}
                    activeOpacity={0.85}
                  >
                    <Ionicons name={isRecordingVideo ? 'stop' : 'videocam'} size={28} color="#FFFFFF" />
                    <Text style={styles.videoRecBtnLabel}>
                      {isRecordingVideo ? 'Stop Recording' : 'Start Video Record'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: PHOTO PREVIEW & CONFIRMATION */}
          {/* ========================================================================= */}
          {mode === 'preview_photo' && (
            <View style={styles.cameraContainer}>
              <Text style={styles.previewHeading}>Review Captured Diagnostic Photo</Text>
              <View style={styles.previewMediaBox}>
                {capturedPhotoUrl && (
                  <Image source={{ uri: capturedPhotoUrl }} style={styles.previewImage} />
                )}
              </View>

              <View style={styles.previewActionsRow}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={() => startLiveCamera('camera_photo')}
                >
                  <Ionicons name="refresh" size={18} color={colors.textSecondary} />
                  <Text style={styles.retakeBtnText}>Retake Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirmPhoto}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Attach Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* MODE 3: VIDEO PREVIEW & CONFIRMATION */}
          {/* ========================================================================= */}
          {mode === 'preview_video' && (
            <View style={styles.cameraContainer}>
              <Text style={styles.previewHeading}>Review Recorded Diagnostic Video</Text>
              <View style={styles.previewMediaBox}>
                {capturedVideoObj?.uri && (
                  <div style={{ width: '100%', height: '100%' }}>
                    <video
                      src={capturedVideoObj.uri}
                      controls
                      autoPlay
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 16
                      }}
                    />
                  </div>
                )}
              </View>

              <View style={styles.previewActionsRow}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={() => startLiveCamera('camera_video')}
                >
                  <Ionicons name="refresh" size={18} color={colors.textSecondary} />
                  <Text style={styles.retakeBtnText}>Retake Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirmVideo}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Attach Video Clip</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* MODE 4: MAIN MENU OPTIONS */}
          {/* ========================================================================= */}
          {mode === 'menu' && (
            <View>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.tagText}>{t('realHardwareDiagnostics') || 'REAL HARDWARE DIAGNOSTICS'}</Text>
                  <Text style={styles.title}>{t('attachMediaVoice') || 'Attach Live Media & Voice'}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                {/* Option 1: Live Webcam / Phone Camera Photo */}
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => startLiveCamera('camera_photo')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.primarySubtle }]}>
                    <Ionicons name="camera" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{t('captureLivePhoto') || 'Capture Live Camera Photo'}</Text>
                    <Text style={styles.optionSub}>{t('captureLivePhotoSub') || 'Opens device camera viewfinder to take instant photo'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Option 2: Live Video Recording */}
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() => startLiveCamera('camera_video')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="videocam" size={22} color="#EF4444" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{t('recordLiveVideo') || 'Record Live Diagnostic Video'}</Text>
                    <Text style={styles.optionSub}>{t('recordLiveVideoSub') || 'Opens camera to record up to 30s video with sound'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Option 3: Real Voice Note */}
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={handleRecordVoice}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="mic" size={22} color="#D97706" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{t('recordAudioVoiceNote') || 'Record Audio Voice Note'}</Text>
                    <Text style={styles.optionSub}>{t('recordAudioVoiceNoteSub') || 'Real microphone capture with AI speech transcript'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Option 4: Pick Native Photo from Files */}
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={handlePickGalleryPhoto}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.successLight }]}>
                    <Ionicons name="images" size={22} color={colors.successDark} />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{t('choosePhotoFiles') || 'Choose Photo from Files / Album'}</Text>
                    <Text style={styles.optionSub}>{t('choosePhotoFilesSub') || 'Pick an existing photo or screenshot from your device'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>

                {/* Option 5: Pick Native Video from Files */}
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={handlePickGalleryVideo}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#EDE9FE' }]}>
                    <Ionicons name="film" size={22} color="#8B5CF6" />
                  </View>
                  <View style={styles.optionTextCol}>
                    <Text style={styles.optionTitle}>{t('chooseVideoFiles') || 'Choose Video from Files'}</Text>
                    <Text style={styles.optionSub}>{t('chooseVideoFilesSub') || 'Upload pre-recorded video clip from storage'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </ScrollView>

              {/* Cancel */}
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.cancelText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end'
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 28
  },
  cardCameraMode: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  optionTextCol: {
    flex: 1
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  optionSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary
  },
  // Camera Viewfinder Styles
  cameraContainer: {
    alignItems: 'center',
    width: '100%'
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12
  },
  backModeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraTitleCol: {
    alignItems: 'center'
  },
  cameraTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  cameraSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1
  },
  flipBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewfinderBox: {
    width: '100%',
    height: 320,
    borderRadius: 18,
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraLoadingBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraLoadingText: {
    fontSize: 12,
    color: '#E2E8F0',
    marginTop: 8,
    fontWeight: '600'
  },
  liveRecordIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  liveRecordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6
  },
  liveRecordText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  cameraControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%'
  },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  shutterInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoRecBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  videoRecBtnActive: {
    backgroundColor: '#991B1B'
  },
  videoRecBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 8
  },
  // Preview Styles
  previewHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12
  },
  previewMediaBox: {
    width: '100%',
    height: 280,
    borderRadius: 18,
    backgroundColor: '#000000',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18
  },
  previewActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%'
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    borderRadius: 14
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginLeft: 6
  },
  confirmBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  }
});

export default MediaCaptureModal;
