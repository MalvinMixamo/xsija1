import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

export function ModalEditProfil({ isOpen, onClose, profil, onRefresh }){
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        absen: '',
        nama: '',
        password: '',
        nis: '',
        jabatan: '',
        instagram: '',
        picture: '',
        uuid: ''
    })
    useEffect(() => {
        if(profil){
            setFormData({
                absen: profil.id_siswa || '',
                nama: profil.nama || '',
                password: profil.password || '',
                nis: profil.nisn || '',
                jabatan: profil.jabatan || '',
                instagram: profil.instagram || '',
                picture: profil.picture || '',
                uuid: profil.uuid || ''
            })
        }
    }, [profil])

    if(!isOpen) return null

    const handleChange = (e) => {
        const { name, value, type, files } = e.target
        
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        })
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        let base64Image = formData.picture;
        if (formData.profil instanceof File) {
            base64Image = await convertToBase64(formData.profil);
        }

        const res = await fetch(`/api/siswa/${profil.uuid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, picture: base64Image }),
        });
        if(res.ok){
            alert('data berhasil diupdate')
            onRefresh()
            onClose()
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#8B80FF] border border-purple-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Profil</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
        <label className="text-xs font-semibold text-white uppercase">Nama</label>
            <input title="Hummm, developer masih bingung, ni nama boleh diganti atau ngga, sementara ngga dulu dah" name="nama" value={formData.nama} onChange={handleChange} disabled readOnly className="cursor-not-allowed w-full bg-[#655cc9] border border-white p-2.5 rounded-lg text-gray-400 focus:border-yellow-500 outline-none transition" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white uppercase">Password</label>
            <div className=" bg-[#655cc9] border border-white p-2.5 rounded-lg text-white focus:border-yellow-500 outline-none transition flex justify-between">
                <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="w-100% focus:outline-0" />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:cursor-pointer"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                    ) : (
                        <Eye className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                    )}
                </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-white uppercase">NIS</label>
            <input name="nis" value={formData.nis} onChange={handleChange} rows="3" readOnly disabled title="Jangan diubah NIS nya, bentrok nanti!" className="cursor-not-allowed w-full bg-[#655cc9] border border-white p-2.5 rounded-lg text-gray-400 focus:border-yellow-500 outline-none transition" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white uppercase">Role</label>
            <input title="Kamu tidak bisa mengubah role mu sendiri!" name="jabatan" type="text" disabled readOnly value={formData.jabatan} onChange={handleChange} className="cursor-not-allowed w-full bg-[#655cc9] border border-white p-2.5 rounded-lg text-gray-400 focus:border-yellow-500 outline-none transition select-none" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-white uppercase">Instagram</label>
            <input name="instagram" type="text" value={formData.instagram} onChange={handleChange} className="w-full bg-[#655cc9] border border-white p-2.5 rounded-lg text-white focus:border-yellow-500 outline-none transition" />
          </div>
        <div className="space-y-1">
            <label className="text-xs font-semibold text-white uppercase">Profil</label>
            <input title="Fitur profil masih belum tersedia. Tunggu sampai developer bisa membuatnya" name="profil" type="file" onChange={handleChange} readOnly disabled className="w-full bg-[#655cc9] border border-white p-2.5 rounded-lg cursor-not-allowed text-gray-400 focus:border-yellow-500 outline-none transition" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white uppercase">UUID</label>
            <input title="Jangan coba coba mengubah uuid nya ye!" name="uuid" value={formData.uuid} readOnly disabled onChange={handleChange} className="cursor-not-allowed w-full bg-[#655cc9] border border-white p-2.5 rounded-lg text-gray-400 focus:border-yellow-500 outline-none transition select-none" />
          </div>
          <div className="md:col-span-2 mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 text-white hover:text-yellow-500 cursor-pointer font-medium transition">
              Batal
            </button>
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer font-bold px-8 py-2 rounded-lg transition-transform active:scale-95">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}


export default function ProfileCard({src, jabatan, nama, instagram, loading, className }){
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [profil, setProfil] = useState(null)
    const params = useParams()
    const uuid = params.uuid
    
    const openEditModal = (profil) => {
        setProfil(profil)
        setIsModalOpen(true)
    }
    const fetchProfil = async () => {
        const res = await fetch(`/api/siswa/${uuid}`)
        const data = await res.json()
        setProfil(data)
        // setLoading(false)
    }
    console.log(profil)
    useEffect(() => {fetchProfil()}, [])

    return(
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
                            src={src === "" || src === null ? "/globe.svg" : `/uploads/${src}`}
                            width={50}
                            height={50}
                            unoptimized={src?.startsWith('data:')}
                            className="h-15 w-15 hrink-0 overflow-hidden rounded-full object-cover border border-gray-200" />
                        <div className="flex flex-col justify-center min-w-0">
                            <p className="font-medium text-sm md:text-lg text-gray-600 leading-tight">{nama}</p>
                            <Link 
                                href={instagram}
                                target="_blank" 
                                className="truncate max-w-48 md:max-w-full min-w-0 block text-[#6f5ffd] text-xs md:text-base leading-tight" 
                            >
                                {instagram}
                            </Link>
                        </div>
                    </div>
                    <button onClick={() => openEditModal(profil)}>
                        <svg fill="#8B80FF" width="35px" height="35px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="bg-white text-[#8B80FF] rounded-full h-16 w-16 cursor-pointer text-center px-3 hover:bg-[#8B80FF] hover:fill-white border-2 border-purple-500   ">
                            <path d="M17.764,2A4.2,4.2,0,0,0,14.77,3.241L3.155,14.855a1,1,0,0,0-.28.55l-.863,5.438a1,1,0,0,0,1.145,1.145L8.6,21.125a1,1,0,0,0,.55-.28L20.759,9.23a4.236,4.236,0,0,0-3-7.23ZM7.96,19.2,4.2,19.8l.6-3.757,8.39-8.391,3.162,3.162ZM19.345,7.816,17.765,9.4,14.6,6.235l1.581-1.58a2.289,2.289,0,0,1,3.161,0,2.234,2.234,0,0,1,0,3.161Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            {profil && (
                <ModalEditProfil 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    profil={profil}
                    onRefresh={fetchProfil}
                />
            )}
        </div>
    )
}