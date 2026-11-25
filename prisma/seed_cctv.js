// Jalankan SEKALI: node prisma/seed_cctv.js
import prisma from "../src/libs/prisma.js";

// Catatan: latitude/longitude = null untuk titik yang koordinatnya belum diketahui.
// 10 titik yang terisi adalah perkiraan (akurasi sekitar 100-300 m), sebaiknya diverifikasi.
const cctvList = [
    { url: "https://ccroom-dishub.surakarta.go.id/stream/AGAS/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // AGAS
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BALAIKOTA/playlist.m3u8", type: "STREAM", latitude: -7.5706, longitude: 110.8298, owner: "Dishub Kota Surakarta", status: "ON" }, // BALAIKOTA
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BALAPAN/playlist.m3u8", type: "STREAM", latitude: -7.5564, longitude: 110.8209, owner: "Dishub Kota Surakarta", status: "ON" }, // BALAPAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BANJARSARI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BANJARSARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BARON/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BARON
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BATURONO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BATURONO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BAWAH%20FLYOVER%20PURWOSARI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BAWAH FLYOVER PURWOSARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BUNDARAN%20BARON/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BUNDARAN BARON
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BUNDARAN%20GLADAG/playlist.m3u8", type: "STREAM", latitude: -7.5717, longitude: 110.8275, owner: "Dishub Kota Surakarta", status: "ON" }, // BUNDARAN GLADAG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BUNDARAN%20JOGLO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BUNDARAN JOGLO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/BUNDARAN%20TIPES/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // BUNDARAN TIPES
    { url: "https://ccroom-dishub.surakarta.go.id/stream/CENGKLIK/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // CENGKLIK
    { url: "https://ccroom-dishub.surakarta.go.id/stream/DAWUNG%20SELATAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // DAWUNG SELATAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/DPRD/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // DPRD
    { url: "https://ccroom-dishub.surakarta.go.id/stream/FAJAR%20INDAH/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // FAJAR INDAH
    { url: "https://ccroom-dishub.surakarta.go.id/stream/FAROKAH/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // FAROKAH
    { url: "https://ccroom-dishub.surakarta.go.id/stream/FLYOVER%20PURWOSARI/playlist.m3u8", type: "STREAM", latitude: -7.5666, longitude: 110.799, owner: "Dishub Kota Surakarta", status: "ON" }, // FLYOVER PURWOSARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GADING/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GADING
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GEMBLEGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GEMBLEGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GENDENGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GENDENGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GENENGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GENENGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GILINGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GILINGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/GIRIMULYO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // GIRIMULYO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JEMBATAN%20MOJO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JEMBATAN MOJO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JEMBATAN%20TIRTONADI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JEMBATAN TIRTONADI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JONGKE/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JONGKE
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JUANDA/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JUANDA
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JURUG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JURUG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/JURUG%20TIMUR%20FIX/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // JURUG TIMUR FIX
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KABANGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KABANGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KANDANG%20SAPI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KANDANG SAPI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KAWATAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KAWATAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KELURAHAN%20SUMBER/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KELURAHAN SUMBER
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KERTEN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KERTEN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KETANDAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KETANDAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KLECO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KLECO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KLODRAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KLODRAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/KOMPLANG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // KOMPLANG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/LEBAK/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // LEBAK
    { url: "https://ccroom-dishub.surakarta.go.id/stream/LOJI%20GANDRUNG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // LOJI GANDRUNG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MAKO%20BRIMOB/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MAKO BRIMOB
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MAKUTHO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MAKUTHO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MASJID%20AGUNG/playlist.m3u8", type: "STREAM", latitude: -7.5745, longitude: 110.827, owner: "Dishub Kota Surakarta", status: "ON" }, // MASJID AGUNG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MIPITAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MIPITAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MLIPAHAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MLIPAHAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MOJOSONGO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MOJOSONGO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/MUJAHIDIN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // MUJAHIDIN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGAPEMAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGAPEMAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGEMPLAK/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGEMPLAK
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGEMPLAK%20BARAT/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGEMPLAK BARAT
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGEMPLAK%20SELATAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGEMPLAK SELATAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGEMPLAK%20TIMUR/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGEMPLAK TIMUR
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NGEMPLAK%20UTARA/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NGEMPLAK UTARA
    { url: "https://ccroom-dishub.surakarta.go.id/stream/NONONGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // NONONGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/OVERPASS%20MANAHAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // OVERPASS MANAHAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PAJANG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PAJANG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PANGGUNG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PANGGUNG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20BELING/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR BELING
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20GEDE/playlist.m3u8", type: "STREAM", latitude: -7.5688, longitude: 110.834, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR GEDE
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20KEMBANG/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR KEMBANG
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20KLEWER/playlist.m3u8", type: "STREAM", latitude: -7.5755, longitude: 110.8271, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR KLEWER
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20KLIWON/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR KLIWON
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20LEGI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR LEGI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20NONGKO/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR NONGKO
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20NUSUKAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR NUSUKAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PASAR%20PON/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PASAR PON
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PENGADILAN%20SRIWEDARI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PENGADILAN SRIWEDARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PGS/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PGS
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PUCANGSAWIT/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // PUCANGSAWIT
    { url: "https://ccroom-dishub.surakarta.go.id/stream/PURWOSARI/playlist.m3u8", type: "STREAM", latitude: -7.5662, longitude: 110.7977, owner: "Dishub Kota Surakarta", status: "ON" }, // PURWOSARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/RAHAYU/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // RAHAYU
    { url: "https://ccroom-dishub.surakarta.go.id/stream/RAMAYANA/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // RAMAYANA
    { url: "https://ccroom-dishub.surakarta.go.id/stream/RINGROAD/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // RINGROAD
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SANGKRAH/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SANGKRAH
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SATE%20SUMBER/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SATE SUMBER
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SEKARPACE/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SEKARPACE
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SEKIP/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SEKIP
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SEMANGGI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SEMANGGI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SHOLIKIN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SHOLIKIN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SINGOSAREN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SINGOSAREN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SMP%2018/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SMP 18
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SPBU%20PUCANGSAWIT/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SPBU PUCANGSAWIT
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SRATEN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SRATEN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SRIWEDARI/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SRIWEDARI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/SUDIRMAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // SUDIRMAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/TIMURAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // TIMURAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/TIPES/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // TIPES
    { url: "https://ccroom-dishub.surakarta.go.id/stream/TIRTONADI/playlist.m3u8", type: "STREAM", latitude: -7.5535, longitude: 110.8263, owner: "Dishub Kota Surakarta", status: "ON" }, // TIRTONADI
    { url: "https://ccroom-dishub.surakarta.go.id/stream/TUGU%20CEMBENGAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // TUGU CEMBENGAN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/TUGU%20WISNU/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // TUGU WISNU
    { url: "https://ccroom-dishub.surakarta.go.id/stream/UNS/playlist.m3u8", type: "STREAM", latitude: -7.5598, longitude: 110.857, owner: "Dishub Kota Surakarta", status: "ON" }, // UNS
    { url: "https://ccroom-dishub.surakarta.go.id/stream/UNS%20BARAT%20FIX/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // UNS BARAT FIX
    { url: "https://ccroom-dishub.surakarta.go.id/stream/UNS%20TIMUR%20FIX/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // UNS TIMUR FIX
    { url: "https://ccroom-dishub.surakarta.go.id/stream/URSULIN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // URSULIN
    { url: "https://ccroom-dishub.surakarta.go.id/stream/WARUNG%20PELEM/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // WARUNG PELEM
    { url: "https://ccroom-dishub.surakarta.go.id/stream/WIDURAN/playlist.m3u8", type: "STREAM", latitude: null, longitude: null, owner: "Dishub Kota Surakarta", status: "ON" }, // WIDURAN
];

const result = await prisma.cctv.createMany({ data: cctvList });
console.log(`Seeded ${result.count} CCTV`);
await prisma.$disconnect();
