// prisma/seed.ts
import { PrismaClient, UniversityType, DegreeType, ProgramLang } from '@prisma/client'

const prisma = new PrismaClient()

const universities = [
  {
    slug: 'istanbul-university',
    nameEn: 'Istanbul University',
    nameAr: 'جامعة إسطنبول',
    nameTr: 'İstanbul Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PUBLIC,
    ranking: 1,
    descriptionEn: 'Istanbul University is one of the oldest and most prestigious universities in Turkey, founded in 1453. It offers world-class education across 17 faculties with over 100,000 students.',
    descriptionAr: 'جامعة إسطنبول هي واحدة من أعرق الجامعات في تركيا، تأسست عام 1453. تقدم تعليماً عالمي المستوى عبر 17 كلية مع أكثر من 100,000 طالب.',
    descriptionTr: 'İstanbul Üniversitesi, 1453 yılında kurulan Türkiye\'nin en köklü ve prestijli üniversitelerinden biridir. 17 fakültede 100.000\'den fazla öğrenciye dünya standartlarında eğitim vermektedir.',
    website: 'https://www.istanbul.edu.tr',
    establishedYear: 1453,
    totalStudents: 100000,
    internationalStudents: 8000,
    isFeatured: true,
    latitude: 41.0155, longitude: 28.9550,
  },
  {
    slug: 'middle-east-technical-university',
    nameEn: 'Middle East Technical University',
    nameAr: 'جامعة الشرق الأوسط التقنية',
    nameTr: 'Orta Doğu Teknik Üniversitesi',
    city: 'ankara', cityEn: 'Ankara', cityAr: 'أنقرة', cityTr: 'Ankara',
    type: UniversityType.PUBLIC,
    ranking: 2,
    descriptionEn: 'METU is Turkey\'s premier science and technology university, consistently ranked among the top universities globally. Known for exceptional engineering and science programs.',
    descriptionAr: 'جامعة الشرق الأوسط التقنية هي الجامعة الرائدة في مجال العلوم والتكنولوجيا في تركيا، وتحتل باستمرار مكانة بين أفضل الجامعات عالمياً.',
    descriptionTr: 'ODTÜ, Türkiye\'nin önde gelen bilim ve teknoloji üniversitesidir ve küresel ölçekte sürekli olarak en iyi üniversiteler arasında yer almaktadır.',
    website: 'https://www.metu.edu.tr',
    establishedYear: 1956,
    totalStudents: 28000,
    internationalStudents: 4500,
    isFeatured: true,
    latitude: 39.8997, longitude: 32.7760,
  },
  {
    slug: 'bogazici-university',
    nameEn: 'Boğaziçi University',
    nameAr: 'جامعة البوسفور',
    nameTr: 'Boğaziçi Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PUBLIC,
    ranking: 3,
    descriptionEn: 'Boğaziçi University is renowned for its English-medium instruction and beautiful Bosphorus campus. One of Turkey\'s most selective and prestigious institutions.',
    descriptionAr: 'تشتهر جامعة البوسفور بالتدريس باللغة الإنجليزية وحرمها الجامعي الجميل على مضيق البوسفور. تُعدّ من أكثر المؤسسات انتقائية وهيبة في تركيا.',
    descriptionTr: 'Boğaziçi Üniversitesi, İngilizce eğitimi ve muhteşem Boğaz kampüsüyle ünlüdür. Türkiye\'nin en seçici ve prestijli kurumlarından biridir.',
    website: 'https://www.boun.edu.tr',
    establishedYear: 1863,
    totalStudents: 15000,
    internationalStudents: 2000,
    isFeatured: true,
    latitude: 41.0839, longitude: 29.0502,
  },
  {
    slug: 'istanbul-technical-university',
    nameEn: 'Istanbul Technical University',
    nameAr: 'جامعة إسطنبول التقنية',
    nameTr: 'İstanbul Teknik Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PUBLIC,
    ranking: 4,
    descriptionEn: 'ITU is one of the world\'s oldest technical universities, established in 1773. It excels in engineering, architecture, and science with cutting-edge research facilities.',
    descriptionAr: 'جامعة إسطنبول التقنية هي واحدة من أقدم الجامعات التقنية في العالم، تأسست عام 1773. تتميز في الهندسة والعمارة والعلوم.',
    descriptionTr: 'İTÜ, 1773\'te kurulan dünyanın en eski teknik üniversitelerinden biridir. Mühendislik, mimarlık ve bilim alanlarında öne çıkmaktadır.',
    website: 'https://www.itu.edu.tr',
    establishedYear: 1773,
    totalStudents: 35000,
    internationalStudents: 5000,
    isFeatured: true,
    latitude: 41.1055, longitude: 29.0239,
  },
  {
    slug: 'hacettepe-university',
    nameEn: 'Hacettepe University',
    nameAr: 'جامعة حاجتبة',
    nameTr: 'Hacettepe Üniversitesi',
    city: 'ankara', cityEn: 'Ankara', cityAr: 'أنقرة', cityTr: 'Ankara',
    type: UniversityType.PUBLIC,
    ranking: 5,
    descriptionEn: 'Hacettepe University is one of Turkey\'s top research universities, especially renowned for its medical school and health sciences programs.',
    descriptionAr: 'جامعة حاجتبة هي إحدى جامعات البحث العلمي الرائدة في تركيا، وتشتهر بكلية الطب وبرامج العلوم الصحية.',
    descriptionTr: 'Hacettepe Üniversitesi, özellikle tıp fakültesi ve sağlık bilimleri programlarıyla ünlü, Türkiye\'nin en iyi araştırma üniversitelerinden biridir.',
    website: 'https://www.hacettepe.edu.tr',
    establishedYear: 1967,
    totalStudents: 42000,
    internationalStudents: 3500,
    isFeatured: false,
    latitude: 39.8680, longitude: 32.7335,
  },
  {
    slug: 'ankara-university',
    nameEn: 'Ankara University',
    nameAr: 'جامعة أنقرة',
    nameTr: 'Ankara Üniversitesi',
    city: 'ankara', cityEn: 'Ankara', cityAr: 'أنقرة', cityTr: 'Ankara',
    type: UniversityType.PUBLIC,
    ranking: 6,
    descriptionEn: 'Ankara University is Turkey\'s oldest state university in the capital. It offers a wide range of programs across 14 faculties and is known for its strong legal and political science departments.',
    descriptionAr: 'جامعة أنقرة هي أقدم جامعة حكومية في العاصمة تركيا. تقدم مجموعة واسعة من البرامج عبر 14 كلية.',
    descriptionTr: 'Ankara Üniversitesi, Türkiye\'nin başkentindeki en eski devlet üniversitesidir. 14 fakülte genelinde geniş bir program yelpazesi sunmaktadır.',
    website: 'https://www.ankara.edu.tr',
    establishedYear: 1946,
    totalStudents: 50000,
    internationalStudents: 3000,
    isFeatured: false,
    latitude: 39.9400, longitude: 32.8596,
  },
  {
    slug: 'sabanci-university',
    nameEn: 'Sabancı University',
    nameAr: 'جامعة صبانجي',
    nameTr: 'Sabancı Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 7,
    descriptionEn: 'Sabancı University is a top private research university in Turkey, known for its interdisciplinary approach and English-medium programs in engineering, management, and arts.',
    descriptionAr: 'جامعة صبانجي هي جامعة بحثية خاصة رائدة في تركيا، تُعرف بنهجها متعدد التخصصات وبرامجها باللغة الإنجليزية.',
    descriptionTr: 'Sabancı Üniversitesi, disiplinlerarası yaklaşımı ve mühendislik, yönetim ve sanat alanlarındaki İngilizce programlarıyla tanınan Türkiye\'nin önde gelen özel araştırma üniversitesidir.',
    website: 'https://www.sabanciuniv.edu',
    establishedYear: 1996,
    totalStudents: 10000,
    internationalStudents: 1500,
    isFeatured: true,
    latitude: 40.8910, longitude: 29.3777,
  },
  {
    slug: 'koc-university',
    nameEn: 'Koç University',
    nameAr: 'جامعة كوتش',
    nameTr: 'Koç Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 8,
    descriptionEn: 'Koç University is a world-class private university offering English-medium education. It is consistently ranked among the top universities in Turkey and the region.',
    descriptionAr: 'جامعة كوتش هي جامعة خاصة ذات مستوى عالمي تقدم التعليم باللغة الإنجليزية.',
    descriptionTr: 'Koç Üniversitesi, İngilizce eğitim veren dünya standartlarında bir özel üniversitedir.',
    website: 'https://www.ku.edu.tr',
    establishedYear: 1993,
    totalStudents: 9000,
    internationalStudents: 1200,
    isFeatured: true,
    latitude: 41.2046, longitude: 29.0785,
  },
  {
    slug: 'bilkent-university',
    nameEn: 'Bilkent University',
    nameAr: 'جامعة بيلكنت',
    nameTr: 'Bilkent Üniversitesi',
    city: 'ankara', cityEn: 'Ankara', cityAr: 'أنقرة', cityTr: 'Ankara',
    type: UniversityType.PRIVATE,
    ranking: 9,
    descriptionEn: 'Bilkent University was Turkey\'s first private university and remains one of its best. Known for excellence in computer science, business, and international relations.',
    descriptionAr: 'كانت جامعة بيلكنت أول جامعة خاصة في تركيا ولا تزال من بين أفضلها.',
    descriptionTr: 'Bilkent Üniversitesi, Türkiye\'nin ilk özel üniversitesiydi ve hâlâ en iyilerinden biri olmaya devam etmektedir.',
    website: 'https://www.bilkent.edu.tr',
    establishedYear: 1984,
    totalStudents: 13000,
    internationalStudents: 1800,
    isFeatured: true,
    latitude: 39.8680, longitude: 32.7462,
  },
  {
    slug: 'izmir-institute-of-technology',
    nameEn: 'İzmir Institute of Technology',
    nameAr: 'معهد إزمير للتكنولوجيا',
    nameTr: 'İzmir Yüksek Teknoloji Enstitüsü',
    city: 'izmir', cityEn: 'Izmir', cityAr: 'إزمير', cityTr: 'İzmir',
    type: UniversityType.PUBLIC,
    ranking: 10,
    descriptionEn: 'İzmir Institute of Technology (IYTE) focuses on science and engineering education. Located in the beautiful Aegean city of Izmir, it offers excellent research opportunities.',
    descriptionAr: 'معهد إزمير للتكنولوجيا يركز على تعليم العلوم والهندسة في مدينة إزمير الجميلة على بحر إيجه.',
    descriptionTr: 'İzmir Yüksek Teknoloji Enstitüsü, Ege\'nin güzel şehri İzmir\'de bilim ve mühendislik eğitimine odaklanmaktadır.',
    website: 'https://www.iyte.edu.tr',
    establishedYear: 1992,
    totalStudents: 6000,
    internationalStudents: 800,
    isFeatured: false,
    latitude: 38.3226, longitude: 26.6380,
  },
  {
    slug: 'istanbul-bilgi-university',
    nameEn: 'Istanbul Bilgi University',
    nameAr: 'جامعة إسطنبول بيلجي',
    nameTr: 'İstanbul Bilgi Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 11,
    descriptionEn: 'Istanbul Bilgi University is known for its creative arts, law, and business programs. It has a vibrant campus life and strong international partnerships.',
    descriptionAr: 'تشتهر جامعة إسطنبول بيلجي ببرامج الفنون الإبداعية والقانون والأعمال التجارية.',
    descriptionTr: 'İstanbul Bilgi Üniversitesi, yaratıcı sanatlar, hukuk ve işletme programlarıyla tanınmaktadır.',
    website: 'https://www.bilgi.edu.tr',
    establishedYear: 1996,
    totalStudents: 14000,
    internationalStudents: 2500,
    isFeatured: false,
    latitude: 41.0361, longitude: 28.9910,
  },
  {
    slug: 'gebze-technical-university',
    nameEn: 'Gebze Technical University',
    nameAr: 'جامعة جبزة التقنية',
    nameTr: 'Gebze Teknik Üniversitesi',
    city: 'kocaeli', cityEn: 'Kocaeli', cityAr: 'كوجاإيلي', cityTr: 'Kocaeli',
    type: UniversityType.PUBLIC,
    ranking: 12,
    descriptionEn: 'Gebze Technical University is a specialized engineering and science university near Istanbul, offering affordable quality education with strong industry connections.',
    descriptionAr: 'جامعة جبزة التقنية هي جامعة متخصصة في الهندسة والعلوم بالقرب من إسطنبول.',
    descriptionTr: 'Gebze Teknik Üniversitesi, İstanbul yakınında güçlü sanayi bağlantılarıyla uygun fiyatlı kaliteli eğitim sunan uzmanlaşmış bir mühendislik ve bilim üniversitesidir.',
    website: 'https://www.gtu.edu.tr',
    establishedYear: 2003,
    totalStudents: 8000,
    internationalStudents: 600,
    isFeatured: false,
    latitude: 40.7980, longitude: 29.4418,
  },
  {
    slug: 'yeditepe-university',
    nameEn: 'Yeditepe University',
    nameAr: 'جامعة يديتبة',
    nameTr: 'Yeditepe Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 13,
    descriptionEn: 'Yeditepe University is a modern private university in Istanbul offering programs in medicine, dentistry, pharmacy, and various other fields with English medium instruction.',
    descriptionAr: 'جامعة يديتبة هي جامعة خاصة حديثة في إسطنبول تقدم برامج في الطب وطب الأسنان والصيدلة.',
    descriptionTr: 'Yeditepe Üniversitesi, İstanbul\'da tıp, diş hekimliği, eczacılık ve çeşitli diğer alanlarda İngilizce eğitim sunan modern bir özel üniversitedir.',
    website: 'https://www.yeditepe.edu.tr',
    establishedYear: 1996,
    totalStudents: 20000,
    internationalStudents: 4000,
    isFeatured: true,
    latitude: 40.9671, longitude: 29.1139,
  },
  {
    slug: 'istanbul-aydin-university',
    nameEn: 'Istanbul Aydın University',
    nameAr: 'جامعة إسطنبول أيدن',
    nameTr: 'İstanbul Aydın Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 14,
    descriptionEn: 'Istanbul Aydın University is one of Turkey\'s most popular private universities for international students, offering affordable programs with scholarships.',
    descriptionAr: 'جامعة إسطنبول أيدن هي واحدة من أكثر الجامعات الخاصة شعبية في تركيا للطلاب الدوليين.',
    descriptionTr: 'İstanbul Aydın Üniversitesi, Türkiye\'nin uluslararası öğrenciler için en popüler özel üniversitelerinden biridir.',
    website: 'https://www.aydin.edu.tr',
    establishedYear: 2003,
    totalStudents: 45000,
    internationalStudents: 12000,
    isFeatured: true,
    latitude: 41.0028, longitude: 28.8255,
  },
  {
    slug: 'altinbas-university',
    nameEn: 'Altınbaş University',
    nameAr: 'جامعة ألتن باش',
    nameTr: 'Altınbaş Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 15,
    descriptionEn: 'Altınbaş University offers high-quality education with a focus on medicine, engineering, and business at competitive tuition fees for international students.',
    descriptionAr: 'جامعة ألتن باش تقدم تعليماً عالي الجودة مع التركيز على الطب والهندسة والأعمال التجارية.',
    descriptionTr: 'Altınbaş Üniversitesi, uluslararası öğrenciler için rekabetçi öğrenim ücretleriyle tıp, mühendislik ve işletme odaklı yüksek kaliteli eğitim sunmaktadır.',
    website: 'https://www.altinbas.edu.tr',
    establishedYear: 2011,
    totalStudents: 15000,
    internationalStudents: 5000,
    isFeatured: false,
    latitude: 41.0450, longitude: 28.8803,
  },
  {
    slug: 'ege-university',
    nameEn: 'Ege University',
    nameAr: 'جامعة إيجة',
    nameTr: 'Ege Üniversitesi',
    city: 'izmir', cityEn: 'Izmir', cityAr: 'إزمير', cityTr: 'İzmir',
    type: UniversityType.PUBLIC,
    ranking: 16,
    descriptionEn: 'Ege University is one of Turkey\'s leading universities located in the beautiful coastal city of Izmir. Known for medicine, agriculture, and science faculties.',
    descriptionAr: 'جامعة إيجة هي إحدى الجامعات الرائدة في تركيا، تقع في مدينة إزمير الساحلية الجميلة.',
    descriptionTr: 'Ege Üniversitesi, güzel sahil şehri İzmir\'de yer alan Türkiye\'nin önde gelen üniversitelerinden biridir.',
    website: 'https://www.ege.edu.tr',
    establishedYear: 1955,
    totalStudents: 60000,
    internationalStudents: 4000,
    isFeatured: false,
    latitude: 38.4637, longitude: 27.2198,
  },
  {
    slug: 'antalya-bilim-university',
    nameEn: 'Antalya Bilim University',
    nameAr: 'جامعة أنطاليا بيليم',
    nameTr: 'Antalya Bilim Üniversitesi',
    city: 'antalya', cityEn: 'Antalya', cityAr: 'أنطاليا', cityTr: 'Antalya',
    type: UniversityType.PRIVATE,
    ranking: 17,
    descriptionEn: 'Antalya Bilim University is located in the stunning Mediterranean city of Antalya. It offers English-medium programs in a beautiful tourist destination.',
    descriptionAr: 'جامعة أنطاليا بيليم تقع في مدينة أنطاليا المتوسطية الرائعة.',
    descriptionTr: 'Antalya Bilim Üniversitesi, muhteşem Akdeniz şehri Antalya\'da yer almaktadır.',
    website: 'https://www.antalya.edu.tr',
    establishedYear: 2011,
    totalStudents: 8000,
    internationalStudents: 2000,
    isFeatured: false,
    latitude: 36.8928, longitude: 30.7028,
  },
  {
    slug: 'bursa-uludag-university',
    nameEn: 'Bursa Uludağ University',
    nameAr: 'جامعة بورصة أولوداغ',
    nameTr: 'Bursa Uludağ Üniversitesi',
    city: 'bursa', cityEn: 'Bursa', cityAr: 'بورصة', cityTr: 'Bursa',
    type: UniversityType.PUBLIC,
    ranking: 18,
    descriptionEn: 'Bursa Uludağ University is a large comprehensive university in the historic city of Bursa, offering diverse programs at affordable costs.',
    descriptionAr: 'جامعة بورصة أولوداغ هي جامعة شاملة كبيرة في مدينة بورصة التاريخية.',
    descriptionTr: 'Bursa Uludağ Üniversitesi, tarihi Bursa şehrinde geniş program yelpazesi sunan büyük bir kapsamlı üniversitedir.',
    website: 'https://www.uludag.edu.tr',
    establishedYear: 1975,
    totalStudents: 70000,
    internationalStudents: 5000,
    isFeatured: false,
    latitude: 40.1855, longitude: 29.0601,
  },
  {
    slug: 'kadir-has-university',
    nameEn: 'Kadir Has University',
    nameAr: 'جامعة قادر هاس',
    nameTr: 'Kadir Has Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 19,
    descriptionEn: 'Kadir Has University is located in the historic Cibali district of Istanbul. Known for its communication, business, and engineering programs.',
    descriptionAr: 'جامعة قادر هاس تقع في حي جيبالي التاريخي في إسطنبول.',
    descriptionTr: 'Kadir Has Üniversitesi, İstanbul\'un tarihi Cibali semtinde yer almaktadır.',
    website: 'https://www.khas.edu.tr',
    establishedYear: 1997,
    totalStudents: 10000,
    internationalStudents: 2000,
    isFeatured: false,
    latitude: 41.0233, longitude: 28.9440,
  },
  {
    slug: 'istanbul-gelisim-university',
    nameEn: 'Istanbul Gelişim University',
    nameAr: 'جامعة إسطنبول جيليشيم',
    nameTr: 'İstanbul Gelişim Üniversitesi',
    city: 'istanbul', cityEn: 'Istanbul', cityAr: 'إسطنبول', cityTr: 'İstanbul',
    type: UniversityType.PRIVATE,
    ranking: 20,
    descriptionEn: 'Istanbul Gelişim University offers affordable, quality education with a strong focus on international students, providing generous scholarships and Arabic-language support.',
    descriptionAr: 'جامعة إسطنبول جيليشيم تقدم تعليماً جيداً بأسعار معقولة مع تركيز قوي على الطلاب الدوليين.',
    descriptionTr: 'İstanbul Gelişim Üniversitesi, uluslararası öğrencilere güçlü odaklanmasıyla uygun fiyatlı kaliteli eğitim sunmaktadır.',
    website: 'https://www.gelisim.edu.tr',
    establishedYear: 2011,
    totalStudents: 20000,
    internationalStudents: 8000,
    isFeatured: false,
    latitude: 41.0542, longitude: 28.8198,
  },
]

const programTemplates = [
  { nameEn: 'Computer Engineering', nameAr: 'هندسة الحاسوب', nameTr: 'Bilgisayar Mühendisliği', category: 'Engineering', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 4500, duration: 4, careerEn: 'Software Developer, AI Engineer, Data Scientist, System Architect', careerAr: 'مطور برمجيات، مهندس ذكاء اصطناعي، عالم بيانات', careerTr: 'Yazılım Geliştirici, Yapay Zeka Mühendisi, Veri Bilimcisi' },
  { nameEn: 'Medicine (MD)', nameAr: 'الطب البشري', nameTr: 'Tıp', category: 'Medicine', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 12000, duration: 6, careerEn: 'Physician, Surgeon, Specialist Doctor, Medical Researcher', careerAr: 'طبيب، جراح، أخصائي، باحث طبي', careerTr: 'Doktor, Cerrah, Uzman Doktor, Tıbbi Araştırmacı' },
  { nameEn: 'Business Administration (MBA)', nameAr: 'إدارة الأعمال', nameTr: 'İşletme Yönetimi', category: 'Business', degreeType: DegreeType.MASTER, language: ProgramLang.ENGLISH, fee: 5500, duration: 2, careerEn: 'Business Manager, Entrepreneur, Consultant, Executive', careerAr: 'مدير أعمال، رائد أعمال، مستشار', careerTr: 'İşletme Müdürü, Girişimci, Danışman' },
  { nameEn: 'Architecture', nameAr: 'الهندسة المعمارية', nameTr: 'Mimarlık', category: 'Engineering', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH_TURKISH, fee: 6000, duration: 5, careerEn: 'Architect, Urban Planner, Interior Designer, Construction Manager', careerAr: 'مهندس معماري، مخطط مدني، مصمم داخلي', careerTr: 'Mimar, Şehir Plancısı, İç Mimar' },
  { nameEn: 'Dentistry', nameAr: 'طب الأسنان', nameTr: 'Diş Hekimliği', category: 'Medicine', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 10000, duration: 5, careerEn: 'Dentist, Orthodontist, Oral Surgeon, Dental Researcher', careerAr: 'طبيب أسنان، تقويم أسنان، جراح فم', careerTr: 'Diş Hekimi, Ortodontist, Ağız Cerrahı' },
  { nameEn: 'International Relations', nameAr: 'العلاقات الدولية', nameTr: 'Uluslararası İlişkiler', category: 'Social Sciences', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 3500, duration: 4, careerEn: 'Diplomat, NGO Worker, Political Analyst, International Business', careerAr: 'دبلوماسي، منظمة غير حكومية، محلل سياسي', careerTr: 'Diplomat, STK Çalışanı, Siyasi Analist' },
  { nameEn: 'Electrical & Electronics Engineering', nameAr: 'هندسة الكهرباء والإلكترونيات', nameTr: 'Elektrik-Elektronik Mühendisliği', category: 'Engineering', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 5000, duration: 4, careerEn: 'Electrical Engineer, Robotics Engineer, Telecommunications Specialist', careerAr: 'مهندس كهرباء، مهندس روبوتيات', careerTr: 'Elektrik Mühendisi, Robotik Mühendisi' },
  { nameEn: 'Pharmacy', nameAr: 'الصيدلة', nameTr: 'Eczacılık', category: 'Medicine', degreeType: DegreeType.BACHELOR, language: ProgramLang.TURKISH, fee: 7000, duration: 5, careerEn: 'Pharmacist, Pharmaceutical Researcher, Clinical Specialist', careerAr: 'صيدلاني، باحث صيدلاني، أخصائي سريري', careerTr: 'Eczacı, Farmasötik Araştırmacı' },
  { nameEn: 'Law', nameAr: 'القانون', nameTr: 'Hukuk', category: 'Law', degreeType: DegreeType.BACHELOR, language: ProgramLang.TURKISH, fee: 4000, duration: 4, careerEn: 'Lawyer, Judge, Legal Consultant, Prosecutor', careerAr: 'محامٍ، قاضٍ، مستشار قانوني', careerTr: 'Avukat, Hakim, Hukuk Danışmanı' },
  { nameEn: 'Civil Engineering', nameAr: 'الهندسة المدنية', nameTr: 'İnşaat Mühendisliği', category: 'Engineering', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH_TURKISH, fee: 4500, duration: 4, careerEn: 'Civil Engineer, Construction Manager, Project Manager', careerAr: 'مهندس مدني، مدير إنشاء، مدير مشروع', careerTr: 'İnşaat Mühendisi, Yapı Müdürü' },
  { nameEn: 'Mechanical Engineering', nameAr: 'الهندسة الميكانيكية', nameTr: 'Makine Mühendisliği', category: 'Engineering', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 4800, duration: 4, careerEn: 'Mechanical Engineer, Manufacturing Engineer, Automotive Engineer', careerAr: 'مهندس ميكانيكي، مهندس تصنيع', careerTr: 'Makine Mühendisi, İmalat Mühendisi' },
  { nameEn: 'Psychology', nameAr: 'علم النفس', nameTr: 'Psikoloji', category: 'Social Sciences', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 3500, duration: 4, careerEn: 'Psychologist, Counselor, Human Resources, Researcher', careerAr: 'طبيب نفسي، مستشار، موارد بشرية', careerTr: 'Psikolog, Danışman, İnsan Kaynakları' },
  { nameEn: 'Software Engineering (MSc)', nameAr: 'هندسة البرمجيات - ماجستير', nameTr: 'Yazılım Mühendisliği (Yüksek Lisans)', category: 'Engineering', degreeType: DegreeType.MASTER, language: ProgramLang.ENGLISH, fee: 6000, duration: 2, careerEn: 'Senior Developer, Tech Lead, CTO, Software Architect', careerAr: 'مطور أول، قائد تقني، مهندس برمجيات', careerTr: 'Kıdemli Geliştirici, Teknik Lider' },
  { nameEn: 'Nursing', nameAr: 'التمريض', nameTr: 'Hemşirelik', category: 'Medicine', degreeType: DegreeType.BACHELOR, language: ProgramLang.TURKISH, fee: 3000, duration: 4, careerEn: 'Nurse, Healthcare Administrator, Clinical Specialist', careerAr: 'ممرض/ممرضة، مدير رعاية صحية', careerTr: 'Hemşire, Sağlık Yöneticisi' },
  { nameEn: 'Finance & Banking', nameAr: 'التمويل والمصرفية', nameTr: 'Finans ve Bankacılık', category: 'Business', degreeType: DegreeType.BACHELOR, language: ProgramLang.ENGLISH, fee: 4000, duration: 4, careerEn: 'Financial Analyst, Investment Banker, Portfolio Manager', careerAr: 'محلل مالي، مصرفي استثماري', careerTr: 'Finansal Analist, Yatırım Bankacısı' },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.program.deleteMany()
  await prisma.requirement.deleteMany()
  await prisma.scholarship.deleteMany()
  await prisma.university.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.blogPost.deleteMany()

  console.log('✅ Cleared existing data')

  // Seed universities
  const createdUniversities = []
  for (const uni of universities) {
    const created = await prisma.university.create({
      data: {
        ...uni,
        requirements: {
          create: [
            { textEn: 'High school diploma or equivalent', textAr: 'شهادة الثانوية العامة أو ما يعادلها', textTr: 'Lise diploması veya eşdeğeri' },
            { textEn: 'Valid passport', textAr: 'جواز سفر ساري المفعول', textTr: 'Geçerli pasaport' },
            { textEn: 'Language proficiency certificate', textAr: 'شهادة إتقان اللغة', textTr: 'Dil yeterlilik belgesi' },
            { textEn: 'Academic transcripts', textAr: 'السجل الأكاديمي', textTr: 'Akademik transkriptler' },
          ]
        },
        scholarships: {
          create: [
            { nameEn: '25% Merit Scholarship', nameAr: 'منحة التفوق 25%', nameTr: '%25 Başarı Bursu', descEn: 'Awarded to students with excellent academic records', descAr: 'تُمنح للطلاب ذوي السجلات الأكاديمية الممتازة', descTr: 'Mükemmel akademik kayıtlara sahip öğrencilere verilir', percentage: 25 },
            { nameEn: '50% Excellence Scholarship', nameAr: 'منحة التميز 50%', nameTr: '%50 Üstünlük Bursu', descEn: 'For top-performing international students', descAr: 'لأفضل الطلاب الدوليين أداءً', descTr: 'En başarılı uluslararası öğrenciler için', percentage: 50 },
          ]
        }
      }
    })
    createdUniversities.push(created)
  }

  console.log(`✅ Created ${createdUniversities.length} universities`)

  // Create programs for each university
  let programCount = 0
  for (let i = 0; i < createdUniversities.length; i++) {
    const uni = createdUniversities[i]
    // Assign 2-4 programs per university
    const numPrograms = Math.floor(Math.random() * 3) + 2
    const startIndex = (i * 2) % programTemplates.length

    for (let j = 0; j < numPrograms; j++) {
      const template = programTemplates[(startIndex + j) % programTemplates.length]
      const feeVariance = (Math.random() - 0.5) * 1000
      
      await prisma.program.create({
        data: {
          slug: `${uni.slug}-${template.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
          nameEn: template.nameEn,
          nameAr: template.nameAr,
          nameTr: template.nameTr,
          degreeType: template.degreeType,
          language: template.language,
          tuitionFeeUSD: Math.round((template.fee + feeVariance) / 100) * 100,
          duration: template.duration,
          descriptionEn: `${template.nameEn} program at ${uni.nameEn} provides world-class education with cutting-edge curriculum, experienced faculty, and excellent career prospects in Turkey and globally.`,
          descriptionAr: `برنامج ${template.nameAr} في ${uni.nameAr} يوفر تعليماً عالمي المستوى مع مناهج متطورة وكادر تدريسي ذو خبرة وآفاق مهنية ممتازة.`,
          descriptionTr: `${uni.nameTr}'deki ${template.nameTr} programı, son teknoloji müfredat ve deneyimli öğretim üyeleriyle dünya standartlarında eğitim sunmaktadır.`,
          careerOppsEn: template.careerEn,
          careerOppsAr: template.careerAr,
          careerOppsTr: template.careerTr,
          category: template.category,
          universityId: uni.id,
          isFeatured: j === 0 && i < 8,
        }
      })
      programCount++
    }
  }

  console.log(`✅ Created ${programCount} programs`)

  // Seed testimonials
  const testimonials = [
    { nameEn: 'Ahmed Al-Rashid', nameAr: 'أحمد الراشد', nameTr: 'Ahmed Al-Rashid', country: 'Saudi Arabia', university: 'Istanbul University', major: 'Computer Engineering', contentEn: 'Studying in Istanbul has been a life-changing experience. Yildiz Foundation helped me find the perfect university and guided me through every step of the application process.', contentAr: 'الدراسة في إسطنبول كانت تجربة غيّرت حياتي. ساعدتني مؤسسة يلدز في إيجاد الجامعة المثالية وإرشادي في كل خطوة من خطوات التقديم.', contentTr: 'İstanbul\'da okumak hayat değiştiren bir deneyimdi. Yıldız Vakfı mükemmel üniversiteyi bulmama yardımcı oldu.', rating: 5, avatar: null },
    { nameEn: 'Fatima Hassan', nameAr: 'فاطمة حسن', nameTr: 'Fatima Hassan', country: 'Egypt', university: 'Koç University', major: 'Business Administration', contentEn: 'The team at Yildiz Foundation was incredibly supportive. They helped me get a 50% scholarship at Koç University. I cannot recommend them enough!', contentAr: 'كان فريق مؤسسة يلدز داعماً بشكل لا يصدق. ساعدوني في الحصول على منحة بنسبة 50% في جامعة كوتش.', contentTr: 'Yıldız Vakfı ekibi inanılmaz derecede destekleyiciydi. Koç Üniversitesi\'nde %50 burs almama yardımcı oldular.', rating: 5, avatar: null },
    { nameEn: 'Omar Khalid', nameAr: 'عمر خالد', nameTr: 'Omar Khalid', country: 'Jordan', university: 'Yeditepe University', major: 'Medicine', contentEn: 'Yildiz Foundation made my dream of studying medicine in Turkey come true. The process was smooth and stress-free thanks to their expert team.', contentAr: 'جعلت مؤسسة يلدز حلمي بدراسة الطب في تركيا حقيقة واقعة. كانت العملية سلسة وخالية من التوتر.', contentTr: 'Yıldız Vakfı, Türkiye\'de tıp okuma hayalimi gerçeğe dönüştürdü.', rating: 5, avatar: null },
    { nameEn: 'Layla Ibrahim', nameAr: 'ليلى إبراهيم', nameTr: 'Layla Ibrahim', country: 'Libya', university: 'Sabancı University', major: 'Engineering', contentEn: 'The AI chatbot and university comparison tools on the website helped me decide. And the real consultants sealed the deal with personalized advice!', contentAr: 'ساعدتني أداة مقارنة الجامعات والمساعد الذكي في الموقع على اتخاذ قراري.', contentTr: 'Web sitesindeki yapay zeka sohbet robotu ve üniversite karşılaştırma araçları karar vermeme yardımcı oldu.', rating: 5, avatar: null },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t })
  }

  console.log(`✅ Created ${testimonials.length} testimonials`)

  // Seed blog posts
  const blogPosts = [
    {
      slug: 'why-study-in-turkey-2024',
      titleEn: 'Why Study in Turkey? Top 10 Reasons for International Students',
      titleAr: 'لماذا الدراسة في تركيا؟ أفضل 10 أسباب للطلاب الدوليين',
      titleTr: 'Türkiye\'de Neden Okuyalım? Uluslararası Öğrenciler İçin 10 Neden',
      excerptEn: 'Turkey offers world-class education at affordable prices. Discover why thousands of international students choose Turkey each year.',
      excerptAr: 'تقدم تركيا تعليماً عالمي المستوى بأسعار معقولة. اكتشف لماذا يختار آلاف الطلاب الدوليين تركيا كل عام.',
      excerptTr: 'Türkiye, uygun fiyatlarla dünya standartlarında eğitim sunuyor. Her yıl binlerce uluslararası öğrencinin neden Türkiye\'yi seçtiğini keşfedin.',
      contentEn: 'Turkey has emerged as one of the top destinations for international students seeking quality education at affordable prices. With over 200 universities, vibrant culture, and strategic location bridging East and West, Turkey offers an unparalleled educational experience...',
      contentAr: 'برزت تركيا كواحدة من أفضل الوجهات للطلاب الدوليين الباحثين عن تعليم جيد بأسعار معقولة...',
      contentTr: 'Türkiye, uygun fiyatlarla kaliteli eğitim arayan uluslararası öğrenciler için en iyi destinasyonlardan biri olarak öne çıktı...',
      category: 'Study in Turkey',
      tags: ['turkey', 'education', 'international students', 'universities'],
      published: true,
    },
    {
      slug: 'turkish-university-scholarships-guide',
      titleEn: 'Complete Guide to Turkish University Scholarships 2024',
      titleAr: 'الدليل الشامل لمنح جامعات تركيا 2024',
      titleTr: 'Türk Üniversitesi Bursları İçin Kapsamlı Rehber 2024',
      excerptEn: 'Learn about all available scholarships for international students in Turkey, from government programs to university-specific grants.',
      excerptAr: 'تعرف على جميع المنح المتاحة للطلاب الدوليين في تركيا، من البرامج الحكومية إلى المنح الجامعية المحددة.',
      excerptTr: 'Devlet programlarından üniversiteye özgü burslar kadar Türkiye\'deki uluslararası öğrencilere sunulan tüm burslar hakkında bilgi edinin.',
      contentEn: 'Turkey offers numerous scholarship opportunities for international students. The Türkiye Scholarships (Türkiye Bursları) program, funded by the Turkish government, provides full scholarships including tuition, accommodation, and monthly stipend...',
      contentAr: 'تقدم تركيا فرص منح دراسية عديدة للطلاب الدوليين...',
      contentTr: 'Türkiye, uluslararası öğrenciler için çok sayıda burs fırsatı sunuyor...',
      category: 'Scholarships',
      tags: ['scholarships', 'financial aid', 'turkey', 'tuition'],
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }

  console.log(`✅ Created ${blogPosts.length} blog posts`)
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
