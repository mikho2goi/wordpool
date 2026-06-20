// Free TTS proxy: streams audio for any language so the client doesn't depend
// on OS-installed voices. Uses Google Translate's tts endpoint (no API key).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") ?? "").slice(0, 200);
  const lang = (searchParams.get("lang") ?? "en").slice(0, 5).toLowerCase();

  if (!text.trim()) {
    return new Response("missing text", { status: 400 });
  }

  const url =
    "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob" +
    `&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!upstream.ok) {
      return new Response("tts upstream error", { status: 502 });
    }

    const audio = await upstream.arrayBuffer();
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("tts fetch failed", { status: 502 });
  }
}
