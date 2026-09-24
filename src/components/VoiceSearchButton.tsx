import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, X, Sparkles } from 'lucide-react';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  onListeningStateChange?: (isListening: boolean) => void;
  className?: string;
  size?: 'sm' | 'md';
}

// Global declaration for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

// Synthesize pleasant luxury chime using Web Audio API
const playTone = (type: 'start' | 'success' | 'cancel') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch {
    // Ignore audio context autoplay restrictions
  }
};

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  onListeningStateChange,
  className = '',
  size = 'md'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isManuallyStopped = useRef(false);

  useEffect(() => {
    const win = window as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechClass) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    onListeningStateChange?.(isListening);
  }, [isListening, onListeningStateChange]);

  const stopListening = () => {
    isManuallyStopped.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setShowModal(false);
    setInterimText('');
  };

  const startListening = () => {
    const win = window as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechClass) {
      setIsSupported(false);
      setErrorMessage('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setShowModal(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechClass();
      recognitionRef.current = recognition;
      isManuallyStopped.current = false;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      // Default to Indian English / English
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setInterimText('');
        setShowModal(true);
        playTone('start');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        const recognizedText = (finalTranscript || currentInterim).trim();
        if (recognizedText) {
          setInterimText(recognizedText);
        }

        if (finalTranscript.trim()) {
          const cleanText = finalTranscript.trim().replace(/[.,!?;:]+$/, '');
          playTone('success');
          onTranscript(cleanText);
          setTimeout(() => {
            stopListening();
          }, 350);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (isManuallyStopped.current) return;

        let msg = 'Could not capture speech. Please try speaking again.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          msg = 'Microphone access was denied. Please allow microphone permissions in your browser address bar.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech detected. Please speak clearly into your microphone.';
        } else if (event.error === 'network') {
          msg = 'Network connection issue for speech recognition.';
        }
        setErrorMessage(msg);
        playTone('cancel');
      };

      recognition.onend = () => {
        if (!isManuallyStopped.current && isListening) {
          setIsListening(false);
          // if interim text was found but no final event triggered
          if (interimText.trim()) {
            onTranscript(interimText.trim().replace(/[.,!?;:]+$/, ''));
            setTimeout(() => {
              setShowModal(false);
            }, 300);
          }
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Unable to start microphone. Please check permissions.');
      setShowModal(true);
      playTone('cancel');
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      playTone('cancel');
      stopListening();
    } else {
      startListening();
    }
  };

  const suggestions = [
    'Show me gold rings',
    'Gold Shankha Badhano',
    'Show me bridal combos',
    'Mayur Mukhi Pola',
    'Show me 22K gold necklaces',
    'Loha Badhano'
  ];

  const handlePickSuggestion = (term: string) => {
    playTone('success');
    onTranscript(term);
    stopListening();
  };

  return (
    <>
      {/* Microphone Icon Button */}
      <button
        type="button"
        onClick={handleToggle}
        title={isListening ? 'Listening... click to stop' : 'Search by voice'}
        aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
          size === 'sm' ? 'w-6 h-6 p-1' : 'w-7 h-7 p-1.5'
        } ${
          isListening
            ? 'text-white bg-[#ff3e6c] shadow-md ring-2 ring-[#ff3e6c]/40 animate-pulse'
            : 'text-[#696e79] hover:text-[#ff3e6c] hover:bg-[#f5f5f6]'
        } ${className}`}
      >
        {isListening ? (
          <MicOff className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        ) : (
          <Mic className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        )}

        {/* Pulse effect indicator */}
        {isListening && (
          <span className="absolute -inset-1 rounded-full bg-[#ff3e6c]/20 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Voice Recognition Active Dialog / Overlay */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => {
            playTone('cancel');
            stopListening();
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => {
                playTone('cancel');
                stopListening();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close voice search"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#ff3e6c] border border-rose-100">
                <Sparkles className="w-3.5 h-3.5" />
                NaxtTo Atelier Voice Search
              </span>
            </div>

            {/* Status Heading & Live Microphone Pulsing Graphic */}
            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center mb-5">
                {isListening && (
                  <>
                    <div className="absolute w-24 h-24 rounded-full bg-[#ff3e6c]/15 animate-ping" />
                    <div className="absolute w-20 h-20 rounded-full bg-[#ff3e6c]/25 animate-pulse" />
                  </>
                )}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isListening
                      ? 'bg-gradient-to-tr from-[#ff3e6c] to-[#ff6b8b] text-white scale-110 shadow-rose-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1d1d1f]">
                {errorMessage
                  ? 'Voice Recognition Note'
                  : isListening
                  ? 'Listening for Jewellery...'
                  : 'Voice Search Ready'}
              </h3>

              {/* Dynamic Transcript display or Prompts */}
              <div className="mt-3 min-h-[44px] flex items-center justify-center px-4">
                {errorMessage ? (
                  <div className="flex items-start justify-center gap-2 text-rose-600 text-xs text-left bg-rose-50/80 p-3 rounded-xl border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                ) : interimText ? (
                  <p className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                    "{interimText}"
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-[#6e6e73]">
                    Speak clearly into your microphone. Say a jewellery name, metal, or style.
                  </p>
                )}
              </div>

              {/* Audio Wave Visualizer Bars */}
              {isListening && !errorMessage && (
                <div className="flex items-center justify-center gap-1.5 mt-5 h-7">
                  {[40, 75, 100, 60, 90, 45, 85, 30].map((height, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#ff3e6c] rounded-full animate-pulse"
                      style={{
                        height: `${height}%`,
                        animationDuration: `${0.5 + (i % 3) * 0.25}s`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Inspiration Pills */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                Or tap a suggested voice search
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handlePickSuggestion(suggestion)}
                    className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-rose-50 hover:text-[#ff3e6c] hover:border-rose-200 border border-gray-200 text-[#282c3f] rounded-full transition-all cursor-pointer font-medium"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              {errorMessage ? (
                <button
                  type="button"
                  onClick={startListening}
                  className="px-4 py-2 bg-[#ff3e6c] text-white text-xs font-bold rounded-xl hover:bg-[#e0355d] transition-all cursor-pointer"
                >
                  Try Again
                </button>
              ) : isListening ? (
                <button
                  type="button"
                  onClick={() => {
                    playTone('cancel');
                    stopListening();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
