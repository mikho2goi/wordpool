"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Lang = "en" | "vi";

const STRINGS = {
  en: {
    // nav / bars
    addCard: "+ Add card",
    signIn: "Sign in",
    logout: "log out",
    admin: "Admin",
    adminBadge: "admin",
    back: "← Back",
    allDecks: "← All decks",
    // home
    tagline: "A shared deck of flashcards. Anyone can add a word — everyone studies it.",
    noDecks: "No decks yet.",
    addFirst: "Add the first card",
    word: "word",
    words: "words",
    // deck page
    noCardsDeck: "No cards in this deck yet.",
    addOne: "Add one",
    // study
    tapReveal: "tap to reveal",
    tapHide: "tap to hide",
    speak: "🔊 speak",
    addedBy: "added by",
    delete: "Delete",
    deleting: "deleting…",
    prev: "← Prev",
    next: "Next →",
    tip: "Tip: space to flip, ← → to navigate",
    allWords: "All words",
    picked: "picked",
    studyPicked: "Study picked",
    studyingPicked: "Studying picked ✓",
    clear: "clear",
    testMemory: "📝 Test memory",
    testPicked: "📝 Test picked",
    noWordsSelected: "No words selected.",
    allRemoved: "All cards removed from this deck.",
    // test mode
    yourScore: "Your score",
    review: "Review",
    youWrote: "you wrote:",
    retry: "Retry",
    backToStudy: "Back to study",
    typeWordThatMeans: "Type the word that means",
    yourAnswer: "your answer…",
    correct: "✓ Correct!",
    answerIs: "✗ Answer:",
    check: "Check",
    seeResult: "See result",
    quit: "quit",
    // add page
    addFlashcard: "Add a flashcard",
    deck: "Deck",
    chooseDeck: "— choose a deck —",
    newDeckOption: "+ New deck…",
    newDeckName: "New deck name",
    yourName: "Your name",
    wordLabel: "Word",
    meaning: "Meaning",
    explanation: "Explanation / example",
    optional: "(optional)",
    cardColor: "Card color",
    voice: "Pronunciation voice",
    testVoice: "🔊 Test",
    voiceHint: "Speaks the word (or “Hello”) in the chosen voice.",
    addBtn: "Add card",
    adding: "Adding…",
    dupBtn: "Duplicate word",
    alreadyDeckWarn: "Already in this deck — pick a different word.",
    alreadyHere: "Already in this deck:",
    livePreview: "Live preview",
    addedMsg: "Added! Add another, or",
    goToDecks: "go to decks",
  },
  vi: {
    addCard: "+ Thêm thẻ",
    signIn: "Đăng nhập",
    logout: "đăng xuất",
    admin: "Quản trị",
    adminBadge: "quản trị",
    back: "← Quay lại",
    allDecks: "← Tất cả bộ thẻ",
    tagline: "Bộ thẻ học chung. Ai cũng có thể thêm từ — mọi người cùng học.",
    noDecks: "Chưa có bộ thẻ nào.",
    addFirst: "Thêm thẻ đầu tiên",
    word: "từ",
    words: "từ",
    noCardsDeck: "Bộ thẻ này chưa có thẻ nào.",
    addOne: "Thêm một thẻ",
    tapReveal: "chạm để xem",
    tapHide: "chạm để ẩn",
    speak: "🔊 đọc",
    addedBy: "thêm bởi",
    delete: "Xóa",
    deleting: "đang xóa…",
    prev: "← Trước",
    next: "Tiếp →",
    tip: "Mẹo: phím cách để lật, ← → để chuyển",
    allWords: "Tất cả từ",
    picked: "đã chọn",
    studyPicked: "Học từ đã chọn",
    studyingPicked: "Đang học từ đã chọn ✓",
    clear: "bỏ chọn",
    testMemory: "📝 Kiểm tra trí nhớ",
    testPicked: "📝 Kiểm tra từ đã chọn",
    noWordsSelected: "Chưa chọn từ nào.",
    allRemoved: "Đã xóa hết thẻ trong bộ này.",
    yourScore: "Điểm của bạn",
    review: "Xem lại",
    youWrote: "bạn viết:",
    retry: "Làm lại",
    backToStudy: "Quay lại học",
    typeWordThatMeans: "Gõ từ có nghĩa là",
    yourAnswer: "câu trả lời của bạn…",
    correct: "✓ Đúng!",
    answerIs: "✗ Đáp án:",
    check: "Kiểm tra",
    seeResult: "Xem kết quả",
    quit: "thoát",
    addFlashcard: "Thêm thẻ học",
    deck: "Bộ thẻ",
    chooseDeck: "— chọn bộ thẻ —",
    newDeckOption: "+ Bộ thẻ mới…",
    newDeckName: "Tên bộ thẻ mới",
    yourName: "Tên của bạn",
    wordLabel: "Từ",
    meaning: "Nghĩa",
    explanation: "Giải thích / ví dụ",
    optional: "(không bắt buộc)",
    cardColor: "Màu thẻ",
    voice: "Giọng phát âm",
    testVoice: "🔊 Nghe thử",
    voiceHint: "Đọc từ (hoặc “Hello”) bằng giọng đã chọn.",
    addBtn: "Thêm thẻ",
    adding: "Đang thêm…",
    dupBtn: "Từ trùng",
    alreadyDeckWarn: "Đã có trong bộ thẻ — chọn từ khác.",
    alreadyHere: "Đã có trong bộ thẻ:",
    livePreview: "Xem trước",
    addedMsg: "Đã thêm! Thêm tiếp, hoặc",
    goToDecks: "về bộ thẻ",
  },
} as const;

type Key = keyof (typeof STRINGS)["en"];

const Ctx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}>({ lang: "en", setLang: () => {}, t: (k) => STRINGS.en[k] });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "vi" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const t = useCallback((k: Key) => STRINGS[lang][k] ?? STRINGS.en[k] ?? k, [
    lang,
  ]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "vi" : "en")}
      aria-label="Toggle language"
      className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
    >
      {lang === "en" ? "🇻🇳 VI" : "🇬🇧 EN"}
    </button>
  );
}
