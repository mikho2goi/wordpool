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
    logoutAll: "log out all",
    logoutAllHint: "Sign out of every device (revokes all your sessions)",
    admin: "Admin",
    adminBadge: "admin",
    exitAdmin: "exit admin",
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
    addToTest: "☆ add to test",
    inTest: "★ in test",
    saveTest: "💾 Save this test",
    saveTestPrompt: "Name this test:",
    savedOk: "Test saved! Find it in “My tests”.",
    signInToSave: "Sign in to save this test",
    myTests: "My tests",
    noSavedTests: "No saved tests yet. Pick words on a deck and save a test.",
    retake: "Retake",
    savedOn: "saved",
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
    ipa: "Phonetic (IPA)",
    ipaHint: "e.g. /bɔ̃ʒuʁ/",
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
    // edit card (admin)
    edit: "✎ Edit",
    editCard: "Edit card",
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    // search
    searchDecks: "Search decks…",
    noMatch: "No decks match your search.",
    // account
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    accountIntro: "Sign in with a secret passphrase — a sentence you can remember, not a complex password.",
    namePlaceholder: "e.g. alex",
    passphraseLabel: "Secret passphrase",
    passphrasePlaceholder: "e.g. the cat eats rice in the morning — a memorable phrase, not a complex password",
    passphraseHint: "Pick a sentence only you would think of. Easy to remember, hard to guess. (at least 8 characters)",
    enterNameAndPass: "Enter your name and passphrase.",
    somethingWrong: "Something went wrong.",
    pleaseWait: "Please wait…",
    noAccountCreate: "No account? Create one",
    haveAccountSignIn: "Have an account? Sign in",
    // deck edit
    deckNameLabel: "Deck name",
    levelLabel: "Level",
    levelNone: "— no level —",
    fromLangLabel: "Word language (From)",
    toLangLabel: "Meaning language (To)",
  },
  vi: {
    addCard: "+ Thêm thẻ",
    signIn: "Đăng nhập",
    logout: "đăng xuất",
    logoutAll: "đăng xuất tất cả",
    logoutAllHint: "Đăng xuất khỏi mọi thiết bị (thu hồi tất cả phiên đăng nhập)",
    admin: "Quản trị",
    adminBadge: "quản trị",
    exitAdmin: "thoát quản trị",
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
    addToTest: "☆ thêm vào bài kiểm tra",
    inTest: "★ đã thêm",
    saveTest: "💾 Lưu bài kiểm tra này",
    saveTestPrompt: "Đặt tên cho bài kiểm tra:",
    savedOk: "Đã lưu! Xem trong “Bài của tôi”.",
    signInToSave: "Đăng nhập để lưu bài kiểm tra",
    myTests: "Bài của tôi",
    noSavedTests: "Chưa có bài nào. Chọn từ ở một bộ thẻ rồi lưu bài kiểm tra.",
    retake: "Làm lại",
    savedOn: "đã lưu",
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
    ipa: "Phiên âm (IPA)",
    ipaHint: "ví dụ: /bɔ̃ʒuʁ/",
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
    edit: "✎ Sửa",
    editCard: "Sửa thẻ",
    save: "Lưu",
    saving: "Đang lưu…",
    cancel: "Hủy",
    searchDecks: "Tìm bộ thẻ…",
    noMatch: "Không có bộ thẻ nào khớp.",
    welcomeBack: "Chào mừng trở lại",
    createAccount: "Tạo tài khoản",
    accountIntro: "Đăng nhập bằng một cụm từ bí mật — một câu bạn dễ nhớ, không phải mật khẩu phức tạp.",
    namePlaceholder: "ví dụ: thien",
    passphraseLabel: "Cụm từ bí mật",
    passphrasePlaceholder: "ví dụ: mèo ăn cơm buổi sáng — một câu dễ nhớ, không phải mật khẩu phức tạp",
    passphraseHint: "Chọn một câu chỉ mình bạn nghĩ ra. Dễ nhớ, khó đoán. (ít nhất 8 ký tự)",
    enterNameAndPass: "Nhập tên và cụm từ bí mật của bạn.",
    somethingWrong: "Đã có lỗi xảy ra.",
    pleaseWait: "Vui lòng đợi…",
    noAccountCreate: "Chưa có tài khoản? Tạo ngay",
    haveAccountSignIn: "Đã có tài khoản? Đăng nhập",
    deckNameLabel: "Tên bộ thẻ",
    levelLabel: "Cấp độ",
    levelNone: "— không có cấp độ —",
    fromLangLabel: "Ngôn ngữ từ (Từ)",
    toLangLabel: "Ngôn ngữ nghĩa (Đến)",
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
      className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md active:scale-95"
    >
      {lang === "en" ? "🇻🇳 VI" : "🇬🇧 EN"}
    </button>
  );
}
