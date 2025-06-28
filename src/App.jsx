import React, { useState, useEffect, useRef } from 'react';
import Icons from '../public/speak-icons'

function App() {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const utteranceRef = useRef(null);
  const [femaleVoice, setFemaleVoice] = useState(null);

useEffect(() => {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices); // 👈 Check what voices you get
    const female = voices.find(v => /female|woman|zira|susan|google/i.test(v.name));
    setFemaleVoice(female || voices[0]);
  };

  // Some browsers load voices asynchronously
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices(); // Also call once immediately
}, []);


  // Timer when speaking
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isSpeaking, isPaused]);

  const speakText = () => {
    if (text.trim() === '') {
      alert('Text is empty.');
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any ongoing speech
      setTimer(0);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = femaleVoice;
      utterance.onend = () => {
        setIsSpeaking(false);
        setTimer(0);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    } else {
      alert('Sorry, your browser does not support text-to-speech');
    }
  };

  // const pauseSpeech = () => {
  //   if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
  //     window.speechSynthesis.pause();
  //     setIsPaused(true);
  //   }
  // };

  // const resumeSpeech = () => {
  //   if (window.speechSynthesis.paused) {
  //     window.speechSynthesis.resume();
  //     setIsPaused(false);
  //   }
  // };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setTimer(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">🗣️ Text to Speech Converter</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak"
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-4"
        />
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <button
            onClick={speakText}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700"
          >
            🔊 Speak
          </button>
{/*       <button
            onClick={pauseSpeech}
            disabled={!isSpeaking || isPaused}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            ⏸ Pause
          </button>
          <button
            onClick={resumeSpeech}
            disabled={!isSpeaking || !isPaused}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            ▶️ Resume
          </button> */}
          <button
            onClick={stopSpeech}
            disabled={!isSpeaking}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            🛑 Stop
          </button>
        </div>
        <div className="text-gray-700">
          ⏱ Speaking for: <span className="font-semibold text-indigo-600">{timer}</span> seconds
        </div>
      </div>
    </div>
  );
}

export default App;
