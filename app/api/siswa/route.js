import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { nisn, password } = await request.json();
        const [rows] = await db.execute(
            'SELECT nama, picture, uuid, jabatan FROM siswa WHERE nisn = ? AND password = ?', 
            [nisn, password]
        );

        if (rows.length === 0) {
            return NextResponse.json({ message: "Gagal bray!" }, { status: 401 });
        }

        const user = rows[0];

        const response = NextResponse.json({
            message: "Login Berhasil",
            user: { nama: user.nama, uuid: user.uuid }
        });

        response.cookies.set('token', user.uuid, {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24,
        });

        response.cookies.set('role', user.jabatan, {
            path: '/',
            httpOnly: false,
            secure: false,
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function GET() {
    try{
        const [data] = await db.execute('SELECT id_siswa, nama, picture, instagram FROM siswa')

        if(data.length === 0){
            return NextResponse.json({message: 'ada yang salah sama querynya bray(function GET api/siswa'}, {status: 500})
        }
        return NextResponse.json(data)
    }catch(err){
        return NextResponse.json({message: 'gagal mendapatkan database', err}, {status: 501})
    }
}