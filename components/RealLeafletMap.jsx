"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { busUnsRouteLine } from "@/data/routeLine";

const defaultCenter = [-7.5606, 110.8592];

// Detect system dark mode preference
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDark;
}

function createStopIcon({ selected, matched, isDark }) {
  const accentColor = isDark ? "#22d3ee" : "#0ea5e9";
  const matchColor = isDark ? "#38bdf8" : "#0284c7";
  const mutedColor = isDark ? "#475569" : "#94a3b8";

  const color = selected ? accentColor : matched ? matchColor : mutedColor;
  const size = selected ? "40px" : "34px";
  const innerSize = selected ? "12px" : "10px";
  const glowColor = selected
    ? (isDark ? "rgba(34, 211, 238, 0.45)" : "rgba(14, 165, 233, 0.35)")
    : "rgba(15, 23, 42, 0.22)";

  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: ${size}; height: ${size}; display: grid; place-items: center;">
        ${selected ? `
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 999px;
            background: ${accentColor};
            opacity: 0.35;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <style>
            @keyframes ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          </style>
        ` : ""}
        <div style="
          position: relative;
          width: ${size};
          height: ${size};
          display: grid;
          place-items: center;
          border: 3px solid ${isDark ? "rgba(15, 23, 42, 0.8)" : "white"};
          border-radius: 999px;
          background: ${color};
          box-shadow: 0 0 ${selected ? "20px" : "12px"} ${glowColor};
          z-index: 10;
          transition: all 0.3s ease;
        ">
          <div style="
            width: ${innerSize};
            height: ${innerSize};
            border-radius: 999px;
            background: ${isDark ? "#0f172a" : "white"};
          "></div>
        </div>
      </div>
    `,
    iconSize: selected ? [40, 40] : [34, 34],
    iconAnchor: selected ? [20, 20] : [17, 17],
    popupAnchor: [0, -20],
  });
}

function createArrowIcon(angle, isDark) {
  const bgColor = isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.92)";
  const arrowColor = isDark ? "#22d3ee" : "#0369a1";
  const shadowColor = isDark ? "rgba(34, 211, 238, 0.5)" : "rgba(14, 165, 233, 0.4)";
  const borderColor = isDark ? "rgba(34, 211, 238, 0.4)" : "rgba(14, 165, 233, 0.35)";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        display: grid;
        place-items: center;
        transform: rotate(${angle}deg);
        background: ${bgColor};
        border: 1.5px solid ${borderColor};
        border-radius: 999px;
        box-shadow: 0 1px 4px ${shadowColor};
      ">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="${arrowColor}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function distanceInMeters(start, end) {
  return L.latLng(start).distanceTo(L.latLng(end));
}

function RouteDirectionArrows({ positions, stopPositions, isDark }) {
  const map = useMap();
  const arrows = useMemo(() => {
    const validPositions = positions.filter(p => p && p[0] && p[1]);
    if (validPositions.length < 2) return [];

    const sampled = [];
    
    // ATUR JARAK ANTAR PANAH DI SINI
    const arrowIntervalMeters = 120; 
    const minDistanceFromStop = 55; // Jarak aman dari halte agar tidak bertumpuk

    let accumulatedDistance = 0;

    for (let i = 0; i < validPositions.length - 1; i++) {
      const currentLoc = validPositions[i];
      const nextLoc = validPositions[i + 1];
      
      // Hitung jarak segmen saat ini dalam meter
      const segmentLength = distanceInMeters(currentLoc, nextLoc);
      accumulatedDistance += segmentLength;

      // Jika akumulasi jarak sudah melewati batas interval, taruh panah di sini
      if (accumulatedDistance >= arrowIntervalMeters) {
        const midpoint = [
          (currentLoc[0] + nextLoc[0]) / 2,
          (currentLoc[1] + nextLoc[1]) / 2,
        ];

        // Validasi jarak terhadap halte terdekat
        const nearStop = stopPositions.some(
          (stopLoc) => distanceInMeters(midpoint, stopLoc) < minDistanceFromStop,
        );

        if (!nearStop) {
          const currentPoint = map.latLngToContainerPoint(currentLoc);
          const nextPoint = map.latLngToContainerPoint(nextLoc);
          
          const angle = (Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * 180) / Math.PI;

          sampled.push({
            angle,
            id: `arrow-fixed-${i}-${midpoint[0]}-${midpoint[1]}`,
            position: midpoint,
          });
        }

        // Reset hitungan akumulasi untuk mencari interval berikutnya
        accumulatedDistance = 0;
      }
    }

    return sampled;
  }, [map, positions, stopPositions]);

  return arrows.map((arrow) => (
    <Marker
      icon={createArrowIcon(arrow.angle, isDark)}
      interactive={false}
      key={arrow.id}
      position={arrow.position}
      zIndexOffset={50}
    />
  ));
}

function FitRouteBounds({ positions }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || positions.length < 2) return;
    map.fitBounds(positions, { padding: [36, 36], maxZoom: 16 });
    fitted.current = true;
  }, [map, positions]);

  return null;
}

function FlyToSelected({ stopId, stops }) {
  const map = useMap();
  const lastValidStopId = useRef("");

  useEffect(() => {
    if (!stopId) {
      lastValidStopId.current = "";
      return;
    }

    const currentStop = stops.find((s) => s.id === stopId);
    if (!currentStop || !currentStop.lat || !currentStop.lng) return;

    lastValidStopId.current = stopId;
    
    // Level zoom sudah pas sesuai keinginanmu
    const zoomTarget = 18; 

    // KUNCI PERBAIKAN: Gunakan koordinat asli tanpa dikurangi/ditambah offset
    // Ini akan membuat posisi halte tepat berada di titik pusat (tengah) peta
    const targetLatLng = [currentStop.lat, currentStop.lng];

    // 1. Set zoom level secara instan jika belum sesuai
    if (map.getZoom() !== zoomTarget) {
      map.setView(targetLatLng, zoomTarget, { animate: false });
    }

    // 2. Geser datar perlahan ke titik tengah murni
    map.panTo(targetLatLng, {
      animate: true,
      duration: 2.2,
      easeLinearity: 0.25
    });

  }, [map, stopId, stops]);

  return null;
}

export default function RealLeafletMap({ stops, selectedStopId, matchingStopIds, onSelectStop }) {
  const matchedIds = matchingStopIds ?? new Set();
  const isDark = useIsDarkMode();

  const mappedStops = useMemo(
    () =>
      stops
        .map((stop) => ({
          ...stop,
          lat: Number(stop.lat),
          lng: Number(stop.lng),
        }))
        .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng)),
    [stops],
  );

  const fallbackRoutePositions = mappedStops.map((stop) => [stop.lat, stop.lng]);
  const stopPositions = fallbackRoutePositions;
  const manualRoutePositions = busUnsRouteLine
    .map(([lng, lat]) => [Number(lat), Number(lng)])
    .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
  const routePositions = manualRoutePositions.length >= 2 ? manualRoutePositions : fallbackRoutePositions;
  const center = fallbackRoutePositions[0] ?? routePositions[0] ?? defaultCenter;

  // Tile URLs for light and dark mode
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Route colors
  const routeOuterColor = isDark ? "rgba(34, 211, 238, 0.15)" : "rgba(14, 165, 233, 0.2)";
  const routeInnerColor = isDark ? "#22d3ee" : "#0ea5e9";

  return (
    <section
      className="relative z-0 overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--border-default)",
        boxShadow: "var(--card-shadow), var(--card-shadow-glow)",
      }}
    >
      <MapContainer
        center={center}
        maxZoom={19}
        minZoom={15}
        maxBounds={[
          [-7.590, 110.830],   /* SW — batas bawah-kiri */
          [-7.535, 110.890],   /* NE — batas atas-kanan */
        ]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        zoom={15}
        className="relative z-0 h-[540px] w-full"
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
          key={tileUrl} // Force re-render when tile URL changes
        />
        <Polyline
          positions={routePositions}
          pathOptions={{ color: routeOuterColor, weight: 14, opacity: 0.5 }}
        />
        <Polyline
          positions={routePositions}
          pathOptions={{ color: routeInnerColor, weight: 5, opacity: 0.9 }}
        />
        <RouteDirectionArrows positions={routePositions} stopPositions={stopPositions} isDark={isDark} />
        
        {mappedStops.map((stop) => {
          const selected = selectedStopId === stop.id;
          const matched = matchedIds.has(stop.id);

          return (
            <Marker
              eventHandlers={{ click: () => onSelectStop(stop.id) }}
              icon={createStopIcon({ selected, matched, isDark })}
              key={stop.id}
              opacity={selected || matched ? 1 : 0.45}
              position={[stop.lat, stop.lng]}
              zIndexOffset={selected ? 1000 : 0}
            >
              <Popup autoPan={false}>
                <strong>{stop.name}</strong>
                <br />
                {stop.area}
              </Popup>
            </Marker>
          );
        })}
        <FitRouteBounds positions={routePositions} />
        <FlyToSelected stopId={selectedStopId} stops={mappedStops} />
      </MapContainer>
    </section>
  );
}