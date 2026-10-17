// "Hangi yazılımcısın?" testi. Sorular koddan değil, gündelik hayattan.
// Her soruda 4 farklı tip var ve her tip tüm testte tam 4 kez geçer; npm test bu dengeyi denetler.
export type TypeKey = 'backend' | 'frontend' | 'data' | 'mobile' | 'devops' | 'security' | 'gamedev' | 'embedded'

// Eşitlikte önce gelen kazanır (logic.ts › pickType).
export const ORDER: TypeKey[] = ['backend', 'frontend', 'data', 'mobile', 'devops', 'security', 'gamedev', 'embedded']

export const TYPES: Record<TypeKey, { mark: string; name: string; desc: string; tools: string[] }> = {
  backend: {
    mark: '{ }',
    name: 'Backend Geliştirici',
    desc: 'Görünmeyen ama her şeyi taşıyan katmandasın. İşler ters gittiğinde sakin kalan, parçaları birbirine bağlayan kişi sensin.',
    tools: ['Go', 'PostgreSQL', 'Docker', 'REST'],
  },
  frontend: {
    mark: '</>',
    name: 'Frontend Geliştirici',
    desc: 'İnsanların ilk gördüğü şeyi sen yaparsın. Bir pikselin kaydığını, bir rengin yanlış durduğunu herkesten önce fark edersin.',
    tools: ['React', 'TypeScript', 'CSS', 'Figma'],
  },
  data: {
    mark: 'Σx',
    name: 'Veri ve Yapay Zekâ Meraklısı',
    desc: 'Her şeyin altında bir örüntü ararsın. "Bunu neden böyle düşünüyoruz?" diye soran ve cevabı sayılarda bulan sensin.',
    tools: ['Python', 'Pandas', 'PyTorch', 'SQL'],
  },
  mobile: {
    mark: '[ ]',
    name: 'Mobil Geliştirici',
    desc: 'Hayat cebinde akıyor ve sen onu daha kolay hâle getirmek istiyorsun. Bir şeyin tek elle kullanılabilmesi senin için ayrıntı değil.',
    tools: ['Kotlin', 'Swift', 'Flutter', 'Firebase'],
  },
  devops: {
    mark: '$_',
    name: 'DevOps Mühendisi',
    desc: "Aynı işi iki kez elle yapmak sana dokunur. Gece 3'te sistem ayaktaysa biraz da senin sayende.",
    tools: ['Linux', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  security: {
    mark: '#!',
    name: 'Siber Güvenlik Uzmanı',
    desc: 'Herkes kapıya bakarken sen pencereyi kontrol edersin. "Peki biri bunu kötüye kullanırsa?" en sevdiğin soru.',
    tools: ['Linux', 'Wireshark', 'Burp Suite', 'CTF'],
  },
  gamedev: {
    mark: 'WASD',
    name: 'Oyun Geliştirici',
    desc: 'Kuralları olan her şeyi oyuna çevirirsin. Bir şeyin eğlenceli olup olmadığını, daha kimse fark etmeden hissedersin.',
    tools: ['Unity', 'Godot', 'C#', 'Blender'],
  },
  embedded: {
    mark: '0xFF',
    name: 'Gömülü Sistem Mühendisi',
    desc: 'Kodun ekranda değil, gerçek dünyada bir şeyi hareket ettirdiğinde mutlusun. Her bayt, her miliamper senin için önemli.',
    tools: ['C', 'Arduino', 'STM32', 'Lehim havyası'],
  },
}

export const QUESTIONS: { q: string; options: { text: string; type: TypeKey }[] }[] = [
  {
    q: 'Yeni bir kafeye girdin. İlk neyi fark edersin?',
    options: [
      { text: 'Siparişlerin mutfağa nasıl ulaştığını', type: 'backend' },
      { text: 'Menünün yazı tipini ve ışığın nereden geldiğini', type: 'frontend' },
      { text: 'Hangi saatte neden kalabalık olduğunu', type: 'data' },
      { text: 'QR menünün telefonda düzgün açılıp açılmadığını', type: 'mobile' },
    ],
  },
  {
    q: 'Evde bir şey bozuldu. Ne yaparsın?',
    options: [
      { text: 'Düzeltir, bir dahaki sefer için adımları yazıp buzdolabına asarım.', type: 'devops' },
      { text: 'Önce kimin neyi kurcaladığını bulurum.', type: 'security' },
      { text: 'Tamiri bir yarışa çeviririm: sorunu ilk kim bulacak?', type: 'gamedev' },
      { text: 'Tornavidayı alıp içini açarım.', type: 'embedded' },
    ],
  },
  {
    q: 'Bir grup ödevinde genelde sen…',
    options: [
      { text: 'Herkesin parçasını birleştiren kişiyim.', type: 'backend' },
      { text: 'Kaynakları toplayıp tabloya dökerim.', type: 'data' },
      { text: 'Kimin neyi ne zamana yapacağını takip ederim.', type: 'devops' },
      { text: 'Sunumu akılda kalıcı yapacak fikri bulurum.', type: 'gamedev' },
    ],
  },
  {
    q: 'Yeni bir telefon aldın. İlk yaptığın şey?',
    options: [
      { text: 'Duvar kâğıdını ve simgelerin dizilişini ayarlarım.', type: 'frontend' },
      { text: 'Hangi uygulamanın daha akıcı çalıştığını denerim.', type: 'mobile' },
      { text: 'Uygulama izinlerini tek tek kapatırım.', type: 'security' },
      { text: 'İçinde hangi işlemci ve sensörler olduğuna bakarım.', type: 'embedded' },
    ],
  },
  {
    q: 'Bir tatilde seni en çok ne mutlu eder?',
    options: [
      { text: 'Her şeyin plana göre, aksamadan yürümesi', type: 'backend' },
      { text: 'Yanıma sadece telefonumu alıp yola çıkmak', type: 'mobile' },
      { text: 'Kimsenin bilmediği gizli bir yer keşfetmek', type: 'security' },
      { text: 'Gece boyu arkadaşlarla kutu oyunu oynamak', type: 'gamedev' },
    ],
  },
  {
    q: 'Arkadaşların sana en çok neyi danışır?',
    options: [
      { text: '"Hangi fotoğrafı paylaşayım?"', type: 'frontend' },
      { text: '"Hangisi daha mantıklı, bir hesaplar mısın?"', type: 'data' },
      { text: '"Bilgisayarım yavaşladı, bakar mısın?"', type: 'devops' },
      { text: '"Bunu tamir edebilir misin?"', type: 'embedded' },
    ],
  },
  {
    q: 'Önemli bir mesajı göndermeden önce…',
    options: [
      { text: 'Fikirlerin mantıklı bir sırayla gidip gitmediğine bakarım.', type: 'backend' },
      { text: 'Görünüşünü düzeltir, paragrafları bölerim.', type: 'frontend' },
      { text: 'Karşı tarafın en uygun olduğu saate zamanlarım.', type: 'devops' },
      { text: 'Yanlış kişiye gitmediğinden iki kez emin olurum.', type: 'security' },
    ],
  },
  {
    q: 'Çocukken en sevdiğin şey neydi?',
    options: [
      { text: 'Bir şeyler biriktirip sınıflandırmak', type: 'data' },
      { text: 'Büyüklerin telefonundaki her ayarı kurcalamak', type: 'mobile' },
      { text: 'Oyunlara kendi kurallarımı uydurmak', type: 'gamedev' },
      { text: 'Oyuncakları söküp içinden ne çıktığına bakmak', type: 'embedded' },
    ],
  },
]
