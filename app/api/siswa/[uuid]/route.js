// app/api/siswa/[uuid]/route.js
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs'
import path from 'path'

export async function GET(request, { params }) {
    const { uuid } = await params;
    
    const [rows] = await db.execute('SELECT * FROM siswa WHERE uuid = ?', [uuid]);

    if (rows.length === 0) {
        return Response.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    const siswa = rows[0];

    // Cek apakah ada data di kolom picture dan apakah itu sebuah Buffer (tipe BLOB)
    if (siswa.picture && Buffer.isBuffer(siswa.picture)) {
        const base64Image = siswa.picture.toString('base64');
        // Kita asumsikan png, atau sesuaikan dengan kebutuhan
        siswa.picture = `data:image/png;base64,${base64Image}`;
    }

    return Response.json(siswa);
}

export async function PUT(request, {params}) {
    const { uuid } = await params;
    const { absen, nama, password, nis, jabatan, instagram, picture } = await request.json();

    let fileName = picture; // Default jika bukan upload baru

    // Cek apakah picture adalah string Base64 baru
    if (picture && picture.startsWith('data:image')) {
        const base64Data = picture.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Buat nama file unik
        fileName = `profil-${uuid}-${Date.now()}.png`;
        const filePath = path.join(process.cwd(), 'public/uploads', fileName);

        // Tulis file ke folder public/uploads
        fs.writeFileSync(filePath, buffer);
    }

    try {
        await db.execute(`UPDATE siswa SET
            id_siswa = ?, nama = ?, password = ?, nisn = ?, 
            jabatan = ?, instagram = ?, picture = ? 
            WHERE uuid = ?`, 
        [
            absen ?? null, nama ?? null, password ?? null, nis ?? null,
            jabatan ?? null, instagram ?? null, 
            fileName, // Simpan NAMA FILE-nya saja, bukan string panjangnya
            uuid
        ]);
        return NextResponse.json({message:"berhasil dirubah"}, {status:200});
    } catch(err) {
        return NextResponse.json(err, {status: 500});
    }
}