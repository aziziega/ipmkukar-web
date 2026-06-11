-- =====================================================
-- SEED DATA: Dummy Activities for Testing
-- =====================================================
-- Purpose: Populate activities table with realistic test data
-- Departments: 6 (Seni dan Budaya, Sosial dan Keagamaan, Informasi dan Komunikasi, 
--              Pengembangan Organisasi, Olahraga, Kajian Strategi dan Pendidikan)
-- Year Range: 2024-2025
-- Total Activities: 20
-- Images: 2-5 per activity (Unsplash URLs)
-- =====================================================

-- Insert 20 realistic activities
INSERT INTO activities (
  id,
  title,
  description,
  images,
  department,
  date,
  year,
  type,
  participants,
  location,
  is_published,
  is_featured,
  created_at,
  updated_at
) VALUES

-- ========== Seni dan Budaya ==========
(
  gen_random_uuid(),
  'Festival Seni dan Budaya Nusantara 2024',
  'Perayaan seni dan budaya dengan menampilkan berbagai pertunjukan tari tradisional, musik angklung, dan pameran seni rupa dari berbagai daerah di Indonesia. Acara ini dihadiri oleh seluruh siswa dan mengundang seniman lokal.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800'
  ]),
  'Seni dan Budaya',
  '2024-08-17',
  2024,
  'Event',
  280,
  'Aula Utama SMA',
  true,
  true,
  NOW() - INTERVAL '8 months',
  NOW() - INTERVAL '8 months'
),
(
  gen_random_uuid(),
  'Lomba Seni Rupa dan Fotografi',
  'Kompetisi seni rupa dan fotografi dengan tema "Keindahan Alam Indonesia". Karya terbaik akan dipamerkan di galeri sekolah dan mendapat penghargaan.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800'
  ]),
  'Seni dan Budaya',
  '2024-10-05',
  2024,
  'Event',
  85,
  'Galeri Seni Sekolah',
  true,
  false,
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '6 months'
),
(
  gen_random_uuid(),
  'Pentas Musik Akustik Siswa',
  'Pertunjukan musik akustik yang menampilkan bakat siswa dalam bernyanyi dan bermain alat musik. Acara ini terbuka untuk umum dan menjadi ajang unjuk kreativitas siswa.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  ]),
  'Seni dan Budaya',
  '2025-03-22',
  2025,
  'Gathering',
  320,
  'Auditorium Sekolah',
  true,
  true,
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months'
),

-- ========== Sosial dan Keagamaan ==========
(
  gen_random_uuid(),
  'Bakti Sosial Ramadhan 2024',
  'Kegiatan bakti sosial berbagi makanan berbuka puasa dan paket sembako kepada masyarakat kurang mampu di sekitar sekolah. Melibatkan seluruh anggota IPM dalam penggalangan dan distribusi donasi.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=800'
  ]),
  'Sosial dan Keagamaan',
  '2024-03-28',
  2024,
  'Sosial',
  150,
  'Kelurahan Setempat',
  true,
  true,
  NOW() - INTERVAL '11 months',
  NOW() - INTERVAL '11 months'
),
(
  gen_random_uuid(),
  'Peringatan Isra Miraj dan Kajian Islam',
  'Peringatan Isra Miraj dengan kajian keislaman yang menghadirkan ustadz sebagai pembicara. Acara diikuti dengan doa bersama dan pembagian makanan.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
    'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',
    'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=800'
  ]),
  'Sosial dan Keagamaan',
  '2024-09-10',
  2024,
  'Event',
  420,
  'Masjid Sekolah',
  true,
  false,
  NOW() - INTERVAL '7 months',
  NOW() - INTERVAL '7 months'
),
(
  gen_random_uuid(),
  'Donor Darah dan Pemeriksaan Kesehatan Gratis',
  'Kegiatan donor darah bekerja sama dengan PMI dan pemeriksaan kesehatan gratis untuk warga sekolah dan masyarakat sekitar.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
    'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800'
  ]),
  'Sosial dan Keagamaan',
  '2024-11-20',
  2024,
  'Sosial',
  210,
  'Aula Sekolah',
  true,
  true,
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '5 months'
),

-- ========== Informasi dan Komunikasi ==========
(
  gen_random_uuid(),
  'Pelatihan Jurnalistik dan Penulisan Berita',
  'Workshop jurnalistik dasar yang mengajarkan teknik penulisan berita, wawancara, dan fotografi jurnalistik untuk anggota media sekolah.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
  ]),
  'Informasi dan Komunikasi',
  '2024-06-15',
  2024,
  'Workshop',
  45,
  'Ruang Lab Komputer',
  true,
  false,
  NOW() - INTERVAL '9 months',
  NOW() - INTERVAL '9 months'
),
(
  gen_random_uuid(),
  'Lomba Desain Grafis dan Video Kreatif',
  'Kompetisi desain poster dan pembuatan video kreatif dengan tema promosi kegiatan sekolah. Pemenang akan mendapat hadiah dan karya dipublikasikan di media sosial sekolah.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800'
  ]),
  'Informasi dan Komunikasi',
  '2024-09-28',
  2024,
  'Event',
  62,
  'Ruang Multimedia',
  true,
  false,
  NOW() - INTERVAL '7 months',
  NOW() - INTERVAL '7 months'
),
(
  gen_random_uuid(),
  'Launching Website dan Media Sosial IPM',
  'Peluncuran website resmi IPM dan revamp media sosial dengan strategi konten baru untuk meningkatkan engagement dan informasi kegiatan.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800'
  ]),
  'Informasi dan Komunikasi',
  '2025-01-15',
  2025,
  'Event',
  180,
  'Aula Sekolah',
  true,
  true,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months'
),

-- ========== Pengembangan Organisasi ==========
(
  gen_random_uuid(),
  'Latihan Dasar Kepemimpinan Siswa (LDKS) 2024',
  'Pelatihan kepemimpinan dan organisasi untuk pengurus IPM baru, dengan materi team building, public speaking, dan manajemen organisasi.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
  ]),
  'Pengembangan Organisasi',
  '2024-07-20',
  2024,
  'Kaderisasi',
  95,
  'Villa Puncak',
  true,
  true,
  NOW() - INTERVAL '8 months',
  NOW() - INTERVAL '8 months'
),
(
  gen_random_uuid(),
  'Workshop Manajemen Waktu dan Produktivitas',
  'Pelatihan manajemen waktu untuk siswa aktif organisasi agar bisa menyeimbangkan kegiatan akademik dan non-akademik.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'
  ]),
  'Pengembangan Organisasi',
  '2024-10-18',
  2024,
  'Workshop',
  68,
  'Ruang Kelas 12-A',
  true,
  false,
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '6 months'
),
(
  gen_random_uuid(),
  'Rapat Kerja dan Evaluasi Program IPM 2025',
  'Rapat kerja tahunan IPM untuk evaluasi program kerja tahun sebelumnya dan perencanaan program kerja tahun mendatang.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
    'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'
  ]),
  'Pengembangan Organisasi',
  '2025-02-10',
  2025,
  'Event',
  52,
  'Ruang Rapat Sekolah',
  true,
  false,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months'
),

-- ========== Olahraga ==========
(
  gen_random_uuid(),
  'Turnamen Futsal Antar Kelas 2024',
  'Kompetisi futsal antar kelas untuk memeriahkan hari olahraga nasional. Turnamen diikuti oleh 16 tim dari kelas 10, 11, dan 12.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1511204579483-bb000ccc00ab?w=800',
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800'
  ]),
  'Olahraga',
  '2024-09-09',
  2024,
  'Olahraga',
  320,
  'Lapangan Futsal Sekolah',
  true,
  true,
  NOW() - INTERVAL '7 months',
  NOW() - INTERVAL '7 months'
),
(
  gen_random_uuid(),
  'Senam Sehat Bersama dan Jalan Santai',
  'Kegiatan senam sehat pagi dan jalan santai mengelilingi kompleks sekolah untuk memperingati hari kesehatan nasional.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
  ]),
  'Olahraga',
  '2024-11-12',
  2024,
  'Gathering',
  450,
  'Halaman Sekolah',
  true,
  false,
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '5 months'
),
(
  gen_random_uuid(),
  'Lomba Lari Marathon Mini dan Estafet',
  'Perlombaan lari marathon mini 5K dan lari estafet antar angkatan untuk meningkatkan semangat sportivitas dan kebersamaan.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'
  ]),
  'Olahraga',
  '2025-04-21',
  2025,
  'Olahraga',
  185,
  'Area Car Free Day',
  true,
  true,
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '1 month'
),

-- ========== Kajian Strategi dan Pendidikan ==========
(
  gen_random_uuid(),
  'Seminar Nasional Pendidikan Karakter',
  'Seminar dengan menghadirkan pakar pendidikan membahas pentingnya pendidikan karakter di era digital dan strategi pengembangannya.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
  ]),
  'Kajian Strategi dan Pendidikan',
  '2024-05-18',
  2024,
  'Kajian',
  380,
  'Auditorium Kota',
  true,
  true,
  NOW() - INTERVAL '10 months',
  NOW() - INTERVAL '10 months'
),
(
  gen_random_uuid(),
  'Bimbingan Belajar dan Try Out UTBK',
  'Program bimbingan belajar gratis dan try out UTBK untuk siswa kelas 12 sebagai persiapan menghadapi ujian masuk perguruan tinggi.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800'
  ]),
  'Kajian Strategi dan Pendidikan',
  '2024-12-07',
  2024,
  'Workshop',
  142,
  'Ruang Kelas Lantai 3',
  true,
  false,
  NOW() - INTERVAL '4 months',
  NOW() - INTERVAL '4 months'
),
(
  gen_random_uuid(),
  'Diskusi Publik: Peran Pemuda dalam Pembangunan',
  'Forum diskusi terbuka membahas peran generasi muda dalam pembangunan bangsa dengan narasumber dari berbagai latar belakang.',
  to_jsonb(ARRAY[
    'https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=800',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800'
  ]),
  'Kajian Strategi dan Pendidikan',
  '2025-03-14',
  2025,
  'Kajian',
  225,
  'Aula Serbaguna',
  true,
  false,
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months'
);

-- =====================================================
-- NOTES:
-- 1. Replace gen_random_uuid() with uuid_generate_v4() if using older PostgreSQL
-- 2. Images use Unsplash URLs - these are public and free to use
-- 3. Activities are distributed across all 6 departments
-- 4. Mix of is_published (true) and is_featured (true/false) for testing
-- 5. created_at and updated_at use relative intervals for realistic timestamps
-- 6. Total: 20 activities (3-4 per department)
-- =====================================================
