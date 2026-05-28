export const initialStops = [
  { id: "gerbang_depan", name: "Gerbang Depan", area: "Akses masuk utama kampus", order: 1, x: 6, y: 76, status: "active" },
  { id: "teknik", name: "Teknik", area: "Fakultas Teknik", order: 2, x: 14, y: 58, status: "active" },
  { id: "feb", name: "FEB", area: "Fakultas Ekonomi dan Bisnis", order: 3, x: 23, y: 42, status: "active" },
  { id: "fisip", name: "FISIP", area: "Fakultas Ilmu Sosial dan Politik", order: 4, x: 33, y: 31, status: "active" },
  { id: "hukum", name: "Hukum", area: "Fakultas Hukum", order: 5, x: 45, y: 28, status: "active" },
  { id: "gerbang_belakang", name: "Gerbang Belakang", area: "Akses belakang kampus", order: 6, x: 56, y: 36, status: "active" },
  { id: "pasca", name: "Pasca", area: "Sekolah Pascasarjana", order: 7, x: 65, y: 49, status: "active" },
  { id: "kedokteran", name: "Kedokteran", area: "Fakultas Kedokteran", order: 8, x: 73, y: 62, status: "active" },
  { id: "psikologi", name: "Psikologi", area: "Fakultas Psikologi", order: 9, x: 82, y: 69, status: "active" },
  { id: "mipa", name: "MIPA", area: "Fakultas MIPA", order: 10, x: 90, y: 56, status: "active" },
  { id: "pertanian", name: "Pertanian", area: "Fakultas Pertanian", order: 11, x: 85, y: 38, status: "active" },
  { id: "rektorat", name: "Rektorat", area: "Pusat administrasi kampus", order: 12, x: 75, y: 24, status: "active" },
  { id: "gerbang_samping", name: "Gerbang Samping", area: "Akses samping kampus", order: 13, x: 63, y: 17, status: "active" },
  { id: "fkip", name: "FKIP", area: "Fakultas Keguruan dan Ilmu Pendidikan", order: 14, x: 49, y: 14, status: "active" },
  { id: "fib", name: "FIB", area: "Fakultas Ilmu Budaya", order: 15, x: 35, y: 20, status: "active" },
  { id: "fsrd", name: "FSRD", area: "Fakultas Seni Rupa dan Desain", order: 16, x: 22, y: 29, status: "active" },
  { id: "peternakan", name: "Peternakan", area: "Fakultas Peternakan", order: 17, x: 11, y: 43, status: "active" },
];

const stopTimes = {
  gerbang_depan: ["06.30", "07.00", "09.00", "12.30", "16.00"],
  teknik: ["06.40", "07.10", "09.10", "12.40", "16.10"],
  feb: ["06.50", "07.20", "09.20", "12.50", "16.20"],
  fisip: ["07.00", "07.30", "09.30", "13.00", "16.30"],
  hukum: ["07.10", "07.40", "09.40", "13.10", "16.40"],
  gerbang_belakang: ["07.20", "07.50", "09.50", "13.20", "16.50"],
  pasca: ["07.30", "08.00", "10.00", "13.30", "17.00"],
  kedokteran: ["07.40", "08.10", "10.10", "13.40", "17.10"],
  psikologi: ["07.50", "08.20", "10.20", "13.50", "17.20"],
  mipa: ["08.00", "08.30", "10.30", "14.00", "17.30"],
  pertanian: ["08.10", "08.40", "10.40", "14.10", "17.40"],
  rektorat: ["08.20", "08.50", "10.50", "14.20", "17.50"],
  gerbang_samping: ["08.30", "09.00", "11.00", "14.30", "18.00"],
  fkip: ["08.40", "09.10", "11.10", "14.40", "18.10"],
  fib: ["08.50", "09.20", "11.20", "14.50", "18.20"],
  fsrd: ["09.00", "09.30", "11.30", "15.00", "18.30"],
  peternakan: ["09.10", "09.40", "11.40", "15.10", "18.40"],
};

export const initialSchedules = initialStops.flatMap((stop, stopIndex) => {
  const nextStop = initialStops[stopIndex + 1] ?? initialStops[0];

  return stopTimes[stop.id].map((time, timeIndex) => ({
    id: `schedule_${stop.id}_${timeIndex + 1}`,
    stopId: stop.id,
    nextStopId: nextStop.id,
    time,
    days: "Senin-Jumat",
    note: timeIndex === 0 ? "Keberangkatan pagi" : "Keberangkatan reguler",
    status: "active",
  }));
});

export const initialAnnouncements = [
  {
    id: "announcement_001",
    title: "Operasional Tanpa GPS",
    content: "BusUNS menampilkan jadwal dan rute visual. Sistem belum menyediakan live location atau estimasi berbasis GPS.",
    status: "active",
    createdAt: "2026-05-29",
  },
  {
    id: "announcement_002",
    title: "Jadwal Fleksibel Saat Hujan",
    content: "Jadwal dapat berubah saat hujan deras, kepadatan lalu lintas kampus, atau kegiatan besar UNS.",
    status: "active",
    createdAt: "2026-05-29",
  },
];
