// Data dummy Contraflow. Hapus file ini setelah database (Prisma) siap.

const NAMA_CCTV = [
  'AGAS', 'BALAIKOTA', 'BALAPAN', 'BANJARSARI', 'BARON', 'BATURONO',
  'BAWAH FLYOVER PURWOSARI', 'BUNDARAN BARON', 'BUNDARAN GLADAG',
  'BUNDARAN JOGLO', 'BUNDARAN TIPES', 'CENGKLIK', 'DAWUNG SELATAN', 'DPRD',
  'FAJAR INDAH', 'FAROKAH', 'FLYOVER PURWOSARI', 'GADING', 'GEMBLEGAN',
  'GENDENGAN', 'GENENGAN', 'GILINGAN', 'GIRIMULYO', 'JEMBATAN MOJO',
  'JEMBATAN TIRTONADI', 'JONGKE', 'JUANDA', 'JURUG', 'JURUG TIMUR FIX',
  'KABANGAN', 'KANDANG SAPI', 'KAWATAN', 'KELURAHAN SUMBER', 'KERTEN',
  'KETANDAN', 'KLECO', 'KLODRAN', 'KOMPLANG', 'LEBAK', 'LOJI GANDRUNG',
  'MAKO BRIMOB', 'MAKUTHO', 'MASJID AGUNG', 'MIPITAN', 'MLIPAHAN',
  'MOJOSONGO', 'MUJAHIDIN', 'NGAPEMAN', 'NGEMPLAK', 'NGEMPLAK BARAT',
  'NGEMPLAK SELATAN', 'NGEMPLAK TIMUR', 'NGEMPLAK UTARA', 'NONONGAN',
  'OVERPASS MANAHAN', 'PAJANG', 'PANGGUNG', 'PASAR BELING', 'PASAR GEDE',
  'PASAR KEMBANG', 'PASAR KLEWER', 'PASAR KLIWON', 'PASAR LEGI',
  'PASAR NONGKO', 'PASAR NUSUKAN', 'PASAR PON', 'PENGADILAN SRIWEDARI',
  'PGS', 'PUCANGSAWIT', 'PURWOSARI', 'RAHAYU', 'RAMAYANA', 'RINGROAD',
  'SANGKRAH', 'SATE SUMBER', 'SEKARPACE', 'SEKIP', 'SEMANGGI', 'SHOLIKIN',
  'SINGOSAREN', 'SMP 18', 'SPBU PUCANGSAWIT', 'SRATEN', 'SRIWEDARI',
  'SUDIRMAN', 'TIMURAN', 'TIPES', 'TIRTONADI', 'TUGU CEMBENGAN',
  'TUGU WISNU', 'UNS', 'UNS BARAT FIX', 'UNS TIMUR FIX', 'URSULIN',
  'WARUNG PELEM', 'WIDURAN',
];

const SINGKATAN = ['PGS', 'UNS', 'DPRD', 'SMP', 'SPBU'];
const titleCase = s =>
  s.split(' ')
    .map(w => (SINGKATAN.includes(w) ? w : w[0] + w.slice(1).toLowerCase()))
    .join(' ');

const cctvList = NAMA_CCTV
  .map(n => ({
    nama: 'CCTV ' + titleCase(n),
    streamUrl: `https://ccroom-dishub.surakarta.go.id/stream/${encodeURIComponent(n)}/playlist.m3u8`,
  }))
  .sort((a, b) => a.nama.localeCompare(b.nama, 'id'))
  .map((c, i) => ({ id: i + 1, ...c }));

// Pseudo-random dengan seed tetap -> data selalu sama tiap server restart
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const rand = rng(2026);
const pick = arr => arr[Math.floor(rand() * arr.length)];
const pad = n => String(n).padStart(2, '0');

const SEBAB = [
  'Melawan arus',
  'Tidak memakai helm',
  'Membawa penumpang berlebih',
  'Tidak menggunakan seatbelt',
  'Melebihi batas kecepatan',
];
const VEHICLE_TYPES = ["RODA_DUA", "RODA_TIGA", "RODA_EMPAT", "TRUK_BUS"];
const HURUF = 'ABCDEFGHJKLMNPRSTUWXYZ';
const plat = () =>
  'AD ' + (1000 + Math.floor(rand() * 9000)) + ' ' + pick(HURUF) + pick(HURUF);

// Sebagian CCTV sengaja banyak data (uji pagination),
// sebagian sengaja kosong (uji empty state / task 86).
const JUMLAH = { 'CCTV Agas': 41, 'CCTV Bundaran Gladag': 60, 'CCTV Purwosari': 33 };
const KOSONG = ['CCTV Widuran', 'CCTV Ursulin', 'CCTV Timuran'];

const violations = [];
let id = 1;
for (const c of cctvList) {
  if (KOSONG.includes(c.nama)) continue;
  const n = JUMLAH[c.nama] ?? 3 + Math.floor(rand() * 10); // default 3-12 data
  for (let i = 0; i < n; i++) {
    const bulan = 1 + Math.floor(rand() * 3); // Jan - Mar 2026
    const hari = 1 + Math.floor(rand() * 28);
    const jam = Math.floor(rand() * 24);
const menit = Math.floor(rand() * 60);
const detik = Math.floor(rand() * 60);
const occurredAt = new Date(
  Date.UTC(2026, bulan - 1, hari, jam, menit, detik)
);
    violations.push({
      id: `mock-violation-${id}`,
      externalId: `mock-event-${id}`,
      cctvId: c.id,
      type: "CONTRAFLOW",
      vehicleType: pick(VEHICLE_TYPES),
      plateNumber: plat(),
      description: pick(SEBAB),
      occurredAt,
      imageKey: `violations/pelanggaran-${id}.jpg`,
      confidence: Number((0.7 + rand() * 0.3).toFixed(2)),
      createdAt: new Date(occurredAt),
    });
    id++;
  }
}

// urut terbaru dulu
violations.sort(
  (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()
);
export { cctvList, violations };