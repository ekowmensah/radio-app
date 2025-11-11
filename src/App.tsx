import { useState, useRef, useEffect } from 'react'
// @ts-ignore - Radio is used in error fallback HTML string
import { Play, Pause, Volume2, VolumeX, Radio, Circle, Phone, MessageCircle, Mail, Facebook, Twitter, Instagram, Youtube, Linkedin, Download, X } from 'lucide-react'

function App() {
  // Radio station configuration
  const RADIO_STREAM_URL = 'https://stream.zeno.fm/2u50hha1nceuv'
  const STATION_NAME = 'Hope FM - 99.9Mhz'
  const STATION_TAGLINE = 'Enidaso Fie!'
  const LOGO_URL = '/radioapp/logo.svg' // Update with your logo path
  
  // RDS-style program schedule - Update with your actual programs
  const PROGRAMS = [
    { time: '06:00', name: 'Morning Show', host: 'DJ Morning' },
    { time: '09:00', name: 'Mid-Morning Vibes', host: 'Sarah K' },
    { time: '12:00', name: 'Midday News', host: 'via Peace FM' },
    { time: '13:00', name: 'Hope Afternoon Sports', host: 'Fabiano' },
    { time: '15:00', name: 'Drive Time', host: 'DJ Trak' },
    { time: '18:00', name: 'Evening News', host: 'via Peace FM' },
    { time: '21:00', name: 'Night Grooves', host: 'DJ Night' },
  ]
  
  // Contact configuration - Update these with your actual contact details
  const PHONE_NUMBER = '+233303937199'
  const WHATSAPP_NUMBER = '+233545017083'
  const SMS_NUMBER = '+233545017083'
  const WHATSAPP_MESSAGE = 'Hello! I am listening to Hope FM 99.9Mhz.'
  
  // Social media links - Update with your actual social media URLs
  const SOCIAL_LINKS = {
    facebook: 'https://facebook.com/hopefm999',
    twitter: '#',
    instagram: '#',
    youtube: '#',
    linkedin: '#'
  }

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentProgram, setCurrentProgram] = useState({ name: 'Loading...', host: '' })
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Autoplay on mount
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          setIsLoading(true)
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.log('Autoplay prevented by browser:', error)
          // Autoplay blocked - user will need to click play
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    attemptAutoplay()
  }, [])

  // Update current program based on time (RDS simulation)
  useEffect(() => {
    const updateCurrentProgram = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      // Find the current program
      let current = { name: 'Hope FM - On Air', host: '' } // Default when no program scheduled
      for (let i = 0; i < PROGRAMS.length; i++) {
        if (currentTime >= PROGRAMS[i].time) {
          current = PROGRAMS[i]
        } else {
          break
        }
      }
      
      setCurrentProgram(current)
    }

    updateCurrentProgram()
    const interval = setInterval(updateCurrentProgram, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsLoading(true)
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (isMuted && newVolume > 0) {
      setIsMuted(false)
      if (audioRef.current) {
        audioRef.current.muted = false
      }
    }
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleWaiting = () => {
    setIsLoading(true)
  }

  const handleError = () => {
    setIsLoading(false)
    setIsPlaying(false)
    console.error('Error loading audio stream')
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      setIsRecording(false)
      setRecordingTime(0)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const chunks: BlobPart[] = []

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `radio-recording-${Date.now()}.webm`
          a.click()
          stream.getTracks().forEach(track => track.stop())
        }

        mediaRecorder.start()
        mediaRecorderRef.current = mediaRecorder
        setIsRecording(true)
        
        // Start timer
        recordingIntervalRef.current = window.setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } catch (error) {
        console.error('Error starting recording:', error)
        alert('Could not access microphone. Please grant permission.')
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`
  }

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank')
  }

  const handleSMS = () => {
    window.location.href = `sms:${SMS_NUMBER}`
  }

  const openSocialLink = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <audio
        ref={audioRef}
        src={RADIO_STREAM_URL}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
        preload="none"
      />

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border-2 border-blue-500">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">Install Hope FM App</h3>
              <p className="text-xs text-gray-600">Get quick access and listen offline!</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismissInstall}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* Main Player Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Section with Logo and Royal Blue Theme */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiA0NGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-2">
                <div className={`relative ${isPlaying ? 'animate-pulse-slow' : ''}`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl overflow-hidden">
                    <img 
                      src={LOGO_URL} 
                      alt={STATION_NAME}
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 text-blue-600" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>'
                        }
                      }}
                    />
                  </div>
                  {isPlaying && (
                    <>
                      <div className="absolute inset-0 w-16 h-16 bg-white rounded-full animate-ping opacity-20"></div>
                      <div className="absolute -inset-1 w-18 h-18 bg-white rounded-full animate-ping opacity-10" style={{ animationDuration: '2s' }}></div>
                    </>
                  )}
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-white mb-0.5 drop-shadow-lg">{STATION_NAME}</h1>
              <p className="text-blue-100 text-xs mb-2 font-medium">{STATION_TAGLINE}</p>
              
              {/* RDS Display - Current Program */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 mb-2 border border-white/30">
                <div className="flex items-center justify-center gap-2 text-white">
                  <div className="flex-1 text-left">
                    <div className="text-[10px] font-semibold opacity-80">NOW PLAYING</div>
                    <div className="text-xs font-bold truncate">{currentProgram.name}</div>
                    {currentProgram.host && (
                      <div className="text-[10px] opacity-90">with {currentProgram.host}</div>
                    )}
                  </div>
                  {isPlaying && (
                    <div className="flex gap-1">
                      <div className="w-1 h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  )}
                </div>
              </div>
              
              {isPlaying && (
                <div className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  LIVE ON AIR
                </div>
              )}
            </div>
          </div>

          {/* Player Controls Section */}
          <div className="p-3">
            
            {/* Main Play Button */}
            <div className="flex justify-center mb-3">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ring-2 ring-blue-200"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 text-white" fill="white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="bg-blue-50 rounded-2xl p-3 mb-3 border border-blue-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMute}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-100 rounded-lg"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #2563eb 0%, #1d4ed8 ${volume}%, #bfdbfe ${volume}%, #bfdbfe 100%)`
                    }}
                  />
                </div>

                <span className="text-blue-900 text-sm font-bold w-12 text-right bg-blue-100 px-2 py-1 rounded-lg">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Record Button */}
            <div className="mb-3">
              <button
                onClick={toggleRecording}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Circle className={`w-5 h-5 ${isRecording ? 'fill-white animate-pulse' : ''}`} />
                {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Start Recording'}
              </button>
              {isRecording && (
                <p className="text-xs text-gray-500 text-center mt-2 font-medium">
                  Recording will be saved to your downloads
                </p>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={handleCall}
                className="bg-green-600 hover:bg-green-700 text-white py-2.5 px-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span className="text-[10px] font-bold">Call Us</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white py-2.5 px-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>
              <button
                onClick={handleSMS}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-2 rounded-xl transition-all duration-300 flex flex-col items-center gap-1 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span className="text-[10px] font-bold">SMS</span>
              </button>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-gray-200 pt-2">
              <h3 className="text-center text-gray-700 font-bold mb-2 text-[10px] uppercase tracking-wide">Connect With Us</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => openSocialLink(SOCIAL_LINKS.facebook)}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" fill="white" />
                </button>
                <button
                  onClick={() => openSocialLink(SOCIAL_LINKS.twitter)}
                  className="w-9 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" fill="white" />
                </button>
                <button
                  onClick={() => openSocialLink(SOCIAL_LINKS.instagram)}
                  className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openSocialLink(SOCIAL_LINKS.youtube)}
                  className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" fill="white" />
                </button>
                <button
                  onClick={() => openSocialLink(SOCIAL_LINKS.linkedin)}
                  className="w-9 h-9 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" fill="white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-2 text-white/90 text-[10px]">
          <p className="font-semibold drop-shadow">© 2024 {STATION_NAME}</p>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1d4ed8;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #1e40af;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1d4ed8;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #1e40af;
        }
      `}</style>
    </div>
  )
}

export default App
