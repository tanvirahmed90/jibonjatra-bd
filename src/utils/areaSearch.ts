import { Hospital } from '../types/index';
import { calculateDistanceKm } from './geo';

export interface AreaLocation {
  id: string;
  name: string;
  banglaName: string;
  lat: number;
  lng: number;
  district: string;
  division: string;
  aliases: string[];
}

/**
 * Comprehensive coverage of ALL areas, thanas, and neighborhoods in Dhaka (+ major BD divisions)
 */
export const ALL_DHAKA_AND_BD_AREAS: AreaLocation[] = [
  // ==========================================
  // CENTRAL & EAST DHAKA
  // ==========================================
  {
    id: 'rampura',
    name: 'Rampura',
    banglaName: 'রামপুরা',
    lat: 23.7610,
    lng: 90.4208,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['rampura', 'ram pura', 'রামপুরা', 'east rampura', 'west rampura', 'dit road', 'rampura bridge', 'রামপুরা ব্রিজ'],
  },
  {
    id: 'banasree',
    name: 'Banasree',
    banglaName: 'বনশ্রী',
    lat: 23.7635,
    lng: 90.4308,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['banasree', 'bonosree', 'bonoshree', 'বনশ্রী', 'block e banasree', 'block c banasree', 'aftabnagar', 'আফতাবনগর'],
  },
  {
    id: 'khilgaon',
    name: 'Khilgaon',
    banglaName: 'খিলগাঁও',
    lat: 23.7512,
    lng: 90.4225,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['khilgaon', 'khilgao', 'খিলগাঁও', 'taltola khilgaon', 'তালতলা খিলগাঁও', 'goran', 'গোরান', 'sipahibag', 'সিপাহীবাগ'],
  },
  {
    id: 'malibagh',
    name: 'Malibagh',
    banglaName: 'মালিবাগ',
    lat: 23.7480,
    lng: 90.4140,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['malibagh', 'malibag', 'মালিবাগ', 'mouchak', 'মৌচাক', 'chowdhury para', 'চৌধুরীপাড়া', 'siddheshwari', 'সিদ্ধেশ্বরী'],
  },
  {
    id: 'moghbazar',
    name: 'Moghbazar',
    banglaName: 'মগবাজার',
    lat: 23.7490,
    lng: 90.4040,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['moghbazar', 'maghbazar', 'মগবাজার', 'eskaton', 'ইসকাটন', 'dilu road', 'দিলু রোড', 'wireless moghbazar'],
  },
  {
    id: 'shantinagar',
    name: 'Shantinagar',
    banglaName: 'শান্তিনগর',
    lat: 23.7392,
    lng: 90.4135,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['shantinagar', 'shanti nagar', 'শান্তিনগর', 'bailey road', 'বেইলি রোড', 'chamelibagh', 'চামেলীবাগ'],
  },
  {
    id: 'kakrail',
    name: 'Kakrail',
    banglaName: 'কাকরাইল',
    lat: 23.7380,
    lng: 90.4065,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['kakrail', 'কাকরাইল', 'segunbagicha', 'সেগুনবাগিচা', 'bijoynagar', 'বিজয় নগর', 'topkhana', 'তোপখানা'],
  },
  {
    id: 'shahbagh',
    name: 'Shahbagh',
    banglaName: 'শাহবাগ',
    lat: 23.7388,
    lng: 90.3958,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['shahbagh', 'shahbag', 'শাহবাগ', 'ramna', 'রমনা', 'dhaka university', 'ঢাকা বিশ্ববিদ্যালয়', 'pg hospital', 'পিজি হাসপাতাল', 'dmch', 'ডিএমসিএইচ'],
  },
  {
    id: 'motijheel',
    name: 'Motijheel',
    banglaName: 'মতিঝিল',
    lat: 23.7330,
    lng: 90.4172,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['motijheel', 'মতিঝিল', 'dilkusha', 'দিলকুশা', 'fakirapool', 'ফকিরাপুল', 'arambagh', 'আরামবাগ'],
  },
  {
    id: 'paltan',
    name: 'Paltan',
    banglaName: 'পল্টন',
    lat: 23.7320,
    lng: 90.4110,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['paltan', 'পল্টন', 'naya paltan', 'নয়া পল্টন', 'purana paltan', 'পুরানা পল্টন', 'press club', 'প্রেস ক্লাব'],
  },

  // ==========================================
  // DHANMONDI, MOHAMMADPUR & WEST DHAKA
  // ==========================================
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    banglaName: 'ধানমন্ডি',
    lat: 23.7461,
    lng: 90.3742,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['dhanmondi', 'dhanmandi', 'ধানমন্ডি', 'jigatola', 'জিগাতলা', 'shankar', 'শংকর', 'kalabagan', 'কলাবাগান', 'sobhanbag', 'সোবহানবাগ'],
  },
  {
    id: 'panthapath',
    name: 'Panthapath',
    banglaName: 'পান্থপথ',
    lat: 23.7525,
    lng: 90.3840,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['panthapath', 'panthopoth', 'পান্থপথ', 'green road', 'গ্রীন রোড', 'square hospital', 'স্কয়ার হাসপাতাল', 'west panthapath'],
  },
  {
    id: 'lalmatia',
    name: 'Lalmatia',
    banglaName: 'লালমাটিয়া',
    lat: 23.7550,
    lng: 90.3680,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['lalmatia', 'lalmatya', 'লালমাটিয়া', 'block b lalmatia', 'block e lalmatia'],
  },
  {
    id: 'mohammadpur',
    name: 'Mohammadpur',
    banglaName: 'মোহাম্মদপুর',
    lat: 23.7658,
    lng: 90.3584,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mohammadpur', 'mohammedpur', 'মোহাম্মদপুর', 'asad gate', 'আসাদ গেট', 'town hall', 'টাউন হল', 'tajmahal road', 'তাজমহল রোড', 'bosila', 'বসিলা', 'iqbal road'],
  },
  {
    id: 'adabor',
    name: 'Adabor',
    banglaName: 'আদাবর',
    lat: 23.7710,
    lng: 90.3570,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['adabor', 'adabar', 'আদাবর', 'shekhertek', 'শেখেরটেক', 'baitul aman', 'বায়তুল আমান'],
  },
  {
    id: 'shyamoli',
    name: 'Shyamoli',
    banglaName: 'শ্যামলী',
    lat: 23.7715,
    lng: 90.3630,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['shyamoli', 'shamoli', 'শ্যামলী', 'ring road', 'রিং রোড', 'shishu mela', 'শিশু মেলা', 'khilji road'],
  },
  {
    id: 'kallyanpur',
    name: 'Kallyanpur',
    banglaName: 'কল্যাণপুর',
    lat: 23.7820,
    lng: 90.3610,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['kallyanpur', 'kalyanpur', 'কল্যাণপুর', 'darus salam', 'দারুস সালাম', 'gabtoli', 'গাবতলী'],
  },
  {
    id: 'hazaribagh',
    name: 'Hazaribagh',
    banglaName: 'হাজারীবাগ',
    lat: 23.7360,
    lng: 90.3640,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['hazaribagh', 'hazaribag', 'হাজারীবাগ', 'rayerbazar', 'রায়েরবাজার', 'tannery', 'ট্যানারি'],
  },
  {
    id: 'kamrangirchar',
    name: 'Kamrangirchar',
    banglaName: 'কামরাঙ্গীরচর',
    lat: 23.7160,
    lng: 90.3690,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['kamrangirchar', 'kamrangichar', 'কামরাঙ্গীরচর', 'madbarbazar', 'মাদবর বাজার'],
  },

  // ==========================================
  // AGARGAON & MIRPUR CLUSTER
  // ==========================================
  {
    id: 'agargaon',
    name: 'Agargaon',
    banglaName: 'আগারগাঁও',
    lat: 23.7770,
    lng: 90.3790,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['agargaon', 'agargaun', 'আগারগাঁও', 'sher-e-bangla nagar', 'শেরেবাংলা নগর', 'nins', 'নিউরোলজি', 'nitor', 'পঙ্গু হাসপাতাল', 'suhrawardy hospital', 'সোহরাওয়ার্দী হাসপাতাল'],
  },
  {
    id: 'mirpur-1',
    name: 'Mirpur-1',
    banglaName: 'মিরপুর-১',
    lat: 23.7960,
    lng: 90.3540,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 1', 'mirpur-1', 'মিরপুর ১', 'মিরপুর-১', 'delta medical', 'ডেল্টা মেডিকেল', 'ananda cinema', 'টোলারবাগ', 'tolarbag'],
  },
  {
    id: 'mirpur-2',
    name: 'Mirpur-2',
    banglaName: 'মিরপুর-২',
    lat: 23.8050,
    lng: 90.3600,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 2', 'mirpur-2', 'মিরপুর ২', 'মিরপুর-২', 'stadium mirpur', 'মিরপুর স্টেডিয়াম', 'heart foundation', 'হার্ট ফাউন্ডেশন'],
  },
  {
    id: 'mirpur-10',
    name: 'Mirpur-10',
    banglaName: 'মিরপুর-১০',
    lat: 23.8067,
    lng: 90.3683,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 10', 'mirpur-10', 'মিরপুর ১০', 'মিরপুর-১০', 'mirpur gol chottor', 'মিরপুর গোলচত্বর', 'al helal hospital', 'আল হেলাল হাসপাতাল', 'dr azmal hospital'],
  },
  {
    id: 'mirpur-11',
    name: 'Mirpur-11',
    banglaName: 'মিরপুর-১১',
    lat: 23.8180,
    lng: 90.3650,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 11', 'mirpur-11', 'মিরপুর ১১', 'মিরপুর-১১', 'purobi', 'পুরবী', 'duhs'],
  },
  {
    id: 'mirpur-12',
    name: 'Mirpur-12',
    banglaName: 'মিরপুর-১২',
    lat: 23.8270,
    lng: 90.3660,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 12', 'mirpur-12', 'মিরপুর ১২', 'মিরপুর-১২', 'kalshi', 'কালশী', 'mirpur dohs', 'মিরপুর ডিওএইচএস'],
  },
  {
    id: 'mirpur-14',
    name: 'Mirpur-14',
    banglaName: 'মিরপুর-১৪',
    lat: 23.7990,
    lng: 90.3860,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mirpur 14', 'mirpur-14', 'মিরপুর ১৪', 'মিরপুর-১৪', 'kachukhet', 'কচুক্ষেত', 'dental college', 'ডেন্টাল কলেজ'],
  },
  {
    id: 'pallabi',
    name: 'Pallabi',
    banglaName: 'পল্লবী',
    lat: 23.8240,
    lng: 90.3620,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['pallabi', 'পল্লবী', 'rupnagar', 'রূপনগর', 'section 11 pallabi'],
  },
  {
    id: 'kafrul',
    name: 'Kafrul / Kazipara',
    banglaName: 'কাফরুল / কাজীপাড়া',
    lat: 23.7950,
    lng: 90.3730,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['kafrul', 'কাফরুল', 'kazipara', 'কাজীপাড়া', 'shewrapara', 'শেওড়াপাড়া', 'senpara parbata', 'সেনপাড়া পর্বতা'],
  },

  // ==========================================
  // TEJGAON, MOHAKHALI & BANANI
  // ==========================================
  {
    id: 'tejgaon',
    name: 'Tejgaon',
    banglaName: 'তেজগাঁও',
    lat: 23.7640,
    lng: 90.3920,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['tejgaon', 'tejgoan', 'তেজগাঁও', 'kawran bazar', 'কাওরান বাজার', 'farmgate', 'ফার্মগেট', 'nabisco', 'নাবিস্কো', 'tajuddin sarani'],
  },
  {
    id: 'mohakhali',
    name: 'Mohakhali',
    banglaName: 'মহাখালী',
    lat: 23.7776,
    lng: 90.4030,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mohakhali', 'mahakali', 'মহাখালী', 'icddrb', 'আইসিডিডিআরবি', 'cancer hospital', 'ক্যান্সার হাসপাতাল', 'ayesha memorial', 'universal medical', 'mohakhali dohs', 'মহাখালী ডিওএইচএস', 'wireless gate', 'tb gate'],
  },
  {
    id: 'banani',
    name: 'Banani',
    banglaName: 'বনানী',
    lat: 23.7937,
    lng: 90.4066,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['banani', 'বনানী', 'kemal ataturk', 'কামাল আতাতুর্ক', 'banani dohs', 'বনানী ডিওএইচএস', 'kakoli', 'কাকলী'],
  },
  {
    id: 'gulshan',
    name: 'Gulshan',
    banglaName: 'গুলশান',
    lat: 23.7925,
    lng: 90.4180,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['gulshan', 'গুলশান', 'gulshan 1', 'গুলশান ১', 'gulshan 2', 'গুলশান ২', 'united hospital', 'ইউনাইটেড হাসপাতাল', 'niketan', 'নিকেতন'],
  },
  {
    id: 'baridhara',
    name: 'Baridhara',
    banglaName: 'বারিধারা',
    lat: 23.8010,
    lng: 90.4220,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['baridhara', 'বারিধারা', 'baridhara dohs', 'বারিধারা ডিওএইচএস', 'diplomatic zone'],
  },
  {
    id: 'badda',
    name: 'Badda',
    banglaName: 'বাড্ডা',
    lat: 23.7805,
    lng: 90.4267,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['badda', 'বাড্ডা', 'middle badda', 'মধ্য বাড্ডা', 'north badda', 'উত্তর বাড্ডা', 'south badda', 'দক্ষিণ বাড্ডা', 'merul badda', 'মেরুল বাড্ডা', 'pragati sarani', 'প্রগতি সরণি', 'shahjadpur', 'শাহজাদপুর'],
  },
  {
    id: 'vatara',
    name: 'Vatara / Notun Bazar',
    banglaName: 'ভাটারা / নতুন বাজার',
    lat: 23.7990,
    lng: 90.4280,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['vatara', 'bhatara', 'ভাটারা', 'notun bazar', 'নতুন বাজার', 'solmaid', 'ছলমাইদ'],
  },
  {
    id: 'bashundhara',
    name: 'Bashundhara R/A',
    banglaName: 'বসুন্ধরা আ/এ',
    lat: 23.8103,
    lng: 90.4312,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['bashundhara', 'basundhara', 'বসুন্ধরা', 'evercare', 'এভারকেয়ার', 'bashundhara gate', 'বসুন্ধরা গেট', 'block e bashundhara', 'block d bashundhara', 'block i bashundhara'],
  },

  // ==========================================
  // UTTARA & NORTH GREATER DHAKA
  // ==========================================
  {
    id: 'uttara',
    name: 'Uttara',
    banglaName: 'উত্তরা',
    lat: 23.8728,
    lng: 90.3984,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['uttara', 'উত্তরা', 'uttara model town', 'house building', 'হাউস বিল্ডিং', 'azampur', 'আজমপুর', 'jasimuddin', 'জসীমউদ্দীন', 'sector 3 uttara', 'sector 7 uttara', 'sector 10 uttara', 'sector 11 uttara', 'kuwait hospital', 'কুয়েত মৈত্রী হাসপাতাল'],
  },
  {
    id: 'khilkhet',
    name: 'Khilkhet / Nikunja',
    banglaName: 'খিলক্ষেত / নিকুঞ্জ',
    lat: 23.8300,
    lng: 90.4180,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['khilkhet', 'খিলক্ষেত', 'nikunja', 'নিকুঞ্জ', 'nikunja 1', 'nikunja 2', 'kuratoli', 'কুড়াতলী'],
  },
  {
    id: 'cantonment',
    name: 'Dhaka Cantonment / Kurmitola',
    banglaName: 'ঢাকা ক্যান্টনমেন্ট / কুর্মিটোলা',
    lat: 23.8200,
    lng: 90.3950,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['cantonment', 'ক্যান্টনমেন্ট', 'kurmitola', 'কুর্মিটোলা', 'kurmitola general hospital', 'cmh', 'সিএমএইচ', 'airport road'],
  },
  {
    id: 'uttarkhan',
    name: 'Uttarkhan / Dakhinkhan',
    banglaName: 'উত্তরখান / দক্ষিণখান',
    lat: 23.8800,
    lng: 90.4200,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['uttarkhan', 'উত্তরখান', 'dakhinkhan', 'দক্ষিণখান', 'mollartek', 'মোল্লারটেক'],
  },
  {
    id: 'turag',
    name: 'Turag / Diabari',
    banglaName: 'তুরাগ / দিয়াবাড়ী',
    lat: 23.8850,
    lng: 90.3750,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['turag', 'তুরাগ', 'diabari', 'দিয়াবাড়ী', 'kamrpara', 'কামারপাড়া', 'metro rail station'],
  },

  // ==========================================
  // OLD DHAKA (PURAN DHAKA) & SOUTH HUBS
  // ==========================================
  {
    id: 'sadarghat',
    name: 'Sadarghat / Kotwali',
    banglaName: 'সদরঘাট / কোতোয়ালি',
    lat: 23.7080,
    lng: 90.4100,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['sadarghat', 'সদরঘাট', 'kotwali', 'কোতোয়ালি', 'patuatuly', 'পাটুয়াটুলী', 'sumona hospital'],
  },
  {
    id: 'mitford',
    name: 'Mitford / Babubazar',
    banglaName: 'মিটফোর্ড / বাবুবাজার',
    lat: 23.7145,
    lng: 90.4011,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['mitford', 'মিটফোর্ড', 'babubazar', 'বাবুবাজার', 'salimullah medical', 'সলিমুল্লাহ মেডিকেল', 'ssmc'],
  },
  {
    id: 'lalbagh',
    name: 'Lalbagh',
    banglaName: 'লালবাগ',
    lat: 23.7190,
    lng: 90.3880,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['lalbagh', 'lalbag', 'লালবাগ', 'chawkbazar', 'চকবাজার', 'dhakeshwari', 'ঢাকেশ্বরী', 'bakshibazar', 'বখশিবাজার'],
  },
  {
    id: 'bangshal',
    name: 'Bangshal / Armanitola',
    banglaName: 'বংশাল / আরমানিটোলা',
    lat: 23.7180,
    lng: 90.4050,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['bangshal', 'বংশাল', 'armanitola', 'আরমানিটোলা', 'islampur', 'ইসলামপুর', 'nazimuddin road'],
  },
  {
    id: 'wari',
    name: 'Wari',
    banglaName: 'ওয়ারী',
    lat: 23.7160,
    lng: 90.4180,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['wari', 'ওয়ারী', 'rankin street', 'র‍্যাংকিন স্ট্রিট', 'baldha garden', 'বলধা গার্ডেন'],
  },
  {
    id: 'gandaria',
    name: 'Gandaria',
    banglaName: 'গেন্ডারিয়া',
    lat: 23.7085,
    lng: 90.4260,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['gandaria', 'gendaria', 'গেন্ডারিয়া', 'asgar ali hospital', 'আসগর আলী হাসপাতাল', 'distillery road', 'dayaganj', 'দয়াগঞ্জ'],
  },
  {
    id: 'sutrapur',
    name: 'Sutrapur',
    banglaName: 'সূত্রাপুর',
    lat: 23.7100,
    lng: 90.4160,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['sutrapur', 'সূত্রাপুর', 'iron bridge', 'লোহারপুল'],
  },
  {
    id: 'postogola',
    name: 'Postogola / Shyampur',
    banglaName: 'পোস্তগোলা / শ্যামপুর',
    lat: 23.6960,
    lng: 90.4300,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['postogola', 'পোস্তগোলা', 'shyampur', 'শ্যামপুর', 'jurain', 'জুরাইন', 'kadamtali', 'কদমতলী'],
  },

  // ==========================================
  // JATRABARI, DEMRA & SOUTHEAST DHAKA
  // ==========================================
  {
    id: 'jatrabari',
    name: 'Jatrabari',
    banglaName: 'যাত্রাবাড়ী',
    lat: 23.7104,
    lng: 90.4348,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['jatrabari', 'যাত্রাবাড়ী', 'sayedabad', 'সায়েদাবাদ', 'dhalpur', 'ধলপুর', 'shahid faruk road'],
  },
  {
    id: 'matuail',
    name: 'Matuail / ICMH',
    banglaName: 'মাতুয়াইল / শিশু-মাতৃ স্বাস্থ্য',
    lat: 23.7050,
    lng: 90.4550,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['matuail', 'মাতুয়াইল', 'icmh', 'শিশু মাতৃ স্বাস্থ্য', 'shonir akhra', 'শনির আখড়া', 'donia', 'দনিয়া', 'rayerbag', 'রায়েরবাগ'],
  },
  {
    id: 'demra',
    name: 'Demra',
    banglaName: 'ডেমরা',
    lat: 23.7120,
    lng: 90.4850,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['demra', 'ডেমরা', 'sarulia', 'সারুলিয়া', 'konapara', 'কোনাপাড়া'],
  },

  // ==========================================
  // GREATER DHAKA SUBURBS & DISTRICT UPAZILAS
  // ==========================================
  {
    id: 'keraniganj',
    name: 'Keraniganj',
    banglaName: 'কেরানীগঞ্জ',
    lat: 23.6950,
    lng: 90.3800,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['keraniganj', 'কেরানীগঞ্জ', 'zinjira', 'জিনজিরা', 'rohitpur', 'রোহিতপুর', 'hasnabad', 'হাসনাবাদ', 'subhadya', 'শুভাঢ্যা', 'dhaka central jail'],
  },
  {
    id: 'savar',
    name: 'Savar',
    banglaName: 'সাভার',
    lat: 23.8441,
    lng: 90.2583,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['savar', 'সাভার', 'enam medical', 'এনাম মেডিকেল', 'crp savar', 'সিআরপি', 'savar bazar', 'nobinagar', 'নবীনগর', 'ashulia', 'আশুলিয়া'],
  },
  {
    id: 'dhamrai',
    name: 'Dhamrai',
    banglaName: 'ধামরাই',
    lat: 23.9180,
    lng: 90.2100,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['dhamrai', 'ধামরাই', 'dhamrai upazila'],
  },
  {
    id: 'nawabganj',
    name: 'Nawabganj',
    banglaName: 'নবাবগঞ্জ',
    lat: 23.6660,
    lng: 90.1660,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['nawabganj', 'নবাবগঞ্জ', 'kolakopa', 'কলাকোপা'],
  },
  {
    id: 'dohar',
    name: 'Dohar',
    banglaName: 'দোহার',
    lat: 23.5950,
    lng: 90.1340,
    district: 'Dhaka',
    division: 'Dhaka',
    aliases: ['dohar', 'দোহার', 'joypara', 'জয়পাড়া'],
  },

  // ==========================================
  // OTHER NATIONAL DIVISION HUBS
  // ==========================================
  {
    id: 'chattogram',
    name: 'Chattogram City',
    banglaName: 'চট্টগ্রাম',
    lat: 22.3569,
    lng: 91.7832,
    district: 'Chattogram',
    division: 'Chattogram',
    aliases: ['chattogram', 'chittagong', 'চট্টগ্রাম', 'ctg', 'cmch', 'সিএমসিএইচ', 'agrabad', 'অ্যাগ্রাবাদ', 'panchlaish', 'পাঁচলাইশ', 'gec', 'জিইসি'],
  },
  {
    id: 'sylhet',
    name: 'Sylhet City',
    banglaName: 'সিলেট',
    lat: 24.8949,
    lng: 91.8687,
    district: 'Sylhet',
    division: 'Sylhet',
    aliases: ['sylhet', 'সিলেট', 'osmani medical', 'ওসমানী মেডিকেল', 'zindabazar', 'জিন্দাবাজার', 'subidbazar', 'সুবিদবাজার'],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi City',
    banglaName: 'রাজশাহী',
    lat: 24.3636,
    lng: 88.6241,
    district: 'Rajshahi',
    division: 'Rajshahi',
    aliases: ['rajshahi', 'রাজশাহী', 'rmch', 'আরএমসিএইচ', 'kazla', 'কাজলা', 'saheb bazar', 'সাহেব বাজার'],
  },
  {
    id: 'khulna',
    name: 'Khulna City',
    banglaName: 'খুলনা',
    lat: 22.8456,
    lng: 89.5403,
    district: 'Khulna',
    division: 'Khulna',
    aliases: ['khulna', 'খুলনা', 'kmch', 'কেএমসিএইচ', 'dakbangla', 'ডাকবাংলা', 'boyra', 'বয়রা', 'shibbari', 'শিববাড়ি'],
  },
  {
    id: 'barishal',
    name: 'Barishal City',
    banglaName: 'বরিশাল',
    lat: 22.7010,
    lng: 90.3535,
    district: 'Barishal',
    division: 'Barishal',
    aliases: ['barishal', 'বরিশাল', 'sbmch', 'শের-ই-বাংলা মেডিকেল', 'band road', 'নথুল্লাবাদ'],
  },
  {
    id: 'rangpur',
    name: 'Rangpur City',
    banglaName: 'রংপুর',
    lat: 25.7439,
    lng: 89.2752,
    district: 'Rangpur',
    division: 'Rangpur',
    aliases: ['rangpur', 'রংপুর', 'rpmch', 'রংপুর মেডিকেল', 'dhap', 'ধাপ', 'jahaj company'],
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh City',
    banglaName: 'ময়মনসিংহ',
    lat: 24.7471,
    lng: 90.4203,
    district: 'Mymensingh',
    division: 'Mymensingh',
    aliases: ['mymensingh', 'ময়মনসিংহ', 'mmch', 'ময়মনসিংহ মেডিকেল', 'charpara', 'চরপাড়া', 'ganginarpar'],
  },
];

/**
 * Matches a query string to a known geographic area
 */
export function findMatchingArea(rawQuery: string): AreaLocation | null {
  const q = rawQuery.trim().toLowerCase();
  if (!q || q.length < 2) return null;

  for (const area of ALL_DHAKA_AND_BD_AREAS) {
    if (area.name.toLowerCase() === q || area.banglaName === q) {
      return area;
    }
    for (const alias of area.aliases) {
      if (q === alias.toLowerCase() || alias.toLowerCase() === q) {
        return area;
      }
    }
  }

  // Substring matching
  for (const area of ALL_DHAKA_AND_BD_AREAS) {
    if (area.name.toLowerCase().includes(q) || area.banglaName.includes(q)) {
      return area;
    }
    for (const alias of area.aliases) {
      if (q.includes(alias.toLowerCase()) || alias.toLowerCase().includes(q)) {
        return area;
      }
    }
  }
  return null;
}

/**
 * Returns instant autocomplete suggestions for Dhaka areas matching a user query
 */
export function getAreaSuggestions(query: string, limit = 8): AreaLocation[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    // Return most prominent Dhaka hubs
    return ALL_DHAKA_AND_BD_AREAS.slice(0, limit);
  }

  const results: AreaLocation[] = [];
  for (const area of ALL_DHAKA_AND_BD_AREAS) {
    const isDirectMatch =
      area.name.toLowerCase().includes(trimmed) ||
      area.banglaName.includes(trimmed);

    const isAliasMatch = area.aliases.some(
      (a) => a.toLowerCase().includes(trimmed) || trimmed.includes(a.toLowerCase())
    );

    if (isDirectMatch || isAliasMatch) {
      results.push(area);
      if (results.length >= limit) break;
    }
  }

  return results;
}

export interface SearchResult {
  hospitals: Hospital[];
  detectedArea: AreaLocation | null;
  matchType: 'direct' | 'area_proximity' | 'all';
}

/**
 * Comprehensive intelligent hospital search:
 * 1. Matches hospital name, bangla name, address, upazila, district, code, notes, area tags.
 * 2. If the user searches an area (e.g. Rampura, Banasree, Mirpur, Uttara, Mohammadpur, Dhanmondi):
 *    - Finds hospitals located directly in that area
 *    - Also includes nearest surrounding hospitals ranked by distance to that area
 * 3. Gracefully handles bilingual English & Bangla queries
 */
export function filterAndRankHospitals(
  hospitals: Hospital[],
  query: string,
  userLat?: number,
  userLng?: number
): SearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      hospitals: [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm),
      detectedArea: null,
      matchType: 'all',
    };
  }

  const q = trimmed.toLowerCase();
  const detectedArea = findMatchingArea(q);

  // 1. Direct text matches
  const directMatches = hospitals.filter((h) => {
    const nameMatch = h.name.toLowerCase().includes(q);
    const banglaMatch = Boolean(h.banglaName && h.banglaName.includes(trimmed));
    const addressMatch = h.address.toLowerCase().includes(q);
    const upazilaMatch = h.upazila.toLowerCase().includes(q);
    const districtMatch = h.district.toLowerCase().includes(q);
    const codeMatch = h.code.includes(q);
    const notesMatch = Boolean(h.notes && h.notes.toLowerCase().includes(q));
    const tagsMatch = Boolean(
      h.areaTags &&
        h.areaTags.some(
          (t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())
        )
    );

    return (
      nameMatch ||
      banglaMatch ||
      addressMatch ||
      upazilaMatch ||
      districtMatch ||
      codeMatch ||
      notesMatch ||
      tagsMatch
    );
  });

  // 2. If a specific area was recognized (e.g. Rampura, Mirpur, Dhanmondi, Uttara, Badda, Old Dhaka...)
  if (detectedArea) {
    const areaDirectIds = new Set(directMatches.map((h) => h.id));

    // Find nearby hospitals within 7.5km of the detected area center
    const nearbyToArea = hospitals
      .map((h) => ({
        hospital: h,
        distanceToArea: calculateDistanceKm(
          detectedArea.lat,
          detectedArea.lng,
          h.lat,
          h.lng
        ),
      }))
      .filter(
        ({ hospital, distanceToArea }) =>
          areaDirectIds.has(hospital.id) || distanceToArea <= 7.5
      )
      .sort((a, b) => {
        const aIsDirect = areaDirectIds.has(a.hospital.id);
        const bIsDirect = areaDirectIds.has(b.hospital.id);
        if (aIsDirect && !bIsDirect) return -1;
        if (!aIsDirect && bIsDirect) return 1;
        return a.distanceToArea - b.distanceToArea;
      })
      .map(({ hospital }) => hospital);

    if (nearbyToArea.length > 0) {
      return {
        hospitals: nearbyToArea,
        detectedArea,
        matchType: 'area_proximity',
      };
    }
  }

  // 3. Fallback to direct matches sorted by distance
  const sortedDirect = [...directMatches].sort(
    (a, b) => a.distanceKm - b.distanceKm
  );

  return {
    hospitals: sortedDirect,
    detectedArea: null,
    matchType: 'direct',
  };
}
