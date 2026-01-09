'use client'
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SideNav({active}) {
    function Tab({ src, isi, id, href, className }) {
        const isActive = active === id
        return (
            <a
                href={href}
                className={`${isActive ? "bg-linear-to-r from-white to-violet-100 shadow-[0_8px_16px_0_rgba(234,247,242,0.32)]" : ""} flex flex-row items-center gap-2.5 p-2.5 cursor-pointer text-white hover:bg-white/10 rounded-md `}
            >
                <Image alt="logo" src={src} width={20} height={20} className={`h-auto w-5 ${active === id ? "brightness-0": "brightness-100"}`} />
                <p className={`font-bold text-sm ${isActive ? "text-black" : "text-white"} `}>{isi}</p>
            </a>
        )
    }
    const params = useParams()
    const uuid = params.uuid
    const [open, setOpen] = useState(false)
    const [role, setRole] = useState('')
    
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
    return (
        <>
            {/* HAMBURGER BUTTON */}
            <div className={`w-full bg-[#DDD9FF] ${ open ? "h-0" : "h-14"} z-50 md:hidden flex items-center fixed transition-all ease-in-out`}>
                <button
                    className="sm:hidden fixed top-4 left-4 z-50 p-2 backdrop-blur-md rounded-md"
                    onClick={() => setOpen(!open)}
                >
                    {/* ikon hamburger */}
                    <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                    <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
                    <div className="w-6 h-0.5 bg-gray-600"></div>
                </button>
                <Image 
                    alt="logo"
                    src={"/logo.png"}
                    width={30}
                    height={30}
                    className={`fixed top-4 left-16 brightness-25 ${ open ? "hidden" : 'block'}`}/>
            </div>

            {/* SIDEBAR */}
            <aside
                className={`z-10
                    fixed top-0 left-0 h-screen px-2.5 py-2.5 gap-2.5 w-full md:w-[250px] bg-[#8B80FF]
                    flex flex-col transition-transform duration-300 
                    ${open ? "translate-y-0" : "-translate-y-full"}
                    sm:translate-y-0 sm:static
                `}
            >
                <div className="flex flex-row gap-2.5 items-center border-b-2 border-white py-2.5 justify-center">
                    <Image alt="logo" src="/logo.png" width={42} height={32} />
                    <h1 className="font-bold text-2xl text-white">SIJA 1</h1>
                </div>

                <Tab
                    href={`/dashboard/${uuid}`}
                    id="home"
                    textStyle="text-black"
                    src="/dashboard.png"
                    isi="Home"
                    className={`${active === "home" ? "brightness-0" : "brightness-100"}`}
                />
                {(role?.toLowerCase() === 'bendahara' || role?.toLowerCase() === 'developer') && (
                    <>
                        <Tab 
                            href={`/dashboard/${uuid}/anggota-kelas`}
                            id="anggota-kelas"
                            src="/favicon.ico" 
                            isi="Anggota Kelas" 
                            textStyle="text-white" />
                        <Tab 
                            href={`/dashboard/${uuid}/kelola-kas`}
                            id="kelola-kas"
                            src="/kelola-kas.png" 
                            isi="Kelola Kas" 
                            textStyle="text-white" />
                        <Tab 
                            href={`/dashboard/${uuid}/rekap-kas`}
                            id="rekap-kas"
                            src="/rekap-kas.png" 
                            isi="Rekap Kas" 
                            textStyle="text-white" />
                    </>
                )}
                <Tab
                    href={`/dashboard/${uuid}/notifikasi`}
                    id="notifikasi"
                    textStyle="text-black"
                    src="/notifikasi.png"
                    isi="notifikasi"
                />
                {role?.toLocaleLowerCase() === "developer" && (
                    <>
                        <Tab 
                            href={`/dashboard/${uuid}/c3yr2ghie4t73r8`}
                            src={'/developer.png'}
                            isi="Maintenance"
                            textStyle="text-white"/>
                    </>
                )}
            </aside>
        </>
    )
}
