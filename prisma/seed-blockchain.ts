// Seed 3 blockchain study decks (EN term -> Vietnamese meaning).
// Idempotent: deck upsert by unique name; cards inserted only if the deck is
// still empty, so re-running won't duplicate.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

const AUTHOR = "seed-blockchain";

type Seed = { word: string; meaning: string; explanation?: string; ipa?: string };

const basics: Seed[] = [
  { word: "Blockchain", meaning: "Chuỗi khối — sổ cái phân tán ghi dữ liệu thành các khối nối tiếp", explanation: "A blockchain is an append-only chain of blocks shared across many nodes." },
  { word: "Block", meaning: "Khối — nhóm giao dịch được gộp lại và thêm vào chuỗi", explanation: "Each block bundles transactions plus a reference to the previous block." },
  { word: "Hash", meaning: "Hàm băm — chuỗi ký tự cố định đại diện cho dữ liệu đầu vào", explanation: "Changing one bit of input changes the whole hash output." },
  { word: "Ledger", meaning: "Sổ cái — bản ghi toàn bộ giao dịch", explanation: "Everyone holds a copy of the same distributed ledger." },
  { word: "Node", meaning: "Nút mạng — máy tính lưu và xác thực bản sao blockchain", explanation: "Full nodes validate every transaction independently." },
  { word: "Transaction", meaning: "Giao dịch — lệnh chuyển giá trị hoặc dữ liệu trên mạng", explanation: "A transaction is signed by the sender's private key." },
  { word: "Wallet", meaning: "Ví — công cụ giữ khóa và quản lý tài sản số", explanation: "A wallet stores keys, not the coins themselves." },
  { word: "Private key", meaning: "Khóa riêng tư — bí mật dùng để ký giao dịch, không được chia sẻ" },
  { word: "Public key", meaning: "Khóa công khai — địa chỉ người khác dùng để gửi tài sản cho bạn" },
  { word: "Address", meaning: "Địa chỉ — định danh ví, rút gọn từ khóa công khai" },
  { word: "Mining", meaning: "Đào — quá trình tạo khối mới bằng sức tính toán", explanation: "Miners compete to find a valid hash and earn a block reward." },
  { word: "Decentralization", meaning: "Phi tập trung — không có bên trung tâm kiểm soát mạng" },
  { word: "Cryptocurrency", meaning: "Tiền mã hóa — tài sản số dùng mật mã để bảo mật", ipa: "ˌkrɪptoʊˈkʌrənsi" },
  { word: "Genesis block", meaning: "Khối khởi nguyên — khối đầu tiên của một blockchain" },
  { word: "Immutable", meaning: "Bất biến — dữ liệu đã ghi không thể sửa hay xóa", ipa: "ɪˈmjuːtəbl" },
  { word: "Consensus", meaning: "Đồng thuận — cách các nút thống nhất về trạng thái sổ cái", ipa: "kənˈsɛnsəs" },
  { word: "Peer-to-peer (P2P)", meaning: "Mạng ngang hàng — các nút kết nối trực tiếp, không qua máy chủ trung tâm" },
  { word: "Fork", meaning: "Phân nhánh — khi chuỗi tách thành hai đường do thay đổi quy tắc" },
];

const defi: Seed[] = [
  { word: "DeFi", meaning: "Tài chính phi tập trung — dịch vụ tài chính chạy trên hợp đồng thông minh", explanation: "Decentralized Finance replaces banks with smart contracts." },
  { word: "Smart contract", meaning: "Hợp đồng thông minh — mã tự động thực thi khi đủ điều kiện", explanation: "Code is law: the contract runs exactly as written, no middleman." },
  { word: "Gas", meaning: "Phí tính toán trả cho mạng để thực thi giao dịch/hợp đồng", explanation: "Gas measures the work a transaction costs the network." },
  { word: "Token", meaning: "Token — tài sản số phát hành trên một blockchain có sẵn" },
  { word: "ERC-20", meaning: "Chuẩn token thay thế được (fungible) trên Ethereum", explanation: "Most stablecoins and governance tokens follow ERC-20." },
  { word: "NFT", meaning: "Token không thể thay thế — đại diện tài sản độc nhất", ipa: "ˌɛn ɛf ˈtiː" },
  { word: "Liquidity pool", meaning: "Bể thanh khoản — quỹ token khóa lại để cho phép giao dịch tự động" },
  { word: "AMM", meaning: "Nhà tạo lập thị trường tự động — định giá bằng công thức thay vì sổ lệnh", explanation: "An AMM uses a formula like x*y=k to price swaps." },
  { word: "Yield farming", meaning: "Canh tác lợi suất — cung cấp thanh khoản để nhận phần thưởng" },
  { word: "Staking", meaning: "Đặt cọc — khóa token để bảo vệ mạng và nhận thưởng" },
  { word: "Stablecoin", meaning: "Đồng ổn định — token neo giá theo tài sản như USD" },
  { word: "Collateral", meaning: "Tài sản thế chấp — khóa lại để vay hoặc đúc stablecoin", ipa: "kəˈlætərəl" },
  { word: "Liquidation", meaning: "Thanh lý — bán tài sản thế chấp khi giá trị xuống dưới ngưỡng" },
  { word: "Oracle", meaning: "Tiên tri — dịch vụ đưa dữ liệu ngoài đời thực vào hợp đồng thông minh", explanation: "Chainlink is the most used price oracle." },
  { word: "Slippage", meaning: "Trượt giá — chênh lệch giữa giá kỳ vọng và giá thực hiện" },
  { word: "Impermanent loss", meaning: "Tổn thất tạm thời — thua lỗ khi cung cấp thanh khoản do giá biến động" },
  { word: "DEX", meaning: "Sàn phi tập trung — giao dịch trực tiếp ví-tới-ví qua hợp đồng" },
  { word: "DAO", meaning: "Tổ chức tự trị phi tập trung — quản trị bằng biểu quyết on-chain" },
];

const advanced: Seed[] = [
  { word: "Proof of Work", meaning: "Bằng chứng công việc — đồng thuận dựa trên sức tính toán đào", explanation: "PoW secures Bitcoin by making attacks expensive." },
  { word: "Proof of Stake", meaning: "Bằng chứng cổ phần — đồng thuận dựa trên token đặt cọc", explanation: "PoS picks validators by stake, not by hash power." },
  { word: "Validator", meaning: "Trình xác thực — nút đặt cọc để đề xuất và duyệt khối trong PoS" },
  { word: "Merkle tree", meaning: "Cây Merkle — cấu trúc băm cho phép kiểm tra dữ liệu hiệu quả", ipa: "ˈmɜːrkl" },
  { word: "Nonce", meaning: "Số dùng một lần — giá trị thợ đào thay đổi để tìm hash hợp lệ" },
  { word: "Double spending", meaning: "Chi tiêu hai lần — gian lận dùng cùng một đồng coin hai lần" },
  { word: "51% attack", meaning: "Tấn công 51% — kiểm soát đa số sức mạng để viết lại lịch sử" },
  { word: "Finality", meaning: "Tính chung cuộc — thời điểm giao dịch không thể bị đảo ngược" },
  { word: "Layer 2", meaning: "Lớp 2 — mạng phụ xử lý giao dịch ngoài chuỗi chính để tăng tốc" },
  { word: "Rollup", meaning: "Gộp giao dịch ngoài chuỗi rồi đăng bằng chứng lên chuỗi chính" },
  { word: "Zero-knowledge proof", meaning: "Bằng chứng không tiết lộ — chứng minh điều đúng mà không lộ dữ liệu", explanation: "ZK proofs power private and scalable rollups." },
  { word: "Sharding", meaning: "Phân mảnh — chia mạng thành phần nhỏ để xử lý song song" },
  { word: "Reentrancy", meaning: "Tái nhập — lỗ hổng khi hợp đồng bị gọi lại trước khi hoàn tất", explanation: "The DAO hack of 2016 exploited reentrancy." },
  { word: "Gas optimization", meaning: "Tối ưu gas — viết hợp đồng tốn ít phí thực thi hơn" },
  { word: "Mempool", meaning: "Hàng chờ giao dịch chưa được đưa vào khối" },
  { word: "MEV", meaning: "Giá trị tối đa rút được — lợi nhuận từ việc sắp xếp lại giao dịch trong khối" },
  { word: "Bridge", meaning: "Cầu nối — chuyển tài sản giữa các blockchain khác nhau" },
  { word: "Audit", meaning: "Kiểm toán — rà soát mã hợp đồng để tìm lỗ hổng bảo mật" },
];

async function seedDeck(
  name: string,
  level: string,
  cards: Seed[],
) {
  const deck = await prisma.deck.upsert({
    where: { name },
    update: { level, sourceLang: "en-US", targetLang: "vi-VN" },
    create: { name, level, sourceLang: "en-US", targetLang: "vi-VN" },
  });

  const existing = await prisma.card.count({ where: { deckId: deck.id } });
  if (existing > 0) {
    console.log(`Skip "${name}" — already has ${existing} cards.`);
    return;
  }

  await prisma.card.createMany({
    data: cards.map((c) => ({
      word: c.word,
      meaning: c.meaning,
      explanation: c.explanation ?? null,
      ipa: c.ipa ?? null,
      authorName: AUTHOR,
      lang: "en-US",
      deckId: deck.id,
    })),
  });
  console.log(`Seeded "${name}" with ${cards.length} cards.`);
}

async function main() {
  await seedDeck("English_Basic_Blockchain", "Basic", basics);
  await seedDeck("English_Inter_DeFi", "Intermediate", defi);
  await seedDeck("English_Advanced_Crypto", "Advanced", advanced);
  console.log("Done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
