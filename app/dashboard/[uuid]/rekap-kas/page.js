'use client'
import { useState, useEffect } from "react"
import SideNav from "@/app/components/sideNav"
import { useParams } from "next/navigation"

export default function RekapKas() {
    const [rekap, setRekap] = useState({ data: [], summary: { totalMasuk: 0, totalKeluar: 0, saldo: 0 } })
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ keterangan: '', nominal: '', tanggal: '' })
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

    const fetchData = async () => {
        const res = await fetch('../../../api/kas/rekap')
        const data = await res.json()
        setRekap(data)
    }

    useEffect(() => { fetchData() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('../../../api/kas/rekap', {
            method: 'POST',
            body: JSON.stringify({ ...formData, tipe: 'keluar' })
        })

        if (res.ok) {
            setShowModal(false)
            setFormData({ keterangan: '', nominal: '', tanggal: '' })
            fetchData()
        }
    };
    
    const handleDeleteRekap = async (id) => {
        // Kasih konfirmasi dulu biar gak sengaja kehapus
        if (!confirm("Yakin mau hapus data rekap ini, bray?")) return;

        try {
            const res = await fetch('/api/kas/rekap', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                // Refresh data rekap setelah hapus
                fetchData(); 
                fetchData(namaBulanAktif);
            }
        } catch (err) {
            console.error("Gagal hapus rekap:", err);
        }
    };

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID').format(angka)
    }
    return (
        <div className="flex min-h-screen bg-background overflow-hidden">
            <SideNav active="rekap-kas" />
            
            <main className="w-full flex-1 p-8 mt-10 md:mt-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-500">Rekap Kas</h1>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-[#8B80FF] hover:bg-[#7a6fff] hover:cursor-pointer text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md"
                    >
                        + Tambah Pengeluaran
                    </button>
                </div>

                {/* Ringkasan Saldo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Total Pemasukan</p>
                        <h3 className="text-2xl font-bold text-green-600">Rp {formatRupiah(rekap.summary.totalMasuk)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                        <p className="text-gray-500 text-sm">Total Pengeluaran</p>
                        <h3 className="text-2xl font-bold text-red-600">Rp {formatRupiah(rekap.summary.totalKeluar)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Saldo Akhir</p>
                        <h3 className="text-2xl font-bold text-blue-600">Rp {formatRupiah(rekap.summary.saldo)}</h3>
                    </div>
                </div>

                {/* Tabel Transaksi */}
                <div className="bg-white rounded-xl shadow-sm overflow-y-scroll h-[600px]">
                    <table className="w-full text-left">
                        <thead className="bg-[#8B88FF]">
                            <tr>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Keterangan</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Nominal</th>
                                    <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rekap.data.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="p-4 font-medium text-gray-600">{item.keterangan}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.tipe === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.tipe.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className={`p-4 font-bold ${item.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.tipe === 'masuk' ? '+' : '-'} Rp {item.nominal.toLocaleString()}
                                    </td>
                                    {role?.toLowerCase() == "bendahara" && (
                                        <td className="p-4"><button className="bg-red-100 text-red-600 hover:cursor-pointer hover:bg-red-300 py-3 px-4 rounded" onClick={() => handleDeleteRekap(item.id)}>Delete</button></td>   
                                    )}
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            {/* --- MODAL FORM --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-999 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Catat Pengeluaran</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Keterangan</label>
                                <input 
                                    type="text" placeholder="Contoh: Beli Sapu & Pel" 
                                    className="w-full border p-2.5 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required
                                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Nominal (Rp)</label>
                                <input 
                                    type="number" placeholder="Contoh: 25000" 
                                    className="w-full border p-2.5 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" required
                                    onChange={(e) => setFormData({...formData, nominal: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Tanggal</label>
                                <input 
                                    type="date" className="w-full border p-2.5 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required
                                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 shadow-md transition-all"
                                >
                                    Simpan Pengeluaran
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}