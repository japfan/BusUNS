"use client";

import { useEffect, useMemo, useState } from "react";
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

        // Fetch semua tabel secara paralel — jauh lebih cepat dari berurutan
        const [
          { data: stopsData, error: stopsError },
          { data: schedulesData, error: schedulesError },
          { data: announcementsData, error: announcementsError },
          { data: operationalStatusData, error: operationalStatusError },
        ] = await Promise.all([
          supabase.from("stops").select("*"),
          supabase.from("schedules").select("*"),
          supabase.from("announcements").select("*"),
          supabase.from("operational_status").select("*").limit(1).single(),
        ]);

        if (stopsError) throw stopsError;
        if (schedulesError) throw schedulesError;
        if (announcementsError) throw announcementsError;

        setStops(stopsData || []);
        setSchedules(schedulesData || []);
        setAnnouncements(announcementsData || []);

        // Set operational status dengan fallback ke default jika tidak ada data
        if (operationalStatusData) {
          setOperationalStatus({
            isOperating: operationalStatusData.is_operating ?? true,
            message: operationalStatusData.message || "Bus beroperasi normal sesuai jadwal.",
          });
        } else {
          setOperationalStatus({ isOperating: true, message: "Bus beroperasi normal sesuai jadwal." });
        }

      } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
        // Set default operational status jika error
        setOperationalStatus({ isOperating: true, message: "Bus beroperasi normal sesuai jadwal." });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
    loading,
    setStops,
    setSchedules,
    setAnnouncements,
    setOperationalStatus,
  };
}