"use client";

import { useEffect, useMemo, useState } from "react";
// Ganti baris 4 di useBusData.js menjadi ini:
import { supabase } from "../lib/supabaseClient";

export function useBusData() {
  const [stops, setStops] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [operationalStatus, setOperationalStatus] = useState({ isOperating: true, message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Ambil data dari tabel 'stops'
        const { data: stopsData, error: stopsError } = await supabase
          .from("stops")
          .select("*");
        
        console.log("STOPS DATA:", stopsData);  // ← tambah ini
         console.log("STOPS ERROR:", stopsError); // ← tambah ini

        if (stopsError) throw stopsError;

        // 2. Ambil data dari tabel 'schedules'
        const { data: schedulesData, error: schedulesError } = await supabase
          .from("schedules")
          .select("*");
        if (schedulesError) throw schedulesError;

        // 3. Ambil data dari tabel 'announcements'
        const { data: announcementsData, error: announcementsError } = await supabase
          .from("announcements")
          .select("*");
        if (announcementsError) throw announcementsError;

        // Set state dengan data dari database
        setStops(stopsData || []);
        setSchedules(schedulesData || []);
        setAnnouncements(announcementsData || []);
        
        // Catatan: Untuk operationalStatus, jika Anda belum membuat tabel khusus di Supabase,
        // nilainya akan tetap menggunakan default bawaan (true).
        setOperationalStatus({ isOperating: true, message: "" });

      } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Membaut map dari data stops berdasarkan ID untuk mempermudah pencarian data di UI
  const stopMap = useMemo(
    () => Object.fromEntries(stops.map((stop) => [stop.id, stop])),
    [stops],
  );

  return {
    stops,
    schedules,
    announcements,
    operationalStatus,
    stopMap,
    loading,              // Ekspor variabel loading untuk digunakan di HomePage
    setStops,
    setSchedules,
    setAnnouncements,
    setOperationalStatus,
  };
}