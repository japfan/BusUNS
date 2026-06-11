"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

const defaultCenter = [-7.5606, 110.8592];

function createStopIcon({ selected, matched }) {
  const color = selected ? "#1d4ed8" : matched ? "#0284c7" : "#64748b";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border: 4px solid white;
        border-radius: 999px;
        background: ${color};
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: white;
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function createArrowIcon(angle) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        transform: rotate(${angle}deg);
      ">
        <div style="
          width: 0;
          height: 0;
          border-top: 7px solid transparent;
          border-bottom: 7px solid transparent;
          border-left: 13px solid #1d4ed8;
          filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.28));
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function RouteDirectionArrows({ positions }) {
  const map = useMap();
  const arrows = useMemo(() => {
    if (positions.length < 2) return [];

    return positions.slice(0, -1).map((position, index) => {
      const nextPosition = positions[index + 1];
      const currentPoint = map.latLngToLayerPoint(position);
      const nextPoint = map.latLngToLayerPoint(nextPosition);
      const angle =
        (Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * 180) / Math.PI;

      return {
        angle,
        id: `${position[0]}-${position[1]}-${index}`,
        position: [
          (position[0] + nextPosition[0]) / 2,
          (position[1] + nextPosition[1]) / 2,
        ],
      };
    });
  }, [map, positions]);

  return arrows.map((arrow) => (
    <Marker
      icon={createArrowIcon(arrow.angle)}
      interactive={false}
      key={arrow.id}
      position={arrow.position}
      zIndexOffset={300}
    />
  ));
}

// Fit ke seluruh rute hanya sekali saat pertama load
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

// Zoom in ke halte yang dipilih, tanpa zoom out
function FlyToSelected({ stop }) {
  const map = useMap();

  useEffect(() => {
    if (!stop) return;
    const currentZoom = map.getZoom();
    const targetZoom = Math.max(currentZoom, 18); // zoom in, tidak pernah zoom out
    map.flyTo([stop.lat, stop.lng], targetZoom, { duration: 0.8 });
  }, [map, stop]);

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

  const routePositions = mappedStops.map((stop) => [stop.lat, stop.lng]);
  const routeRequestKey = mappedStops
    .map((stop) => `${stop.id}:${stop.lat.toFixed(6)},${stop.lng.toFixed(6)}`)
    .join("|");
  const [routedPositions, setRoutedPositions] = useState([]);
  const [routeSource, setRouteSource] = useState("fallback");
  const displayRoutePositions = routedPositions.length >= 2 ? routedPositions : routePositions;
  const center = routePositions[0] ?? defaultCenter;
  const routeBounds = useMemo(() => {
    if (displayRoutePositions.length < 2) return null;
    return L.latLngBounds(displayRoutePositions).pad(0.65);
  }, [displayRoutePositions]);

  const selectedStop = mappedStops.find((stop) => stop.id === selectedStopId) ?? null;

  useEffect(() => {
    if (mappedStops.length < 2) {
      setRoutedPositions([]);
      setRouteSource("fallback");
      return;
    }

    const cacheKey = `busuns-route:${routeRequestKey}`;
    const cachedRoute = window.sessionStorage.getItem(cacheKey);
    if (cachedRoute) {
      try {
        const parsed = JSON.parse(cachedRoute);
        if (parsed.source === "openrouteservice" && parsed.positions?.length >= 2) {
          setRoutedPositions(parsed.positions);
          setRouteSource(parsed.source);
          return;
        }
        window.sessionStorage.removeItem(cacheKey);
      } catch {
        window.sessionStorage.removeItem(cacheKey);
      }
    }

    const controller = new AbortController();

    async function loadRoute() {
      try {
        const response = await fetch("/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            coordinates: mappedStops.map((stop) => [stop.lng, stop.lat]),
          }),
        });

        if (!response.ok) throw new Error("Gagal memuat rute.");

        const data = await response.json();
        setRoutedPositions(data.positions ?? []);
        setRouteSource(data.source ?? "fallback");
        if (data.source === "openrouteservice" && data.positions?.length >= 2) {
          window.sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              positions: data.positions,
              source: data.source,
            }),
          );
        } else {
          window.sessionStorage.removeItem(cacheKey);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setRoutedPositions([]);
          setRouteSource("fallback");
        }
      }
    }

    loadRoute();

    return () => controller.abort();
  }, [mappedStops, routeRequestKey]);

  return (
    <section className="relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70" id="peta">
      <div className="absolute left-5 top-5 z-[500] rounded-full border border-blue-100 bg-white/95 px-4 py-2 text-sm font-black text-blue-800 shadow-sm">
        {routeSource === "openrouteservice" ? "Rute BusUNS mengikuti jalan" : "Rute Utama BusUNS"}
      </div>
      <MapContainer
        center={center}
        maxBounds={routeBounds ?? undefined}
        maxBoundsViscosity={0.9}
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
          positions={displayRoutePositions}
          pathOptions={{ color: "#bfdbfe", weight: 12, opacity: 0.35 }}
        />
        <Polyline
          positions={displayRoutePositions}
          pathOptions={{ color: "#1d4ed8", weight: 6, opacity: 0.82 }}
        />
        <RouteDirectionArrows positions={displayRoutePositions} />
        {mappedStops.map((stop) => {
          const selected = selectedStopId === stop.id;
          const matched = matchedIds.has(stop.id);

          return (
            <Marker
              eventHandlers={{ click: () => onSelectStop(stop.id) }}
              icon={createStopIcon({ selected, matched })}
              key={stop.id}
              opacity={matched ? 1 : 0.45}
              position={[stop.lat, stop.lng]}
            >
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.area}
              </Popup>
            </Marker>
          );
        })}
        <FitRouteBounds positions={displayRoutePositions} />
        <FlyToSelected stop={selectedStop} />
      </MapContainer>
    </section>
  );
}
