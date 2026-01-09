// app/api/siswa/[uuid]/route.js
import { db } from '@/lib/db';

export async function GET(request, { params }) {
    const { uuid } = await params;
    
    const [rows] = await db.query('SELECT * FROM siswa WHERE uuid = ?', [uuid]);

    if (rows.length > 0){
        const siswa = rows[0]
        if (siswa.picture) {
        // Konversi Buffer dari BLOB ke Base64 string
        const base64Image = Buffer.from(siswa.picture).toString('base64');
        
        // Gabungkan dengan prefix data URL agar browser tahu itu gambar (misal format png/jpg)
        siswa.picture = `data:image/png;base64,${base64Image}`;
    }
    }
    
    if (rows.length === 0) {
        return Response.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    return Response.json(rows[0]);
}