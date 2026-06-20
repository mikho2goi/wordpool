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

// Rich card tuple: [word, meaning (Vietnamese), ipa, explanation (Vietnamese)]
type Card4 = [string, string, string, string];

// ===== English_Basic_Life (en-US) — 100 everyday-life words =====
const englishBasicLife: Card4[] = [
  ["time", "thời gian", "/taɪm/", "Danh từ chỉ thời gian nói chung. 'What time is it?' = Mấy giờ rồi?"],
  ["day", "ngày", "/deɪ/", "Một ngày 24 giờ. 'today' = hôm nay, 'every day' = mỗi ngày."],
  ["night", "đêm", "/naɪt/", "Khoảng tối từ tối đến sáng. 'Good night' = chúc ngủ ngon."],
  ["morning", "buổi sáng", "/ˈmɔːrnɪŋ/", "'in the morning' = vào buổi sáng. 'Good morning' = chào buổi sáng."],
  ["week", "tuần", "/wiːk/", "7 ngày. 'last week' = tuần trước, 'next week' = tuần sau."],
  ["month", "tháng", "/mʌnθ/", "Một trong 12 tháng. Phát âm 'th' giọng gió."],
  ["year", "năm", "/jɪr/", "12 tháng. 'this year' = năm nay."],
  ["hour", "giờ (tiếng)", "/ˈaʊər/", "60 phút. 'h' câm, đọc như 'our'."],
  ["minute", "phút", "/ˈmɪnɪt/", "60 giây. 'Wait a minute' = đợi một chút."],
  ["water", "nước", "/ˈwɔːtər/", "Chất lỏng để uống. 'a glass of water' = một ly nước."],
  ["food", "thức ăn", "/fuːd/", "Đồ ăn nói chung. 'fast food' = đồ ăn nhanh."],
  ["money", "tiền", "/ˈmʌni/", "'make money' = kiếm tiền, 'spend money' = tiêu tiền."],
  ["house", "ngôi nhà", "/haʊs/", "Nơi ở. Khác 'home' (nhà - cảm giác thân thuộc)."],
  ["home", "nhà (mái ấm)", "/hoʊm/", "Nơi mình sống, mang nghĩa thân thuộc. 'go home' = về nhà."],
  ["family", "gia đình", "/ˈfæməli/", "Những người thân. 'my family' = gia đình tôi."],
  ["friend", "bạn bè", "/frend/", "'best friend' = bạn thân nhất."],
  ["work", "công việc / làm việc", "/wɜːrk/", "Vừa là danh từ vừa là động từ. 'go to work' = đi làm."],
  ["school", "trường học", "/skuːl/", "'go to school' = đi học."],
  ["car", "xe hơi", "/kɑːr/", "Phương tiện 4 bánh. 'drive a car' = lái xe."],
  ["road", "con đường", "/roʊd/", "Đường cho xe chạy. Khác 'street' (đường trong phố)."],
  ["city", "thành phố", "/ˈsɪti/", "'big city' = thành phố lớn."],
  ["country", "đất nước / vùng quê", "/ˈkʌntri/", "Vừa nghĩa quốc gia, vừa nghĩa nông thôn tùy ngữ cảnh."],
  ["people", "mọi người", "/ˈpiːpl/", "Số nhiều của 'person'. Luôn đi với động từ số nhiều."],
  ["person", "người (một người)", "/ˈpɜːrsn/", "Số ít. Số nhiều thường dùng 'people'."],
  ["man", "đàn ông", "/mæn/", "Số nhiều bất quy tắc: 'men'."],
  ["woman", "phụ nữ", "/ˈwʊmən/", "Số nhiều bất quy tắc: 'women' /ˈwɪmɪn/."],
  ["child", "đứa trẻ", "/tʃaɪld/", "Số nhiều bất quy tắc: 'children'."],
  ["name", "tên", "/neɪm/", "'What's your name?' = Bạn tên gì?"],
  ["love", "tình yêu / yêu", "/lʌv/", "Danh từ và động từ. 'I love you' = anh yêu em."],
  ["life", "cuộc sống", "/laɪf/", "Số nhiều: 'lives' /laɪvz/."],
  ["world", "thế giới", "/wɜːrld/", "'around the world' = khắp thế giới."],
  ["place", "nơi chốn", "/pleɪs/", "'a nice place' = một nơi đẹp."],
  ["thing", "vật / việc", "/θɪŋ/", "Từ chung chỉ đồ vật hoặc sự việc."],
  ["word", "từ / lời nói", "/wɜːrd/", "'in other words' = nói cách khác."],
  ["book", "quyển sách", "/bʊk/", "'read a book' = đọc sách."],
  ["phone", "điện thoại", "/foʊn/", "'call on the phone' = gọi điện thoại."],
  ["door", "cửa", "/dɔːr/", "'open the door' = mở cửa."],
  ["window", "cửa sổ", "/ˈwɪndoʊ/", "'look out the window' = nhìn ra cửa sổ."],
  ["table", "cái bàn", "/ˈteɪbl/", "'on the table' = trên bàn."],
  ["chair", "cái ghế", "/tʃer/", "'sit on a chair' = ngồi trên ghế."],
  ["bed", "cái giường", "/bed/", "'go to bed' = đi ngủ."],
  ["room", "căn phòng", "/ruːm/", "'living room' = phòng khách."],
  ["street", "đường phố", "/striːt/", "Đường trong khu dân cư có nhà hai bên."],
  ["bag", "túi / cặp", "/bæɡ/", "'a bag of rice' = một túi gạo."],
  ["clothes", "quần áo", "/kloʊz/", "Luôn số nhiều, không có 'a clothes'."],
  ["shoe", "chiếc giày", "/ʃuː/", "Thường dùng số nhiều 'shoes' (đôi giày)."],
  ["hand", "bàn tay", "/hænd/", "'shake hands' = bắt tay."],
  ["eye", "con mắt", "/aɪ/", "Số nhiều 'eyes'. Phát âm như chữ 'I'."],
  ["head", "cái đầu", "/hed/", "'headache' = đau đầu."],
  ["heart", "trái tim", "/hɑːrt/", "'h' đọc, chữ giống 'hurt' nhưng nghĩa khác."],
  ["color", "màu sắc", "/ˈkʌlər/", "Anh-Anh viết 'colour'. 'favorite color' = màu yêu thích."],
  ["light", "ánh sáng / đèn", "/laɪt/", "'turn on the light' = bật đèn."],
  ["air", "không khí", "/er/", "'fresh air' = không khí trong lành."],
  ["fire", "lửa", "/ˈfaɪər/", "'make a fire' = nhóm lửa."],
  ["sun", "mặt trời", "/sʌn/", "'sunny' = nắng."],
  ["moon", "mặt trăng", "/muːn/", "'full moon' = trăng tròn."],
  ["star", "ngôi sao", "/stɑːr/", "Cũng nghĩa 'ngôi sao' (người nổi tiếng)."],
  ["rain", "mưa", "/reɪn/", "'It's raining' = trời đang mưa."],
  ["wind", "gió", "/wɪnd/", "'windy' = nhiều gió."],
  ["tree", "cây", "/triː/", "Số nhiều 'trees'."],
  ["flower", "bông hoa", "/ˈflaʊər/", "'a bunch of flowers' = một bó hoa."],
  ["animal", "động vật", "/ˈænɪml/", "'wild animal' = động vật hoang dã."],
  ["dog", "con chó", "/dɔːɡ/", "'walk the dog' = dắt chó đi dạo."],
  ["cat", "con mèo", "/kæt/", "Tiếng kêu 'meow'."],
  ["bird", "con chim", "/bɜːrd/", "'birds fly' = chim bay."],
  ["fish", "con cá", "/fɪʃ/", "Số nhiều thường giữ nguyên 'fish'."],
  ["go", "đi", "/ɡoʊ/", "Quá khứ bất quy tắc 'went'. 'go home' = về nhà."],
  ["come", "đến", "/kʌm/", "Quá khứ 'came'. 'come here' = đến đây."],
  ["eat", "ăn", "/iːt/", "Quá khứ 'ate'. 'eat lunch' = ăn trưa."],
  ["drink", "uống", "/drɪŋk/", "Quá khứ 'drank'. Cũng là danh từ 'đồ uống'."],
  ["sleep", "ngủ", "/sliːp/", "Quá khứ 'slept'. 'go to sleep' = đi ngủ."],
  ["see", "nhìn thấy", "/siː/", "Quá khứ 'saw'. Khác 'look' (nhìn chủ động)."],
  ["hear", "nghe thấy", "/hɪr/", "Quá khứ 'heard'. Khác 'listen' (lắng nghe)."],
  ["speak", "nói", "/spiːk/", "Quá khứ 'spoke'. 'speak English' = nói tiếng Anh."],
  ["read", "đọc", "/riːd/", "Quá khứ viết giống nhưng đọc /red/."],
  ["write", "viết", "/raɪt/", "Quá khứ 'wrote'. 'w' câm."],
  ["walk", "đi bộ", "/wɔːk/", "'l' câm. 'go for a walk' = đi dạo."],
  ["run", "chạy", "/rʌn/", "Quá khứ 'ran'. 'go running' = đi chạy bộ."],
  ["buy", "mua", "/baɪ/", "Quá khứ 'bought'. Trái nghĩa 'sell'."],
  ["sell", "bán", "/sel/", "Quá khứ 'sold'. Trái nghĩa 'buy'."],
  ["open", "mở", "/ˈoʊpən/", "Trái nghĩa 'close'. 'open the door' = mở cửa."],
  ["close", "đóng", "/kloʊz/", "Động từ /kloʊz/, tính từ 'gần' đọc /kloʊs/."],
  ["start", "bắt đầu", "/stɑːrt/", "Đồng nghĩa 'begin'. Trái nghĩa 'stop/finish'."],
  ["stop", "dừng lại", "/stɑːp/", "'stop talking' = ngừng nói."],
  ["help", "giúp đỡ", "/help/", "'Can you help me?' = Bạn giúp tôi được không?"],
  ["want", "muốn", "/wɑːnt/", "'I want to go' = tôi muốn đi."],
  ["need", "cần", "/niːd/", "Mạnh hơn 'want'. 'I need water' = tôi cần nước."],
  ["like", "thích", "/laɪk/", "'I like it' = tôi thích nó. Cũng nghĩa 'giống như'."],
  ["know", "biết", "/noʊ/", "Quá khứ 'knew'. 'k' câm. 'I don't know' = tôi không biết."],
  ["think", "nghĩ", "/θɪŋk/", "Quá khứ 'thought'. 'I think so' = tôi nghĩ vậy."],
  ["say", "nói (điều gì)", "/seɪ/", "Quá khứ 'said' /sed/. 'say yes' = nói đồng ý."],
  ["good", "tốt", "/ɡʊd/", "So sánh bất quy tắc: better / best."],
  ["bad", "tệ / xấu", "/bæd/", "So sánh bất quy tắc: worse / worst."],
  ["big", "to / lớn", "/bɪɡ/", "Trái nghĩa 'small'. So sánh 'bigger'."],
  ["small", "nhỏ", "/smɔːl/", "Đồng nghĩa 'little'. Trái nghĩa 'big'."],
  ["new", "mới", "/nuː/", "Trái nghĩa 'old'. 'brand new' = mới toanh."],
  ["old", "cũ / già", "/oʊld/", "'How old are you?' = Bạn bao nhiêu tuổi?"],
  ["hot", "nóng", "/hɑːt/", "Trái nghĩa 'cold'. Cũng nghĩa 'cay'."],
  ["cold", "lạnh", "/koʊld/", "'I'm cold' = tôi thấy lạnh. Cũng nghĩa 'cảm lạnh'."],
  ["happy", "vui / hạnh phúc", "/ˈhæpi/", "Trái nghĩa 'sad'. 'Happy birthday' = chúc mừng sinh nhật."],
  ["easy", "dễ", "/ˈiːzi/", "Trái nghĩa 'hard/difficult'. 'easy to learn' = dễ học."],
];

// ===== English_Basic_Food (en-US) — 100 food & eating words =====
const englishBasicFood: Card4[] = [
  ["rice", "cơm / gạo", "/raɪs/", "Lương thực chính ở châu Á. Không đếm được, không thêm 's'."],
  ["bread", "bánh mì", "/bred/", "'a loaf of bread' = một ổ bánh mì."],
  ["meat", "thịt", "/miːt/", "Đồng âm với 'meet' (gặp). Thịt nói chung."],
  ["chicken", "thịt gà / con gà", "/ˈtʃɪkɪn/", "Vừa chỉ con gà vừa chỉ thịt gà."],
  ["beef", "thịt bò", "/biːf/", "Thịt từ con bò (cow)."],
  ["pork", "thịt heo", "/pɔːrk/", "Thịt từ con heo (pig)."],
  ["fish", "cá", "/fɪʃ/", "Vừa con cá vừa món cá. Số nhiều giữ nguyên."],
  ["egg", "trứng", "/eɡ/", "'fried egg' = trứng chiên, 'boiled egg' = trứng luộc."],
  ["milk", "sữa", "/mɪlk/", "Không đếm được. 'a glass of milk' = một ly sữa."],
  ["cheese", "phô mai", "/tʃiːz/", "Làm từ sữa. 'Say cheese!' = cười lên (khi chụp ảnh)."],
  ["butter", "bơ", "/ˈbʌtər/", "Phết lên bánh mì. Khác 'avocado' (quả bơ)."],
  ["sugar", "đường", "/ˈʃʊɡər/", "'s' đầu đọc như 'sh'. Vị ngọt."],
  ["salt", "muối", "/sɔːlt/", "Vị mặn. 'salt and pepper' = muối và tiêu."],
  ["pepper", "tiêu / ớt chuông", "/ˈpepər/", "'black pepper' = tiêu đen."],
  ["oil", "dầu ăn", "/ɔɪl/", "'cooking oil' = dầu nấu ăn."],
  ["soup", "súp / canh", "/suːp/", "'a bowl of soup' = một tô súp."],
  ["noodle", "mì / bún", "/ˈnuːdl/", "Thường số nhiều 'noodles'."],
  ["fruit", "trái cây", "/fruːt/", "Nói chung không đếm. 'fresh fruit' = trái cây tươi."],
  ["apple", "táo", "/ˈæpl/", "'an apple a day' = mỗi ngày một quả táo."],
  ["banana", "chuối", "/bəˈnænə/", "Nhấn âm giữa: ba-NA-na."],
  ["orange", "cam", "/ˈɔːrɪndʒ/", "Vừa quả cam vừa màu cam."],
  ["grape", "nho", "/ɡreɪp/", "Thường số nhiều 'grapes' (chùm nho)."],
  ["lemon", "chanh vàng", "/ˈlemən/", "Vị chua. Khác 'lime' (chanh xanh)."],
  ["mango", "xoài", "/ˈmæŋɡoʊ/", "Số nhiều 'mangoes'."],
  ["watermelon", "dưa hấu", "/ˈwɔːtərmelən/", "Ghép 'water' + 'melon'."],
  ["strawberry", "dâu tây", "/ˈstrɔːberi/", "Quả đỏ có hạt bên ngoài."],
  ["pineapple", "dứa / thơm", "/ˈpaɪnæpl/", "Ghép 'pine' + 'apple'."],
  ["vegetable", "rau củ", "/ˈvedʒtəbl/", "Đọc gọn 3 âm: VEJ-tə-bl."],
  ["tomato", "cà chua", "/təˈmeɪtoʊ/", "Anh-Mỹ /təˈmeɪtoʊ/, Anh-Anh /təˈmɑːtəʊ/."],
  ["potato", "khoai tây", "/pəˈteɪtoʊ/", "Số nhiều 'potatoes'."],
  ["carrot", "cà rốt", "/ˈkærət/", "Củ màu cam, tốt cho mắt."],
  ["onion", "hành tây", "/ˈʌnjən/", "Bắt đầu bằng âm 'ʌ' (như 'un')."],
  ["garlic", "tỏi", "/ˈɡɑːrlɪk/", "Gia vị thơm, củ trắng nhiều tép."],
  ["salad", "rau trộn / sa lát", "/ˈsæləd/", "Món rau sống trộn."],
  ["mushroom", "nấm", "/ˈmʌʃruːm/", "Mọc ẩm ướt, hình ô."],
  ["corn", "ngô / bắp", "/kɔːrn/", "'sweet corn' = ngô ngọt."],
  ["bean", "đậu", "/biːn/", "Thường số nhiều 'beans'."],
  ["meal", "bữa ăn", "/miːl/", "'three meals a day' = ba bữa một ngày."],
  ["breakfast", "bữa sáng", "/ˈbrekfəst/", "'have breakfast' = ăn sáng."],
  ["lunch", "bữa trưa", "/lʌntʃ/", "'have lunch' = ăn trưa."],
  ["dinner", "bữa tối", "/ˈdɪnər/", "Bữa chính buổi tối."],
  ["snack", "đồ ăn vặt", "/snæk/", "Ăn nhẹ giữa các bữa."],
  ["dessert", "món tráng miệng", "/dɪˈzɜːrt/", "Nhấn âm sau. Khác 'desert' (sa mạc)."],
  ["cake", "bánh ngọt", "/keɪk/", "'birthday cake' = bánh sinh nhật."],
  ["cookie", "bánh quy", "/ˈkʊki/", "Anh-Anh gọi là 'biscuit'."],
  ["candy", "kẹo", "/ˈkændi/", "Anh-Anh gọi là 'sweets'."],
  ["chocolate", "sô cô la", "/ˈtʃɑːklət/", "Đọc gọn 2 âm: CHOK-lət."],
  ["ice cream", "kem", "/ˈaɪs kriːm/", "Món lạnh ngọt."],
  ["coffee", "cà phê", "/ˈkɔːfi/", "'a cup of coffee' = một tách cà phê."],
  ["tea", "trà", "/tiː/", "'green tea' = trà xanh."],
  ["juice", "nước ép", "/dʒuːs/", "'orange juice' = nước cam."],
  ["wine", "rượu vang", "/waɪn/", "'red wine' = vang đỏ."],
  ["beer", "bia", "/bɪr/", "Đồ uống có cồn từ lúa mạch."],
  ["plate", "cái đĩa", "/pleɪt/", "Đĩa phẳng đựng thức ăn."],
  ["bowl", "cái tô / bát", "/boʊl/", "Đựng súp, cơm. 'l' nhẹ."],
  ["cup", "cái tách / cốc", "/kʌp/", "'a cup of tea' = một tách trà."],
  ["glass", "cái ly thủy tinh", "/ɡlæs/", "Cũng nghĩa 'thủy tinh, kính'."],
  ["spoon", "cái thìa / muỗng", "/spuːn/", "Dùng để múc."],
  ["fork", "cái nĩa", "/fɔːrk/", "Dùng để xiên thức ăn."],
  ["knife", "con dao", "/naɪf/", "'k' câm. Số nhiều 'knives'."],
  ["cook", "nấu ăn / đầu bếp", "/kʊk/", "Vừa động từ vừa danh từ (người nấu)."],
  ["bake", "nướng (lò)", "/beɪk/", "Nướng bánh trong lò. 'bakery' = tiệm bánh."],
  ["fry", "chiên / rán", "/fraɪ/", "'fried rice' = cơm chiên."],
  ["boil", "luộc / đun sôi", "/bɔɪl/", "'boiled egg' = trứng luộc."],
  ["taste", "nếm / vị", "/teɪst/", "'It tastes good' = nó ngon."],
  ["sweet", "ngọt", "/swiːt/", "Vị của đường, kẹo."],
  ["sour", "chua", "/ˈsaʊər/", "Vị của chanh, giấm."],
  ["bitter", "đắng", "/ˈbɪtər/", "Vị của cà phê đen."],
  ["spicy", "cay", "/ˈspaɪsi/", "Vị của ớt. 'hot' cũng nghĩa cay."],
  ["fresh", "tươi", "/freʃ/", "'fresh vegetables' = rau tươi."],
  ["delicious", "ngon tuyệt", "/dɪˈlɪʃəs/", "Mạnh hơn 'good'. 'It's delicious' = ngon quá."],
  ["hungry", "đói", "/ˈhʌŋɡri/", "'I'm hungry' = tôi đói."],
  ["thirsty", "khát", "/ˈθɜːrsti/", "'I'm thirsty' = tôi khát nước."],
  ["full", "no", "/fʊl/", "'I'm full' = tôi no rồi."],
  ["dish", "món ăn / cái đĩa", "/dɪʃ/", "Vừa món ăn vừa đĩa lớn."],
  ["menu", "thực đơn", "/ˈmenjuː/", "Danh sách món ở nhà hàng."],
  ["restaurant", "nhà hàng", "/ˈrestrɑːnt/", "Đọc gọn: RES-tront."],
  ["kitchen", "nhà bếp", "/ˈkɪtʃɪn/", "Nơi nấu ăn trong nhà."],
  ["recipe", "công thức nấu ăn", "/ˈresəpi/", "3 âm: RES-ə-pi. Hướng dẫn nấu món."],
  ["flour", "bột mì", "/ˈflaʊər/", "Đồng âm với 'flower' (hoa)."],
  ["honey", "mật ong", "/ˈhʌni/", "Cũng dùng gọi yêu 'cưng'."],
  ["jam", "mứt", "/dʒæm/", "Phết lên bánh mì. Cũng nghĩa 'kẹt xe'."],
  ["sauce", "nước sốt", "/sɔːs/", "'soy sauce' = nước tương."],
  ["soy sauce", "nước tương / xì dầu", "/ˈsɔɪ sɔːs/", "Gia vị mặn màu nâu của châu Á."],
  ["vinegar", "giấm", "/ˈvɪnɪɡər/", "Chất lỏng chua dùng nêm."],
  ["flavor", "hương vị", "/ˈfleɪvər/", "Anh-Anh 'flavour'. Mùi vị món ăn."],
  ["serve", "phục vụ / dọn ra", "/sɜːrv/", "'serve dinner' = dọn bữa tối."],
  ["order", "gọi món / đặt hàng", "/ˈɔːrdər/", "'order food' = gọi đồ ăn."],
  ["bill", "hóa đơn", "/bɪl/", "Anh-Mỹ cũng dùng 'check'."],
  ["tip", "tiền boa / mẹo", "/tɪp/", "Tiền thưởng thêm cho phục vụ."],
  ["waiter", "bồi bàn (nam)", "/ˈweɪtər/", "Nữ là 'waitress'."],
  ["chef", "đầu bếp chính", "/ʃef/", "'ch' đọc như 'sh'. Bếp trưởng."],
  ["frozen", "đông lạnh", "/ˈfroʊzn/", "Quá khứ phân từ của 'freeze'."],
  ["raw", "sống (chưa nấu)", "/rɔː/", "'raw fish' = cá sống (sashimi)."],
  ["ripe", "chín (trái cây)", "/raɪp/", "Trái cây đã chín, sẵn ăn."],
  ["nut", "hạt (óc chó, đậu phộng)", "/nʌt/", "'peanut' = đậu phộng."],
  ["seafood", "hải sản", "/ˈsiːfuːd/", "Ghép 'sea' + 'food'. Tôm, cua, cá biển."],
  ["shrimp", "tôm", "/ʃrɪmp/", "Anh-Anh dùng 'prawn'."],
];

async function seedDeck(deckName: string, lang: string, cards: Card4[]) {
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
  for (const [word, meaning, ipa, explanation] of cards) {
    if (existing.has(word.toLowerCase())) {
      skipped++;
      continue;
    }
    await prisma.card.create({
      data: {
        word,
        meaning,
        ipa,
        explanation,
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
  console.log(`${deckName}: +${added} added, ${skipped} already there (total ${cards.length})`);
}

async function main() {
  await seedDeck("English_Basic_Life", "en-US", englishBasicLife);
  await seedDeck("English_Basic_Food", "en-US", englishBasicFood);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
