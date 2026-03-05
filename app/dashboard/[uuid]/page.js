'use client'
import SideNav from "../../components/sideNav"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileCard from "@/app/components/profileCard"
import LoadingPage from "@/app/components/loading"

function Home({ nama, jabatan, className, src, instagram}){
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [profil, setProfil] = useState(null)
    const params = useParams()
    const uuid = params.uuid
    
    const openEditModal = (profil) => {
        setProfil(profil)
        setIsModalOpen(true)
    }

    const fetchProfil = async() => {
        const res = await fetch(`/api/siswa/${uuid}`)
        const data = await res.json()
        setProfil(data)
    }
    useEffect(() => {fetchProfil()}, [uuid]);
    return(
        <div className="grid gap-3 md:gap-3 grid-cols-12 transition-all mt-14 md:mt-0">
            <ProfileCard
                src={src}
                jabatan={jabatan}
                nama={nama}
                instagram={instagram}
            />
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
    const [open, setOpen] = useState(false)

    console.log(dataSiswa)
    const fetchProfil = async() => {
        const res = await fetch(`/api/siswa/${uuid}`)
        if(!res.ok){
            router.push('/login')
        }
        const data = await res.json()
        setLoading(false)
        setDataSiswa(data)
    }
    useEffect(() => {fetchProfil()}, [uuid, router]);

    if (loading) {
        return (<LoadingPage />)
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
                    src={`/uploads/${dataSiswa.picture}` || '/globe.svg'}
                    instagram={dataSiswa.instagram == null ? "" : `${dataSiswa.instagram}`}/>
                    
            </div>
        </div>
    )
}
