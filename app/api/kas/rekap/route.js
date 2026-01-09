import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const NOMINAL_KAS = 5000;
        const [pemasukanRow] = await db.query(`
            SELECT 
                SUM(minggu_ke_1 + minggu_ke_2 + minggu_ke_3 + minggu_ke_4) as total_centang 
            FROM kas_kelas
        `);
        
        const totalCentang = pemasukanRow[0].total_centang || 0;
        const totalMasuk = totalCentang * NOMINAL_KAS;

        const [pengeluaranRow] = await db.query(`
            SELECT SUM(nominal) as total_keluar 
            FROM rekap_kas
            WHERE tipe = 'keluar'
        `);
        const totalKeluar = pengeluaranRow[0].total_keluar || 0;

        const [listKeluar] = await db.query(`
            SELECT * FROM rekap_kas 
            WHERE tipe = 'keluar' 
            ORDER BY tanggal DESC
        `);

        return NextResponse.json({
            summary: {
                totalMasuk,
                totalKeluar,
                saldo: totalMasuk - totalKeluar
            },
            data: listKeluar
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const { nominal, keterangan, tipe, tanggal } = await req.json();
        await db.query(
            'INSERT INTO rekap_kas (nominal, keterangan, tipe, tanggal) VALUES (?, ?, ?, ?)',
            [nominal, keterangan, tipe, tanggal]
        );
        return NextResponse.json({ message: "Berhasil ditambah" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        
        // Query untuk menghapus data berdasarkan ID
        await db.query('DELETE FROM rekap_kas WHERE id = ?', [id]);
        
        return NextResponse.json({ message: "Data berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}