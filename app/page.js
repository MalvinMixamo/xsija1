'use client'
import Image from "next/image"
import Link from "next/link"
import { NextResponse } from "next/server"
import { useEffect } from "react"
function Navbar(){
    function SubNav({isi, to}){
        return <Link href={to} className="text-gray-700 font-bold text-3xl hover:text-[#8B80FF] hover:scale-110 transition-all duration-200 ease-in-out">{isi}</Link>
    }
    return (
        <div className="bg-[#DDD9FF] w-full fixed py-5 px-10 flex flex-row items-center justify-between">
            <Image 
                src={"/logo.png"}
                width={90}
                height={90}
                className="h-auto saturate-0 brightness-25"/>
            <div className="flex flex-row items-center gap-5">
                <SubNav isi={"Tentang Kelas"} to={''}/>
                <SubNav isi={"Jadwal Pelajaran"} to={''}/>
                <SubNav isi={"Ayo Kenalan"} to={''}/>
                <Link href="/login" className="py-2 px-10 bg-[#8B80FF] rounded-full text-2xl shadow-md text-gray-50 font-bold">Login</Link>
            </div>
        </div>
    )
}
export default function LandingPage(){
    function RotatingText(){
        return(
            <ul className="flex flex-col font-bold text-white text-4xl bg-[#8B80FF] px-5 rounded-2xl h-12 gap-5 overflow-hidden">
                <div className="h-full py-3 gap-3 flex flex-col rotate-text">
                    <li>Unggul SDM</li>
                    <li>Berteknologi</li>
                    <li>Kritis</li>
                </div>
            </ul>
        )
    }
    const dataSiswa = async(e) => {
        try{
            const response = await fetch('/api/siswa', {
                method: 'GET', 
                headers: {
                    "Content-Type": "application/json",
                },

            })
            const data = await response.json()
            console.log(data)
            if (!data) {
                console.warn("Cannot connect server");
            }

        }catch(err){
            
        }
    }
    useEffect(()=> {dataSiswa()}, [])
    return (
        <div className="flex flex-col gap-2">
            <Navbar />
            <div className="flex flex-row mt-32 px-5 w-full justify-center">
                <div className="flex flex-col gap-2.5 justify-center">
                    <h1 className="font-bold text-gray-700 text-5xl text-center">Selamat datang di kelas <span className="text-[#8B80FF]">X SIJA 1</span></h1>
                    <div className="flex flex-row gap-2.5 items-center justify-center">
                        <h1 className="text-gray-700 text-4xl">Kelas Paling</h1>
                        <RotatingText />
                    </div>
                    <div className="w-full flex justify-center">
                        <p className="w-1/2 text-center text-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, sapiente dolor. Possimus cumque molestiae, tempora, perferendis itaque fuga ipsa consequuntur quisquam natus commodi, est optio? Dignissimos qui amet impedit harum nulla aliquid. Delectus adipisci dicta repudiandae culpa et, quo ipsum quam, distinctio, rem deserunt exercitationem!</p>
                    </div>
                    
                </div>
                
            </div>
        </div>
    )
}