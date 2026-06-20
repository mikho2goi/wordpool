import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

const COLORS = [
  "#dbeafe",
  "#dcfce7",
  "#fef9c3",
  "#fce7f3",
  "#ede9fe",
  "#ffedd5",
  "#cffafe",
];

// French food word -> Vietnamese meaning. Voice: fr-FR.
const frenchFood: [string, string][] = [
  ["pain", "bánh mì"],
  ["fromage", "phô mai"],
  ["beurre", "bơ"],
  ["lait", "sữa"],
  ["œuf", "trứng"],
  ["viande", "thịt"],
  ["poulet", "thịt gà"],
  ["porc", "thịt heo"],
  ["bœuf", "thịt bò"],
  ["poisson", "cá"],
  ["riz", "cơm / gạo"],
  ["pâtes", "mì ống"],
  ["pomme", "táo"],
  ["banane", "chuối"],
  ["orange", "cam"],
  ["fraise", "dâu tây"],
  ["raisin", "nho"],
  ["citron", "chanh"],
  ["pêche", "đào"],
  ["poire", "lê"],
  ["cerise", "anh đào"],
  ["ananas", "dứa"],
  ["pastèque", "dưa hấu"],
  ["melon", "dưa lưới"],
  ["tomate", "cà chua"],
  ["carotte", "cà rốt"],
  ["pomme de terre", "khoai tây"],
  ["oignon", "hành tây"],
  ["ail", "tỏi"],
  ["salade", "rau xà lách"],
  ["champignon", "nấm"],
  ["haricot", "đậu"],
  ["petit pois", "đậu Hà Lan"],
  ["maïs", "ngô / bắp"],
  ["concombre", "dưa chuột"],
  ["poivron", "ớt chuông"],
  ["épinard", "rau bina"],
  ["chou", "bắp cải"],
  ["brocoli", "bông cải xanh"],
  ["courgette", "bí ngòi"],
  ["aubergine", "cà tím"],
  ["sel", "muối"],
  ["poivre", "tiêu"],
  ["sucre", "đường"],
  ["huile", "dầu ăn"],
  ["vinaigre", "giấm"],
  ["farine", "bột mì"],
  ["miel", "mật ong"],
  ["confiture", "mứt"],
  ["chocolat", "sô cô la"],
  ["gâteau", "bánh ngọt"],
  ["tarte", "bánh tart"],
  ["crêpe", "bánh kếp"],
  ["glace", "kem"],
  ["yaourt", "sữa chua"],
  ["café", "cà phê"],
  ["thé", "trà"],
  ["eau", "nước"],
  ["vin", "rượu vang"],
  ["bière", "bia"],
  ["jus", "nước ép"],
  ["soupe", "súp"],
  ["sauce", "nước sốt"],
  ["baguette", "bánh mì baguette"],
  ["croissant", "bánh sừng bò"],
  ["jambon", "giăm bông"],
  ["saucisse", "xúc xích"],
  ["steak", "bít tết"],
  ["frites", "khoai tây chiên"],
  ["omelette", "trứng ốp lết"],
  ["quiche", "bánh quiche"],
  ["crème", "kem tươi"],
  ["escargot", "ốc sên"],
  ["huître", "hàu"],
  ["crevette", "tôm"],
  ["crabe", "cua"],
  ["homard", "tôm hùm"],
  ["moule", "trai / vẹm"],
  ["saumon", "cá hồi"],
  ["thon", "cá ngừ"],
  ["canard", "thịt vịt"],
  ["agneau", "thịt cừu non"],
  ["dinde", "gà tây"],
  ["lapin", "thịt thỏ"],
  ["noix", "quả óc chó"],
  ["amande", "hạnh nhân"],
  ["noisette", "hạt phỉ"],
  ["cacahuète", "đậu phộng"],
  ["olive", "ô liu"],
  ["basilic", "húng quế"],
  ["persil", "ngò tây"],
  ["menthe", "bạc hà"],
  ["cannelle", "quế"],
  ["gingembre", "gừng"],
  ["moutarde", "mù tạt"],
  ["mayonnaise", "sốt mayonnaise"],
  ["ketchup", "sốt cà chua"],
  ["repas", "bữa ăn"],
  ["déjeuner", "bữa trưa"],
  ["dîner", "bữa tối"],
];

// English communication word/phrase -> Vietnamese meaning. Voice: en-US.
const englishComm: [string, string][] = [
  ["hello", "xin chào"],
  ["goodbye", "tạm biệt"],
  ["please", "làm ơn"],
  ["thank you", "cảm ơn"],
  ["sorry", "xin lỗi"],
  ["yes", "vâng / có"],
  ["no", "không"],
  ["excuse me", "xin lỗi (cho phép)"],
  ["welcome", "chào mừng"],
  ["how are you", "bạn khỏe không"],
  ["fine", "ổn / khỏe"],
  ["nice to meet you", "rất vui được gặp bạn"],
  ["see you later", "hẹn gặp lại"],
  ["good morning", "chào buổi sáng"],
  ["good night", "chúc ngủ ngon"],
  ["help", "giúp đỡ"],
  ["understand", "hiểu"],
  ["question", "câu hỏi"],
  ["answer", "câu trả lời"],
  ["talk", "nói chuyện"],
  ["speak", "nói"],
  ["listen", "lắng nghe"],
  ["tell", "kể / nói cho"],
  ["ask", "hỏi"],
  ["explain", "giải thích"],
  ["agree", "đồng ý"],
  ["disagree", "không đồng ý"],
  ["opinion", "ý kiến"],
  ["idea", "ý tưởng"],
  ["meeting", "cuộc họp"],
  ["conversation", "cuộc trò chuyện"],
  ["message", "tin nhắn"],
  ["call", "cuộc gọi"],
  ["email", "thư điện tử"],
  ["introduce", "giới thiệu"],
  ["name", "tên"],
  ["friend", "bạn bè"],
  ["colleague", "đồng nghiệp"],
  ["boss", "sếp"],
  ["customer", "khách hàng"],
  ["appointment", "cuộc hẹn"],
  ["schedule", "lịch trình"],
  ["plan", "kế hoạch"],
  ["decision", "quyết định"],
  ["problem", "vấn đề"],
  ["solution", "giải pháp"],
  ["advice", "lời khuyên"],
  ["suggestion", "đề nghị"],
  ["request", "yêu cầu"],
  ["invitation", "lời mời"],
  ["confirm", "xác nhận"],
  ["cancel", "hủy bỏ"],
  ["apologize", "xin lỗi"],
  ["congratulations", "chúc mừng"],
  ["promise", "lời hứa"],
  ["agreement", "sự thỏa thuận"],
  ["discussion", "sự thảo luận"],
  ["feedback", "phản hồi"],
  ["report", "báo cáo"],
  ["presentation", "bài thuyết trình"],
  ["interview", "phỏng vấn"],
  ["negotiate", "đàm phán"],
  ["complain", "phàn nàn"],
  ["greet", "chào hỏi"],
  ["reply", "trả lời"],
  ["contact", "liên hệ"],
  ["discuss", "thảo luận"],
  ["inform", "thông báo"],
  ["remind", "nhắc nhở"],
  ["recommend", "giới thiệu / đề xuất"],
  ["accept", "chấp nhận"],
  ["refuse", "từ chối"],
  ["invite", "mời"],
  ["apology", "lời xin lỗi"],
  ["polite", "lịch sự"],
  ["rude", "thô lỗ"],
  ["clear", "rõ ràng"],
  ["confused", "bối rối"],
  ["busy", "bận"],
  ["available", "rảnh / có sẵn"],
  ["important", "quan trọng"],
  ["urgent", "khẩn cấp"],
  ["maybe", "có lẽ"],
  ["of course", "tất nhiên"],
  ["sure", "chắc chắn"],
  ["really", "thật sao / thật vậy"],
  ["exactly", "chính xác"],
  ["probably", "có lẽ"],
  ["however", "tuy nhiên"],
  ["because", "bởi vì"],
  ["therefore", "do đó"],
  ["although", "mặc dù"],
  ["for example", "ví dụ"],
  ["by the way", "nhân tiện"],
  ["in my opinion", "theo ý kiến tôi"],
  ["let me know", "cho tôi biết"],
  ["take care", "bảo trọng"],
  ["good luck", "chúc may mắn"],
  ["no problem", "không sao"],
];

async function seedDeck(
  deckName: string,
  lang: string,
  words: [string, string][]
) {
  const deck = await prisma.deck.upsert({
    where: { name: deckName },
    update: {},
    create: { name: deckName },
  });

  const existing = new Set(
    (
      await prisma.card.findMany({
        where: { deckId: deck.id },
        select: { word: true },
      })
    ).map((c) => c.word.toLowerCase())
  );

  let added = 0;
  let skipped = 0;
  let i = 0;
  for (const [word, meaning] of words) {
    if (existing.has(word.toLowerCase())) {
      skipped++;
      continue;
    }
    await prisma.card.create({
      data: {
        word,
        meaning,
        authorName: "WordPool",
        color: COLORS[i % COLORS.length],
        lang,
        deckId: deck.id,
      },
    });
    existing.add(word.toLowerCase());
    added++;
    i++;
  }
  console.log(`${deckName}: +${added} added, ${skipped} already there`);
}

async function main() {
  await seedDeck("French_Food", "fr-FR", frenchFood);
  await seedDeck("English_communication", "en-US", englishComm);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
