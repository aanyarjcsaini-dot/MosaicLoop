# Voice status

- Voice notes: IMPLEMENTED via browser SpeechRecognition where available (Chrome desktop/Android). Falls back to text with reason. No audio stored.
- Live conversational voice: PARTIAL. `Live talk` uses speechSynthesis greeting + recognition turn where supported, with listening/processing/speaking/error states. True duplex realtime needs one of: OpenAI Realtime / Deepgram + TTS subscription + `VITE_VOICE_*` keys + HTTPS mic permission. Not configured — no keys in repo.
- Required to finish: pick provider, add keys to Vercel env (never commit), HTTPS origin, mic consent copy already in UI.
