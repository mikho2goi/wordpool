// Client-only speech helper.
// 1) If the OS has a voice for the language → use Web Speech (instant, offline).
// 2) Otherwise → play audio from our /api/tts proxy (works for any language).
//
// Voices load asynchronously, so we warm them up early and wait for them on the
// first call — otherwise the first click (voices empty) falls back to the cloud
// voice while later clicks use a local voice, giving an inconsistent voice.

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  return window.speechSynthesis;
}

// kick the voice list to load as soon as this module is used on the client
const s = synth();
if (s) {
  s.getVoices();
  s.addEventListener?.("voiceschanged", () => s.getVoices());
}

function localVoice(lang: string): SpeechSynthesisVoice | undefined {
  const sp = synth();
  if (!sp) return undefined;
  const prefix = lang.slice(0, 2).toLowerCase();
  return sp.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix));
}

// resolve once the browser has loaded its voices (or after a short timeout)
function voicesReady(): Promise<void> {
  const sp = synth();
  if (!sp || sp.getVoices().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      sp.removeEventListener?.("voiceschanged", done);
      resolve();
    };
    sp.addEventListener?.("voiceschanged", done);
    setTimeout(done, 600); // fallback so we never hang
  });
}

export async function speakText(text: string, lang: string): Promise<void> {
  const clean = text.trim();
  if (!clean) return;
  const sp = synth();

  if (sp) {
    let voice = localVoice(lang);
    if (!voice && sp.getVoices().length === 0) {
      await voicesReady(); // first call: wait for voices instead of falling to cloud
      voice = localVoice(lang);
    }
    if (voice) {
      sp.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.voice = voice;
      u.lang = voice.lang;
      sp.speak(u);
      return;
    }
  }

  // fallback: cloud TTS proxy (no local voice for this language)
  try {
    const prefix = lang.slice(0, 2).toLowerCase();
    const audio = new Audio(
      `/api/tts?text=${encodeURIComponent(clean)}&lang=${encodeURIComponent(prefix)}`
    );
    await audio.play();
  } catch {
    alert("Could not play audio for that language.");
  }
}
