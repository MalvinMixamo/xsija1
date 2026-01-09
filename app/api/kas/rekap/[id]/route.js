import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE: Hapus Transaksi
export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await db.query('DELETE FROM kas_transaksi WHERE id = ?', [id]);
        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Edit Transaksi
export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const { nominal, keterangan, tipe, tanggal } = await req.json();
        await db.query(
            'UPDATE kas_transaksi SET nominal=?, keterangan=?, tipe=?, tanggal=? WHERE id=?',
            [nominal, keterangan, tipe, tanggal, id]
        );
        return NextResponse.json({ message: "Berhasil diupdate" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}