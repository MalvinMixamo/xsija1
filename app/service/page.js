export default function Servis(){
    return(
        <div className="select-none">
            <div className="bg-purple-800 h-screen flex flex-col gap-16 justify-center items-center">
                <p className="text-xl font-bold">SIJA 1</p>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-5xl font-bold ">Webnya baru diperbaiki</p>
                    <p className="text-center w-[420px]">Developer sedang memperbaiki web ini, silahkan hubungi developer untuk mengkonfirmasi jika ini bukan error</p>
                    <img src="/maintenance.png" alt=""  width={500} className="mt-10"/>
                </div>
            </div>
        </div>
    )
}