"use client";

import { useEffect, useMemo, useState } from "react";
import { initialAnnouncements, initialRoutes, initialSchedules } from "@/data/dummyData";

const storageKey = "busuns-data";

export function useBusData() {
  const [routes, setRoutes] = useState(initialRoutes);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setRoutes(parsed.routes?.length ? parsed.routes : initialRoutes);
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
      JSON.stringify({ routes, schedules, announcements }),
    );
  }, [routes, schedules, announcements]);

  const routeMap = useMemo(
    () => Object.fromEntries(routes.map((route) => [route.id, route])),
    [routes],
  );

  return {
    routes,
    schedules,
    announcements,
    routeMap,
    setRoutes,
    setSchedules,
    setAnnouncements,
  };
}
