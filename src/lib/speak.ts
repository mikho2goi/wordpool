// Client-only speech helper.
// 1) If the OS has a voice for the language → use Web Speech (instant, offline).
// 2) Otherwise → play audio from our /api/tts proxy (works for any language,
//    on any device, no install needed).

function localVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !window.speechSynthesis) return undefined;
  const prefix = lang.slice(0, 2).toLowerCase();
  return window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith(prefix));
}

export async function speakText(text: string, lang: string): Promise<void> {
  const clean = text.trim();
  if (!clean) return;

  const voice = localVoice(lang);
  if (voice) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.voice = voice;
    u.lang = voice.lang;
    window.speechSynthesis.speak(u);
    return;
  }

  // fallback: cloud TTS proxy
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
