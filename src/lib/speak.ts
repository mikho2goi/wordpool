// Client-only speech helper. Picks an explicit voice for the target language
// so the OS default voice (which may be the wrong language) is never used.

function pickVoice(target: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const prefix = target.slice(0, 2).toLowerCase();
  return (
    voices.find((v) => v.lang.toLowerCase() === target.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en"))
  );
}

// Returns true if a voice for the language exists, false if it fell back.
export function speakText(text: string, lang: string): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    alert("Speech not supported in this browser.");
    return false;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? lang;
  window.speechSynthesis.speak(u);

  const prefix = lang.slice(0, 2).toLowerCase();
  return !!voice && voice.lang.toLowerCase().startsWith(prefix);
}
