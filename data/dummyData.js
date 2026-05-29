export const initialStops = [
  { id: "gerdep1", name: "Gerbang Depan", area: "Akses masuk utama kampus", order: 1, lat: -7.564019, lng: 110.855948, x: 6, y: 76, status: "active" },
  { id: "teknik", name: "Teknik", area: "Fakultas Teknik", order: 2, lat: -7.560445, lng: 110.854856, x: 14, y: 58, status: "active" },
  { id: "feb", name: "FEB", area: "Fakultas Ekonomi dan Bisnis", order: 3, lat: -7.558408, lng: 110.854406, x: 23, y: 42, status: "active" },
  { id: "fisip", name: "FISIP", area: "Fakultas Ilmu Sosial dan Politik", order: 4, lat: -7.556866, lng: 110.854009, x: 33, y: 31, status: "active" },
  { id: "fkip", name: "FKIP", area: "Fakultas Keguruan dan Ilmu Pendidikan", order: 5, lat: -7.556712, lng: 110.855082, x: 45, y: 28, status: "active" },
  { id: "pasca", name: "Pascasarjana", area: "Pascasarjana", order: 6, lat: -7.556922, lng: 110.856881, x: 56, y: 36, status: "active" },
  { id: "gerbel", name: "Gerbang Belakang", area: "Gerbang Belakang", order: 7, lat: -7.555039, lng: 110.857230, x: 65, y: 49, status: "active" },
  { id: "bri", name: "BRI Corner", area: "BRI Corner", order: 8, lat: -7.557276, lng: 110.857034, x: 73, y: 62, status: "active" },
  { id: "fmipa", name: "FMIPA", area: "Fakultas MIPA", order: 9, lat: -7.559177, lng: 110.857844, x: 82, y: 69, status: "active" },
  { id: "pertanian", name: "Pertanian", area: "Fakultas Pertanian", order: 11, lat: -7.560307, lng: 110.857555, x: 85, y: 38, status: "active" },
  { id: "gerdep2", name: "Gerbang depan", area: "Akses keluar kampus", order: 12, lat: -7.563814, lng: 110.856214, x: 75, y: 24, status: "active" },
];

const stopTimes = {
  gerdep1: ["06.30", "07.00", "09.00", "12.30", "16.00"],
  teknik: ["06.40", "07.10", "09.10", "12.40", "16.10"],
  feb: ["06.50", "07.20", "09.20", "12.50", "16.20"],
  fisip: ["07.00", "07.30", "09.30", "13.00", "16.30"],
  fkip: ["07.10", "07.40", "09.40", "13.10", "16.40"],
  pasca: ["07.30", "08.00", "10.00", "13.30", "17.00"],
  gerbel: ["07.40", "08.10", "10.10", "13.40", "17.10"],
  bri: ["07.50", "08.20", "10.20", "13.50", "17.20"],
  fmipa: ["08.00", "08.30", "10.30", "14.00", "17.30"],
  pertanian: ["08.10", "08.40", "10.40", "14.10", "17.40"],
  gerdep2: ["08.20", "08.50", "10.50", "14.20", "17.50"],
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

export const initialOperationalStatus = {
  isOperating: true,
  message: "Bus beroperasi normal sesuai jadwal.",
  updatedAt: "2026-05-29",
};
