"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { busUnsRouteLine } from "@/data/routeLine";

const defaultCenter = [-7.5606, 110.8592];

function createStopIcon({ selected, matched }) {
  const color = selected ? "#eab308" : matched ? "#0284c7" : "#64748b";
  const size = selected ? "40px" : "34px";
  const innerSize = selected ? "12px" : "10px";

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
            background: #eab308;
            opacity: 0.4;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <style>
            @keyframes ping {
              75%, 100% { transform: scale(1.8); opacity: 0; }
            }
          </style>
        ` : ""}
        <div style="
          position: relative;
          width: ${size};
          height: ${size};
          display: grid;
          place-items: center;
          border: 4px solid white;
          border-radius: 999px;
          background: ${color};
          box-shadow: ${selected ? "0 12px 28px rgba(234, 179, 8, 0.4)" : "0 10px 24px rgba(15, 23, 42, 0.22)"};
          z-index: 10;
          transition: all 0.3s ease;
        ">
          <div style="
            width: ${innerSize};
            height: ${innerSize};
            border-radius: 999px;
            background: white;
          "></div>
        </div>
      </div>
    `,
    iconSize: selected ? [40, 40] : [34, 34],
    iconAnchor: selected ? [20, 20] : [17, 17],
    popupAnchor: [0, -20],
  });
}

function createArrowIcon(angle) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        transform: rotate(${angle}deg);
      ">
        <div style="
          width: 0;
          height: 0;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 10px solid #f59e0b;
          filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.28));
        "></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function distanceInMeters(start, end) {
  return L.latLng(start).distanceTo(L.latLng(end));
}

function RouteDirectionArrows({ positions, stopPositions }) {
  const map = useMap();
  const arrows = useMemo(() => {
    const validPositions = positions.filter(p => p && p[0] && p[1]);
    if (validPositions.length < 2) return [];

    const sampled = [];
    
    // ATUR JARAK ANTAR PANAH DI SINI (Misal: Tiap 60 meter jalan, munculkan 1 panah)
    const arrowIntervalMeters = 60; 
    const minDistanceFromStop = 35; // Jarak aman dari halte agar tidak bertumpuk

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
      icon={createArrowIcon(arrow.angle)}
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

function MapScrollHandler() {
  useMapEvents({
    click: () => {
      const searchSection = document.getElementById("pencarian-dan-peta");
      if (searchSection) {
        // Meluncur mulus tepat ke elemen search bar
        searchSection.scrollIntoView({
          behavior: "smooth",
          block: "start", // Membuat bagian atas search bar pas di atas layar
        });
      }
    },
  });
  return null;
}

export default function RealLeafletMap({ stops, selectedStopId, matchingStopIds, onSelectStop }) {
  const matchedIds = matchingStopIds ?? new Set();

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

  return (
    <section className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <MapContainer
        center={center}
        // BATASAN MAXBOUNDS TELAH DIHAPUS TOTAL AGAR BEBAS DIGESER
        maxZoom={19}
        minZoom={14}
        scrollWheelZoom
        zoom={15}
        className="relative z-0 h-[540px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#bfdbfe", weight: 12, opacity: 0.35 }}
        />
        <Polyline
          positions={routePositions}
          pathOptions={{ color: "#1d4ed8", weight: 6, opacity: 0.82 }}
        />
        <RouteDirectionArrows positions={routePositions} stopPositions={stopPositions} />
        
        {mappedStops.map((stop) => {
          const selected = selectedStopId === stop.id;
          const matched = matchedIds.has(stop.id);

          return (
            <Marker
              eventHandlers={{ click: () => onSelectStop(stop.id) }}
              icon={createStopIcon({ selected, matched })}
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