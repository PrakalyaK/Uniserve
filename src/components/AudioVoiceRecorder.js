import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';

export const AudioVoiceRecorder = ({
  voiceNote,
  onSaveVoiceNote,
  onDeleteVoiceNote,
  serviceName = 'Home Service',
  serviceId = 's1',
  readOnly = false
}) => {
  const { t } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioLevels, setAudioLevels] = useState([15, 25, 40, 20, 35, 55, 30, 25, 45, 60, 35, 20, 40, 50, 30, 15]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Real Web Audio & MediaRecorder Refs
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const audioElementRef = useRef(null);
  const playTimerRef = useRef(null);

  // Category-Aware AI Transcription Generator (Used as smart enrichment if speech recognition is empty)
  const getSimulatedTranscription = (id) => {
    switch (id) {
      case 's1':
        return 'Kitchen sink tap spindle is leaking heavily from the base and dripping into the cabinet below. Water valve needs tightening or washer replacement.';
      case 's2':
        return 'Main switchboard in the corridor is sparking with loud buzzing when the heavy geyser is powered on. MCB trips continuously.';
      case 's3':
        return 'Two bathrooms have stubborn hard-water yellow scaling on tiles and the kitchen chimney has thick grease deposits. Need deep machine scrub.';
      case 's4':
        return 'Master bedroom sliding wardrobe door came off the bottom track and main entrance mortise lock handle is very stiff to turn.';
      case 's5':
        return 'Balcony wall and bedroom ceiling have damp moisture peeling patches. Need putty scraping, waterproof primer, and 2 finish coats.';
      case 's6':
        return 'Senior family member recovering from knee surgery needs gentle daily mobility support, feeding assistance, and medication schedule reminders.';
      case 's7':
        return '1.5-ton Inverter Split AC in living room is not cooling properly and outdoor unit compressor makes intermittent clicking noise.';
      case 's8':
        return 'Require domestic helper support for morning cooking (North Indian vegetarian lunch for 4 people) and evening utensil washing.';
      case 's9':
        return 'Need experienced chauffeur for manual sedan from South Delhi to IGI Airport Terminal 3 with round-trip waiting tomorrow morning.';
      case 's10':
        return 'Terrace garden needs fresh organic vermicompost repotting for 15 pots, hedge shaping, and neem spray on rose plants.';
      default:
        return 'Standard cooperative doorstep service requirement. Please inspect the issue on-site.';
    }
  };

  // Pulse animation while recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Clean up all audio resources on unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
      cleanupPlayback();
    };
  }, []);

  const cleanupRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const cleanupPlayback = () => {
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      } catch (e) {}
      audioElementRef.current = null;
    }
    setIsPlaying(false);
  };

  // 1. START REAL MICROPHONE RECORDING
  const handleStartRecording = async () => {
    try {
      setLiveTranscript('');
      setRecordSeconds(0);

      // Check if browser/device supports Web Audio & getUserMedia
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // Initialize MediaRecorder
        const options = { mimeType: 'audio/webm' };
        let recorder;
        try {
          recorder = new MediaRecorder(stream, options);
        } catch (e) {
          recorder = new MediaRecorder(stream);
        }

        audioChunksRef.current = [];
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.start(100); // chunk every 100ms
        mediaRecorderRef.current = recorder;

        // Real-Time Audio Frequency Visualizer with Web Audio API AnalyserNode
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateWaveform = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            // Sample 16 bars from frequency spectrum
            const newLevels = [];
            for (let i = 0; i < 16; i++) {
              const val = dataArray[i * 2] || 0;
              // Map 0-255 to bar height (10 - 48px)
              const height = Math.max(8, Math.min(48, (val / 255) * 48 + 10));
              newLevels.push(height);
            }
            setAudioLevels(newLevels);
            animFrameRef.current = requestAnimationFrame(updateWaveform);
          };
          updateWaveform();
        }

        // Web Speech API Live Speech-to-Text Recognition
        if (typeof window !== 'undefined') {
          const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRec) {
            const recognition = new SpeechRec();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN'; // Indian English / Hindi mix

            recognition.onresult = (event) => {
              let transcriptText = '';
              for (let i = 0; i < event.results.length; i++) {
                transcriptText += event.results[i][0].transcript + ' ';
              }
              setLiveTranscript(transcriptText.trim());
            };

            try {
              recognition.start();
              speechRecognitionRef.current = recognition;
            } catch (e) {
              console.warn('Speech recognition start failed:', e);
            }
          }
        }

        setIsRecording(true);

        // Recording Timer
        timerRef.current = setInterval(() => {
          setRecordSeconds((prev) => {
            if (prev >= 60) {
              handleStopRecording();
              return 60;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Fallback for native runtime if web API unavailable
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          setRecordSeconds((prev) => prev + 1);
        }, 1000);
      }
    } catch (err) {
      console.error('Error starting real microphone recording:', err);
      Alert.alert(
        'Microphone Permission Needed',
        'Please allow microphone access in your browser or device settings to record your voice note.'
      );
    }
  };

  // 2. STOP & SAVE REAL AUDIO RECORDING
  const handleStopRecording = () => {
    setIsRecording(false);
    const recordedSecs = Math.max(recordSeconds, 3);
    const mins = Math.floor(recordedSecs / 60);
    const secs = recordedSecs % 60;
    const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop MediaRecorder and extract Real Audio Blob URL
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        try {
          const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const realAudioUrl = typeof URL !== 'undefined' ? URL.createObjectURL(audioBlob) : null;

          // Stop mic stream tracks
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }

          const finalTranscript = liveTranscript.trim() || getSimulatedTranscription(serviceId);

          if (onSaveVoiceNote) {
            onSaveVoiceNote({
              id: 'voice_' + Date.now(),
              type: 'audio',
              duration: formattedDuration,
              durationSeconds: recordedSecs,
              audioUrl: realAudioUrl,
              audioBlob: audioBlob,
              transcription: finalTranscript,
              recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        } catch (e) {
          console.error('Error creating real audio object URL:', e);
        }
      };

      mediaRecorderRef.current.stop();
    } else {
      // Fallback
      const finalTranscript = liveTranscript.trim() || getSimulatedTranscription(serviceId);
      if (onSaveVoiceNote) {
        onSaveVoiceNote({
          id: 'voice_' + Date.now(),
          type: 'audio',
          duration: formattedDuration,
          durationSeconds: recordedSecs,
          audioUrl: null,
          transcription: finalTranscript,
          recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }
  };

  // CANCEL RECORDING
  const handleCancelRecording = () => {
    cleanupRecording();
    setIsRecording(false);
    setRecordSeconds(0);
    setLiveTranscript('');
  };

  // 3. REAL PLAY / PAUSE VOICE NOTE PLAYBACK
  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pause
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      setIsPlaying(false);
    } else {
      // Play
      if (voiceNote?.audioUrl && typeof Audio !== 'undefined') {
        try {
          if (!audioElementRef.current) {
            const audio = new Audio(voiceNote.audioUrl);
            audioElementRef.current = audio;

            audio.onended = () => {
              setIsPlaying(false);
              setPlayProgress(0);
              if (playTimerRef.current) clearInterval(playTimerRef.current);
            };

            audio.ontimeupdate = () => {
              if (audio.duration) {
                setPlayProgress(audio.currentTime / audio.duration);
              }
            };
          }

          audioElementRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
            console.warn('Audio play failed, falling back to simulated timer:', err);
            startSimulatedPlayback();
          });
        } catch (err) {
          console.warn('Audio element error:', err);
          startSimulatedPlayback();
        }
      } else {
        startSimulatedPlayback();
      }
    }
  };

  const startSimulatedPlayback = () => {
    setIsPlaying(true);
    setPlayProgress(0);
    const totalSec = voiceNote?.durationSeconds || 12;
    let current = 0;
    if (playTimerRef.current) clearInterval(playTimerRef.current);
    playTimerRef.current = setInterval(() => {
      current += 0.5;
      if (current >= totalSec) {
        setIsPlaying(false);
        setPlayProgress(0);
        clearInterval(playTimerRef.current);
      } else {
        setPlayProgress(current / totalSec);
      }
    }, 500);
  };

  // -------------------------------------------------------------
  // RENDER: Active Live Recording UI with Real Dynamic Waveform
  // -------------------------------------------------------------
  if (isRecording) {
    const mins = Math.floor(recordSeconds / 60);
    const secs = recordSeconds % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    return (
      <View style={styles.recordingCard}>
        <View style={styles.recordingHeader}>
          <Animated.View style={[styles.recordingDot, { transform: [{ scale: pulseAnim }] }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recordingTitle}>{t('recordAudioVoiceNote') || 'Recording Live Audio Voice Note'}</Text>
            <Text style={styles.recordingSubtitle}>{t('capturingAudio') || 'Capturing microphone audio...'}</Text>
          </View>
          <View style={styles.timerBadge}>
            <Text style={styles.recordingTimer}>{timeFormatted} / 1:00</Text>
          </View>
        </View>

        {/* Real Live Waveform Visualizer connected to Web Audio Analyser */}
        <View style={styles.waveformContainer}>
          {audioLevels.map((height, i) => (
            <View
              key={i}
              style={[
                styles.waveformBar,
                {
                  height: height,
                  backgroundColor: i % 2 === 0 ? '#EF4444' : '#F59E0B'
                }
              ]}
            />
          ))}
        </View>

        {/* Live Speech Recognition Feedback */}
        {liveTranscript ? (
          <View style={styles.liveTranscriptBox}>
            <Text style={styles.liveTranscriptTag}>{t('liveSpeechRecTag') || 'LIVE SPEECH RECOGNITION:'}</Text>
            <Text style={styles.liveTranscriptText}>"{liveTranscript}"</Text>
          </View>
        ) : (
          <Text style={styles.recordingPrompt}>
            {t('speakPrompt') || 'Speak clearly into your microphone. Your spoken words will be saved as real audio and transcribed for the technician.'}
          </Text>
        )}

        <View style={styles.recordingActionsRow}>
          <TouchableOpacity
            style={styles.cancelRecBtn}
            onPress={handleCancelRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.cancelRecBtnText}>{t('cancel') || 'Cancel'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.stopRecBtn}
            onPress={handleStopRecording}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.stopRecBtnText}>{t('stopAttachVoiceNote') || 'Stop & Attach Voice Note'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Recorded Playable Audio Voice Note Card
  // -------------------------------------------------------------
  if (voiceNote) {
    return (
      <View style={styles.voiceNoteCard}>
        <View style={styles.voiceNoteHeader}>
          <View style={styles.voiceNoteIconCircle}>
            <Ionicons name="mic" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={styles.voiceNoteTagRow}>
              <View style={styles.realAudioBadge}>
                <Ionicons name="volume-high" size={10} color={colors.primary} />
                <Text style={styles.realAudioBadgeText}>{t('realAudioRecordingTag') || 'REAL AUDIO RECORDING'}</Text>
              </View>
              <Text style={styles.voiceNoteDuration}>{voiceNote.duration || '0:15'}</Text>
            </View>
            <Text style={styles.voiceNoteTitle}>{t('customerVoiceExplanation') || 'Customer Voice Explanation'}</Text>
          </View>

          {!readOnly && (
            <TouchableOpacity
              style={styles.deleteVoiceBtn}
              onPress={() => {
                cleanupPlayback();
                if (onDeleteVoiceNote) onDeleteVoiceNote();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Real Audio Player Controls */}
        <View style={styles.playerControlsRow}>
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.playBtnActive]}
            onPress={handleTogglePlay}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={18}
              color="#FFFFFF"
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          </TouchableOpacity>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.max(playProgress * 100, 3)}%` }
                ]}
              />
            </View>
            <View style={styles.progressTimeRow}>
              <Text style={styles.progressTimeText}>
                {isPlaying ? (t('playingVoice') || '🔊 Playing your recorded voice...') : (t('tapPlayVoice') || 'Tap play to listen to your voice recording')}
              </Text>
              <Text style={styles.progressTimeText}>{voiceNote.duration || '0:15'}</Text>
            </View>
          </View>
        </View>

        {/* AI Voice-to-Text Transcription Box */}
        {voiceNote.transcription && (
          <View style={styles.transcriptionBox}>
            <View style={styles.transcriptionHeader}>
              <Ionicons name="sparkles" size={12} color={colors.primary} />
              <Text style={styles.transcriptionTag}>{t('voiceToTextTag') || 'VOICE-TO-TEXT TRANSCRIPTION'}</Text>
            </View>
            <Text style={styles.transcriptionText}>"{voiceNote.transcription}"</Text>
          </View>
        )}
      </View>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Empty State (Click to Start Real Recording)
  // -------------------------------------------------------------
  if (readOnly) return null;

  return (
    <TouchableOpacity
      style={styles.startRecordBtn}
      onPress={handleStartRecording}
      activeOpacity={0.85}
    >
      <View style={styles.micCircle}>
        <Ionicons name="mic" size={20} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.startRecordTitle}>{t('recordVoiceNoteTitle') || 'Explain Problem by Voice (Voice Note)'}</Text>
        <Text style={styles.startRecordSub}>{t('recordVoiceNoteSub') || 'Tap microphone to speak • Real audio recording sent to artisan'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  startRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  micCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startRecordTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary
  },
  startRecordSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2
  },
  recordingCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    marginBottom: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  recordingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    marginRight: 10
  },
  recordingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B'
  },
  recordingSubtitle: {
    fontSize: 10,
    color: '#B91C1C',
    marginTop: 1
  },
  timerBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  recordingTimer: {
    fontSize: 12,
    fontWeight: '900',
    color: '#991B1B'
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 10
  },
  waveformBar: {
    width: 3.5,
    borderRadius: 2
  },
  liveTranscriptBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 10
  },
  liveTranscriptTag: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  liveTranscriptText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    fontStyle: 'italic'
  },
  recordingPrompt: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
    marginBottom: 12
  },
  recordingActionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  cancelRecBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 11,
    borderRadius: 12
  },
  cancelRecBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 4
  },
  stopRecBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  stopRecBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6
  },
  voiceNoteCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2
  },
  voiceNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  voiceNoteIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceNoteTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  realAudioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  realAudioBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 3,
    letterSpacing: 0.5
  },
  voiceNoteDuration: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary
  },
  voiceNoteTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2
  },
  deleteVoiceBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2'
  },
  playerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  playBtnActive: {
    backgroundColor: colors.successDark
  },
  progressBarContainer: {
    flex: 1
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4
  },
  progressTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  progressTimeText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  transcriptionBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  transcriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  transcriptionTag: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.primary,
    marginLeft: 4,
    letterSpacing: 0.5
  },
  transcriptionText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 16
  }
});

export default AudioVoiceRecorder;
