'use client'
import SideNav from "../../components/sideNav"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function Home({ nama, jabatan, className, src, instagram}){
    return(
        <div className="grid gap-3 md:gap-3 grid-cols-12 transition-all mt-14 md:mt-0">
            <div className={`bg-white rounded-2xl col-span-12 lg:col-span-7 p-5 w-full min-w-0 shadow-md ${className}`}>
                <div className="flex flex-col gap-2.5">
                    <div className="pl-1 flex flex-row items-center gap-5">
                        <p className="text-gray-500 font-bold text-lg md:text-xl">Account</p>
                        <div className="flex flex-row gap-2.5 bg-[#8B80FF] text-white border-2 border-[#9e4beb] py-1 px-3 rounded-lg text-sm items-center font-bold">
                            <Image 
                                alt="jabatan"
                                src={`/${ 
                                    jabatan === "Bendahara" ? "bendahara.png" : 
                                    jabatan === "Developer" ? "developer.png" : 
                                    jabatan === "Bot Engineer" ? "bot-engineer.png" : 
                                    jabatan === "Sekretaris" ? "sekretaris.png" :
                                    "siswa1.png" 
                                }`}
                                width={28} 
                                height={20}
                                className="w-5 h-auto md:w-7"/>
                            <p className="md:text-sm text-xs">{jabatan}</p>
                        </div>    
                    </div>
                    <div className="flex flex-row justify-between items-center bg-purple-50 px-3 py-5 rounded-full">
                        <div className="flex gap-3.5 flex-row items-center"> {/* Tambahkan items-center di sini juga */}
                            <Image 
                                alt="profil"
                                src={src === "" || src === null ? "/globe.svg" : src}
                                width={50}
                                height={50}
                                unoptimized={src?.startsWith('data:')}
                                className="h-15 w-15 hrink-0 overflow-hidden rounded-full object-cover border border-gray-200" 
                            />
                            {/* TAMBAHKAN justify-center DI SINI */}
                            <div className="flex flex-col justify-center min-w-0">
                                <p className="font-medium text-sm md:text-lg text-gray-600 leading-tight">{nama}</p>
                                <Link 
                                    target="_blank" 
                                    className="truncate max-w-48 md:max-w-full min-w-0 block text-[#6f5ffd] text-xs md:text-base leading-tight" 
                                    href={instagram}
                                >
                                    {instagram}
                                </Link>
                            </div>
                        </div>
                        <button className="rounded-full shrink-0 bg-white border-background border-2 w-12 h-12">
                            {/* Button kosongan */}
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-[#8B88FF] rounded-2xl col-span-12 lg:col-span-5 p-5 w-full min-w-o shadow-md">
                
            </div>
        </div>
    )
    
}
export default function HomePage() {
    const params = useParams()
    const uuid = params.uuid
    const router =  useRouter()
    const [dataSiswa, setDataSiswa] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (uuid) {
            fetch(`../../api/siswa/${uuid}`)
                .then((res) => {
                    if (!res.ok) {
                        router.push('/login');
                        return;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) setDataSiswa(data);
                    setLoading(false)
                })
                .catch((err) => console.log(err));
        }
    }, [uuid, router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Memuat data...</div>;
    }

    if (!dataSiswa) {
        return <div className="flex h-screen items-center justify-center">Data tidak ditemukan bray.</div>;
    }

    return(
        <div className="flex flex-col md:flex-row gap-2.5 h-screen">
            <SideNav active="home"/>
            <div className="flex flex-col w-screen mt-0 md:mt-10 px-2 md:px-5 overflow-y-scroll">
                <Home 
                    nama={dataSiswa.nama}
                    jabatan={dataSiswa.jabatan}
                    className="text-black "
                    src={dataSiswa.picture}
                    instagram={dataSiswa.instagram == null ? "" : `${dataSiswa.instagram}`}/>
            </div>

        </div>
    )
}