import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        const { id, minggu, status } = await req.json()
        const columnName = `minggu_ke_${minggu}`

        await db.query(
            `UPDATE kas_kelas SET ${columnName} = ? WHERE id = ?`, 
            [status, id]
        )
        return NextResponse.json({ message: "berhasil diupdate bray"})
    }catch(err){ 
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}