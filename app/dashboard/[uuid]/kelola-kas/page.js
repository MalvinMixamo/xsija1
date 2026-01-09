'use client'
import SideNav from "@/app/components/sideNav"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function Home({ nama, jabatan, className, src, instagram}){
    //Semua Variabel Disini Bray
    const[dataKas, setDataKas] = useState([])
    const[loading, setLoading] = useState(null)
    const buttonBulan = useRef(null)
    const [tahunAktif, setTahunAktif] = useState(2026)
    const [buttonAktif, setButtonAktif] = useState(null)
    const [role, setRole] = useState('')
    const [rekap, setRekap] = useState({ data: [], summary: { totalMasuk: 0, totalKeluar: 0, saldo: 0 } });
    const bulans = [
        {
            id: 1,
            bulan: "Januari"
        },
        {
            id: 2,
            bulan: "Februari"
        },
        {
            id: 3,
            bulan:"Maret"
        },
        {
            id: 4,
            bulan:"April"
        },
        {
            id: 5,
            bulan:"Mei"
        },
        {
            id: 6,
            bulan:"Juni"
        },
        {
            id: 7,
            bulan:"Juli"
        },
        {
            id: 8,
            bulan:"Agustus"
        },
        {
            id: 9,
            bulan:"September"
        },
        {
            id: 10,
            bulan:"Oktober"
        },
        {
            id: 11,
            bulan:"November"
        },
        {
            id: 12,
            bulan:"Desember"
        }
    ]

    //ini ke /api/kas bray
    const fetchData = async (bulanAktif) => {
        const namaBulan = bulanAktif || bulans.find(b => b.id === buttonAktif)?.bulan || "Januari";
        
        try {
            const res = await fetch('/api/kas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    bulan: namaBulan, 
                    tahun: tahunAktif
                })
            });
            const data = await res.json();
            setDataKas(data);
        } catch (err) {
            console.log("Gagal ambil db:", err);
        }
    };
    
    //ini ngefetch saat direload bray
    useEffect(() => {
        handleBulan(1, "Januari");
    }, []);
    
    //Ini untuk handle klik bulan sama tahunnya bray
    const handleBulan = async (idBulan, namaBulan) => {
        setButtonAktif(idBulan);
        const controller = new AbortController();
        try {
            const response = await fetch('/api/kas', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bulan: namaBulan, tahun: tahunAktif }),
                signal: controller.signal
            });

            const result = await response.json();

            if (response.ok) {
                setDataKas(result);
            } else {
                console.error("Gagal filter bulan:", result.message);
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
        }
    }
    console.log(buttonAktif)
    
    //ini ambil role dari cookie bray
    useEffect(() => {
        const getCookie = (name) => {
            if (typeof document !== "undefined") {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }
            return null;
        };

        const userRole = getCookie('role');
        console.log("Role di SideNav:", userRole);
        setRole(userRole);
    }, []);

    //ini ngefetch ke api rekap bray
    const fetchDataTotalKas = async () => {
        try{
            const res = await fetch('/api/kas/rekap', {
                method:'GET',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify()
            })
            const data = await res.json()
            setRekap(data)
        }catch(err){
            console.log('gagal breayy', err)
        }
    }
    useEffect(() => {fetchDataTotalKas()}, [])

    //ini ngefetch api untuk update kelola kas bray
    const handleStatusChange = async (id, minggu, newStatus) => {
        const res = await fetch('/api/kas/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, minggu, status: parseInt(newStatus) })
        });

        if (res.ok) {
            const bulanAktifSekarang = bulans.find(b => b.id === buttonAktif)?.bulan || "Januari";
            
            await fetchData(bulanAktifSekarang); 
            await fetchDataTotalKas();
        }
    };
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
                                    jabatan === "Bot Engineer" ? "bot.png" : 
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
            {(role?.toLowerCase() === 'bendahara' || role?.toLowerCase() === 'developer') && (
                <div className={`bg-[url(/background-kas.png)] bg-size-[100%_100%] bg-no-repeat rounded-2xl col-span-12 lg:col-span-5 p-5 w-full shadow-md ${className}`}>
                    <div className="flex gap-2 justify-between items-center select-none">
                        <div>
                            <Image 
                                alt="logo"
                                src="/vercel.svg"
                                width={80}
                                height={80}
                                className="w-16 h-auto md:w-20"/>
                        </div>
                        <div className="flex-1 text-white">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm md:text-lg font-bold">Total Kas</span>
                                </div>
                                <button className="flex w-7 h-7 items-center justify-center rounded-full hover:bg-white hover:text-green"></button>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-lg md:text-xl">Rp</p>
                                <p className="text-xl font-bold md:text-2xl">{rekap.summary.saldo.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col rounded-md overflow-hidden">
                        <span className="bgc-clip bg-clip inline-block font-bold text-xs md:text-sm text-gray max-w-max pt-1 pr-6 pl-2">Pay Link</span>
                        <p className="bg-white px-2 py-1 flex justify-between items-center text-sm md:text-lg rounded-tr-lg gap-2">RORRRR</p>
                    </div>
                </div>
            )}{(role?.toLowerCase() === 'bendahara' || role?.toLowerCase() === 'developer') && (
                <div className={`bg-white col-span-12 rounded-tl-2xl rounded-tr-2xl px-3 py-2 w-full min-w-0 shadow-md h- overflow-y-scroll ${className}`}>
                <div className="flex items-center gap-3 mb-4 px-1">
                <p className="text-sm font-bold text-gray-500">Pilih Tahun:</p>
                <select 
                    value={tahunAktif}
                    onChange={(e) => {
                        const newYear = parseInt(e.target.value);
                        setTahunAktif(newYear);
                        const namaBulanSekarang = bulans.find(b => b.id === buttonAktif)?.bulan || "Januari";
                        handleBulan(buttonAktif, namaBulanSekarang);
                    }}
                    className="border-2 border-[#8B80FF] rounded-lg px-3 py-1 text-sm font-bold text-[#8B80FF] outline-none"
                >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                </select>
            </div>
                <div className="flex overflow-x-auto gap-2 py-2" ref={buttonBulan}>
                    {bulans.map((b) =>{
                        const aktif = buttonAktif === b.id
                        return(
                        <button 
                            className={`w-40 whitespace-nowrap rounded-full hover:cursor-pointer hover:bg-[#8B80FF] hover:text-white border-2 px-4 py-1 text-xs md:text-sm transition ${aktif ? "bg-[#8B80FF] text-white" : "bg-white text-[#8B80FF] border-[#8B80FF]"}`} 
                            key ={b.id} 
                            onClick={() => handleBulan(b.id, b.bulan)}>
                                {b.bulan}
                        </button>
                    )})}
                </div>
                <div className="w-full overflow-scroll md:overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 w-4xl md:w-full items-center text-xs md:text-sm px-5 py-2 bg-[#cdc8ff]  border-2 mt-5 border-[#d6bbcf]">
                        <p className="col-span-1">Absen</p>
                        <p className="col-span-3">Nama</p>
                        <p className="col-span-1 text-center font-medium text-[#433d47]">Minggu 1</p>
                        <p className="col-span-1 text-center font-medium text-[#433d47]">Minggu 2</p>
                        <p className="col-span-1 text-center font-medium text-[#433d47]">Minggu 3</p>
                        <p className="col-span-1 text-center font-medium text-[#39343d]">Minggu 4</p>
                        <p className="col-span-4 text-center font-medium text-[#433d47]">Ketereangan</p>
                    </div>
                    {dataKas.map((item) => (
                        <div key={item.id} className={`grid grid-cols-12 gap-4 w-4xl lg:w-full text-xs md:text-sm items-center px-5 py-2 border-b-2 border-l-2 border-r-2 border-[#d6bbcf]`}>
                            <p className="col-span-1">{item.id_siswa}</p>
                            <p className="col-span-3">{item.nama}</p>
                            <p className="col-span-1 text-center font-bold text-white bg-[#8B60FF] px-2 py-1 rounded-full">
                                <select 
                                    value={item.minggu_ke_1 ? "1" : "0"}
                                    onChange={(e) => handleStatusChange(item.id, 1, e.target.value)}
                                    className={`text-center cursor-pointer appearance-none outline-none transition-all bg-none
                                        ${item.minggu_ke_1 
                                            ? " text-white" 
                                            : ""
                                        }`}
                                >
                                    <option value="1">Lunas</option>
                                    <option value="0">X</option>
                                </select>
                            </p>
                            <p className="col-span-1 text-center font-bold text-white bg-[#8B60FF] px-2 py-1 rounded-full">
                                <select 
                                    value={item.minggu_ke_2 ? "1" : "0"}
                                    onChange={(e) => handleStatusChange(item.id, 2, e.target.value)}
                                    className={`text-center cursor-pointer appearance-none outline-none transition-all bg-none
                                        ${item.minggu_ke_2 
                                            ? " text-white" 
                                            : ""
                                        }`}
                                >
                                    <option value="1">Lunas</option>
                                    <option value="0">X</option>
                                </select>
                            </p>
                            <p className="col-span-1 text-center font-bold text-white bg-[#8B60FF] px-2 py-1 rounded-full">
                                <select 
                                    value={item.minggu_ke_3 ? "1" : "0"}
                                    onChange={(e) => handleStatusChange(item.id, 3, e.target.value)}
                                    className={`text-center cursor-pointer appearance-none outline-none transition-all bg-none
                                        ${item.minggu_ke_3 
                                            ? " text-white" 
                                            : ""
                                        }`}
                                >
                                    <option value="1">Lunas</option>
                                    <option value="0">X</option>
                                </select>
                            </p>
                            <p className="col-span-1 text-center font-bold text-white bg-[#8B60FF] px-2 py-1 rounded-full">
                                <select 
                                    value={item.minggu_ke_4 ? "1" : "0"}
                                    onChange={(e) => handleStatusChange(item.id, 4, e.target.value)}
                                    className={`text-center cursor-pointer appearance-none outline-none transition-all bg-none
                                        ${item.minggu_ke_4 
                                            ? " text-white" 
                                            : ""
                                        }`}
                                >
                                    <option value="1">Lunas</option>
                                    <option value="0">X</option>
                                </select>
                            </p>
                            <p className="col-span-4 text-center font-bold text-white bg-[#8B60FF] px-2 py-1 rounded-full">{item.minggu_ke_1 === 1 && item.minggu_ke_2 === 1 && item.minggu_ke_3 === 1 && item.minggu_ke_4 === 1 ? "Lunas Semua" : "Belum Lunas"}</p>
                        </div>
                    ))}
                </div>
            </div>
            )}
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
            <SideNav active="kelola-kas"/>
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