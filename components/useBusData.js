"use client";

import { useEffect, useMemo, useState } from "react";
import { initialAnnouncements, initialSchedules, initialStops } from "@/data/dummyData";

const storageKey = "busuns-data-map-v1";

export function useBusData() {
  const [stops, setStops] = useState(initialStops);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setStops(parsed.stops?.length ? parsed.stops : initialStops);
      setSchedules(parsed.schedules?.length ? parsed.schedules : initialSchedules);
      setAnnouncements(
        parsed.announcements?.length ? parsed.announcements : initialAnnouncements,
      );
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ stops, schedules, announcements }),
    );
  }, [stops, schedules, announcements]);

  const stopMap = useMemo(
    () => Object.fromEntries(stops.map((stop) => [stop.id, stop])),
    [stops],
  );

  return {
    stops,
    schedules,
    announcements,
    stopMap,
    setStops,
    setSchedules,
    setAnnouncements,
  };
}
