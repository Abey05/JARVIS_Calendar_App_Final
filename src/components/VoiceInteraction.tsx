import React, { useEffect, useRef, useState } from 'react'

const VoiceInteraction: React.FC = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const speak = (text: string) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = synth.getVoices().find(v => v.name.includes('Google') || v.default) || null
    synth.speak(utterance)
  }

  const handleCommand = (text: string) => {
    const command = text.toLowerCase()
    setLog((prev) => [...prev, `🗣️ You said: "${text}"`])

    if (command.includes('weather')) {
      speak('Today\'s forecast is sunny with clear skies. Highs near 75 degrees.')
    } else if (command.includes('time')) {
      const now = new Date()
      speak(`It is currently ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)
    } else if (command.includes('news')) {
      speak('Latest headline: Stark Expo opens with breakthrough in clean energy.')
    } else if (command.includes('hello') || command.includes('hi')) {
      speak('Hello. I am always at your service.')
    } else if (command.includes('task') || command.includes('calendar')) {
      speak('You have multiple tasks scheduled. Open the sidebar to view them.')
    } else {
      speak('I did not understand that. Please try again.')
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speak('Speech recognition is not supported in this browser.')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition: SpeechRecognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      speak('Voice command activated. You may speak.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (e: any) => {
      speak('There was an error accessing your microphone.')
      console.error(e)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.resultIndex]
      if (lastResult.isFinal) {
        handleCommand(lastResult[0].transcript)
      }
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800 p-4 rounded-xl shadow-xl border border-blue-600 w-[300px] z-50">
      <h3 className="text-blue-300 text-sm font-semibold mb-2">🎤 JARVIS Voice Assistant</h3>
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-full px-4 py-2 rounded-md font-semibold text-sm ${
          isListening ? 'bg-red-600' : 'bg-blue-600'
        } hover:opacity-90 transition`}
      >
        {isListening ? '🛑 Stop Listening' : '🎙️ Activate Voice'}
      </button>

      <div className="mt-3 max-h-28 overflow-y-auto text-xs text-slate-300 space-y-1">
        {log.slice(-5).map((entry, idx) => (
          <div key={idx}>{entry}</div>
        ))}
      </div>
    </div>
  )
}

export default VoiceInteraction
