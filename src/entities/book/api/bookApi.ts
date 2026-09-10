import type { Book, CreateBookDto, UpdateBookDto, BookFilterParams } from '../model/types';
import { storageService } from '../../../shared/api/storage';
import { mockNetworkDelay } from '../../../shared/api/baseApi';
import { sanitizeInput, sanitizePrice, sanitizeStock, sanitizeUrl, sanitizeId } from '../../../shared/lib/security';

const STORAGE_KEY = 'kitap_all_books_v4';

const INITIAL_BOOKS_SEED: Book[] = [
  {
    id: 'book-1',
    title: 'Абай жолы (4 томдық жинақ)',
    author: 'Мұхтар Әуезов',
    price: 12500,
    oldPrice: 15000,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақтың бас ақыны, данышпан ойшылы Абай Құнанбайұлының өмірі мен XIX ғасырдағы қазақ даласының әлеуметтік болмысын суреттейтін ұлы эпопея. Әлемдік әдебиеттің алтын қорына енген классикалық туынды.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 24,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    publicationYear: 2023,
    pages: 1420,
    isbn: '978-601-04-1234-5',
    publisher: 'Атамұра',
    coverType: 'hardcover',
    weight: '1650 г',
    dimensions: '150x220 мм',
    ageRestriction: '12+',
    quote: 'Білімдіден шыққан сөз, талаптыға болсын кез.',
  },
  {
    id: 'book-2',
    title: 'Қан мен тер (Трилогия)',
    author: 'Әбдіжәмил Нұрпейісов',
    price: 8900,
    oldPrice: 10500,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Арал балықшыларының күрделі тағдыры, 1916 жылғы ұлт-азаттық қозғалыс пен төңкеріс жылдарындағы қазақ қоғамының психологиялық портреті. Мемлекеттік сыйлыққа ие болған үздік роман.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 18,
    rating: 4.8,
    reviewsCount: 64,
    isFeatured: true,
    publicationYear: 2022,
    pages: 890,
    isbn: '978-601-04-5678-9',
    publisher: 'Жазушы',
    coverType: 'hardcover',
    weight: '980 г',
    dimensions: '145x215 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-3',
    title: 'Көшпенділер (Тарихи трилогия)',
    author: 'Ілияс Есенберлин',
    price: 9800,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    description: 'XV–XIX ғасырлардағы Қазақ хандығының негізін қалаған Керей мен Жәнібектен бастап, Кенесары ханға дейінгі азаттық күресін баяндайтын монументалды тарихи туынды.',
    genre: 'history',
    language: 'kz',
    stock: 32,
    rating: 5.0,
    reviewsCount: 210,
    isFeatured: true,
    publicationYear: 2023,
    pages: 1120,
    isbn: '978-601-04-9012-3',
    publisher: 'Ілияс Есенберлин қоры',
    coverType: 'hardcover',
    weight: '1240 г',
    dimensions: '150x220 мм',
    ageRestriction: '12+',
    quote: 'Ел боламын десең — бесігіңді түзе, жер боламын десең — бірлігіңді түзе.',
  },
  {
    id: 'book-4',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    price: 4500,
    oldPrice: 5500,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    description: 'Как крошечные изменения на 1% каждый день приводят к масштабным трансформациям в карьере, здоровье и финансах. Мировой бестселлер по практической поведенческой психологии.',
    genre: 'psychology',
    language: 'ru',
    stock: 45,
    rating: 4.9,
    reviewsCount: 350,
    isFeatured: true,
    publicationYear: 2023,
    pages: 320,
    isbn: '978-5-04-100234-1',
    publisher: 'Питер',
    coverType: 'hardcover',
    weight: '380 г',
    dimensions: '140x210 мм',
    ageRestriction: '16+',
    quote: 'Вы не поднимаетесь до уровня своих целей. Вы опускаетесь до уровня своих систем.',
  },
  {
    id: 'book-5',
    title: 'Думай и богатей',
    author: 'Наполеон Хилл',
    price: 3900,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'Фундаментальный труд по психологии личного успеха и предпринимательского мышления, основанный на анализе опыта 500 величайших деятелей бизнеса XX века.',
    genre: 'business',
    language: 'ru',
    stock: 12,
    rating: 4.7,
    reviewsCount: 89,
    isFeatured: false,
    publicationYear: 2022,
    pages: 280,
    isbn: '978-5-17-098765-4',
    publisher: 'Попурри',
    coverType: 'paperback',
    weight: '260 г',
    dimensions: '130x200 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-6',
    title: 'Қара сөздер',
    author: 'Абай Құнанбайұлы',
    price: 3200,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'Ұлы дала данышпанының қырық бес қарасөзі. Адамгершілік, әділдік, ғылым-білім, мінез тәрбиесі мен рухани кемелдену хақындағы философиялық қағидалар жинағы.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 50,
    rating: 5.0,
    reviewsCount: 420,
    isFeatured: true,
    publicationYear: 2023,
    pages: 160,
    isbn: '978-601-04-3344-1',
    publisher: 'Фолиант',
    coverType: 'hardcover',
    weight: '240 г',
    dimensions: '130x200 мм',
    ageRestriction: '12+',
    quote: 'Үш-ақ нәрсе адамның қасиеті: ыстық қайрат, нұрлы ақыл, жылы жүрек.',
  },
  {
    id: 'book-7',
    title: 'Богатый папа, бедный папа',
    author: 'Роберт Кийосаки',
    price: 4200,
    oldPrice: 4900,
    coverImage: 'https://images.unsplash.com/photo-1554415707-9e49017aed81?w=600&auto=format&fit=crop&q=80',
    description: 'Фундаментальные законы финансовой грамотности, формирования денежного потока и создания пассивного дохода для независимого будущего.',
    genre: 'business',
    language: 'ru',
    stock: 28,
    rating: 4.8,
    reviewsCount: 195,
    isFeatured: false,
    publicationYear: 2022,
    pages: 352,
    isbn: '978-5-04-098712-4',
    publisher: 'Попурри',
    coverType: 'paperback',
    weight: '310 г',
    dimensions: '135x205 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-8',
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    price: 2800,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    description: 'Всемирно известная философская притча о любви, верности, настоящей дружбе и детской чистоте восприятия мира.',
    genre: 'children',
    language: 'ru',
    stock: 19,
    rating: 4.9,
    reviewsCount: 140,
    isFeatured: false,
    publicationYear: 2023,
    pages: 128,
    isbn: '978-5-389-07435-4',
    publisher: 'Эксмо',
    coverType: 'hardcover',
    weight: '220 г',
    dimensions: '145x210 мм',
    ageRestriction: '6+',
  },
  {
    id: 'book-9',
    title: 'Бақытты балалық шақ (Менің атым Қожа)',
    author: 'Бердібек Соқпақбаев',
    price: 3600,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақ балалар әдебиетінің інжу-маржаны. Арманшыл Қожаның мектеп өмірі мен қызықты оқиғалары арқылы шынайы достық пен адалдықты дәріптейтін таңдаулы шығарма.',
    genre: 'children',
    language: 'kz',
    stock: 22,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    publicationYear: 2023,
    pages: 240,
    isbn: '978-601-04-7788-9',
    publisher: 'Атамұра',
    coverType: 'hardcover',
    weight: '310 г',
    dimensions: '145x215 мм',
    ageRestriction: '6+',
  },
  {
    id: 'book-10',
    title: 'Қазақстан тарихы (Көне заманнан бүгінге дейін)',
    author: 'Академиктер тобы',
    price: 7500,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'Қазақ мемлекеттілігінің қалыптасу тарихы, Ұлы Жібек жолы мәдениеті, Алтын Орда мұрасы мен Тәуелсіз Қазақстан дәуірінің кешенді ғылыми шежіресі.',
    genre: 'history',
    language: 'kz',
    stock: 14,
    rating: 4.6,
    reviewsCount: 45,
    isFeatured: false,
    publicationYear: 2022,
    pages: 640,
    isbn: '978-601-04-9900-1',
    publisher: 'Ғылым баспасы',
    coverType: 'hardcover',
    weight: '820 г',
    dimensions: '170x240 мм',
    ageRestriction: '12+',
  },
  {
    id: 'book-11',
    title: 'К себе нежно: Книга о том, как ценить и беречь себя',
    author: 'Ольга Примаченко',
    price: 4800,
    oldPrice: 5600,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    description: 'Практическое руководство по экологичному отношению к собственным эмоциям, принятию своего тела и выстраиванию здоровых личных границ.',
    genre: 'psychology',
    language: 'ru',
    stock: 25,
    rating: 4.8,
    reviewsCount: 230,
    isFeatured: true,
    publicationYear: 2023,
    pages: 336,
    isbn: '978-5-04-116524-4',
    publisher: 'Бомбора',
    coverType: 'hardcover',
    weight: '410 г',
    dimensions: '145x215 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-12',
    title: 'От нуля к единице: Как создать стартап',
    author: 'Питер Тиль',
    price: 5200,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
    description: 'Основатель PayPal и инвестор Facebook делится уникальным взглядом на венчурные инвестиции, монополию нового типа и созидательное технологическое лидерство.',
    genre: 'business',
    language: 'ru',
    stock: 16,
    rating: 4.7,
    reviewsCount: 95,
    isFeatured: false,
    publicationYear: 2023,
    pages: 208,
    isbn: '978-5-9614-4856-6',
    publisher: 'Альпина Паблишер',
    coverType: 'hardcover',
    weight: '320 г',
    dimensions: '145x215 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-13',
    title: 'Sapiens: Адамзаттың қысқаша тарихы',
    author: 'Юваль Ной Харари',
    price: 6900,
    oldPrice: 7900,
    coverImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&auto=format&fit=crop&q=80',
    description: 'Адамзаттың тас дәуіріндегі алғашқы қадамдарынан бастап, когнитивтік, аграрлық және ғылыми төңкерістер арқылы әлемді қалай бағындырғанын зерттейтін жаһандық бестселлер.',
    genre: 'history',
    language: 'kz',
    stock: 35,
    rating: 4.9,
    reviewsCount: 280,
    isFeatured: true,
    publicationYear: 2023,
    pages: 512,
    isbn: '978-601-7998-12-4',
    publisher: 'Mazmunda',
    coverType: 'hardcover',
    weight: '640 г',
    dimensions: '150x220 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-14',
    title: 'Психология денег: Вечные уроки богатства и счастья',
    author: 'Морган Хаузел',
    price: 5400,
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    description: '19 коротких историй о том, почему финансовый успех определяется не математическими формулами, а человеческим поведением, эмоциями и самоконтролем.',
    genre: 'business',
    language: 'ru',
    stock: 40,
    rating: 4.9,
    reviewsCount: 310,
    isFeatured: true,
    publicationYear: 2023,
    pages: 280,
    isbn: '978-5-9614-7234-9',
    publisher: 'Альпина Паблишер',
    coverType: 'hardcover',
    weight: '390 г',
    dimensions: '145x215 мм',
    ageRestriction: '16+',
    quote: 'Тратить деньги, чтобы показать другим, сколько у вас денег — вернейший способ стать беднее.',
  },
  {
    id: 'book-15',
    title: 'Ұшқан ұя',
    author: 'Бауыржан Момышұлы',
    price: 3800,
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
    description: 'Халық қаһарманы Бауыржан Момышұлының қазақы ауылдағы балалық шағы, ата-баба салт-дәстүрі, қатаң әрі әділ тәлім-тәрбиесі жайлы сыр шертетін автобиографиялық повесі.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 28,
    rating: 5.0,
    reviewsCount: 160,
    isFeatured: false,
    publicationYear: 2022,
    pages: 320,
    isbn: '978-601-05-1823-4',
    publisher: 'Атамұра',
    coverType: 'hardcover',
    weight: '360 г',
    dimensions: '140x205 мм',
    ageRestriction: '12+',
    quote: 'Тәртіпке бағынған құл болмайды, тәртіпсіз ел болмайды.',
  },
  {
    id: 'book-16',
    title: '1984',
    author: 'Джордж Оруэлл',
    price: 3400,
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&auto=format&fit=crop&q=80',
    description: 'Тоталитарлық жүйенің сұрқия табиғатын, ақиқатты бұрмалау мен жеке адамның еркіндігін тұншықтыру тетіктерін әшкерелейтін әлемге әйгілі антиутопиялық роман.',
    genre: 'fiction',
    language: 'kz',
    stock: 30,
    rating: 4.8,
    reviewsCount: 190,
    isFeatured: true,
    publicationYear: 2023,
    pages: 328,
    isbn: '978-601-7998-34-6',
    publisher: 'Mazmunda',
    coverType: 'paperback',
    weight: '290 г',
    dimensions: '130x200 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-17',
    title: 'Таңдау: Тірі қалу мен еркіндік туралы естелік',
    author: 'Эдит Ева Эгер',
    price: 5800,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    description: 'Освенцим концлагерінен аман шыққан белгілі психотерапевт Эдит Эгердің ерік-жігері, жан жарасын емдеу және ішкі еркіндікті таңдау құдіреті туралы өмірлік кітабы.',
    genre: 'psychology',
    language: 'kz',
    stock: 20,
    rating: 4.9,
    reviewsCount: 145,
    isFeatured: true,
    publicationYear: 2023,
    pages: 400,
    isbn: '978-601-8079-11-2',
    publisher: 'Steppe & WORLD',
    coverType: 'hardcover',
    weight: '490 г',
    dimensions: '150x220 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-18',
    title: 'Эмоциональный интеллект: Почему он может значить больше, чем IQ',
    author: 'Дэниел Гоулман',
    price: 6200,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    description: 'Фундаментальное исследование психолога и журналиста New York Times о том, как распознавание и управление эмоциями определяет успех в карьере и личной жизни.',
    genre: 'psychology',
    language: 'ru',
    stock: 22,
    rating: 4.7,
    reviewsCount: 110,
    isFeatured: false,
    publicationYear: 2022,
    pages: 544,
    isbn: '978-5-00195-432-1',
    publisher: 'Манн, Иванов и Фербер',
    coverType: 'hardcover',
    weight: '620 г',
    dimensions: '150x220 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-19',
    title: 'Қарғын',
    author: 'Дулат Исабеков',
    price: 4100,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    description: 'Жазушы Дулат Исабековтің жастар арасындағы махаббат, өнер адамдарының ішкі арпалысы мен зиялы қауымның мінез-құлқын шебер бейнелеген танымал романы.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 19,
    rating: 4.8,
    reviewsCount: 75,
    isFeatured: false,
    publicationYear: 2022,
    pages: 368,
    isbn: '978-601-338-120-7',
    publisher: 'Фолиант',
    coverType: 'hardcover',
    weight: '430 г',
    dimensions: '145x215 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-20',
    title: 'Принципы: Жизнь и работа',
    author: 'Рэй Далио',
    price: 8900,
    oldPrice: 10200,
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
    description: 'Основатель крупнейшего хедж-фонда Bridgewater Associates делится строгими алгоритмами принятия решений, радикальной прозрачностью и системным менеджментом.',
    genre: 'business',
    language: 'ru',
    stock: 15,
    rating: 4.9,
    reviewsCount: 220,
    isFeatured: true,
    publicationYear: 2023,
    pages: 600,
    isbn: '978-5-9614-6890-8',
    publisher: 'Альпина Паблишер',
    coverType: 'hardcover',
    weight: '860 г',
    dimensions: '170x240 мм',
    ageRestriction: '16+',
    quote: 'Боль + Осмысление = Прогресс.',
  },
  {
    id: 'book-21',
    title: 'Көксерек (Повесть және әңгімелер)',
    author: 'Мұхтар Әуезов',
    price: 2600,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    description: 'Адам мен түз тағысының арасындағы қатал табиғи күрес, Құрмаш пен қолға үйретілген қасқырдың драмалық хикаясы суреттелген классикалық повесть.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 42,
    rating: 4.9,
    reviewsCount: 130,
    isFeatured: false,
    publicationYear: 2023,
    pages: 144,
    isbn: '978-601-05-1990-3',
    publisher: 'Атамұра',
    coverType: 'hardcover',
    weight: '210 г',
    dimensions: '130x200 мм',
    ageRestriction: '12+',
  },
  {
    id: 'book-22',
    title: 'Шантарам (Полное издание)',
    author: 'Грегори Дэвид Робертс',
    price: 5900,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    description: 'Захватывающий автобиографический роман о беглеце из австралийской тюрьмы, нашедшем вторую жизнь, любовь и искупление в трущобах и мафии Бомбея.',
    genre: 'fiction',
    language: 'ru',
    stock: 18,
    rating: 4.8,
    reviewsCount: 290,
    isFeatured: false,
    publicationYear: 2022,
    pages: 864,
    isbn: '978-5-389-01029-1',
    publisher: 'Азбука',
    coverType: 'paperback',
    weight: '680 г',
    dimensions: '140x210 мм',
    ageRestriction: '18+',
  },
  {
    id: 'book-23',
    title: 'Күн батпайтын өлке',
    author: 'Бауыржан Момышұлы',
    price: 3900,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'Бауыржан Момышұлының 1963 жылы Куба аралына сапары, Фидель Кастро мен Эрнесто Че Геварамен жүздесулері туралы тарихи-деректі жазбалары.',
    genre: 'history',
    language: 'kz',
    stock: 25,
    rating: 4.8,
    reviewsCount: 65,
    isFeatured: false,
    publicationYear: 2022,
    pages: 290,
    isbn: '978-601-338-090-3',
    publisher: 'Фолиант',
    coverType: 'hardcover',
    weight: '340 г',
    dimensions: '145x215 мм',
    ageRestriction: '12+',
  },
  {
    id: 'book-24',
    title: 'Кафе на краю земли: Как перестать плыть по течению',
    author: 'Джон Стрелеки',
    price: 2900,
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    description: 'Вдохновляющая притча о поиске смысла жизни, истинных ценностях и смелости изменить привычный рутинный маршрут.',
    genre: 'psychology',
    language: 'ru',
    stock: 38,
    rating: 4.7,
    reviewsCount: 180,
    isFeatured: false,
    publicationYear: 2023,
    pages: 160,
    isbn: '978-5-04-099432-6',
    publisher: 'Бомбора',
    coverType: 'paperback',
    weight: '190 г',
    dimensions: '125x190 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-25',
    title: 'Ақиқат пен аңыз (Роман-диалог)',
    author: 'Әзілхан Нұршайықов',
    price: 4900,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'Даңқты қолбасшы Бауыржан Момышұлының сұрапыл соғыс жылдарындағы ерлігі, қайсар мінезі мен өмірлік ұстанымдарын шынайы диалогтар арқылы ашатын үздік туынды.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 21,
    rating: 5.0,
    reviewsCount: 175,
    isFeatured: true,
    publicationYear: 2023,
    pages: 496,
    isbn: '978-601-05-1650-6',
    publisher: 'Атамұра',
    coverType: 'hardcover',
    weight: '580 г',
    dimensions: '145x215 мм',
    ageRestriction: '12+',
  },
  {
    id: 'book-26',
    title: 'Көрінбейтін әйелдер: Деректер ер адамдар үшін жасалған әлемді қалай сипаттайды',
    author: 'Кэролайн Криадо Перес',
    price: 6400,
    coverImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&auto=format&fit=crop&q=80',
    description: 'Қала құрылысы, медицина, технология және саясаттағы гендерлік деректер тапшылығының қоғамға әсерін нақты ғылыми дәйектермен дәлелдеген маңызды зерттеу.',
    genre: 'psychology',
    language: 'kz',
    stock: 17,
    rating: 4.8,
    reviewsCount: 92,
    isFeatured: false,
    publicationYear: 2023,
    pages: 480,
    isbn: '978-601-8079-45-7',
    publisher: 'Steppe & WORLD',
    coverType: 'hardcover',
    weight: '560 г',
    dimensions: '150x220 мм',
    ageRestriction: '16+',
  },
  {
    id: 'book-27',
    title: 'Махаббат, қызық мол жылдар',
    author: 'Әзілхан Нұршайықов',
    price: 4500,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    description: 'Соғыстан кейінгі студенттік өмірдің таза махаббаты, адал достық, Ербол мен Меңтайдың жүрек тебірентерлік ғашықтық дастаны.',
    genre: 'kazakh_classics',
    language: 'kz',
    stock: 33,
    rating: 4.9,
    reviewsCount: 310,
    isFeatured: true,
    publicationYear: 2023,
    pages: 384,
    isbn: '978-601-338-230-3',
    publisher: 'Фолиант',
    coverType: 'hardcover',
    weight: '440 г',
    dimensions: '145x215 мм',
    ageRestriction: '12+',
    quote: 'Махаббат деген — қос жүректің бір-біріне соғуы.',
  },
];

export const bookApi = {
  async getAll(): Promise<Book[]> {
    await mockNetworkDelay();
    return storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
  },

  async getById(id: string): Promise<Book | null> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    return books.find((b) => b.id === id) || null;
  },

  async query(params: BookFilterParams): Promise<Book[]> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    let result = [...books];

    if (params.genre && params.genre !== 'all') {
      result = result.filter((b) => b.genre === params.genre);
    }

    if (params.language && params.language !== 'all') {
      result = result.filter((b) => b.language === params.language);
    }

    if (params.publisher && params.publisher !== 'all') {
      result = result.filter((b) => b.publisher === params.publisher);
    }

    if (params.coverType && params.coverType !== 'all') {
      result = result.filter((b) => b.coverType === params.coverType);
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.publisher && b.publisher.toLowerCase().includes(q)) ||
          b.isbn.includes(q)
      );
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.publicationYear - a.publicationYear);
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
      }
    }

    return result;
  },

  async create(dto: CreateBookDto): Promise<Book> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: sanitizeInput(dto.title),
      author: sanitizeInput(dto.author),
      price: sanitizePrice(dto.price),
      oldPrice: dto.oldPrice ? sanitizePrice(dto.oldPrice) : undefined,
      coverImage: sanitizeUrl(dto.coverImage),
      description: sanitizeInput(dto.description),
      genre: sanitizeInput(dto.genre),
      language: dto.language,
      stock: sanitizeStock(dto.stock),
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: false,
      publicationYear: dto.publicationYear || new Date().getFullYear(),
      pages: dto.pages || 200,
      isbn: sanitizeInput(dto.isbn || `978-601-${Math.floor(100000 + Math.random() * 900000)}`),
      publisher: dto.publisher ? sanitizeInput(dto.publisher) : undefined,
      coverType: dto.coverType || 'hardcover',
    };

    const updated = [newBook, ...books];
    storageService.set(STORAGE_KEY, updated);
    return newBook;
  },

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const cleanId = sanitizeId(id);
    const index = books.findIndex((b) => b.id === cleanId);

    if (index === -1) {
      throw new Error(`Книга с ID ${cleanId} не найдена`);
    }

    const current = books[index];
    const updatedBook: Book = {
      ...current,
      ...(dto.title && { title: sanitizeInput(dto.title) }),
      ...(dto.author && { author: sanitizeInput(dto.author) }),
      ...(dto.price !== undefined && { price: sanitizePrice(dto.price) }),
      ...(dto.oldPrice !== undefined && { oldPrice: sanitizePrice(dto.oldPrice) }),
      ...(dto.coverImage && { coverImage: sanitizeUrl(dto.coverImage) }),
      ...(dto.description && { description: sanitizeInput(dto.description) }),
      ...(dto.genre && { genre: sanitizeInput(dto.genre) }),
      ...(dto.language && { language: dto.language }),
      ...(dto.stock !== undefined && { stock: sanitizeStock(dto.stock) }),
      ...(dto.publicationYear && { publicationYear: dto.publicationYear }),
      ...(dto.pages && { pages: dto.pages }),
      ...(dto.isbn && { isbn: sanitizeInput(dto.isbn) }),
      ...(dto.publisher && { publisher: sanitizeInput(dto.publisher) }),
      ...(dto.coverType && { coverType: dto.coverType }),
    };

    books[index] = updatedBook;
    storageService.set(STORAGE_KEY, books);
    return updatedBook;
  },

  async delete(id: string): Promise<void> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const cleanId = sanitizeId(id);
    const filtered = books.filter((b) => b.id !== cleanId);
    storageService.set(STORAGE_KEY, filtered);
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const cleanId = sanitizeId(id);
    const book = books.find((b) => b.id === cleanId);
    if (book) {
      book.stock = sanitizeStock(newStock);
      storageService.set(STORAGE_KEY, books);
    }
  },

  async decreaseStock(id: string, count: number): Promise<void> {
    await mockNetworkDelay();
    const books = storageService.get<Book[]>(STORAGE_KEY, INITIAL_BOOKS_SEED);
    const cleanId = sanitizeId(id);
    const book = books.find((b) => b.id === cleanId);
    if (book) {
      book.stock = Math.max(0, book.stock - count);
      storageService.set(STORAGE_KEY, books);
    }
  },

  async reset(): Promise<void> {
    await mockNetworkDelay();
    storageService.set(STORAGE_KEY, INITIAL_BOOKS_SEED);
  },
};
