import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(req, {params}) {
    //Ini nanti untuk mendapatkan data sebelum diedit\
    const {id} = await params
    try{
        const [datas] = await db.execute('SELECT * FROM rekap_kas WHERE id = ?', [id])
        const data = datas[0]
        return NextResponse.json(data)
    }catch(err){
        return NextResponse.json(err)
    }
}
// DELETE: Hapus Transaksi
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await db.execute('DELETE FROM rekap_kas WHERE id = ?', [id]);
        return NextResponse.json({ message: "Berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Edit Transaksi
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { nama_barang, nominal, keterangan, tipe, tanggal } = await req.json();
        await db.execute(
            'UPDATE rekap_kas SET nama_barang=?, nominal=?, keterangan=?, tipe=?, tanggal=? WHERE id=?',
            [nama_barang, nominal, keterangan, tipe, tanggal, id]
        );
        return NextResponse.json({ message: "Berhasil diupdate" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}