import Image from "next/image"
import Link from "next/link"
function Navbar(){
    function SubNav({isi}){
        return <Link href={"ror"} className="text-gray-700 font-bold text-3xl hover:text-[#8B80FF] transition-colors ease-in-out">{isi}</Link>
    }
    return (
        <div className="bg-[#DDD9FF] w-full fixed py-5 px-10 flex flex-row items-center justify-between">
            <Image 
                src={"/logo.png"}
                width={90}
                height={90}
                className="h-auto saturate-0 brightness-25"/>
            <div className="flex flex-row items-center gap-5">
                <SubNav isi={"Tentang Kelas"}/>
                <SubNav isi={"Jadwal Pelajaran"}/>
                <SubNav isi={"Ayo Kenalan"}/>
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
    return (
        <div className="flex flex-col gap-2">
            <Navbar />
            <div className="flex flex-row justify-between mt-32 px-5">
                <div className="flex flex-col gap-2.5">
                    <h1 className="font-bold text-gray-700 text-5xl">Selamat datang di kelas <span className="text-[#8B80FF]">X SIJA 1</span></h1>
                    <div className="flex flex-row gap-2.5 items-center">
                        <h1 className="text-gray-700 text-4xl">Kelas Paling</h1>
                        <RotatingText />
                    </div>
                </div>
            </div>
        </div>
    )
}