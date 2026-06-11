import { NextResponse } from "next/server";

const orsApiKey = process.env.OPENROUTESERVICE_API_KEY || process.env.ORS_API_KEY;

function fallbackPositions(coordinates) {
  return coordinates.map(([lng, lat]) => [lat, lng]);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const coordinates = body.coordinates ?? [];

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return NextResponse.json(
        { error: "Minimal dua titik koordinat diperlukan untuk membuat rute." },
        { status: 400 },
      );
    }

    const validCoordinates = coordinates.every(
      (coordinate) =>
        Array.isArray(coordinate) &&
        coordinate.length === 2 &&
        Number.isFinite(Number(coordinate[0])) &&
        Number.isFinite(Number(coordinate[1])),
    );

    if (!validCoordinates) {
      return NextResponse.json(
        { error: "Format koordinat tidak valid. Gunakan [lng, lat]." },
        { status: 400 },
      );
    }

    if (!orsApiKey) {
      return NextResponse.json({
        positions: fallbackPositions(coordinates),
        source: "fallback",
        message: "OPENROUTESERVICE_API_KEY belum tersedia, memakai garis antar halte.",
      });
    }

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Accept: "application/json, application/geo+json",
          Authorization: orsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
          preference: "recommended",
        }),
      },
    );

    if (!response.ok) {
      const message = await response.text();
      return NextResponse.json({
        positions: fallbackPositions(coordinates),
        source: "fallback",
        message: `OpenRouteService gagal: ${message}`,
      });
    }

    const data = await response.json();
    const routeCoordinates = data.features?.[0]?.geometry?.coordinates ?? [];
    const positions = routeCoordinates.map(([lng, lat]) => [lat, lng]);

    if (positions.length < 2) {
      return NextResponse.json({
        positions: fallbackPositions(coordinates),
        source: "fallback",
        message: "OpenRouteService tidak mengembalikan geometry rute.",
      });
    }

    return NextResponse.json({
      positions,
      source: "openrouteservice",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat rute." },
      { status: 500 },
    );
  }
}
