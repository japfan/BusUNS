import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Handler untuk metode POST (Menambah data halte baru)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, location_description, stop_order, lat, lng, next_stop_id, status } = body;

    // 1. Validasi Input Dasar
    if (!name) {
      return NextResponse.json(
        { error: "Gagal memproses: Nama halte wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Generate ID unik untuk halte baru seperti logika di front-end
    const newId = "halte_" + name.toLowerCase().replaceAll(" ", "_");

    // 3. Susun Payload Data
    const payload = {
      id: newId,
      name,
      location_description: location_description || null,
      stop_order: stop_order ? Number(stop_order) : 1,
      lat: lat ? Number(lat) : -7.5606,
      lng: lng ? Number(lng) : 110.8592,
      next_stop_id: next_stop_id || null,
      status: status || "active",
    };

    // 4. Eksekusi penyimpanan ke tabel 'stops' di database
    const { data, error } = await supabase
      .from("stops")
      .insert(payload)
      .select()
      .single();

    // Jika Supabase mengembalikan error (misal: constraint violation)
    if (error) {
      return NextResponse.json(
        { error: `Database Error: ${error.message}` },
        { status: 500 }
      );
    }

    // 5. Kirim respon sukses beserta data yang berhasil disimpan
    return NextResponse.json(
      { message: "Halte berhasil dicatat ke database", data },
      { status: 201 }
    );

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server API." },
      { status: 500 }
    );
  }
}