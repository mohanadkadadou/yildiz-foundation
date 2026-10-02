// prisma/seed-international-universities.ts
// Adds Northern Cyprus, Georgia, Germany, Spain, Hungary, Romania and Syria universities,
// and tags the existing Northern Cyprus universities with country = 'northern-cyprus'.
// Safe to re-run: upserts on slug and never deletes data.
// Founding years are only set where well documented; descriptions avoid unverifiable figures.
import { PrismaClient, UniversityType } from '@prisma/client'

const prisma = new PrismaClient()

type Tri = { en: string; ar: string; tr: string }
const PUB = UniversityType.PUBLIC
const PRV = UniversityType.PRIVATE

const COUNTRIES: Record<string, { name: Tri; blurb: Tri }> = {
  'northern-cyprus': {
    name: { en: 'Northern Cyprus', ar: 'قبرص التركية', tr: 'Kuzey Kıbrıs' },
    blurb: {
      en: 'Northern Cyprus is a popular destination for international students, with many programs taught in English.',
      ar: 'تُعدّ شمال قبرص وجهة مفضلة للطلاب الدوليين، وتوفر العديد من البرامج الدراسية باللغة الإنجليزية.',
      tr: 'Kuzey Kıbrıs, İngilizce yürütülen çok sayıda programıyla uluslararası öğrenciler için popüler bir destinasyondur.',
    },
  },
  georgia: {
    name: { en: 'Georgia', ar: 'جورجيا', tr: 'Gürcistan' },
    blurb: {
      en: 'Georgia is known for affordable tuition and living costs and a growing number of English-taught programs, particularly in medicine.',
      ar: 'تشتهر جورجيا بانخفاض الرسوم الدراسية وتكاليف المعيشة وبتزايد البرامج المدرَّسة بالإنجليزية، خاصة في الطب.',
      tr: 'Gürcistan, uygun öğrenim ve yaşam maliyetleri ile özellikle tıpta artan sayıda İngilizce programıyla tanınır.',
    },
  },
  germany: {
    name: { en: 'Germany', ar: 'ألمانيا', tr: 'Almanya' },
    blurb: {
      en: 'Germany is known for high-quality, research-driven education; most public universities charge little or no tuition, although living costs and semester contributions apply.',
      ar: 'تشتهر ألمانيا بتعليم عالي الجودة قائم على البحث العلمي؛ ومعظم الجامعات الحكومية تفرض رسوماً دراسية منخفضة أو لا تفرضها، مع وجود تكاليف معيشة ورسوم فصلية.',
      tr: 'Almanya, yüksek kaliteli ve araştırma odaklı eğitimiyle tanınır; devlet üniversitelerinin çoğu düşük ya da hiç öğrenim ücreti almaz, ancak yaşam giderleri ve dönem katkı payları vardır.',
    },
  },
  spain: {
    name: { en: 'Spain', ar: 'إسبانيا', tr: 'İspanya' },
    blurb: {
      en: 'Spain offers a wide range of degrees at historic public universities and respected private institutions, taught in Spanish and increasingly in English.',
      ar: 'تقدم إسبانيا مجموعة واسعة من الدرجات العلمية في جامعات حكومية عريقة ومؤسسات خاصة مرموقة، بالإسبانية وبشكل متزايد بالإنجليزية.',
      tr: "İspanya, köklü devlet üniversiteleri ve saygın özel kurumlarda İspanyolca ve giderek artan şekilde İngilizce yürütülen geniş bir program yelpazesi sunar.",
    },
  },
  hungary: {
    name: { en: 'Hungary', ar: 'هنغاريا', tr: 'Macaristan' },
    blurb: {
      en: 'Hungary is a popular European destination for international students, with English-taught programs and scholarship opportunities such as the Stipendium Hungaricum.',
      ar: 'تُعدّ هنغاريا وجهة أوروبية مفضلة للطلاب الدوليين، مع برامج بالإنجليزية وفرص منح دراسية مثل منحة Stipendium Hungaricum.',
      tr: "Macaristan, İngilizce programları ve Stipendium Hungaricum gibi burs imkânlarıyla uluslararası öğrenciler için popüler bir Avrupa destinasyonudur.",
    },
  },
  romania: {
    name: { en: 'Romania', ar: 'رومانيا', tr: 'Romanya' },
    blurb: {
      en: 'Romania is known for affordable European education, with many English-taught programs, particularly in medicine and dentistry.',
      ar: 'تشتهر رومانيا بتعليم أوروبي بتكلفة معقولة، مع العديد من البرامج المدرَّسة بالإنجليزية، خاصة في الطب وطب الأسنان.',
      tr: 'Romanya, özellikle tıp ve diş hekimliğinde birçok İngilizce programıyla uygun maliyetli Avrupa eğitimiyle tanınır.',
    },
  },
  syria: {
    name: { en: 'Syria', ar: 'سوريا', tr: 'Suriye' },
    blurb: {
      en: 'Syria offers a wide range of degrees at public and private universities, with Arabic as the main language of instruction.',
      ar: 'تقدم سوريا مجموعة واسعة من الدرجات العلمية في الجامعات الحكومية والخاصة، واللغة العربية هي لغة التدريس الرئيسية.',
      tr: "Suriye, devlet ve özel üniversitelerde geniş bir program yelpazesi sunar; öğretim dili ağırlıklı olarak Arapçadır.",
    },
  },
}

const CITIES: Record<string, Tri> = {
  kyrenia: { en: 'Kyrenia', ar: 'كيرينيا', tr: 'Girne' },
  nicosia: { en: 'Nicosia', ar: 'نيقوسيا', tr: 'Lefkoşa' },
  famagusta: { en: 'Famagusta', ar: 'فاماغوستا', tr: 'Gazimağusa' },
  guzelyurt: { en: 'Güzelyurt', ar: 'غوزيل يورت', tr: 'Güzelyurt' },
  tbilisi: { en: 'Tbilisi', ar: 'تبليسي', tr: 'Tiflis' },
  batumi: { en: 'Batumi', ar: 'باتومي', tr: 'Batum' },
  kutaisi: { en: 'Kutaisi', ar: 'كوتايسي', tr: 'Kutaisi' },
  munich: { en: 'Munich', ar: 'ميونخ', tr: 'Münih' },
  berlin: { en: 'Berlin', ar: 'برلين', tr: 'Berlin' },
  heidelberg: { en: 'Heidelberg', ar: 'هايدلبرغ', tr: 'Heidelberg' },
  aachen: { en: 'Aachen', ar: 'آخن', tr: 'Aachen' },
  freiburg: { en: 'Freiburg', ar: 'فرايبورغ', tr: 'Freiburg' },
  hamburg: { en: 'Hamburg', ar: 'هامبورغ', tr: 'Hamburg' },
  frankfurt: { en: 'Frankfurt', ar: 'فرانكفورت', tr: 'Frankfurt' },
  stuttgart: { en: 'Stuttgart', ar: 'شتوتغارت', tr: 'Stuttgart' },
  karlsruhe: { en: 'Karlsruhe', ar: 'كارلسروه', tr: 'Karlsruhe' },
  bonn: { en: 'Bonn', ar: 'بون', tr: 'Bonn' },
  cologne: { en: 'Cologne', ar: 'كولونيا', tr: 'Köln' },
  leipzig: { en: 'Leipzig', ar: 'لايبزيغ', tr: 'Leipzig' },
  barcelona: { en: 'Barcelona', ar: 'برشلونة', tr: 'Barselona' },
  madrid: { en: 'Madrid', ar: 'مدريد', tr: 'Madrid' },
  salamanca: { en: 'Salamanca', ar: 'سالامانكا', tr: 'Salamanca' },
  valencia: { en: 'Valencia', ar: 'فالنسيا', tr: 'Valensiya' },
  granada: { en: 'Granada', ar: 'غرناطة', tr: 'Granada' },
  seville: { en: 'Seville', ar: 'إشبيلية', tr: 'Sevilla' },
  pamplona: { en: 'Pamplona', ar: 'بامبلونا', tr: 'Pamplona' },
  zaragoza: { en: 'Zaragoza', ar: 'سرقسطة', tr: 'Zaragoza' },
  budapest: { en: 'Budapest', ar: 'بودابست', tr: 'Budapeşte' },
  szeged: { en: 'Szeged', ar: 'سيجيد', tr: 'Szeged' },
  debrecen: { en: 'Debrecen', ar: 'ديبريتسن', tr: 'Debrecen' },
  pecs: { en: 'Pécs', ar: 'بيتش', tr: 'Pécs' },
  miskolc: { en: 'Miskolc', ar: 'ميشكولتس', tr: 'Miskolc' },
  gyor: { en: 'Győr', ar: 'غيور', tr: 'Győr' },
  bucharest: { en: 'Bucharest', ar: 'بوخارست', tr: 'Bükreş' },
  'cluj-napoca': { en: 'Cluj-Napoca', ar: 'كلوج نابوكا', tr: 'Cluj-Napoca' },
  iasi: { en: 'Iași', ar: 'ياش', tr: 'Iași' },
  timisoara: { en: 'Timișoara', ar: 'تيميشوارا', tr: 'Timişoara' },
  constanta: { en: 'Constanța', ar: 'كونستانتسا', tr: 'Köstence' },
  'targu-mures': { en: 'Târgu Mureș', ar: 'تيرغو موريش', tr: 'Târgu Mureș' },
  brasov: { en: 'Brașov', ar: 'براشوف', tr: 'Braşov' },
  damascus: { en: 'Damascus', ar: 'دمشق', tr: 'Şam' },
  aleppo: { en: 'Aleppo', ar: 'حلب', tr: 'Halep' },
  latakia: { en: 'Latakia', ar: 'اللاذقية', tr: 'Lazkiye' },
  homs: { en: 'Homs', ar: 'حمص', tr: 'Humus' },
  'deir-ez-zor': { en: 'Deir ez-Zor', ar: 'دير الزور', tr: 'Deyrizor' },
  'deir-atiyah': { en: 'Deir Atiyah', ar: 'دير عطية', tr: 'Deyr Atiyye' },
  daraa: { en: 'Daraa', ar: 'درعا', tr: 'Dera' },
  tartus: { en: 'Tartus', ar: 'طرطوس', tr: 'Tartus' },
}

// [country, slug, nameEn, nameAr, nameTr, cityKey, type, establishedYear | null]
type Row = [string, string, string, string, string, string, UniversityType, number | null]
const ROWS: Row[] = [
  // Northern Cyprus (additions to the 8 already in the database)
  ['northern-cyprus', 'cyprus-science-university', 'Cyprus Science University', 'جامعة قبرص للعلوم', 'Kıbrıs İlim Üniversitesi', 'kyrenia', PRV, 2013],
  ['northern-cyprus', 'metu-northern-cyprus-campus', 'Middle East Technical University Northern Cyprus Campus', 'جامعة الشرق الأوسط التقنية - حرم شمال قبرص', 'Orta Doğu Teknik Üniversitesi Kuzey Kıbrıs Kampüsü', 'guzelyurt', PUB, 2003],
  ['northern-cyprus', 'final-international-university', 'Final International University', 'جامعة فاينال الدولية', 'Final Uluslararası Üniversitesi', 'kyrenia', PRV, null],
  ['northern-cyprus', 'arkin-university-of-creative-arts-and-design', 'Arkın University of Creative Arts and Design', 'جامعة أركين للفنون الإبداعية والتصميم', 'Arkın Yaratıcı Sanatlar ve Tasarım Üniversitesi', 'kyrenia', PRV, null],
  ['northern-cyprus', 'cyprus-west-university', 'Cyprus West University', 'جامعة قبرص الغربية', 'Kıbrıs Batı Üniversitesi', 'famagusta', PRV, null],
  ['northern-cyprus', 'rauf-denktas-university', 'Rauf Denktaş University', 'جامعة رؤوف دنكتاش', 'Rauf Denktaş Üniversitesi', 'nicosia', PRV, null],
  // Georgia
  ['georgia', 'tbilisi-state-university', 'Tbilisi State University', 'جامعة تبليسي الحكومية', 'Tiflis Devlet Üniversitesi', 'tbilisi', PUB, 1918],
  ['georgia', 'georgian-technical-university', 'Georgian Technical University', 'الجامعة التقنية الجورجية', 'Gürcistan Teknik Üniversitesi', 'tbilisi', PUB, 1922],
  ['georgia', 'ilia-state-university', 'Ilia State University', 'جامعة إيليا الحكومية', 'İlia Devlet Üniversitesi', 'tbilisi', PUB, 2006],
  ['georgia', 'tbilisi-state-medical-university', 'Tbilisi State Medical University', 'جامعة تبليسي الحكومية الطبية', 'Tiflis Devlet Tıp Üniversitesi', 'tbilisi', PUB, 1918],
  ['georgia', 'caucasus-university', 'Caucasus University', 'جامعة القوقاز', 'Kafkasya Üniversitesi', 'tbilisi', PRV, 1998],
  ['georgia', 'free-university-of-tbilisi', 'Free University of Tbilisi', 'الجامعة الحرة في تبليسي', 'Tiflis Özgür Üniversitesi', 'tbilisi', PRV, 2007],
  ['georgia', 'university-of-georgia-tbilisi', 'University of Georgia', 'جامعة جورجيا', 'Gürcistan Üniversitesi', 'tbilisi', PRV, null],
  ['georgia', 'david-tvildiani-medical-university', 'David Tvildiani Medical University', 'جامعة ديفيد تفيلديانيي الطبية', 'David Tvildiani Tıp Üniversitesi', 'tbilisi', PRV, null],
  ['georgia', 'batumi-shota-rustaveli-state-university', 'Batumi Shota Rustaveli State University', 'جامعة باتومي الحكومية شوتا روستافيلي', 'Batum Şota Rustaveli Devlet Üniversitesi', 'batumi', PUB, 1935],
  ['georgia', 'bau-international-university-batumi', 'BAU International University Batumi', 'جامعة BAU الدولية باتومي', 'BAU Uluslararası Üniversitesi Batum', 'batumi', PRV, null],
  ['georgia', 'akaki-tsereteli-state-university', 'Akaki Tsereteli State University', 'جامعة أكاكي تسيريتيلي الحكومية', 'Akaki Tsereteli Devlet Üniversitesi', 'kutaisi', PUB, 1933],
  // Germany
  ['germany', 'technical-university-of-munich', 'Technical University of Munich', 'الجامعة التقنية في ميونخ', 'Münih Teknik Üniversitesi', 'munich', PUB, 1868],
  ['germany', 'ludwig-maximilian-university-of-munich', 'Ludwig Maximilian University of Munich', 'جامعة لودفيغ ماكسيميليان في ميونخ', 'Münih Ludwig Maximilian Üniversitesi', 'munich', PUB, 1472],
  ['germany', 'heidelberg-university', 'Heidelberg University', 'جامعة هايدلبرغ', 'Heidelberg Üniversitesi', 'heidelberg', PUB, 1386],
  ['germany', 'humboldt-university-of-berlin', 'Humboldt University of Berlin', 'جامعة هومبولت في برلين', 'Berlin Humboldt Üniversitesi', 'berlin', PUB, 1810],
  ['germany', 'technical-university-of-berlin', 'Technical University of Berlin', 'الجامعة التقنية في برلين', 'Berlin Teknik Üniversitesi', 'berlin', PUB, 1879],
  ['germany', 'free-university-of-berlin', 'Free University of Berlin', 'الجامعة الحرة في برلين', 'Berlin Özgür Üniversitesi', 'berlin', PUB, 1948],
  ['germany', 'rwth-aachen-university', 'RWTH Aachen University', 'جامعة آخن التقنية (RWTH)', 'RWTH Aachen Üniversitesi', 'aachen', PUB, 1870],
  ['germany', 'university-of-freiburg', 'University of Freiburg', 'جامعة فرايبورغ', 'Freiburg Üniversitesi', 'freiburg', PUB, 1457],
  ['germany', 'university-of-hamburg', 'University of Hamburg', 'جامعة هامبورغ', 'Hamburg Üniversitesi', 'hamburg', PUB, 1919],
  ['germany', 'goethe-university-frankfurt', 'Goethe University Frankfurt', 'جامعة غوته في فرانكفورت', 'Frankfurt Goethe Üniversitesi', 'frankfurt', PUB, 1914],
  ['germany', 'university-of-stuttgart', 'University of Stuttgart', 'جامعة شتوتغارت', 'Stuttgart Üniversitesi', 'stuttgart', PUB, 1829],
  ['germany', 'karlsruhe-institute-of-technology', 'Karlsruhe Institute of Technology', 'معهد كارلسروه للتكنولوجيا', 'Karlsruhe Teknoloji Enstitüsü', 'karlsruhe', PUB, null],
  ['germany', 'university-of-bonn', 'University of Bonn', 'جامعة بون', 'Bonn Üniversitesi', 'bonn', PUB, 1818],
  ['germany', 'university-of-cologne', 'University of Cologne', 'جامعة كولونيا', 'Köln Üniversitesi', 'cologne', PUB, 1388],
  ['germany', 'leipzig-university', 'Leipzig University', 'جامعة لايبزيغ', 'Leipzig Üniversitesi', 'leipzig', PUB, 1409],
  // Spain
  ['spain', 'university-of-barcelona', 'University of Barcelona', 'جامعة برشلونة', 'Barselona Üniversitesi', 'barcelona', PUB, 1450],
  ['spain', 'complutense-university-of-madrid', 'Complutense University of Madrid', 'جامعة كومبلوتنسي بمدريد', 'Madrid Complutense Üniversitesi', 'madrid', PUB, null],
  ['spain', 'autonomous-university-of-madrid', 'Autonomous University of Madrid', 'جامعة مدريد المستقلة', 'Madrid Özerk Üniversitesi', 'madrid', PUB, 1968],
  ['spain', 'university-of-salamanca', 'University of Salamanca', 'جامعة سالامانكا', 'Salamanca Üniversitesi', 'salamanca', PUB, 1218],
  ['spain', 'university-of-valencia', 'University of Valencia', 'جامعة فالنسيا', 'Valensiya Üniversitesi', 'valencia', PUB, 1499],
  ['spain', 'university-of-granada', 'University of Granada', 'جامعة غرناطة', 'Granada Üniversitesi', 'granada', PUB, 1531],
  ['spain', 'pompeu-fabra-university', 'Pompeu Fabra University', 'جامعة بومبيو فابرا', 'Pompeu Fabra Üniversitesi', 'barcelona', PUB, 1990],
  ['spain', 'carlos-iii-university-of-madrid', 'Carlos III University of Madrid', 'جامعة كارلوس الثالث بمدريد', 'Madrid Carlos III Üniversitesi', 'madrid', PUB, 1989],
  ['spain', 'technical-university-of-madrid', 'Technical University of Madrid', 'الجامعة البوليتكنيكية في مدريد', 'Madrid Teknik Üniversitesi', 'madrid', PUB, 1971],
  ['spain', 'polytechnic-university-of-valencia', 'Polytechnic University of Valencia', 'الجامعة البوليتكنيكية في فالنسيا', 'Valensiya Politeknik Üniversitesi', 'valencia', PUB, 1968],
  ['spain', 'university-of-seville', 'University of Seville', 'جامعة إشبيلية', 'Sevilla Üniversitesi', 'seville', PUB, 1505],
  ['spain', 'university-of-navarra', 'University of Navarra', 'جامعة نافارا', 'Navarra Üniversitesi', 'pamplona', PRV, 1952],
  ['spain', 'ie-university', 'IE University', 'جامعة IE', 'IE Üniversitesi', 'madrid', PRV, null],
  ['spain', 'university-of-zaragoza', 'University of Zaragoza', 'جامعة سرقسطة', 'Zaragoza Üniversitesi', 'zaragoza', PUB, 1542],
  // Hungary
  ['hungary', 'eotvos-lorand-university', 'Eötvös Loránd University', 'جامعة أوتفوش لوراند (ELTE)', 'Eötvös Loránd Üniversitesi', 'budapest', PUB, 1635],
  ['hungary', 'university-of-szeged', 'University of Szeged', 'جامعة سيجيد', 'Szeged Üniversitesi', 'szeged', PUB, 1872],
  ['hungary', 'university-of-debrecen', 'University of Debrecen', 'جامعة ديبريتسن', 'Debrecen Üniversitesi', 'debrecen', PUB, 1538],
  ['hungary', 'semmelweis-university', 'Semmelweis University', 'جامعة سيملفايس', 'Semmelweis Üniversitesi', 'budapest', PUB, 1769],
  ['hungary', 'university-of-pecs', 'University of Pécs', 'جامعة بيتش', 'Pécs Üniversitesi', 'pecs', PUB, 1367],
  ['hungary', 'budapest-university-of-technology-and-economics', 'Budapest University of Technology and Economics', 'جامعة بودابست للتكنولوجيا والاقتصاد', 'Budapeşte Teknoloji ve Ekonomi Üniversitesi', 'budapest', PUB, 1782],
  ['hungary', 'corvinus-university-of-budapest', 'Corvinus University of Budapest', 'جامعة كورفينوس في بودابست', 'Budapeşte Corvinus Üniversitesi', 'budapest', PUB, 1920],
  ['hungary', 'pazmany-peter-catholic-university', 'Pázmány Péter Catholic University', 'جامعة بازماني بيتر الكاثوليكية', 'Pázmány Péter Katolik Üniversitesi', 'budapest', PRV, 1635],
  ['hungary', 'university-of-miskolc', 'University of Miskolc', 'جامعة ميشكولتس', 'Miskolc Üniversitesi', 'miskolc', PUB, 1735],
  ['hungary', 'szechenyi-istvan-university', 'Széchenyi István University', 'جامعة سيتشيني إشتفان', 'Széchenyi István Üniversitesi', 'gyor', PUB, null],
  // Romania
  ['romania', 'university-of-bucharest', 'University of Bucharest', 'جامعة بوخارست', 'Bükreş Üniversitesi', 'bucharest', PUB, 1864],
  ['romania', 'babes-bolyai-university', 'Babeș-Bolyai University', 'جامعة بابش بولياي', 'Babeş-Bolyai Üniversitesi', 'cluj-napoca', PUB, 1919],
  ['romania', 'carol-davila-university-of-medicine-and-pharmacy', 'Carol Davila University of Medicine and Pharmacy', 'جامعة كارول دافيلا للطب والصيدلة', 'Carol Davila Tıp ve Eczacılık Üniversitesi', 'bucharest', PUB, 1857],
  ['romania', 'iuliu-hatieganu-university-of-medicine-and-pharmacy', 'Iuliu Hațieganu University of Medicine and Pharmacy', 'جامعة يوليو هاتيغانو للطب والصيدلة', 'Iuliu Hațieganu Tıp ve Eczacılık Üniversitesi', 'cluj-napoca', PUB, 1919],
  ['romania', 'politehnica-university-of-bucharest', 'Politehnica University of Bucharest', 'جامعة بوليتيهنيكا بوخارست', 'Bükreş Politehnica Üniversitesi', 'bucharest', PUB, 1818],
  ['romania', 'alexandru-ioan-cuza-university-of-iasi', 'Alexandru Ioan Cuza University of Iași', 'جامعة ألكسندرو يوان كوزا في ياش', 'Iași Alexandru Ioan Cuza Üniversitesi', 'iasi', PUB, 1860],
  ['romania', 'west-university-of-timisoara', 'West University of Timișoara', 'جامعة غرب تيميشوارا', 'Timişoara Batı Üniversitesi', 'timisoara', PUB, 1944],
  ['romania', 'grigore-t-popa-university-of-medicine-and-pharmacy-iasi', 'Grigore T. Popa University of Medicine and Pharmacy Iași', 'جامعة غريغوري ت. بوبا للطب والصيدلة في ياش', 'Iași Grigore T. Popa Tıp ve Eczacılık Üniversitesi', 'iasi', PUB, 1879],
  ['romania', 'ovidius-university-of-constanta', 'Ovidius University of Constanța', 'جامعة أوفيديوس في كونستانتسا', 'Köstence Ovidius Üniversitesi', 'constanta', PUB, 1990],
  ['romania', 'george-emil-palade-university-of-medicine-pharmacy-science-and-technology-of-targu-mures', 'George Emil Palade University of Medicine, Pharmacy, Science and Technology of Târgu Mureș', 'جامعة جورج إميل بالادي للطب والصيدلة والعلوم والتكنولوجيا في تيرغو موريش', 'Târgu Mureș George Emil Palade Tıp, Eczacılık, Bilim ve Teknoloji Üniversitesi', 'targu-mures', PUB, 1945],
  ['romania', 'transilvania-university-of-brasov', 'Transilvania University of Brașov', 'جامعة ترانسيلفانيا في براشوف', 'Braşov Transilvanya Üniversitesi', 'brasov', PUB, 1948],
  // Syria
  ['syria', 'damascus-university', 'Damascus University', 'جامعة دمشق', 'Şam Üniversitesi', 'damascus', PUB, 1923],
  ['syria', 'university-of-aleppo', 'University of Aleppo', 'جامعة حلب', 'Halep Üniversitesi', 'aleppo', PUB, 1958],
  ['syria', 'tishreen-university', 'Tishreen University', 'جامعة تشرين', 'Tişrin Üniversitesi', 'latakia', PUB, 1971],
  ['syria', 'al-baath-university', 'Al-Baath University', 'جامعة البعث', 'Baas Üniversitesi', 'homs', PUB, 1979],
  ['syria', 'syrian-virtual-university', 'Syrian Virtual University', 'الجامعة الافتراضية السورية', 'Suriye Sanal Üniversitesi', 'damascus', PUB, 2002],
  ['syria', 'al-furat-university', 'Al-Furat University', 'جامعة الفرات', 'Fırat Üniversitesi (Suriye)', 'deir-ez-zor', PUB, 2006],
  ['syria', 'al-kalamoon-university', 'Al-Kalamoon University', 'جامعة القلمون الخاصة', 'Kalamun Özel Üniversitesi', 'deir-atiyah', PRV, 2003],
  ['syria', 'syrian-private-university', 'Syrian Private University', 'الجامعة السورية الخاصة', 'Suriye Özel Üniversitesi', 'damascus', PRV, null],
  ['syria', 'arab-international-university', 'Arab International University', 'الجامعة العربية الدولية', 'Uluslararası Arap Üniversitesi', 'daraa', PRV, 2005],
  ['syria', 'international-university-for-science-and-technology', 'International University for Science and Technology', 'الجامعة الدولية للعلوم والتكنولوجيا', 'Uluslararası Bilim ve Teknoloji Üniversitesi', 'daraa', PRV, null],
  ['syria', 'wadi-international-university', 'Wadi International University', 'جامعة الوادي الدولية الخاصة', 'Vadi Uluslararası Üniversitesi', 'homs', PRV, null],
  ['syria', 'al-andalus-university-for-medical-sciences', 'Al-Andalus University for Medical Sciences', 'جامعة الأندلس للعلوم الطبية', 'Endülüs Tıp Bilimleri Üniversitesi', 'tartus', PRV, null],
]

function describe(country: string, nameEn: string, nameAr: string, nameTr: string, cityKey: string, type: UniversityType, year: number | null) {
  const c = COUNTRIES[country]
  const city = CITIES[cityKey]
  const isPub = type === PUB
  return {
    descriptionEn: `${nameEn} is a ${isPub ? 'public' : 'private'} university in ${city.en}, ${c.name.en}${year ? `, founded in ${year}` : ''}. ${c.blurb.en}`,
    descriptionAr: `${nameAr} جامعة ${isPub ? 'حكومية' : 'خاصة'} تقع في ${city.ar}، ${c.name.ar}${year ? `، تأسست عام ${year}` : ''}. ${c.blurb.ar}`,
    descriptionTr: `${nameTr}, ${city.tr} (${c.name.tr}) şehrinde yer alan bir ${isPub ? 'devlet' : 'özel'} üniversitesidir${year ? ` ve ${year} yılında kurulmuştur` : ''}. ${c.blurb.tr}`,
  }
}

async function main() {
  // Tag the Northern Cyprus universities already in the database.
  const tagged = await prisma.university.updateMany({
    where: { city: { in: ['nicosia', 'kyrenia', 'famagusta', 'lefke', 'guzelyurt'] } },
    data: { country: 'northern-cyprus' },
  })
  console.log(`Tagged ${tagged.count} existing Northern Cyprus universities`)

  for (const [country, slug, nameEn, nameAr, nameTr, cityKey, type, year] of ROWS) {
    const city = CITIES[cityKey]
    if (!city) throw new Error(`Unknown city key: ${cityKey}`)
    const data = {
      country, nameEn, nameAr, nameTr,
      city: cityKey, cityEn: city.en, cityAr: city.ar, cityTr: city.tr,
      type, establishedYear: year,
      ...describe(country, nameEn, nameAr, nameTr, cityKey, type, year),
    }
    await prisma.university.upsert({ where: { slug }, update: data, create: { slug, ...data } })
  }
  console.log(`Upserted ${ROWS.length} universities`)

  const counts = await prisma.university.groupBy({ by: ['country'], _count: { _all: true } })
  console.log(counts.map(c => `${c.country}: ${c._count._all}`).join('\n'))
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
