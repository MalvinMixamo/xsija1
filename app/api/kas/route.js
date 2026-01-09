import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Ambil data default saat halaman pertama kali dibuka
export async function GET() {
    try {
        // Default ke Januari 2026
        const [rows] = await db.query(
            'SELECT * FROM kas_kelas WHERE bulan = ? AND tahun = ?', 
            ['Januari', 2026]
        );
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Untuk filter berdasarkan klik tombol
export async function POST(request){
    try{
        const { bulan, tahun } = await request.json();
        const [rows] = await db.query(
            'SELECT * FROM kas_kelas WHERE bulan = ? AND tahun = ?', 
            [bulan, tahun]
        );
        return NextResponse.json(rows);
    }catch(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}