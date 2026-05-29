"use client";

import { useEffect, useMemo, useState } from "react";
import {
  initialAnnouncements,
  initialOperationalStatus,
  initialSchedules,
  initialStops,
} from "@/data/dummyData";

const storageKey = "busuns-data-map-v4";

function normalizeStops(storedStops) {
  if (!storedStops?.length) return initialStops;

  const storedById = Object.fromEntries(storedStops.map((stop) => [stop.id, stop]));
  return initialStops.map((initialStop) => {
    const storedStop = storedById[initialStop.id] ?? {};

    return {
      ...initialStop,
      ...storedStop,
      order: Number(storedStop.order ?? initialStop.order),
      lat: Number(storedStop.lat ?? initialStop.lat),
      lng: Number(storedStop.lng ?? initialStop.lng),
    };
  });
}

export function useBusData() {
  const [stops, setStops] = useState(initialStops);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [operationalStatus, setOperationalStatus] = useState(initialOperationalStatus);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setStops(normalizeStops(parsed.stops));
      setSchedules(parsed.schedules?.length ? parsed.schedules : initialSchedules);
      setAnnouncements(
        parsed.announcements?.length ? parsed.announcements : initialAnnouncements,
      );
      setOperationalStatus(parsed.operationalStatus ?? initialOperationalStatus);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ stops, schedules, announcements, operationalStatus }),
    );
  }, [stops, schedules, announcements, operationalStatus]);

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
    setStops,
    setSchedules,
    setAnnouncements,
    setOperationalStatus,
  };
}
