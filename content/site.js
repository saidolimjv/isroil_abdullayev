// ============================================================
//  BARCHA MATNLAR SHU YERDA. Saytni o'zgartirish uchun
//  faqat shu faylni tahrirlang — kodga tegish shart emas.
// ============================================================

export const site = {
  // --- Asosiy ma'lumotlar ---
  event: {
    dateLabel: "12-sentabr",
    dayLabel: "Shanba",
    venue: "MFaktor",
    city: "Toshkent",
    time: "10:00 – 14:00",
    duration: "4 soat",
    format: "OFFLINE",
    // Countdown uchun (Toshkent vaqti = UTC+5)
    startsAt: "2026-09-12T10:00:00+05:00",
    seatsTotal: 80,
    price: "197 000",
    currency: "so'm",
  },

  expert: {
    name: "Isroil Abdullayev",
    photo: "/isroil.jpg",
    // Tekshiring: raqamlar aynan shundaymi?
    facts: [
      { value: "5 yil", label: "media sohasida" },
      { value: "3 yil", label: "sun'iy intellekt sohasida" },
      { value: "200+", label: "o'quvchi AI bo'yicha dars oldi" },
      { value: "30+", label: "biznes egasi — Milliard klubida" },
    ],
    bio: [
      "5 yildan beri media sohasida, 3 yildan beri sun'iy intellekt bilan ishlayman.",
      "Hozirda million dollarlik startapning jamoasini AI-agentlar bilan qurib kelyapman — treksh 1000$ dan oshdi.",
      "200 dan ortiq insonga, shu jumladan Milliard klubidagi 30 dan ortiq biznes egasiga sun'iy intellekt bo'yicha dars berganman.",
    ],
  },

  // --- Hero ---
  hero: {
    title: "Biznesingizni operatsiondan chiqarib, telefoningizdagi bitta ekrandan boshqaring",
    subtitle:
      "Isroil Abdullayev bilan 1 kunlik offline biznes-seminar. Nazariya emas — sizning biznesingiz uchun AI-xodimlar qanday yig'ilishini jonli ko'rasiz.",
    outcomes: [
      {
        title: "Operatsiondan chiqasiz",
        text: "Kundalik rutinani AI-ga topshirib, biznesni strateg sifatida boshqarishni o'rganasiz.",
      },
      {
        title: "24/7 ishlaydigan AI-xodimlar",
        text: "Yangi odam yollamay xarajatni kamaytirish va sotuvni 2 barobar oshirish mexanikasi.",
      },
      {
        title: "Bitta dashboard",
        text: "Barcha raqamlar va agentlar ishi telefoningizdagi bitta ekranda — qo'lda hisobotsiz.",
      },
    ],
    cta: "SEMINARGA YOZILISH",
  },

  // --- Muammo bloki ---
  pain: {
    title: "Tanish holatmi?",
    items: [
      "Kun bo'yi band, lekin kechqurun \"bugun nima qildim?\" degan savolga javob yo'q.",
      "Har bir jarayon siz orqali o'tadi — siz to'xtasangiz, biznes ham to'xtaydi.",
      "Raqamlar jadvallarda, boshi berk. Qaror \"ko'z bilan chamalab\" qabul qilinadi.",
      "AI haqida ko'p eshitasiz, lekin ChatGPT'da matn yozishdan nariga o'tmadingiz.",
    ],
    conclusion:
      "Muammo vaqt yetishmasligida emas. Muammo — biznesda sizsiz ishlaydigan tizim yo'qligida.",
  },

  // --- Dastur ---
  program: {
    title: "Seminar dasturi",
    note: "4 soat. Har bir blokdan keyin — o'z biznesingizga tatbiq qilish uchun aniq qadam.",
    blocks: [
      {
        time: "10:00",
        title: "2026-da AI biznesda nima real ishlaydi",
        text: "Qaysi vositalar haqiqatan pul va vaqt tejaydi, qaysilari shunchaki shovqin. Bozordagi real keyslar.",
      },
      {
        time: "10:30",
        title: "Poydevor: biznesni AI tushunadigan bazaga solish",
        text: "Bozor va raqobat tahlili soatlar emas, daqiqalarda. Biznesingiz haqidagi bilim AI ichiga ko'chadi.",
        tools: "Claude · NotebookLM",
      },
      {
        time: "11:30",
        title: "Tanaffus va tanishuv",
        text: "Zaldagi tadbirkorlar bilan networking.",
        tools: "",
        muted: true,
      },
      {
        time: "11:45",
        title: "AI-xodimlar: 3 ta agentni jonli quramiz",
        text: "Kontent, sotuv va mijozlar bilan ishlash agentlari. Ekranda boshidan oxirigacha ko'rsatiladi.",
        tools: "Claude Code · ChatPlace · n8n",
      },
      {
        time: "12:45",
        title: "Boshqaruv pulti: hammasi bitta ekranda",
        text: "Agentlar va raqamlarni bitta dashboardga yig'ish, uni internetga chiqarish va telefondan ochish.",
        tools: "Google Sheets · Railway",
      },
      {
        time: "13:30",
        title: "Savol-javob va sizning keyingi qadamingiz",
        text: "Har bir ishtirokchi o'z biznesida nimadan boshlashini aniq bilib ketadi.",
      },
    ],
  },

  // --- Kimga mos ---
  fit: {
    title: "Bu seminar sizga to'g'ri keladimi?",
    yes: {
      title: "Ha, agar siz:",
      items: [
        "Biznesi yoki jamoasi bor, lekin operatsionda yonib ketayotgan tadbirkor",
        "Sotuv bo'limi rahbari — nazorat va hisobotni avtomatlashtirmoqchi",
        "Marketolog yoki agentlik egasi — rutinani kamaytirib, marjani oshirmoqchi",
        "Ekspert — bilim va tajribasini AI-mahsulotga aylantirmoqchi",
      ],
    },
    no: {
      title: "Yo'q, agar siz:",
      items: [
        "\"Sehrli tugma\" izlayapsiz va o'zingiz ishlashni istamaysiz",
        "AI'ni faqat qiziqish uchun, biznesga tatbiq qilmasdan o'rganmoqchisiz",
        "Ko'rgan narsangizni keyin qo'llash niyatingiz yo'q",
      ],
    },
  },

  objection: {
    title: "\"Men texnikadan uzoqman\" deb qo'rqmang",
    text: "Bu yerda kod yozmaysiz va noutbuk olib kelish shart emas. Isroil har bir qadamni ekranda o'zi ko'rsatib beradi, siz oddiy til va tayyor shablonlar bilan ishlaysiz. Telegramdan foydalana olsangiz — bu yerda ham uddalaysiz.",
  },

  // --- Nimalarni olib ketasiz ---
  takeaways: {
    title: "Seminardan nima olib ketasiz",
    items: [
      "4 soatlik amaliy offline seminar — zalda jonli ko'rsatib boriladi",
      "Biznes uchun TOP promptlar to'plami",
      "AI-agentlar uchun tayyor shablonlar",
      "Dashboard shabloni — o'z raqamlaringizni qo'yib ishlatasiz",
      "Claude va NotebookLM bo'yicha video darslik",
      "Ishtirokchilarning yopiq guruhiga kirish",
    ],
  },

  // --- FAQ ---
  faq: [
    {
      q: "Seminar qayerda va qachon bo'ladi?",
      a: "12-sentabr, shanba kuni, Toshkent shahridagi MFaktor'da, soat 10:00 dan 14:00 gacha.",
    },
    {
      q: "Narxi qancha?",
      a: "Ishtirok narxi — 197 000 so'm. Narx o'zgarmaydi, lekin joy soni 80 ta bilan cheklangan.",
    },
    {
      q: "Noutbuk olib kelish kerakmi?",
      a: "Shart emas. Barcha amaliyot ekranda ko'rsatib boriladi, siz yozib olasiz va materiallarni keyin olasiz.",
    },
    {
      q: "Men AI'dan umuman xabarim yo'q, tushunolamanmi?",
      a: "Ha. Seminar noldan boshlanadi va texnik atamalar emas, biznes tilida olib boriladi.",
    },
    {
      q: "Toshkentga kela olmasam-chi?",
      a: "Ro'yxatdan o'tishda \"Onlayn qatnashaman\" ni belgilang — onlayn format bo'yicha imkoniyat chiqsa, sizga birinchi bo'lib xabar beramiz.",
    },
    {
      q: "To'lov qanday amalga oshiriladi?",
      a: "Ro'yxatdan o'tganingizdan so'ng jamoamiz siz bilan bog'lanadi va to'lov usullarini tushuntiradi.",
    },
  ],

  // --- Forma (2-ekran) ---
  form: {
    title: "Seminarga yozilish",
    subtitle: "Ma'lumotlaringizni qoldiring — jamoamiz siz bilan bog'lanadi.",
    nameLabel: "Ismingiz",
    namePlaceholder: "Ismingiz",
    phoneLabel: "Telefon raqamingiz",
    formatLabel: "Seminar Toshkent shahrida bo'lib o'tadi",
    formatOffline: "Kela olaman",
    formatOnline: "Onlayn qatnashaman",
    submit: "DAVOM ETISH",
    sending: "Yuborilmoqda...",
    timerNote: "Joyingiz shu vaqt davomida band qilib turiladi",
    consent:
      "Tugmani bosish orqali siz shaxsiy ma'lumotlarni qayta ishlashga rozilik bildirasiz.",
    errors: {
      name: "Ismingizni kiriting",
      phone: "Telefon raqamini to'liq kiriting",
      format: "Qatnashish formatini tanlang",
      network: "Yuborilmadi. Internetni tekshirib, qayta urinib ko'ring.",
    },
  },

  // --- Rahmat (3-ekran) ---
  success: {
    title: "oxirgi qadam qoldi!",
    text: "Seminar haqidagi barcha ma'lumot, joy va to'lov tafsilotlari Telegram kanalimizda. Quyidagi tugmani bosib o'ting.",
    button: "TELEGRAMGA O'TISH",
    note: "Telegramga o'tganingizdan so'ng seminar haqida birinchi bo'lib xabar olasiz.",
  },

  footer: {
    text: "AI Biznes Seminar — Isroil Abdullayev",
    disclaimer:
      "Bu sayt Facebook, Google yoki boshqa ijtimoiy tarmoqlarning bir qismi emas va ular tomonidan tasdiqlanmagan.",
  },

  meta: {
    title: "AI Biznes Seminar — Isroil Abdullayev | 12-sentabr, Toshkent",
    description:
      "1 kunlik offline seminar: operatsiondan chiqing, 24/7 AI-xodimlar qo'ying va biznesni bitta dashboarddan boshqaring. 12-sentabr, MFaktor, Toshkent.",
  },
};

export default site;
